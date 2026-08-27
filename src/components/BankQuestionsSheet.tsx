import { useCallback, useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  addQuestion,
  deleteQuestion,
  getQuestions,
  reorderQuestions,
  updateQuestion,
} from "@/lib/db";
import type { Question } from "@/lib/types";
import {
  DraggableCardBody,
  DraggableCardContainer,
} from "@/components/ui/draggable-card";
import { getIconComponent } from "@/lib/bankIcon";
import { GripVertical, Pencil, Plus, Trash2 } from "lucide-react";

export function BankQuestionsSheet({
  open,
  onOpenChange,
  bankId,
  bankTitle,
  iconKey,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bankId: string;
  bankTitle: string;
  iconKey?: string;
}) {
  const BankIcon = getIconComponent(iconKey);
  const [items, setItems] = useState<Question[]>([]);
  const [newText, setNewText] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [dragId, setDragId] = useState<string | null>(null);

  const reload = useCallback(() => {
    setItems(getQuestions(bankId));
  }, [bankId]);

  const onDrop = (targetId: string) => {
    if (!dragId || dragId === targetId) {
      setDragId(null);
      return;
    }
    const from = items.findIndex((q) => q.id === dragId);
    const to = items.findIndex((q) => q.id === targetId);
    if (from < 0 || to < 0) return;
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setItems(next);
    reorderQuestions(bankId, next.map((q) => q.id));
    setDragId(null);
  };

  useEffect(() => {
    if (open) reload();
  }, [open, reload]);

  const add = () => {
    if (!newText.trim()) return;
    addQuestion(bankId, newText);
    setNewText("");
    reload();
  };

  const saveEdit = () => {
    if (editId) updateQuestion(editId, editText);
    setEditId(null);
    setEditText("");
    reload();
  };

  const del = (id: string) => {
    deleteQuestion(id);
    reload();
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="gap-0">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/20">
              <BankIcon className="size-4" />
            </span>
            {bankTitle}
          </SheetTitle>
          <SheetDescription>
            Crea, edita y elimina las preguntas de este banco.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 space-y-2 overflow-y-auto px-4 py-2">
          {items.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Aún no hay preguntas. Agrega la primera abajo.
            </p>
          )}
          <DraggableCardContainer className="space-y-2">
            {items.map((q, i) => (
              <DraggableCardBody
                key={q.id}
                draggable
                drag={false}
                onDragStart={() => setDragId(q.id)}
                onDragOver={(e: React.DragEvent) => e.preventDefault()}
                onDrop={() => onDrop(q.id)}
                className={`rounded-lg border bg-slate-900/50 border-slate-800 p-3 text-sm ${
                  dragId === q.id ? "opacity-50" : ""
                }`}
              >
                {editId === q.id ? (
                  <div className="flex flex-col gap-2">
                    <Input
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      autoFocus
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditId(null)}
                      >
                        Cancelar
                      </Button>
                      <Button size="sm" onClick={saveEdit}>
                        Guardar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-2">
                    <GripVertical className="mt-0.5 size-4 shrink-0 cursor-grab text-slate-500" />
                    <span className="mt-0.5 text-muted-foreground">
                      {i + 1}.
                    </span>
                    <p className="flex-1 text-slate-100">{q.text}</p>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Editar"
                        onClick={() => {
                          setEditId(q.id);
                          setEditText(q.text);
                        }}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Eliminar"
                        onClick={() => del(q.id)}
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                )}
              </DraggableCardBody>
            ))}
          </DraggableCardContainer>
        </div>
        <div className="border-t p-4">
          <Label htmlFor="new-question" className="sr-only">
            Nueva pregunta
          </Label>
          <div className="flex gap-2">
            <Input
              id="new-question"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && add()}
              placeholder="Escribe una pregunta..."
            />
            <Button size="icon" onClick={add} aria-label="Agregar">
              <Plus className="size-4" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
