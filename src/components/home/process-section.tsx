"use client";

import { motion } from "framer-motion";
import { MessageSquare, Cpu, ShieldCheck, Truck } from "lucide-react";
import { Container } from "@/components/ui/container";

const steps = [
  {
    icon: MessageSquare,
    step: "01",
    title: "Tasarım & Teklif",
    desc: "Metninizi, ölçünüzü ve renk tercihinizi paylaşın. Ücretsiz dijital önizleme alın.",
  },
  {
    icon: Cpu,
    step: "02",
    title: "Üretim",
    desc: "Lazer kesim, LED montaj ve el işçiliği ile atölyemizde üretilir.",
  },
  {
    icon: ShieldCheck,
    step: "03",
    title: "Kalite Kontrol",
    desc: "Her parça ışık testi, kablo kontrolü ve paketleme öncesi son kontrolden geçer.",
  },
  {
    icon: Truck,
    step: "04",
    title: "Teslimat",
    desc: "81 ile sigortalı kargo. İsteğe bağlı profesyonel montaj desteği.",
  },
];

export function ProcessSection() {
  return (
    <section className="py-14 sm:py-16 bg-white border-y border-gray-100">
      <Container>
        <div className="text-center mb-10 sm:mb-12">
          <span className="text-brand-red text-xs font-semibold uppercase tracking-widest">
            Nasıl Çalışır?
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-brand-black mt-2">
            Siparişten Teslimata 4 Adım
          </h2>
          <p className="text-gray-500 text-sm mt-2 max-w-lg mx-auto">
            Online sipariş veya özel tasarım — süreç şeffaf, takip edilebilir.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="relative p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:border-brand-red/20 hover:shadow-md transition-all duration-300"
            >
              <span className="text-[11px] font-bold text-brand-red/60 tracking-wider">{item.step}</span>
              <div className="w-11 h-11 mt-3 mb-4 rounded-xl bg-brand-red/10 flex items-center justify-center">
                <item.icon className="h-5 w-5 text-brand-red" />
              </div>
              <h3 className="font-bold text-brand-black mb-1.5">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
