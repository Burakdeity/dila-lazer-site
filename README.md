# Premium Neon Tabela E-Ticaret Platformu

Türkiye'nin premium 3D neon ve kurumsal tabela e-ticaret platformu. Next.js 15, TypeScript, Tailwind CSS, Framer Motion, Prisma ve PostgreSQL ile geliştirilmiştir.

## Özellikler

- Premium ana sayfa (hero, istatistikler, kategoriler, ürünler, referanslar)
- Ürün detay sayfaları (anlık fiyat, taksit, varyant seçimi)
- Tasarım stüdyosu (canlı önizleme, AI logo analizi)
- Portfolyo galerisi (öncesi/sonrası karşılaştırma)
- Sepet ve tek sayfa ödeme
- Müşteri paneli (sadakat programı, puan sistemi)
- Admin paneli (dashboard, sipariş yönetimi)
- SEO altyapısı (sitemap, robots, schema.org)
- Ödeme API'leri (PayTR, İyzico, Stripe)
- Sosyal kanıt bileşenleri

## Kurulum

### Gereksinimler

- Node.js 20+
- PostgreSQL 15+
- Redis (opsiyonel, cache için)

### Adımlar

```bash
cd premium-neon-tabela
npm install
cp .env.example .env
# .env dosyasını düzenleyin

# Veritabanı
npx prisma db push
npx prisma db seed

# Geliştirme
npm run dev
```

Site `http://localhost:3000` adresinde çalışır.

## Marka Özelleştirme

`.env` dosyasında:

```
NEXT_PUBLIC_BRAND_NAME="Marka Adınız"
NEXT_PUBLIC_WHATSAPP=905525435254
```

`src/lib/brand.ts` dosyasından iletişim bilgilerini güncelleyin.

## Teknoloji

| Katman | Teknoloji |
|--------|-----------|
| Framework | Next.js 15 (App Router) |
| Dil | TypeScript |
| Stil | Tailwind CSS 4 |
| Animasyon | Framer Motion, GSAP |
| Veritabanı | PostgreSQL + Prisma |
| Cache | Redis (ioredis) |
| Ödeme | PayTR, İyzico, Stripe |
| Auth | NextAuth.js |

## Proje Yapısı

```
src/
├── app/           # Sayfalar ve API routes
├── components/    # UI bileşenleri
├── data/          # Mock veriler
├── lib/           # Yardımcı fonksiyonlar
└── store/         # Zustand state
```

## Lisans

Özel lisans — tüm hakları saklıdır.
