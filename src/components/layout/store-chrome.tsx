"use client";

import { usePathname } from "next/navigation";
import { StoreHeader } from "@/components/layout/store-header";
import { StoreFooter } from "@/components/layout/store-footer";
import { WhatsAppFloat } from "@/components/shared/whatsapp-float";
import { SocialProofToast } from "@/components/shared/social-proof";

export function StoreChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <StoreHeader />
      {children}
      <StoreFooter />
      <SocialProofToast />
      <WhatsAppFloat />
    </>
  );
}
