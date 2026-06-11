"use client";

import { useState } from "react";
import Link from "next/link";
import { CreditCard, Building2, Shield } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { FREE_SHIPPING_THRESHOLD } from "@/components/cart/free-shipping-bar";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";

const SHIPPING_FEE = 150;

const paymentMethods = [
  { id: "paytr", name: "PayTR", desc: "Kredi/Banka Kartı" },
  { id: "iyzico", name: "İyzico", desc: "Taksitli Ödeme" },
  { id: "stripe", name: "Stripe", desc: "Uluslararası Kart" },
  { id: "havale", name: "Havale/EFT", desc: "Banka Transferi" },
];

const carriers = [
  { id: "yurtici", name: "Yurtiçi Kargo" },
  { id: "aras", name: "Aras Kargo" },
  { id: "mng", name: "MNG Kargo" },
  { id: "surat", name: "Sürat Kargo" },
];

export default function CheckoutPage() {
  const { items, subtotal } = useCartStore();
  const [payment, setPayment] = useState("paytr");
  const [carrier, setCarrier] = useState("yurtici");
  const total = subtotal();
  const shipping = total >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;

  if (items.length === 0) {
    return (
      <div className="pt-24 pb-20 bg-white min-h-screen">
        <Container className="text-center py-20">
          <p className="text-gray-500 mb-4">Sepetiniz boş</p>
          <Link href="/urunler"><Button>Alışverişe Başla</Button></Link>
        </Container>
      </div>
    );
  }

  return (
    <div className="pt-24 lg:pt-32 pb-20 bg-white min-h-screen">
      <Container size="narrow">
        <h1 className="text-3xl font-bold text-brand-black mb-8">Ödeme</h1>

        <div className="space-y-6">
          {/* Address */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-brand-black mb-4">Teslimat Adresi</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {["Ad Soyad", "Telefon", "Şehir", "İlçe"].map((label) => (
                <input
                  key={label}
                  placeholder={label}
                  className="px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-white text-sm placeholder:text-gray-400 focus:outline-none focus:border-brand-red/50"
                />
              ))}
              <input
                placeholder="Adres"
                className="sm:col-span-2 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-white text-sm placeholder:text-gray-400 focus:outline-none focus:border-brand-red/50"
              />
            </div>
          </div>

          {/* Carrier */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-brand-black mb-4">Kargo Firması</h2>
            <div className="grid grid-cols-2 gap-3">
              {carriers.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCarrier(c.id)}
                  className={`p-4 rounded-xl text-sm transition-colors ${
                    carrier === c.id ? "bg-brand-red text-white" : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Payment */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-brand-black mb-4">Ödeme Yöntemi</h2>
            <div className="space-y-3">
              {paymentMethods.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setPayment(m.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl transition-colors ${
                    payment === m.id ? "bg-brand-red/10 border border-brand-red/30" : "bg-white/5 border border-transparent hover:bg-gray-100"
                  }`}
                >
                  <CreditCard className="h-5 w-5 text-gray-500" />
                  <div className="text-left">
                    <p className="text-brand-black font-medium">{m.name}</p>
                    <p className="text-xs text-gray-400">{m.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="glass-card p-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-500">Toplam</span>
              <span className="text-2xl font-bold text-brand-black">{formatPrice(total + shipping)}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
              <Shield className="h-3.5 w-3.5" />
              256-bit SSL ile güvenli ödeme
            </div>
            <Button size="lg" className="w-full">
              <Building2 className="h-4 w-4" />
              Siparişi Tamamla
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
