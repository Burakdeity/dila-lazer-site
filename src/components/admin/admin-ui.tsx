import Link from "next/link";
import { cn } from "@/lib/utils";

export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        {description && <p className="text-sm text-gray-400 mt-1">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function AdminCard({
  children,
  className,
  title,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
}) {
  return (
    <div className={cn("rounded-2xl bg-white/5 border border-white/10", className)}>
      {title && (
        <div className="px-6 py-4 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
        </div>
      )}
      {children}
    </div>
  );
}

export function AdminStatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string | number;
  sub?: string;
  accent?: "red" | "green" | "amber" | "blue";
}) {
  const colors = {
    red: "text-brand-red",
    green: "text-green-400",
    amber: "text-amber-400",
    blue: "text-blue-400",
  };
  return (
    <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
      <p className={cn("text-2xl font-bold", accent ? colors[accent] : "text-white")}>{value}</p>
      <p className="text-sm text-gray-400 mt-1">{label}</p>
      {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
    </div>
  );
}

export function AdminBadge({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
}) {
  const styles = {
    default: "bg-white/10 text-gray-300",
    success: "bg-green-500/20 text-green-400",
    warning: "bg-amber-500/20 text-amber-400",
    danger: "bg-red-500/20 text-red-400",
    info: "bg-brand-red/20 text-brand-red",
  };
  return (
    <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", styles[variant])}>
      {children}
    </span>
  );
}

export function AdminEmpty({
  icon: Icon,
  title,
  description,
  actionHref,
  actionLabel,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 rounded-2xl bg-white/5 border border-white/10">
      <Icon className="h-12 w-12 text-gray-600 mb-4" />
      <p className="text-gray-300 font-medium">{title}</p>
      {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
      {actionHref && actionLabel && (
        <Link href={actionHref} className="text-brand-red hover:underline text-sm font-medium mt-4">
          {actionLabel} →
        </Link>
      )}
    </div>
  );
}

export function AdminTable({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">{children}</table>
    </div>
  );
}

export function AdminTh({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={cn("px-4 py-3 font-medium text-gray-400 text-left", className)}>{children}</th>
  );
}

export function AdminTd({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={cn("px-4 py-3", className)}>{children}</td>;
}

export function AdminTr({ children }: { children: React.ReactNode }) {
  return <tr className="border-b border-white/5 hover:bg-white/[0.02]">{children}</tr>;
}

export const adminInputClass =
  "w-full px-4 py-2.5 rounded-xl bg-black/30 border border-white/10 text-white text-sm focus:border-brand-red focus:outline-none";

export const adminSelectClass =
  "w-full px-4 py-2.5 rounded-xl bg-black/30 border border-white/10 text-white text-sm focus:border-brand-red focus:outline-none";

export const adminLabelClass = "block text-sm text-gray-400 mb-1.5";
