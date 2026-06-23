import type { PaymentMethodConfig } from "@/types/admin";
import { getPaytrConfig } from "@/lib/paytr";
import { getSettings } from "@/lib/settings-store";

export async function getActivePaymentMethods(): Promise<PaymentMethodConfig[]> {
  const { paymentMethods } = await getSettings();
  const paytrReady = Boolean(getPaytrConfig());

  return [...paymentMethods]
    .filter((m) => {
      if (m.provider === "paytr" && !paytrReady) return false;
      return m.isActive;
    })
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getPaymentMethodById(id: string): Promise<PaymentMethodConfig | null> {
  const { paymentMethods } = await getSettings();
  return paymentMethods.find((m) => m.id === id && m.isActive) ?? null;
}

export function sortPaymentMethods(methods: PaymentMethodConfig[]): PaymentMethodConfig[] {
  return [...methods].sort((a, b) => a.sortOrder - b.sortOrder);
}
