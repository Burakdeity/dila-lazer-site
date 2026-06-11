import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";

export interface StoredUser {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: string;
  loyaltyTier: string;
  points: number;
  createdAt: string;
}

const USERS_PATH = path.join(process.cwd(), "data", "users.json");

async function ensureFile(): Promise<StoredUser[]> {
  try {
    const raw = (await fs.readFile(USERS_PATH, "utf-8")).trim();
    if (!raw) throw new Error("empty");
    const parsed = JSON.parse(raw) as StoredUser[];
    if (!Array.isArray(parsed)) throw new Error("invalid");
    return parsed;
  } catch {
    await fs.mkdir(path.dirname(USERS_PATH), { recursive: true });
    await fs.writeFile(USERS_PATH, "[]", "utf-8");
    return [];
  }
}

async function saveUsers(users: StoredUser[]): Promise<void> {
  await fs.mkdir(path.dirname(USERS_PATH), { recursive: true });
  await fs.writeFile(USERS_PATH, JSON.stringify(users, null, 2), "utf-8");
}

export async function getAllUsers(): Promise<StoredUser[]> {
  return ensureFile();
}

export async function getCustomers(): Promise<StoredUser[]> {
  const users = await ensureFile();
  return users
    .filter((u) => u.role === "CUSTOMER")
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function findUserByEmail(email: string): Promise<StoredUser | null> {
  const users = await ensureFile();
  return users.find((u) => u.email === email.toLowerCase()) ?? null;
}

export async function createUser(data: {
  email: string;
  name: string;
  passwordHash: string;
}): Promise<StoredUser> {
  const users = await ensureFile();
  const normalizedEmail = data.email.toLowerCase();

  if (users.some((u) => u.email === normalizedEmail)) {
    throw new Error("EMAIL_EXISTS");
  }

  const user: StoredUser = {
    id: randomUUID(),
    email: normalizedEmail,
    name: data.name,
    passwordHash: data.passwordHash,
    role: "CUSTOMER",
    loyaltyTier: "BRONZE",
    points: 0,
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  await saveUsers(users);
  return user;
}

/** .env içindeki ADMIN_EMAIL / ADMIN_PASSWORD ile admin hesabı oluşturur veya günceller */
export async function seedAdminUser(): Promise<void> {
  const email = process.env.ADMIN_EMAIL?.toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) return;

  const users = await ensureFile();
  const passwordHash = await bcrypt.hash(password, 12);
  const existing = users.find((u) => u.email === email);

  if (existing) {
    existing.role = "ADMIN";
    existing.passwordHash = passwordHash;
    if (!existing.name) existing.name = "Admin";
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

  await saveUsers(users);
}
