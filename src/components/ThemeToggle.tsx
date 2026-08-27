import { Moon, Sun } from 'lucide-react';
import { Theme } from '../lib/theme';

export function ThemeToggle({
  theme,
  onToggle,
}: {
  theme: Theme;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label="Cambiar tema claro / oscuro"
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-300 bg-white/70 text-neutral-600 backdrop-blur transition-colors hover:border-emerald-500 hover:text-emerald-600 dark:border-neutral-700 dark:bg-neutral-900/70 dark:text-neutral-300 dark:hover:border-emerald-500 dark:hover:text-emerald-400"
    >
      {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
