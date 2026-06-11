import Link from "next/link";
import { ProductImage } from "@/components/shared/product-image";
import { AlertTriangle } from "lucide-react";
import { getAllProductsFromStore } from "@/lib/product-store";
import { formatPrice } from "@/lib/utils";
import {
  AdminPageHeader, AdminCard, AdminTable, AdminTh, AdminTd, AdminTr,
  AdminBadge, AdminStatCard,
} from "@/components/admin/admin-ui";

export default async function AdminStockPage() {
  const products = await getAllProductsFromStore();
  const sorted = [...products].sort((a, b) => a.stock - b.stock);
  const lowStock = products.filter((p) => p.stock <= 3);
  const outOfStock = products.filter((p) => p.stock === 0);
  const totalUnits = products.reduce((s, p) => s + p.stock, 0);

  return (
    <div>
      <AdminPageHeader
        title="Stok Yönetimi"
        description="Ürün stok durumlarını takip edin"
        action={
          <Link href="/admin/urunler" className="text-sm text-brand-red hover:underline">
            Ürünleri düzenle →
          </Link>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <AdminStatCard label="Toplam Stok Adedi" value={totalUnits} />
        <AdminStatCard label="Ürün Çeşidi" value={products.length} accent="blue" />
        <AdminStatCard label="Düşük Stok (≤3)" value={lowStock.length} accent="amber" />
        <AdminStatCard label="Tükenen" value={outOfStock.length} accent="red" />
      </div>

      {lowStock.length > 0 && (
        <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0" />
          <p className="text-sm text-amber-200">
            {lowStock.length} ürünün stoğu kritik seviyede. Stok güncellemek için ürünü düzenleyin.
          </p>
        </div>
      )}

      <AdminCard>
        <AdminTable>
          <thead>
            <tr className="border-b border-white/10">
              <AdminTh>Ürün</AdminTh>
              <AdminTh>Stok</AdminTh>
              <AdminTh className="hidden sm:table-cell">Fiyat</AdminTh>
              <AdminTh className="hidden md:table-cell">Teslimat</AdminTh>
              <AdminTh>İşlem</AdminTh>
            </tr>
          </thead>
          <tbody>
            {sorted.map((p) => (
              <AdminTr key={p.id}>
                <AdminTd>
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-black/40 flex-shrink-0">
                      {p.images[0] && <ProductImage src={p.images[0]} alt="" fill className="object-cover" sizes="40px" />}
                    </div>
                    <p className="text-white font-medium truncate max-w-[200px]">{p.name}</p>
                  </div>
                </AdminTd>
                <AdminTd>
                  <AdminBadge variant={p.stock === 0 ? "danger" : p.stock <= 3 ? "warning" : "success"}>
                    {p.stock} adet
                  </AdminBadge>
                </AdminTd>
                <AdminTd className="hidden sm:table-cell text-gray-300">{formatPrice(p.salePrice ?? p.basePrice)}</AdminTd>
                <AdminTd className="hidden md:table-cell text-gray-400">{p.deliveryDays} gün</AdminTd>
                <AdminTd>
                  <Link href={`/admin/urunler/${p.id}`} className="text-xs text-brand-red hover:underline">
                    Düzenle
                  </Link>
                </AdminTd>
              </AdminTr>
            ))}
          </tbody>
        </AdminTable>
      </AdminCard>
    </div>
  );
}
