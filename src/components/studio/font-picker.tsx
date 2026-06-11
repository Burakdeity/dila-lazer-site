"use client";

import { neonFonts, type NeonFont } from "@/data/neon-fonts";

interface FontPickerProps {
  selectedId: string;
  onSelect: (font: NeonFont) => void;
  previewColor?: string;
}

function fontPreviewStyle(font: NeonFont, color: string): React.CSSProperties {
  const base: React.CSSProperties = {
    fontFamily: `"${font.family}", cursive`,
    fontWeight: font.weight ?? 400,
    fontStyle: font.style ?? "normal",
    letterSpacing: font.letterSpacing,
    textTransform: font.textTransform,
    lineHeight: 1.1,
  };

  if (font.variant === "outline" || font.variant === "neon-outline") {
    return {
      ...base,
      color: "transparent",
      WebkitTextStroke: `1px ${color}`,
    };
  }

  if (font.variant === "thin-outline") {
    return {
      ...base,
      color: "transparent",
      WebkitTextStroke: `0.75px ${color}`,
      opacity: 0.85,
    };
  }

  return { ...base, color };
}

export function FontPicker({ selectedId, onSelect, previewColor = "#333" }: FontPickerProps) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Font Seç</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-3 gap-y-1 max-h-[420px] overflow-y-auto pr-1">
        {neonFonts.map((font) => {
          const active = font.id === selectedId;
          return (
            <button
              key={font.id}
              type="button"
              onClick={() => onSelect(font)}
              className={`text-left py-2 px-1 rounded-lg transition-all truncate ${
                active
                  ? "bg-brand-red/8 ring-1 ring-brand-red/30"
                  : "hover:bg-gray-50"
              }`}
              title={font.name}
            >
              <span
                className="block text-[15px] sm:text-base truncate"
                style={fontPreviewStyle(font, active ? "#D50000" : previewColor)}
              >
                {font.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
