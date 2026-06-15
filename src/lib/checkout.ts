import { FREE_SHIPPING_THRESHOLD } from "@/components/cart/free-shipping-bar";

export { FREE_SHIPPING_THRESHOLD };

export const SHIPPING_FEE = 150;

export function calcShipping(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
}

export function calcGrandTotal(subtotal: number, discount: number, shipping?: number): number {
  const ship = shipping ?? calcShipping(subtotal);
  return Math.max(0, subtotal - discount) + ship;
}

export function summarizeProductName(
  items: Array<{ name: string; quantity: number }>
): string {
  if (items.length === 0) return "Online sipariş";
  if (items.length === 1) {
    const item = items[0];
    return item.quantity > 1 ? `${item.name} (×${item.quantity})` : item.name;
  }
  const totalQty = items.reduce((sum, i) => sum + i.quantity, 0);
  return `${items[0].name} +${items.length - 1} ürün (${totalQty} adet)`;
}
