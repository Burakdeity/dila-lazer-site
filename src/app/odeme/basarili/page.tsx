import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

type Props = {
  searchParams: Promise<{ order?: string }>;
};

export default async function PaymentSuccessPage({ searchParams }: Props) {
  const { order } = await searchParams;

  return (
    <div className="pt-24 pb-20 bg-white min-h-screen">
      <Container size="narrow" className="text-center py-16">
        <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-brand-black mb-3">Ödemeniz Alındı</h1>
        <p className="text-gray-500 mb-2">
          Ödemeniz işleniyor. Onay birkaç saniye içinde tamamlanır.
        </p>
        {order && (
          <p className="text-sm text-gray-400 mb-8">
            Sipariş no: <span className="font-mono text-brand-black">{order}</span>
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/hesabim/siparisler">
            <Button size="lg">Siparişlerim</Button>
          </Link>
          <Link href="/">
            <Button size="lg" variant="outline">
              Ana Sayfa
            </Button>
          </Link>
        </div>
      </Container>
    </div>
  );
}
