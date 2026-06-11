import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Pencil, Plus } from "lucide-react";
import { getMainCategories } from "@/lib/catalog";
import { getAllProductsFromStore } from "@/lib/product-store";
import { AdminPageHeader, AdminCard, AdminStatCard } from "@/components/admin/admin-ui";

export default async function AdminCategoriesPage() {
  const categories = await getMainCategories();
  const products = await getAllProductsFromStore();

  const countByCategory = new Map<string, number>();
  for (const p of products) {
    countByCategory.set(p.categorySlug, (countByCategory.get(p.categorySlug) ?? 0) + 1);
  }

  return (
    <div>
      <AdminPageHeader
        title="Kategoriler"
        description={`${categories.length} ana kategori, ${categories.reduce((s, c) => s + c.subcategories.length, 0)} alt kategori`}
        action={
          <Link href="/admin/kategoriler/yeni" className="inline-flex items-center gap-2 px-4 py-2 bg-brand-red text-white text-sm font-medium rounded-xl hover:bg-brand-red/90">
            <Plus className="h-4 w-4" /> Yeni Kategori
          </Link>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <AdminStatCard label="Ana Kategori" value={categories.length} />
        <AdminStatCard label="Alt Kategori" value={categories.reduce((s, c) => s + c.subcategories.length, 0)} accent="blue" />
        <AdminStatCard label="Toplam Ürün" value={products.length} accent="green" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat) => (
          <AdminCard key={cat.slug} className="overflow-hidden">
            <div className="flex gap-4 p-5">
              <div className="relative h-20 w-20 rounded-xl overflow-hidden flex-shrink-0 bg-black/40">
                <Image src={cat.image} alt="" fill className="object-cover" sizes="80px" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-white font-semibold">{cat.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{cat.slug}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Link href={`/admin/kategoriler/${cat.id}`} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5" title="Düzenle">
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <Link href={`/kategori/${cat.slug}`} target="_blank" className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5">
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
                <p className="text-sm text-gray-400 mt-2 line-clamp-2">{cat.description}</p>
                <p className="text-xs text-brand-red mt-2 font-medium">
                  {countByCategory.get(cat.slug) ?? 0} ürün · {cat.subcategories.length} alt kategori
                </p>
              </div>
            </div>
            <div className="px-5 pb-5">
              <div className="flex flex-wrap gap-1.5">
                {cat.subcategories.map((sub) => (
                  <span key={sub.slug} className="px-2 py-1 rounded-lg bg-white/5 text-xs text-gray-400 border border-white/10">
                    {sub.name}
                  </span>
                ))}
              </div>
            </div>
          </AdminCard>
        ))}
      </div>
    </div>
  );
}
