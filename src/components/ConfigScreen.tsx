import { useState } from 'react';
import {
  LabelInputContainer,
  Label,
  Input,
  Textarea,
} from './ui/form-input';
import { ThemeToggle } from './ThemeToggle';
import {
  InterviewSettings,
  normalizeQuestions,
  formatTime,
} from '../lib/interview';
import { Theme } from '../lib/theme';

interface ConfigScreenProps {
  settings: InterviewSettings;
  theme: Theme;
  onToggleTheme: () => void;
  onChange: (next: InterviewSettings) => void;
  onStart: () => void;
}

const sectionTitleClass =
  'text-base font-semibold text-neutral-900 dark:text-white';

export function ConfigScreen({
  settings,
  theme,
  onToggleTheme,
  onChange,
  onStart,
}: ConfigScreenProps) {
  const [questionsText, setQuestionsText] = useState(() =>
    settings.questions.join('\n')
  );

  const pool = normalizeQuestions(settings.questions);
  const poolSize = pool.length;
  const sessionSize = Math.min(settings.numQuestions, poolSize);
  const totalEstimated = sessionSize * settings.secondsPerQuestion;

  const canStart =
    poolSize > 0 && settings.numQuestions >= 1 && settings.secondsPerQuestion >= 5;

  const handleQuestionsChange = (value: string) => {
    setQuestionsText(value);
    const lines = value.split('\n').filter((line) => line.trim().length > 0);
    onChange({ ...settings, questions: lines });
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center overflow-hidden bg-neutral-50 px-6 py-16 dark:bg-neutral-950">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.07),transparent_55%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.09),transparent_55%)]"
      />

      <div className="absolute right-4 top-4 z-20 md:right-8 md:top-8">
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>

      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center">
        <div className="flex flex-col items-center text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
            Práctica de entrevista
          </span>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-neutral-900 dark:text-white md:text-4xl">
            Configura tu entrevista
          </h1>
          <p className="mt-3 max-w-md text-sm leading-6 text-neutral-500 dark:text-neutral-400">
            Define el banco de preguntas, cuántas aparecerán por sesión y el
            tiempo que tendrás para responder cada una.
          </p>
        </div>

        <div className="mt-10 w-full rounded-3xl border border-neutral-200 bg-white/80 p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/60 dark:shadow-none md:p-8">
          <section>
            <div className="flex items-center justify-between">
              <h2 className={sectionTitleClass}>Banco de preguntas</h2>
              <span className="rounded-full bg-emerald-600/10 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-400">
                {poolSize} {poolSize === 1 ? 'pregunta' : 'preguntas'}
              </span>
            </div>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-500">
              Una pregunta por línea. Podrás editarlas cuando quieras.
            </p>
            <LabelInputContainer className="mt-4">
              <Label htmlFor="questions">Preguntas</Label>
              <Textarea
                id="questions"
                value={questionsText}
                onChange={(e) => handleQuestionsChange(e.target.value)}
                rows={8}
                placeholder={
                  '¿Cuéntame sobre ti?\n¿Cuál es tu mayor fortaleza?\n¿Por qué quieres este rol?'
                }
                className="font-mono"
              />
            </LabelInputContainer>
          </section>

          <section className="mt-10 border-t border-neutral-200 pt-8 dark:border-neutral-800">
            <h2 className={sectionTitleClass}>Configuración de la sesión</h2>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-500">
              Aplica cada vez que comiences una entrevista.
            </p>

            <div className="mt-6 grid gap-8 md:grid-cols-2">
              <LabelInputContainer>
                <Label htmlFor="numQuestions">
                  Número de preguntas
                </Label>
                <Input
                  id="numQuestions"
                  type="number"
                  min={1}
                  max={Math.max(poolSize, 1)}
                  value={settings.numQuestions}
                  suffix={settings.numQuestions === 1 ? 'pregunta' : 'preguntas'}
                  onChange={(e) =>
                    onChange({
                      ...settings,
                      numQuestions: Math.max(1, Number(e.target.value) || 1),
                    })
                  }
                />
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="secondsPerQuestion">
                  Duración por pregunta
                </Label>
                <Input
                  id="secondsPerQuestion"
                  type="number"
                  min={5}
                  max={3600}
                  step={5}
                  value={settings.secondsPerQuestion}
                  suffix="segundos"
                  onChange={(e) =>
                    onChange({
                      ...settings,
                      secondsPerQuestion: Math.max(5, Number(e.target.value) || 5),
                    })
                  }
                />
              </LabelInputContainer>
            </div>

            <div className="mt-8 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                  Barajar preguntas
                </p>
                <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-500">
                  Mezcla el orden del banco antes de empezar cada sesión.
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={settings.shuffle}
                aria-label="Barajar preguntas antes de empezar"
                onClick={() =>
                  onChange({ ...settings, shuffle: !settings.shuffle })
                }
                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${
                  settings.shuffle
                    ? 'bg-emerald-600 dark:bg-emerald-500'
                    : 'bg-neutral-300 dark:bg-neutral-700'
                }`}
              >
                <span
                  className={`absolute top-0.5 block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                    settings.shuffle ? 'translate-x-[22px]' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </section>

          <section className="mt-10 border-t border-neutral-200 pt-8 dark:border-neutral-800">
            <h2 className={sectionTitleClass}>Resumen de la sesión</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-neutral-500 dark:text-neutral-400">
                  Preguntas en el banco
                </dt>
                <dd className="font-semibold text-neutral-900 dark:text-white">
                  {poolSize}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-neutral-500 dark:text-neutral-400">
                  Preguntas por sesión
                </dt>
                <dd className="font-semibold text-neutral-900 dark:text-white">
                  {sessionSize}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-neutral-500 dark:text-neutral-400">
                  Duración total estimada
                </dt>
                <dd className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {formatTime(totalEstimated)}
                </dd>
              </div>
            </dl>
          </section>

          <button
            type="button"
            onClick={onStart}
            disabled={!canStart}
            className="mt-10 w-full rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 px-6 py-4 text-base font-semibold text-white shadow-sm transition-colors hover:from-emerald-500 hover:to-green-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Comenzar entrevista
          </button>
        </div>

        <p className="mt-6 text-xs text-neutral-400 dark:text-neutral-600">
          Tus preguntas y ajustes se guardan automáticamente en este navegador.
        </p>
      </div>
    </div>
  );
}
