import { execSync } from "node:child_process";
import fs from "node:fs";

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

try {
  const commit = execSync("git rev-parse --short HEAD", { encoding: "utf8" }).trim();
  const message = execSync("git log -1 --pretty=%s", { encoding: "utf8" }).trim();
  fs.writeFileSync(
    "public/version.json",
    `${JSON.stringify({ commit, message, updated: new Date().toISOString() }, null, 2)}\n`,
  );
  console.log(`version.json guncellendi: ${commit}`);
} catch {
  console.warn("version.json yazilamadi (git bilgisi yok).");
}