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
    <div className="relative flex min-h-screen w-full flex-col items-center overflow-hidden bg-neutral-50 px-6 py-16 dark:bg-neutral-950">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.07),transparent_55%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.09),transparent_55%)]"
      />

      <div className="absolute right-4 top-4 z-20 md:right-8 md:top-8">
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>

      <div className="relative z-10 w-full max-w-2xl rounded-3xl border border-neutral-200 bg-white/80 p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/60 dark:shadow-none md:p-10">
        <div className="flex flex-col items-center text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
            Sesión finalizada
          </span>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-neutral-900 dark:text-white md:text-4xl">
            ¡Entrevista completada!
          </h1>
          <p className="mt-3 max-w-md text-sm leading-6 text-neutral-500 dark:text-neutral-400">
            Este es el resumen de tu sesión de práctica.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="rounded-2xl border border-neutral-200 bg-neutral-100/70 p-4 text-center dark:border-neutral-800 dark:bg-neutral-950/60">
            <div className="text-2xl font-bold text-neutral-900 dark:text-white md:text-3xl">
              {questions.length}
            </div>
            <div className="mt-1 text-xs uppercase tracking-wider text-neutral-500">
              Preguntas
            </div>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-neutral-100/70 p-4 text-center dark:border-neutral-800 dark:bg-neutral-950/60">
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 md:text-3xl">
              {formatTime(totalTime)}
            </div>
            <div className="mt-1 text-xs uppercase tracking-wider text-neutral-500">
              Tiempo total
            </div>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-neutral-100/70 p-4 text-center dark:border-neutral-800 dark:bg-neutral-950/60">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400 md:text-3xl">
              {formatTime(average)}
            </div>
            <div className="mt-1 text-xs uppercase tracking-wider text-neutral-500">
              Promedio
            </div>
          </div>
        </div>

        <div className="mt-8 max-h-72 space-y-2 overflow-y-auto pr-1">
          {questions.map((question, i) => (
            <div
              key={`${question}-${i}`}
              className="flex items-start justify-between gap-4 rounded-xl border border-neutral-200 bg-neutral-100/60 px-4 py-3 dark:border-neutral-800/70 dark:bg-neutral-950/40"
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-600/10 text-xs font-bold text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-400">
                  {i + 1}
                </span>
                <p className="text-sm leading-6 text-neutral-700 dark:text-neutral-200">
                  {question}
                </p>
              </div>
              <span className="shrink-0 rounded-md bg-neutral-200 px-2 py-1 font-mono text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                {formatTime(usedTimes[i] ?? 0)}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onRestart}
            className="flex-1 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:from-emerald-500 hover:to-green-400"
          >
            Repetir entrevista
          </button>
          <button
            type="button"
            onClick={onConfig}
            className="flex-1 rounded-xl border border-neutral-300 px-6 py-3.5 text-sm font-semibold text-neutral-600 transition-colors hover:border-neutral-500 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-neutral-500 dark:hover:text-white"
          >
            Cambiar configuración
          </button>
        </div>
      </div>
    </div>
  );
}
