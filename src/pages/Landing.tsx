import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LandingNavbar } from "@/components/LandingNavbar";
import { CardCover } from "@/components/CardCover";
import { variantForCategory } from "@/lib/coverVariant";
import { ensureExamples, getExamplePresets, getQuestions } from "@/lib/db";
import { formatTime } from "@/lib/interview";
import type { UseCaseCategory } from "@/lib/types";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { ExpandableCard, type ExpandableCardData } from "@/components/ui/expandable-card";
import { FloatingDock } from "@/components/ui/floating-dock";
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Clock,
  Home,
  Layers,
  Languages,
  Library,
  ListChecks,
  Mic,
  PlayCircle,
  Presentation,
  Rocket,
  Sparkles,
  TrendingUp,
} from "lucide-react";

const CATEGORIES: { key: UseCaseCategory; label: string; icon: typeof Sparkles }[] = [
  { key: "idiomas", label: "Idiomas", icon: Languages },
  { key: "entrevistas", label: "Entrevistas", icon: Briefcase },
  { key: "negocios", label: "Negocios", icon: TrendingUp },
  { key: "ocio", label: "Ocio", icon: Sparkles },
];

const CATEGORY_EMOJI: Record<UseCaseCategory, string> = {
  idiomas: "🌐",
  entrevistas: "💼",
  negocios: "📈",
  ocio: "🎭",
};

type TopicItem = { label: string; desc: string; icon: typeof Languages };
const TOPICS: TopicItem[] = [
  { label: "Idiomas", desc: "Conversación y fluidez diaria.", icon: Languages },
  { label: "Entrevistas", desc: "Técnicas y de comportamiento.", icon: Briefcase },
  { label: "Negocios", desc: "Ventas, pitches y objeciones.", icon: TrendingUp },
  { label: "Ocio", desc: "Improvisación y creatividad.", icon: Sparkles },
  { label: "IELTS", desc: "Speaking y pronunciación.", icon: Mic },
  { label: "TOEFL", desc: "Speaking integrado.", icon: Presentation },
  { label: "Pitch", desc: "Presenta tu idea en 60s.", icon: Rocket },
  { label: "Storytelling", desc: "Continúa historias en vivo.", icon: BookOpen },
];

type BenefitItem = { title: string; desc: string; icon: typeof Sparkles };
const BENEFITS: BenefitItem[] = [
  { title: "Simulaciones ilimitadas", desc: "Lanza tantas prácticas como quieras, cuando quieras.", icon: PlayCircle },
  { title: "Bancos personalizados", desc: "Crea tus propios bancos de preguntas y reordénalos.", icon: Library },
  { title: "Historial y métricas", desc: "Revisa tu progreso, tiempos y respuestas.", icon: ListChecks },
  { title: "Entrevistas, IELTS y más", desc: "Plantillas listas para cada contexto.", icon: Sparkles },
  { title: "Modo invitado", desc: "Prueba al instante sin registrarte.", icon: Rocket },
  { title: "Temporizador real", desc: "Preparación y respuesta como en vivo.", icon: Clock },
];

const STEPS: ExpandableCardData[] = [
  {
    id: "step-1",
    title: "1 · Elige tu reto",
    description:
      "Selecciona una categoría, un banco de preguntas listo o crea el tuyo en segundos.",
    ctaText: "Ver ejemplos",
    ctaLink: "#ocasiones",
    content: () => (
      <div className="space-y-3 text-slate-200">
        <p className="text-slate-400">
          Empieza desde donde te sientas cómodo. Sin configuraciones eternas.
        </p>
        <ul className="space-y-2">
          <li className="flex gap-2">
            <Sparkles className="mt-0.5 size-4 text-cyan-400" />
            Bancos de ejemplo para idiomas, entrevistas, IELTS y más.
          </li>
          <li className="flex gap-2">
            <Sparkles className="mt-0.5 size-4 text-cyan-400" />
            Crea tus propias preguntas y defíneles un temporizador.
          </li>
          <li className="flex gap-2">
            <Sparkles className="mt-0.5 size-4 text-cyan-400" />
            Practica en modo invitado, sin registrarte.
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: "step-2",
    title: "2 · Practica con temporizador",
    description:
      "Cada pregunta aparece con tiempo de preparación y respuesta reales, como en vivo.",
    ctaText: "Probar ahora",
    ctaLink: "/demo",
    content: () => (
      <div className="space-y-3 text-slate-200">
        <p className="text-slate-400">
          Simula la presión de una conversación real para ganar soltura.
        </p>
        <ul className="space-y-2">
          <li className="flex gap-2">
            <Clock className="mt-0.5 size-4 text-cyan-400" />
            Tiempo de preparación y respuesta configurables.
          </li>
          <li className="flex gap-2">
            <Clock className="mt-0.5 size-4 text-cyan-400" />
            Texto de la pregunta revelado con animación.
          </li>
          <li className="flex gap-2">
            <Clock className="mt-0.5 size-4 text-cyan-400" />
            Temporizador siempre visible, incluso en móvil.
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: "step-3",
    title: "3 · Revisa y mejora",
    description:
      "Guarda tus sesiones, consulta tu historial y observa tu progreso con métricas.",
    ctaText: "Crear cuenta",
    ctaLink: "#beneficios",
    content: () => (
      <div className="space-y-3 text-slate-200">
        <p className="text-slate-400">
          La práctica consistente se vuelve progreso medible.
        </p>
        <ul className="space-y-2">
          <li className="flex gap-2">
            <ListChecks className="mt-0.5 size-4 text-cyan-400" />
            Historial de simulaciones por banco.
          </li>
          <li className="flex gap-2">
            <ListChecks className="mt-0.5 size-4 text-cyan-400" />
            Métricas de tiempo y constancia.
          </li>
          <li className="flex gap-2">
            <ListChecks className="mt-0.5 size-4 text-cyan-400" />
            Plantillas reutilizables para tus rutinas.
          </li>
        </ul>
      </div>
    ),
  },
];

export function Landing() {
  const navigate = useNavigate();
  const [authOpen, setAuthOpen] = useState(false);
  const [category, setCategory] = useState<UseCaseCategory>("idiomas");

  ensureExamples();
  const examples = getExamplePresets();
  const byCategory = useMemo(() => {
    const map = {} as Record<UseCaseCategory, (typeof examples)[number]>;
    for (const p of examples) {
      if (p.category) map[p.category] = p;
    }
    return map;
  }, [examples]);

  const preset = byCategory[category];
  const sample = preset ? getQuestions(preset.bank_id)[0]?.text ?? "" : "";

  const dockItems = [
    { title: "Inicio", icon: <Home className="size-5" />, href: "#inicio" },
    { title: "Practicar", icon: <PlayCircle className="size-5" />, href: "/demo" },
    { title: "Cómo funciona", icon: <Layers className="size-5" />, href: "#como" },
    { title: "Beneficios", icon: <Sparkles className="size-5" />, href: "#beneficios" },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <LandingNavbar authOpen={authOpen} setAuthOpen={setAuthOpen} />

       {/* HERO */}
       <section id="inicio" className="relative isolate flex min-h-[90vh] items-center overflow-hidden scroll-mt-24">
        <AuroraBackground />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-16 sm:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="space-y-6">
              <Badge variant="secondary" className="gap-1">
                <Sparkles className="size-3" />
                Tu práctica de expresión oral, en cualquier contexto
              </Badge>
              <TypewriterEffect
                words={[
                  { text: "Mejora" },
                  { text: "tu" },
                  { text: "forma" },
                  { text: "de" },
                  { text: "hablar," },
                  { text: "sin", className: "text-cyan-400" },
                  { text: "importar", className: "text-cyan-400" },
                  { text: "el", className: "text-cyan-400" },
                  { text: "tema.", className: "text-cyan-400" },
                ]}
                className="text-left text-4xl font-semibold tracking-tight sm:text-5xl"
              />
              <p className="max-w-md text-lg text-muted-foreground">
                Elige tu reto, responde con un temporizador real y mide tu
                progreso. Desde una entrevista de trabajo hasta practicar un
                idioma o improvisar por diversión.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  size="lg"
                  className="gap-2"
                  onClick={() => navigate(preset ? `/interview/${preset.id}` : "/demo")}
                >
                  Hacer prueba rápida
                  <ArrowRight className="size-4" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => setAuthOpen(true)}>
                  Crear cuenta
                </Button>
              </div>
              <ul className="flex flex-wrap gap-6 pt-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Clock className="size-4 text-primary" />
                  Temporizador por pregunta
                </li>
                <li className="flex items-center gap-2">
                  <ListChecks className="size-4 text-primary" />
                  Bancos de preguntas
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => {
                  const Icon = c.icon;
                  const active = c.key === category;
                  return (
                    <Button
                      key={c.key}
                      size="sm"
                      variant={active ? "default" : "outline"}
                      className="gap-2"
                      onClick={() => setCategory(c.key)}
                    >
                      <Icon className="size-4" />
                      {c.label}
                    </Button>
                  );
                })}
              </div>

              <Card className="group/card overflow-hidden shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-500/10">
                <CardCover
                  variant={variantForCategory(category)}
                  emoji={CATEGORY_EMOJI[category]}
                  label={CATEGORIES.find((c) => c.key === category)?.label ?? ""}
                  className="transition-transform duration-500 group-hover/card:scale-105"
                />
                <CardHeader>
                  <CardTitle className="truncate text-base">
                    {preset?.name ?? "Ejemplo"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div className="h-full w-2/5 rounded-full bg-primary" />
                  </div>
                  <p className="min-h-[3.5rem] text-2xl font-semibold leading-snug">
                    {sample || "Crea tu propio banco de preguntas."}
                  </p>
                  <div className="text-sm text-muted-foreground">
                    {preset?.prep_sec
                      ? `${preset.prep_sec}s de preparación + ${formatTime(
                          preset.time_per_question_sec,
                        )} de respuesta`
                      : `${formatTime(preset?.time_per_question_sec ?? 30)} por pregunta`}
                    {preset ? ` · ${preset.questions_count} preguntas` : ""}
                  </div>
                </CardContent>
                <CardFooter className="relative border-t-0 bg-transparent before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-border/70 before:to-transparent">
                  <Button
                    className="w-full gap-2"
                    onClick={() => navigate(preset ? `/interview/${preset.id}` : "/demo")}
                  >
                    Probar gratis
                    <ArrowRight className="size-4" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </main>
      </section>

      {/* CÓMO FUNCIONA */}
      <section id="como" className="relative overflow-hidden border-t border-slate-800/60 scroll-mt-24">
        <BackgroundBeamsWithCollision className="absolute inset-0 -z-10 opacity-60" />
        <div className="mx-auto w-full max-w-6xl px-4 py-20">
          <div className="mb-10 text-center">
            <Badge variant="secondary" className="mb-3 gap-1">
              <Layers className="size-3" />
              Así de simple
            </Badge>
            <h2 className="text-2xl font-semibold text-slate-100 sm:text-3xl">
              Tres pasos para ganar soltura
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
              Sin curvas de aprendizaje. Abre, elige y habla.
            </p>
          </div>
          <ExpandableCard cards={STEPS} className="mx-auto max-w-3xl" />
        </div>
      </section>

      {/* PARA CADA OCASIÓN */}
      <section id="ocasiones" className="relative overflow-hidden border-t border-slate-800/60 scroll-mt-24">
        <AnimatedBackground variant="aurora" className="opacity-50" />
        <div className="mx-auto w-full max-w-6xl px-4 py-20">
          <div className="mb-10 text-center">
            <Badge variant="secondary" className="mb-3 gap-1">
              <Sparkles className="size-3" />
              Versátil
            </Badge>
            <h2 className="text-2xl font-semibold text-slate-100 sm:text-3xl">
              Para cada ocasión
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
              El mismo motor, infinitos contextos. Elige uno y empieza.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORIES.map((c) => {
              const Icon = c.icon;
              const p = byCategory[c.key];
              return (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => navigate(p ? `/interview/${p.id}` : "/demo")}
                  className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10"
                >
                  <div className="mb-4 inline-flex size-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/20 transition-colors group-hover:bg-cyan-500/20">
                    <Icon className="size-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-100">
                    {c.label}
                  </h3>
                  <p className="mt-1 text-sm text-slate-400">
                    {p ? `${p.questions_count} preguntas listas` : "Banco de ejemplo"}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-cyan-400">
                    Practicar
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* PRACTICA LO QUE NECESITES */}
      <section id="practica" className="scroll-mt-24 border-t border-slate-800/60 py-20">
        <div className="mx-auto w-full max-w-6xl px-4">
          <div className="mb-10 text-center">
            <Badge className="mb-3 border-cyan-500/30 bg-cyan-500/10 text-cyan-300">
              Una sola plataforma
            </Badge>
            <h2 className="text-2xl font-bold text-slate-100 sm:text-3xl">
              Practica lo que necesites
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-400">
              Idiomas, entrevistas, exámenes o diversión: elige el reto y
              empieza a hablar en segundos.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TOPICS.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.label}
                  type="button"
                  onClick={() => navigate("/demo")}
                  className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 p-5 text-left transition-all hover:-translate-y-1 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10"
                >
                  <div className="mb-3 inline-flex size-11 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/20">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-100">
                    {t.label}
                  </h3>
                  <p className="mt-1 text-sm text-slate-400">{t.desc}</p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* BENEFICIOS / REGWALL */}
      <section
        id="beneficios"
        className="mx-auto w-full max-w-6xl border-t border-slate-800/60 px-4 py-20 scroll-mt-24"
      >
        <div className="mb-10 text-center">
          <Badge className="mb-3 border-cyan-500/30 bg-cyan-500/10 text-cyan-300">
            Gratis para siempre
          </Badge>
          <h2 className="text-2xl font-bold text-slate-100 sm:text-3xl">
            Crea tu cuenta y desbloquea todo
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-400">
            Guarda plantillas, bancos de preguntas e historial. Sin costo.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.title}
                className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6"
              >
                <div className="mb-4 inline-flex size-11 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/20">
                  <Icon className="size-5" />
                </div>
                <h3 className="text-lg font-semibold text-slate-100">
                  {b.title}
                </h3>
                <p className="mt-1 text-sm text-slate-400">{b.desc}</p>
              </div>
            );
          })}
        </div>
        <div className="mt-8 flex justify-center">
          <Button size="lg" onClick={() => setAuthOpen(true)}>
            Crear cuenta gratis
          </Button>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="relative overflow-hidden border-t border-slate-800/60 py-20">
        <AnimatedBackground variant="ocean" className="opacity-40" />
        <div className="mx-auto w-full max-w-3xl px-4 text-center">
          <TextGenerateEffect
            words="Empieza a hablar con confianza hoy."
            className="text-2xl font-bold text-slate-100 sm:text-3xl"
          />
          <div className="mt-6 flex justify-center">
            <Button size="lg" className="gap-2" onClick={() => navigate("/demo")}>
              <PlayCircle className="size-5" />
              Practicar gratis
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-800/60 py-6 text-center text-sm text-muted-foreground">
        Questionary · Practica. Mide. Mejora.
      </footer>

      <FloatingDock
        items={dockItems}
        desktopClassName="fixed bottom-6 right-6"
        mobileClassName="fixed bottom-6 right-6"
      />
    </div>
  );
}
