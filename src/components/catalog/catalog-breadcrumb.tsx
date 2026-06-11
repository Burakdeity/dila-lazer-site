import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface CatalogBreadcrumbProps {
  items: BreadcrumbItem[];
}

export function CatalogBreadcrumb({ items }: CatalogBreadcrumbProps) {
  return (
    <nav className="flex items-center flex-wrap gap-1.5 text-sm text-gray-500 mb-6">
      <Link href="/" className="hover:text-brand-red transition-colors flex items-center gap-1">
        <Home className="h-3.5 w-3.5" />
        <span className="sr-only">Ana Sayfa</span>
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <ChevronRight className="h-3.5 w-3.5 text-gray-300 shrink-0" />
          {item.href ? (
            <Link href={item.href} className="hover:text-brand-red transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-brand-black font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
