import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import type { Quote, QuoteStatus } from "@/types/admin";

const QUOTES_PATH = path.join(process.cwd(), "data", "quotes.json");

const seedQuotes: Quote[] = [
  {
    id: "1",
    name: "Serkan Bulut",
    email: "serkan@firma.com",
    phone: "0533 100 20 30",
    company: "Bulut Cafe",
    productType: "Cafe Neon Tabela",
    message: "80x40 cm cafe neon, kırmızı ve beyaz renk. Duvar montajı dahil.",
    status: "new",
    createdAt: "2025-06-07T08:00:00.000Z",
  },
  {
    id: "2",
    name: "Ayşe Nur",
    email: "ayse@email.com",
    phone: "0544 200 30 40",
    productType: "Logo Neon",
    message: "Restoran logosu için özel tasarım neon istiyorum.",
    status: "reviewing",
    createdAt: "2025-06-06T15:30:00.000Z",
  },
  {
    id: "3",
    name: "Mehmet Koç",
    email: "mehmet@isyeri.com",
    phone: "0555 300 40 50",
    company: "Koç Otomotiv",
    productType: "LED Kutu Harf",
    message: "Dış cephe kutu harf tabela, 3 metre genişlik.",
    status: "quoted",
    createdAt: "2025-06-05T11:00:00.000Z",
  },
  {
    id: "4",
    name: "Deniz Ak",
    email: "deniz@email.com",
    phone: "0532 400 50 60",
    productType: "MDF Dekor",
    message: "Ofis duvarı için MDF tablo seti.",
    status: "accepted",
    createdAt: "2025-06-03T09:45:00.000Z",
  },
];

async function ensureQuotes(): Promise<Quote[]> {
  try {
    const raw = (await fs.readFile(QUOTES_PATH, "utf-8")).trim();
    if (!raw) throw new Error("empty");
    const parsed = JSON.parse(raw) as Quote[];
    if (!Array.isArray(parsed) || parsed.length === 0) throw new Error("empty");
    return parsed;
  } catch {
    await fs.mkdir(path.dirname(QUOTES_PATH), { recursive: true });
    await fs.writeFile(QUOTES_PATH, JSON.stringify(seedQuotes, null, 2), "utf-8");
    return [...seedQuotes];
  }
}

async function saveQuotes(quotes: Quote[]): Promise<void> {
  await fs.mkdir(path.dirname(QUOTES_PATH), { recursive: true });
  await fs.writeFile(QUOTES_PATH, JSON.stringify(quotes, null, 2), "utf-8");
}

export async function getAllQuotes(): Promise<Quote[]> {
  const quotes = await ensureQuotes();
  return [...quotes].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function updateQuoteStatus(id: string, status: QuoteStatus): Promise<Quote | null> {
  const quotes = await ensureQuotes();
  const index = quotes.findIndex((q) => q.id === id);
  if (index === -1) return null;
  quotes[index] = { ...quotes[index], status };
  await saveQuotes(quotes);
  return quotes[index];
}

export async function getQuoteStats() {
  const quotes = await ensureQuotes();
  return {
    total: quotes.length,
    new: quotes.filter((q) => q.status === "new").length,
    active: quotes.filter((q) => !["accepted", "rejected"].includes(q.status)).length,
  };
}

export async function createQuote(
  data: Omit<Quote, "id" | "status" | "createdAt">
): Promise<Quote> {
  const quotes = await ensureQuotes();
  const quote: Quote = {
    ...data,
    id: randomUUID(),
    status: "new",
    createdAt: new Date().toISOString(),
  };
  quotes.unshift(quote);
  await saveQuotes(quotes);
  return quote;
}
