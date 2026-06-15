"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useThemeStore } from "@/store/theme";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore((s) => s.theme);
  const pathname = usePathname();

  useEffect(() => {
    const isAdmin = pathname?.startsWith("/admin");
    document.documentElement.setAttribute("data-theme", isAdmin ? theme : "light");
  }, [theme, pathname]);

  return <>{children}</>;
}
