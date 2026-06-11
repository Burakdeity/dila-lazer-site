"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { blogPosts } from "@/data/catalog/blog";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export function BlogPreview() {
  return (
    <section className="py-20 lg:py-28 bg-gray-50">
      <Container>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-brand-red text-sm font-medium uppercase tracking-widest">Blog</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-brand-black mt-4">Son Yazılar</h2>
          </div>
          <Link href="/blog">
            <Button variant="outline" className="group">
              Tüm Yazılar
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogPosts.map((post, i) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={`/blog/${post.slug}`} className="group block">
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-4">
                  <Image src={post.cover} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="33vw" />
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-brand-red text-white text-xs">{post.category}</span>
                </div>
                <p className="text-xs text-gray-400 mb-2">{post.date}</p>
                <h3 className="text-lg font-semibold text-brand-black group-hover:text-brand-red transition-colors">{post.title}</h3>
                <p className="text-sm text-gray-500 mt-2 line-clamp-2">{post.excerpt}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
