import { getSettings } from "@/lib/settings-store";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { CmsContentEditor } from "@/components/admin/cms-content-editor";

export default async function AdminBannersPage() {
  const settings = await getSettings();

  return (
    <div>
      <AdminPageHeader
        title="Bannerlar & Slaytlar"
        description="Ana sayfa hero slaytları ve promosyon bannerlarını düzenleyin"
      />
      <CmsContentEditor heroSlides={settings.heroSlides} banners={settings.banners} />
    </div>
  );
}
