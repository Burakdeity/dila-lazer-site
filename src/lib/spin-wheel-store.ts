import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import {
  DEFAULT_SPIN_SEGMENTS,
  type SpinResult,
  type SpinSegment,
  type SpinWheelConfig,
  type SpinWheelStatus,
} from "@/types/spin-wheel";

function parseSegments(raw: unknown): SpinSegment[] {
  if (!Array.isArray(raw) || raw.length < 2) return DEFAULT_SPIN_SEGMENTS;
  return raw as SpinSegment[];
}

export async function getSpinWheelConfig(): Promise<SpinWheelConfig> {
  const row = await prisma.spinWheelSettings.findUnique({ where: { id: "default" } });
  if (!row) {
    await prisma.spinWheelSettings.create({
      data: {
        id: "default",
        isActive: true,
        cooldownHours: 24,
        couponValidDays: 7,
        segments: DEFAULT_SPIN_SEGMENTS as unknown as Prisma.InputJsonValue,
      },
    });
    return {
      isActive: true,
      cooldownHours: 24,
      couponValidDays: 7,
      segments: DEFAULT_SPIN_SEGMENTS,
    };
  }
  return {
    isActive: row.isActive,
    cooldownHours: row.cooldownHours,
    couponValidDays: row.couponValidDays,
    segments: parseSegments(row.segments),
  };
}

export async function updateSpinWheelConfig(
  partial: Partial<SpinWheelConfig>
): Promise<SpinWheelConfig> {
  const current = await getSpinWheelConfig();
  const updated = {
    ...current,
    ...partial,
    segments: partial.segments ?? current.segments,
  };
  await prisma.spinWheelSettings.upsert({
    where: { id: "default" },
    create: {
      id: "default",
      isActive: updated.isActive,
      cooldownHours: updated.cooldownHours,
      couponValidDays: updated.couponValidDays,
      segments: updated.segments as unknown as Prisma.InputJsonValue,
    },
    update: {
      isActive: updated.isActive,
      cooldownHours: updated.cooldownHours,
      couponValidDays: updated.couponValidDays,
      segments: updated.segments as unknown as Prisma.InputJsonValue,
    },
  });
  return updated;
}

export async function getLastSpin(userId: string) {
  return prisma.spinWheelSpin.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export function getNextSpinAt(lastSpinAt: Date, cooldownHours: number): Date {
  return new Date(lastSpinAt.getTime() + cooldownHours * 60 * 60 * 1000);
}

export async function getSpinWheelStatus(userId?: string): Promise<SpinWheelStatus> {
  const config = await getSpinWheelConfig();

  if (!userId) {
    return {
      isActive: config.isActive,
      isLoggedIn: false,
      canSpin: false,
      nextSpinAt: null,
      segments: config.segments,
      cooldownHours: config.cooldownHours,
    };
  }

  const lastSpin = await getLastSpin(userId);
  let canSpin = config.isActive;
  let nextSpinAt: string | null = null;

  if (lastSpin) {
    const next = getNextSpinAt(lastSpin.createdAt, config.cooldownHours);
    if (next > new Date()) {
      canSpin = false;
      nextSpinAt = next.toISOString();
    }
  }

  return {
    isActive: config.isActive,
    isLoggedIn: true,
    canSpin: canSpin && config.isActive,
    nextSpinAt,
    segments: config.segments,
    cooldownHours: config.cooldownHours,
  };
}

function pickSegmentIndex(segments: SpinSegment[]): number {
  const totalWeight = segments.reduce((sum, s) => sum + (s.weight || 1), 0);
  let roll = Math.random() * totalWeight;
  for (let i = 0; i < segments.length; i++) {
    roll -= segments[i].weight || 1;
    if (roll <= 0) return i;
  }
  return segments.length - 1;
}

async function assignSpinCoupon(
  userId: string,
  code: string,
  discountPercent: number,
  validDays: number
): Promise<{ expiresAt: Date }> {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + validDays);

  const existing = await prisma.userWalletCoupon.findFirst({
    where: {
      userId,
      code,
      usedAt: null,
      expiresAt: { gt: new Date() },
    },
    orderBy: { expiresAt: "desc" },
  });

  if (existing) {
    const extended = new Date(existing.expiresAt);
    extended.setDate(extended.getDate() + validDays);
    await prisma.userWalletCoupon.update({
      where: { id: existing.id },
      data: { expiresAt: extended },
    });
    return { expiresAt: extended };
  }

  await prisma.userWalletCoupon.create({
    data: {
      userId,
      code,
      discountType: "percent",
      discountValue: discountPercent,
      minOrder: 0,
      expiresAt,
      source: "spin_wheel",
    },
  });

  return { expiresAt };
}

export async function executeSpin(userId: string): Promise<SpinResult> {
  const config = await getSpinWheelConfig();

  if (!config.isActive) {
    throw new Error("Çark şu anda aktif değil");
  }

  const status = await getSpinWheelStatus(userId);
  if (!status.canSpin) {
    throw new Error("Çevirme hakkınız henüz dolmadı");
  }

  const segmentIndex = pickSegmentIndex(config.segments);
  const segment = config.segments[segmentIndex];

  let couponCode: string | null = null;
  let couponExpiresAt: string | null = null;
  let message = segment.label;

  if (segment.type === "discount" && segment.couponCode && segment.discountPercent) {
    const assigned = await assignSpinCoupon(
      userId,
      segment.couponCode,
      segment.discountPercent,
      config.couponValidDays
    );
    couponCode = segment.couponCode;
    couponExpiresAt = assigned.expiresAt.toISOString();
    message = `Tebrikler! %${segment.discountPercent} indirim kazandınız. Kupon: ${segment.couponCode}`;
  } else if (segment.type === "retry") {
    message = "Bu sefer olmadı. 24 saat sonra tekrar deneyin!";
  }

  await prisma.spinWheelSpin.create({
    data: {
      userId,
      segmentIndex,
      prizeType: segment.type,
      prizeLabel: segment.label,
      couponCode,
    },
  });

  return {
    segmentIndex,
    prizeType: segment.type,
    prizeLabel: segment.label,
    couponCode,
    couponExpiresAt,
    message,
  };
}

export async function getSpinWinners(limit = 50) {
  return prisma.spinWheelSpin.findMany({
    where: { couponCode: { not: null } },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
  });
}

export async function getSpinStats() {
  const [totalSpins, totalWinners, todaySpins] = await Promise.all([
    prisma.spinWheelSpin.count(),
    prisma.spinWheelSpin.count({ where: { couponCode: { not: null } } }),
    prisma.spinWheelSpin.count({
      where: {
        createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      },
    }),
  ]);
  return { totalSpins, totalWinners, todaySpins };
}
