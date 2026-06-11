"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, X, ShoppingBag, User, Search, Heart, Phone,
  ChevronDown, Sun, Moon, Globe,
} from "lucide-react";
import { BrandLogo } from "@/components/layout/brand-logo";
import { brand } from "@/lib/brand";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { useThemeStore } from "@/store/theme";
import { Container } from "@/components/ui/container";
import { MegaMenu } from "@/components/layout/mega-menu";

const navLinks = [
  { href: "/ozel-tasarim-merkezi", label: "Kendin Tasarla" },
  { href: "/portfolyo", label: "Projeler" },
  { href: "/blog", label: "Blog" },
  { href: "/iletisim", label: "İletişim" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const itemCount = useCartStore((s) => s.itemCount());
  const { theme, toggleTheme, currency, setCurrency } = useThemeStore();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled || megaOpen
          ? "bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm"
          : "bg-white/90 backdrop-blur-sm"
      )}
      onMouseLeave={() => setMegaOpen(false)}
    >
      <div className="hidden lg:block border-b border-gray-100 bg-gray-50">
        <Container>
          <div className="flex items-center justify-between py-2 text-xs text-gray-500">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1.5">
                <Phone className="h-3 w-3" />
                {brand.contact.phone}
              </span>
              <span>81 İle Teslimat · Ücretsiz Kargo 500₺+</span>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as "TRY" | "USD" | "EUR")}
                className="bg-transparent text-gray-500 text-xs focus:outline-none cursor-pointer"
              >
                <option value="TRY">₺ TRY</option>
                <option value="USD">$ USD</option>
                <option value="EUR">€ EUR</option>
              </select>
              <Link href="/hesabim" className="hover:text-brand-black transition-colors">Müşteri Paneli</Link>
            </div>
          </div>
        </Container>
      </div>

      <Container>
        <div className="flex items-center justify-between h-16 lg:h-20">
          <BrandLogo size="md" />

          <nav className="hidden lg:flex items-center gap-6">
            <button
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-brand-black transition-colors"
              onMouseEnter={() => setMegaOpen(true)}
            >
              Kategoriler
              <ChevronDown className={cn("h-4 w-4 transition-transform", megaOpen && "rotate-180")} />
            </button>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-gray-600 hover:text-brand-black transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-red transition-all group-hover:w-full" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <button onClick={toggleTheme} className="p-2.5 text-gray-500 hover:text-brand-black transition-colors hidden sm:block" aria-label="Tema">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button className="p-2.5 text-gray-500 hover:text-brand-black transition-colors hidden sm:block" aria-label="Dil">
              <Globe className="h-4 w-4" />
            </button>
            <button className="p-2.5 text-gray-500 hover:text-brand-black transition-colors hidden sm:block" aria-label="Ara">
              <Search className="h-5 w-5" />
            </button>
            <Link href="/hesabim/favoriler" className="p-2.5 text-gray-500 hover:text-brand-black transition-colors hidden sm:block">
              <Heart className="h-5 w-5" />
            </Link>
            <Link href="/hesabim" className="p-2.5 text-gray-500 hover:text-brand-black transition-colors hidden sm:block">
              <User className="h-5 w-5" />
            </Link>
            <Link href="/sepet" className="relative p-2.5 text-gray-500 hover:text-brand-black transition-colors">
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-brand-red text-white text-[10px] font-bold flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            <button className="p-2.5 text-brand-black lg:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menü">
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </Container>

      <AnimatePresence>
        {megaOpen && <MegaMenu onClose={() => setMegaOpen(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-gray-200 max-h-[80vh] overflow-y-auto shadow-lg"
          >
            <Container className="py-6">
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-3 px-4">Menü</p>
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="block py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-xl">
                  {link.label}
                </Link>
              ))}
              <Link href="/ozel-tasarim-merkezi" onClick={() => setMobileOpen(false)} className="mt-4 block py-3 px-4 bg-brand-red text-white text-center rounded-xl font-medium">
                Kendin Tasarla
              </Link>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
