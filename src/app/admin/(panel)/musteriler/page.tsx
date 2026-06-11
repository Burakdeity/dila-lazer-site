import { Users } from "lucide-react";
import { getCustomers } from "@/lib/user-store";
import {
  AdminPageHeader, AdminCard, AdminTable, AdminTh, AdminTd, AdminTr,
  AdminBadge, AdminEmpty, AdminStatCard,
} from "@/components/admin/admin-ui";

const tierLabels: Record<string, string> = {
  BRONZE: "Bronz",
  SILVER: "Gümüş",
  GOLD: "Altın",
  PLATINUM: "Platin",
};

export default async function AdminCustomersPage() {
  const customers = await getCustomers();

  return (
    <div>
      <AdminPageHeader
        title="Müşteriler"
        description={`${customers.length} kayıtlı müşteri`}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <AdminStatCard label="Toplam Müşteri" value={customers.length} />
        <AdminStatCard
          label="Toplam Puan"
          value={customers.reduce((s, c) => s + c.points, 0)}
          accent="amber"
        />
        <AdminStatCard
          label="Altın Üye"
          value={customers.filter((c) => c.loyaltyTier === "GOLD" || c.loyaltyTier === "PLATINUM").length}
          accent="green"
        />
      </div>

      {customers.length === 0 ? (
        <AdminEmpty icon={Users} title="Henüz müşteri yok" description="Kayıt olan kullanıcılar burada listelenir." />
      ) : (
        <AdminCard>
          <AdminTable>
            <thead>
              <tr className="border-b border-white/10">
                <AdminTh>Müşteri</AdminTh>
                <AdminTh className="hidden md:table-cell">E-posta</AdminTh>
                <AdminTh>Üyelik</AdminTh>
                <AdminTh>Puan</AdminTh>
                <AdminTh className="hidden sm:table-cell">Kayıt Tarihi</AdminTh>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <AdminTr key={c.id}>
                  <AdminTd>
                    <p className="text-white font-medium">{c.name}</p>
                  </AdminTd>
                  <AdminTd className="hidden md:table-cell text-gray-400">{c.email}</AdminTd>
                  <AdminTd>
                    <AdminBadge variant={c.loyaltyTier === "GOLD" ? "warning" : "default"}>
                      {tierLabels[c.loyaltyTier] ?? c.loyaltyTier}
                    </AdminBadge>
                  </AdminTd>
                  <AdminTd className="text-white">{c.points}</AdminTd>
                  <AdminTd className="hidden sm:table-cell text-gray-400">
                    {new Date(c.createdAt).toLocaleDateString("tr-TR")}
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
