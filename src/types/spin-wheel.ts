export type SpinPrizeType = "discount" | "retry";

export interface SpinSegment {
  id: string;
  label: string;
  type: SpinPrizeType;
  discountPercent?: number;
  couponCode?: string;
  weight: number;
  color?: string;
}

export interface SpinWheelConfig {
  isActive: boolean;
  cooldownHours: number;
  couponValidDays: number;
  segments: SpinSegment[];
}

export interface SpinWheelStatus {
  isActive: boolean;
  isLoggedIn: boolean;
  canSpin: boolean;
  nextSpinAt: string | null;
  segments: SpinSegment[];
  cooldownHours: number;
}

export interface SpinResult {
  segmentIndex: number;
  prizeType: SpinPrizeType;
  prizeLabel: string;
  couponCode: string | null;
  couponExpiresAt: string | null;
  message: string;
}

export const DEFAULT_SPIN_SEGMENTS: SpinSegment[] = [
  { id: "1", label: "%5 İndirim", type: "discount", discountPercent: 5, couponCode: "SPIN5", weight: 1, color: "#1e3a5f" },
  { id: "2", label: "%10 İndirim", type: "discount", discountPercent: 10, couponCode: "SPIN10", weight: 1, color: "#d4af37" },
  { id: "3", label: "%15 İndirim", type: "discount", discountPercent: 15, couponCode: "SPIN15", weight: 1, color: "#1e3a5f" },
  { id: "4", label: "Tekrar Dene", type: "retry", weight: 1, color: "#0f172a" },
  { id: "5", label: "%5 İndirim", type: "discount", discountPercent: 5, couponCode: "SPIN5", weight: 1, color: "#d4af37" },
  { id: "6", label: "%10 İndirim", type: "discount", discountPercent: 10, couponCode: "SPIN10", weight: 1, color: "#1e3a5f" },
  { id: "7", label: "%15 İndirim", type: "discount", discountPercent: 15, couponCode: "SPIN15", weight: 1, color: "#d4af37" },
  { id: "8", label: "Tekrar Dene", type: "retry", weight: 1, color: "#0f172a" },
];

export const SEGMENT_COLORS = ["#1a365d", "#c9a227", "#1e40af", "#111827", "#b8860b", "#1e3a8a", "#d4af37", "#0f172a"];
