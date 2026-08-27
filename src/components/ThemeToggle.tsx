import { Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';
import { Theme } from '../lib/theme';

export function ThemeToggle({
  theme,
  onToggle,
}: {
  theme: Theme;
  onToggle: () => void;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={onToggle}
      aria-label="Cambiar tema claro / oscuro"
      title={theme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
    >
      {theme === 'dark' ? <Sun /> : <Moon />}
    </Button>
  );
}
