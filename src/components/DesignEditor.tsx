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
import type { AnimationKey, Design, FontKey } from "@/lib/types";
import {
  BACKGROUNDS,
  READING_SIZES,
  SOUNDS,
  TIMER_STYLES,
} from "@/lib/sessionEnv";
import { createDesign, updateDesign } from "@/lib/db";

type EditorProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editDesign?: Design;
  onSaved: () => void;
};

const FONTS: { value: FontKey; label: string }[] = [
  { value: "sans", label: "Sans (limpia)" },
  { value: "serif", label: "Serif (editorial)" },
  { value: "mono", label: "Mono (técnica)" },
];

const ANIMATIONS: { value: AnimationKey; label: string }[] = [
  { value: "fade", label: "Aparecer (fade)" },
  { value: "slide", label: "Deslizar (slide)" },
  { value: "scale", label: "Zoom (scale)" },
  { value: "none", label: "Ninguna" },
];

export function DesignEditor({
  open,
  onOpenChange,
  editDesign,
  onSaved,
}: EditorProps) {
  const isEdit = !!editDesign && !editDesign.isBuiltIn;
  const [name, setName] = useState("");
  const [background, setBackground] = useState<string>("dark");
  const [accent, setAccent] = useState<string>("#22d3ee");
  const [font, setFont] = useState<FontKey>("sans");
  const [animation, setAnimation] = useState<AnimationKey>("fade");
  const [timerStyle, setTimerStyle] = useState<string>("digital");
  const [sound, setSound] = useState<string>("none");
  const [readingSize, setReadingSize] = useState<string>("md");

  useEffect(() => {
    if (!open) return;
    if (editDesign) {
      setName(editDesign.name);
      setBackground(editDesign.background);
      setAccent(editDesign.accent);
      setFont(editDesign.font);
      setAnimation(editDesign.animation);
      setTimerStyle(editDesign.timerStyle);
      setSound(editDesign.sound);
      setReadingSize(editDesign.readingSize);
    } else {
      setName("");
      setBackground("dark");
      setAccent("#22d3ee");
      setFont("sans");
      setAnimation("fade");
      setTimerStyle("digital");
      setSound("none");
      setReadingSize("md");
    }
  }, [open, editDesign]);

  const save = () => {
    const design: Design = {
      id: isEdit ? editDesign!.id : crypto.randomUUID(),
      name: name.trim() || "Mi diseño",
      background: background as Design["background"],
      timerStyle: timerStyle as Design["timerStyle"],
      sound: sound as Design["sound"],
      readingSize: readingSize as Design["readingSize"],
      accent,
      font,
      animation,
    };
    if (isEdit) updateDesign(editDesign!.id, design);
    else createDesign(design);
    onSaved();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Editar diseño" : "Nuevo diseño"}
          </DialogTitle>
          <DialogDescription>
            Define fondo, tipografía, animaciones y color de acento de la
            simulación.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-slate-300">Nombre</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Diseño ejecutivo"
              className="bg-slate-900/50 border-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-slate-300">Fondo</Label>
              <Select value={background} onValueChange={(v) => setBackground(v ?? "dark")}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BACKGROUNDS.map((b) => (
                    <SelectItem key={b.value} value={b.value}>
                      {b.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-slate-300">Color de acento</Label>
              <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/50 px-2 py-1">
                <input
                  type="color"
                  value={accent}
                  onChange={(e) => setAccent(e.target.value)}
                  className="size-8 cursor-pointer rounded border-0 bg-transparent"
                  aria-label="Color de acento"
                />
                <span className="text-xs text-slate-400">{accent}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-slate-300">Tipografía</Label>
              <Select value={font} onValueChange={(v) => setFont(v as FontKey)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FONTS.map((f) => (
                    <SelectItem key={f.value} value={f.value}>
                      {f.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-slate-300">Animación</Label>
              <Select
                value={animation}
                onValueChange={(v) => setAnimation(v as AnimationKey)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ANIMATIONS.map((a) => (
                    <SelectItem key={a.value} value={a.value}>
                      {a.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-slate-300">Cronómetro</Label>
              <Select
                value={timerStyle}
                onValueChange={(v) => setTimerStyle(v ?? "digital")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIMER_STYLES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-slate-300">Sonido</Label>
              <Select value={sound} onValueChange={(v) => setSound(v ?? "none")}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SOUNDS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-slate-300">Tamaño de lectura</Label>
              <Select value={readingSize} onValueChange={(v) => setReadingSize(v ?? "md")}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {READING_SIZES.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            className="bg-cyan-400 text-slate-900"
            onClick={save}
          >
            {isEdit ? "Guardar" : "Crear diseño"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
