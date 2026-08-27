import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createPreset, getBanks, updatePreset } from "@/lib/db";
import type { InterviewPreset } from "@/lib/types";

export function PresetDialog({
  open,
  onOpenChange,
  userId,
  preset,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  preset?: InterviewPreset;
  onSaved?: () => void;
}) {
  const banks = getBanks(userId);
  const [name, setName] = useState("");
  const [bankId, setBankId] = useState("");
  const [count, setCount] = useState(5);
  const [seconds, setSeconds] = useState(60);
  const [isRandom, setIsRandom] = useState(false);

  useEffect(() => {
    if (!open) return;
    setName(preset?.name ?? "");
    setBankId(preset?.bank_id ?? banks[0]?.id ?? "");
    setCount(preset?.questions_count ?? 5);
    setSeconds(preset?.time_per_question_sec ?? 60);
    setIsRandom(preset?.is_random ?? false);
  }, [open, preset, banks]);

  const save = () => {
    if (!bankId) return;
    const data = {
      bank_id: bankId,
      name: name.trim() || "Sin nombre",
      questions_count: Math.max(1, Math.floor(count) || 1),
      time_per_question_sec: Math.max(5, Math.floor(seconds) || 5),
      is_random: isRandom,
    };
    if (preset) {
      updatePreset(preset.id, data);
    } else {
      createPreset(userId, data);
    }
    onSaved?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {preset ? "Editar plantilla" : "Nueva plantilla"}
          </DialogTitle>
          <DialogDescription>
            Configura una simulación para lanzarla con un solo clic.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="preset-name">Nombre</Label>
            <Input
              id="preset-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Entrevista de práctica"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="preset-bank">Banco de preguntas</Label>
            <Select
              value={bankId}
              onValueChange={(v) => setBankId(v ?? "")}
            >
              <SelectTrigger id="preset-bank">
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
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="preset-count">Nº de preguntas</Label>
              <Input
                id="preset-count"
                type="number"
                min={1}
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="preset-seconds">Segundos / pregunta</Label>
              <Input
                id="preset-seconds"
                type="number"
                min={5}
                value={seconds}
                onChange={(e) => setSeconds(Number(e.target.value))}
              />
            </div>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <Label htmlFor="preset-random" className="font-medium">
                Orden aleatorio
              </Label>
              <p className="text-xs text-muted-foreground">
                Mezcla el orden de las preguntas en cada sesión.
              </p>
            </div>
            <Switch
              id="preset-random"
              checked={isRandom}
              onCheckedChange={setIsRandom}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={save}>Guardar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
