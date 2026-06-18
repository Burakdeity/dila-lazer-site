"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag, X, Loader2 } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { FreeShippingBar } from "@/components/cart/free-shipping-bar";
import { CheckoutSteps } from "@/components/checkout/checkout-steps";
import { useCartStore } from "@/store/cart";
import { calcGrandTotal, calcShipping } from "@/lib/checkout";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { data: session } = useSession();
  const {
    items,
    couponCode,
    appliedCoupon,
    updateQuantity,
    removeItem,
    subtotal,
    discountAmount,
    clearCart,
    setCoupon,
    setAppliedCoupon,
  } = useCartStore();
  const [couponInput, setCouponInput] = useState(couponCode ?? "");
  const [couponError, setCouponError] = useState("");
  const [applying, setApplying] = useState(false);

  const total = subtotal();
  const discount = discountAmount();
  const shipping = calcShipping(total);
  const grandTotal = calcGrandTotal(total, discount, shipping);

  const applyCoupon = async () => {
    setCouponError("");
    if (!session?.user) {
      setCouponError("Kupon kullanmak için giriş yapmalısınız");
      return;
    }
    if (!couponInput.trim()) {
      setCouponError("Kupon kodu girin");
      return;
    }
    setApplying(true);
    try {
      const res = await fetch("/api/coupons/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponInput.trim(), subtotal: total }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCouponError(data.error || "Kupon uygulanamadı");
        return;
      }
      setAppliedCoupon({
        code: data.coupon.code,
        discountType: data.coupon.discountType,
        discountValue: data.coupon.discountValue,
      });
    } catch {
      setCouponError("Bağlantı hatası");
    } finally {
      setApplying(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    setCoupon("");
    setCouponError("");
  };

  if (items.length === 0) {
    return (
      <div className="pt-24 lg:pt-32 pb-20 bg-white min-h-screen">
        <Container className="text-center py-20">
          <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-brand-black mb-4">Sepetiniz Boş</h1>
          <p className="text-gray-500 mb-8">Premium neon çözümlerimizi keşfedin.</p>
          <Link href="/urunler">
            <Button size="lg">Ürünleri İncele</Button>
          </Link>
        </Container>
      </div>
    );
  }

  return (
    <div className="pt-24 lg:pt-32 pb-20 bg-gray-50 min-h-screen">
      <Container>
        <CheckoutSteps current={1} />
        <h1 className="text-2xl sm:text-3xl font-bold text-brand-black mb-6">
          Sepetim ({items.length} ürün)
        </h1>

        <FreeShippingBar subtotal={total} className="mb-6" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 rounded-xl bg-white border border-gray-200 shadow-sm"
              >
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="96px" />
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/urun/${item.slug}`}
                    className="text-brand-black font-medium hover:text-brand-red transition-colors line-clamp-2"
                  >
                    {item.name}
                  </Link>
                  {item.size && <p className="text-sm text-gray-400 mt-0.5">Ölçü: {item.size}</p>}
                  {item.material && <p className="text-sm text-gray-400">Malzeme: {item.material}</p>}
                  <p className="text-brand-red font-semibold mt-1">{formatPrice(item.unitPrice)}</p>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1.5 text-gray-400 hover:text-brand-red transition-colors"
                    aria-label="Ürünü kaldır"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <div className="flex items-center gap-2 border border-gray-200 rounded-lg p-0.5">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1.5 rounded hover:bg-gray-50"
                      aria-label="Azalt"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="text-sm w-6 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1.5 rounded hover:bg-gray-50"
                      aria-label="Artır"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="glass-card p-5 sm:p-6 h-fit lg:sticky lg:top-28">
            <h2 className="text-lg font-semibold text-brand-black mb-4">Sipariş Özeti</h2>

            <FreeShippingBar subtotal={total} className="mb-5 !p-3" />

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Ara Toplam</span>
                <span className="text-brand-black font-medium">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Kargo</span>
                <span className={shipping === 0 ? "text-emerald-600 font-medium" : "text-brand-black"}>
                  {shipping === 0 ? "Ücretsiz" : formatPrice(shipping)}
                </span>
              </div>
              {appliedCoupon && discount > 0 && (
                <div className="flex justify-between text-sm text-emerald-600">
                  <span className="flex items-center gap-1">
                    <Tag className="h-3.5 w-3.5" />
                    Kupon ({appliedCoupon.code})
                  </span>
                  <span className="font-medium">-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-3 flex justify-between">
                <span className="text-brand-black font-medium">Toplam</span>
                <span className="text-xl font-bold text-brand-black">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            <div className="mb-4">
              {appliedCoupon ? (
                <div className="flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                  <span className="text-sm font-mono font-semibold text-emerald-700">{appliedCoupon.code}</span>
                  <button
                    onClick={removeCoupon}
                    className="p-1 text-emerald-600 hover:text-red-500 transition-colors"
                    aria-label="Kuponu kaldır"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="Kupon kodu (SPIN5, SPIN10…)"
                      className="flex-1 px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-brand-black text-sm placeholder:text-gray-400 focus:outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/10"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={applyCoupon}
                      disabled={applying}
                      className="shrink-0"
                    >
                      {applying ? <Loader2 className="h-4 w-4 animate-spin" /> : "Uygula"}
                    </Button>
                  </div>
                  {couponError && <p className="text-xs text-red-500 mt-1.5">{couponError}</p>}
                  {!session?.user && (
                    <p className="text-xs text-gray-400 mt-1.5">
                      <Link href="/giris?callbackUrl=/sepet" className="text-brand-red hover:underline">
                        Giriş yapın
                      </Link>{" "}
                      veya{" "}
                      <Link href="/sans-carki" className="text-brand-red hover:underline">
                        şans çarkını
                      </Link>{" "}
                      çevirerek kupon kazanın.
                    </p>
                  )}
                </>
              )}
            </div>

            <Link href="/odeme" className="block mb-3">
              <Button size="lg" className="w-full group">
                Ödemeye Geç
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <button
              onClick={clearCart}
              className="w-full text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              Sepeti Temizle
            </button>
          </div>
        </div>
      </Container>
    </div>
  );
}
