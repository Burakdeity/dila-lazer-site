export type OrderStatus =
  | "pending"
  | "confirmed"
  | "production"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface Order {
  id: string;
  orderNo: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  productName: string;
  amount: number;
  status: OrderStatus;
  createdAt: string;
  shippingCity?: string;
}

export type QuoteStatus = "new" | "reviewing" | "quoted" | "accepted" | "rejected";

export interface Quote {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  productType: string;
  message: string;
  status: QuoteStatus;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: "percent" | "fixed";
  discountValue: number;
  minOrder?: number;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  expiresAt?: string;
  createdAt: string;
}

export interface MenuLink {
  id: string;
  label: string;
  href: string;
  isActive: boolean;
}

export interface HeroSlide {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  image: string;
  imageClass?: string;
  overlayClass?: string;
  ctaLabel: string;
  ctaHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  isActive: boolean;
}

export interface SiteBanner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  isActive: boolean;
}

export interface SiteMenus {
  topBarLinks: MenuLink[];
  extraNavLinks: MenuLink[];
  footerCorporateLinks: MenuLink[];
  footerServiceLinks: MenuLink[];
}

export type PaymentProvider = "paytr" | "iyzico" | "stripe" | "havale" | "kapida";

export interface PaymentMethodConfig {
  id: string;
  provider: PaymentProvider;
  name: string;
  description: string;
  isActive: boolean;
  sortOrder: number;
  bankName?: string;
  iban?: string;
  accountHolder?: string;
  instructions?: string;
}

export interface SiteSettings {
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
  shipping: {
    freeShippingMin: number;
    defaultDeliveryDays: number;
    carriers: string[];
  };
  contact: {
    phone: string;
    email: string;
    address: string;
    whatsapp: string;
    mapsQuery?: string;
  };
  banners: SiteBanner[];
  heroSlides: HeroSlide[];
  menus: SiteMenus;
  paymentMethods: PaymentMethodConfig[];
}

export const PAYMENT_PROVIDER_LABELS: Record<PaymentProvider, string> = {
  paytr: "PayTR",
  iyzico: "İyzico",
  stripe: "Stripe",
  havale: "Havale / EFT",
  kapida: "Kapıda Ödeme",
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Beklemede",
  confirmed: "Onaylandı",
  production: "Üretimde",
  shipped: "Kargoda",
  delivered: "Teslim Edildi",
  cancelled: "İptal",
};

export const QUOTE_STATUS_LABELS: Record<QuoteStatus, string> = {
  new: "Yeni",
  reviewing: "İnceleniyor",
  quoted: "Teklif Verildi",
  accepted: "Kabul Edildi",
  rejected: "Reddedildi",
};
