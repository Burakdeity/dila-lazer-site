import { notFound } from "next/navigation";
import { CampaignForm } from "@/components/admin/campaign-form";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { getCampaignByIdFromStore } from "@/lib/campaign-store";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditCampaignPage({ params }: Props) {
  const { id } = await params;
  const campaign = await getCampaignByIdFromStore(id);
  if (!campaign) notFound();

  return (
    <div>
      <AdminPageHeader title={campaign.title} description="Kampanyayı düzenleyin" />
      <CampaignForm campaign={campaign} />
    </div>
  );
}
