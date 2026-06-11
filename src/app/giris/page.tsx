import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Giriş Yap",
  description: "Dila Lazer hesabınıza e-posta ve şifre ile giriş yapın.",
};

export default function LoginPage() {
  return (
    <div className="min-h-[70vh] bg-gray-50 flex items-center justify-center py-12 px-4">
      <Suspense fallback={<div className="text-gray-500">Yükleniyor...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
