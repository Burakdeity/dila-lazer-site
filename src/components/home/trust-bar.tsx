import { Truck, ShieldCheck, Palette, Headphones, CreditCard } from "lucide-react";

const items = [
  {
    icon: Truck,
    title: "81 İle Teslimat",
    desc: "Güvenli kargo",
  },
  {
    icon: ShieldCheck,
    title: "2 Yıl Garanti",
    desc: "Kalite güvencesi",
  },
  {
    icon: Palette,
    title: "Kendin Tasarla",
    desc: "Ücretsiz önizleme",
  },
  {
    icon: Headphones,
    title: "7/24 Destek",
    desc: "Uzman ekip",
  },
  {
    icon: CreditCard,
    title: "Güvenli Ödeme",
    desc: "Taksit imkânı",
  },
];

export function TrustBar() {
  return (
    <section className="hidden sm:block bg-white border-b border-gray-100">
      <div className="max-w-[1400px] mx-auto px-4 py-5">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
          {items.map((item) => (
            <div
              key={item.title}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-brand-red/8 flex items-center justify-center shrink-0">
                <item.icon className="h-5 w-5 text-brand-red" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-brand-black leading-tight">{item.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
