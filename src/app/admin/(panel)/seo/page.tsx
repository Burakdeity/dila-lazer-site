import { getSettings } from "@/lib/settings-store";
import { SettingsForm } from "@/components/admin/settings-form";
import { AdminPageHeader } from "@/components/admin/admin-ui";

export default async function AdminSeoPage() {
  const settings = await getSettings();

  return (
    <div>
      <AdminPageHeader title="SEO" description="Arama motoru optimizasyon ayarları" />
      <SettingsForm settings={settings} section="seo" />
    </div>
  );
}
