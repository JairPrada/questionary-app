import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ThemeToggle } from './ThemeToggle';
import { formatTime } from '../lib/interview';
import { Theme } from '../lib/theme';

interface SummaryScreenProps {
  questions: string[];
  usedTimes: number[];
  theme: Theme;
  onToggleTheme: () => void;
  onRestart: () => void;
  onConfig: () => void;
}

export function SummaryScreen({
  questions,
  usedTimes,
  theme,
  onToggleTheme,
  onRestart,
  onConfig,
}: SummaryScreenProps) {
  const totalTime = usedTimes.reduce((acc, t) => acc + t, 0);
  const average =
    usedTimes.length > 0 ? Math.round(totalTime / usedTimes.length) : 0;

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
            Sesión finalizada
          </span>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            ¡Entrevista completada!
          </h1>
          <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
            Este es el resumen de tu sesión de práctica.
          </p>
        </div>

        <Card className="mt-10 w-full">
          <CardHeader>
            <CardTitle>Resumen de la sesión</CardTitle>
            <CardDescription>
              Tiempos dedicados a cada pregunta.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-xl border bg-muted/40 p-4 text-center">
                <div className="text-2xl font-bold text-foreground md:text-3xl">
                  {questions.length}
                </div>
                <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                  Preguntas
                </div>
              </div>
              <div className="rounded-xl border bg-muted/40 p-4 text-center">
                <div className="text-2xl font-bold text-primary md:text-3xl">
                  {formatTime(totalTime)}
                </div>
                <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                  Tiempo total
                </div>
              </div>
              <div className="rounded-xl border bg-muted/40 p-4 text-center">
                <div className="text-2xl font-bold text-emerald-500 md:text-3xl">
                  {formatTime(average)}
                </div>
                <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                  Promedio
                </div>
              </div>
            </div>

            <div className="mt-6 max-h-72 space-y-2 overflow-y-auto pr-1">
              {questions.map((question, i) => (
                <div
                  key={`${question}-${i}`}
                  className="flex items-start justify-between gap-4 rounded-xl border bg-muted/30 px-4 py-3"
                >
                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="mt-0.5 h-6 w-6 shrink-0 justify-center rounded-full p-0 text-xs">
                      {i + 1}
                    </Badge>
                    <p className="text-sm leading-6 text-foreground">
                      {question}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-md bg-muted px-2 py-1 font-mono text-xs text-muted-foreground">
                    {formatTime(usedTimes[i] ?? 0)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-3 sm:flex-row">
            <Button
              type="button"
              className="flex-1"
              onClick={onRestart}
            >
              Repetir entrevista
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onConfig}
            >
              Cambiar configuración
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
