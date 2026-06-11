"use client";

import { useEffect } from "react";
import { buildLocalFontsCss } from "@/data/neon-fonts";

const STYLE_ID = "neon-studio-fonts";

export function NeonFontsLoader() {
  useEffect(() => {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = buildLocalFontsCss();
    document.head.appendChild(style);
  }, []);

  return null;
}
