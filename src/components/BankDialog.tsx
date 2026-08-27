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
import { createBank, updateBank } from "@/lib/db";
import { IconPicker } from "@/components/IconPicker";
import { DEFAULT_BANK_ICON } from "@/lib/bankIcon";
import type { QuestionBank } from "@/lib/types";

export function BankDialog({
  open,
  onOpenChange,
  userId,
  bank,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  bank?: QuestionBank;
  onSaved?: () => void;
}) {
  const [title, setTitle] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [icon, setIcon] = useState(DEFAULT_BANK_ICON);

  useEffect(() => {
    if (open) {
      setTitle(bank?.title ?? "");
      setIsPublic(bank?.is_public ?? false);
      setIcon(bank?.icon ?? DEFAULT_BANK_ICON);
    }
  }, [open, bank]);

  const save = () => {
    if (bank) {
      updateBank(bank.id, { title, is_public: isPublic, icon });
    } else {
      createBank(userId, title, isPublic, icon);
    }
    onSaved?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {bank ? "Editar banco de preguntas" : "Nuevo banco de preguntas"}
          </DialogTitle>
          <DialogDescription>
            Agrupa preguntas por tema o por tipo de entrevista.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2">
          <Label htmlFor="bank-title">Título</Label>
          <Input
            id="bank-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej. Preguntas de comportamiento"
          />
        </div>
        <IconPicker value={icon} onChange={setIcon} />
        <div className="flex items-center justify-between rounded-lg border p-3">
          <div>
            <Label htmlFor="bank-public" className="font-medium">
              Banco público
            </Label>
            <p className="text-xs text-muted-foreground">
              Visible para todos los usuarios.
            </p>
          </div>
          <Switch
            id="bank-public"
            checked={isPublic}
            onCheckedChange={setIsPublic}
          />
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
