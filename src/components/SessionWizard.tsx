import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import type { Design, QuestionBank, Session } from "@/lib/types";
import {
  createSession,
  updateSession,
} from "@/lib/db";

type WizardProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  banks: QuestionBank[];
  designs: Design[];
  editSession?: Session;
  onSaved: (id: string) => void;
};

const STEPS = ["Preguntas", "Diseño", "Tiempo"] as const;

export function SessionWizard({
  open,
  onOpenChange,
  userId,
  banks,
  designs,
  editSession,
  onSaved,
}: WizardProps) {
  const [step, setStep] = useState(0);
  const [sourceType, setSourceType] = useState<"bank" | "custom">("bank");
  const [bankId, setBankId] = useState<string>("");
  const [customText, setCustomText] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [designId, setDesignId] = useState<string>("");
  const [prepSec, setPrepSec] = useState<number>(0);
  const [responseSec, setResponseSec] = useState<number>(60);
  const [count, setCount] = useState<number>(5);
  const [isRandom, setIsRandom] = useState<boolean>(true);

  useEffect(() => {
    if (!open) return;
    if (editSession) {
      const src = editSession.source;
      setSourceType(src.type === "bank" ? "bank" : "custom");
      setBankId(src.type === "bank" ? src.bankId : "");
      setCustomText(src.type === "bank" ? "" : src.questions.join("\n"));
      setTitle(editSession.title);
      setDesignId(editSession.designId);
      setPrepSec(editSession.prepSec);
      setResponseSec(editSession.responseSec);
      setCount(editSession.count);
      setIsRandom(editSession.isRandom);
    } else {
      setStep(0);
      setSourceType("bank");
      setBankId(banks[0]?.id ?? "");
      setCustomText("");
      setTitle("");
      setDesignId(designs[0]?.id ?? "");
      setPrepSec(0);
      setResponseSec(60);
      setCount(5);
      setIsRandom(true);
    }
  }, [open, editSession, banks, designs]);

  const customQuestions = customText
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const canNext =
    step === 0
      ? sourceType === "bank"
        ? !!bankId
        : customQuestions.length > 0
      : step === 1
        ? !!designId
        : responseSec > 0;

  const save = () => {
    const source =
      sourceType === "bank"
        ? { type: "bank" as const, bankId }
        : { type: "custom" as const, questions: customQuestions };
    const finalCount =
      sourceType === "bank" ? Math.max(1, count) : customQuestions.length;
    const base = {
      title: title.trim() || "Mi sesión",
      source,
      designId,
      prepSec,
      responseSec,
      count: finalCount,
      isRandom: sourceType === "bank" ? isRandom : false,
      is_public: false,
    };
    if (editSession) {
      updateSession(editSession.id, base);
      onSaved(editSession.id);
    } else {
      const created = createSession(userId, base);
      onSaved(created.id);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {editSession ? "Editar sesión" : "Nueva sesión"}
          </DialogTitle>
          <DialogDescription>
            Elige tus preguntas y el diseño visual de la simulación.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <span
                className={
                  "flex size-5 items-center justify-center rounded-full text-[10px] " +
                  (i === step
                    ? "bg-cyan-400 text-slate-900"
                    : i < step
                      ? "bg-cyan-400/20 text-cyan-300"
                      : "bg-slate-800 text-slate-400")
                }
              >
                {i + 1}
              </span>
              <span className={i === step ? "text-slate-200" : ""}>
                {label}
              </span>
              {i < STEPS.length - 1 && <span className="px-1">→</span>}
            </div>
          ))}
        </div>

        <div className="space-y-4">
          {step === 0 && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={sourceType === "bank" ? "default" : "outline"}
                  onClick={() => setSourceType("bank")}
                  className={
                    sourceType === "bank" ? "flex-1 bg-cyan-400 text-slate-900" : "flex-1"
                  }
                >
                  Banco de preguntas
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={sourceType === "custom" ? "default" : "outline"}
                  onClick={() => setSourceType("custom")}
                  className={
                    sourceType === "custom" ? "flex-1 bg-cyan-400 text-slate-900" : "flex-1"
                  }
                >
                  Mis preguntas
                </Button>
              </div>

              {sourceType === "bank" ? (
                <div className="space-y-1.5">
                  <Label className="text-slate-300">Banco</Label>
                  <Select value={bankId} onValueChange={(v) => setBankId(v ?? "")}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona un banco" />
                    </SelectTrigger>
                    <SelectContent>
                      {banks.map((b) => (
                        <SelectItem key={b.id} value={b.id}>
                          {b.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <Label className="text-slate-300">
                    Escribe una pregunta por línea
                  </Label>
                  <Textarea
                    rows={6}
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder={"¿Cuál es tu mayor logro?\n¿Cómo resolviste un conflicto?"}
                    className="bg-slate-900/50 border-slate-800"
                  />
                  <p className="text-xs text-slate-500">
                    {customQuestions.length} preguntas detectadas.
                  </p>
                </div>
              )}

              <div className="space-y-1.5">
                <Label className="text-slate-300">Título de la sesión</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Entrevista de práctica"
                  className="bg-slate-900/50 border-slate-800"
                />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-1.5">
              <Label className="text-slate-300">Diseño visual</Label>
              <Select value={designId} onValueChange={(v) => setDesignId(v ?? "")}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona un diseño" />
                </SelectTrigger>
                <SelectContent>
                  {designs.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      <span className="flex items-center gap-2">
                        <span
                          className="size-3 rounded-full"
                          style={{ backgroundColor: d.accent }}
                        />
                        {d.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-500">
                El diseño controla fondo, tipografía, animaciones y color de
                acento. Créalo o edítalo en la sección Diseños.
              </p>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-slate-300">Tiempo por respuesta (s)</Label>
                  <Input
                    type="number"
                    min={5}
                    value={responseSec}
                    onChange={(e) => setResponseSec(Number(e.target.value))}
                    className="bg-slate-900/50 border-slate-800"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-slate-300">Tiempo de preparación (s)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={prepSec}
                    onChange={(e) => setPrepSec(Number(e.target.value))}
                    className="bg-slate-900/50 border-slate-800"
                  />
                </div>
              </div>

              {sourceType === "bank" && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-slate-300">Nº de preguntas</Label>
                    <Input
                      type="number"
                      min={1}
                      value={count}
                      onChange={(e) => setCount(Number(e.target.value))}
                      className="bg-slate-900/50 border-slate-800"
                    />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/50 px-3">
                    <Label className="text-slate-300">Aleatorio</Label>
                    <Switch
                      checked={isRandom}
                      onCheckedChange={setIsRandom}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
          >
            Atrás
          </Button>
          {step < STEPS.length - 1 ? (
            <Button
              type="button"
              className="bg-cyan-400 text-slate-900"
              disabled={!canNext}
              onClick={() => setStep((s) => s + 1)}
            >
              Siguiente
            </Button>
          ) : (
            <Button
              type="button"
              className="bg-cyan-400 text-slate-900"
              disabled={!canNext}
              onClick={save}
            >
              {editSession ? "Guardar" : "Crear sesión"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
