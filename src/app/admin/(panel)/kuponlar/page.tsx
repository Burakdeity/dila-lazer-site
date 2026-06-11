import Link from "next/link";
import { Plus, Ticket } from "lucide-react";
import { getAllCoupons } from "@/lib/coupon-store";
import { CouponActions } from "@/components/admin/coupon-actions";
import {
  AdminPageHeader, AdminCard, AdminTable, AdminTh, AdminTd, AdminTr,
  AdminBadge, AdminEmpty,
} from "@/components/admin/admin-ui";

export default async function AdminCouponsPage() {
  const coupons = await getAllCoupons();

  return (
    <div>
      <AdminPageHeader
        title="Kuponlar"
        description={`${coupons.length} kupon`}
        action={
          <Link href="/admin/kuponlar/yeni" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-red text-white font-semibold hover:bg-brand-red/90">
            <Plus className="h-4 w-4" /> Yeni Kupon
          </Link>
        }
      />

      {coupons.length === 0 ? (
        <AdminEmpty icon={Ticket} title="Henüz kupon yok" actionHref="/admin/kuponlar/yeni" actionLabel="İlk kuponu oluştur" />
      ) : (
        <AdminCard>
          <AdminTable>
            <thead>
              <tr className="border-b border-white/10">
                <AdminTh>Kod</AdminTh>
                <AdminTh>İndirim</AdminTh>
                <AdminTh className="hidden sm:table-cell">Min. Sipariş</AdminTh>
                <AdminTh>Kullanım</AdminTh>
                <AdminTh>Durum</AdminTh>
                <AdminTh className="text-right">İşlem</AdminTh>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <AdminTr key={c.id}>
                  <AdminTd><span className="text-white font-mono font-semibold">{c.code}</span></AdminTd>
                  <AdminTd className="text-gray-300">
                    {c.discountType === "percent" ? `%${c.discountValue}` : `₺${c.discountValue}`}
                  </AdminTd>
                  <AdminTd className="hidden sm:table-cell text-gray-400">
                    {c.minOrder ? `₺${c.minOrder}` : "—"}
                  </AdminTd>
                  <AdminTd className="text-gray-300">
                    {c.usedCount}{c.usageLimit ? ` / ${c.usageLimit}` : ""}
                  </AdminTd>
                  <AdminTd>
                    <AdminBadge variant={c.isActive ? "success" : "default"}>
                      {c.isActive ? "Aktif" : "Pasif"}
                    </AdminBadge>
                  </AdminTd>
                  <AdminTd className="text-right">
                    <CouponActions id={c.id} isActive={c.isActive} />
                  </AdminTd>
                </AdminTr>
              ))}
            </tbody>
          </AdminTable>
        </AdminCard>
      )}
    </div>
  );
}
