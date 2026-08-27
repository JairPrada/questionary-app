import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export type AnimatedVariant = "aurora" | "sunset" | "ocean" | "lavender";

const PRESETS: Record<AnimatedVariant, string[]> = {
  aurora: ["#34d399", "#22d3ee", "#a78bfa"],
  sunset: ["#fb7185", "#f59e0b", "#a855f7"],
  ocean: ["#22d3ee", "#3b82f6", "#0ea5e9"],
  lavender: ["#a78bfa", "#f0abfc", "#818cf8"],
};

export function AnimatedBackground({
  variant = "aurora",
  className,
}: {
  variant?: AnimatedVariant;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const colors = PRESETS[variant] ?? PRESETS.aurora;

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-[#0B0F19]",
        className,
      )}
    >
      {colors.map((color, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full opacity-40 blur-3xl"
          style={{
            background: color,
            width: `${46 + i * 12}%`,
            height: `${46 + i * 12}%`,
            top: `${i * 16 - 8}%`,
            left: `${i * 22 - 6}%`,
          }}
          animate={
            reduce
              ? undefined
              : {
                  x: [0, 50, -25, 0],
                  y: [0, -35, 25, 0],
                  scale: [1, 1.2, 0.9, 1],
                }
          }
          transition={{
            duration: 14 + i * 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
