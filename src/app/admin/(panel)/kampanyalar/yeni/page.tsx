import { CampaignForm } from "@/components/admin/campaign-form";
import { AdminPageHeader } from "@/components/admin/admin-ui";

export default function NewCampaignPage() {
  return (
    <div>
      <AdminPageHeader title="Yeni Kampanya" description="Kampanya oluşturun" />
      <CampaignForm />
    </div>
  );
}
