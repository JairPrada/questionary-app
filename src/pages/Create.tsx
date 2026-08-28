import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Library, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { addQuestion, createBank, getBanks } from "@/lib/db";
import { getOrCreateGuestId } from "@/lib/auth";
import type { QuestionBank } from "@/lib/types";

type Kind = "qa" | "vocabulario";

type Pair = { term: string; translation: string };

export function Create() {
  const navigate = useNavigate();
  const [kind, setKind] = useState<Kind | null>(null);
  const [title, setTitle] = useState("");
  const [qaText, setQaText] = useState("");
  const [pairs, setPairs] = useState<Pair[]>([{ term: "", translation: "" }]);
  const [createdId, setCreatedId] = useState<string | null>(null);
  const [myBanks, setMyBanks] = useState<QuestionBank[]>([]);

  const guestId = getOrCreateGuestId();

  const reloadMyBanks = useCallback(() => {
    setMyBanks(
      getBanks(guestId)
        .filter((b) => b.user_id === guestId)
        .sort((a, b) => b.created_at.localeCompare(a.created_at)),
    );
  }, [guestId]);

  useEffect(() => {
    reloadMyBanks();
  }, [reloadMyBanks]);

  const qaQuestions = qaText
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const vocabPairs = pairs.filter(
    (p) => p.term.trim() && p.translation.trim(),
  );

  const canSave =
    title.trim().length > 0 &&
    (kind === "qa" ? qaQuestions.length > 0 : vocabPairs.length > 0);

  const save = () => {
    if (!kind || !canSave) return;
    const bank = createBank(guestId, title, false, undefined, kind);
    if (kind === "qa") {
      qaQuestions.forEach((q) => addQuestion(bank.id, q));
    } else {
      vocabPairs.forEach((p) =>
        addQuestion(bank.id, p.term, p.translation),
      );
    }
    setCreatedId(bank.id);
    reloadMyBanks();
  };

  const reset = () => {
    setKind(null);
    setTitle("");
    setQaText("");
    setPairs([{ term: "", translation: "" }]);
    setCreatedId(null);
  };

  return (
    <div className="landing-light relative min-h-screen w-screen overflow-hidden bg-background">
      <div className="live-bg" />
      <div className="relative z-10 mx-auto max-w-2xl space-y-8 px-4 py-8 sm:py-12">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            aria-label="Volver"
          >
            <ArrowLeft className="size-5" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">
            Crea tu entrenamiento
          </h1>
        </div>

        {createdId ? (
          <Card>
            <CardHeader>
              <CardTitle>¡Listo!</CardTitle>
              <CardDescription>
                Tu banco se guardó en este navegador. Practícalo cuando quieras.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 sm:flex-row">
              <Button
                className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => navigate(`/live?bank=${createdId}`)}
              >
                Practicar
                <ArrowRight className="size-4" />
              </Button>
              <Button
                variant="secondary"
                onClick={reset}
                className="border-slate-300 bg-white text-slate-900 hover:bg-slate-100"
              >
                Crear otro
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setKind("qa")}
                className={
                  "rounded-2xl border p-4 text-left cursor-pointer transition-colors " +
                  (kind === "qa"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/40")
                }
              >
                <Library className="size-5 text-primary" />
                <p className="mt-2 font-semibold text-foreground">
                  Preguntas
                </p>
                <p className="text-sm text-muted-foreground">
                  Entrenamiento y entrevistas. Una pregunta por turno.
                </p>
              </button>
              <button
                type="button"
                onClick={() => setKind("vocabulario")}
                className={
                  "rounded-2xl border p-4 text-left cursor-pointer transition-colors " +
                  (kind === "vocabulario"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/40")
                }
              >
                <Library className="size-5 text-primary" />
                <p className="mt-2 font-semibold text-foreground">
                  Vocabulario
                </p>
                <p className="text-sm text-muted-foreground">
                  Aprendizaje de temas. Término y traducción.
                </p>
              </button>
            </div>

            {kind && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {kind === "qa"
                      ? "Banco de preguntas"
                      : "Banco de vocabulario"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="bank-title">Título</Label>
                    <Input
                      id="bank-title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder={
                        kind === "qa"
                          ? "Ej. Preguntas de comportamiento"
                          : "Ej. Vocabulario de viajes"
                      }
                    />
                  </div>

                  {kind === "qa" ? (
                    <div className="space-y-1.5">
                      <Label htmlFor="qa-text">Preguntas</Label>
                      <Textarea
                        id="qa-text"
                        rows={8}
                        value={qaText}
                        onChange={(e) => setQaText(e.target.value)}
                        placeholder={
                          "¿Cuál ha sido tu mayor logro?\n¿Cómo resolviste un conflicto?\n¿Dónde te ves en cinco años?"
                        }
                      />
                      <p className="text-xs text-muted-foreground">
                        {qaQuestions.length} preguntas detectadas.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label>Términos y traducciones</Label>
                      {pairs.map((p, i) => (
                        <div key={i} className="flex gap-2">
                          <Input
                            value={p.term}
                            onChange={(e) => {
                              const next = [...pairs];
                              next[i].term = e.target.value;
                              setPairs(next);
                            }}
                            placeholder="Término"
                          />
                          <Input
                            value={p.translation}
                            onChange={(e) => {
                              const next = [...pairs];
                              next[i].translation = e.target.value;
                              setPairs(next);
                            }}
                            placeholder="Traducción"
                          />
                          {pairs.length > 1 && (
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label="Eliminar"
                              onClick={() =>
                                setPairs(pairs.filter((_, j) => j !== i))
                              }
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        variant="secondary"
                        size="sm"
                        className="gap-1 border-slate-300 bg-white text-slate-900 hover:bg-slate-100"
                        onClick={() =>
                          setPairs([
                            ...pairs,
                            { term: "", translation: "" },
                          ])
                        }
                      >
                        <Plus className="size-4" />
                        Agregar par
                      </Button>
                    </div>
                  )}

                  <Button
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    disabled={!canSave}
                    onClick={save}
                  >
                    Guardar y practicar
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {myBanks.length > 0 && (
          <section className="space-y-3">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <Library className="size-5 text-primary" />
              Mis bancos
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {myBanks.map((b) => (
                <Card key={b.id}>
                  <CardContent className="flex items-center justify-between gap-3 py-4">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-foreground">
                        {b.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {b.kind === "vocabulario"
                          ? "Vocabulario"
                          : "Preguntas"}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      className="gap-1 bg-primary text-primary-foreground hover:bg-primary/90"
                      onClick={() => navigate(`/live?bank=${b.id}`)}
                    >
                      Practicar
                      <ArrowRight className="size-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
