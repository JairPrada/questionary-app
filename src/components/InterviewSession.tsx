import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatTime } from "@/lib/interview";
import {
  backgroundStyle,
  isAnimatedBackground,
  playAlarm,
  playTick,
  readingSizeClass,
  useSessionEnv,
} from "@/lib/sessionEnv";
import { animationClass, fontClass } from "@/lib/design";
import type { Design, SessionEnvironment } from "@/lib/types";
import {
  AnimatedBackground,
  type AnimatedVariant,
} from "@/components/ui/animated-background";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { SessionSettings } from "@/components/SessionSettings";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { Notch } from "@/components/ui/notch";
import { ArrowRight, LogOut, Pause, Play } from "lucide-react";

export function InterviewSession({
  questions,
  secondsPerQuestion,
  title,
  prepSec = 0,
  design,
  onExit,
  onComplete,
}: {
  questions: string[];
  secondsPerQuestion: number;
  title?: string;
  prepSec?: number;
  design?: Design;
  onExit: () => void;
  onComplete: (times: number[]) => void;
}) {
  const [hookEnv, setHookEnv] = useSessionEnv();
  const designEnv: SessionEnvironment | null = design
    ? {
        background: design.background,
        timerStyle: design.timerStyle,
        sound: design.sound,
        readingSize: design.readingSize,
      }
    : null;
  const env = designEnv ?? hookEnv;
  const fontCls = design ? fontClass(design.font) : "";
  const accent = design?.accent;
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"prep" | "response">("response");
  const [remaining, setRemaining] = useState(secondsPerQuestion);
  const [paused, setPaused] = useState(false);
  const [done, setDone] = useState(false);
  const timesRef = useRef<number[]>([]);

  const total = questions.length;
  const hasPrep = prepSec > 0;

  useEffect(() => {
    if (!started || done) return;
    if (hasPrep) {
      setPhase("prep");
      setRemaining(prepSec);
    } else {
      setPhase("response");
      setRemaining(secondsPerQuestion);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, started, done]);

  useEffect(() => {
    if (!started || paused || done || remaining <= 0) return;
    const id = window.setInterval(() => {
      setRemaining((r) => (r <= 1 ? 0 : r - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [started, paused, done, remaining]);

  const advance = (used: number) => {
    const recorded = [...timesRef.current, Math.max(0, Math.round(used))];
    timesRef.current = recorded;
    if (index + 1 >= total) {
      setDone(true);
      onComplete(recorded);
    } else {
      setIndex(index + 1);
    }
  };

  useEffect(() => {
    if (!started || paused || done || remaining !== 0) return;
    if (phase === "prep") {
      setPhase("response");
      setRemaining(secondsPerQuestion);
    } else {
      advance(secondsPerQuestion);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining, phase, started, paused, done]);

  useEffect(() => {
    if (!started || paused || done || phase !== "response") return;
    if (remaining <= 0) return;
    if (env.sound === "tick") playTick();
    if (env.sound === "alarm" && remaining <= 5) playAlarm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining]);

  useEffect(() => {
    if (!started || done) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " " || e.code === "Space") {
        e.preventDefault();
        setPaused((p) => !p);
      } else if (e.key === "Enter" || e.key === "ArrowRight") {
        e.preventDefault();
        if (phase === "prep") {
          setPhase("response");
          setRemaining(secondsPerQuestion);
        } else {
          advance(secondsPerQuestion - remaining);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, done, remaining, index, phase]);

  if (total === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-6 text-center">
        <p className="text-lg text-muted-foreground">No hay preguntas para mostrar.</p>
        <Button onClick={onExit}>Volver</Button>
      </div>
    );
  }

  const progress = Math.round(
    ((index + (phase === "response" ? (secondsPerQuestion - remaining) / secondsPerQuestion : 0)) /
      total) *
      100,
  );

  const animated = isAnimatedBackground(env.background);
  const low = started && remaining <= 10;
  const timerLabel = (
    <span
      className="tabular-nums font-semibold"
      style={{ color: low ? "#ef4444" : (accent ?? "#f1f5f9") }}
    >
      {phase === "prep" ? "Prep " : "Resp "}
      {formatTime(remaining)}
    </span>
  );

  return (
    <div
      className="relative isolate flex min-h-screen w-full flex-col"
      style={backgroundStyle(env.background)}
    >
      {env.background === "beams" ? (
        <BackgroundBeamsWithCollision />
      ) : env.background === "auroraGlow" ? (
        <AuroraBackground />
      ) : animated ? (
        <AnimatedBackground variant={env.background as AnimatedVariant} />
      ) : null}
      <div className="flex items-center justify-between px-4 py-4 sm:px-6">
        <div className="text-sm text-muted-foreground">
          {title ? <span className="font-medium">{title}</span> : null}
          <span className="ml-2">
            Pregunta {index + 1} de {total}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {env.timerStyle === "digital" && (
            <span className="hidden text-right md:block">
              <span className="block text-xs uppercase tracking-wide text-muted-foreground">
                {phase === "prep" ? "Preparación" : "Responde"}
              </span>
              <span
                className="text-2xl font-bold tabular-nums sm:text-3xl"
                style={{ color: accent ?? "hsl(var(--primary))" }}
              >
                {formatTime(remaining)}
              </span>
            </span>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onExit}
            aria-label="Salir"
          >
            <LogOut className="size-4" />
          </Button>
        </div>
      </div>

      {env.timerStyle === "bar" && (
        <div className="px-6">
          <Progress value={progress} />
        </div>
      )}

      {!started ? (
        <main className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
          <div className="flex max-w-xl flex-col items-center gap-6">
            <h1 className={`text-3xl font-semibold sm:text-4xl ${fontCls}`}>
              {title ?? "Simulación de entrevista"}
            </h1>
            <p className="text-muted-foreground">
              {total} preguntas
              {hasPrep ? ` · ${prepSec}s de preparación` : ""} ·{" "}
              {formatTime(secondsPerQuestion)} por pregunta.
              <br />
              Usa la barra espaciadora para pausar y la flecha derecha o Enter
              para avanzar.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {!design && <SessionSettings env={env} onChange={setHookEnv} />}
              <Button
                size="lg"
                onClick={() => setStarted(true)}
                style={
                  accent
                    ? { backgroundColor: accent, borderColor: accent, color: "#0B0F19" }
                    : undefined
                }
              >
                Comenzar
              </Button>
            </div>
          </div>
        </main>
      ) : (
        <main className="flex flex-1 items-center justify-center px-6 py-10">
          <div key={index} className={animationClass(design?.animation ?? "fade")}>
            <TextGenerateEffect
              words={questions[index]}
              className={`${readingSizeClass(
                env.readingSize,
              )} ${fontCls} max-w-3xl text-center font-semibold leading-snug text-slate-200`}
            />
          </div>
        </main>
      )}

      {started && env.timerStyle === "digital" && (
        <div className="px-6">
          <Progress value={progress} />
        </div>
      )}

      {started && (
        <footer className="flex items-center justify-center gap-3 px-6 py-6">
          <Button
            variant="outline"
            onClick={() => setPaused((p) => !p)}
            className="gap-2"
          >
            {paused ? <Play className="size-4" /> : <Pause className="size-4" />}
            {paused ? "Reanudar" : "Pausa"}
          </Button>
          <Button
            onClick={() =>
              phase === "prep"
                ? (setPhase("response"), setRemaining(secondsPerQuestion))
                : advance(secondsPerQuestion - remaining)
            }
            className="gap-2"
            style={
              accent
                ? { backgroundColor: accent, borderColor: accent, color: "#0B0F19" }
                : undefined
            }
          >
            Siguiente
            <ArrowRight className="size-4" />
          </Button>
        </footer>
      )}

      {started && (
        <Notch
          className="md:hidden"
          position="top"
          align="center"
          showSelectedValue={false}
          showDividers={false}
          accentColor={accent ?? "#22d3ee"}
          items={[{ id: "timer", label: timerLabel, options: [] }]}
        />
      )}
    </div>
  );
}