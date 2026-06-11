import { getSettings } from "@/lib/settings-store";
import { SettingsForm } from "@/components/admin/settings-form";
import { AdminPageHeader } from "@/components/admin/admin-ui";

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <div>
      <AdminPageHeader title="Ayarlar" description="Site genel ayarları" />
      <SettingsForm settings={settings} section="all" />
    </div>
  );
}
