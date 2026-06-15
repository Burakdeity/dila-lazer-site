"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, label: "Sepet", href: "/sepet" },
  { id: 2, label: "Ödeme", href: "/odeme" },
  { id: 3, label: "Onay", href: null },
] as const;

type CheckoutStepsProps = {
  current: 1 | 2 | 3;
};

export function CheckoutSteps({ current }: CheckoutStepsProps) {
  return (
    <nav aria-label="Sipariş adımları" className="mb-8">
      <ol className="flex items-center justify-center gap-2 sm:gap-4">
        {STEPS.map((step, index) => {
          const done = step.id < current;
          const active = step.id === current;
          const content = (
            <>
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold border-2 transition-colors",
                  done && "bg-emerald-500 border-emerald-500 text-white",
                  active && !done && "bg-brand-red border-brand-red text-white",
                  !done && !active && "bg-white border-gray-200 text-gray-400"
                )}
              >
                {done ? <Check className="h-4 w-4" /> : step.id}
              </span>
              <span
                className={cn(
                  "text-xs sm:text-sm font-medium hidden sm:inline",
                  active ? "text-brand-black" : done ? "text-emerald-600" : "text-gray-400"
                )}
              >
                {step.label}
              </span>
            </>
          );

          return (
            <li key={step.id} className="flex items-center gap-2 sm:gap-4">
              {step.href && !active ? (
                <Link href={step.href} className="flex items-center gap-2 hover:opacity-80">
                  {content}
                </Link>
              ) : (
                <div className="flex items-center gap-2">{content}</div>
              )}
              {index < STEPS.length - 1 && (
                <div
                  className={cn(
                    "w-8 sm:w-16 h-0.5 rounded",
                    step.id < current ? "bg-emerald-400" : "bg-gray-200"
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
