import { Star } from "lucide-react";
import { AccountEmptyState } from "@/components/hesabim/account-empty-state";

export default function ReviewsPage() {
  return (
    <AccountEmptyState
      icon={Star}
      title="Yorumlarım"
      description="Henüz yorum yapmadınız. Teslim aldığınız ürünler için değerlendirme bırakabilirsiniz."
    />
  );
}
