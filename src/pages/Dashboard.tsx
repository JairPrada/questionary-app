import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AuthDialog } from "@/components/AuthDialog";
import { BankDialog } from "@/components/BankDialog";
import { BankQuestionsSheet } from "@/components/BankQuestionsSheet";
import { SessionWizard } from "@/components/SessionWizard";
import { DesignEditor } from "@/components/DesignEditor";
import { Sidebar } from "@/components/Sidebar";
import { FloatingDock } from "@/components/ui/floating-dock";
import { getBankIconKey, getIconComponent } from "@/lib/bankIcon";
import { getCurrentUser, signOut } from "@/lib/auth";
import {
  deleteBank,
  deleteDesign,
  deleteSession,
  getBanks,
  getDesigns,
  getHistory,
  getQuestions,
  getSessions,
  seedIfEmpty,
} from "@/lib/db";
import { DEFAULT_DESIGNS, hexToRgba, resolveDesign } from "@/lib/design";
import { formatTime } from "@/lib/interview";
import type {
  Design,
  QuestionBank,
  Session,
  UseCaseCategory,
} from "@/lib/types";

const CATEGORY_LABELS: Record<UseCaseCategory, string> = {
  idiomas: "Idiomas",
  entrevistas: "Entrevistas",
  negocios: "Negocios",
  ocio: "Ocio",
};

import {
  Clock,
  History,
  LayoutDashboard,
  Library,
  ListChecks,
  Palette,
  Pencil,
  Play,
  Plus,
  PlusCircle,
  Shuffle,
  Trash2,
} from "lucide-react";

export function Dashboard() {
  const user = getCurrentUser();
  const navigate = useNavigate();
  const [authOpen, setAuthOpen] = useState(false);
  const [banks, setBanks] = useState<QuestionBank[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [designs, setDesigns] = useState<Design[]>([]);
  const [history, setHistory] = useState<
    ReturnType<typeof getHistory>
  >([]);
  const [bankDialog, setBankDialog] = useState<{
    open: boolean;
    bank?: QuestionBank;
  }>({ open: false });
  const [sheet, setSheet] = useState<{
    open: boolean;
    bankId: string;
    bankTitle: string;
    iconKey?: string;
  }>({ open: false, bankId: "", bankTitle: "" });
  const [sessionWizard, setSessionWizard] = useState<{
    open: boolean;
    session?: Session;
  }>({ open: false });
  const [designEditor, setDesignEditor] = useState<{
    open: boolean;
    design?: Design;
  }>({ open: false });

  const reload = () => {
    if (!user) return;
    setBanks(getBanks(user.id));
    setSessions(getSessions(user.id));
    setDesigns(getDesigns());
    setHistory(getHistory(user.id));
  };

  useEffect(() => {
    if (user) {
      seedIfEmpty(user.id);
      reload();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  if (!user) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold">Inicia sesión para continuar</h1>
        <p className="text-muted-foreground">
          Guarda tus plantillas, bancos de preguntas e historial de simulaciones.
        </p>
        <Button onClick={() => setAuthOpen(true)}>Iniciar sesión</Button>
        <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
      </div>
    );
  }

  const bankTitle = (bankId: string) =>
    banks.find((b) => b.id === bankId)?.title ?? "—";

  const logout = () => {
    signOut();
    navigate("/");
  };

  const dockItems = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard className="size-5" />,
      href: "/dashboard",
    },
    {
      title: "Practicar en vivo",
      icon: <PlusCircle className="size-5" />,
      href: "/live",
    },
    {
      title: "Bancos",
      icon: <Library className="size-5" />,
      href: "/dashboard#bancos",
    },
    {
      title: "Historial",
      icon: <History className="size-5" />,
      href: "/dashboard#historial",
    },
  ];

  return (
    <div className="relative">
      <Sidebar />
      <div className="mx-auto max-w-6xl space-y-10 px-4 py-8 lg:pl-60">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Hola, {user.email}</h1>
          <p className="text-sm text-muted-foreground">
            Gestiona tus simulaciones de entrevista.
          </p>
        </div>
        <Button variant="secondary" onClick={logout}>
          Cerrar sesión
        </Button>
      </div>

      <section className="space-y-8">
        {/* DISEÑOS */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <Palette className="size-5 text-primary" />
              Diseños
            </h2>
            <Button
              size="sm"
              variant="secondary"
              className="gap-1"
              onClick={() => setDesignEditor({ open: true })}
            >
              <Plus className="size-4" />
              Nuevo diseño
            </Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[...DEFAULT_DESIGNS, ...designs].map((d) => (
              <div
                key={d.id}
                role="button"
                tabIndex={0}
                onClick={() =>
                  setDesignEditor(
                    d.isBuiltIn ? { open: true } : { open: true, design: d },
                  )
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setDesignEditor(
                      d.isBuiltIn ? { open: true } : { open: true, design: d },
                    );
                  }
                }}
                className="group rounded-2xl border border-slate-800 bg-slate-900/50 p-3 text-left transition-colors hover:border-cyan-500/40"
              >
                <div
                  className="h-12 w-full rounded-lg"
                  style={{
                    background: `linear-gradient(135deg, ${d.accent}, ${hexToRgba(d.accent, 0.35)})`,
                  }}
                />
                <div className="mt-2 flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-medium text-slate-100">
                    {d.name}
                  </span>
                  {d.isBuiltIn ? (
                    <Badge
                      variant="secondary"
                      className="shrink-0 text-[10px] text-slate-400"
                    >
                      Base
                    </Badge>
                  ) : (
                    <button
                      type="button"
                      aria-label="Eliminar diseño"
                      className="shrink-0 rounded p-0.5 text-destructive hover:bg-destructive/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteDesign(d.id);
                        reload();
                      }}
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SESIONES */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <Play className="size-5 text-primary" />
              Sesiones
            </h2>
            <Button
              size="sm"
              className="gap-1"
              onClick={() => setSessionWizard({ open: true })}
            >
              <Plus className="size-4" />
              Nueva sesión
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sessions.map((s) => {
              const des = resolveDesign(
                [...DEFAULT_DESIGNS, ...designs],
                s.designId,
              );
              return (
                <Card
                  key={s.id}
                  className="flex flex-col border-slate-800 bg-slate-900/50"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <span
                        className="flex size-10 items-center justify-center rounded-xl"
                        style={{
                          backgroundColor: hexToRgba(des.accent, 0.12),
                          color: des.accent,
                        }}
                      >
                        <Palette className="size-5" />
                      </span>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label="Editar"
                          onClick={() =>
                            setSessionWizard({ open: true, session: s })
                          }
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label="Eliminar"
                          className="text-destructive"
                          onClick={() => {
                            deleteSession(s.id);
                            reload();
                          }}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                    <CardTitle className="text-base text-slate-100">
                      {s.title}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {s.source.type === "bank"
                        ? `Banco: ${bankTitle(s.source.bankId)}`
                        : "Preguntas propias"}
                      {s.category ? ` · ${CATEGORY_LABELS[s.category]}` : ""}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-1.5">
                    <Badge
                      variant="secondary"
                      className="text-xs"
                      style={{ color: des.accent }}
                    >
                      Diseño: {des.name}
                    </Badge>
                    <Badge variant="secondary" className="gap-1 text-xs">
                      <Clock className="size-3" />
                      {formatTime(s.responseSec)}
                    </Badge>
                    {s.prepSec > 0 && (
                      <Badge variant="secondary" className="gap-1 text-xs">
                        <Clock className="size-3" />
                        Prep {s.prepSec}s
                      </Badge>
                    )}
                    {s.isRandom && (
                      <Badge variant="secondary" className="gap-1 text-xs">
                        <Shuffle className="size-3" />
                        Aleatorio
                      </Badge>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button
                      size="sm"
                      className="w-full gap-1"
                      style={{
                        backgroundColor: des.accent,
                        borderColor: des.accent,
                        color: "#0B0F19",
                      }}
                      onClick={() => navigate(`/session/${s.id}`)}
                    >
                      <Play className="size-4" />
                      Iniciar
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
            {sessions.length === 0 && (
              <p className="col-span-full text-sm text-muted-foreground">
                Aún no tienes sesiones. Crea una para elegir tus preguntas y tu
                diseño visual.
              </p>
            )}
          </div>
        </div>
      </section>

      <section id="bancos" className="space-y-4 scroll-mt-20">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <ListChecks className="size-5 text-primary" />
            Bancos de preguntas
          </h2>
          <Button
            size="sm"
            variant="secondary"
            className="gap-1"
            onClick={() => setBankDialog({ open: true })}
          >
            <Plus className="size-4" />
            Nuevo banco
          </Button>
        </div>
        <div>
          {banks.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Aún no tienes bancos. Crea uno para empezar a guardar preguntas.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {banks.map((b) => {
                const qs = getQuestions(b.id);
                const Icon = getIconComponent(getBankIconKey(b));
                return (
                  <Card
                    key={b.id}
                    className="flex flex-col border-slate-800 bg-slate-900/50 transition-colors hover:border-cyan-500/40"
                  >
                    <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0">
                      <span className="flex size-11 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/20">
                        <Icon className="size-5" />
                      </span>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label="Editar"
                          onClick={() => setBankDialog({ open: true, bank: b })}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label="Eliminar"
                          className="text-destructive"
                          onClick={() => {
                            deleteBank(b.id);
                            reload();
                          }}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="flex flex-1 flex-col gap-3">
                      <div>
                        <CardTitle className="text-base text-slate-100">
                          {b.title}
                        </CardTitle>
                        <CardDescription className="mt-1 text-xs">
                          {qs.length} preguntas
                        </CardDescription>
                      </div>
                      <Badge
                        variant="secondary"
                        className="w-fit border-slate-700 text-slate-400"
                      >
                        {b.is_public ? "Público" : "Privado"}
                      </Badge>
                    </CardContent>
                    <CardFooter>
                      <Button
                        size="sm"
                        className="w-full gap-1"
                        onClick={() =>
                          setSheet({
                            open: true,
                            bankId: b.id,
                            bankTitle: b.title,
                            iconKey: getBankIconKey(b),
                          })
                        }
                      >
                        <ListChecks className="size-4" />
                        Gestionar
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section id="historial" className="space-y-4 scroll-mt-20">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <History className="size-5 text-primary" />
          Historial
        </h2>
        {history.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Todavía no has completado simulaciones.
          </p>
        ) : (
          <div className="divide-y rounded-lg border">
            {history.map((h) => {
              const minutes = Math.floor(h.avg_response_sec / 60);
              const seconds = Math.round(h.avg_response_sec % 60);
              return (
                <div
                  key={h.id}
                  className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm"
                >
                  <span className="text-muted-foreground">
                    {new Date(h.completed_at).toLocaleDateString("es", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}{" "}
                    {new Date(h.completed_at).toLocaleTimeString("es", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <span className="font-medium">{bankTitle(h.bank_id)}</span>
                  <Badge variant="secondary" className="gap-1">
                    <Clock className="size-3" />
                    {minutes > 0 ? `${minutes}m ` : ""}
                    {seconds}s prom.
                  </Badge>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <BankDialog
        open={bankDialog.open}
        onOpenChange={(open) => setBankDialog({ open, bank: bankDialog.bank })}
        userId={user.id}
        bank={bankDialog.bank}
        onSaved={reload}
      />
      <BankQuestionsSheet
        open={sheet.open}
        onOpenChange={(open) => setSheet((s) => ({ ...s, open }))}
        bankId={sheet.bankId}
        bankTitle={sheet.bankTitle}
      />
      <SessionWizard
        open={sessionWizard.open}
        onOpenChange={(open) =>
          setSessionWizard({ open, session: sessionWizard.session })
        }
        userId={user.id}
        banks={banks}
        designs={[...DEFAULT_DESIGNS, ...designs]}
        editSession={sessionWizard.session}
        onSaved={(id) => {
          reload();
          navigate(`/session/${id}`);
        }}
      />
      <DesignEditor
        open={designEditor.open}
        onOpenChange={(open) =>
          setDesignEditor({ open, design: designEditor.design })
        }
        editDesign={designEditor.design}
        onSaved={reload}
      />
      </div>
      <FloatingDock
        items={dockItems}
        desktopClassName="fixed bottom-6 left-1/2 -translate-x-1/2"
        mobileClassName="fixed bottom-6 right-6"
      />
    </div>
  );
}
