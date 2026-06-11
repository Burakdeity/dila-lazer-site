"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { campaigns } from "@/data/catalog/campaigns";
import { Container } from "@/components/ui/container";

export function CampaignsSection() {
  return (
    <section className="py-20 lg:py-28 bg-white/[0.02] border-y border-white/5">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-brand-red text-sm font-medium uppercase tracking-widest">Kampanyalar</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-brand-black mt-4">Fırsatları Kaçırmayın</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {campaigns.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={c.link} className="group block relative overflow-hidden rounded-2xl aspect-[16/10]">
                <Image src={c.image} alt={c.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="33vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  {c.discount && (
                    <span className="inline-block px-3 py-1 rounded-full bg-brand-red text-white text-xs font-bold mb-2">
                      %{c.discount} İndirim
                    </span>
                  )}
                  <h3 className="text-xl font-bold text-brand-black">{c.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{c.subtitle}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
