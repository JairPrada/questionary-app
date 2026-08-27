import { cn } from "@/lib/utils";
import { AnimatedBackground } from "@/components/ui/animated-background";

export function CardCover({
  variant,
  emoji,
  label,
  className,
}: {
  variant: "aurora" | "sunset" | "ocean" | "lavender";
  emoji: string;
  label: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative isolate aspect-[2/1] w-full overflow-hidden",
        className,
      )}
    >
      <AnimatedBackground variant={variant} />
      <div className="relative z-10 flex h-full flex-col justify-end gap-1 p-4">
        <span className="text-4xl drop-shadow">{emoji}</span>
        <span className="text-sm font-semibold text-slate-100 drop-shadow">
          {label}
        </span>
      </div>
    </div>
  );
}
