"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  CreditCard,
  Building2,
  Shield,
  Banknote,
  Wallet,
  Loader2,
  FileText,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { CheckoutSteps } from "@/components/checkout/checkout-steps";
import { OrderSummary } from "@/components/checkout/order-summary";
import { calcGrandTotal, calcShipping } from "@/lib/checkout";
import { useCartStore } from "@/store/cart";
import type { PaymentMethodConfig, PaymentProvider } from "@/types/admin";

const PROVIDER_ICONS: Record<PaymentProvider, typeof CreditCard> = {
  paytr: CreditCard,
  iyzico: Wallet,
  stripe: CreditCard,
  havale: Banknote,
  kapida: Building2,
};

async function startPayment(
  provider: PaymentProvider,
  payload: {
    orderNo: string;
    amount: number;
    email?: string;
    buyer?: {
      email?: string;
      name?: string;
      phone?: string;
      address?: string;
      city?: string;
    };
    items?: Array<{ name: string; unitPrice: number; quantity: number }>;
    shipping?: number;
  }
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
      orderNo: payload.orderNo,
      amount: payload.amount,
      email: payload.email,
      buyer: payload.buyer,
      items: payload.items,
      shipping: payload.shipping,
    }),
  });

  const data = await res.json();

  if (data.token) {
    return { redirectUrl: `/odeme/paytr?token=${data.token}`, demo: false };
  }

  if (!res.ok || data.error) {
    return { error: data.error || "Ödeme başlatılamadı" };
  }

  if (data.url) return { redirectUrl: data.url, demo: data.demo };
  if (data.iframeUrl) return { redirectUrl: data.iframeUrl, demo: data.demo };
  if (data.paymentPageUrl) return { redirectUrl: data.paymentPageUrl, demo: data.demo };

  return { error: "Ödeme oturumu oluşturulamadı" };
}

export default function CheckoutPage() {
  const { data: session } = useSession();
  const { items, subtotal, appliedCoupon, discountAmount, clearCart } = useCartStore();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodConfig[]>([]);
  const [loadingMethods, setLoadingMethods] = useState(true);
  const [payment, setPayment] = useState("");
  const [completing, setCompleting] = useState(false);
  const [payError, setPayError] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerCity, setCustomerCity] = useState("");
  const [customerDistrict, setCustomerDistrict] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [orderNotes, setOrderNotes] = useState("");

  const total = subtotal();
  const discount = discountAmount();
  const shipping = calcShipping(total);
  const grandTotal = calcGrandTotal(total, discount, shipping);

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

  useEffect(() => {
    if (session?.user?.email && !customerEmail) {
      setCustomerEmail(session.user.email);
    }
    if (session?.user?.name && !customerName) {
      setCustomerName(session.user.name);
    }
  }, [session, customerEmail, customerName]);

  const completeOrder = async () => {
    if (!selectedMethod) return;

    if (!customerName.trim() || !customerPhone.trim() || !customerEmail.trim() || !customerCity.trim() || !customerAddress.trim()) {
      setPayError("Lütfen teslimat bilgilerini eksiksiz doldurun.");
      return;
    }

    if (!termsAccepted) {
      setPayError("Devam etmek için sözleşmeleri onaylamalısınız.");
      return;
    }

    setCompleting(true);
    setPayError("");

    try {
      const buyer = {
        email: customerEmail.trim(),
        name: customerName.trim(),
        phone: customerPhone.trim(),
        address: `${customerAddress.trim()}${customerDistrict ? `, ${customerDistrict.trim()}` : ""}`,
        city: customerCity.trim(),
      };

      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            name: buyer.name,
            email: buyer.email,
            phone: buyer.phone,
            city: buyer.city,
            district: customerDistrict.trim() || undefined,
            address: customerAddress.trim(),
          },
          items: items.map((item) => ({
            productId: item.productId,
            name: item.name,
            slug: item.slug,
            image: item.image,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            size: item.size,
            material: item.material,
            color: item.color,
            customText: item.customText,
          })),
          subtotal: total,
          discount,
          couponCode: appliedCoupon?.code,
          shippingCost: shipping,
          paymentMethod: selectedMethod.provider,
          notes: orderNotes.trim() || undefined,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        setPayError(orderData.error || "Sipariş oluşturulamadı");
        setCompleting(false);
        return;
      }

      const orderNo = orderData.order.orderNo as string;
      const provider = selectedMethod.provider;

      if (appliedCoupon) {
        await fetch("/api/coupons/redeem", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: appliedCoupon.code }),
        });
      }

      if (provider === "havale" || provider === "kapida") {
        clearCart();
        window.location.href = `/siparis/onay?order=${orderNo}`;
        return;
      }

      const result = await startPayment(provider, {
        orderNo,
        amount: grandTotal,
        email: buyer.email,
        buyer,
        items: items.map((item) => ({
          name: item.name,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
        })),
        shipping,
      });

      if (result.error) {
        setPayError(result.error);
        setCompleting(false);
        return;
      }

      if (result.redirectUrl) {
        clearCart();
        window.location.href = result.redirectUrl;
        return;
      }

      setPayError(result.error || "Ödeme başlatılamadı. Lütfen tekrar deneyin.");
      setCompleting(false);
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
    <div className="pt-24 lg:pt-32 pb-20 bg-gray-50 min-h-screen">
      <Container>
        <CheckoutSteps current={2} />
        <h1 className="text-2xl sm:text-3xl font-bold text-brand-black mb-8">Ödeme</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold text-brand-black mb-4">Teslimat Bilgileri</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  placeholder="Ad Soyad *"
                  className="form-input w-full"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                />
                <input
                  placeholder="Telefon *"
                  className="form-input w-full"
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  required
                />
                <input
                  placeholder="E-posta *"
                  className="form-input w-full sm:col-span-2"
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  required
                />
                <input
                  placeholder="Şehir *"
                  className="form-input w-full"
                  value={customerCity}
                  onChange={(e) => setCustomerCity(e.target.value)}
                  required
                />
                <input
                  placeholder="İlçe"
                  className="form-input w-full"
                  value={customerDistrict}
                  onChange={(e) => setCustomerDistrict(e.target.value)}
                />
                <input
                  placeholder="Adres *"
                  className="form-input w-full sm:col-span-2"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold text-brand-black mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-gray-400" />
                Sipariş Notu
              </h2>
              <textarea
                placeholder="Montaj talebi, özel istek veya teslimat notu (isteğe bağlı)"
                className="form-input w-full min-h-[80px] resize-y"
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                maxLength={500}
              />
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
                  <p className="font-mono font-semibold text-brand-black mt-1 text-base tracking-wide break-all">
                    {selectedMethod.iban}
                  </p>
                  {selectedMethod.instructions && (
                    <p className="text-gray-500 mt-2 text-xs">{selectedMethod.instructions}</p>
                  )}
                </div>
              )}
            </div>

            <label className="flex items-start gap-3 cursor-pointer p-4 rounded-xl bg-white border border-gray-200">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-brand-red focus:ring-brand-red"
              />
              <span className="text-sm text-gray-600">
                <Link href="/iade-politikasi" className="text-brand-red hover:underline">
                  satış ve iade koşullarını
                </Link>{" "}
                ve{" "}
                <Link href="/gizlilik" className="text-brand-red hover:underline">
                  gizlilik politikasını
                </Link>{" "}
                okudum, kabul ediyorum.
              </span>
            </label>
          </div>

          <div className="space-y-4">
            <OrderSummary
              items={items}
              subtotal={total}
              discount={discount}
              shipping={shipping}
              grandTotal={grandTotal}
              appliedCoupon={appliedCoupon}
              className="lg:sticky lg:top-28"
            />

            {payError && (
              <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl p-3">
                {payError}
              </p>
            )}

            <Button
              size="lg"
              className="w-full"
              onClick={completeOrder}
              disabled={completing || !selectedMethod || !termsAccepted}
            >
              {completing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  İşleniyor…
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4" />
                  {selectedMethod?.provider === "paytr"
                    ? "Güvenli Ödemeye Geç"
                    : "Siparişi Tamamla"}
                </>
              )}
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
