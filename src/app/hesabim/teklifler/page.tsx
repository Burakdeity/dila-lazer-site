import Link from "next/link";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AccountEmptyState } from "@/components/hesabim/account-empty-state";

export default function QuotesPage() {
  return (
    <AccountEmptyState
      icon={FileText}
      title="Tekliflerim"
      description="Henüz teklif talebiniz bulunmuyor."
      action={
        <Link href="/teklif-al">
          <Button>Teklif Al</Button>
        </Link>
      }
    />
  );
}
