import { randomUUID } from "crypto";
import type { Order, OrderStatus } from "@/types/admin";
import { loadJsonStore, saveJsonStore } from "@/lib/app-data";

const STORE_KEY = "orders";

const seedOrders: Order[] = [
  {
    id: "1",
    orderNo: "SIP-2025-001",
    customerName: "Ahmet Yılmaz",
    customerEmail: "ahmet@email.com",
    customerPhone: "0532 111 22 33",
    productName: "Premium İsim Neon Tabela",
    amount: 4500,
    status: "production",
    createdAt: "2025-06-05T10:30:00.000Z",
    shippingCity: "İstanbul",
  },
  {
    id: "2",
    orderNo: "SIP-2025-002",
    customerName: "Elif Kaya",
    customerEmail: "elif@email.com",
    customerPhone: "0542 222 33 44",
    productName: "LED Kutu Harf Tabela",
    amount: 8200,
    status: "shipped",
    createdAt: "2025-06-04T14:15:00.000Z",
    shippingCity: "Ankara",
  },
  {
    id: "3",
    orderNo: "SIP-2025-003",
    customerName: "Murat Demir",
    customerEmail: "murat@email.com",
    productName: "Cafe Neon Tabela",
    amount: 2800,
    status: "confirmed",
    createdAt: "2025-06-03T09:00:00.000Z",
    shippingCity: "İzmir",
  },
  {
    id: "4",
    orderNo: "SIP-2025-004",
    customerName: "Zeynep Arslan",
    customerEmail: "zeynep@email.com",
    customerPhone: "0555 444 55 66",
    productName: "Pleksi Kapı Tabelası",
    amount: 1800,
    status: "delivered",
    createdAt: "2025-06-01T16:45:00.000Z",
    shippingCity: "Bursa",
  },
  {
    id: "5",
    orderNo: "SIP-2025-005",
    customerName: "Can Öztürk",
    customerEmail: "can@email.com",
    productName: "RGB Neon Duvar",
    amount: 6200,
    status: "pending",
    createdAt: "2025-06-07T11:20:00.000Z",
    shippingCity: "Antalya",
  },
];

async function ensureOrders(): Promise<Order[]> {
  const orders = await loadJsonStore<Order[]>(STORE_KEY, [...seedOrders]);
  if (!Array.isArray(orders) || orders.length === 0) {
    await saveJsonStore(STORE_KEY, seedOrders);
    return [...seedOrders];
  }
  return orders;
}

async function saveOrders(orders: Order[]): Promise<void> {
  await saveJsonStore(STORE_KEY, orders);
}

export async function getAllOrders(): Promise<Order[]> {
  const orders = await ensureOrders();
  return [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getOrderById(id: string): Promise<Order | null> {
  const orders = await ensureOrders();
  return orders.find((o) => o.id === id) ?? null;
}

export async function trackOrder(orderNo: string, email: string): Promise<Order | null> {
  const orders = await ensureOrders();
  const normalizedNo = orderNo.trim().toUpperCase();
  const normalizedEmail = email.trim().toLowerCase();

  return (
    orders.find(
      (o) =>
        o.orderNo.toUpperCase() === normalizedNo &&
        o.customerEmail.toLowerCase() === normalizedEmail
    ) ?? null
  );
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<Order | null> {
  const orders = await ensureOrders();
  const index = orders.findIndex((o) => o.id === id);
  if (index === -1) return null;
  orders[index] = { ...orders[index], status };
  await saveOrders(orders);
  return orders[index];
}

export async function getOrderStats() {
  const orders = await ensureOrders();
  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.amount, 0);
  const pending = orders.filter((o) => o.status === "pending").length;
  const active = orders.filter((o) => !["delivered", "cancelled"].includes(o.status)).length;
  return { total: orders.length, totalRevenue, pending, active };
}

export async function createOrder(data: Omit<Order, "id" | "orderNo" | "createdAt">): Promise<Order> {
  const orders = await ensureOrders();
  const order: Order = {
    ...data,
    id: randomUUID(),
    orderNo: `SIP-2025-${String(orders.length + 1).padStart(3, "0")}`,
    createdAt: new Date().toISOString(),
  };
  orders.unshift(order);
  await saveOrders(orders);
  return order;
}
