import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const distName = "dila-lazer-cpanel";
const distDir = path.join(root, "dist", distName);
const zipPath = path.join(root, "dist", `${distName}.zip`);

function rm(dir) {
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
}

function cp(src, dest) {
  fs.cpSync(src, dest, { recursive: true });
}

function mkdir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

console.log(">> Production build basliyor...");
execSync("npm run build", { cwd: root, stdio: "inherit" });

const standalone = path.join(root, ".next", "standalone");
if (!fs.existsSync(standalone)) {
  throw new Error("Standalone build bulunamadi. next.config.ts icinde output: 'standalone' olmali.");
}

console.log(">> cPanel paketi hazirlaniyor...");
rm(path.join(root, "dist"));
mkdir(distDir);

cp(standalone, distDir);
cp(path.join(root, ".next", "static"), path.join(distDir, ".next", "static"));

if (fs.existsSync(path.join(root, "public"))) {
  cp(path.join(root, "public"), path.join(distDir, "public"));
}

if (fs.existsSync(path.join(root, "data"))) {
  cp(path.join(root, "data"), path.join(distDir, "data"));
}

cp(path.join(root, "prisma"), path.join(distDir, "prisma"));

const kurulum = `DILA LAZER — cPanel Kurulum (Kisa Rehber)
==========================================

ONEMLI: Bu site WordPress gibi degildir. Hosting panelinde NODE.JS destegi olmali.
Sadece public_html'e atip acamazsiniz.

ADIM 1 — ZIP yukle
  cPanel > Dosya Yoneticisi > public_html
  dila-lazer-cpanel.zip yukleyin, sag tik > Extract (Cikar)
  Klasorde server.js dosyasi gorunmeli.

ADIM 2 — Node.js uygulamasi
  cPanel > "Setup Node.js App" / "Node.js Selector"
  - Node: 18 veya 20
  - Application root: public_html
  - Startup file: server.js
  - Mode: Production
  Kaydet.

ADIM 3 — .env dosyasi
  .env.ornek dosyasini kopyalayip adini .env yapin.
  Domain adresinizi yazin (https://www.ornek.com)
  NEXTAUTH_SECRET icin rastgele uzun bir sifre uretin.

ADIM 4 — Baslat
  Node.js ekraninda "Run NPM Install" (varsa) sonra "Restart".

ADIM 5 — Admin
  SSH/Terminal varsa: npm run seed:admin
  Yoksa data/users.json zaten admin icerir; .env ADMIN bilgileriyle giris yapin.

IZINLER
  data/ ve public/uploads/ klasorleri yazilabilir olmali (755 veya 775).

SORUN
  Beyaz sayfa: Node.js log + cPanel Error Log kontrol edin.
  Hosting Node.js desteklemiyorsa baska plan gerekir (Vercel, VPS vb.).
`;

const envOrnek = fs.readFileSync(path.join(root, ".env.example"), "utf-8")
  .replaceAll("http://localhost:3000", "https://SIZIN-DOMAININIZ.com")
  .replace("NEXT_PUBLIC_WHATSAPP=905525435254", "NEXT_PUBLIC_WHATSAPP=905525435254")
  .replace("ADMIN_EMAIL=dilalazer54@gmail.com", "ADMIN_EMAIL=dilalazer54@gmail.com");

fs.writeFileSync(path.join(distDir, "KURULUM.txt"), kurulum, "utf-8");
fs.writeFileSync(path.join(distDir, ".env.ornek"), envOrnek, "utf-8");

const htaccess = `RewriteEngine On
RewriteCond %{HTTPS} !=on
RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
`;

fs.writeFileSync(path.join(distDir, ".htaccess"), htaccess, "utf-8");

console.log(">> ZIP olusturuluyor...");
rm(zipPath);
execSync(
  `powershell -NoProfile -Command "Compress-Archive -Path '${distDir}\\*' -DestinationPath '${zipPath}' -Force"`,
  { stdio: "inherit" },
);

const sizeMb = (fs.statSync(zipPath).size / 1024 / 1024).toFixed(1);
console.log(`\nTamam! ZIP hazir: ${zipPath} (${sizeMb} MB)`);
