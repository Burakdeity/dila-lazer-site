/** Neon önizleme için hex → rgba dönüşümü */
export function hexToRgba(hex: string, alpha: number): string {
  const normalized = hex.replace("#", "").trim();
  if (normalized.length !== 6 || Number.isNaN(Number(`0x${normalized}`))) {
    return hex;
  }
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${Math.max(0, Math.min(1, alpha))})`;
}

/** Beyaz neon duvar önizlemesinde görünür bir halo rengi */
export function resolveNeonGlowColor(hex: string): string {
  if (hex.toUpperCase() === "#FFFFFF") {
    return "#B8DCFF";
  }
  return hex;
}

export function wallGlowGradient(glowColor: string, isNight: boolean): string {
  const color = resolveNeonGlowColor(glowColor);
  const inner = hexToRgba(color, isNight ? 0.44 : 0.25);
  const outer = hexToRgba(color, isNight ? 0.18 : 0.09);
  return `radial-gradient(ellipse at center, ${inner} 0%, ${outer} 38%, transparent 74%)`;
}

export function wallGlowSpot(glowColor: string): string {
  const color = resolveNeonGlowColor(glowColor);
  return `radial-gradient(ellipse at center, ${hexToRgba(color, 0.33)} 0%, transparent 72%)`;
}
