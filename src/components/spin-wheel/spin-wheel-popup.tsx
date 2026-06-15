"use client";

import { useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { SpinWheelWidget } from "@/components/spin-wheel/spin-wheel-widget";
import type { SpinWheelStatus } from "@/types/spin-wheel";

const STORAGE_KEY = "spin-wheel-popup-seen";
const HIDDEN_PREFIXES = ["/admin", "/giris", "/kayit", "/odeme", "/sans-carki"];

export function SpinWheelPopup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  const dismiss = useCallback(() => {
    setOpen(false);
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const hidden = HIDDEN_PREFIXES.some((p) => pathname.startsWith(p));
    if (hidden) return;

    let seen = false;
    try {
      seen = sessionStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      /* ignore */
    }
    if (seen) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    (async () => {
      try {
        const res = await fetch("/api/spin-wheel");
        if (!res.ok || cancelled) return;
        const data = (await res.json()) as SpinWheelStatus;
        if (!data.isActive || cancelled) return;

        setReady(true);
        timer = setTimeout(() => {
          if (!cancelled) setOpen(true);
        }, 1200);
      } catch {
        /* ignore */
      }
    })();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, dismiss]);

  if (!ready) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Şans Çarkı"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
        >
          <button
            type="button"
            aria-label="Kapat"
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            onClick={dismiss}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            className="relative w-full max-w-md max-h-[min(92vh,720px)] overflow-y-auto overscroll-contain"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={dismiss}
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/50 border border-white/10 text-white/80 hover:text-white hover:bg-black/70 transition-colors"
              aria-label="Kapat"
            >
              <X className="h-5 w-5" />
            </button>

            <SpinWheelWidget compact />

            <button
              type="button"
              onClick={dismiss}
              className="mt-3 w-full py-2.5 text-sm text-white/50 hover:text-white/80 transition-colors"
            >
              Daha sonra
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
