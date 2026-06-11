import Link from "next/link";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AccountEmptyState } from "@/components/hesabim/account-empty-state";

export default function FavoritesPage() {
  return (
    <AccountEmptyState
      icon={Heart}
      title="Favorilerim"
      description="Henüz favori ürününüz yok. Beğendiğiniz ürünleri favorilere ekleyin."
      action={
        <Link href="/urunler">
          <Button>Ürünleri Keşfet</Button>
        </Link>
      }
    />
  );
}
