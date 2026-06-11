import { getAllOrders, getOrderStats } from "@/lib/order-store";
import { formatPrice } from "@/lib/utils";
import { ORDER_STATUS_LABELS } from "@/types/admin";
import {
  AdminPageHeader, AdminCard, AdminTable, AdminTh, AdminTd, AdminTr,
  AdminBadge, AdminStatCard,
} from "@/components/admin/admin-ui";

export default async function AdminAccountingPage() {
  const orders = await getAllOrders();
  const stats = await getOrderStats();

  const delivered = orders.filter((o) => o.status === "delivered");
  const deliveredRevenue = delivered.reduce((s, o) => s + o.amount, 0);
  const cancelled = orders.filter((o) => o.status === "cancelled").length;
  const avgOrder = stats.total > 0 ? Math.round(stats.totalRevenue / stats.total) : 0;

  const monthlyMap = new Map<string, number>();
  for (const o of orders) {
    if (o.status === "cancelled") continue;
    const month = new Date(o.createdAt).toLocaleDateString("tr-TR", { month: "long", year: "numeric" });
    monthlyMap.set(month, (monthlyMap.get(month) ?? 0) + o.amount);
  }
  const monthly = [...monthlyMap.entries()].sort((a, b) => b[1] - a[1]);

  return (
    <div>
      <AdminPageHeader title="Muhasebe" description="Satış ve gelir özeti" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <AdminStatCard label="Toplam Ciro" value={formatPrice(stats.totalRevenue)} accent="green" />
        <AdminStatCard label="Teslim Edilen" value={formatPrice(deliveredRevenue)} accent="blue" />
        <AdminStatCard label="Ortalama Sipariş" value={formatPrice(avgOrder)} />
        <AdminStatCard label="İptal Edilen" value={cancelled} accent="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminCard title="Aylık Gelir">
          <div className="p-5 space-y-3">
            {monthly.map(([month, amount]) => (
              <div key={month} className="flex items-center justify-between p-3 rounded-xl bg-black/20">
                <span className="text-sm text-gray-400">{month}</span>
                <span className="text-sm text-white font-semibold">{formatPrice(amount)}</span>
              </div>
            ))}
          </div>
        </AdminCard>

        <AdminCard title="Son İşlemler">
          <AdminTable>
            <thead>
              <tr className="border-b border-white/10">
                <AdminTh>Sipariş</AdminTh>
                <AdminTh>Tutar</AdminTh>
                <AdminTh>Durum</AdminTh>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 8).map((o) => (
                <AdminTr key={o.id}>
                  <AdminTd>
                    <p className="text-white text-sm">{o.orderNo}</p>
                    <p className="text-xs text-gray-500">{o.customerName}</p>
                  </AdminTd>
                  <AdminTd className="text-white">{formatPrice(o.amount)}</AdminTd>
                  <AdminTd>
                    <AdminBadge variant={o.status === "delivered" ? "success" : o.status === "cancelled" ? "danger" : "default"}>
                      {ORDER_STATUS_LABELS[o.status]}
                    </AdminBadge>
                  </AdminTd>
                </AdminTr>
              ))}
            </tbody>
          </AdminTable>
        </AdminCard>
      </div>
    </div>
  );
}
