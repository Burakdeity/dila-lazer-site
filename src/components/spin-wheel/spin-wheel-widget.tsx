"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Lock, Sparkles, Clock } from "lucide-react";
import type { SpinResult, SpinSegment, SpinWheelStatus } from "@/types/spin-wheel";
import { fireConfetti } from "@/components/spin-wheel/confetti";
import { cn } from "@/lib/utils";

function formatCountdown(targetIso: string) {
  const diff = new Date(targetIso).getTime() - Date.now();
  if (diff <= 0) return "Hazır";
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  return `${h}s ${m}dk`;
}

function WheelSvg({
  segments,
  rotation,
  idPrefix,
}: {
  segments: SpinSegment[];
  rotation: number;
  idPrefix: string;
}) {
  const count = segments.length;
  const slice = 360 / count;
  const radius = 140;
  const cx = 150;
  const cy = 150;

  return (
    <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-[0_0_40px_rgba(212,175,55,0.35)]">
      <defs>
        <radialGradient id={`${idPrefix}-wheelGlow`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.6" />
        </radialGradient>
        <filter id={`${idPrefix}-neonGlow`}>
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g
        style={{
          transform: `rotate(${rotation}deg)`,
          transformOrigin: "150px 150px",
          transition: rotation > 0 ? "transform 5s cubic-bezier(0.15, 0.85, 0.15, 1)" : "none",
        }}
      >
        {segments.map((seg, i) => {
          const startAngle = (i * slice - 90) * (Math.PI / 180);
          const endAngle = ((i + 1) * slice - 90) * (Math.PI / 180);
          const x1 = cx + radius * Math.cos(startAngle);
          const y1 = cy + radius * Math.sin(startAngle);
          const x2 = cx + radius * Math.cos(endAngle);
          const y2 = cy + radius * Math.sin(endAngle);
          const largeArc = slice > 180 ? 1 : 0;
          const fill = seg.color ?? (i % 2 === 0 ? "#1e3a8a" : "#c9a227");
          const midAngle = ((i + 0.5) * slice - 90) * (Math.PI / 180);
          const tx = cx + radius * 0.62 * Math.cos(midAngle);
          const ty = cy + radius * 0.62 * Math.sin(midAngle);
          const textRot = i * slice + slice / 2;

          return (
            <g key={`${seg.id}-${i}`}>
              <path
                d={`M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`}
                fill={fill}
                stroke="#d4af37"
                strokeWidth="1.5"
                filter={`url(#${idPrefix}-neonGlow)`}
              />
              <text
                x={tx}
                y={ty}
                fill="#fff"
                fontSize="11"
                fontWeight="700"
                textAnchor="middle"
                dominantBaseline="middle"
                transform={`rotate(${textRot}, ${tx}, ${ty})`}
                style={{ textShadow: "0 0 8px rgba(255,255,255,0.8)" }}
              >
                {seg.label.length > 14 ? seg.label.slice(0, 12) + "…" : seg.label}
              </text>
            </g>
          );
        })}
        <circle cx={cx} cy={cy} r="28" fill="#0f172a" stroke="#d4af37" strokeWidth="3" />
        <circle cx={cx} cy={cy} r="18" fill={`url(#${idPrefix}-wheelGlow)`} stroke="#3b82f6" strokeWidth="1" />
      </g>
      <polygon
        points="150,18 138,42 162,42"
        fill="#d4af37"
        stroke="#fff"
        strokeWidth="1.5"
        filter={`url(#${idPrefix}-neonGlow)`}
      />
    </svg>
  );
}

interface SpinWheelWidgetProps {
  compact?: boolean;
}

export function SpinWheelWidget({ compact = false }: SpinWheelWidgetProps) {
  const idPrefix = useRef(`wheel-${Math.random().toString(36).slice(2, 9)}`).current;
  const pathname = usePathname();
  const { status: authStatus } = useSession();
  const [wheelStatus, setWheelStatus] = useState<SpinWheelStatus | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<SpinResult | null>(null);
  const [error, setError] = useState("");
  const rotationRef = useRef(0);

  const loadStatus = useCallback(async () => {
    const res = await fetch("/api/spin-wheel");
    if (res.ok) setWheelStatus(await res.json());
  }, []);

  useEffect(() => {
    loadStatus();
  }, [loadStatus, authStatus]);

  useEffect(() => {
    if (!wheelStatus?.nextSpinAt) return;
    const timer = setInterval(loadStatus, 60000);
    return () => clearInterval(timer);
  }, [wheelStatus?.nextSpinAt, loadStatus]);

  const handleSpin = async () => {
    if (!wheelStatus?.canSpin || spinning) return;
    setError("");
    setResult(null);
    setSpinning(true);

    try {
      const res = await fetch("/api/spin-wheel/spin", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Çark çevrilemedi");

      const spinResult = data as SpinResult;
      const count = wheelStatus.segments.length;
      const slice = 360 / count;
      const extra = 6 + Math.floor(Math.random() * 3);
      const target =
        rotationRef.current +
        extra * 360 +
        (360 - spinResult.segmentIndex * slice - slice / 2);

      rotationRef.current = target;
      setRotation(target);

      setTimeout(() => {
        setSpinning(false);
        setResult(spinResult);
        if (spinResult.prizeType === "discount") fireConfetti();
        loadStatus();
      }, 5200);
    } catch (err) {
      setSpinning(false);
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    }
  };

  const segments = wheelStatus?.segments ?? [];
  const isLoggedIn = wheelStatus?.isLoggedIn ?? false;
  const canSpin = wheelStatus?.canSpin && !spinning;
  const inactive = wheelStatus ? !wheelStatus.isActive : false;

  return (
    <div className="relative">
      {!compact && (
        <div className="absolute -inset-4 bg-gradient-to-br from-blue-600/20 via-transparent to-amber-400/20 rounded-[2rem] blur-2xl pointer-events-none" />
      )}

      <div
        className={cn(
          "relative rounded-[2rem] border border-amber-400/30 bg-gradient-to-b from-[#0b1220] via-[#111827] to-[#0a0f1a] shadow-[0_0_60px_rgba(59,130,246,0.15)]",
          compact ? "p-4 sm:p-5" : "p-6 sm:p-10"
        )}
      >
        <div className={cn("text-center", compact ? "mb-4" : "mb-8")}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold uppercase tracking-widest mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            Şans Çarkı
          </span>
          <h2 className={cn("font-bold text-white mb-2", compact ? "text-xl sm:text-2xl" : "text-2xl sm:text-4xl")}>
            Çevir, <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-blue-400">Kazan!</span>
          </h2>
          <p className="text-sm text-white/60 max-w-md mx-auto">
            Üye olun, günde bir kez çarkı çevirin ve %5–%15 indirim kuponları kazanın.
          </p>
        </div>

        <div
          className={cn(
            "relative mx-auto aspect-square",
            compact ? "w-[min(100%,240px)] sm:w-[260px]" : "w-[min(100%,320px)] sm:w-[360px]"
          )}
        >
          <div
            className={cn(
              "absolute inset-0 rounded-full",
              spinning && "animate-pulse"
            )}
            style={{
              boxShadow: "0 0 0 6px rgba(212,175,55,0.25), 0 0 80px rgba(59,130,246,0.35), inset 0 0 40px rgba(0,0,0,0.5)",
            }}
          />
          <WheelSvg segments={segments} rotation={rotation} idPrefix={idPrefix} />
        </div>

        <div className={cn("flex flex-col items-center gap-4", compact ? "mt-4" : "mt-8")}>
          {!isLoggedIn && authStatus !== "loading" && (
            <div className="flex items-center gap-2 text-sm text-amber-200/90 bg-amber-400/10 border border-amber-400/20 px-4 py-3 rounded-xl">
              <Lock className="h-4 w-4 shrink-0" />
              Çarkı çevirmek için giriş yapmalısınız.
            </div>
          )}

          {inactive && (
            <p className="text-sm text-white/50">Şans çarkı şu anda kapalı.</p>
          )}

          {wheelStatus?.nextSpinAt && !wheelStatus.canSpin && isLoggedIn && (
            <div className="flex items-center gap-2 text-sm text-blue-200 bg-blue-500/10 border border-blue-400/20 px-4 py-3 rounded-xl">
              <Clock className="h-4 w-4" />
              Sonraki çevirme: {formatCountdown(wheelStatus.nextSpinAt)}
            </div>
          )}

          {error && (
            <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-xl">{error}</p>
          )}

          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={cn(
                  "text-center px-6 py-5 rounded-2xl border max-w-md",
                  result.prizeType === "discount"
                    ? "bg-emerald-500/10 border-emerald-400/30 text-emerald-100"
                    : "bg-white/5 border-white/15 text-white/80"
                )}
              >
                <Gift className={cn("h-8 w-8 mx-auto mb-2", result.prizeType === "discount" ? "text-emerald-400" : "text-white/50")} />
                <p className="font-bold text-lg">{result.prizeLabel}</p>
                <p className="text-sm mt-1 opacity-90">{result.message}</p>
                {result.couponCode && (
                  <p className="mt-3 font-mono text-amber-300 text-lg tracking-wider">{result.couponCode}</p>
                )}
                {result.couponCode && (
                  <Link href="/hesabim/kuponlar" className="inline-block mt-3 text-sm text-blue-300 hover:underline">
                    Kuponlarım →
                  </Link>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {!isLoggedIn ? (
            <Link
              href={`/giris?callbackUrl=${encodeURIComponent(pathname || "/")}`}
              className={cn(
                "inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 text-[#0f172a] font-bold uppercase tracking-wider hover:scale-105 transition-transform shadow-[0_0_30px_rgba(212,175,55,0.4)]",
                compact ? "px-6 py-3 text-xs" : "px-8 py-4 text-sm"
              )}
            >
              Giriş Yap & Çevir
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleSpin}
              disabled={!canSpin || inactive}
              className={cn(
                "inline-flex items-center justify-center gap-2 px-10 py-4 rounded-2xl font-bold text-sm uppercase tracking-wider transition-all",
                canSpin && !inactive
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:scale-105 shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:shadow-[0_0_40px_rgba(59,130,246,0.65)]"
                  : "bg-white/10 text-white/40 cursor-not-allowed"
              )}
            >
              {spinning ? "Çark Dönüyor…" : "ÇARKI ÇEVİR"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
