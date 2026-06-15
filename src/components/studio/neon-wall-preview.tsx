"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Moon, Sun } from "lucide-react";
import { NeonGlowText } from "@/components/studio/neon-glow-text";
import { roomScenes } from "@/components/studio/room-scenes";
import { wallGlowGradient, wallGlowSpot, resolveNeonGlowColor, hexToRgba } from "@/lib/neon-color";
import type { NeonFont } from "@/data/neon-fonts";

interface NeonWallPreviewProps {
  text: string;
  font: NeonFont;
  glowColor: string;
  colorName: string;
  productName: string;
  logoPreview: string | null;
  isRgb?: boolean;
}

type TimeMode = "day" | "night";

const PREVIEW_FONT = "text-5xl sm:text-7xl lg:text-8xl";
const PREVIEW_SCALE = 1.35;
const PREVIEW_GLOW = 1.2;

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
  productName,
  logoPreview,
  isRgb = false,
}: NeonWallPreviewProps) {
  const [roomId, setRoomId] = useState("dark-loft");
  const [lightOn, setLightOn] = useState(true);
  const [timeMode, setTimeMode] = useState<TimeMode>("night");

  const room = roomScenes.find((r) => r.id === roomId) ?? roomScenes[0];
  const totalScale = PREVIEW_SCALE * (room.neonScale ?? 1);
  const isNight = timeMode === "night";
  const glowMultiplier = isNight ? 1.12 : 0.68;
  const intensity = lightOn ? PREVIEW_GLOW * glowMultiplier : 0.1;

  const metaTags = [room.label, isNight ? "Gece" : "Gündüz", colorName];

  const wallGlowStyle = useMemo(
    () => (isRgb ? undefined : { background: wallGlowGradient(glowColor, isNight) }),
    [glowColor, isNight, isRgb],
  );

  const wallGlowSpotStyle = useMemo(
    () => (isRgb ? undefined : { background: wallGlowSpot(glowColor) }),
    [glowColor, isRgb],
  );

  return (
    <div className="flex flex-col bg-[#111] select-none">
      <div
        className="relative aspect-[4/3] sm:aspect-[5/4] min-h-[320px] sm:min-h-[460px] lg:min-h-[520px] overflow-hidden"
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
          sizes="(max-width: 768px) 100vw, 800px"
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
              className={`absolute left-1/2 -translate-x-1/2 pointer-events-none transition-[opacity,background] duration-300 ${isRgb ? "neon-rgb-wall-glow" : ""}`}
              style={{
                top: `calc(${room.neonTop} - 4%)`,
                width: isNight ? "78%" : "64%",
                height: "48%",
                mixBlendMode: "screen",
                ...wallGlowStyle,
                filter: "blur(26px)",
                opacity: isNight ? 0.85 : 0.5,
              }}
            />
            {!isRgb && (
            <div
              key={`spot-${glowColor}`}
              className="absolute left-1/2 -translate-x-1/2 pointer-events-none transition-[opacity,background] duration-300"
              style={{
                top: `calc(${room.neonTop} + 2%)`,
                width: "42%",
                height: "22%",
                mixBlendMode: "screen",
                ...wallGlowSpotStyle,
                filter: "blur(12px)",
                opacity: isNight ? 0.75 : 0.4,
              }}
            />
            )}
          </>
        )}

        <div
          className="absolute left-1/2 -translate-x-1/2 z-10 flex justify-center w-full px-4 sm:px-6 pointer-events-none"
          style={{ top: room.neonTop }}
        >
          <div
            className="origin-center transition-transform duration-500 max-w-[95%]"
            style={{ transform: `scale(${totalScale})` }}
          >
            {logoPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={glowColor}
                src={logoPreview}
                alt="Logo önizleme"
                className="max-h-[80px] sm:max-h-[120px] max-w-[min(280px,90vw)] object-contain transition-[filter,opacity] duration-300"
                style={{
                  filter: lightOn
                    ? [
                        `drop-shadow(0 0 6px ${hexToRgba(resolveNeonGlowColor(glowColor), 0.9)})`,
                        `drop-shadow(0 0 18px ${hexToRgba(resolveNeonGlowColor(glowColor), 0.75)})`,
                        `drop-shadow(0 0 ${isNight ? 48 : 28}px ${hexToRgba(resolveNeonGlowColor(glowColor), isNight ? 0.8 : 0.55)})`,
                      ].join(" ")
                    : `brightness(0.45) drop-shadow(0 0 2px ${hexToRgba(resolveNeonGlowColor(glowColor), 0.2)})`,
                  opacity: lightOn ? 1 : 0.35,
                }}
              />
            ) : (
              <NeonGlowText
                key={`${glowColor}-${isRgb}-${text}`}
                text={text}
                font={font}
                glowColor={glowColor}
                intensity={intensity}
                fontSize={PREVIEW_FONT}
                lit={lightOn}
                isRgb={isRgb}
              />
            )}
          </div>
        </div>

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

        <p className="text-[10px] uppercase tracking-wider text-white/50">Duvar seç</p>

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
