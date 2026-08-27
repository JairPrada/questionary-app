/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type ThemeMode = "light" | "dark" | "system";
type Resolved = "light" | "dark";

const MODE_KEY = "questionary-theme-mode";

function getSystem(): Resolved {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function loadMode(): ThemeMode {
  try {
    const stored = localStorage.getItem(MODE_KEY);
    if (stored === "light" || stored === "dark" || stored === "system") {
      return stored;
    }
  } catch {
    /* noop */
  }
  return "dark";
}

type ThemeContextValue = {
  mode: ThemeMode;
  resolved: Resolved;
  setMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(() => loadMode());
  const [resolved, setResolved] = useState<Resolved>(() =>
    mode === "system" ? getSystem() : mode,
  );

  useEffect(() => {
    const apply = () => {
      const next = mode === "system" ? getSystem() : mode;
      setResolved(next);
      document.documentElement.classList.toggle("dark", next === "dark");
    };
    apply();
    if (mode !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [mode]);

  const setMode = useCallback((next: ThemeMode) => {
    try {
      localStorage.setItem(MODE_KEY, next);
    } catch {
      /* noop */
    }
    setModeState(next);
  }, []);

  return (
    <ThemeContext.Provider value={{ mode, resolved, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
