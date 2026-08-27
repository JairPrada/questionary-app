import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
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
  onBack: () => void;
}

const fieldClass = 'mt-2';

export function ConfigScreen({
  settings,
  theme,
  onToggleTheme,
  onChange,
  onStart,
  onBack,
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
    <div className="relative flex min-h-screen w-full flex-col items-center overflow-hidden bg-background px-6 py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.07),transparent_55%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.09),transparent_55%)]"
      />

      <div className="absolute left-4 top-4 z-20 md:left-8 md:top-8">
        <Button type="button" variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft />
          Volver
        </Button>
      </div>
      <div className="absolute right-4 top-4 z-20 md:right-8 md:top-8">
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>

      <div className="relative z-10 flex w-full max-w-2xl flex-col items-center">
        <div className="flex flex-col items-center text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Nueva sesión
          </span>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Configura tu entrevista
          </h1>
          <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
            Define el banco de preguntas, cuántas aparecerán por sesión y el
            tiempo que tendrás para responder cada una.
          </p>
        </div>

        <Card className="mt-10 w-full">
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1.5">
                <CardTitle>Banco de preguntas</CardTitle>
                <CardDescription>
                  Una pregunta por línea. Podrás editarlas cuando quieras.
                </CardDescription>
              </div>
              <Badge variant="secondary" className="shrink-0">
                {poolSize} {poolSize === 1 ? 'pregunta' : 'preguntas'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Label htmlFor="questions">Preguntas</Label>
            <Textarea
              id="questions"
              value={questionsText}
              onChange={(e) => handleQuestionsChange(e.target.value)}
              rows={9}
              placeholder={
                '¿Cuéntame sobre ti?\n¿Cuál es tu mayor fortaleza?\n¿Por qué quieres este rol?'
              }
              className={`${fieldClass} font-mono`}
            />

            <div className="mt-8 border-t pt-8">
              <h2 className="text-base font-semibold text-foreground">
                Configuración de la sesión
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Aplica cada vez que comiences una entrevista.
              </p>

              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <div>
                  <Label htmlFor="numQuestions">Número de preguntas</Label>
                  <Input
                    id="numQuestions"
                    type="number"
                    min={1}
                    max={Math.max(poolSize, 1)}
                    value={settings.numQuestions}
                    onChange={(e) =>
                      onChange({
                        ...settings,
                        numQuestions: Math.max(1, Number(e.target.value) || 1),
                      })
                    }
                    className={fieldClass}
                  />
                </div>

                <div>
                  <Label htmlFor="secondsPerQuestion">
                    Duración por pregunta (segundos)
                  </Label>
                  <Input
                    id="secondsPerQuestion"
                    type="number"
                    min={5}
                    max={3600}
                    step={5}
                    value={settings.secondsPerQuestion}
                    onChange={(e) =>
                      onChange({
                        ...settings,
                        secondsPerQuestion: Math.max(
                          5,
                          Number(e.target.value) || 5
                        ),
                      })
                    }
                    className={fieldClass}
                  />
                </div>
              </div>

              <div className="mt-6">
                <Label htmlFor="shuffle">Barajar preguntas</Label>
                <div
                  className={`${fieldClass} flex h-10 items-center justify-between rounded-md border border-input bg-transparent px-3 shadow-sm`}
                >
                  <span className="text-sm text-muted-foreground">
                    Mezclar el orden en cada sesión
                  </span>
                  <Switch
                    id="shuffle"
                    checked={settings.shuffle}
                    onCheckedChange={(checked) =>
                      onChange({ ...settings, shuffle: checked })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 border-t pt-8">
              <h2 className="text-base font-semibold text-foreground">
                Resumen de la sesión
              </h2>
              <dl className="mt-4 space-y-3 text-sm">
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
                    Duración total estimada
                  </dt>
                  <dd className="font-semibold text-primary">
                    {formatTime(totalEstimated)}
                  </dd>
                </div>
              </dl>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="button"
              size="lg"
              className="w-full"
              disabled={!canStart}
              onClick={onStart}
            >
              Comenzar entrevista
            </Button>
          </CardFooter>
        </Card>

        <p className="mt-6 text-xs text-muted-foreground">
          Tus preguntas y ajustes se guardan automáticamente en este navegador.
        </p>
      </div>
    </div>
  );
}
