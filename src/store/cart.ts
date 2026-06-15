import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  slug: string;
  image: string;
  quantity: number;
  unitPrice: number;
  size?: string;
  material?: string;
  color?: string;
  customText?: string;
}

export interface AppliedCoupon {
  code: string;
  discountType: string;
  discountValue: number;
}

interface CartState {
  items: CartItem[];
  couponCode: string | null;
  appliedCoupon: AppliedCoupon | null;
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setCoupon: (code: string | null) => void;
  setAppliedCoupon: (coupon: AppliedCoupon | null) => void;
  subtotal: () => number;
  discountAmount: () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: null,
      appliedCoupon: null,

      addItem: (item) => {
        const id = `${item.productId}-${item.size}-${item.material}-${item.color}`;
        const existing = get().items.find((i) => i.id === id);

        if (existing) {
          set({
            items: get().items.map((i) =>
              i.id === id ? { ...i, quantity: i.quantity + item.quantity } : i
            ),
          });
        } else {
          set({ items: [...get().items, { ...item, id }] });
        }
      },

      removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        });
      },

      clearCart: () => set({ items: [], couponCode: null, appliedCoupon: null }),

      setCoupon: (code) => set({ couponCode: code }),

      setAppliedCoupon: (coupon) => set({ appliedCoupon: coupon, couponCode: coupon?.code ?? null }),

      subtotal: () => get().items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),

      discountAmount: () => {
        const coupon = get().appliedCoupon;
        const sub = get().subtotal();
        if (!coupon) return 0;
        if (coupon.discountType === "percent") {
          return Math.round((sub * coupon.discountValue) / 100);
        }
        return Math.min(coupon.discountValue, sub);
      },

      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: "premium-neon-cart" }
  )
);
