import type {
  AnimationKey,
  Design,
  FontKey,
} from "./types";

export const DEFAULT_DESIGNS: Design[] = [
  {
    id: "design-aurora",
    name: "Aurora",
    isBuiltIn: true,
    background: "auroraGlow",
    timerStyle: "digital",
    sound: "none",
    readingSize: "md",
    accent: "#22d3ee",
    font: "sans",
    animation: "fade",
  },
  {
    id: "design-ocean",
    name: "Océano",
    isBuiltIn: true,
    background: "ocean",
    timerStyle: "digital",
    sound: "tick",
    readingSize: "md",
    accent: "#38bdf8",
    font: "sans",
    animation: "slide",
  },
  {
    id: "design-neon",
    name: "Neón",
    isBuiltIn: true,
    background: "beams",
    timerStyle: "bar",
    sound: "none",
    readingSize: "md",
    accent: "#e879f9",
    font: "mono",
    animation: "scale",
  },
  {
    id: "design-lavender",
    name: "Lavanda",
    isBuiltIn: true,
    background: "lavender",
    timerStyle: "digital",
    sound: "none",
    readingSize: "lg",
    accent: "#a78bfa",
    font: "serif",
    animation: "fade",
  },
  {
    id: "design-minimal",
    name: "Minimal",
    isBuiltIn: true,
    background: "dark",
    timerStyle: "bar",
    sound: "none",
    readingSize: "md",
    accent: "#e2e8f0",
    font: "sans",
    animation: "none",
  },
];

export function fontClass(font: FontKey): string {
  switch (font) {
    case "serif":
      return "font-serif";
    case "mono":
      return "font-mono";
    default:
      return "font-sans";
  }
}

export function animationClass(anim: AnimationKey): string {
  switch (anim) {
    case "slide":
      return "animate-in fade-in slide-in-from-bottom-8 duration-500";
    case "scale":
      return "animate-in fade-in zoom-in-95 duration-500";
    case "none":
      return "";
    default:
      return "animate-in fade-in duration-500";
  }
}

export function hexToRgba(hex: string, alpha: number): string {
  const m = hex.replace("#", "");
  const full =
    m.length === 3
      ? m
          .split("")
          .map((c) => c + c)
          .join("")
      : m;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  if ([r, g, b].some((n) => Number.isNaN(n))) return `rgba(34,211,238,${alpha})`;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function resolveDesign(designs: Design[], id: string): Design {
  return (
    designs.find((d) => d.id === id) ??
    DEFAULT_DESIGNS.find((d) => d.id === id) ??
    DEFAULT_DESIGNS[0]
  );
}
