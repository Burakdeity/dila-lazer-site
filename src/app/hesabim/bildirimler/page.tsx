import { Bell } from "lucide-react";
import { AccountEmptyState } from "@/components/hesabim/account-empty-state";

export default function NotificationsPage() {
  return (
    <AccountEmptyState
      icon={Bell}
      title="Bildirimlerim"
      description="Yeni bildiriminiz bulunmuyor."
    />
  );
}
