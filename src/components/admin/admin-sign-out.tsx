"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function AdminSignOut() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/admin/giris" })}
      className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors mt-4"
    >
      <LogOut className="h-4 w-4" />
      Çıkış Yap
    </button>
  );
}
