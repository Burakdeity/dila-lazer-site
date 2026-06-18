"use client";

import { usePathname } from "next/navigation";
import type { MainCategory } from "@/types/catalog";
import type { SiteMenus } from "@/types/admin";
import { StoreHeader } from "@/components/layout/store-header";
import { StoreFooter } from "@/components/layout/store-footer";
import { WhatsAppFloat } from "@/components/shared/whatsapp-float";
import { SpinWheelPopup } from "@/components/spin-wheel/spin-wheel-popup";

interface StoreChromeProps {
  children: React.ReactNode;
  categories: MainCategory[];
  menus: SiteMenus;
}

export function StoreChrome({ children, categories, menus }: StoreChromeProps) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <StoreHeader categories={categories} menus={menus} />
      {children}
      <StoreFooter categories={categories} menus={menus} />
      <SpinWheelPopup />
      <WhatsAppFloat />
    </>
  );
}
