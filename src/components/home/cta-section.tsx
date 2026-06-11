"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export function CtaSection() {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden bg-gray-50">
      <div className="absolute inset-0 bg-gradient-to-r from-brand-red/5 via-transparent to-brand-red/5" />

      <Container className="relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="neon-card-border p-10 sm:p-16 text-center max-w-4xl mx-auto rounded-2xl shadow-lg relative"
        >
          <Sparkles className="h-10 w-10 text-brand-red mx-auto mb-6 neon-text-subtle" />
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-black mb-4">
            Hayalinizdeki Ürünü{" "}
            <span className="text-brand-red neon-text-subtle">Birlikte</span> Tasarlayalım
          </h2>
          <p className="text-gray-500 text-lg mb-8 max-w-2xl mx-auto">
            Ücretsiz teklif alın, kendin tasarla merkezimizde canlı önizleme yapın
            veya uzman ekibimizle hemen iletişime geçin.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/teklif-al">
              <Button size="lg" className="group neon-btn-glow">
                Ücretsiz Teklif Al
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/ozel-tasarim-merkezi">
              <Button variant="outline" size="lg">
                Kendin Tasarla
              </Button>
            </Link>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
