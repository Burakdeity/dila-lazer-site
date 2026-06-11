import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { campaigns } from "@/data/catalog/campaigns";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Kampanyalar",
  description: "Aktif kampanya ve indirim fırsatları.",
};

export default function CampaignsPage() {
  return (
    <div className="pt-24 lg:pt-32 pb-20 bg-white min-h-screen">
      <Container>
        <h1 className="text-3xl font-bold text-brand-black mb-10">Kampanyalar</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {campaigns.map((c) => (
            <div key={c.id} className="relative overflow-hidden rounded-2xl aspect-[16/9] group">
              <Image src={c.image} alt={c.title} fill className="object-cover" sizes="50vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                {c.discount && (
                  <span className="inline-block px-3 py-1 rounded-full bg-brand-red text-white text-sm font-bold mb-3">
                    %{c.discount} İndirim
                  </span>
                )}
                <h2 className="text-2xl font-bold text-brand-black">{c.title}</h2>
                <p className="text-gray-500 mt-2">{c.subtitle}</p>
                <Link href={c.link} className="inline-block mt-4">
                  <Button>İncele</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
