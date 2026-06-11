import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { StoreLayout } from "@/components/layout/store-layout";
import { AppProviders } from "@/components/providers/app-providers";
import { AuthSessionProvider } from "@/components/providers/session-provider";
import { brand } from "@/lib/brand";
import { getDefaultOgImage, siteDescription } from "@/lib/seo";
import { GoogleAnalytics } from "@/components/seo/google-analytics";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: `${brand.name} | Neon, Tabela & Lazer Kesim`,
    template: `%s | ${brand.name}`,
  },
  description: siteDescription,
  keywords: [
    "neon tabela", "led tabela", "özel neon yazı", "kendin tasarla neon",
    "mdf dekor", "pleksi tabela", "3d kutu harf", "lazer kesim tabela",
    "cafe tabela", "dükkan tabelası", "istanbul neon tabela",
  ],
  authors: [{ name: brand.name }],
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: brand.name,
    title: `${brand.name} | Neon, Tabela & Lazer Kesim`,
    description: siteDescription,
    images: [{ url: getDefaultOgImage(), width: 1200, height: 630, alt: brand.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${brand.name} | Neon, Tabela & Lazer Kesim`,
    description: siteDescription,
    images: [getDefaultOgImage()],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#D50000",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={inter.variable} data-theme="light" suppressHydrationWarning>
      <body className="min-h-screen antialiased bg-gray-50">
        <GoogleAnalytics />
        <AppProviders>
          <AuthSessionProvider>
            <StoreLayout>
              <main>{children}</main>
            </StoreLayout>
          </AuthSessionProvider>
        </AppProviders>
      </body>
    </html>
  );
}
