"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CreditCard,
  Building2,
  Shield,
  Banknote,
  Wallet,
  Loader2,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { FREE_SHIPPING_THRESHOLD } from "@/components/cart/free-shipping-bar";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import type { PaymentMethodConfig, PaymentProvider } from "@/types/admin";

const SHIPPING_FEE = 150;

const carriers = [
  { id: "yurtici", name: "Yurtiçi Kargo" },
  { id: "aras", name: "Aras Kargo" },
  { id: "mng", name: "MNG Kargo" },
  { id: "surat", name: "Sürat Kargo" },
];

const PROVIDER_ICONS: Record<PaymentProvider, typeof CreditCard> = {
  paytr: CreditCard,
  iyzico: Wallet,
  stripe: CreditCard,
  havale: Banknote,
  kapida: Building2,
};

async function startPayment(
  provider: PaymentProvider,
  payload: { amount: number; orderId: string; email?: string }
): Promise<{ redirectUrl?: string; demo?: boolean; error?: string }> {
  const endpoints: Partial<Record<PaymentProvider, string>> = {
    paytr: "/api/payments/paytr",
    iyzico: "/api/payments/iyzico",
    stripe: "/api/payments/stripe",
  };

  const url = endpoints[provider];
  if (!url) return {};

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      amount: payload.amount,
      orderId: payload.orderId,
      email: payload.email,
      buyer: { email: payload.email },
    }),
  });

  const data = await res.json();
  if (!res.ok && !data.demo) {
    return { error: data.error || "Ödeme başlatılamadı" };
  }

  if (data.url) return { redirectUrl: data.url, demo: data.demo };
  if (data.iframeUrl) return { redirectUrl: data.iframeUrl, demo: data.demo };
  if (data.paymentPageUrl) return { redirectUrl: data.paymentPageUrl, demo: data.demo };

  return { demo: data.demo };
}

export default function CheckoutPage() {
  const { items, subtotal, appliedCoupon, discountAmount, clearCart } = useCartStore();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodConfig[]>([]);
  const [loadingMethods, setLoadingMethods] = useState(true);
  const [payment, setPayment] = useState("");
  const [carrier, setCarrier] = useState("yurtici");
  const [completing, setCompleting] = useState(false);
  const [payError, setPayError] = useState("");

  const total = subtotal();
  const discount = discountAmount();
  const shipping = total >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const grandTotal = Math.max(0, total - discount) + shipping;

  const selectedMethod = paymentMethods.find((m) => m.id === payment);

  useEffect(() => {
    fetch("/api/payments/methods")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setPaymentMethods(data);
          setPayment(data[0].id);
        }
      })
      .finally(() => setLoadingMethods(false));
  }, []);

  const completeOrder = async () => {
    if (!selectedMethod) return;
    setCompleting(true);
    setPayError("");

    try {
      if (appliedCoupon) {
        await fetch("/api/coupons/redeem", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: appliedCoupon.code }),
        });
      }

      const orderId = `SIP-${Date.now()}`;
      const provider = selectedMethod.provider;

      if (provider === "havale" || provider === "kapida") {
        clearCart();
        window.location.href = `/hesabim/siparisler?success=true&order=${orderId}&payment=${provider}`;
        return;
      }

      const result = await startPayment(provider, {
        amount: grandTotal,
        orderId,
      });

      if (result.error) {
        setPayError(result.error);
        setCompleting(false);
        return;
      }

      if (result.redirectUrl && !result.demo) {
        clearCart();
        window.location.href = result.redirectUrl;
        return;
      }

      clearCart();
      window.location.href = `/hesabim/siparisler?success=true&order=${orderId}&demo=1`;
    } catch {
      setPayError("Bir hata oluştu. Lütfen tekrar deneyin.");
      setCompleting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="pt-24 pb-20 bg-white min-h-screen">
        <Container className="text-center py-20">
          <p className="text-gray-500 mb-4">Sepetiniz boş</p>
          <Link href="/urunler">
            <Button>Alışverişe Başla</Button>
          </Link>
        </Container>
      </div>
    );
  }

  return (
    <div className="pt-24 lg:pt-32 pb-20 bg-white min-h-screen">
      <Container size="narrow">
        <h1 className="text-3xl font-bold text-brand-black mb-8">Ödeme</h1>

        <div className="space-y-6">
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-brand-black mb-4">Teslimat Adresi</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {["Ad Soyad", "Telefon", "Şehir", "İlçe"].map((label) => (
                <input key={label} placeholder={label} className="form-input w-full" />
              ))}
              <input placeholder="Adres" className="form-input w-full sm:col-span-2" />
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-brand-black mb-4">Kargo Firması</h2>
            <div className="grid grid-cols-2 gap-3">
              {carriers.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCarrier(c.id)}
                  className={`p-4 rounded-xl text-sm transition-colors ${
                    carrier === c.id
                      ? "bg-brand-red text-white"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-brand-black mb-4">Ödeme Yöntemi</h2>
            {loadingMethods ? (
              <div className="flex items-center gap-2 text-gray-400 py-4">
                <Loader2 className="h-4 w-4 animate-spin" />
                Yükleniyor…
              </div>
            ) : paymentMethods.length === 0 ? (
              <p className="text-sm text-gray-500">Ödeme yöntemi tanımlı değil.</p>
            ) : (
              <div className="space-y-3">
                {paymentMethods.map((m) => {
                  const Icon = PROVIDER_ICONS[m.provider] ?? CreditCard;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPayment(m.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl transition-colors border ${
                        payment === m.id
                          ? "bg-brand-red/10 border-brand-red/30"
                          : "bg-gray-50 border-transparent hover:bg-gray-100"
                      }`}
                    >
                      <Icon className="h-5 w-5 text-gray-500 shrink-0" />
                      <div className="text-left">
                        <p className="text-brand-black font-medium">{m.name}</p>
                        <p className="text-xs text-gray-400">{m.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {selectedMethod?.provider === "havale" && selectedMethod.iban && (
              <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200 text-sm">
                <p className="font-semibold text-brand-black mb-2">Havale bilgileri</p>
                {selectedMethod.bankName && (
                  <p className="text-gray-600">
                    <span className="text-gray-400">Banka:</span> {selectedMethod.bankName}
                  </p>
                )}
                {selectedMethod.accountHolder && (
                  <p className="text-gray-600">
                    <span className="text-gray-400">Alıcı:</span> {selectedMethod.accountHolder}
                  </p>
                )}
                <p className="font-mono text-brand-black mt-1">{selectedMethod.iban}</p>
                {selectedMethod.instructions && (
                  <p className="text-gray-500 mt-2 text-xs">{selectedMethod.instructions}</p>
                )}
              </div>
            )}
          </div>

          <div className="glass-card p-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Ara Toplam</span>
              <span className="text-brand-black">{formatPrice(total)}</span>
            </div>
            {appliedCoupon && discount > 0 && (
              <div className="flex justify-between text-sm text-emerald-600">
                <span>Kupon ({appliedCoupon.code})</span>
                <span>-{formatPrice(discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Kargo</span>
              <span className="text-brand-black">
                {shipping === 0 ? "Ücretsiz" : formatPrice(shipping)}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-200">
              <span className="text-gray-500">Toplam</span>
              <span className="text-2xl font-bold text-brand-black">{formatPrice(grandTotal)}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400 pt-2 mb-2">
              <Shield className="h-3.5 w-3.5" />
              256-bit SSL ile güvenli ödeme
            </div>
            {payError && (
              <p className="text-sm text-red-500 mb-2">{payError}</p>
            )}
            <Button
              size="lg"
              className="w-full"
              onClick={completeOrder}
              disabled={completing || !selectedMethod}
            >
              <Building2 className="h-4 w-4" />
              {completing ? "İşleniyor…" : "Siparişi Tamamla"}
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
