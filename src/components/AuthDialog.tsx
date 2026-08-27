import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, signUp } from "@/lib/auth";
import { seedIfEmpty } from "@/lib/db";

export function AuthDialog({
  open,
  onOpenChange,
  redirectTo = "/dashboard",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  redirectTo?: string;
}) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = (mode: "signin" | "signup") => {
    const value = email.trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) {
      setError("Ingresa un correo electrónico válido.");
      return;
    }
    const user = mode === "signup" ? signUp(value) : signIn(value);
    seedIfEmpty(user.id);
    setEmail("");
    setError(null);
    onOpenChange(false);
    navigate(redirectTo);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Accede a tu cuenta</DialogTitle>
          <DialogDescription>
            Guarda tus plantillas, bancos de preguntas e historial de
            simulaciones.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <div className="grid gap-2">
            <Label htmlFor="auth-email">Correo electrónico</Label>
            <Input
              id="auth-email"
              type="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit("signin")}
              aria-invalid={error ? true : undefined}
            />
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              className="flex-1"
              onClick={() => submit("signin")}
            >
              Iniciar sesión
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => submit("signup")}
            >
              Crear cuenta
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
