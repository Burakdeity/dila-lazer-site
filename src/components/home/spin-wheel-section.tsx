import { SpinWheelWidget } from "@/components/spin-wheel/spin-wheel-widget";

export function SpinWheelSection() {
  return (
    <section
      id="sans-carki"
      className="relative py-10 sm:py-14 overflow-hidden bg-[#060a12]"
      aria-label="Şans Çarkı"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[min(100%,900px)] h-[320px] bg-blue-600/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[280px] bg-amber-500/10 rounded-full blur-[80px]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <SpinWheelWidget />
      </div>
    </section>
  );
}
