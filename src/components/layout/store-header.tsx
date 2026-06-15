"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, Menu, X, Phone, Search } from "lucide-react";
import { AccountLink } from "@/components/layout/account-link";
import { BrandLogo } from "@/components/layout/brand-logo";
import { brand } from "@/lib/brand";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import type { MainCategory } from "@/types/catalog";
import type { SiteMenus } from "@/types/admin";

interface StoreHeaderProps {
  categories: MainCategory[];
  menus: SiteMenus;
}

export function StoreHeader({ categories, menus }: StoreHeaderProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const cartTotal = useCartStore((s) => s.subtotal());
  const itemCount = useCartStore((s) => s.itemCount());

  const topLinks = menus.topBarLinks.filter((l) => l.isActive);
  const navCategories = [
    ...categories.map((c) => ({ href: `/kategori/${c.slug}`, label: c.name })),
    ...menus.extraNavLinks.filter((l) => l.isActive).map((l) => ({ href: l.href, label: l.label })),
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(`/urunler?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <header className="relative z-40 w-full bg-white">
      <div className="bg-brand-black text-white text-xs relative overflow-hidden">
        <div className="absolute inset-0 neon-topbar-shimmer pointer-events-none" />

        {/* Masaüstü üst bar */}
        <div className="hidden lg:flex max-w-[1400px] mx-auto px-4 items-center justify-between h-9 relative z-10">
          <p className="truncate text-white/80">
            Premium neon, tabela ve lazer kesim — Türkiye geneli teslimat
          </p>
          <div className="flex items-center gap-5 shrink-0">
            {topLinks.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className="text-white/70 hover:text-white transition-colors whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={`tel:${brand.contact.phone.replace(/\s/g, "")}`}
              className="flex items-center gap-1.5 text-white font-medium"
            >
              <Phone className="h-3.5 w-3.5" />
              {brand.contact.phone}
            </a>
          </div>
        </div>

        {/* Mobil & tablet — yatay kaydırmalı linkler */}
        <div className="lg:hidden relative z-10 border-b border-white/5">
          <div className="flex items-center gap-4 h-9 px-4 overflow-x-auto overscroll-x-contain scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {topLinks.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className="shrink-0 text-white/75 hover:text-white transition-colors whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
            <span className="shrink-0 text-white/25" aria-hidden>
              |
            </span>
            <a
              href={`tel:${brand.contact.phone.replace(/\s/g, "")}`}
              className="shrink-0 flex items-center gap-1.5 text-white font-medium whitespace-nowrap"
            >
              <Phone className="h-3.5 w-3.5" />
              {brand.contact.phone}
            </a>
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4 py-2 lg:py-2">
          <div className="flex flex-col gap-2.5 md:hidden">
            <div className="flex items-center justify-between gap-2">
              <BrandLogo size="sm" priority />
              <div className="flex items-center gap-0.5">
                <Link href="/sepet" className="relative p-2 rounded-lg hover:bg-gray-100" aria-label="Sepet">
                  <ShoppingCart className="h-5 w-5 text-brand-red" />
                  {itemCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-brand-red text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {itemCount > 9 ? "9+" : itemCount}
                    </span>
                  )}
                </Link>
                <button
                  className="p-2 rounded-lg hover:bg-gray-100"
                  onClick={() => setMobileOpen(!mobileOpen)}
                  aria-label="Menü"
                >
                  {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>
            </div>
            <form onSubmit={handleSearch} className="flex w-full">
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ürün veya kategori ara..."
                  className="w-full h-10 pl-9 pr-3 border border-gray-300 rounded-l-lg text-sm focus:outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/10"
                />
              </div>
              <button
                type="submit"
                className="h-10 px-4 bg-brand-red text-white font-semibold text-sm rounded-r-lg hover:bg-brand-red/90 shrink-0"
              >
                Ara
              </button>
            </form>
          </div>

          <div className="hidden md:flex items-center gap-4 lg:gap-8">
            <div className="shrink-0 lg:hidden">
              <BrandLogo size="md" priority />
            </div>
            <div className="shrink-0 hidden lg:block">
              <BrandLogo size="lg" priority />
            </div>

            <form onSubmit={handleSearch} className="flex-1 flex max-w-2xl mx-auto min-w-0">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Neon tabela, MDF, pleksi veya kategori ara..."
                  className="w-full h-11 pl-10 pr-4 border border-gray-300 rounded-l-lg text-sm text-brand-black placeholder:text-gray-400 focus:outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/10"
                />
              </div>
              <button
                type="submit"
                className="h-11 px-5 bg-brand-red text-white font-semibold text-sm rounded-r-lg hover:bg-brand-red/90 transition-colors whitespace-nowrap"
              >
                Ara
              </button>
            </form>

            <div className="hidden md:flex items-center gap-5 shrink-0">
              <AccountLink />
              <Link
                href="/sepet"
                className="flex items-center gap-2.5 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 hover:border-brand-red/40 hover:bg-brand-red/5 transition-all"
              >
                <div className="relative">
                  <ShoppingCart className="h-5 w-5 text-brand-red" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-brand-red text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {itemCount > 9 ? "9+" : itemCount}
                    </span>
                  )}
                </div>
                <div className="text-left hidden lg:block">
                  <p className="text-[10px] text-gray-500 leading-none uppercase tracking-wide">Sepetim</p>
                  <p className="text-sm font-bold text-brand-black leading-tight mt-0.5">
                    {formatPrice(cartTotal)}
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <nav className="bg-brand-red text-white hidden lg:block">
        <div className="max-w-[1400px] mx-auto px-4">
          <ul className="flex items-center">
            {navCategories.map((cat) => (
              <li key={cat.href + cat.label}>
                <Link
                  href={cat.href}
                  className="block px-4 py-2.5 text-sm font-medium hover:bg-black/10 hover:shadow-[inset_0_-2px_0_rgba(255,255,255,0.5)] transition-all whitespace-nowrap"
                >
                  {cat.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {mobileOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 shadow-lg max-h-[70vh] overflow-y-auto">
          <div className="px-4 py-3 space-y-1">
            <p className="px-3 py-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
              Hızlı Erişim
            </p>
            {topLinks.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block py-2 px-3 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
              >
                {link.label}
              </Link>
            ))}
            <hr className="my-2 border-gray-100" />
            <p className="px-3 py-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
              Kategoriler
            </p>
            {navCategories.map((cat) => (
              <Link
                key={cat.href + cat.label}
                href={cat.href}
                onClick={() => setMobileOpen(false)}
                className="block py-2.5 px-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg font-medium"
              >
                {cat.label}
              </Link>
            ))}
            <hr className="my-2 border-gray-100" />
            <Link href="/giris" onClick={() => setMobileOpen(false)} className="block py-2.5 px-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
              Giriş Yap
            </Link>
            <Link href="/kayit" onClick={() => setMobileOpen(false)} className="block py-2.5 px-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
              Kayıt Ol
            </Link>
            <Link href="/sepet" onClick={() => setMobileOpen(false)} className="block py-2.5 px-3 text-sm font-semibold text-brand-red">
              Sepetim — {formatPrice(cartTotal)} ({itemCount})
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
