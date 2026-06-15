import type { Metadata } from "next";
import { SpinWheelWidget } from "@/components/spin-wheel/spin-wheel-widget";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Şans Çarkı",
  description: "Çarkı çevir, indirim kuponları kazan. Günde bir kez şansını dene!",
};

export default function SpinWheelPage() {
  return (
    <div className="min-h-screen bg-[#060a12] pt-8 pb-20 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[300px] bg-amber-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <SpinWheelWidget />

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          {[
            { title: "Üye Ol", desc: "Ücretsiz hesap oluşturun" },
            { title: "Çarkı Çevirin", desc: "24 saatte 1 hak" },
            { title: "Kupon Kazanın", desc: "%5, %10 veya %15 indirim" },
          ].map((item) => (
            <div
              key={item.title}
              className="p-5 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm"
            >
              <p className="font-semibold text-amber-300">{item.title}</p>
              <p className="text-sm text-white/50 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-white/30 mt-8">
          Kuponlar 7 gün geçerlidir. Sonuçlar sunucu tarafında belirlenir.
        </p>
      </div>
    </div>
  );
}
