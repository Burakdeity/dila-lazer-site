"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { mainCategories } from "@/data/catalog/categories";

interface MegaMenuProps {
  onClose?: () => void;
}

export function MegaMenu({ onClose }: MegaMenuProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-xl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-8">
          {mainCategories.map((cat) => (
            <div key={cat.id}>
              <Link
                href={`/kategori/${cat.slug}`}
                onClick={onClose}
                className="text-brand-black font-semibold text-sm hover:text-brand-red transition-colors"
              >
                {cat.name}
              </Link>
              <ul className="mt-3 space-y-1.5">
                {cat.subcategories.slice(0, 6).map((sub) => (
                  <li key={sub.id}>
                    <Link
                      href={`/kategori/${cat.slug}/${sub.slug}`}
                      onClick={onClose}
                      className="text-xs text-gray-500 hover:text-brand-black transition-colors"
                    >
                      {sub.name}
                    </Link>
                  </li>
                ))}
                {cat.subcategories.length > 6 && (
                  <li>
                    <Link
                      href={`/kategori/${cat.slug}`}
                      onClick={onClose}
                      className="text-xs text-brand-red hover:underline"
                    >
                      +{cat.subcategories.length - 6} daha
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-6 border-t border-gray-100 flex gap-6">
          <Link href="/ozel-tasarim-merkezi" onClick={onClose} className="text-sm text-brand-red font-medium hover:underline">
            Kendin Tasarla ›
          </Link>
          <Link href="/kampanyalar" onClick={onClose} className="text-sm text-gray-500 hover:text-brand-black transition-colors">
            Kampanyalar
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
