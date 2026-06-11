"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, signOut, getSession } from "next-auth/react";
import { Loader2, Mail, Lock } from "lucide-react";
import { BrandLogo } from "@/components/layout/brand-logo";
import { Button } from "@/components/ui/button";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("E-posta veya şifre hatalı");
        return;
      }

      const session = await getSession();
      if (session?.user?.role !== "ADMIN") {
        await signOut({ redirect: false });
        setError("Bu hesabın admin yetkisi yok. Lütfen admin e-postası ile giriş yapın.");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Giriş yapılırken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8">
        <div className="mb-6">
          <BrandLogo size="md" href={null} />
          <h1 className="text-xl font-bold text-brand-black mt-4">Admin Girişi</h1>
          <p className="text-xs text-gray-500 mt-1">Dila Lazer yönetim paneli</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Admin E-posta</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@dilalazer.com.tr"
                className="w-full pl-10 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-brand-black text-sm placeholder:text-gray-400 focus:outline-none focus:border-brand-red/50 focus:ring-2 focus:ring-brand-red/10"
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Şifre</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-brand-black text-sm placeholder:text-gray-400 focus:outline-none focus:border-brand-red/50 focus:ring-2 focus:ring-brand-red/10"
                autoComplete="current-password"
              />
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full neon-btn-glow" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Panele Giriş
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          <Link href="/" className="text-brand-red font-medium hover:underline">
            ← Siteye dön
          </Link>
        </p>
      </div>
    </div>
  );
}
