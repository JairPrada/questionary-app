import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import type {
  EnvironmentKey,
  ReadingSize,
  SessionEnvironment,
  SoundOption,
  TimerStyle,
} from "./types";

const STORAGE_KEY = "questionary-env-v1";

export const DEFAULT_ENV: SessionEnvironment = {
  timerStyle: "digital",
  sound: "none",
  readingSize: "md",
  background: "light",
};

export const TIMER_STYLES: { value: TimerStyle; label: string }[] = [
  { value: "digital", label: "Reloj digital (alta presión)" },
  { value: "bar", label: "Barra de progreso (baja presión)" },
];

export const SOUNDS: { value: SoundOption; label: string }[] = [
  { value: "none", label: "Silencio total" },
  { value: "tick", label: "Tic-tac de reloj" },
  { value: "alarm", label: "Alarma a 5 segundos" },
];

export const READING_SIZES: { value: ReadingSize; label: string }[] = [
  { value: "sm", label: "Pequeña" },
  { value: "md", label: "Mediana" },
  { value: "lg", label: "Grande" },
];

export const BACKGROUNDS: { value: EnvironmentKey; label: string }[] = [
  { value: "light", label: "Claro anti-fatiga" },
  { value: "dark", label: "Oscuro" },
  { value: "aurora", label: "Aurora (verde)" },
  { value: "sunset", label: "Atardecer" },
  { value: "ocean", label: "Océano" },
  { value: "lavender", label: "Lavanda" },
  { value: "beams", label: "Rayos con colisión" },
  { value: "auroraGlow", label: "Aurora (fondo)" },
];

const ANIMATED: EnvironmentKey[] = [
  "aurora",
  "sunset",
  "ocean",
  "lavender",
  "beams",
  "auroraGlow",
];

export function isAnimatedBackground(bg: EnvironmentKey): boolean {
  return ANIMATED.includes(bg);
}

export function backgroundStyle(bg: EnvironmentKey): CSSProperties {
  if (bg === "dark") return { backgroundColor: "#0B0F19", color: "#e2e8f0" };
  if (isAnimatedBackground(bg)) return { backgroundColor: "#0B0F19", color: "#e2e8f0" };
  return { backgroundColor: "#f8fafc", color: "#0f172a" };
}

export function readingSizeClass(size: ReadingSize): string {
  switch (size) {
    case "sm":
      return "text-xl sm:text-2xl";
    case "lg":
      return "text-3xl sm:text-4xl md:text-5xl";
    default:
      return "text-2xl sm:text-3xl md:text-4xl";
  }
}

export function useSessionEnv(): readonly [SessionEnvironment, (e: SessionEnvironment) => void] {
  const [env, setEnv] = useState<SessionEnvironment>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? { ...DEFAULT_ENV, ...JSON.parse(raw) } : DEFAULT_ENV;
    } catch {
      return DEFAULT_ENV;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(env));
    } catch {
      /* noop */
    }
  }, [env]);
  return [env, setEnv] as const;
}

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AC) return null;
    audioCtx = new AC();
  }
  return audioCtx;
}

export function playTick(): void {
  const c = getCtx();
  if (!c) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = "square";
  o.frequency.value = 880;
  g.gain.value = 0.04;
  o.connect(g);
  g.connect(c.destination);
  o.start();
  o.stop(c.currentTime + 0.04);
}

export function playAlarm(): void {
  const c = getCtx();
  if (!c) return;
  [0, 0.16].forEach((t) => {
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = "sine";
    o.frequency.value = 660;
    g.gain.value = 0.12;
    o.connect(g);
    g.connect(c.destination);
    o.start(c.currentTime + t);
    o.stop(c.currentTime + t + 0.12);
  });
}
