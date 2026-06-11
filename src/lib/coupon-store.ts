import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import type { Coupon } from "@/types/admin";

const COUPONS_PATH = path.join(process.cwd(), "data", "coupons.json");

const seedCoupons: Coupon[] = [
  {
    id: "1",
    code: "NEON20",
    discountType: "percent",
    discountValue: 20,
    minOrder: 1000,
    usageLimit: 100,
    usedCount: 34,
    isActive: true,
    expiresAt: "2025-12-31",
    createdAt: "2025-01-01T00:00:00.000Z",
  },
  {
    id: "2",
    code: "HOSGELDIN",
    discountType: "fixed",
    discountValue: 250,
    minOrder: 500,
    usageLimit: 500,
    usedCount: 128,
    isActive: true,
    expiresAt: "2025-09-30",
    createdAt: "2025-01-01T00:00:00.000Z",
  },
  {
    id: "3",
    code: "YAZ2025",
    discountType: "percent",
    discountValue: 15,
    usedCount: 0,
    isActive: false,
    expiresAt: "2025-08-31",
    createdAt: "2025-05-01T00:00:00.000Z",
  },
];

async function ensureCoupons(): Promise<Coupon[]> {
  try {
    const raw = (await fs.readFile(COUPONS_PATH, "utf-8")).trim();
    if (!raw) throw new Error("empty");
    const parsed = JSON.parse(raw) as Coupon[];
    if (!Array.isArray(parsed)) throw new Error("invalid");
    return parsed;
  } catch {
    await fs.mkdir(path.dirname(COUPONS_PATH), { recursive: true });
    await fs.writeFile(COUPONS_PATH, JSON.stringify(seedCoupons, null, 2), "utf-8");
    return [...seedCoupons];
  }
}

async function saveCoupons(coupons: Coupon[]): Promise<void> {
  await fs.mkdir(path.dirname(COUPONS_PATH), { recursive: true });
  await fs.writeFile(COUPONS_PATH, JSON.stringify(coupons, null, 2), "utf-8");
}

export async function getAllCoupons(): Promise<Coupon[]> {
  return ensureCoupons();
}

export async function createCoupon(
  data: Omit<Coupon, "id" | "usedCount" | "createdAt">
): Promise<Coupon> {
  const coupons = await ensureCoupons();
  if (coupons.some((c) => c.code.toUpperCase() === data.code.toUpperCase())) {
    throw new Error("CODE_EXISTS");
  }
  const coupon: Coupon = {
    ...data,
    code: data.code.toUpperCase(),
    id: randomUUID(),
    usedCount: 0,
    createdAt: new Date().toISOString(),
  };
  coupons.unshift(coupon);
  await saveCoupons(coupons);
  return coupon;
}

export async function updateCoupon(id: string, data: Partial<Coupon>): Promise<Coupon | null> {
  const coupons = await ensureCoupons();
  const index = coupons.findIndex((c) => c.id === id);
  if (index === -1) return null;
  coupons[index] = { ...coupons[index], ...data };
  await saveCoupons(coupons);
  return coupons[index];
}

export async function deleteCoupon(id: string): Promise<boolean> {
  const coupons = await ensureCoupons();
  const next = coupons.filter((c) => c.id !== id);
  if (next.length === coupons.length) return false;
  await saveCoupons(next);
  return true;
}
