export interface PriceConfig {
  basePrice: number;
  width: number;
  height: number;
  material: string;
  color: string;
  quantity?: number;
}

const MATERIAL_MULTIPLIERS: Record<string, number> = {
  pleksi: 1,
  mdf: 0.8,
  "kutu-harf": 1.4,
  led: 1.6,
  neon: 2.2,
  "3d": 2.5,
  elektronik: 1,
};

const COLOR_PREMIUM: Record<string, number> = {
  beyaz: 1,
  kirmizi: 1,
  mavi: 1.05,
  yesil: 1.05,
  mor: 1.1,
  altin: 1.25,
  rgb: 1.5,
};

export function calculatePrice(config: PriceConfig): number {
  const area = (config.width * config.height) / 10000;
  const materialMul = MATERIAL_MULTIPLIERS[config.material] ?? 1;
  const colorMul = COLOR_PREMIUM[config.color] ?? 1;
  const qty = config.quantity ?? 1;

  const unitPrice = config.basePrice * (1 + area * 0.8) * materialMul * colorMul;
  return Math.round(unitPrice * qty);
}

export function calculateInstallments(price: number, months = 12): { monthly: number; total: number } {
  const rate = 0.0199;
  const monthly = price * (rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
  return {
    monthly: Math.round(monthly),
    total: Math.round(monthly * months),
  };
}

export function calculateLoyaltyDiscount(tier: string, price: number): number {
  const discounts: Record<string, number> = {
    BRONZE: 0.02,
    SILVER: 0.05,
    GOLD: 0.08,
    PLATINUM: 0.12,
  };
  return Math.round(price * (discounts[tier] ?? 0));
}
