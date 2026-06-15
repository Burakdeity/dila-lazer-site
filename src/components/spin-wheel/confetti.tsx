"use client";

const COLORS = ["#d4af37", "#3b82f6", "#ff0040", "#ffffff", "#fbbf24", "#60a5fa"];

export function fireConfetti(durationMs = 2800) {
  if (typeof document === "undefined") return;

  const canvas = document.createElement("canvas");
  canvas.style.cssText =
    "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:99999";
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    canvas.remove();
    return;
  }

  const particles = Array.from({ length: 120 }, () => ({
    x: window.innerWidth / 2,
    y: window.innerHeight * 0.35,
    vx: (Math.random() - 0.5) * 14,
    vy: Math.random() * -12 - 4,
    size: Math.random() * 8 + 4,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    rot: Math.random() * 360,
    vr: (Math.random() - 0.5) * 12,
    gravity: 0.28 + Math.random() * 0.12,
  }));

  const start = performance.now();

  const frame = (now: number) => {
    const elapsed = now - start;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rot += p.vr;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rot * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();
    }

    if (elapsed < durationMs) {
      requestAnimationFrame(frame);
    } else {
      canvas.remove();
    }
  };

  requestAnimationFrame(frame);
}
