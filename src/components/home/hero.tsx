"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle, Palette, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { getWhatsAppUrl } from "@/lib/utils";

const heroVideos = [
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=80",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=80",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80",
];

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{
            backgroundImage: `url(${heroVideos[0]})`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-black/80 via-brand-black/70 to-brand-black" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-black/90 via-transparent to-brand-black/60" />

        {/* Neon glow effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-red/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-brand-red/10 rounded-full blur-[100px]" />
      </div>

      <Container className="relative z-10 pt-32 pb-20">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-gray-200 text-xs text-gray-600 mb-8 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse" />
              Türkiye&apos;nin #1 Premium Tabela Üreticisi
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-brand-black leading-[1.1] tracking-tight mb-6"
          >
            Markanızı Öne Çıkaran{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-red-400 neon-text">
              Premium Neon
            </span>{" "}
            ve 3D Tabela Çözümleri
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-lg sm:text-xl text-gray-500 max-w-2xl mb-10 leading-relaxed"
          >
            Türkiye&apos;nin her yerine özel üretim, yüksek kalite ve profesyonel tabela çözümleri.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap gap-3 sm:gap-4"
          >
            <Link href="/teklif-al">
              <Button size="lg" className="group">
                Ücretsiz Teklif Al
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/tasarim-studyosu">
              <Button variant="outline" size="lg">
                <Palette className="h-4 w-4" />
                Tasarım Oluştur
              </Button>
            </Link>
            <a href={getWhatsAppUrl("Merhaba, tabela hakkında bilgi almak istiyorum.")} target="_blank" rel="noopener noreferrer">
              <Button variant="whatsapp" size="lg">
                <MessageCircle className="h-4 w-4" />
                WhatsApp&apos;tan Yaz
              </Button>
            </a>
            <Link href="/portfolyo">
              <Button variant="ghost" size="lg">
                <Play className="h-4 w-4" />
                Projelerimizi İncele
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Floating stats card */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="hidden xl:block absolute right-8 top-1/2 -translate-y-1/2"
        >
          <div className="glass-card p-6 w-72 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-sm">Canlı Üretim</span>
              <span className="flex items-center gap-1.5 text-xs text-green-400">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Aktif
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl font-bold text-brand-black">47</p>
                <p className="text-xs text-gray-400">Aktif Sipariş</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-brand-black">12</p>
                <p className="text-xs text-gray-400">Bugün Teslim</p>
              </div>
            </div>
          </div>
        </motion.div>
      </Container>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-1.5">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-white/60"
          />
        </div>
      </motion.div>
    </section>
  );
}
