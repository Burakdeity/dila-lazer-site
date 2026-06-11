import Link from "next/link";
import { Package, Plus, ShoppingCart, Users, FileText, TrendingUp } from "lucide-react";
import { getAllProductsFromStore } from "@/lib/product-store";
import { getAllOrders, getOrderStats } from "@/lib/order-store";
import { getCustomers } from "@/lib/user-store";
import { getQuoteStats } from "@/lib/quote-store";
import { formatPrice } from "@/lib/utils";
import { ORDER_STATUS_LABELS } from "@/types/admin";
import { AdminStatCard, AdminCard, AdminBadge } from "@/components/admin/admin-ui";

export default async function AdminDashboard() {
  const [products, orders, customers, orderStats, quoteStats] = await Promise.all([
    getAllProductsFromStore(),
    getAllOrders(),
    getCustomers(),
    getOrderStats(),
    getQuoteStats(),
  ]);

  const lowStock = products.filter((p) => p.stock <= 3).length;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <Link
          href="/admin/urunler/yeni"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-red text-white text-sm font-semibold hover:bg-brand-red/90"
        >
          <Plus className="h-4 w-4" />
          Yeni Ürün Ekle
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <AdminStatCard label="Toplam Ürün" value={products.length} />
        <AdminStatCard label="Sipariş" value={orderStats.total} accent="blue" />
        <AdminStatCard label="Müşteri" value={customers.length} accent="green" />
        <AdminStatCard label="Yeni Teklif" value={quoteStats.new} accent="amber" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <AdminStatCard label="Toplam Ciro" value={formatPrice(orderStats.totalRevenue)} accent="green" />
        <AdminStatCard label="Düşük Stok" value={lowStock} accent="amber" />
        <AdminStatCard label="Bekleyen Sipariş" value={orderStats.pending} accent="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminCard title="Son Siparişler">
          <div className="p-5 space-y-3">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 rounded-xl bg-black/20">
                <div>
                  <p className="text-sm text-white font-medium">{order.orderNo}</p>
                  <p className="text-xs text-gray-400">{order.customerName} — {order.productName}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-white">{formatPrice(order.amount)}</p>
                  <AdminBadge variant="info">{ORDER_STATUS_LABELS[order.status]}</AdminBadge>
                </div>
              </div>
            ))}
            <Link href="/admin/siparisler" className="block text-center text-sm text-brand-red hover:underline pt-2">
              Tüm siparişler →
            </Link>
          </div>
        </AdminCard>

        <AdminCard title="Hızlı Erişim">
          <div className="p-5 grid grid-cols-2 gap-3">
            {[
              { href: "/admin/urunler", label: "Ürünler", icon: Package },
              { href: "/admin/siparisler", label: "Siparişler", icon: ShoppingCart },
              { href: "/admin/musteriler", label: "Müşteriler", icon: Users },
              { href: "/admin/teklifler", label: "Teklifler", icon: FileText },
              { href: "/admin/stok", label: "Stok", icon: TrendingUp },
              { href: "/admin/muhasebe", label: "Muhasebe", icon: TrendingUp },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 p-4 rounded-xl bg-black/20 hover:bg-white/5 transition-colors"
              >
                <item.icon className="h-5 w-5 text-brand-red" />
                <span className="text-sm text-white font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </AdminCard>
      </div>
    </div>
  );
}
