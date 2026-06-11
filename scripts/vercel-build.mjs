import { execSync } from "node:child_process";

const dbUrl = process.env.DATABASE_URL ?? "";
const isRemoteDb =
  dbUrl.startsWith("postgresql://") && !dbUrl.includes("localhost");

execSync("npx prisma generate", { stdio: "inherit" });

if (isRemoteDb) {
  console.log("Veritabani semasi guncelleniyor...");
  execSync("npx prisma db push --skip-generate", { stdio: "inherit" });
} else if (process.env.VERCEL === "1") {
  console.error(
    "HATA: Vercel'de DATABASE_URL (Neon PostgreSQL) tanimli degil. Settings > Environment Variables ekleyin."
  );
  process.exit(1);
} else {
  console.warn("DATABASE_URL yok — yerel build icin prisma db push atlandi.");
}

execSync("npx next build", { stdio: "inherit" });