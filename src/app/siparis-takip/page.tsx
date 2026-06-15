import type { Metadata } from "next";
import { Suspense } from "react";
import { Truck, Shield, Clock, Headphones } from "lucide-react";
import { OrderTracking } from "@/components/orders/order-tracking";

export const metadata: Metadata = {
  title: "Sipariş Takip",
  description: "Dila Lazer siparişinizi sipariş numarası ve e-posta ile anlık takip edin.",
};

const features = [
  { icon: Truck, title: "Canlı Durum", desc: "Üretimden teslimata kadar adım adım" },
  { icon: Shield, title: "Güvenli Sorgu", desc: "Sadece sipariş no + e-posta ile erişim" },
  { icon: Clock, title: "7/24 Erişim", desc: "İstediğiniz zaman sorgulayın" },
  { icon: Headphones, title: "Destek", desc: "Sorunuz mu var? Bize ulaşın" },
];

export default function OrderTrackingPage() {
  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      <div className="bg-brand-black text-white py-12 sm:py-16 relative overflow-hidden">
        <div className="absolute inset-0 neon-grid opacity-20 pointer-events-none" aria-hidden />
        <div className="max-w-[1400px] mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-red/20 text-brand-red text-xs font-semibold mb-4 border border-brand-red/30">
            <Truck className="h-3.5 w-3.5" />
            Sipariş Takip
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Siparişiniz Nerede?</h1>
          <p className="text-white/60 max-w-lg mx-auto">
            Sipariş numaranız ve kayıtlı e-posta adresinizle neon tabela siparişinizin durumunu anında öğrenin.
          </p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 -mt-8">
        <Suspense fallback={<div className="h-48 flex items-center justify-center text-gray-400">Yükleniyor…</div>}>
          <OrderTracking />
        </Suspense>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 mt-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f) => (
            <div key={f.title} className="bg-white border border-gray-200 rounded-xl p-5 text-center">
              <f.icon className="h-6 w-6 text-brand-red mx-auto mb-2" />
              <p className="text-sm font-semibold text-brand-black">{f.title}</p>
              <p className="text-xs text-gray-500 mt-1">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
