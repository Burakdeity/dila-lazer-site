import Link from "next/link";
import { ProductImage } from "@/components/shared/product-image";
import { Plus, Package } from "lucide-react";
import { getAllProductsFromStore } from "@/lib/product-store";
import { getMainCategories } from "@/lib/catalog";
import { formatPrice } from "@/lib/utils";
import { ProductActions } from "@/components/admin/product-actions";

export default async function AdminProductsPage() {
  const products = await getAllProductsFromStore();
  const categories = await getMainCategories();

  const categoryMap = new Map(categories.map((c) => [c.slug, c.name]));

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Ürünler</h1>
          <p className="text-sm text-gray-400 mt-1">{products.length} ürün listeleniyor</p>
        </div>
        <Link
          href="/admin/urunler/yeni"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-red text-white font-semibold hover:bg-brand-red/90 neon-btn-glow"
        >
          <Plus className="h-4 w-4" />
          Yeni Ürün
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl bg-white/5 border border-white/10">
          <Package className="h-12 w-12 text-gray-600 mb-4" />
          <p className="text-gray-400 mb-4">Henüz ürün eklenmemiş</p>
          <Link
            href="/admin/urunler/yeni"
            className="text-brand-red hover:underline text-sm font-medium"
          >
            İlk ürünü ekle →
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-gray-400">
                  <th className="px-4 py-3 font-medium">Ürün</th>
                  <th className="px-4 py-3 font-medium hidden md:table-cell">Kategori</th>
                  <th className="px-4 py-3 font-medium">Fiyat</th>
                  <th className="px-4 py-3 font-medium hidden sm:table-cell">Stok</th>
                  <th className="px-4 py-3 font-medium hidden lg:table-cell">Durum</th>
                  <th className="px-4 py-3 font-medium text-right">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-black/40 flex-shrink-0">
                          {product.images[0] ? (
                            <ProductImage
                              src={product.images[0]}
                              alt=""
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-gray-600">
                              <Package className="h-5 w-5" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-white font-medium truncate max-w-[200px]">{product.name}</p>
                          <p className="text-xs text-gray-500 truncate">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-400 hidden md:table-cell">
                      {categoryMap.get(product.categorySlug) ?? product.categorySlug}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-white">{formatPrice(product.salePrice ?? product.basePrice)}</span>
                      {product.salePrice && (
                        <span className="block text-xs text-gray-500 line-through">
                          {formatPrice(product.basePrice)}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className={product.stock > 0 ? "text-green-400" : "text-red-400"}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {product.isFeatured && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] bg-brand-red/20 text-brand-red">
                            Öne Çıkan
                          </span>
                        )}
                        {product.badges.slice(0, 2).map((b) => (
                          <span
                            key={b}
                            className="px-2 py-0.5 rounded-full text-[10px] bg-white/10 text-gray-300"
                          >
                            {b}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <ProductActions id={product.id} slug={product.slug} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
