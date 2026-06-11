"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { User } from "lucide-react";

export function AccountLink() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center gap-1 text-gray-400 min-w-[52px]">
        <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse" />
        <span className="text-[10px]">...</span>
      </div>
    );
  }

  if (!session) {
    return (
      <Link
        href="/giris"
        className="flex flex-col items-center gap-1 text-gray-600 hover:text-brand-red transition-colors min-w-[52px]"
      >
        <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center bg-gray-50">
          <User className="h-4 w-4" />
        </div>
        <span className="text-[10px] font-medium">Giriş Yap</span>
      </Link>
    );
  }

  return (
    <Link
      href="/hesabim"
      className="flex flex-col items-center gap-1 text-gray-600 hover:text-brand-red transition-colors min-w-[52px]"
      title={session.user?.email || ""}
    >
      <div className="w-8 h-8 rounded-full bg-brand-red text-white text-xs font-bold flex items-center justify-center shadow-sm">
        {(session.user?.name || "K").charAt(0).toUpperCase()}
      </div>
      <span className="text-[10px] font-medium max-w-[60px] truncate">
        {session.user?.name?.split(" ")[0] || "Hesabım"}
      </span>
    </Link>
  );
}
