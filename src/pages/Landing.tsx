import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StyleGallery } from "@/components/StyleGallery";
import { SessionBackground } from "@/components/backgrounds/SessionBackground";
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Languages,
  ListPlus,
  Mic,
  Palette,
  Presentation,
  Timer,
} from "lucide-react";

type IconType = typeof BookOpen;

const NAV = [
  { label: "Para qué sirve", href: "#usos" },
  { label: "Cómo funciona", href: "#como-funciona" },
  { label: "Estilos", href: "#estilos" },
];

const USOS: {
  key: string;
  label: string;
  desc: string;
  icon: IconType;
}[] = [
  {
    key: "entrevistas",
    label: "Entrevistas",
    desc: "Responde preguntas de selección, técnicas o de comportamiento, una a una.",
    icon: Briefcase,
  },
  {
    key: "ingles",
    label: "Inglés",
    desc: "Carga preguntas y responde en inglés para ganar fluidez al hablar.",
    icon: Languages,
  },
  {
    key: "exposiciones",
    label: "Exposiciones",
    desc: "Repasa los puntos clave y responde en voz alta antes de presentar.",
    icon: Presentation,
  },
  {
    key: "vocabulario",
    label: "Vocabulario",
    desc: "Como Anki: aparece una palabra y eliges su traducción, español ↔ inglés.",
    icon: BookOpen,
  },
];

const STEPS: { title: string; desc: string; icon: IconType }[] = [
  {
    title: "Carga tus preguntas",
    desc: "Crea tu banco de preguntas o usa uno de ejemplo en segundos.",
    icon: ListPlus,
  },
  {
    title: "Te las muestra una a una",
    desc: "Cada cierto tiempo aparece la siguiente pregunta, con el tiempo a la vista.",
    icon: Timer,
  },
  {
    title: "Responde y sigue",
    desc: "Hablas en voz alta a tu ritmo. Sin grabar, sin que nadie te evalúe.",
    icon: Mic,
  },
];

function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`mx-auto w-full max-w-5xl scroll-mt-20 px-4 py-14 sm:px-6 sm:py-16 ${className}`}
    >
      {children}
    </section>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <Badge variant="secondary" className="mb-4 gap-1.5 px-3 py-1 text-sm">
      {children}
    </Badge>
  );
}

function SectionHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mx-auto mb-8 max-w-2xl text-center">
      <h2 className="font-heading text-3xl font-semibold tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-base text-muted-foreground">{subtitle}</p>
      )}
    </div>
  );
}

export function Landing() {
  const navigate = useNavigate();
  const [uso, setUso] = useState("entrevistas");

  const activeUso = USOS.find((u) => u.key === uso) ?? USOS[0];

  return (
    <div className="landing-light min-h-screen bg-background text-foreground">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4 sm:px-6">
          <a
            href="#inicio"
            className="flex items-center gap-2 font-heading text-lg font-semibold"
          >
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Mic className="size-4" />
            </span>
            Questionary
          </a>
          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <Button
            size="lg"
            className="h-10 gap-2 px-5"
            onClick={() => navigate("/live")}
          >
            Practicar en vivo
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </header>

      {/* HERO */}
      <section id="inicio" className="relative w-full overflow-hidden pt-14 pb-14 sm:pt-16 sm:pb-16">
        <SessionBackground styleKey="aurora-light" className="absolute inset-0" />
        <div className="absolute inset-0 bg-background/55" />
        <div className="relative z-10 mx-auto max-w-2xl px-4 text-center">
          <Eyebrow>
            <Mic className="size-3.5" />
            Practica respondiendo, no grabando
          </Eyebrow>
          <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
            Tus preguntas, una a una, a tu ritmo.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
            Questionary es una herramienta para prepararte: pones tus preguntas
            y la app te las va mostrando una por una, cada cierto tiempo, para
            que respondas. Sin validaciones de micrófono ni distracciones: solo
            tú practicando.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button
              size="lg"
              className="h-11 gap-2 px-6 text-base"
              onClick={() => navigate("/live")}
            >
              Practicar en vivo
              <ArrowRight className="size-4" />
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="h-11 gap-2 px-6 text-base"
              onClick={() => navigate("/live?tipo=vocabulario")}
            >
              <Languages className="size-4" />
              Probar Vocabulario
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="h-11 gap-2 border-slate-300 bg-white px-6 text-base text-slate-900 hover:bg-slate-100"
              onClick={() => navigate("/crear")}
            >
              <ListPlus className="size-4" />
              Crear el tuyo
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            No graba audio ni corrige tu voz. Practicas tú.
          </p>
        </div>
      </section>

      {/* PARA QUÉ SIRVE */}
      <Section id="usos" className="border-t border-border">
        <SectionHeading
          title="Para qué sirve"
          subtitle="El mismo ciclo de preguntas, aplicado a lo que necesites preparar."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {USOS.map((u) => {
            const Icon = u.icon;
            const active = u.key === uso;
            return (
              <button
                key={u.key}
                type="button"
                onClick={() => setUso(u.key)}
                className={`flex flex-col cursor-pointer rounded-xl border bg-card p-6 text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-md ${
                  active ? "border-primary ring-1 ring-primary" : "border-border"
                }`}
              >
                <span className="mb-4 inline-flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                  <Icon className="size-5" />
                </span>
                <h3 className="font-heading text-base font-semibold">
                  {u.label}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{u.desc}</p>
              </button>
            );
          })}
        </div>
        <p className="mt-5 text-center text-sm text-muted-foreground">
          Ahora mismo:{" "}
          <span className="font-medium text-foreground">{activeUso.label}</span>
          .
        </p>
      </Section>

      {/* CÓMO FUNCIONA */}
      <Section
        id="como-funciona"
        className="border-t border-border bg-secondary/30"
      >
        <SectionHeading
          title="Cómo funciona"
          subtitle="Tres pasos. Nada más."
        />
        <div className="grid gap-4 sm:grid-cols-3">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <Card key={s.title} className="shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <span className="font-heading text-xl font-semibold text-primary">
                      {i + 1}
                    </span>
                    <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                      <Icon className="size-5" />
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-1.5">
                  <h3 className="font-heading text-base font-semibold">
                    {s.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </Section>

      {/* ESTILOS VISUALES */}
      <Section id="estilos" className="border-t border-border">
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-primary/20 bg-secondary/40 px-6 py-10 text-center sm:px-10">
          <Badge variant="secondary" className="gap-1.5 px-3 py-1 text-sm">
            <Palette className="size-3.5" />
            Estilos visuales
          </Badge>
          <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
            Elige cómo se muestran tus preguntas
          </h2>
          <p className="max-w-xl text-base text-muted-foreground">
            Antes de empezar eliges el fondo de tu sesión: auroras, cuadrículas,
            redes y más, en tema claro u oscuro.
          </p>
        </div>
        <div className="mx-auto mt-6 max-w-3xl">
          <StyleGallery />
        </div>
        <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-muted-foreground">
          Pasa el cursor sobre un estilo para verlo en vivo. Haz clic para probarlo en /live.
        </p>
      </Section>

      {/* INVITACIÓN A /live */}
      <Section id="live" className="border-t border-border">
        <div className="rounded-2xl border border-primary/20 bg-secondary/40 px-6 py-12 text-center sm:px-12">
          <h2 className="mx-auto max-w-xl font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            Llévalo a lo vivo en /live
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-muted-foreground sm:text-lg">
            Cuando quieras practicar en tiempo real, úsalo en{" "}
            <span className="font-medium text-foreground">/live</span>. Abre la
            sala y empieza a responder en vivo.
          </p>
          <div className="mt-7 flex justify-center">
            <Button
              size="lg"
              className="h-11 gap-2 px-6 text-base"
              onClick={() => navigate("/live")}
            >
              Entrar a /live
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </Section>

      {/* FOOTER */}
      <footer className="border-t border-border bg-background">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2 font-heading font-semibold">
            <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Mic className="size-3.5" />
            </span>
            Questionary
          </div>
          <p className="text-sm text-muted-foreground">
            Carga. Practica. Mejora.
          </p>
          <Button
            variant="link"
            className="gap-1 p-0 text-sm"
            onClick={() => navigate("/live")}
          >
            Practicar en vivo
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </footer>
    </div>
  );
}
