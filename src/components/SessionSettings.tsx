import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Settings2 } from "lucide-react";
import type { ReadingSize, SessionEnvironment, SoundOption, TimerStyle, EnvironmentKey } from "@/lib/types";
import { BACKGROUNDS, READING_SIZES, SOUNDS, TIMER_STYLES } from "@/lib/sessionEnv";

function Group<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <Button
            key={o.value}
            type="button"
            size="sm"
            variant={value === o.value ? "default" : "outline"}
            onClick={() => onChange(o.value)}
          >
            {o.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

export function SessionSettings({
  env,
  onChange,
}: {
  env: SessionEnvironment;
  onChange: (e: SessionEnvironment) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button type="button" variant="outline" size="sm" className="gap-2" onClick={() => setOpen(true)}>
        <Settings2 className="size-4" />
        Personalizar
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Personalizar sesión</SheetTitle>
            <SheetDescription>
              Ajusta el entorno para mayor comodidad o para simular más presión.
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-6 p-4">
            <Group<TimerStyle>
              label="Tipo de temporizador"
              options={TIMER_STYLES}
              value={env.timerStyle}
              onChange={(v) => onChange({ ...env, timerStyle: v })}
            />
            <Group<EnvironmentKey>
              label="Fondo del entorno"
              options={BACKGROUNDS}
              value={env.background}
              onChange={(v) => onChange({ ...env, background: v })}
            />
            <Group<SoundOption>
              label="Estímulo auditivo"
              options={SOUNDS}
              value={env.sound}
              onChange={(v) => onChange({ ...env, sound: v })}
            />
            <Group<ReadingSize>
              label="Tamaño de lectura"
              options={READING_SIZES}
              value={env.readingSize}
              onChange={(v) => onChange({ ...env, readingSize: v })}
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
