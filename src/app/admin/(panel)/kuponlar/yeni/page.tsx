import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CouponForm } from "@/components/admin/coupon-form";
import { AdminPageHeader } from "@/components/admin/admin-ui";

export default function NewCouponPage() {
  return (
    <div>
      <Link href="/admin/kuponlar" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white mb-4">
        <ArrowLeft className="h-4 w-4" /> Kuponlara dön
      </Link>
      <AdminPageHeader title="Yeni Kupon" description="İndirim kuponu oluşturun" />
      <CouponForm />
    </div>
  );
}
