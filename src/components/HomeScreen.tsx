import { BarChart3, ListChecks, Play, Plus, Timer } from 'lucide-react';
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Badge } from './ui/badge';
import { ThemeToggle } from './ThemeToggle';
import {
  InterviewSettings,
  normalizeQuestions,
  formatTime,
} from '../lib/interview';
import { Theme } from '../lib/theme';

interface HomeScreenProps {
  settings: InterviewSettings;
  theme: Theme;
  onToggleTheme: () => void;
  onQuickStart: () => void;
  onNewSession: () => void;
}

const FEATURES = [
  {
    icon: ListChecks,
    title: 'Banco de preguntas',
    description: 'Escribe las preguntas que quieres practicar, una por línea.',
  },
  {
    icon: Timer,
    title: 'Temporizador',
    description: 'Cada pregunta tiene su tiempo; al agotarse avanza sola.',
  },
  {
    icon: BarChart3,
    title: 'Resumen final',
    description: 'Revisa cuánto tiempo dedicaste a cada respuesta.',
  },
];

export function HomeScreen({
  settings,
  theme,
  onToggleTheme,
  onQuickStart,
  onNewSession,
}: HomeScreenProps) {
  const poolSize = normalizeQuestions(settings.questions).length;
  const sessionSize = Math.min(settings.numQuestions, poolSize);
  const totalEstimated = sessionSize * settings.secondsPerQuestion;
  const hasSession = poolSize > 0;

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center overflow-hidden bg-background px-6 py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.07),transparent_55%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.09),transparent_55%)]"
      />

      <div className="absolute right-4 top-4 z-20 md:right-8 md:top-8">
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>

      <div className="relative z-10 flex w-full max-w-2xl flex-col items-center">
        <div className="flex flex-col items-center text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Simulador de entrevista
          </span>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            Practica tu próxima entrevista
          </h1>
          <p className="mt-4 max-w-lg text-sm leading-6 text-muted-foreground md:text-base">
            Una pregunta a la vez, con tiempo para responder, como en una
            entrevista real. Tú eliges las preguntas y el ritmo.
          </p>
        </div>

        <Card className="mt-10 w-full">
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1.5">
                <CardTitle>Tu sesión de entrevista</CardTitle>
                <CardDescription>
                  Usa tu última configuración o crea una nueva sesión.
                </CardDescription>
              </div>
              {hasSession && (
                <Badge variant="secondary" className="shrink-0">
                  Guardada
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {hasSession ? (
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">
                    Preguntas en el banco
                  </dt>
                  <dd className="font-semibold text-foreground">{poolSize}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">
                    Preguntas por sesión
                  </dt>
                  <dd className="font-semibold text-foreground">
                    {sessionSize}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">
                    Duración por pregunta
                  </dt>
                  <dd className="font-semibold text-foreground">
                    {formatTime(settings.secondsPerQuestion)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">
                    Duración total estimada
                  </dt>
                  <dd className="font-semibold text-primary">
                    {formatTime(totalEstimated)}
                  </dd>
                </div>
              </dl>
            ) : (
              <p className="text-sm text-muted-foreground">
                Aún no tienes preguntas configuradas. Crea una nueva sesión
                para empezar.
              </p>
            )}
          </CardContent>
          <CardFooter className="flex-col gap-3 sm:flex-row">
            <Button
              type="button"
              className="w-full sm:flex-1"
              disabled={!hasSession}
              onClick={onQuickStart}
            >
              <Play />
              Iniciar entrevista
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full sm:flex-1"
              onClick={onNewSession}
            >
              <Plus />
              Crear nueva sesión
            </Button>
          </CardFooter>
        </Card>

        <div className="mt-10 grid w-full gap-4 sm:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border bg-card p-5"
            >
              <feature.icon className="size-5 text-primary" />
              <h3 className="mt-3 text-sm font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
