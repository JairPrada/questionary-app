import { useEffect, useRef } from "react";

const WAVY_LIGHT = ["#38bdf8", "#818cf8", "#c084fc"];

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/* ---------------- Aurora Background (CSS) ---------------- */
function AuroraBackground({
  variant,
  className,
}: {
  variant: "light" | "dark";
  className?: string;
}) {
  return (
    <div className={`aurora-bg aurora-${variant} ${className ?? ""}`}>
      <span className="aurora-blob aurora-blob-1" />
      <span className="aurora-blob aurora-blob-2" />
      <span className="aurora-blob aurora-blob-3" />
    </div>
  );
}

/* ---------------- Sparkles (canvas) ---------------- */
function Sparkles({
  className,
  particleColor = "#ffffff",
  background = "transparent",
  density = 90,
}: {
  className?: string;
  particleColor?: string;
  background?: string;
  density?: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;
    let w = 0;
    let h = 0;
    type P = {
      x: number;
      y: number;
      r: number;
      base: number;
      tw: number;
      sp: number;
      vx: number;
      vy: number;
    };
    let parts: P[] = [];

    const init = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.floor(((w * h) / 14000) * (density / 90));
      const n = Math.max(30, Math.min(170, count));
      parts = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.6 + 0.4,
        base: Math.random() * 0.5 + 0.3,
        tw: Math.random() * Math.PI * 2,
        sp: Math.random() * 0.02 + 0.005,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        p.tw += p.sp;
        const a = p.base + Math.sin(p.tw) * 0.35;
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.globalAlpha = Math.max(0, Math.min(1, a));
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };

    init();
    if (prefersReducedMotion()) {
      draw();
      cancelAnimationFrame(raf);
    } else {
      draw();
    }

    const onResize = () => init();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [particleColor, density, background]);

  return (
    <canvas
      ref={ref}
      className={className}
      style={{ display: "block", width: "100%", height: "100%", background }}
    />
  );
}

/* ---------------- Wavy Background (canvas) ---------------- */
function WavyBackground({
  className,
  colors,
  backgroundFill,
  speed = 1,
  blur = 8,
  opacity = 0.5,
}: {
  className?: string;
  colors: string[];
  backgroundFill: string;
  speed?: number;
  blur?: number;
  opacity?: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;
    let w = 0;
    let h = 0;
    let t = 0;

    const init = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = backgroundFill;
      ctx.fillRect(0, 0, w, h);
      const layers = colors.length;
      for (let i = 0; i < layers; i++) {
        const amp = h * 0.05 + i * 6;
        const yBase = h * 0.42 + i * (h * 0.05);
        ctx.beginPath();
        ctx.moveTo(0, h);
        for (let x = 0; x <= w; x += 8) {
          const y = yBase + Math.sin(x * 0.012 + t + i * 1.3) * amp;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(w, h);
        ctx.closePath();
        ctx.globalAlpha = opacity;
        ctx.fillStyle = colors[i];
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      t += 0.015 * speed;
      raf = requestAnimationFrame(draw);
    };

    init();
    if (prefersReducedMotion()) {
      draw();
      cancelAnimationFrame(raf);
    } else {
      draw();
    }

    const onResize = () => init();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [colors, backgroundFill, speed, opacity]);

  return (
    <canvas
      ref={ref}
      className={className}
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        filter: blur ? `blur(${blur}px)` : undefined,
      }}
    />
  );
}

/* ---------------- Background Beams With Collision (CSS) ---------------- */
function BeamsWithCollision({ className }: { className?: string }) {
  const angles = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <div className={`beams-bg ${className ?? ""}`}>
      <div className="beams-rotor">
        {angles.map((a) => (
          <span
            key={a}
            className="beam"
            style={{ transform: `rotate(${a}deg)` }}
          />
        ))}
      </div>
      <span className="beams-core" />
    </div>
  );
}

/* ---------------- Canvas Reveal (red de puntos animada, canvas 2D) ---------------- */
function CanvasRevealBackground({
  variant,
  className,
}: {
  variant: "light" | "dark";
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const rgb = variant === "dark" ? "34,211,238" : "56,189,248";

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;
    let w = 0;
    let h = 0;
    type P = { x: number; y: number; vx: number; vy: number };
    let dots: P[] = [];

    const init = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.max(24, Math.min(150, Math.floor((w * h) / 13000)));
      dots = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const d of dots) {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0 || d.x > w) d.vx *= -1;
        if (d.y < 0 || d.y > h) d.vy *= -1;
        ctx.beginPath();
        ctx.arc(d.x, d.y, 1.7, 0, Math.PI * 2);
        ctx.fillStyle = `rgb(${rgb})`;
        ctx.fill();
      }
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < 120) {
            ctx.globalAlpha = (1 - dist / 120) * 0.5;
            ctx.strokeStyle = `rgb(${rgb})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };

    init();
    if (prefersReducedMotion()) {
      draw();
      cancelAnimationFrame(raf);
    } else {
      draw();
    }

    const ro = new ResizeObserver(init);
    ro.observe(canvas);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [rgb]);

  return (
    <canvas
      ref={ref}
      className={className}
      style={{ display: "block", width: "100%", height: "100%" }}
    />
  );
}

/* ---------------- Grid Background (CSS) ---------------- */
function GridBackground({
  variant,
  className,
}: {
  variant: "light" | "dark";
  className?: string;
}) {
  const line = variant === "dark" ? "#334155" : "#cbd5e1";
  const mask = variant === "dark" ? "#020617" : "#f8fafc";
  return (
    <div className={className}>
      <div
        className="absolute inset-0 [background-size:42px_42px]"
        style={{
          backgroundImage: `linear-gradient(to right, ${line} 1px, transparent 1px), linear-gradient(to bottom, ${line} 1px, transparent 1px)`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: mask,
          WebkitMaskImage:
            "radial-gradient(ellipse at center, transparent 68%, black)",
          maskImage: "radial-gradient(ellipse at center, transparent 68%, black)",
        }}
      />
    </div>
  );
}

/* ---------------- Session selector ---------------- */
export function SessionBackground({
  styleKey,
  className,
}: {
  styleKey: string;
  className?: string;
}) {
  switch (styleKey) {
    case "aurora-light":
      return <AuroraBackground variant="light" className={className} />;
    case "aurora-dark":
      return <AuroraBackground variant="dark" className={className} />;
    case "sparkles-light":
      return (
        <Sparkles
          className={className}
          particleColor="#0ea5e9"
          background="#f0f9ff"
        />
      );
    case "sparkles-dark":
      return (
        <Sparkles
          className={className}
          particleColor="#e0f2fe"
          background="#020617"
        />
      );
    case "wavy-light":
      return (
        <WavyBackground
          className={className}
          colors={WAVY_LIGHT}
          backgroundFill="#f0f9ff"
        />
      );
    case "reveal-light":
      return <CanvasRevealBackground variant="light" className={className} />;
    case "reveal-dark":
      return <CanvasRevealBackground variant="dark" className={className} />;
    case "grid-light":
      return <GridBackground variant="light" className={className} />;
    case "grid-dark":
      return <GridBackground variant="dark" className={className} />;
    case "beams-dark":
      return <BeamsWithCollision className={className} />;
    default:
      return <AuroraBackground variant="light" className={className} />;
  }
}
