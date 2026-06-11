import { ShoppingCart } from "lucide-react";
import { getAllOrders, getOrderStats } from "@/lib/order-store";
import { formatPrice } from "@/lib/utils";
import { ORDER_STATUS_LABELS } from "@/types/admin";
import { OrderStatusSelect } from "@/components/admin/order-status-select";
import {
  AdminPageHeader, AdminCard, AdminTable, AdminTh, AdminTd, AdminTr,
  AdminBadge, AdminEmpty, AdminStatCard,
} from "@/components/admin/admin-ui";

const statusVariant = {
  pending: "warning",
  confirmed: "info",
  production: "info",
  shipped: "default",
  delivered: "success",
  cancelled: "danger",
} as const;

export default async function AdminOrdersPage() {
  const orders = await getAllOrders();
  const stats = await getOrderStats();

  return (
    <div>
      <AdminPageHeader title="Siparişler" description={`${stats.total} sipariş`} />

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <AdminStatCard label="Toplam Sipariş" value={stats.total} />
        <AdminStatCard label="Bekleyen" value={stats.pending} accent="amber" />
        <AdminStatCard label="Aktif" value={stats.active} accent="blue" />
        <AdminStatCard label="Toplam Ciro" value={formatPrice(stats.totalRevenue)} accent="green" />
      </div>

      {orders.length === 0 ? (
        <AdminEmpty icon={ShoppingCart} title="Henüz sipariş yok" />
      ) : (
        <AdminCard>
          <AdminTable>
            <thead>
              <tr className="border-b border-white/10">
                <AdminTh>Sipariş</AdminTh>
                <AdminTh className="hidden md:table-cell">Müşteri</AdminTh>
                <AdminTh>Ürün</AdminTh>
                <AdminTh>Tutar</AdminTh>
                <AdminTh>Durum</AdminTh>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <AdminTr key={o.id}>
                  <AdminTd>
                    <p className="text-white font-medium">{o.orderNo}</p>
                    <p className="text-xs text-gray-500">{new Date(o.createdAt).toLocaleDateString("tr-TR")}</p>
                  </AdminTd>
                  <AdminTd className="hidden md:table-cell">
                    <p className="text-white">{o.customerName}</p>
                    <p className="text-xs text-gray-500">{o.customerEmail}</p>
                  </AdminTd>
                  <AdminTd className="text-gray-300 max-w-[180px] truncate">{o.productName}</AdminTd>
                  <AdminTd className="text-white font-medium">{formatPrice(o.amount)}</AdminTd>
                  <AdminTd>
                    <div className="flex flex-col gap-2">
                      <AdminBadge variant={statusVariant[o.status]}>
                        {ORDER_STATUS_LABELS[o.status]}
                      </AdminBadge>
                      <OrderStatusSelect orderId={o.id} current={o.status} />
                    </div>
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
