import { createHmac } from "crypto";

export type PaytrConfig = {
  merchantId: string;
  merchantKey: string;
  merchantSalt: string;
};

export function getPaytrConfig(): PaytrConfig | null {
  const merchantId = process.env.PAYTR_MERCHANT_ID?.trim();
  const merchantKey = process.env.PAYTR_MERCHANT_KEY?.trim();
  const merchantSalt = process.env.PAYTR_MERCHANT_SALT?.trim();
  if (!merchantId || !merchantKey || !merchantSalt) return null;
  return { merchantId, merchantKey, merchantSalt };
}

export function isPaytrConfigured(): boolean {
  return getPaytrConfig() !== null;
}

export function getAppUrl(): string {
  return (process.env.NEXT_PUBLIC_APP_URL || "https://dilalazer.com").replace(/\/$/, "");
}

/** PayTR merchant_oid: alfanumerik, max 64 karakter */
export function generateMerchantOid(): string {
  return `DL${Date.now()}${Math.floor(Math.random() * 10000)}`;
}

export function buildPaytrToken(params: {
  merchantId: string;
  merchantKey: string;
  merchantSalt: string;
  userIp: string;
  merchantOid: string;
  email: string;
  paymentAmount: number;
  userBasket: string;
  noInstallment?: number;
  maxInstallment?: number;
  currency?: string;
  testMode?: number;
}): string {
  const {
    merchantId,
    merchantKey,
    merchantSalt,
    userIp,
    merchantOid,
    email,
    paymentAmount,
    userBasket,
    noInstallment = 0,
    maxInstallment = 0,
    currency = "TL",
    testMode = 0,
  } = params;

  const hashStr =
    `${merchantId}${userIp}${merchantOid}${email}${paymentAmount}` +
    `${userBasket}${noInstallment}${maxInstallment}${currency}${testMode}`;

  return createHmac("sha256", merchantKey)
    .update(hashStr + merchantSalt)
    .digest("base64");
}

export type PaytrBasketItem = { name: string; unitPrice: number; quantity: number };

function basketTotalTl(items: PaytrBasketItem[]): number {
  return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
}

/** PayTR sepet toplamı payment_amount ile birebir eşleşmeli (indirim dahil). */
export function normalizeBasketForPaytr(
  items: PaytrBasketItem[],
  shipping: number,
  targetAmountTl: number
): PaytrBasketItem[] {
  const basket = [...items];
  if (shipping > 0 && !basket.some((item) => item.name === "Kargo")) {
    basket.push({ name: "Kargo", unitPrice: shipping, quantity: 1 });
  }

  if (Math.abs(basketTotalTl(basket) - targetAmountTl) < 0.01) {
    return basket;
  }

  return [{ name: "Siparis Toplami", unitPrice: targetAmountTl, quantity: 1 }];
}

export function buildUserBasket(
  items: Array<{ name: string; price: number; quantity: number }>
): string {
  const basket = items.map((item) => [
    item.name.slice(0, 128),
    item.price.toFixed(2),
    item.quantity,
  ]);
  return Buffer.from(JSON.stringify(basket)).toString("base64");
}

export function verifyPaytrCallback(
  merchantKey: string,
  merchantSalt: string,
  callback: {
    merchant_oid: string;
    status: string;
    total_amount: string;
    hash: string;
  }
): boolean {
  const payload =
    callback.merchant_oid + merchantSalt + callback.status + callback.total_amount;
  const token = createHmac("sha256", merchantKey).update(payload).digest("base64");
  return token === callback.hash;
}

function pickClientIp(candidates: Array<string | null | undefined>): string | null {
  for (const raw of candidates) {
    const ip = raw?.split(",")[0]?.trim();
    if (ip && ip !== "127.0.0.1" && ip !== "::1") {
      return ip.slice(0, 39);
    }
  }
  return null;
}

export function getClientIp(request: Request): string {
  const devIp = process.env.PAYTR_DEV_IP?.trim();
  if (devIp && process.env.NODE_ENV !== "production") return devIp.slice(0, 39);

  const ip =
    pickClientIp([
      request.headers.get("cf-connecting-ip"),
      request.headers.get("x-vercel-forwarded-for"),
      request.headers.get("x-forwarded-for"),
      request.headers.get("x-real-ip"),
    ]) ?? "127.0.0.1";

  return ip;
}

export function tlToKurus(amount: number): number {
  return Math.round(amount * 100);
}
