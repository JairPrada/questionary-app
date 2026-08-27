"use client";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function AuroraBackground({
  className,
  children,
  showRadialGradient = false,
}: {
  className?: string;
  children?: ReactNode;
  showRadialGradient?: boolean;
}) {
  return (
    <div
      className={cn(
        "absolute inset-0 -z-10 overflow-hidden bg-[#0B0F19]",
        className,
      )}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={cn(
            "absolute inset-0 [--aurora:repeating-linear-gradient(100deg,#22d3ee_10%,#818cf8_20%,#a78bfa_30%,#34d399_40%,#22d3ee_50%)] [background-image:var(--aurora)] [background-size:300%,200%] [background-position:50%_50%] blur-[14px] opacity-50 after:absolute after:inset-0 after:content-[''] after:[background-image:var(--aurora)] after:[background-size:200%,100%] after:[background-position:50%_50%] after:opacity-60 after:animate-aurora",
            showRadialGradient &&
              "[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,transparent_70%)]",
          )}
        />
      </div>
      {children ? <div className="relative z-10">{children}</div> : null}
    </div>
  );
}
