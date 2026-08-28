import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, Pause, Palette, Play, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { getBank, getExamplePresets, getQuestions } from "@/lib/db";
import type { Question } from "@/lib/types";
import { SessionBackground } from "@/components/backgrounds/SessionBackground";
import { VantaBackground } from "@/components/backgrounds/VantaBackground";
import { SESSION_STYLES } from "@/components/backgrounds/sessionStyles";
import { TypewriterText } from "@/components/TypewriterText";

const FALLBACK = [
  "¿Cuál ha sido tu mayor logro profesional?",
  "Describe un momento en el que resolviste un conflicto en equipo.",
  "¿Cómo manejas la presión y los plazos ajustados?",
  "¿Dónde te ves profesionalmente en cinco años?",
];

const VOCAB_FALLBACK: Question[] = [
  { id: "vb-1", bank_id: "vb", text: "House", order_index: 0, answer: "Casa" },
  { id: "vb-2", bank_id: "vb", text: "Dog", order_index: 1, answer: "Perro" },
  { id: "vb-3", bank_id: "vb", text: "Book", order_index: 2, answer: "Libro" },
  { id: "vb-4", bank_id: "vb", text: "Friend", order_index: 3, answer: "Amigo" },
  { id: "vb-5", bank_id: "vb", text: "Water", order_index: 4, answer: "Agua" },
  { id: "vb-6", bank_id: "vb", text: "City", order_index: 5, answer: "Ciudad" },
  { id: "vb-7", bank_id: "vb", text: "Teacher", order_index: 6, answer: "Profesor" },
  { id: "vb-8", bank_id: "vb", text: "Happy", order_index: 7, answer: "Feliz" },
];

type VocabOrder = "random" | "sequential";

function buildVocab(
  base: Question[],
  order: VocabOrder,
  invert: boolean,
): Question[] {
  let arr = base.filter((q) => q.text.trim() !== "");
  if (order === "random") arr = [...arr].sort(() => Math.random() - 0.5);
  if (invert) arr = [...arr].reverse();
  return arr.map((q) => {
    const flip = !!q.answer && Math.random() < 0.5;
    return {
      ...q,
      text: flip ? (q.answer as string) : q.text,
      answer: flip ? q.text : (q.answer ?? q.text),
    };
  });
}

export function Live() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tipo = searchParams.get("tipo");
  const bankId = searchParams.get("bank");

  const presets = useMemo(() => getExamplePresets(), []);
  const vocabPreset = useMemo(
    () => presets.find((p) => p.kind === "vocabulario"),
    [presets],
  );
  const qaPreset = useMemo(
    () => presets.find((p) => p.category === "entrevistas") ?? presets[0],
    [presets],
  );

  const customBank = useMemo(
    () => (bankId ? getBank(bankId) : undefined),
    [bankId],
  );

  const isVocab =
    tipo === "vocabulario" || customBank?.kind === "vocabulario";
  const preset = isVocab ? (vocabPreset ?? qaPreset) : qaPreset;

  const [randomOrder, setRandomOrder] = useState(true);
  const [repeatWrong, setRepeatWrong] = useState(false);
  const [pending, setPending] = useState<number[]>([]);
  const [reviewMode, setReviewMode] = useState(false);
  const [curtainVisible, setCurtainVisible] = useState(false);
  const [curtainDown, setCurtainDown] = useState(false);

  const questions: Question[] = useMemo(() => {
    const shuffleArr = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);
    if (customBank) {
      const base = getQuestions(customBank.id).filter(
        (q) => q.text.trim() !== "",
      );
      if (!isVocab) return randomOrder ? shuffleArr(base) : base;
      return buildVocab(base, randomOrder ? "random" : "sequential", false);
    }
    if (isVocab) {
      const fromBank = vocabPreset ? getQuestions(vocabPreset.bank_id) : [];
      const base = fromBank.length
        ? fromBank.filter((q) => q.text.trim() !== "")
        : VOCAB_FALLBACK;
      return buildVocab(base, randomOrder ? "random" : "sequential", false);
    }
    const base = (preset ? getQuestions(preset.bank_id) : []).filter(
      (q) => q.text.trim() !== "",
    );
    return randomOrder ? shuffleArr(base) : base;
  }, [isVocab, vocabPreset, preset, customBank, randomOrder]);

  const [setup, setSetup] = useState(true);
  const [chosenStyle, setChosenStyle] = useState<string>("aurora-light");
  const [bgTab, setBgTab] = useState<"light" | "dark">("light");
  const pickTab = (tab: "light" | "dark") => {
    setBgTab(tab);
    if ((SESSION_STYLES.find((s) => s.key === chosenStyle)?.theme ?? "light") !== tab) {
      const first = SESSION_STYLES.find((s) => s.theme === tab);
      if (first) setChosenStyle(first.key);
    }
  };

  const [hoverKey, setHoverKey] = useState<string | null>(null);
  const [setupStep, setSetupStep] = useState<1 | 2>(1);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const movePanel = (x: number, y: number) => {
    const el = panelRef.current;
    if (!el) return;
    const W = el.offsetWidth || 390;
    const H = el.offsetHeight || 300;
    const vw = typeof window !== "undefined" ? window.innerWidth : 1200;
    const vh = typeof window !== "undefined" ? window.innerHeight : 800;
    let left = x + 18;
    let top = y + 18;
    if (left + W > vw - 8) left = x - W - 18;
    if (top + H > vh - 8) top = Math.max(8, vh - H - 8);
    left = Math.max(8, left);
    top = Math.max(8, top);
    el.style.left = `${left}px`;
    el.style.top = `${top}px`;
  };
  useEffect(() => {
    if (hoverKey && panelRef.current) {
      movePanel(
        typeof window !== "undefined" ? window.innerWidth / 2 : 0,
        typeof window !== "undefined" ? window.innerHeight / 2 : 0
      );
    }
  }, [hoverKey]);
  const openPreview = (key: string) => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setHoverKey(key);
  };
  const scheduleClose = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setHoverKey(null), 180);
  };

  const [qaSeconds, setQaSeconds] = useState(60);
  const [revealSeconds, setRevealSeconds] = useState(10);

  const total = Math.max(questions.length, 1);
  const time = isVocab ? revealSeconds : qaSeconds;

  const [index, setIndex] = useState(0);
  const [seconds, setSeconds] = useState(time);
  const [isPaused, setIsPaused] = useState(false);
  const [finished, setFinished] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [ratings, setRatings] = useState<Record<number, boolean>>({});
  const [elapsed, setElapsed] = useState(0);
  const [key, setKey] = useState(0);

  useEffect(() => {
    setRevealed(false);
  }, [index]);

  useEffect(() => {
    if (finished || isPaused) return;
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds, isPaused, finished]);

  useEffect(() => {
    if (seconds > 0) return;
    if (isVocab) {
      if (!revealed) setRevealed(true);
      return;
    }
    if (index >= total - 1) setFinished(true);
    else {
      setIndex((i) => i + 1);
      setSeconds(time);
    }
  }, [seconds, isVocab, revealed, index, total, time]);

  useEffect(() => {
    if (finished || isPaused || !isVocab) return;
    const t = setTimeout(() => setElapsed((e) => e + 1), 1000);
    return () => clearTimeout(t);
  }, [elapsed, finished, isPaused, isVocab]);

  const current = questions[index];
  const totalSeconds = time;
  const remainingRatio = totalSeconds > 0 ? seconds / totalSeconds : 0;
  const progress = isVocab ? (index + 1) / total : remainingRatio;

  const barColor = isVocab
    ? "hsl(var(--primary))"
    : remainingRatio > 0.5
      ? "hsl(var(--primary))"
      : remainingRatio > 0.2
        ? "#f59e0b"
        : "#ef4444";

  const next = () => {
    if (reviewMode) {
      if (pending.length > 0) {
        setIndex(pending[0]);
        setPending((q) => q.slice(1));
        setSeconds(time);
        return;
      }
      setFinished(true);
      return;
    }
    if (index >= total - 1) {
      if (pending.length > 0) {
        setReviewMode(true);
        setIndex(pending[0]);
        setPending((q) => q.slice(1));
        setSeconds(time);
        return;
      }
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
    setSeconds(time);
  };

  const prev = () => {
    if (index <= 0) return;
    setIndex((i) => i - 1);
    setSeconds(time);
  };

  const restart = () => {
    setIndex(0);
    setSeconds(time);
    setFinished(false);
    setRevealed(false);
    setRatings({});
    setElapsed(0);
    setPending([]);
    setReviewMode(false);
    setKey((k) => k + 1);
  };

  const activeStyle = SESSION_STYLES.find((s) => s.key === chosenStyle);
  const themeClass = activeStyle?.theme === "dark" ? "theme-dark" : "theme-light";

  const backgroundEl =
    activeStyle?.kind === "vanta" ? (
      <VantaBackground
        effect={activeStyle.effect}
        theme={activeStyle.theme}
        className="absolute inset-0 overflow-hidden"
      />
    ) : (
      <SessionBackground styleKey={activeStyle?.key ?? chosenStyle} className="absolute inset-0 overflow-hidden" />
    );

  const startSession = () => {
    setIndex(0);
    setRatings({});
    setElapsed(0);
    setRevealed(false);
    setFinished(false);
    setPending([]);
    setReviewMode(false);
    setSeconds(isVocab ? revealSeconds : qaSeconds);
    setSetup(false);
  };

  const startSessionRef = useRef(startSession);
  startSessionRef.current = startSession;

  const rate = (value: boolean) => {
    setRatings((prev) => ({ ...prev, [index]: value }));
    if (repeatWrong && isVocab && !value) {
      setPending((p) => [...p, index]);
    }
    next();
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const beginCountdown = () => {
    setHoverKey(null);
    setCurtainVisible(true);
    setCurtainDown(false);
  };

  useEffect(() => {
    if (!curtainVisible) return;
    const r = requestAnimationFrame(() => setCurtainDown(true));
    const t = setTimeout(() => {
      setCurtainDown(false);
      startSessionRef.current();
    }, 800);
    const t2 = setTimeout(() => setCurtainVisible(false), 1400);
    return () => {
      cancelAnimationFrame(r);
      clearTimeout(t);
      clearTimeout(t2);
    };
  }, [curtainVisible]);

  let screen: ReactNode;
  if (setup) {
    const timingOptions = isVocab ? [5, 8, 10, 15] : [30, 45, 60, 90];
    const selectedTime = isVocab ? revealSeconds : qaSeconds;
    screen = (
      <div className="landing-light relative min-h-screen w-screen overflow-hidden bg-background">
        <div className="live-bg absolute inset-0" />
        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-8 p-6">
          <div className="w-full max-w-xl">
            <div className="mb-1.5 flex justify-between text-xs font-medium">
              <span className={setupStep >= 1 ? "text-primary" : "text-muted-foreground"}>
                1 · Estilo
              </span>
              <span className={setupStep >= 2 ? "text-primary" : "text-muted-foreground"}>
                2 · Ritmo
              </span>
            </div>
            <div className="h-2 w-full bg-border">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: setupStep === 1 ? "50%" : "100%" }}
              />
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
              Antes de empezar
            </h1>
              <p className="mt-2 text-muted-foreground">
                {isVocab ? "Vocabulario" : "Preguntas"} ·{" "}
                {setupStep === 1
                  ? "Paso 1 de 2: elige el estilo visual"
                  : "Paso 2 de 2: ajusta el ritmo"}
              </p>
          </div>

          <div className="w-full max-w-xl space-y-6">
            {setupStep === 1 && (
              <section className="animate-in slide-in-from-left-4 fade-in duration-300">
                <p className="mb-3 text-sm font-medium text-foreground">
                  Estilo visual
                </p>
                <div className="mb-4 inline-flex rounded-lg border border-border p-1">
                  <button
                    type="button"
                    onClick={() => pickTab("light")}
                    className={`cursor-pointer rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                      bgTab === "light"
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:text-primary"
                    }`}
                  >
                    Claros
                  </button>
                  <button
                    type="button"
                    onClick={() => pickTab("dark")}
                    className={`cursor-pointer rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                      bgTab === "dark"
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:text-primary"
                    }`}
                  >
                    Oscuros
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {SESSION_STYLES.filter((s) => s.theme === bgTab).map((s) => {
                    const active = chosenStyle === s.key;
                    return (
                      <button
                        key={s.key}
                        type="button"
                        onClick={() => {
                          setChosenStyle(s.key);
                          openPreview(s.key);
                        }}
                        onDoubleClick={() => {
                          setHoverKey(null);
                          setSetupStep(2);
                        }}
                        onMouseEnter={() => openPreview(s.key)}
                        onMouseMove={(e) => movePanel(e.clientX, e.clientY)}
                        onMouseLeave={scheduleClose}
                        className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border p-3 transition-all ${
                          active
                            ? "border-primary ring-2 ring-primary/40"
                            : "border-border hover:border-primary/40"
                        }`}
                      >
                        <span className="relative h-12 w-full overflow-hidden rounded-lg">
                          <span
                            className={`absolute inset-0 bg-background ${
                              s.theme === "dark" ? "theme-dark" : "theme-light"
                            }`}
                          />
                          {s.kind === "vanta" ? (
                            <VantaBackground
                              effect={s.effect}
                              theme={s.theme}
                              className="absolute inset-0"
                            />
                          ) : (
                            <SessionBackground styleKey={s.key} className="absolute inset-0" />
                          )}
                        </span>
                        <span className="text-sm text-foreground">{s.label}</span>
                      </button>
                    );
                  })}
                </div>
              </section>
            )}

            {setupStep === 2 && (
              <section className="animate-in slide-in-from-left-4 fade-in duration-300 space-y-6">
                <div>
                  <p className="mb-1 text-sm font-medium text-foreground">
                    {isVocab ? "Tiempo antes de revelar" : "Tiempo por pregunta"}
                  </p>
                  <p className="mb-3 text-xs text-muted-foreground">
                    {isVocab
                      ? "Cuántos segundos ves el término antes de revelar la traducción."
                      : "Cuánto dura cada pregunta antes de avanzar a la siguiente."}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {timingOptions.map((opt) => {
                      const active = selectedTime === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() =>
                            isVocab
                              ? setRevealSeconds(opt)
                              : setQaSeconds(opt)
                          }
                          className={`cursor-pointer rounded-full border px-4 py-2 text-sm transition-colors ${
                            active
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border text-foreground hover:border-primary/40"
                          }`}
                        >
                          {opt}s
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        Orden aleatorio
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Mezcla el orden de {isVocab ? "las tarjetas" : "las preguntas"}.
                      </p>
                    </div>
                    <Switch
                      checked={randomOrder}
                      onCheckedChange={(v) => setRandomOrder(!!v)}
                    />
                  </div>
                  {isVocab && (
                    <div className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          Repetir hasta acertar
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Vuelve a las que marques como “No lo sabía”.
                        </p>
                      </div>
                      <Switch
                        checked={repeatWrong}
                        onCheckedChange={(v) => setRepeatWrong(!!v)}
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4 rounded-xl border border-border p-3">
                  <span className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg">
                    <span
                      className={`absolute inset-0 bg-background ${
                        activeStyle?.theme === "dark" ? "theme-dark" : "theme-light"
                      }`}
                    />
                    {activeStyle?.kind === "vanta" ? (
                      <VantaBackground
                        effect={activeStyle.effect}
                        theme={activeStyle.theme}
                        className="absolute inset-0"
                      />
                    ) : (
                      <SessionBackground
                        styleKey={activeStyle?.key ?? chosenStyle}
                        className="absolute inset-0"
                      />
                    )}
                  </span>
                  <div className="min-w-0 text-sm">
                    <p className="font-medium text-foreground">
                      {isVocab ? "Vocabulario" : "Preguntas"} · {activeStyle?.label}
                    </p>
                    <p className="text-muted-foreground">
                      {selectedTime}s
                      {randomOrder ? " · orden aleatorio" : " · orden fijo"}
                      {repeatWrong && isVocab ? " · repite hasta acertar" : ""}
                    </p>
                  </div>
                </div>
              </section>
            )}
          </div>

          {setupStep === 1 ? (
            <Button
              onClick={() => {
                setHoverKey(null);
                setSetupStep(2);
              }}
              className="gap-2 px-8 py-6 text-lg"
            >
              Continuar
              <ArrowRight className="size-5" />
            </Button>
          ) : (
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                variant="secondary"
                onClick={() => {
                  setHoverKey(null);
                  setSetupStep(1);
                }}
                className="gap-2 px-8 py-6 text-lg"
              >
                <ArrowLeft className="size-5" /> Atrás
              </Button>
              <Button
                onClick={beginCountdown}
                className="gap-2 px-8 py-6 text-lg"
              >
                Empezar
                <ArrowRight className="size-5" />
              </Button>
            </div>
          )}
        </div>

        {hoverKey &&
          (() => {
            const hs = SESSION_STYLES.find((s) => s.key === hoverKey);
            if (!hs) return null;
            const previewTheme = hs.theme === "dark" ? "theme-dark" : "theme-light";
            return (
              <div
                key={hs.key}
                ref={panelRef}
                className="fixed z-50 w-[390px] max-w-[94vw] overflow-hidden rounded-2xl border border-border bg-background shadow-2xl"
                onMouseEnter={() => {
                  if (hoverTimer.current) clearTimeout(hoverTimer.current);
                }}
                onMouseMove={(e) => movePanel(e.clientX, e.clientY)}
                onMouseLeave={scheduleClose}
              >
                <div className={`relative h-[250px] w-full bg-background ${previewTheme}`}>
                  {hs.kind === "vanta" ? (
                    <VantaBackground
                      effect={hs.effect}
                      theme={hs.theme}
                      className="absolute inset-0"
                    />
                  ) : (
                    <SessionBackground styleKey={hs.key} className="absolute inset-0" />
                  )}

                  <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="size-7" aria-label="Volver">
                        <ArrowLeft className="size-4" />
                      </Button>
                      <span className="text-[11px] font-medium text-muted-foreground">
                        {isVocab ? `Tarjeta 1 / ${total}` : `Pregunta 1 / ${total}`}
                      </span>
                    </div>
                    <span className="tabular-nums text-sm font-semibold text-foreground">
                      {isVocab ? formatTime(elapsed) : formatTime(seconds)}
                    </span>
                  </div>

                  {!isVocab && (
                    <>
                      <button
                        type="button"
                        aria-label="Anterior"
                        className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/90 p-2 text-slate-900 shadow ring-1 ring-slate-200"
                      >
                        <ArrowLeft className="size-4" />
                      </button>
                      <button
                        type="button"
                        aria-label="Siguiente"
                        className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-primary p-2 text-primary-foreground shadow ring-1 ring-primary/30"
                      >
                        <ArrowRight className="size-4" />
                      </button>
                    </>
                  )}

                  <div className="absolute inset-0 flex flex-col items-center justify-center px-12 pb-9 pt-12 text-center">
                    {isVocab ? (
                      <div className="flex flex-col items-center gap-1.5">
                        <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                          Término
                        </p>
                        <TypewriterText
                          text={current?.text ?? FALLBACK[0]}
                          className="text-2xl font-bold text-foreground"
                        />
                        <p className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground">
                          Traducción
                        </p>
                        <TypewriterText
                          text={current?.answer ?? ""}
                          className="text-xl font-semibold text-primary"
                        />
                        <div className="mt-2 flex flex-wrap justify-center gap-2">
                          <Button
                            type="button"
                            variant="secondary"
                            className="border-slate-300 bg-white px-2 py-1 text-[11px] text-slate-900 hover:bg-slate-100"
                          >
                            No lo sabía
                          </Button>
                          <Button
                            type="button"
                            className="bg-primary px-2 py-1 text-[11px] text-primary-foreground hover:bg-primary/90"
                          >
                            Sí lo sabía
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <TypewriterText
                        text={current?.text ?? FALLBACK[0]}
                        className="text-xl font-semibold leading-snug text-foreground"
                      />
                    )}
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-3">
                    <Progress value={progress * 100} color={barColor} className="h-1.5 w-full" />
                  </div>
                </div>

                <div className="flex items-center justify-between bg-background px-4 py-2 text-xs text-muted-foreground">
                  <span>{hs.label} · vista previa de la presentación</span>
                  <button
                    type="button"
                    onClick={() => setHoverKey(null)}
                    aria-label="Cerrar"
                    className="rounded p-1 text-foreground hover:bg-muted"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              </div>
            );
          })()}
      </div>
    );
  }

  else if (finished) {
    screen = (
      <div
        className={`landing-light ${themeClass} relative min-h-screen w-screen overflow-hidden bg-background`}
      >
        {backgroundEl}
        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-6 p-6 text-center">
          <CheckCircle2 className="size-16 text-primary" />
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
            {isVocab ? "¡Repaso completado!" : "¡Finalizaron las preguntas!"}
          </h1>
          {isVocab ? (
            <>
              <p className="max-w-md text-muted-foreground">
                Acertaste {Object.values(ratings).filter(Boolean).length} de {total}.
              </p>
              {questions.some((_, i) => ratings[i] === false) && (
                <div className="max-w-md text-center">
                  <p className="text-sm font-medium text-foreground">Repasa:</p>
                  <ul className="mt-1 flex flex-wrap justify-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                    {questions
                      .filter((_, i) => ratings[i] === false)
                      .map((q) => (
                        <li key={q.id}>
                          {q.text} — {q.answer}
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <p className="max-w-md text-muted-foreground">
              Lo lograste. Practicar en voz alta es la mejor forma de ganar confianza.
            </p>
          )}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              onClick={restart}
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <RotateCcw className="size-4" /> Practicar de nuevo
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate("/")}
              className="gap-2"
            >
              <ArrowLeft className="size-4" /> Volver al inicio
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setSetupStep(1);
                setSetup(true);
              }}
              className="gap-2"
            >
              <Palette className="size-4" /> Cambiar estilo
            </Button>
          </div>
        </div>
      </div>
    );
  }

  else {
    screen = (
      <div
        className={`landing-light ${themeClass} relative min-h-screen w-screen overflow-hidden bg-background`}
        key={key}
      >
      {backgroundEl}
      <div className="relative z-10 flex h-screen w-screen flex-col">
        <div className="flex items-center justify-between p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              aria-label="Volver"
            >
              <ArrowLeft className="size-5" />
            </Button>
            <span className="text-sm font-medium text-muted-foreground">
              {isVocab
                ? `Tarjeta ${index + 1} / ${total}`
                : `Pregunta ${index + 1} / ${total}`}
              {reviewMode ? " · Repasando" : ""}
            </span>
          </div>
          {isVocab ? (
            <div className="flex items-center gap-2">
              <span className="tabular-nums text-lg font-semibold text-foreground">
                {formatTime(elapsed)}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsPaused((p) => !p)}
                aria-label={isPaused ? "Reanudar" : "Pausar"}
              >
                {isPaused ? <Play className="size-5" /> : <Pause className="size-5" />}
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="tabular-nums text-lg font-semibold text-foreground">
                {formatTime(seconds)}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsPaused((p) => !p)}
                aria-label={isPaused ? "Reanudar" : "Pausar"}
              >
                {isPaused ? <Play className="size-5" /> : <Pause className="size-5" />}
              </Button>
            </div>
          )}
        </div>

        <div className="pointer-events-none flex flex-1 items-center justify-center px-6">
          <div className="pointer-events-auto w-full max-w-3xl text-center">
            {isVocab ? (
              <div className="flex flex-col items-center gap-6">
                <div
                  className="flex cursor-pointer flex-col items-center gap-4"
                  onClick={() => {
                    if (!revealed) setRevealed(true);
                  }}
                >
                  <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                    Término
                  </p>
                  <TypewriterText
                    text={current?.text ?? ""}
                    className="text-4xl font-bold text-foreground sm:text-6xl"
                  />
                  {!revealed && (
                    <div className="flex flex-col items-center gap-1">
                      <span className="tabular-nums text-2xl font-semibold text-foreground">
                        {formatTime(seconds)}
                      </span>
                      <p className="text-xs text-muted-foreground">
                        Toca para revelar
                      </p>
                    </div>
                  )}
                </div>
                {revealed && (
                  <div className="flex flex-col items-center gap-6">
                    <div className="animate-in flex flex-col items-center gap-1 fade-in">
                      <p className="text-sm uppercase tracking-wide text-muted-foreground">
                        Traducción
                      </p>
                       <TypewriterText
                         text={current?.answer ?? ""}
                         className="text-3xl font-semibold text-primary sm:text-4xl"
                       />
                    </div>
                    <div className="flex flex-col items-center gap-3">
                      <p className="text-sm font-medium text-muted-foreground">
                        ¿Lo sabías?
                      </p>
                      <div className="flex flex-wrap justify-center gap-3">
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => rate(false)}
                          className="border-slate-300 bg-white text-slate-900 hover:bg-slate-100"
                        >
                          No lo sabía
                        </Button>
                        <Button
                          type="button"
                          onClick={() => rate(true)}
                          className="bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                          Sí lo sabía
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <TypewriterText
                text={current?.text ?? FALLBACK[index % FALLBACK.length]}
                className="text-3xl font-semibold leading-snug text-foreground sm:text-5xl"
              />
            )}
          </div>
        </div>

        {!isVocab && (
          <button
            type="button"
            onClick={prev}
            disabled={index === 0}
            aria-label="Anterior"
            className="absolute left-3 top-1/2 z-20 -translate-y-1/2 cursor-pointer rounded-full bg-white/90 p-3 text-slate-900 shadow-md ring-1 ring-slate-200 backdrop-blur transition-transform duration-150 active:translate-y-1 hover:bg-white disabled:opacity-30 sm:left-6"
          >
            <ArrowLeft className="size-6" />
          </button>
        )}
        {!isVocab && (
          <button
            type="button"
            onClick={next}
            aria-label="Siguiente"
            className="absolute right-3 top-1/2 z-20 -translate-y-1/2 cursor-pointer rounded-full bg-primary p-3 text-primary-foreground shadow-md ring-1 ring-primary/30 backdrop-blur transition-transform duration-150 active:translate-y-1 hover:bg-primary/90 sm:right-6"
          >
            <ArrowRight className="size-6" />
          </button>
        )}

        <div className="p-4 sm:p-6">
          <Progress
            value={progress * 100}
            color={barColor}
            className="h-2 w-full"
          />
        </div>
      </div>
      </div>
  );
  }

  return (
    <>
      {screen}
      {curtainVisible &&
        createPortal(
          <div
            className={`fixed inset-0 z-50 bg-[#0b1220] transition-transform duration-500 ease-in-out ${
              curtainDown ? "translate-y-0" : "-translate-y-full"
            }`}
          />,
          document.body,
        )}
    </>
  );
}
