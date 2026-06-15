import { prisma } from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";

export interface WalletCouponView {
  id: string;
  code: string;
  discountType: string;
  discountValue: number;
  minOrder: number | null;
  expiresAt: string;
  usedAt: string | null;
  source: string;
  createdAt: string;
  isValid: boolean;
}

function toView(coupon: {
  id: string;
  code: string;
  discountType: string;
  discountValue: Decimal;
  minOrder: Decimal | null;
  expiresAt: Date;
  usedAt: Date | null;
  source: string;
  createdAt: Date;
}): WalletCouponView {
  const now = new Date();
  const isValid = !coupon.usedAt && coupon.expiresAt > now;
  return {
    id: coupon.id,
    code: coupon.code,
    discountType: coupon.discountType,
    discountValue: Number(coupon.discountValue),
    minOrder: coupon.minOrder ? Number(coupon.minOrder) : null,
    expiresAt: coupon.expiresAt.toISOString(),
    usedAt: coupon.usedAt?.toISOString() ?? null,
    source: coupon.source,
    createdAt: coupon.createdAt.toISOString(),
    isValid,
  };
}

export async function getUserWalletCoupons(userId: string): Promise<WalletCouponView[]> {
  const coupons = await prisma.userWalletCoupon.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  return coupons.map(toView);
}

export async function validateUserCoupon(
  userId: string,
  code: string,
  orderSubtotal: number
): Promise<{ valid: true; coupon: WalletCouponView } | { valid: false; error: string }> {
  const normalized = code.trim().toUpperCase();
  const coupon = await prisma.userWalletCoupon.findFirst({
    where: {
      userId,
      code: normalized,
      usedAt: null,
      expiresAt: { gt: new Date() },
    },
    orderBy: { expiresAt: "desc" },
  });

  if (!coupon) {
    return { valid: false, error: "Geçersiz veya süresi dolmuş kupon" };
  }

  const view = toView(coupon);
  if (view.minOrder && orderSubtotal < view.minOrder) {
    return {
      valid: false,
      error: `Bu kupon minimum ${view.minOrder} TL sipariş için geçerlidir`,
    };
  }

  return { valid: true, coupon: view };
}

export function calculateDiscount(
  coupon: WalletCouponView,
  subtotal: number
): number {
  if (coupon.discountType === "percent") {
    return Math.round((subtotal * coupon.discountValue) / 100);
  }
  return Math.min(coupon.discountValue, subtotal);
}

export async function markUserCouponUsed(
  userId: string,
  code: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const normalized = code.trim().toUpperCase();
  const coupon = await prisma.userWalletCoupon.findFirst({
    where: {
      userId,
      code: normalized,
      usedAt: null,
      expiresAt: { gt: new Date() },
    },
    orderBy: { expiresAt: "desc" },
  });

  if (!coupon) {
    return { ok: false, error: "Geçerli kupon bulunamadı" };
  }

  await prisma.userWalletCoupon.update({
    where: { id: coupon.id },
    data: { usedAt: new Date() },
  });

  return { ok: true };
}
