import { getSettings } from "@/lib/settings-store";
import { SettingsForm } from "@/components/admin/settings-form";
import { AdminPageHeader, AdminStatCard } from "@/components/admin/admin-ui";

export default async function AdminShippingPage() {
  const settings = await getSettings();

  return (
    <div>
      <AdminPageHeader title="Kargo" description="Kargo ve teslimat ayarları" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <AdminStatCard label="Ücretsiz Kargo Alt Limiti" value={`₺${settings.shipping.freeShippingMin}`} accent="green" />
        <AdminStatCard label="Varsayılan Teslimat" value={`${settings.shipping.defaultDeliveryDays} gün`} accent="blue" />
      </div>

      <div className="mb-6 p-5 rounded-2xl bg-white/5 border border-white/10">
        <h3 className="text-sm font-medium text-gray-400 mb-3">Aktif Kargo Firmaları</h3>
        <div className="flex flex-wrap gap-2">
          {settings.shipping.carriers.map((c) => (
            <span key={c} className="px-3 py-1.5 rounded-lg bg-black/30 text-sm text-white border border-white/10">
              {c}
            </span>
          ))}
        </div>
      </div>

      <SettingsForm settings={settings} section="shipping" />
    </div>
  );
}
