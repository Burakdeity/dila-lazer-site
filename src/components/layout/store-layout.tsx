import { getMainCategories } from "@/lib/catalog";
import { getSettings } from "@/lib/settings-store";
import { StoreChrome } from "@/components/layout/store-chrome";

export async function StoreLayout({ children }: { children: React.ReactNode }) {
  const [categories, settings] = await Promise.all([
    getMainCategories(),
    getSettings(),
  ]);

  return (
    <StoreChrome categories={categories} menus={settings.menus}>
      {children}
    </StoreChrome>
  );
}
