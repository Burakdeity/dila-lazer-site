import { MapPin } from "lucide-react";
import { AccountEmptyState } from "@/components/hesabim/account-empty-state";

export default function AddressesPage() {
  return (
    <AccountEmptyState
      icon={MapPin}
      title="Adreslerim"
      description="Kayıtlı teslimat adresiniz bulunmuyor. İlk siparişinizde adres ekleyebilirsiniz."
    />
  );
}
