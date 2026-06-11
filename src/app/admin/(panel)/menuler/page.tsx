import { getSettings } from "@/lib/settings-store";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { MenuEditor } from "@/components/admin/menu-editor";

export default async function AdminMenusPage() {
  const settings = await getSettings();

  return (
    <div>
      <AdminPageHeader title="Menüler" description="Site navigasyon linklerini düzenleyin" />
      <MenuEditor menus={settings.menus} />
    </div>
  );
}
