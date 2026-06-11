import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Pencil, Plus } from "lucide-react";
import { getAllCampaignsFromStore } from "@/lib/campaign-store";
import { AdminPageHeader, AdminCard, AdminBadge, AdminStatCard } from "@/components/admin/admin-ui";

export default async function AdminCampaignsPage() {
  const campaigns = await getAllCampaignsFromStore();
  const active = campaigns.filter((c) => !c.endsAt || new Date(c.endsAt) >= new Date());

  return (
    <div>
      <AdminPageHeader
        title="Kampanyalar"
        description={`${campaigns.length} kampanya`}
        action={
          <Link href="/admin/kampanyalar/yeni" className="inline-flex items-center gap-2 px-4 py-2 bg-brand-red text-white text-sm font-medium rounded-xl hover:bg-brand-red/90">
            <Plus className="h-4 w-4" /> Yeni Kampanya
          </Link>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <AdminStatCard label="Toplam Kampanya" value={campaigns.length} />
        <AdminStatCard label="Aktif" value={active.length} accent="green" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {campaigns.map((c) => {
          const isActive = !c.endsAt || new Date(c.endsAt) >= new Date();
          return (
            <AdminCard key={c.id} className="overflow-hidden">
              <div className="relative h-36 bg-black/40">
                <Image src={c.image} alt="" fill className="object-cover" sizes="400px" />
                {c.discount && (
                  <span className="absolute top-3 left-3 px-2 py-1 rounded-full bg-brand-red text-white text-xs font-bold">
                    %{c.discount}
                  </span>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-white font-semibold">{c.title}</h3>
                    <p className="text-sm text-gray-400 mt-1">{c.subtitle}</p>
                  </div>
                  <AdminBadge variant={isActive ? "success" : "default"}>
                    {isActive ? "Aktif" : "Sona Erdi"}
                  </AdminBadge>
                </div>
                {c.endsAt && (
                  <p className="text-xs text-gray-500 mt-3">Bitiş: {new Date(c.endsAt).toLocaleDateString("tr-TR")}</p>
                )}
                <div className="flex items-center gap-3 mt-3">
                  <Link href={`/admin/kampanyalar/${c.id}`} className="inline-flex items-center gap-1 text-xs text-brand-red hover:underline">
                    <Pencil className="h-3 w-3" /> Düzenle
                  </Link>
                  <Link href={c.link} target="_blank" className="inline-flex items-center gap-1 text-xs text-gray-400 hover:underline">
                    Mağazada gör <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </AdminCard>
          );
        })}
      </div>
    </div>
  );
}
