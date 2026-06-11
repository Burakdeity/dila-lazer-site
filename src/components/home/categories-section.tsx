"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Zap, Layers, Box, Cuboid, Cpu, ArrowRight } from "lucide-react";
import { mainCategories } from "@/data/catalog/categories";
import { Container } from "@/components/ui/container";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Zap, Layers, Box, Cuboid, Cpu,
};

export function CategoriesSection() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-brand-red text-sm font-medium uppercase tracking-widest">Kategoriler</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-black mt-4 mb-4">
            Ürün Kategorilerimiz
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Neon, MDF, pleksi, 3D ve elektronik — tek platformda premium çözümler.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {mainCategories.map((cat, i) => {
            const Icon = iconMap[cat.icon] || Zap;
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <Link href={`/kategori/${cat.slug}`} className="group block h-full">
                  <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-brand-red/30 transition-all duration-500 h-full flex flex-col">
                    <div className="relative h-40 overflow-hidden">
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="20vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/40 to-transparent" />
                      <div className="absolute top-3 left-3 p-2 rounded-xl bg-brand-red/90">
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="text-brand-black font-semibold text-sm group-hover:text-brand-red transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1 flex-1">{cat.subcategories.length} alt kategori</p>
                      <span className="inline-flex items-center gap-1 text-xs text-brand-red mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        Keşfet <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
