"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Script from "next/script";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

function PaytrIframe() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  if (!token) {
    return (
      <Container className="py-20 text-center">
        <p className="text-gray-500 mb-4">Ödeme oturumu bulunamadı.</p>
        <Link href="/odeme">
          <Button>Ödemeye Dön</Button>
        </Link>
      </Container>
    );
  }

  return (
    <>
      <Script src="https://www.paytr.com/js/iframeResizer.min.js" strategy="afterInteractive" />
      <Container size="narrow" className="py-8">
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-2 text-xs text-gray-400 mb-2">
            <Shield className="h-3.5 w-3.5" />
            PayTR güvenli ödeme
          </div>
          <h1 className="text-2xl font-bold text-brand-black">Kart ile Ödeme</h1>
          <p className="text-sm text-gray-500 mt-1">
            Ödemenizi aşağıdaki güvenli form üzerinden tamamlayın.
          </p>
        </div>
        <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm min-h-[480px]">
          <iframe
            src={`https://www.paytr.com/odeme/guvenli/${token}`}
            id="paytriframe"
            title="PayTR Ödeme"
            frameBorder={0}
            scrolling="no"
            style={{ width: "100%", minHeight: 480 }}
          />
        </div>
        <Script id="paytr-resize" strategy="afterInteractive">
          {`if (typeof iFrameResize === 'function') { iFrameResize({}, '#paytriframe'); }`}
        </Script>
      </Container>
    </>
  );
}

export default function PaytrPaymentPage() {
  return (
    <div className="pt-24 pb-12 bg-gray-50 min-h-screen">
      <Suspense
        fallback={
          <Container className="py-20 text-center text-gray-400">Yükleniyor…</Container>
        }
      >
        <PaytrIframe />
      </Suspense>
    </div>
  );
}
