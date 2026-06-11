import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Kayıt Ol",
  description: "Dila Lazer'e ücretsiz üye olun.",
};

export default function RegisterPage() {
  return (
    <div className="min-h-[70vh] bg-gray-50 flex items-center justify-center py-12 px-4">
      <RegisterForm />
    </div>
  );
}
