const words = [
  "NEON LED",
  "ÖZEL TASARIM",
  "3D ÜRÜNLER",
  "LAZER KESİM",
  "PLEKSİ",
  "MDF DEKOR",
  "81 İLE TESLİMAT",
  "2 YIL GARANTİ",
];

function TickerSegment({ index }: { index: number }) {
  return (
    <div className="neon-ticker-segment flex shrink-0 items-center" aria-hidden={index > 0 ? true : undefined}>
      {words.map((word) => (
        <span
          key={`${index}-${word}`}
          className="neon-ticker-item shrink-0 text-xs sm:text-sm font-bold tracking-[0.25em] uppercase whitespace-nowrap"
        >
          {word}
          <span className="neon-ticker-dot mx-6 sm:mx-10 text-brand-red">◆</span>
        </span>
      ))}
    </div>
  );
}

export function NeonTicker() {
  return (
    <div className="neon-ticker-wrap border-y border-brand-red/20 bg-brand-black overflow-hidden">
      <div className="neon-ticker-track flex w-max">
        {[0, 1, 2, 3].map((index) => (
          <TickerSegment key={index} index={index} />
        ))}
      </div>
    </div>
  );
}
