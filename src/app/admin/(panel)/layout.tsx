import { AdminNav } from "@/components/admin/admin-nav";
import { BrandLogo } from "@/components/layout/brand-logo";

export const dynamic = "force-dynamic";

export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#0f0f0f]">
      <aside className="w-64 border-r border-white/10 bg-brand-black flex-shrink-0 hidden lg:flex lg:flex-col">
        <div className="p-6 border-b border-white/10">
          <BrandLogo size="md" className="brightness-0 invert" />
          <p className="text-white/50 text-xs mt-2">Admin Panel</p>
        </div>
        <AdminNav />
      </aside>
      <main className="flex-1 p-6 lg:p-8 overflow-auto bg-[#141414]">{children}</main>
    </div>
  );
}
