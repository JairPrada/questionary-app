import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { BANK_ICONS, getIconComponent, DEFAULT_BANK_ICON } from "@/lib/bankIcon";
import { cn } from "@/lib/utils";

export function IconPicker({
  value,
  onChange,
}: {
  value?: string;
  onChange: (key: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const SelectedIcon = getIconComponent(value ?? DEFAULT_BANK_ICON);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/50 p-3 text-left transition-colors hover:border-cyan-500/50"
      >
        <span className="flex size-10 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/20">
          <SelectedIcon className="size-5" />
        </span>
        <span className="flex-1">
          <span className="block text-sm font-medium text-slate-100">
            Icono del banco
          </span>
          <span className="block text-xs text-slate-400">
            Toca para elegir
          </span>
        </span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Elige un icono</DialogTitle>
            <DialogDescription>
              Representa tu banco de preguntas a simple vista.
            </DialogDescription>
          </DialogHeader>
          <div className="grid max-h-72 grid-cols-6 gap-2 overflow-y-auto pr-1">
            {BANK_ICONS.map(({ key, label, Icon }) => (
              <button
                key={key}
                type="button"
                title={label}
                aria-label={label}
                onClick={() => {
                  onChange(key);
                  setOpen(false);
                }}
                className={cn(
                  "flex size-11 items-center justify-center rounded-lg border transition-colors",
                  value === key
                    ? "border-cyan-500 bg-cyan-500/10 text-cyan-400"
                    : "border-slate-800 text-slate-300 hover:bg-slate-800",
                )}
              >
                <Icon className="size-5" />
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
