import type { SiteSettings, MenuLink, HeroSlide, PaymentMethodConfig } from "@/types/admin";
import { campaigns } from "@/data/catalog/campaigns";
import { loadJsonStore, saveJsonStore } from "@/lib/app-data";

const STORE_KEY = "settings";

const defaultTopBarLinks: MenuLink[] = [
  { id: "1", label: "Sipariş Takip", href: "/siparis-takip", isActive: true },
  { id: "2", label: "Siparişlerim", href: "/hesabim/siparisler", isActive: true },
  { id: "8", label: "Şans Çarkı", href: "/sans-carki", isActive: true },
  { id: "3", label: "Kampanyalar", href: "/kampanyalar", isActive: true },
  { id: "4", label: "Projeler", href: "/portfolyo", isActive: true },
  { id: "5", label: "Hakkımızda", href: "/hakkimizda", isActive: true },
  { id: "6", label: "Blog", href: "/blog", isActive: true },
  { id: "7", label: "İletişim", href: "/iletisim", isActive: true },
];

const defaultExtraNavLinks: MenuLink[] = [
  { id: "1", label: "Kendin Tasarla", href: "/ozel-tasarim-merkezi", isActive: true },
  { id: "2", label: "Teklif Al", href: "/teklif-al", isActive: true },
  { id: "3", label: "Şans Çarkı", href: "/sans-carki", isActive: true },
];

const defaultFooterCorporateLinks: MenuLink[] = [
  { id: "1", label: "Hakkımızda", href: "/hakkimizda", isActive: true },
  { id: "2", label: "Projeler & Referanslar", href: "/portfolyo", isActive: true },
  { id: "3", label: "Blog", href: "/blog", isActive: true },
  { id: "4", label: "İletişim", href: "/iletisim", isActive: true },
  { id: "5", label: "Kendin Tasarla", href: "/ozel-tasarim-merkezi", isActive: true },
];

const defaultFooterServiceLinks: MenuLink[] = [
  { id: "1", label: "Sipariş Takip", href: "/siparis-takip", isActive: true },
  { id: "2", label: "İade Politikası", href: "/iade-politikasi", isActive: true },
  { id: "3", label: "Kargo & Teslimat", href: "/kargo-teslimat", isActive: true },
  { id: "4", label: "Teklif Al", href: "/teklif-al", isActive: true },
  { id: "5", label: "Gizlilik Politikası", href: "/gizlilik", isActive: true },
];

const defaultHeroSlides: HeroSlide[] = [
  {
    id: "1",
    eyebrow: "Neon & LED Tabela",
    title: "Markanızı Işıkla Öne Çıkarın",
    subtitle: "Özel üretim neon tabelalar, 81 ile güvenli teslimat ve 2 yıl garanti.",
    image: "/hero/slide-neon-led.png",
    imageClass: "object-cover opacity-[0.58]",
    overlayClass:
      "absolute inset-0 bg-gradient-to-r from-brand-black/90 via-brand-black/72 to-brand-black/22",
    ctaLabel: "Koleksiyonu İncele",
    ctaHref: "/kategori/neon-led-tabelalar",
    secondaryLabel: "Teklif Al",
    secondaryHref: "/teklif-al",
    isActive: true,
  },
  {
    id: "2",
    eyebrow: "3D Yazıcı Üretim",
    title: "Hayalinizdeki Modeli Basıyoruz",
    subtitle: "Prototip, dekoratif parça ve özel tasarım 3D baskı — PLA, PETG ve reçine seçenekleriyle hızlı üretim.",
    image: "/hero/slide-3d-kurumsal.png",
    imageClass: "object-cover object-center sm:object-right opacity-[0.62] brightness-[0.94]",
    overlayClass:
      "absolute inset-0 bg-gradient-to-r from-brand-black via-brand-black/72 to-brand-black/18",
    ctaLabel: "3D Ürünler",
    ctaHref: "/kategori/3d-urunler",
    secondaryLabel: "Teklif Al",
    secondaryHref: "/teklif-al",
    isActive: true,
  },
  {
    id: "3",
    eyebrow: "Kendin Tasarla",
    title: "Hayalinizdeki Ürünü Tasarlayın",
    subtitle: "Canlı önizleme, anlık fiyat hesaplama ve uzman tasarım desteği.",
    image: "/hero/slide-uretim.png",
    ctaLabel: "Tasarlamaya Başla",
    ctaHref: "/ozel-tasarim-merkezi",
    secondaryLabel: "Nasıl Çalışır?",
    secondaryHref: "/hakkimizda",
    isActive: true,
  },
];

const defaultPaymentMethods: PaymentMethodConfig[] = [
  {
    id: "paytr",
    provider: "paytr",
    name: "PayTR",
    description: "Kredi kartı ve banka kartı ile güvenli ödeme",
    isActive: true,
    sortOrder: 1,
  },
  {
    id: "iyzico",
    provider: "iyzico",
    name: "İyzico",
    description: "Taksitli ödeme seçenekleri",
    isActive: true,
    sortOrder: 2,
  },
  {
    id: "stripe",
    provider: "stripe",
    name: "Stripe",
    description: "Uluslararası kart ile ödeme",
    isActive: false,
    sortOrder: 3,
  },
  {
    id: "havale",
    provider: "havale",
    name: "Havale / EFT",
    description: "Banka havalesi ile ödeme",
    isActive: true,
    sortOrder: 4,
    bankName: "Ziraat Bankası",
    accountHolder: "Dila Lazer",
    iban: "TR00 0000 0000 0000 0000 0000 00",
    instructions: "Açıklama kısmına sipariş numaranızı yazınız.",
  },
  {
    id: "kapida",
    provider: "kapida",
    name: "Kapıda Ödeme",
    description: "Teslimat sırasında nakit veya kart ile ödeme",
    isActive: false,
    sortOrder: 5,
  },
];

const defaultSettings: SiteSettings = {
  seo: {
    title: "Dila Lazer | Neon, Tabela & Lazer Kesim",
    description:
      "Neon LED tabela, MDF, pleksi, 3D dekorasyon ve elektronik ürünler. Premium kalite, özel tasarım, 81 ile teslimat.",
    keywords: "neon tabela, led tabela, mdf dekor, pleksi, lazer kesim, özel tasarım",
  },
  shipping: {
    freeShippingMin: 1500,
    defaultDeliveryDays: 5,
    carriers: ["Yurtiçi Kargo", "Aras Kargo", "MNG Kargo", "Sürat Kargo"],
  },
  contact: {
    phone: "+90 552 543 52 54",
    email: "dilalazer54@gmail.com",
    address: "Papuççular, Bostancı Sk. No:60, 54100 Adapazarı/Sakarya",
    mapsQuery: "Papuççular, Bostancı Sk. No:60, 54100 Adapazarı, Sakarya",
    whatsapp: "905525435254",
  },
  banners: campaigns.map((c) => ({
    id: c.id,
    title: c.title,
    subtitle: c.subtitle,
    image: c.image,
    link: c.link,
    isActive: true,
  })),
  heroSlides: defaultHeroSlides,
  menus: {
    topBarLinks: defaultTopBarLinks,
    extraNavLinks: defaultExtraNavLinks,
    footerCorporateLinks: defaultFooterCorporateLinks,
    footerServiceLinks: defaultFooterServiceLinks,
  },
  paymentMethods: defaultPaymentMethods,
};

async function ensureSettings(): Promise<SiteSettings> {
  const parsed = await loadJsonStore<Partial<SiteSettings>>(STORE_KEY, defaultSettings);
  const heroSlides = (parsed.heroSlides ?? defaultSettings.heroSlides).map((slide) => {
    if (slide.id === "1") {
      return {
        ...slide,
        imageClass: "object-cover opacity-[0.58]",
        overlayClass:
          "absolute inset-0 bg-gradient-to-r from-brand-black/90 via-brand-black/72 to-brand-black/22",
      };
    }
    if (slide.id === "2") {
      return {
        ...slide,
        imageClass: "object-cover object-center sm:object-right opacity-[0.62] brightness-[0.94]",
        overlayClass:
          "absolute inset-0 bg-gradient-to-r from-brand-black via-brand-black/72 to-brand-black/18",
      };
    }
    return slide;
  });
  return {
    seo: { ...defaultSettings.seo, ...parsed.seo },
    shipping: { ...defaultSettings.shipping, ...parsed.shipping },
    contact: { ...defaultSettings.contact, ...parsed.contact },
    banners: parsed.banners ?? defaultSettings.banners,
    heroSlides,
    menus: {
      topBarLinks: parsed.menus?.topBarLinks ?? defaultSettings.menus.topBarLinks,
      extraNavLinks: parsed.menus?.extraNavLinks ?? defaultSettings.menus.extraNavLinks,
      footerCorporateLinks: parsed.menus?.footerCorporateLinks ?? defaultSettings.menus.footerCorporateLinks,
      footerServiceLinks: parsed.menus?.footerServiceLinks ?? defaultSettings.menus.footerServiceLinks,
    },
    paymentMethods:
      parsed.paymentMethods && parsed.paymentMethods.length > 0
        ? parsed.paymentMethods
        : defaultSettings.paymentMethods,
  };
}

export async function getSettings(): Promise<SiteSettings> {
  return ensureSettings();
}

export async function updateSettings(partial: Partial<SiteSettings>): Promise<SiteSettings> {
  const current = await ensureSettings();
  const updated: SiteSettings = {
    seo: { ...current.seo, ...partial.seo },
    shipping: { ...current.shipping, ...partial.shipping },
    contact: { ...current.contact, ...partial.contact },
    banners: partial.banners ?? current.banners,
    heroSlides: partial.heroSlides ?? current.heroSlides,
    menus: partial.menus ?? current.menus,
    paymentMethods: partial.paymentMethods ?? current.paymentMethods,
  };
  await saveJsonStore(STORE_KEY, updated);
  return updated;
}
