import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark";

interface VantaBackgroundProps {
  effect: string;
  theme: Theme;
  className?: string;
}

/**
 * Fondos animados 3D de Vanta.js (https://www.vantajs.com).
 * Se cargan de forma diferida (three.js / p5.js solo cuando se elige un
 * estilo Vanta) para no inflar el bundle inicial.
 * trunk y topology usan p5.js; el resto usan three.js (r134).
 */
export function VantaBackground({ effect, theme, className }: VantaBackgroundProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    let instance: { destroy: () => void; renderer?: { forceContextLoss?: () => void; dispose?: () => void } } | null = null;

    const loader = LOADERS[effect];
    if (!loader || !ref.current) return;

    void (async () => {
      const THREE = await import("three");
      const mod = await loader();
      if (cancelled || !ref.current) return;

      const base = VANTA_OPTIONS[effect]?.[theme] ?? {};
      const initOpts: Record<string, unknown> = {
        el: ref.current,
        THREE: THREE as never,
        ...base,
      };

      if (P5_EFFECTS.has(effect)) {
        const p5mod = await import("p5");
        initOpts.p5 = (p5mod as unknown as { default: unknown }).default;
      }

      instance = mod.default(initOpts) as {
        destroy: () => void;
        renderer?: { forceContextLoss?: () => void; dispose?: () => void };
      };
    })();

    return () => {
      cancelled = true;
      if (instance) {
        try {
          instance.renderer?.forceContextLoss?.();
          instance.renderer?.dispose?.();
        } catch {
          /* noop */
        }
        try {
          instance.destroy();
        } catch {
          /* noop */
        }
      }
    };
  }, [effect, theme]);

  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      <div ref={ref} className="absolute inset-0" />
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0",
          theme === "dark" ? "bg-black/40" : "bg-white/50",
        )}
      />
    </div>
  );
}

const P5_EFFECTS = new Set(["trunk", "topology"]);

const LOADERS: Record<string, () => Promise<{ default: (opts: Record<string, unknown>) => { destroy: () => void } }>> = {
  birds: () => import("vanta/dist/vanta.birds.min"),
  cells: () => import("vanta/dist/vanta.cells.min"),
  clouds: () => import("vanta/dist/vanta.clouds.min"),
  clouds2: () => import("vanta/dist/vanta.clouds2.min"),
  dots: () => import("vanta/dist/vanta.dots.min"),
  fog: () => import("vanta/dist/vanta.fog.min"),
  globe: () => import("vanta/dist/vanta.globe.min"),
  halo: () => import("vanta/dist/vanta.halo.min"),
  net: () => import("vanta/dist/vanta.net.min"),
  rings: () => import("vanta/dist/vanta.rings.min"),
  topology: () => import("vanta/dist/vanta.topology.min"),
  trunk: () => import("vanta/dist/vanta.trunk.min"),
  waves: () => import("vanta/dist/vanta.waves.min"),
};

/** Colores por efecto y tema. El backgroundColor define el contraste del texto. */
const VANTA_OPTIONS: Record<string, { light: Record<string, unknown>; dark: Record<string, unknown> }> = {
  birds: {
    light: { backgroundColor: 0xf0f9ff, color: 0x38bdf8 },
    dark: { backgroundColor: 0x020617, color: 0x22d3ee },
  },
  fog: {
    light: { backgroundColor: 0xf8fafc, color: 0xbae6fd },
    dark: { backgroundColor: 0x020617, color: 0x38bdf8 },
  },
  waves: {
    light: { backgroundColor: 0xe0f2fe, color: 0x38bdf8 },
    dark: { backgroundColor: 0x020617, color: 0x22d3ee },
  },
  clouds: {
    light: { backgroundColor: 0xeaf4ff, cloudShadowColor: 0xcbd5e1, sunColor: 0xfde68a, sunGlareColor: 0xfff7ed },
    dark: { backgroundColor: 0x0b1220, cloudShadowColor: 0x334155, sunColor: 0x38bdf8, sunGlareColor: 0x818cf8 },
  },
  clouds2: {
    light: { backgroundColor: 0xf8fafc, color1: 0xbae6fd, color2: 0xc7d2fe, color3: 0xa5f3fc },
    dark: { backgroundColor: 0x020617, color1: 0x22d3ee, color2: 0x818cf8, color3: 0xc084fc },
  },
  globe: {
    light: { backgroundColor: 0xeaf4ff, color: 0x38bdf8 },
    dark: { backgroundColor: 0x020617, color: 0x22d3ee },
  },
  net: {
    light: { backgroundColor: 0xf8fafc, color: 0x38bdf8 },
    dark: { backgroundColor: 0x020617, color: 0x22d3ee },
  },
  cells: {
    light: { backgroundColor: 0xf8fafc, color1: 0xbae6fd, color2: 0xc7d2fe },
    dark: { backgroundColor: 0x020617, color1: 0x22d3ee, color2: 0x818cf8 },
  },
  trunk: {
    light: { backgroundColor: 0xf8fafc, color: 0x38bdf8 },
    dark: { backgroundColor: 0x020617, color: 0x22d3ee },
  },
  topology: {
    light: { backgroundColor: 0xf8fafc, color: 0x38bdf8 },
    dark: { backgroundColor: 0x020617, color: 0x22d3ee },
  },
  dots: {
    light: { backgroundColor: 0xf8fafc, color: 0x38bdf8, color2: 0x818cf8, size: 4, spacing: 30, showLines: true },
    dark: { backgroundColor: 0x020617, color: 0x22d3ee, color2: 0x818cf8, size: 4, spacing: 30, showLines: true },
  },
  rings: {
    light: { backgroundColor: 0xf8fafc, color: 0x38bdf8 },
    dark: { backgroundColor: 0x020617, color: 0x22d3ee },
  },
  halo: {
    light: { backgroundColor: 0xf8fafc, baseColor: 0xbae6fd, color: 0x38bdf8 },
    dark: { backgroundColor: 0x020617, baseColor: 0x0e7490, color: 0x22d3ee },
  },
};
