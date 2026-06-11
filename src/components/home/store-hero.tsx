"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { NeonAmbient } from "@/components/effects/neon-ambient";

const slides = [
  {
    id: 1,
    eyebrow: "Neon & LED Tabela",
    title: "Markanızı Işıkla Öne Çıkarın",
    subtitle: "Özel üretim neon tabelalar, 81 ile güvenli teslimat ve 2 yıl garanti.",
    image: "/hero/slide-neon-led.png",
    cta: { label: "Koleksiyonu İncele", href: "/kategori/neon-led-tabelalar" },
    secondary: { label: "Teklif Al", href: "/teklif-al" },
  },
  {
    id: 2,
    eyebrow: "3D Yazıcı Üretim",
    title: "Hayalinizdeki Modeli Basıyoruz",
    subtitle: "Prototip, dekoratif parça ve özel tasarım 3D baskı — PLA, PETG ve reçine seçenekleriyle hızlı üretim.",
    image: "/hero/slide-3d-kurumsal.png",
    imageClass: "object-cover object-center sm:object-right opacity-70",
    overlayClass: "bg-gradient-to-r from-brand-black via-brand-black/70 to-brand-black/15",
    cta: { label: "3D Ürünler", href: "/kategori/3d-urunler" },
    secondary: { label: "Teklif Al", href: "/teklif-al" },
  },
  {
    id: 3,
    eyebrow: "Kendin Tasarla",
    title: "Hayalinizdeki Ürünü Tasarlayın",
    subtitle: "Canlı önizleme, anlık fiyat hesaplama ve uzman tasarım desteği.",
    image: "/hero/slide-uretim.png",
    cta: { label: "Tasarlamaya Başla", href: "/ozel-tasarim-merkezi" },
    secondary: { label: "Nasıl Çalışır?", href: "/hakkimizda" },
  },
];

export function StoreHero() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), []);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + slides.length) % slides.length), []);

  useEffect(() => {
    const timer = setInterval(next, 7000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  return (
    <section className="bg-white border-b border-gray-100">
      <div className="max-w-[1400px] mx-auto px-4 py-4">
        <div className="relative overflow-hidden rounded-2xl bg-brand-black min-h-[320px] sm:min-h-[380px] lg:min-h-[420px] neon-border">
          <NeonAmbient variant="hero" />
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0"
            >
              <Image
                src={slide.image}
                alt=""
                fill
                className={slide.imageClass ?? "object-cover opacity-50"}
                sizes="(max-width: 1400px) 100vw, 1400px"
                priority={current === 0}
              />
              <div
                className={
                  slide.overlayClass ??
                  "absolute inset-0 bg-gradient-to-r from-brand-black via-brand-black/85 to-brand-black/30"
                }
              />
            </motion.div>
          </AnimatePresence>

          <div className="relative z-10 flex flex-col justify-center h-full min-h-[320px] sm:min-h-[380px] lg:min-h-[420px] px-6 sm:px-10 lg:px-14 py-10 max-w-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.45 }}
              >
                <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-brand-red mb-3 neon-text-subtle">
                  {slide.eyebrow}
                </span>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight tracking-tight mb-4">
                  {slide.title.split(" ").map((word, i) =>
                    i === slide.title.split(" ").length - 1 ? (
                      <span key={i} className="neon-text">{word}</span>
                    ) : (
                      <span key={i}>{word} </span>
                    )
                  )}
                </h1>
                <p className="text-sm sm:text-base text-white/75 leading-relaxed mb-6 max-w-lg">
                  {slide.subtitle}
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href={slide.cta.href}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-brand-red text-white text-sm font-semibold rounded-lg hover:bg-brand-red/90 transition-colors neon-btn-glow"
                  >
                    {slide.cta.label}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href={slide.secondary.href}
                    className="inline-flex items-center px-6 py-3 bg-white/10 text-white text-sm font-medium rounded-lg border border-white/20 hover:bg-white/15 transition-colors backdrop-blur-sm"
                  >
                    {slide.secondary.label}
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-10 flex items-center gap-2">
            <button
              onClick={prev}
              className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white transition-colors"
              aria-label="Önceki slayt"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex gap-1.5 px-1">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === current ? "w-6 bg-brand-red" : "w-1.5 bg-white/40 hover:bg-white/60"
                  }`}
                  aria-label={`Slayt ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white transition-colors"
              aria-label="Sonraki slayt"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
