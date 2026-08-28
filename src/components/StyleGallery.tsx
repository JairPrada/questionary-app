import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { SESSION_STYLES, type SessionStyle } from "@/components/backgrounds/sessionStyles";
import { SessionBackground } from "@/components/backgrounds/SessionBackground";
import { VantaBackground } from "@/components/backgrounds/VantaBackground";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TypewriterText } from "@/components/TypewriterText";

const SAMPLE_QUESTION = "¿Cuál ha sido tu mayor logro profesional?";
const TOTAL = 12;
const SECONDS = 48;
const REMAINING_RATIO = SECONDS / 60;
const BAR_COLOR = "hsl(var(--primary))";

const formatTime = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

export function StyleGallery() {
  const navigate = useNavigate();
  const [bgTab, setBgTab] = useState<"light" | "dark">("light");
  const [hoverKey, setHoverKey] = useState<string | null>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const movePanel = (x: number, y: number) => {
    const el = panelRef.current;
    if (!el) return;
    const W = el.offsetWidth || 390;
    const H = el.offsetHeight || 300;
    const vw = typeof window !== "undefined" ? window.innerWidth : 1200;
    const vh = typeof window !== "undefined" ? window.innerHeight : 800;
    let left = x + 18;
    let top = y + 18;
    if (left + W > vw - 8) left = x - W - 18;
    if (top + H > vh - 8) top = Math.max(8, vh - H - 8);
    left = Math.max(8, left);
    top = Math.max(8, top);
    el.style.left = `${left}px`;
    el.style.top = `${top}px`;
  };

  useEffect(() => {
    if (hoverKey && panelRef.current) {
      movePanel(
        typeof window !== "undefined" ? window.innerWidth / 2 : 0,
        typeof window !== "undefined" ? window.innerHeight / 2 : 0,
      );
    }
  }, [hoverKey]);

  const openPreview = (key: string) => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setHoverKey(key);
  };

  const scheduleClose = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setHoverKey(null), 180);
  };

  const previewTheme = (s: SessionStyle) =>
    s.theme === "dark" ? "theme-dark" : "theme-light";

  return (
    <div>
      <div className="mb-4 flex justify-center">
        <div className="inline-flex rounded-lg border border-border bg-background p-1">
          {(["light", "dark"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setBgTab(tab)}
              className={`cursor-pointer rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                bgTab === tab
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:text-primary"
              }`}
            >
              {tab === "light" ? "Claros" : "Oscuros"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {SESSION_STYLES.filter((s) => s.theme === bgTab).map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => navigate("/live")}
            onMouseEnter={() => openPreview(s.key)}
            onMouseMove={(e) => movePanel(e.clientX, e.clientY)}
            onMouseLeave={scheduleClose}
            className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-border p-3 transition-all hover:border-primary/40"
          >
            <span className="relative h-12 w-full overflow-hidden rounded-lg">
              <span
                className={`absolute inset-0 bg-background ${
                  s.theme === "dark" ? "theme-dark" : "theme-light"
                }`}
              />
              {s.kind === "vanta" ? (
                <VantaBackground
                  effect={s.effect}
                  theme={s.theme}
                  className="absolute inset-0"
                />
              ) : (
                <SessionBackground styleKey={s.key} className="absolute inset-0" />
              )}
            </span>
            <span className="text-sm text-foreground">{s.label}</span>
          </button>
        ))}
      </div>

      {hoverKey &&
        (() => {
          const hs = SESSION_STYLES.find((s) => s.key === hoverKey);
          if (!hs) return null;
          return (
            <div
              key={hs.key}
              ref={panelRef}
              className="fixed z-50 w-[390px] max-w-[94vw] overflow-hidden rounded-2xl border border-border bg-background shadow-2xl"
              onMouseEnter={() => {
                if (hoverTimer.current) clearTimeout(hoverTimer.current);
              }}
              onMouseMove={(e) => movePanel(e.clientX, e.clientY)}
              onMouseLeave={scheduleClose}
            >
              <div
                className={`relative h-[250px] w-full bg-background ${previewTheme(hs)}`}
              >
                {hs.kind === "vanta" ? (
                  <VantaBackground
                    effect={hs.effect}
                    theme={hs.theme}
                    className="absolute inset-0"
                  />
                ) : (
                  <SessionBackground styleKey={hs.key} className="absolute inset-0" />
                )}

                <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7"
                      aria-label="Volver"
                    >
                      <ArrowLeft className="size-4" />
                    </Button>
                    <span className="text-[11px] font-medium text-muted-foreground">
                      Pregunta 1 / {TOTAL}
                    </span>
                  </div>
                  <span className="tabular-nums text-sm font-semibold text-foreground">
                    {formatTime(SECONDS)}
                  </span>
                </div>

                <button
                  type="button"
                  aria-label="Anterior"
                  className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/90 p-2 text-slate-900 shadow ring-1 ring-slate-200"
                >
                  <ArrowLeft className="size-4" />
                </button>
                <button
                  type="button"
                  aria-label="Siguiente"
                  className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-primary p-2 text-primary-foreground shadow ring-1 ring-primary/30"
                >
                  <ArrowRight className="size-4" />
                </button>

                <div className="absolute inset-0 flex flex-col items-center justify-center px-12 pb-9 pt-12 text-center">
                  <TypewriterText
                    text={SAMPLE_QUESTION}
                    className="text-xl font-semibold leading-snug text-foreground"
                  />
                </div>

                <div className="absolute inset-x-0 bottom-0 p-3">
                  <Progress
                    value={REMAINING_RATIO * 100}
                    color={BAR_COLOR}
                    className="h-1.5 w-full"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between bg-background px-4 py-2 text-xs text-muted-foreground">
                <span>{hs.label} · vista previa de la presentación</span>
                <button
                  type="button"
                  onClick={() => setHoverKey(null)}
                  aria-label="Cerrar"
                  className="rounded p-1 text-foreground hover:bg-muted"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            </div>
          );
        })()}
    </div>
  );
}
