import { AdminPageHeader } from "@/components/admin/admin-ui";
import { PaymentMethodsForm } from "@/components/admin/payment-methods-form";
import { getSettings } from "@/lib/settings-store";

export const dynamic = "force-dynamic";

export default async function AdminPaymentMethodsPage() {
  const settings = await getSettings();

  return (
    <div>
      <AdminPageHeader
        title="Ödeme Yöntemleri"
        description="PayTR, İyzico, havale ve diğer ödeme seçeneklerini yönetin"
      />
      <PaymentMethodsForm methods={settings.paymentMethods} />
    </div>
  );
}
