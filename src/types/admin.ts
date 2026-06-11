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
  banners: {
    id: string;
    title: string;
    subtitle: string;
    image: string;
    link: string;
    isActive: boolean;
  }[];
}

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
