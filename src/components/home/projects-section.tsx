"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { portfolioProjects } from "@/data/portfolio";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export function ProjectsSection() {
  const featured = portfolioProjects.filter((p) => p.isFeatured).slice(0, 4);

  return (
    <section className="py-20 lg:py-28 bg-white border-y border-gray-100">
      <Container>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-brand-red text-sm font-medium uppercase tracking-widest">Portfolyo</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-brand-black mt-4">Tamamlanan Projeler</h2>
          </div>
          <Link href="/portfolyo">
            <Button variant="outline" className="group">
              Tüm Projeler
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featured.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link href="/portfolyo" className="group block">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-3">
                  <Image
                    src={project.afterImage}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-black/80 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-red/80 text-white">{project.sector}</span>
                    <h3 className="text-brand-black font-medium text-sm mt-2">{project.title}</h3>
                    <p className="text-xs text-gray-500">{project.city}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
