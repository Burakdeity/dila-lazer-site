export type ProductBadge = "bestseller" | "new" | "sale" | "custom" | "featured";

export interface SubCategory {
  id: string;
  name: string;
  slug: string;
}

export interface MainCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  icon: string;
  subcategories: SubCategory[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  shortDesc: string;
  description: string;
  basePrice: number;
  salePrice?: number;
  categorySlug: string;
  subcategorySlug: string;
  images: string[];
  videos: string[];
  badges: ProductBadge[];
  isFeatured: boolean;
  isCustomDesign: boolean;
  stock: number;
  deliveryDays: number;
  rating: number;
  reviewCount: number;
  sizes: string[];
  materials: string[];
  colors: string[];
  installation?: string;
  createdAt: string;
}

export interface Campaign {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  discount?: number;
  endsAt?: string;
}

export interface BlogPostPreview {
  slug: string;
  title: string;
  excerpt: string;
  cover: string;
  category: string;
  date: string;
  author: string;
}
