import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AuthDialog } from "@/components/AuthDialog";
import { Menu } from "lucide-react";

export function SiteHeader({
  authOpen: authOpenProp,
  setAuthOpen: setAuthOpenProp,
}: {
  authOpen?: boolean;
  setAuthOpen?: (v: boolean) => void;
}) {
  const navigate = useNavigate();
  const [internalAuth, setInternalAuth] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const authOpen = authOpenProp ?? internalAuth;
  const setAuthOpen = setAuthOpenProp ?? setInternalAuth;

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            Q
          </span>
          Questionary
        </Link>
        <nav className="hidden items-center gap-5 text-sm text-muted-foreground sm:flex">
          <Link to="/demo" className="transition-colors hover:text-foreground">
            Demo
          </Link>
          <Link
            to="/dashboard"
            className="transition-colors hover:text-foreground"
          >
            Panel
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" onClick={() => setAuthOpen(true)}>
            Iniciar sesión
          </Button>
          <Button onClick={() => setAuthOpen(true)}>Crear cuenta</Button>
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  className="sm:hidden"
                  aria-label="Abrir menú"
                />
              }
            >
              <Menu className="size-4" />
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Menú</SheetTitle>
              </SheetHeader>
              <div className="mt-6 flex flex-col gap-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/demo");
                  }}
                >
                  Demo
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/dashboard");
                  }}
                >
                  Panel
                </Button>
                <Button
                  onClick={() => {
                    setMenuOpen(false);
                    setAuthOpen(true);
                  }}
                >
                  Crear cuenta
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
    </header>
  );
}
