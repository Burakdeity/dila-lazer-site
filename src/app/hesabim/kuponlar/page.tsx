import Link from "next/link";
import { Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AccountEmptyState } from "@/components/hesabim/account-empty-state";

export default function CouponsPage() {
  return (
    <AccountEmptyState
      icon={Gift}
      title="Kuponlarım"
      description="Aktif kuponunuz bulunmuyor."
      action={
        <Link href="/kampanyalar">
          <Button>Kampanyalara Bak</Button>
        </Link>
      }
    />
  );
}
