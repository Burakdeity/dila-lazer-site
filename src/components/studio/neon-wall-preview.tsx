"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Moon, Sun } from "lucide-react";
import { NeonGlowText } from "@/components/studio/neon-glow-text";
import { roomScenes } from "@/components/studio/room-scenes";
import type { NeonFont } from "@/data/neon-fonts";

interface NeonWallPreviewProps {
  text: string;
  font: NeonFont;
  glowColor: string;
  colorName: string;
  sizeDim: string;
  sizeId: string;
  productName: string;
  logoPreview: string | null;
  isRgb?: boolean;
}

type TimeMode = "day" | "night";

const sizeScale: Record<string, { font: string; scale: number; glow: number }> = {
  small: { font: "text-xl sm:text-3xl", scale: 0.72, glow: 0.92 },
  medium: { font: "text-2xl sm:text-4xl", scale: 0.88, glow: 1.05 },
  large: { font: "text-3xl sm:text-5xl", scale: 1, glow: 1.15 },
  xlarge: { font: "text-3xl sm:text-[3.25rem]", scale: 1.12, glow: 1.25 },
};

function roomFilter(timeMode: TimeMode, lightOn: boolean): string {
  if (timeMode === "day") {
    return lightOn
      ? "brightness(1.08) contrast(1.02) saturate(1.05)"
      : "brightness(1.02) contrast(0.98) saturate(0.95)";
  }
  return lightOn
    ? "brightness(0.52) contrast(1.12) saturate(0.88)"
    : "brightness(0.32) contrast(0.95) saturate(0.65)";
}

export function NeonWallPreview({
  text,
  font,
  glowColor,
  colorName,
  sizeDim,
  sizeId,
  productName,
  logoPreview,
  isRgb = false,
}: NeonWallPreviewProps) {
  const [roomId, setRoomId] = useState("dark-loft");
  const [lightOn, setLightOn] = useState(true);
  const [timeMode, setTimeMode] = useState<TimeMode>("night");

  const room = roomScenes.find((r) => r.id === roomId) ?? roomScenes[0];
  const scale = sizeScale[sizeId] ?? sizeScale.medium;
  const totalScale = scale.scale * (room.neonScale ?? 1);
  const isNight = timeMode === "night";
  const glowMultiplier = isNight ? 1.12 : 0.68;
  const intensity = lightOn ? scale.glow * glowMultiplier : 0.1;

  const metaTags = [room.label, isNight ? "Gece" : "Gündüz", colorName];

  const wallGlowStyle = useMemo(
    () =>
      isRgb
        ? undefined
        : ({
            background: `radial-gradient(ellipse at center, ${glowColor}${isNight ? "70" : "40"} 0%, ${glowColor}${isNight ? "30" : "16"} 38%, transparent 74%)`,
          } as const),
    [glowColor, isNight, isRgb],
  );

  const wallGlowSpotStyle = useMemo(
    () => ({
      background: `radial-gradient(ellipse at center, ${glowColor}55 0%, transparent 72%)`,
    }),
    [glowColor],
  );

  return (
    <div className="flex flex-col bg-[#111] select-none">
      <div
        className="relative aspect-[4/3] overflow-hidden"
        style={{ "--neon-glow": glowColor } as React.CSSProperties}
      >
        <Image
          key={`${room.id}-${timeMode}`}
          src={room.image}
          alt={room.label}
          fill
          className="object-cover transition-[filter] duration-500 ease-out"
          style={{
            objectPosition: room.objectPosition,
            filter: roomFilter(timeMode, lightOn),
          }}
          sizes="(max-width: 768px) 100vw, 600px"
          priority
        />

        {timeMode === "day" && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(115deg, rgba(255,248,235,0.45) 0%, rgba(255,255,255,0.12) 35%, transparent 60%), linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 40%)",
            }}
          />
        )}

        {timeMode === "night" && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: lightOn
                ? "radial-gradient(ellipse 90% 70% at 50% 28%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.35) 100%)"
                : "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.25) 45%, rgba(0,0,0,0.55) 100%)",
            }}
          />
        )}

        {lightOn && (
          <>
            <div
              key={isRgb ? "rgb-glow" : glowColor}
              className={`absolute left-1/2 -translate-x-1/2 pointer-events-none transition-opacity duration-200 ${isRgb ? "neon-rgb-wall-glow" : ""}`}
              style={{
                top: `calc(${room.neonTop} - 4%)`,
                width: isNight ? "72%" : "58%",
                height: "42%",
                mixBlendMode: "screen",
                ...wallGlowStyle,
                filter: "blur(26px)",
                opacity: isNight ? 0.9 : 0.55,
              }}
            />
            <div
              key={`spot-${glowColor}`}
              className="absolute left-1/2 -translate-x-1/2 pointer-events-none transition-opacity duration-200"
              style={{
                top: `calc(${room.neonTop} + 2%)`,
                width: "38%",
                height: "18%",
                mixBlendMode: "screen",
                ...wallGlowSpotStyle,
                filter: "blur(12px)",
                opacity: isNight ? 0.85 : 0.45,
              }}
            />
          </>
        )}

        <div
          className="absolute left-1/2 -translate-x-1/2 z-10 flex justify-center w-full px-6 sm:px-8 pointer-events-none"
          style={{ top: room.neonTop }}
        >
          <div
            className="origin-center transition-transform duration-500 max-w-full"
            style={{ transform: `scale(${totalScale})` }}
          >
            {logoPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoPreview}
                alt="Logo önizleme"
                className="max-h-[64px] sm:max-h-[100px] max-w-[min(240px,80vw)] object-contain"
                style={{
                  filter: lightOn
                    ? [
                        `drop-shadow(0 0 6px ${glowColor})`,
                        `drop-shadow(0 0 18px ${glowColor})`,
                        `drop-shadow(0 0 ${isNight ? 48 : 28}px ${glowColor}${isNight ? "cc" : "99"})`,
                      ].join(" ")
                    : `brightness(0.45) drop-shadow(0 0 2px ${glowColor}33)`,
                  opacity: lightOn ? 1 : 0.35,
                }}
              />
            ) : (
              <NeonGlowText
                text={text}
                font={font}
                glowColor={glowColor}
                intensity={intensity}
                fontSize={scale.font}
                lit={lightOn}
                isRgb={isRgb}
              />
            )}
          </div>
        </div>


        {/* Masaüstü kontroller — görsel üzerinde */}
        <div className="hidden sm:flex absolute top-3 left-3 right-3 z-20 items-start justify-between gap-2">
          <div className="flex items-center rounded-full bg-black/50 backdrop-blur-md border border-white/20 p-0.5 shadow-xl">
            <button
              type="button"
              onClick={() => setLightOn(true)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold ${lightOn ? "bg-white text-gray-900" : "text-white/75"}`}
            >
              ON
            </button>
            <button
              type="button"
              onClick={() => setLightOn(false)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold ${!lightOn ? "bg-white text-gray-900" : "text-white/75"}`}
            >
              OFF
            </button>
          </div>
          <div className="flex items-center rounded-full bg-black/50 backdrop-blur-md border border-white/20 p-0.5 shadow-xl">
            <button
              type="button"
              onClick={() => setTimeMode("night")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-bold ${isNight ? "bg-white text-gray-900" : "text-white/75"}`}
            >
              <Moon className="h-3 w-3" />
              Gece
            </button>
            <button
              type="button"
              onClick={() => setTimeMode("day")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-bold ${!isNight ? "bg-white text-gray-900" : "text-white/75"}`}
            >
              <Sun className="h-3 w-3" />
              Gündüz
            </button>
          </div>
        </div>

        <div className="hidden sm:block absolute top-14 right-3 z-20 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/20 pointer-events-none">
          <span className="text-[10px] font-mono text-white/85">{sizeDim}</span>
        </div>

        <div className="hidden sm:block absolute bottom-0 inset-x-0 z-20 px-3 pb-3 pt-10 bg-gradient-to-t from-black/85 via-black/50 to-transparent">
          <p className="text-[9px] uppercase tracking-widest text-white/45 text-center mb-2">Duvar Seç</p>
          <div className="flex gap-2 justify-center overflow-x-auto scrollbar-hide pb-1">
            {roomScenes.map((scene) => {
              const active = scene.id === roomId;
              return (
                <button
                  key={scene.id}
                  type="button"
                  onClick={() => setRoomId(scene.id)}
                  className={`relative flex-shrink-0 w-[68px] h-[46px] sm:w-[76px] sm:h-[50px] rounded-md overflow-hidden transition-all ${
                    active ? "ring-2 ring-white scale-105" : "opacity-65 hover:opacity-100"
                  }`}
                  title={scene.label}
                >
                  <Image src={scene.thumb} alt={scene.label} fill className="object-cover" style={{ objectPosition: scene.objectPosition }} sizes="76px" />
                </button>
              );
            })}
          </div>
          <div className="flex justify-center flex-wrap gap-1.5 mt-2 pointer-events-none">
            {[...metaTags, productName].map((label) => (
              <span key={label} className="text-[10px] font-medium px-2 py-0.5 rounded bg-white/12 text-white/80">
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Mobil kontroller — görselin altında, taşma yok */}
      <div className="sm:hidden bg-[#161616] border-t border-white/10 px-3 py-3 space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center justify-center rounded-full bg-black/40 border border-white/15 p-0.5">
            <button
              type="button"
              onClick={() => setLightOn(true)}
              className={`flex-1 py-2 rounded-full text-[11px] font-bold ${lightOn ? "bg-white text-gray-900" : "text-white/70"}`}
            >
              ON
            </button>
            <button
              type="button"
              onClick={() => setLightOn(false)}
              className={`flex-1 py-2 rounded-full text-[11px] font-bold ${!lightOn ? "bg-white text-gray-900" : "text-white/70"}`}
            >
              OFF
            </button>
          </div>
          <div className="flex items-center justify-center rounded-full bg-black/40 border border-white/15 p-0.5">
            <button
              type="button"
              onClick={() => setTimeMode("night")}
              className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-full text-[11px] font-bold ${isNight ? "bg-white text-gray-900" : "text-white/70"}`}
            >
              <Moon className="h-3 w-3" />
              Gece
            </button>
            <button
              type="button"
              onClick={() => setTimeMode("day")}
              className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-full text-[11px] font-bold ${!isNight ? "bg-white text-gray-900" : "text-white/70"}`}
            >
              <Sun className="h-3 w-3" />
              Gündüz
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <p className="text-[10px] uppercase tracking-wider text-white/50">Duvar seç</p>
          <span className="text-[10px] font-mono text-white/70 px-2 py-0.5 rounded bg-white/10">{sizeDim}</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {roomScenes.map((scene) => {
            const active = scene.id === roomId;
            return (
              <button
                key={scene.id}
                type="button"
                onClick={() => setRoomId(scene.id)}
                className={`relative aspect-[4/3] rounded-md overflow-hidden ${active ? "ring-2 ring-white" : "opacity-70"}`}
                title={scene.label}
              >
                <Image src={scene.thumb} alt={scene.label} fill className="object-cover" style={{ objectPosition: scene.objectPosition }} sizes="120px" />
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {[...metaTags, productName].map((label) => (
            <span key={label} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white/10 text-white/75">
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
