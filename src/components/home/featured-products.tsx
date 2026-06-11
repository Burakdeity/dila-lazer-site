"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, ShoppingBag, Heart } from "lucide-react";
import { products } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart";

export function FeaturedProducts() {
  const addItem = useCartStore((s) => s.addItem);
  const featured = products.filter((p) => p.isFeatured);

  return (
    <section className="py-24 lg:py-32 bg-gradient-to-b from-brand-black to-brand-black/95">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-16"
        >
          <div>
            <span className="text-brand-red text-sm font-medium uppercase tracking-widest">Öne Çıkanlar</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-brand-black mt-4">Premium Ürünler</h2>
          </div>
          <Link href="/urunler">
            <Button variant="outline">Tüm Ürünler</Button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group"
            >
              <div className="relative overflow-hidden rounded-2xl bg-white/5 border border-gray-200 hover:border-white/10 transition-all duration-500">
                <Link href={`/urun/${product.slug}`}>
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>

                <div className="p-6">
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-gray-600">{product.rating}</span>
                    <span className="text-sm text-gray-400">({product.reviewCount})</span>
                  </div>

                  <Link href={`/urun/${product.slug}`}>
                    <h3 className="text-lg font-semibold text-brand-black mb-1 group-hover:text-brand-red transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-400 mb-4 line-clamp-2">{product.shortDesc}</p>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400">Başlangıç fiyatı</p>
                      <p className="text-xl font-bold text-brand-black">{formatPrice(product.basePrice)}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors" aria-label="Favorilere ekle">
                        <Heart className="h-4 w-4 text-gray-500" />
                      </button>
                      <button
                        onClick={() =>
                          addItem({
                            productId: product.id,
                            name: product.name,
                            slug: product.slug,
                            image: product.images[0],
                            quantity: 1,
                            unitPrice: product.basePrice,
                          })
                        }
                        className="p-2.5 rounded-xl bg-brand-red hover:bg-brand-red/90 transition-colors"
                        aria-label="Sepete ekle"
                      >
                        <ShoppingBag className="h-4 w-4 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
