"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

const slides = [
  {
    id: 1,
    title: "Premium Neon & LED Tabelalar",
    subtitle: "Markanızı ışıkla öne çıkarın. Özel üretim, 81 ile teslimat.",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=80",
    cta: { label: "Neon Koleksiyonu", href: "/kategori/neon-led-tabelalar" },
    accent: "Neon LED",
  },
  {
    id: 2,
    title: "MDF & Pleksi Dekorasyon",
    subtitle: "CNC kesim, lazer baskı — ev ve ofis için premium dekor.",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80",
    cta: { label: "Dekor Ürünleri", href: "/kategori/mdf-urunler" },
    accent: "Dekorasyon",
  },
  {
    id: 3,
    title: "Kendin Tasarla",
    subtitle: "Logonuzu yükleyin, canlı önizleme ile tasarlayın, anında teklif alın.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80",
    cta: { label: "Tasarlamaya Başla", href: "/ozel-tasarim-merkezi" },
    accent: "AI Tasarım",
  },
];

export function HeroSlider() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), []);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + slides.length) % slides.length), []);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  return (
    <section className="relative min-h-[90vh] lg:min-h-screen flex items-center overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <Image src={slide.image} alt="" fill className="object-cover" priority sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-black via-brand-black/80 to-brand-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-brand-black/30" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-brand-red/15 rounded-full blur-[120px]" />

      <Container className="relative z-10 pt-28 pb-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs text-white/90 mb-6 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-brand-red" />
              {slide.accent}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-brand-black leading-[1.08] tracking-tight mb-6">
              {slide.title}
            </h1>
            <p className="text-lg sm:text-xl text-white/80 max-w-xl mb-10 leading-relaxed">
              {slide.subtitle}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href={slide.cta.href}>
                <Button size="lg" className="group">
                  {slide.cta.label}
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/ozel-tasarim-merkezi">
                <Button variant="outline" size="lg">Ücretsiz Teklif</Button>
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Controls */}
        <div className="absolute bottom-12 right-8 hidden lg:flex items-center gap-3">
          <button onClick={prev} className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors" aria-label="Önceki">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all ${i === current ? "w-8 bg-brand-red" : "w-4 bg-white/30"}`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
          <button onClick={next} className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors" aria-label="Sonraki">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </Container>
    </section>
  );
}
