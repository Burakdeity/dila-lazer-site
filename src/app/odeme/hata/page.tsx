import Link from "next/link";
import { XCircle } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

type Props = {
  searchParams: Promise<{ order?: string }>;
};

export default async function PaymentFailPage({ searchParams }: Props) {
  const { order } = await searchParams;

  return (
    <div className="pt-24 pb-20 bg-white min-h-screen">
      <Container size="narrow" className="text-center py-16">
        <XCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-brand-black mb-3">Ödeme Tamamlanamadı</h1>
        <p className="text-gray-500 mb-2">
          Ödeme işlemi iptal edildi veya bir hata oluştu. Tekrar deneyebilirsiniz.
        </p>
        {order && (
          <p className="text-sm text-gray-400 mb-8">
            Referans: <span className="font-mono text-brand-black">{order}</span>
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/odeme">
            <Button size="lg">Tekrar Dene</Button>
          </Link>
          <Link href="/iletisim">
            <Button size="lg" variant="outline">
              Destek
            </Button>
          </Link>
        </div>
      </Container>
    </div>
  );
}
