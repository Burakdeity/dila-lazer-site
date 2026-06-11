import { Receipt } from "lucide-react";
import { AccountEmptyState } from "@/components/hesabim/account-empty-state";

export default function InvoicesPage() {
  return (
    <AccountEmptyState
      icon={Receipt}
      title="Faturalarım"
      description="Henüz fatura kaydınız bulunmuyor."
    />
  );
}
