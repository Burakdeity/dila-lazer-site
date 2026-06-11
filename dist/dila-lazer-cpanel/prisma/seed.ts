import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const categories = [
    { name: "3D Neon Tabelalar", slug: "3d-neon-tabelalar", sortOrder: 1 },
    { name: "LED Tabelalar", slug: "led-tabelalar", sortOrder: 2 },
    { name: "Kutu Harf Tabelalar", slug: "kutu-harf-tabelalar", sortOrder: 3 },
    { name: "Pleksi Tabelalar", slug: "pleksi-tabelalar", sortOrder: 4 },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  console.log("Seed tamamlandı.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
