import { CreditCard } from "lucide-react";
import { AccountEmptyState } from "@/components/hesabim/account-empty-state";

export default function PaymentMethodsPage() {
  return (
    <AccountEmptyState
      icon={CreditCard}
      title="Ödeme Yöntemlerim"
      description="Kayıtlı kart bilginiz bulunmuyor. Ödeme sırasında güvenli ödeme sağlayıcılarımızı kullanabilirsiniz."
    />
  );
}
