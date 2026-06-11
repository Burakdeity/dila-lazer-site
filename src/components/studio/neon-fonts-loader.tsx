"use client";

import { useEffect } from "react";
import { buildGoogleFontsUrl } from "@/data/neon-fonts";

const LINK_ID = "neon-studio-fonts";

export function NeonFontsLoader() {
  useEffect(() => {
    if (document.getElementById(LINK_ID)) return;

    const link = document.createElement("link");
    link.id = LINK_ID;
    link.rel = "stylesheet";
    link.href = buildGoogleFontsUrl();
    document.head.appendChild(link);
  }, []);

  return null;
}
