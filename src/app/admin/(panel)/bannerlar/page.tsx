import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { getSettings } from "@/lib/settings-store";
import { AdminPageHeader, AdminCard, AdminBadge } from "@/components/admin/admin-ui";

export default async function AdminBannersPage() {
  const settings = await getSettings();

  return (
    <div>
      <AdminPageHeader
        title="Bannerlar"
        description={`${settings.banners.length} banner`}
        action={
          <Link href="/admin/ayarlar" className="text-sm text-brand-red hover:underline">
            Ayarlardan düzenle →
          </Link>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {settings.banners.map((b) => (
          <AdminCard key={b.id} className="overflow-hidden">
            <div className="relative h-40 bg-black/40">
              <Image src={b.image} alt="" fill className="object-cover" sizes="500px" />
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-white font-semibold">{b.title}</h3>
                  <p className="text-sm text-gray-400 mt-1">{b.subtitle}</p>
                  <p className="text-xs text-gray-500 mt-2 font-mono">{b.link}</p>
                </div>
                <AdminBadge variant={b.isActive ? "success" : "default"}>
                  {b.isActive ? "Aktif" : "Pasif"}
                </AdminBadge>
              </div>
              <Link href={b.link} target="_blank" className="inline-flex items-center gap-1 text-xs text-brand-red mt-3 hover:underline">
                Önizle <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </AdminCard>
        ))}
      </div>
    </div>
  );
}
