"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, ArrowLeftRight } from "lucide-react";
import { portfolioProjects, sectors, cities } from "@/data/portfolio";
import { Container } from "@/components/ui/container";

export function PortfolioGallery() {
  const [sectorFilter, setSectorFilter] = useState<string>("all");
  const [cityFilter, setCityFilter] = useState<string>("all");
  const [compareMode, setCompareMode] = useState<string | null>(null);

  const filtered = portfolioProjects.filter((p) => {
    if (sectorFilter !== "all" && p.sector !== sectorFilter) return false;
    if (cityFilter !== "all" && p.city !== cityFilter) return false;
    return true;
  });

  return (
    <div className="pt-24 lg:pt-32 pb-20 bg-white min-h-screen">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="text-brand-red text-sm font-medium uppercase tracking-widest">Portfolyo</span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-black mt-4 mb-4">
            Tamamlanan Projeler
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            380+ başarılı proje. Sektör ve şehre göre filtreleyin.
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-10">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
            className="px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-brand-black text-sm focus:outline-none focus:border-brand-red/50"
          >
            <option value="all">Tüm Sektörler</option>
            {sectors.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-brand-black text-sm focus:outline-none focus:border-brand-red/50"
          >
            <option value="all">Tüm Şehirler</option>
            {cities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                className="group relative overflow-hidden rounded-2xl bg-white/5 border border-gray-200"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  {compareMode === project.id && "beforeImage" in project && project.beforeImage ? (
                    <div className="grid grid-cols-2 h-full">
                      <div className="relative">
                        <Image src={project.beforeImage} alt="Öncesi" fill className="object-cover" sizes="25vw" />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 text-xs text-white">Öncesi</span>
                      </div>
                      <div className="relative">
                        <Image src={project.afterImage} alt="Sonrası" fill className="object-cover" sizes="25vw" />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-brand-red/80 text-xs text-white">Sonrası</span>
                      </div>
                    </div>
                  ) : (
                    <Image
                      src={project.afterImage}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent opacity-60" />

                  {"beforeImage" in project && project.beforeImage && (
                    <button
                      onClick={() => setCompareMode(compareMode === project.id ? null : project.id)}
                      className="absolute top-4 right-4 p-2 rounded-xl bg-black/50 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ArrowLeftRight className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-brand-red/20 text-brand-red">{project.sector}</span>
                    <span className="text-xs text-gray-400">{project.city}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-brand-black">{project.title}</h3>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </Container>
    </div>
  );
}
