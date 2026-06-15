import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { brand } from "@/lib/brand";

export function LocalSeoSection() {
  return (
    <section className="py-12 sm:py-14 bg-white border-y border-gray-100">
      <Container>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 rounded-2xl border border-gray-200 bg-gray-50 p-6 sm:p-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-brand-red text-xs font-semibold uppercase tracking-widest mb-2">
              <MapPin className="h-4 w-4" />
              Sakarya · Adapazarı
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-brand-black">
              Sakarya&apos;da Neon Tabela ve Lazer Kesim Atölyesi
            </h2>
            <p className="text-gray-500 mt-3 text-sm sm:text-base leading-relaxed">
              {brand.name}, Adapazarı&apos;daki atölyesinde neon LED tabela, 3D kutu harf ve lazer kesim üretimi yapar.
              Sakarya ve çevresine hızlı teslimat; Türkiye geneline kargo ile gönderim.
            </p>
          </div>
          <Link
            href="/sakarya"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-red text-white text-sm font-semibold rounded-lg hover:bg-brand-red/90 transition-colors whitespace-nowrap shrink-0"
          >
            Sakarya Hizmetlerimiz
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
