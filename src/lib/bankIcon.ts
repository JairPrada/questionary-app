import {
  BookOpen,
  Brain,
  Briefcase,
  Camera,
  Code2,
  Coffee,
  Dumbbell,
  Flame,
  Gamepad2,
  Globe,
  GraduationCap,
  Heart,
  Layers,
  Leaf,
  Lightbulb,
  ListChecks,
  MessageCircle,
  Mic,
  Music,
  Palette,
  PenTool,
  Plane,
  Presentation,
  Rocket,
  ShoppingBag,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Wallet,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const BANK_ICONS: { key: string; label: string; Icon: LucideIcon }[] = [
  { key: "Layers", label: "Capas", Icon: Layers },
  { key: "ListChecks", label: "Lista", Icon: ListChecks },
  { key: "BookOpen", label: "Libro", Icon: BookOpen },
  { key: "Brain", label: "Cerebro", Icon: Brain },
  { key: "Briefcase", label: "Entrevista", Icon: Briefcase },
  { key: "GraduationCap", label: "Estudios", Icon: GraduationCap },
  { key: "Languages", label: "Idiomas", Icon: Globe },
  { key: "Globe", label: "Mundo", Icon: Globe },
  { key: "TrendingUp", label: "Negocios", Icon: TrendingUp },
  { key: "Sparkles", label: "Ocio", Icon: Sparkles },
  { key: "MessageCircle", label: "Conversación", Icon: MessageCircle },
  { key: "Mic", label: "Micrófono", Icon: Mic },
  { key: "Presentation", label: "Presentación", Icon: Presentation },
  { key: "Code2", label: "Código", Icon: Code2 },
  { key: "PenTool", label: "Escritura", Icon: PenTool },
  { key: "Target", label: "Objetivo", Icon: Target },
  { key: "Lightbulb", label: "Idea", Icon: Lightbulb },
  { key: "Rocket", label: "Lanzamiento", Icon: Rocket },
  { key: "Star", label: "Estrella", Icon: Star },
  { key: "Flame", label: "Fuego", Icon: Flame },
  { key: "Zap", label: "Energía", Icon: Zap },
  { key: "Heart", label: "Pasión", Icon: Heart },
  { key: "Music", label: "Música", Icon: Music },
  { key: "Camera", label: "Cámara", Icon: Camera },
  { key: "Plane", label: "Viaje", Icon: Plane },
  { key: "Gamepad2", label: "Juego", Icon: Gamepad2 },
  { key: "Dumbbell", label: "Ejercicio", Icon: Dumbbell },
  { key: "Coffee", label: "Café", Icon: Coffee },
  { key: "Palette", label: "Arte", Icon: Palette },
  { key: "Leaf", label: "Naturaleza", Icon: Leaf },
  { key: "ShoppingBag", label: "Tienda", Icon: ShoppingBag },
  { key: "Wallet", label: "Finanzas", Icon: Wallet },
];

export const DEFAULT_BANK_ICON = "Layers";

export function getIconComponent(key?: string): LucideIcon {
  if (!key) return Layers;
  return BANK_ICONS.find((i) => i.key === key)?.Icon ?? Layers;
}

export function getBankIconKey(bank?: {
  icon?: string;
  is_public?: boolean;
}): string {
  return bank?.icon ?? DEFAULT_BANK_ICON;
}
