"use client";

import { useMemo } from "react";
import type { NeonFont } from "@/data/neon-fonts";
import { hexToRgba, resolveNeonGlowColor } from "@/lib/neon-color";

interface NeonGlowTextProps {
  text: string;
  font: NeonFont;
  glowColor: string;
  intensity: number;
  fontSize: string;
  lit?: boolean;
  isRgb?: boolean;
}

function buildFontStyle(font: NeonFont): React.CSSProperties {
  return {
    fontFamily: `"${font.family}", cursive, sans-serif`,
    lineHeight: 1.05,
  };
}

function buildTubeGlow(glowColor: string, intensity: number) {
  const color = resolveNeonGlowColor(glowColor);
  const t = Math.max(0.7, Math.min(1.25, intensity));

  const textShadow = [
    "0 0 1px #ffffff",
    "0 0 2px #ffffff",
    "0 0 3px #ffffff",
    `0 0 6px ${hexToRgba(color, 0.95)}`,
    `0 0 10px ${hexToRgba(color, 0.9 * t)}`,
    `0 0 16px ${hexToRgba(color, 0.8 * t)}`,
    `0 0 28px ${hexToRgba(color, 0.62 * t)}`,
    `0 0 44px ${hexToRgba(color, 0.4 * t)}`,
    `0 0 64px ${hexToRgba(color, 0.22 * t)}`,
  ].join(", ");

  const filter = [
    "drop-shadow(0 0 1px #ffffff)",
    `drop-shadow(0 0 4px ${hexToRgba(color, 0.92)})`,
    `drop-shadow(0 0 10px ${hexToRgba(color, 0.75 * t)})`,
    `drop-shadow(0 0 20px ${hexToRgba(color, 0.55 * t)})`,
    `drop-shadow(0 0 36px ${hexToRgba(color, 0.32 * t)})`,
  ].join(" ");

  return { textShadow, filter, strokeColor: hexToRgba(color, 0.88) };
}

export function NeonGlowText({
  text,
  font,
  glowColor,
  intensity,
  fontSize,
  lit = true,
  isRgb = false,
}: NeonGlowTextProps) {
  const display = text.trim() || "NEON";
  const fontStyle = useMemo(() => buildFontStyle(font), [font]);
  const rgbClass = isRgb && lit ? "neon-rgb-text" : "";
  const tube = useMemo(() => buildTubeGlow(glowColor, intensity), [glowColor, intensity]);

  if (!lit) {
    return (
      <span
        className={`block whitespace-pre-wrap text-center select-none ${fontSize}`}
        style={{
          ...fontStyle,
          color: resolveNeonGlowColor(glowColor),
          opacity: 0.28,
          transition: "color 0.35s ease, opacity 0.35s ease",
        }}
      >
        {display}
      </span>
    );
  }

  return (
    <span
      key={`${glowColor}-${isRgb}-${intensity}`}
      className={`block whitespace-pre-wrap text-center select-none ${fontSize} ${rgbClass}`}
      style={
        isRgb && lit
          ? {
              ...fontStyle,
              transition: "filter 0.35s ease",
            }
          : {
              ...fontStyle,
              color: "#fffef8",
              WebkitTextStroke: `0.45px ${tube.strokeColor}`,
              paintOrder: "stroke fill",
              textShadow: tube.textShadow,
              filter: tube.filter,
              transition: "text-shadow 0.35s ease, filter 0.35s ease, -webkit-text-stroke-color 0.35s ease",
            }
      }
    >
      {display}
    </span>
  );
}
