import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AuthDialog } from "@/components/AuthDialog";
import { getCurrentUser, signOut } from "@/lib/auth";
import { useState } from "react";
import { LogOut, User } from "lucide-react";

export function Navbar() {
  const user = getCurrentUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [authOpen, setAuthOpen] = useState(false);

  const handleLogout = () => {
    signOut();
    navigate("/");
  };

  const linkClass = (path: string) =>
    location.pathname === path
      ? "text-foreground font-medium"
      : "text-muted-foreground hover:text-foreground transition-colors";

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            Q
          </span>
          Questionary
        </Link>
        <nav className="hidden items-center gap-5 text-sm sm:flex">
          <Link to="/dashboard" className={linkClass("/dashboard")}>
            Panel
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <>
              <span className="hidden items-center gap-1.5 text-sm text-muted-foreground sm:flex">
                <User className="size-4" />
                {user.email}
              </span>
              <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Cerrar sesión">
                <LogOut className="size-4" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => setAuthOpen(true)}>
                Iniciar sesión
              </Button>
              <Button onClick={() => setAuthOpen(true)}>Crear cuenta</Button>
            </>
          )}
          <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
        </div>
      </div>
    </header>
  );
}
