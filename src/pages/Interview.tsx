import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { InterviewSession } from "@/components/InterviewSession";
import { getPreset, getQuestions, addSession } from "@/lib/db";
import { buildSession } from "@/lib/interview";
import { getCurrentUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, RotateCcw } from "lucide-react";

export function Interview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const preset = id ? getPreset(id) : undefined;
  const [runKey, setRunKey] = useState(0);
  const [summary, setSummary] = useState<{ avg: number } | null>(null);

  if (!preset) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-6 text-center">
        <p className="text-lg text-muted-foreground">
          No se encontró la plantilla solicitada.
        </p>
        <Button onClick={() => navigate("/dashboard")}>Volver al panel</Button>
      </div>
    );
  }

  const bankQuestions = getQuestions(preset.bank_id).map((q) => q.text);
  const sessionQuestions = buildSession(
    bankQuestions,
    preset.questions_count,
    preset.is_random,
  );

  const handleComplete = (times: number[]) => {
    const total = times.reduce((a, b) => a + b, 0);
    const avg = total / Math.max(1, times.length);
    const user = getCurrentUser();
    if (user) {
      addSession(user.id, {
        preset_id: preset.id,
        bank_id: preset.bank_id,
        total_duration_sec: total,
        avg_response_sec: avg,
        questions_answered: times.length,
      });
    }
    setSummary({ avg });
  };

  if (summary) {
    const minutes = Math.floor(summary.avg / 60);
    const seconds = Math.round(summary.avg % 60);
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <Card className="w-full max-w-md">
          <CardContent className="space-y-4 p-8 text-center">
            <h1 className="text-2xl font-semibold">¡Simulación completada!</h1>
            <p className="text-muted-foreground">
              Tu tiempo promedio de respuesta fue
            </p>
            <p className="text-4xl font-bold text-primary tabular-nums">
              {minutes > 0 ? `${minutes} min ` : ""}
              {seconds} s
            </p>
            <div className="flex flex-col gap-2 pt-2">
              <Button
                className="gap-2"
                onClick={() => navigate("/dashboard")}
              >
                Ver historial
                <ArrowRight className="size-4" />
              </Button>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => {
                  setSummary(null);
                  setRunKey((k) => k + 1);
                }}
              >
                <RotateCcw className="size-4" />
                Repetir
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <InterviewSession
      key={runKey}
      questions={sessionQuestions}
      secondsPerQuestion={preset.time_per_question_sec}
      title={preset.name}
      prepSec={preset.prep_sec ?? 0}
      onExit={() => navigate("/dashboard")}
      onComplete={handleComplete}
    />
  );
}
