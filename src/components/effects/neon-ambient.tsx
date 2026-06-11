"use client";

interface NeonAmbientProps {
  variant?: "hero" | "dark" | "subtle";
}

export function NeonAmbient({ variant = "hero" }: NeonAmbientProps) {
  const intense = variant === "hero";

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {/* Izgara */}
      <div
        className={`absolute inset-0 neon-grid ${intense ? "opacity-40" : "opacity-20"}`}
      />

      {/* Yüzen ışık küreleri */}
      <div className="neon-orb neon-orb-red" style={{ top: "15%", right: "12%" }} />
      <div className="neon-orb neon-orb-blue" style={{ bottom: "25%", left: "8%", animationDelay: "-3s" }} />
      <div className="neon-orb neon-orb-pink" style={{ top: "40%", right: "35%", animationDelay: "-5s" }} />

      {/* Köşe çizgileri */}
      <div className="absolute top-4 left-4 w-12 h-12 border-l-2 border-t-2 border-brand-red/40 neon-corner-pulse" />
      <div className="absolute top-4 right-4 w-12 h-12 border-r-2 border-t-2 border-cyan-400/30 neon-corner-pulse" style={{ animationDelay: "-1s" }} />
      <div className="absolute bottom-16 left-4 w-12 h-12 border-l-2 border-b-2 border-fuchsia-400/25 neon-corner-pulse" style={{ animationDelay: "-2s" }} />
    </div>
  );
}
