"use client";

import { memo, useMemo } from "react";
import type { NeonFont } from "@/data/neon-fonts";

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
    fontWeight: font.weight ?? 400,
    fontStyle: font.style ?? "normal",
    letterSpacing: font.letterSpacing,
    textTransform: font.textTransform,
    lineHeight: 1.15,
  };
}

function withAlpha(hex: string, alpha: number): string {
  if (hex.startsWith("#") && hex.length === 7) {
    return `${hex}${Math.round(alpha * 255)
      .toString(16)
      .padStart(2, "0")}`;
  }
  return hex;
}

function buildTubeGlow(glowColor: string, intensity: number) {
  const t = Math.max(0.7, Math.min(1.25, intensity));

  const textShadow = [
    "0 0 1px #ffffff",
    "0 0 2px #ffffff",
    "0 0 3px #ffffff",
    "0 0 4px #ffffff",
    `0 0 6px ${glowColor}`,
    `0 0 10px ${glowColor}`,
    `0 0 16px ${withAlpha(glowColor, 0.95 * t)}`,
    `0 0 28px ${withAlpha(glowColor, 0.8 * t)}`,
    `0 0 44px ${withAlpha(glowColor, 0.55 * t)}`,
    `0 0 64px ${withAlpha(glowColor, 0.32 * t)}`,
  ].join(", ");

  const filter = [
    "drop-shadow(0 0 1px #ffffff)",
    `drop-shadow(0 0 4px ${glowColor})`,
    `drop-shadow(0 0 10px ${withAlpha(glowColor, 0.9 * t)})`,
    `drop-shadow(0 0 20px ${withAlpha(glowColor, 0.7 * t)})`,
    `drop-shadow(0 0 36px ${withAlpha(glowColor, 0.45 * t)})`,
    `drop-shadow(0 0 56px ${withAlpha(glowColor, 0.28 * t)})`,
  ].join(" ");

  return { textShadow, filter };
}

export const NeonGlowText = memo(function NeonGlowText({
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
  const outlineStroke = font.variant === "thin-outline" ? 1.75 : 2.75;
  const isOutline =
    font.variant === "outline" ||
    font.variant === "neon-outline" ||
    font.variant === "thin-outline";

  if (!lit) {
    if (isOutline) {
      return (
        <span
          className={`block whitespace-pre-wrap text-center select-none ${fontSize}`}
          style={{
            ...fontStyle,
            color: "transparent",
            WebkitTextStroke: `${outlineStroke * 0.55}px ${glowColor}66`,
            opacity: 0.35,
          }}
        >
          {display}
        </span>
      );
    }

    return (
      <span
        className={`block whitespace-pre-wrap text-center select-none ${fontSize}`}
        style={{
          ...fontStyle,
          color: glowColor,
          opacity: 0.28,
        }}
      >
        {display}
      </span>
    );
  }

  if (isOutline) {
    const isNeonOutline = font.variant === "neon-outline";

    return (
      <span
        className={`block whitespace-pre-wrap text-center select-none ${fontSize} ${rgbClass}`}
        style={
          isRgb && lit
            ? {
                ...fontStyle,
                color: isNeonOutline ? glowColor : "transparent",
                WebkitTextStroke: `${outlineStroke}px ${glowColor}`,
              }
            : isNeonOutline
              ? {
                  ...fontStyle,
                  color: glowColor,
                  WebkitTextStroke: "1px rgba(255,255,255,0.9)",
                  paintOrder: "stroke fill",
                  textShadow: tube.textShadow,
                  filter: tube.filter,
                }
              : {
                  ...fontStyle,
                  color: "transparent",
                  WebkitTextStroke: `${outlineStroke}px ${glowColor}`,
                  textShadow: tube.textShadow,
                  filter: tube.filter,
                }
        }
      >
        {display}
      </span>
    );
  }

  return (
    <span
      className={`block whitespace-pre-wrap text-center select-none ${fontSize} ${rgbClass}`}
      style={
        isRgb && lit
          ? fontStyle
          : {
              ...fontStyle,
              color: "#fffef8",
              WebkitTextStroke: `0.45px ${withAlpha(glowColor, 0.85)}`,
              paintOrder: "stroke fill",
              textShadow: tube.textShadow,
              filter: tube.filter,
            }
      }
    >
      {display}
    </span>
  );
});
