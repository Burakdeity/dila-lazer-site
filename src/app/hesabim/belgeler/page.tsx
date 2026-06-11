import { Download } from "lucide-react";
import { AccountEmptyState } from "@/components/hesabim/account-empty-state";

export default function DocumentsPage() {
  return (
    <AccountEmptyState
      icon={Download}
      title="İndirilebilir Belgeler"
      description="Henüz indirilebilir belgeniz bulunmuyor."
    />
  );
}
