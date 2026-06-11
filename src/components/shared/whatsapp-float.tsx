"use client";

import { getWhatsAppUrl } from "@/lib/utils";

export function WhatsAppFloat() {
  return (
    <a
      href={getWhatsAppUrl("Merhaba, ürünleriniz hakkında bilgi almak istiyorum.")}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center justify-center px-4 py-2.5 sm:px-5 sm:py-3 rounded-full bg-[#25D366] text-white text-sm sm:text-base font-semibold shadow-lg shadow-[#25D366]/35 hover:bg-[#20BD5A] hover:scale-105 transition-all"
      aria-label="WhatsApp ile iletişim"
    >
      WhatsApp
    </a>
  );
}
