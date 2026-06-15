"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { CheckoutSteps } from "@/components/checkout/checkout-steps";
import { formatPrice } from "@/lib/utils";

type OrderView = {
  orderNo: string;
  productName: string;
  amount: number;
  status: string;
};

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const orderNo = searchParams.get("order");
  const [order, setOrder] = useState<OrderView | null>(null);
  const [loading, setLoading] = useState(!!orderNo);

  useEffect(() => {
    if (!orderNo) return;
    fetch(`/api/orders/${encodeURIComponent(orderNo)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then(setOrder)
      .finally(() => setLoading(false));
  }, [orderNo]);

  return (
    <Container size="narrow" className="text-center py-12">
      <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto mb-6" />
      <h1 className="text-3xl font-bold text-brand-black mb-3">Ödemeniz Alındı</h1>
      <p className="text-gray-500 mb-6">
        Kart ödemeniz başarıyla tamamlandı. Sipariş onayı birkaç saniye içinde işlenir.
      </p>

      {loading ? (
        <Loader2 className="h-6 w-6 animate-spin text-gray-300 mx-auto mb-8" />
      ) : order ? (
        <div className="glass-card p-5 mb-8 text-left max-w-sm mx-auto">
          <p className="text-xs text-gray-400">Sipariş No</p>
          <p className="font-mono font-bold text-brand-black mb-3">{order.orderNo}</p>
          <p className="text-sm text-gray-600">{order.productName}</p>
          <p className="text-lg font-bold text-brand-black mt-2">{formatPrice(order.amount)}</p>
        </div>
      ) : orderNo ? (
        <p className="text-sm text-gray-400 mb-8 font-mono">{orderNo}</p>
      ) : null}

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {orderNo && (
          <Link href={`/siparis/onay?order=${orderNo}`}>
            <Button size="lg" variant="outline">
              Sipariş Detayı
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        )}
        <Link href="/hesabim/siparisler">
          <Button size="lg">Siparişlerim</Button>
        </Link>
      </div>
    </Container>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="pt-24 pb-20 bg-white min-h-screen">
      <Container>
        <CheckoutSteps current={3} />
      </Container>
      <Suspense fallback={<Container className="py-20 text-center text-gray-400">Yükleniyor…</Container>}>
        <PaymentSuccessContent />
      </Suspense>
    </div>
  );
}
