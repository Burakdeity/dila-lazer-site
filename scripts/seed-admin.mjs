import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, "..");
const envPath = path.join(projectRoot, ".env");

function loadEnv() {
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    process.env[key] = val;
  }
}

loadEnv();

const email = process.env.ADMIN_EMAIL?.toLowerCase().trim();
const password = process.env.ADMIN_PASSWORD;

if (!email || !password) {
  console.error("ADMIN_EMAIL ve ADMIN_PASSWORD .env dosyasında tanımlı olmalı.");
  process.exit(1);
}

const usersPath = path.join(projectRoot, "data", "users.json");
let users = [];
try {
  users = JSON.parse(fs.readFileSync(usersPath, "utf8"));
} catch {
  users = [];
}

const passwordHash = await bcrypt.hash(password, 12);
const idx = users.findIndex((u) => u.email === email);

if (idx >= 0) {
  users[idx].role = "ADMIN";
  users[idx].passwordHash = passwordHash;
  users[idx].name = users[idx].name || "Admin";
} else {
  users.push({
    id: randomUUID(),
    email,
    name: "Admin",
    passwordHash,
    role: "ADMIN",
    loyaltyTier: "GOLD",
    points: 0,
    createdAt: new Date().toISOString(),
  });
}

fs.mkdirSync(path.dirname(usersPath), { recursive: true });
fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
console.log("Admin hesabı hazır:", email);
