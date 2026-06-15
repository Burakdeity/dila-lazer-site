import { createHmac } from "crypto";

export type PaytrConfig = {
  merchantId: string;
  merchantKey: string;
  merchantSalt: string;
};

export function getPaytrConfig(): PaytrConfig | null {
  const merchantId = process.env.PAYTR_MERCHANT_ID;
  const merchantKey = process.env.PAYTR_MERCHANT_KEY;
  const merchantSalt = process.env.PAYTR_MERCHANT_SALT;
  if (!merchantId || !merchantKey || !merchantSalt) return null;
  return { merchantId, merchantKey, merchantSalt };
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

export function getClientIp(request: Request): string {
  const devIp = process.env.PAYTR_DEV_IP;
  if (devIp && process.env.NODE_ENV !== "production") return devIp;

  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const ip = forwarded.split(",")[0]?.trim();
    if (ip) return ip.slice(0, 39);
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.slice(0, 39);

  return "127.0.0.1";
}

export function tlToKurus(amount: number): number {
  return Math.round(amount * 100);
}
