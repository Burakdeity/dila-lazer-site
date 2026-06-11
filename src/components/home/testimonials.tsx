"use client";

import { motion } from "framer-motion";
import { Star, Quote, BadgeCheck } from "lucide-react";
import { Container } from "@/components/ui/container";
import { testimonials, type Testimonial } from "@/data/testimonials";
import { getInitials, getAvatarPalette } from "@/lib/avatar";

function TestimonialCard({ t }: { t: Testimonial }) {
  const initials = getInitials(t.name);
  const palette = getAvatarPalette(t.id);

  return (
    <article className="w-[300px] sm:w-[340px] shrink-0 p-6 sm:p-7 rounded-3xl bg-white border border-gray-100 shadow-[0_2px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.07)] transition-shadow duration-500">
      <Quote className="h-7 w-7 text-brand-red/20 mb-3" />
      <div className="flex gap-0.5 mb-3">
        {Array.from({ length: t.rating }).map((_, j) => (
          <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
        ))}
      </div>
      <p className="text-gray-600 mb-5 leading-relaxed text-sm line-clamp-4">&ldquo;{t.text}&rdquo;</p>
      <div className="flex items-center gap-3 pt-3 border-t border-gray-50">
        <div
          className={`w-11 h-11 shrink-0 rounded-full flex items-center justify-center text-sm font-bold ring-2 ${palette.bg} ${palette.text} ${palette.ring}`}
          aria-hidden
        >
          {initials}
        </div>
        <div className="min-w-0">
          <p className="text-brand-black font-semibold text-sm truncate flex items-center gap-1">
            {t.name}
            <BadgeCheck className="h-3.5 w-3.5 text-brand-red shrink-0" aria-label="Doğrulanmış müşteri" />
          </p>
          <p className="text-xs text-gray-400 mt-0.5 truncate">{t.company}</p>
        </div>
      </div>
    </article>
  );
}

export function Testimonials() {
  const loop = [...testimonials, ...testimonials];

  return (
    <section className="py-20 lg:py-28 bg-white border-t border-gray-100 overflow-hidden">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-brand-red text-sm font-medium uppercase tracking-widest">Referanslar</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-brand-black mt-4">Müşterilerimiz Ne Diyor?</h2>
          <p className="text-gray-500 text-sm mt-3 max-w-lg mx-auto">
            {testimonials.length}+ mutlu müşterimizden gerçek deneyimler
          </p>
        </motion.div>
      </Container>

      <div className="relative">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-28 sm:w-48 lg:w-72 z-10"
          style={{
            background: "linear-gradient(to right, #ffffff 0%, #ffffff 25%, rgba(255,255,255,0.85) 45%, rgba(255,255,255,0.4) 70%, transparent 100%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-28 sm:w-48 lg:w-72 z-10"
          style={{
            background: "linear-gradient(to left, #ffffff 0%, #ffffff 25%, rgba(255,255,255,0.85) 45%, rgba(255,255,255,0.4) 70%, transparent 100%)",
          }}
        />

        <div className="testimonials-marquee group">
          <div className="testimonials-track flex gap-5 sm:gap-6 w-max">
            {loop.map((t, i) => (
              <TestimonialCard key={`${t.id}-${i}`} t={t} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
