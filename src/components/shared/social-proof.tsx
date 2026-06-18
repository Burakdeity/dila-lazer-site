"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X } from "lucide-react";

const recentOrders = [
  { name: "Mehmet Y.", cityFrom: "İstanbul'dan", product: "3D Neon Logo", time: "35 dk önce" },
  { name: "Selin A.", cityFrom: "Ankara'dan", product: "LED Kutu Harfsı", time: "1 saat önce" },
  { name: "Ahmet K.", cityFrom: "İzmir'den", product: "Cafe Neon LEDsı", time: "2 saat önce" },
  { name: "Burak T.", cityFrom: "Bursa'dan", product: "Pleksi İşletme Levhası", time: "4 saat önce" },
  { name: "Elif S.", cityFrom: "Antalya'dan", product: "Neon Duvar", time: "Dün" },
  { name: "Can D.", cityFrom: "Gaziantep'ten", product: "Özel Tasarım Neon", time: "2 gün önce" },
  { name: "Zeynep M.", cityFrom: "Kocaeli'den", product: "RGB Neon LED", time: "3 gün önce" },
];

const HIDDEN_PATHS = ["/admin", "/odeme", "/giris", "/kayit"];

export function SocialProofToast() {
  const pathname = usePathname();
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const hidden = HIDDEN_PATHS.some((p) => pathname.startsWith(p));

  useEffect(() => {
    if (hidden || dismissed) return;

    const showTimer = setTimeout(() => setVisible(true), 6000);

    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % recentOrders.length);
        setVisible(true);
      }, 400);
    }, 12000);

    return () => {
      clearTimeout(showTimer);
      clearInterval(interval);
    };
  }, [hidden, dismissed]);

  if (hidden || dismissed) return null;

  const order = recentOrders[index];

  return (
    <div className="fixed bottom-5 left-4 sm:bottom-6 sm:left-6 z-40 max-w-[min(100vw-2rem,20rem)]">
      <AnimatePresence mode="wait">
        {visible && (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -16, y: 12 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.35 }}
            className="relative bg-white border border-gray-200 shadow-lg rounded-2xl p-3.5 sm:p-4 flex items-center gap-3"
          >
            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="absolute top-2 right-2 p-1 rounded-md text-gray-300 hover:text-gray-500 hover:bg-gray-50"
              aria-label="Kapat"
            >
              <X className="h-3.5 w-3.5" />
            </button>
            <div className="p-2 rounded-lg bg-brand-red/10 shrink-0">
              <ShoppingBag className="h-4 w-4 text-brand-red" />
            </div>
            <div className="pr-5 min-w-0">
              <p className="text-sm text-brand-black leading-snug">
                <span className="font-semibold">{order.name}</span>
                <span className="text-gray-500">, {order.cityFrom} </span>
                <span className="font-medium">{order.product}</span> sipariş etti
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{order.time}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
