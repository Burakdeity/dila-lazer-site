import Link from "next/link";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
}

export function SectionHeader({
  title,
  subtitle,
  viewAllHref,
  viewAllLabel = "Tümünü Gör",
}: SectionHeaderProps) {
  return (
    <div className="flex items-end justify-between gap-4 mb-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-brand-black tracking-tight">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500 mt-1.5 max-w-xl">{subtitle}</p>}
      </div>
      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="shrink-0 text-sm font-medium text-brand-red hover:text-brand-red/80 transition-colors flex items-center gap-1"
        >
          {viewAllLabel}
          <span aria-hidden>→</span>
        </Link>
      )}
    </div>
  );
}
