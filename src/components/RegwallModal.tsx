import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function RegwallModal({
  open,
  onOpenChange,
  onRegister,
  onDismiss,
  avgResponseSec,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRegister: () => void;
  onDismiss: () => void;
  avgResponseSec: number;
}) {
  const minutes = Math.floor(avgResponseSec / 60);
  const seconds = Math.round(avgResponseSec % 60);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Te gustaría guardar tu configuración?</DialogTitle>
          <DialogDescription>
            Crea una cuenta gratuita para guardar esta simulación como plantilla,
            personalizar los tiempos por pregunta y conservar tu historial.
          </DialogDescription>
        </DialogHeader>
        <div className="rounded-lg bg-muted p-4 text-sm">
          Tu tiempo promedio de respuesta en esta prueba fue{" "}
          <span className="font-semibold text-foreground">
            {minutes > 0 ? `${minutes} min ` : ""}
            {seconds} s
          </span>
          .
        </div>
        <DialogFooter className="flex-col-reverse sm:flex-row">
          <Button variant="ghost" onClick={onDismiss}>
            Ahora no
          </Button>
          <Button onClick={onRegister}>Crear cuenta gratis</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
