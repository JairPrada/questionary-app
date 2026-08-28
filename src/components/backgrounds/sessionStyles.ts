export type SessionStyle =
  | { key: string; label: string; theme: "light" | "dark"; swatch: string; kind: "aceternity" }
  | { key: string; label: string; theme: "light" | "dark"; swatch: string; kind: "vanta"; effect: string };

export const SESSION_STYLES: SessionStyle[] = [
  { key: "aurora-light", label: "Aurora", theme: "light", swatch: "linear-gradient(135deg,#a5f3fc,#c7d2fe)", kind: "aceternity" },
  { key: "sparkles-light", label: "Destellos", theme: "light", swatch: "radial-gradient(circle at 30% 30%, #e0f2fe, #fef9c3)", kind: "aceternity" },
  { key: "wavy-light", label: "Olas", theme: "light", swatch: "linear-gradient(135deg,#bae6fd,#ddd6fe)", kind: "aceternity" },
  { key: "aurora-dark", label: "Aurora Nocturna", theme: "dark", swatch: "radial-gradient(circle at 40% 30%, #312e81, #020617)", kind: "aceternity" },
  { key: "sparkles-dark", label: "Estrellas", theme: "dark", swatch: "radial-gradient(circle at 50% 20%, #1e293b, #020617)", kind: "aceternity" },
  { key: "beams-dark", label: "Haces", theme: "dark", swatch: "radial-gradient(circle at 50% 50%, #4c1d95, #020617)", kind: "aceternity" },
  { key: "grid-light", label: "Cuadrícula", theme: "light", swatch: "linear-gradient(135deg,#e2e8f0,#ffffff)", kind: "aceternity" },
  { key: "grid-dark", label: "Cuadrícula Nocturna", theme: "dark", swatch: "radial-gradient(circle at 50% 50%, #0f172a, #020617)", kind: "aceternity" },
  { key: "reveal-light", label: "Red Luz", theme: "light", swatch: "radial-gradient(circle at 50% 30%, #e0f2fe, #f8fafc)", kind: "aceternity" },
  { key: "reveal-dark", label: "Red Cian", theme: "dark", swatch: "radial-gradient(circle at 50% 30%, #0f172a, #22d3ee)", kind: "aceternity" },
  { key: "vanta-fog", label: "Niebla", theme: "light", swatch: "linear-gradient(135deg,#bae6fd,#e0f2fe)", kind: "vanta", effect: "fog" },
  { key: "vanta-clouds", label: "Nubes", theme: "light", swatch: "linear-gradient(135deg,#eaf4ff,#fde68a)", kind: "vanta", effect: "clouds" },
  { key: "vanta-cells", label: "Celdas", theme: "light", swatch: "linear-gradient(135deg,#bae6fd,#c7d2fe)", kind: "vanta", effect: "cells" },
  { key: "vanta-birds", label: "Pájaros", theme: "dark", swatch: "radial-gradient(circle at 50% 30%, #0f172a, #22d3ee)", kind: "vanta", effect: "birds" },
  { key: "vanta-waves", label: "Olimpo", theme: "dark", swatch: "radial-gradient(circle at 50% 30%, #082f49, #22d3ee)", kind: "vanta", effect: "waves" },
  { key: "vanta-clouds2", label: "Nubes 2", theme: "dark", swatch: "radial-gradient(circle at 50% 30%, #1e1b4b, #22d3ee)", kind: "vanta", effect: "clouds2" },
  { key: "vanta-globe", label: "Globo", theme: "dark", swatch: "radial-gradient(circle at 50% 30%, #0f172a, #38bdf8)", kind: "vanta", effect: "globe" },
  { key: "vanta-net", label: "Red", theme: "dark", swatch: "radial-gradient(circle at 50% 30%, #020617, #22d3ee)", kind: "vanta", effect: "net" },
  { key: "vanta-trunk", label: "Tronco", theme: "dark", swatch: "radial-gradient(circle at 50% 30%, #020617, #38bdf8)", kind: "vanta", effect: "trunk" },
  { key: "vanta-topology", label: "Topología", theme: "dark", swatch: "radial-gradient(circle at 50% 30%, #020617, #38bdf8)", kind: "vanta", effect: "topology" },
  { key: "vanta-rings", label: "Anillos", theme: "dark", swatch: "radial-gradient(circle at 50% 30%, #020617, #22d3ee)", kind: "vanta", effect: "rings" },
  { key: "vanta-halo", label: "Halo", theme: "dark", swatch: "radial-gradient(circle at 50% 30%, #020617, #22d3ee)", kind: "vanta", effect: "halo" },
];
