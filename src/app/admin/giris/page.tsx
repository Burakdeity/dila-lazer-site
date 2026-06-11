import type { Metadata } from "next";
import { AdminLoginForm } from "@/components/auth/admin-login-form";

export const metadata: Metadata = {
  title: "Admin Girişi",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center p-4">
      <div className="absolute inset-0 neon-grid opacity-20 pointer-events-none" aria-hidden />
      <AdminLoginForm />
    </div>
  );
}
