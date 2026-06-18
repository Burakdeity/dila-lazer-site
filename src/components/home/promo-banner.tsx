import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export function PromoBanner() {
  return (
    <section className="bg-gray-50 py-6">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/kampanyalar"
            className="group relative overflow-hidden rounded-2xl bg-brand-black min-h-[180px] flex items-end"
          >
            <Image
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=85"
              alt="Neon kampanya"
              fill
              className="object-cover opacity-40 group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/50 to-transparent" />
            <div className="relative p-6 sm:p-8">
              <span className="text-xs font-semibold uppercase tracking-widest text-brand-red">Kampanya</span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1 mb-2">
                Neon LED Ürünlerde %30&apos;a Varan İndirim
              </h2>
              <span className="inline-flex items-center gap-1 text-sm text-white/80 group-hover:text-white transition-colors">
                İncele <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </Link>

          <Link
            href="/ozel-tasarim-merkezi"
            className="group relative overflow-hidden rounded-2xl bg-brand-red min-h-[180px] flex items-end"
          >
            <Image
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=85"
              alt="Özel tasarım"
              fill
              className="object-cover opacity-25 group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-red via-brand-red/60 to-transparent" />
            <div className="relative p-6 sm:p-8">
              <span className="text-xs font-semibold uppercase tracking-widest text-white/80">Özel Üretim</span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1 mb-2">
                Ücretsiz Tasarım Önizlemesi
              </h2>
              <span className="inline-flex items-center gap-1 text-sm text-white/80 group-hover:text-white transition-colors">
                Tasarla <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
