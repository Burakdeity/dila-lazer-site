import { AdminPageHeader } from "@/components/admin/admin-ui";
import { SpinWheelSettingsForm } from "@/components/admin/spin-wheel-settings-form";
import { getSpinStats, getSpinWheelConfig, getSpinWinners } from "@/lib/spin-wheel-store";

export const dynamic = "force-dynamic";

export default async function AdminSpinWheelPage() {
  const [config, stats, winners] = await Promise.all([
    getSpinWheelConfig(),
    getSpinStats(),
    getSpinWinners(100),
  ]);

  return (
    <div>
      <AdminPageHeader
        title="Şans Çarkı"
        description="Çark ayarları, dilimler ve kazananlar"
      />
      <SpinWheelSettingsForm
        config={config}
        stats={stats}
        winners={winners.map((w) => ({
          ...w,
          createdAt: w.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
