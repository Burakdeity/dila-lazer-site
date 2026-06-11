import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function loadJsonStore<T>(key: string, seed: T): Promise<T> {
  const row = await prisma.appData.findUnique({ where: { key } });
  if (!row) {
    await prisma.appData.create({
      data: { key, value: seed as Prisma.InputJsonValue },
    });
    return seed;
  }
  return row.value as T;
}

export async function saveJsonStore<T>(key: string, value: T): Promise<void> {
  await prisma.appData.upsert({
    where: { key },
    create: { key, value: value as Prisma.InputJsonValue },
    update: { value: value as Prisma.InputJsonValue },
  });
}
