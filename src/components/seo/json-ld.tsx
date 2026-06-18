import { brand } from "@/lib/brand";
import { absoluteUrl, getSiteUrl, sakaryaGeo, siteDescription } from "@/lib/seo";

interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function organizationSchema() {
  const socialLinks = Object.values(brand.social).filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: brand.name,
    url: getSiteUrl(),
    logo: absoluteUrl("/logo.png"),
    description: siteDescription,
    email: brand.contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Papuççular, Bostancı Sk. No:60",
      addressLocality: "Adapazarı",
      addressRegion: "Sakarya",
      postalCode: "54100",
      addressCountry: "TR",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: brand.contact.phone.replace(/\s/g, ""),
      contactType: "customer service",
      areaServed: ["Sakarya", "TR"],
      availableLanguage: ["Turkish"],
    },
    sameAs: socialLinks,
  };
}

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "Store"],
    "@id": `${getSiteUrl()}/#localbusiness`,
    name: `${brand.name} — Sakarya Neon`,
    image: absoluteUrl("/logo.png"),
    url: getSiteUrl(),
    telephone: brand.contact.phone.replace(/\s/g, ""),
    email: brand.contact.email,
    description: siteDescription,
    priceRange: "₺₺",
    currenciesAccepted: "TRY",
    paymentAccepted: "Cash, Credit Card, Bank Transfer",
    hasMap: sakaryaGeo.mapsUrl,
    geo: {
      "@type": "GeoCoordinates",
      latitude: sakaryaGeo.latitude,
      longitude: sakaryaGeo.longitude,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Papuççular, Bostancı Sk. No:60",
      addressLocality: "Adapazarı",
      addressRegion: "Sakarya",
      postalCode: "54100",
      addressCountry: "TR",
    },
    areaServed: [
      { "@type": "City", name: "Adapazarı" },
      { "@type": "AdministrativeArea", name: "Sakarya" },
      { "@type": "Country", name: "Türkiye" },
    ],
    knowsAbout: [
      "Neon LED",
      "LED aydınlatma",
      "Lazer kesim",
      "3D kutu harf",
      "Pleksi ürünler",
      "Reklam levhası",
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "09:00",
        closes: "19:00",
      },
    ],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: brand.name,
    url: getSiteUrl(),
    inLanguage: "tr-TR",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${absoluteUrl("/urunler")}?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function productSchema(product: {
  name: string;
  description: string;
  image: string;
  price: number;
  slug: string;
  rating?: number;
  reviewCount?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image,
    url: absoluteUrl(`/urun/${product.slug}`),
    brand: {
      "@type": "Brand",
      name: brand.name,
    },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "TRY",
      availability: "https://schema.org/InStock",
      url: absoluteUrl(`/urun/${product.slug}`),
    },
    ...(product.rating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.rating,
        reviewCount: product.reviewCount,
      },
    }),
  };
}

export function homePageSchemas() {
  return [organizationSchema(), localBusinessSchema(), websiteSchema()];
}

export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function sakaryaPageSchemas(faqs: { question: string; answer: string }[]) {
  return [localBusinessSchema(), breadcrumbSchema([
    { name: "Ana Sayfa", path: "/" },
    { name: "Sakarya Neon", path: "/sakarya" },
  ]), faqSchema(faqs)];
}
