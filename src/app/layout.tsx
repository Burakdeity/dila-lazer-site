import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { StoreLayout } from "@/components/layout/store-layout";
import { AppProviders } from "@/components/providers/app-providers";
import { AuthSessionProvider } from "@/components/providers/session-provider";
import { brand } from "@/lib/brand";
import { getDefaultOgImage, siteDescription, siteKeywords } from "@/lib/seo";
import { GoogleAnalytics } from "@/components/seo/google-analytics";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700"],
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-plex-mono",
  weight: ["500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: `${brand.name} | Sakarya Neon Tabela, LED & Lazer Kesim`,
    template: `%s | ${brand.name}`,
  },
  description: siteDescription,
  keywords: [...siteKeywords],
  authors: [{ name: brand.name }],
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: brand.name,
    title: `${brand.name} | Sakarya Neon Tabela, LED & Lazer Kesim`,
    description: siteDescription,
    images: [{ url: getDefaultOgImage(), width: 1200, height: 630, alt: brand.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${brand.name} | Sakarya Neon Tabela, LED & Lazer Kesim`,
    description: siteDescription,
    images: [getDefaultOgImage()],
  },
  robots: { index: true, follow: true },
  verification: {
    google: "kOx6Nx0VWLpgRzaGqNH0dDq06zserqvE2FABsj6xMSs",
  },
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
    <html lang="tr" className={`${plusJakarta.variable} ${ibmPlexMono.variable}`} data-theme="light" suppressHydrationWarning>
      <body className="min-h-screen antialiased bg-gray-50 font-sans">
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
