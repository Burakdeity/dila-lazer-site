import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

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

function toStoredUser(user: {
  id: string;
  email: string | null;
  name: string | null;
  passwordHash: string | null;
  role: string;
  loyaltyTier: string;
  points: number;
  createdAt: Date;
}): StoredUser {
  return {
    id: user.id,
    email: user.email ?? "",
    name: user.name ?? "",
    passwordHash: user.passwordHash ?? "",
    role: user.role,
    loyaltyTier: user.loyaltyTier,
    points: user.points,
    createdAt: user.createdAt.toISOString(),
  };
}

export async function getAllUsers(): Promise<StoredUser[]> {
  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });
  return users.map(toStoredUser);
}

export async function getCustomers(): Promise<StoredUser[]> {
  const users = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    orderBy: { createdAt: "desc" },
  });
  return users.map(toStoredUser);
}

export async function findUserByEmail(email: string): Promise<StoredUser | null> {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
  if (!user || !user.passwordHash) return null;
  return toStoredUser(user);
}

export async function createUser(data: {
  email: string;
  name: string;
  passwordHash: string;
}): Promise<StoredUser> {
  const normalizedEmail = data.email.toLowerCase();

  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });
  if (existing) {
    throw new Error("EMAIL_EXISTS");
  }

  const user = await prisma.user.create({
    data: {
      email: normalizedEmail,
      name: data.name,
      passwordHash: data.passwordHash,
      role: "CUSTOMER",
      loyaltyTier: "BRONZE",
      points: 0,
    },
  });

  return toStoredUser(user);
}

/** .env içindeki ADMIN_EMAIL / ADMIN_PASSWORD ile admin hesabı oluşturur veya günceller */
export async function seedAdminUser(): Promise<void> {
  const email = process.env.ADMIN_EMAIL?.toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) return;

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    create: {
      email,
      name: "Admin",
      passwordHash,
      role: "ADMIN",
      loyaltyTier: "GOLD",
      points: 0,
    },
    update: {
      passwordHash,
      role: "ADMIN",
      name: "Admin",
    },
  });
}
