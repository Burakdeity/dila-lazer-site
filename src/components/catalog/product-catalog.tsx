"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, Grid3X3, X } from "lucide-react";
import type { Product, MainCategory } from "@/types/catalog";
import { StoreProductCard } from "@/components/catalog/store-product-card";
import { CatalogBreadcrumb, type BreadcrumbItem } from "@/components/catalog/catalog-breadcrumb";

type SortKey = "default" | "bestseller" | "new" | "price-asc" | "price-desc";

const sortOptions: { value: SortKey; label: string }[] = [
  { value: "default", label: "Önerilen" },
  { value: "bestseller", label: "Çok Satanlar" },
  { value: "new", label: "Yeni Eklenenler" },
  { value: "price-asc", label: "Fiyat: Düşükten Yükseğe" },
  { value: "price-desc", label: "Fiyat: Yüksekten Düşüğe" },
];

interface ProductCatalogProps {
  products: Product[];
  categories: MainCategory[];
  title: string;
  description?: string;
  breadcrumbs: BreadcrumbItem[];
  activeCategorySlug?: string;
  activeSubcategorySlug?: string;
  subcategoryLinks?: { name: string; slug: string; href: string }[];
}

function sortProducts(list: Product[], sort: SortKey): Product[] {
  const arr = [...list];
  switch (sort) {
    case "bestseller":
      return arr.sort((a, b) => {
        const aB = a.badges.includes("bestseller") ? 1 : 0;
        const bB = b.badges.includes("bestseller") ? 1 : 0;
        return bB - aB || b.rating - a.rating;
      });
    case "new":
      return arr.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    case "price-asc":
      return arr.sort(
        (a, b) => (a.salePrice ?? a.basePrice) - (b.salePrice ?? b.basePrice)
      );
    case "price-desc":
      return arr.sort(
        (a, b) => (b.salePrice ?? b.basePrice) - (a.salePrice ?? a.basePrice)
      );
    default:
      return arr;
  }
}

export function ProductCatalog({
  products,
  categories,
  title,
  description,
  breadcrumbs,
  activeCategorySlug,
  activeSubcategorySlug,
  subcategoryLinks,
}: ProductCatalogProps) {
  const searchParams = useSearchParams();
  const queryFromUrl = searchParams.get("q")?.toLowerCase() ?? "";
  const sortFromUrl = (searchParams.get("sort") as SortKey) || "default";

  const [sort, setSort] = useState<SortKey>(sortOptions.some((o) => o.value === sortFromUrl) ? sortFromUrl : "default");
  const [mobileFilters, setMobileFilters] = useState(false);
  const [onlySale, setOnlySale] = useState(false);
  const [onlyNew, setOnlyNew] = useState(false);

  const filtered = useMemo(() => {
    let list = products;

    if (queryFromUrl) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(queryFromUrl) ||
          p.shortDesc.toLowerCase().includes(queryFromUrl)
      );
    }
    if (onlySale) list = list.filter((p) => !!p.salePrice);
    if (onlyNew) list = list.filter((p) => p.badges.includes("new"));

    return sortProducts(list, sort);
  }, [products, queryFromUrl, onlySale, onlyNew, sort]);

  const sidebar = (
    <aside className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <h3 className="font-bold text-brand-black text-sm uppercase tracking-wide mb-4">Kategoriler</h3>
        <ul className="space-y-1">
          <li>
            <Link
              href="/urunler"
              className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                !activeCategorySlug
                  ? "bg-brand-red/8 text-brand-red font-semibold"
                  : "text-gray-600 hover:bg-gray-50 hover:text-brand-black"
              }`}
            >
              Tüm Ürünler
            </Link>
          </li>
          {categories.map((cat) => (
            <li key={cat.id}>
              <Link
                href={`/kategori/${cat.slug}`}
                className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeCategorySlug === cat.slug
                    ? "bg-brand-red/8 text-brand-red font-semibold"
                    : "text-gray-600 hover:bg-gray-50 hover:text-brand-black"
                }`}
              >
                {cat.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <h3 className="font-bold text-brand-black text-sm uppercase tracking-wide mb-4">Filtreler</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={onlySale}
              onChange={(e) => setOnlySale(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-brand-red focus:ring-brand-red/20"
            />
            <span className="text-sm text-gray-600 group-hover:text-brand-black">İndirimli ürünler</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={onlyNew}
              onChange={(e) => setOnlyNew(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-brand-red focus:ring-brand-red/20"
            />
            <span className="text-sm text-gray-600 group-hover:text-brand-black">Yeni ürünler</span>
          </label>
        </div>
      </div>

      <div className="bg-gradient-to-br from-brand-red to-red-700 rounded-2xl p-5 text-white">
        <p className="font-bold text-sm mb-1">Kendin Tasarla</p>
        <p className="text-xs text-white/80 mb-3 leading-relaxed">
          Logonuzla kendi neon tabelanızı tasarlayın.
        </p>
        <Link
          href="/ozel-tasarim-merkezi"
          className="inline-block text-xs font-semibold bg-white text-brand-red px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          Tasarla →
        </Link>
      </div>
    </aside>
  );

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Üst banner */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4 py-8">
          <CatalogBreadcrumb items={breadcrumbs} />
          <h1 className="text-2xl sm:text-3xl font-bold text-brand-black tracking-tight">{title}</h1>
          {description && (
            <p className="text-gray-500 mt-2 max-w-2xl text-sm sm:text-base">{description}</p>
          )}
          {queryFromUrl && (
            <p className="mt-3 text-sm text-brand-red font-medium">
              &ldquo;{searchParams.get("q")}&rdquo; için {filtered.length} sonuç
            </p>
          )}
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 py-6">
        {/* Alt kategori şeridi */}
        {subcategoryLinks && subcategoryLinks.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            <Link
              href={activeCategorySlug ? `/kategori/${activeCategorySlug}` : "/urunler"}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                !activeSubcategorySlug
                  ? "bg-brand-red text-white border-brand-red"
                  : "bg-white text-gray-600 border-gray-200 hover:border-brand-red/30"
              }`}
            >
              Tümü
            </Link>
            {subcategoryLinks.map((sub) => (
              <Link
                key={sub.slug}
                href={sub.href}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  activeSubcategorySlug === sub.slug
                    ? "bg-brand-red text-white border-brand-red"
                    : "bg-white text-gray-600 border-gray-200 hover:border-brand-red/30"
                }`}
              >
                {sub.name}
              </Link>
            ))}
          </div>
        )}

        <div className="flex gap-6 lg:gap-8">
          {/* Sidebar desktop */}
          <div className="hidden lg:block w-64 shrink-0">{sidebar}</div>

          {/* Ana içerik */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5 p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMobileFilters(true)}
                  className="lg:hidden flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filtrele
                </button>
                <span className="text-sm text-gray-500">
                  <strong className="text-brand-black font-semibold">{filtered.length}</strong> ürün
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Grid3X3 className="h-4 w-4 text-gray-400 hidden sm:block" />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="h-10 pl-3 pr-8 rounded-lg border border-gray-200 text-sm text-gray-700 bg-white focus:outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/10 cursor-pointer"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Aktif filtreler */}
            {(onlySale || onlyNew) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {onlySale && (
                  <button
                    onClick={() => setOnlySale(false)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-red/10 text-brand-red text-xs font-medium"
                  >
                    İndirimli <X className="h-3 w-3" />
                  </button>
                )}
                {onlyNew && (
                  <button
                    onClick={() => setOnlyNew(false)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-red/10 text-brand-red text-xs font-medium"
                  >
                    Yeni <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            )}

            {filtered.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {filtered.map((product) => (
                  <StoreProductCard key={product.id} product={product} showQuickAdd />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white border border-gray-200 rounded-2xl">
                <p className="text-gray-500 mb-4">Aradığınız kriterlere uygun ürün bulunamadı.</p>
                <Link href="/urunler" className="text-brand-red font-medium text-sm hover:underline">
                  Tüm ürünlere göz atın →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobil filtre drawer */}
      {mobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFilters(false)} />
          <div className="absolute inset-y-0 left-0 w-[min(100%,320px)] bg-gray-50 p-5 overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-brand-black">Filtreler</h2>
              <button onClick={() => setMobileFilters(false)} className="p-2 hover:bg-gray-200 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>
            {sidebar}
          </div>
        </div>
      )}
    </div>
  );
}
