export const brand = {
  name: process.env.NEXT_PUBLIC_BRAND_NAME || "Dila Lazer",
  logo: "/logo.png",
  tagline: "Reklam · Tabela · Dekorasyon · Lazer Kesim",
  colors: {
    red: "#D50000",
    black: "#111111",
    white: "#FFFFFF",
  },
  contact: {
    phone: "+90 552 543 52 54",
    email: "dilalazer54@gmail.com",
    address: "Papuççular, Bostancı Sk. No:60, 54100 Adapazarı/Sakarya",
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || "905525435254",
    mapsQuery: "Papuççular, Bostancı Sk. No:60, 54100 Adapazarı, Sakarya",
  },
  social: {
    instagram: "https://instagram.com",
    youtube: "https://youtube.com",
    linkedin: "https://linkedin.com",
  },
} as const;

export function getBrandLogoLines(name = brand.name): [string, string] {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return [parts[0].toUpperCase(), parts.slice(1).join(" ").toUpperCase()];
  }
  return [name.toUpperCase(), ""];
}
