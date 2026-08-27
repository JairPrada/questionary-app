import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { InterviewSession } from "@/components/InterviewSession";
import { AuthDialog } from "@/components/AuthDialog";
import { DEMO_PRESET_ID, getPreset, getQuestions, addSession } from "@/lib/db";
import { buildSession } from "@/lib/interview";
import { getCurrentUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, RotateCcw } from "lucide-react";

export function Demo() {
  const navigate = useNavigate();
  const [runKey, setRunKey] = useState(0);
  const [authOpen, setAuthOpen] = useState(false);
  const [summary, setSummary] = useState<{ avg: number } | null>(null);

  const preset = getPreset(DEMO_PRESET_ID);
  const bankQuestions = preset
    ? getQuestions(preset.bank_id).map((q) => q.text)
    : [];
  const sessionQuestions = preset
    ? buildSession(bankQuestions, preset.questions_count, preset.is_random)
    : [];

  const handleComplete = (times: number[]) => {
    const total = times.reduce((a, b) => a + b, 0);
    const avg = total / Math.max(1, times.length);
    const user = getCurrentUser();
    if (user) {
      addSession(user.id, {
        preset_id: preset!.id,
        bank_id: preset!.bank_id,
        total_duration_sec: total,
        avg_response_sec: avg,
        questions_answered: times.length,
      });
    }
    setSummary({ avg });
  };

  if (summary) {
    const user = getCurrentUser();
    const minutes = Math.floor(summary.avg / 60);
    const seconds = Math.round(summary.avg % 60);
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <Card className="w-full max-w-md">
          <CardContent className="space-y-4 p-8 text-center">
            <h1 className="text-2xl font-semibold">
              ¡Simulación completada!
            </h1>
            <p className="text-muted-foreground">
              Tu tiempo promedio de respuesta fue
            </p>
            <p className="text-4xl font-bold text-primary tabular-nums">
              {minutes > 0 ? `${minutes} min ` : ""}
              {seconds} s
            </p>
            {user ? (
              <Button className="w-full gap-2" onClick={() => navigate("/dashboard")}>
                Ver historial
                <ArrowRight className="size-4" />
              </Button>
            ) : (
              <Button className="w-full gap-2" onClick={() => setAuthOpen(true)}>
                Inicia sesión para guardar tu progreso
              </Button>
            )}
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => {
                setSummary(null);
                setRunKey((k) => k + 1);
              }}
            >
              <RotateCcw className="size-4" />
              Repetir
            </Button>
          </CardContent>
        </Card>
        <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
      </div>
    );
  }

  if (!preset) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-6 text-center">
        <p className="text-lg text-muted-foreground">
          No se pudo cargar la demostración.
        </p>
        <Button onClick={() => navigate("/")}>Volver al inicio</Button>
      </div>
    );
  }

  return (
    <InterviewSession
      key={runKey}
      questions={sessionQuestions}
      secondsPerQuestion={preset.time_per_question_sec}
      title={preset.name}
      onExit={() => navigate("/")}
      onComplete={handleComplete}
    />
  );
}
