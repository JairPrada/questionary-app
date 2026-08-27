"use client";
import { createRef, useEffect, useRef, useState } from "react";
import type { ReactNode, RefObject } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type Beam = {
  id: number;
  x: number;
  y: number;
  x2: number;
  y2: number;
  vx: number;
  vy: number;
  rotation: number;
  color: string;
  ref: RefObject<SVGGElement>;
};

const COLORS = ["#22d3ee", "#818cf8", "#a78bfa", "#34d399", "#f472b6"];

export function BackgroundBeamsWithCollision({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [beams, setBeams] = useState<Beam[]>([]);
  const beamsRef = useRef<Beam[]>([]);
  const [squares, setSquares] = useState<{ id: number; x: number; y: number }[]>(
    [],
  );
  const idRef = useRef(0);
  const lastSpawn = useRef(0);

  useEffect(() => {
    const parent = containerRef.current;
    if (!parent) return;
    const w = parent.clientWidth || 800;
    const h = parent.clientHeight || 600;
    const count = 14;
    const created: Beam[] = Array.from({ length: count }).map((_, i) => {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const angle = Math.random() * Math.PI;
      const len = 140 + Math.random() * 140;
      const speed = 0.5 + Math.random() * 1.4;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      return {
        id: i,
        x,
        y,
        x2: x + Math.cos(angle) * len,
        y2: y + Math.sin(angle) * len,
        vx,
        vy,
        rotation: (angle * 180) / Math.PI,
        color: COLORS[i % COLORS.length],
        ref: createRef<SVGGElement>(),
      };
    });
    setBeams(created);
    beamsRef.current = created;

    let raf = 0;
    const step = () => {
      const cur = beamsRef.current;
      cur.forEach((b) => {
        b.x += b.vx;
        b.y += b.vy;
        b.x2 += b.vx;
        b.y2 += b.vy;
        if (b.x < 0 || b.x > w) b.vx *= -1;
        if (b.y < 0 || b.y > h) b.vy *= -1;
        const angle = Math.atan2(b.y2 - b.y, b.x2 - b.x);
        b.rotation = (angle * 180) / Math.PI;
        const node = b.ref.current;
        if (node)
          node.setAttribute(
            "transform",
            `translate(${b.x} ${b.y}) rotate(${b.rotation})`,
          );
      });

      const now = performance.now();
      if (now - lastSpawn.current > 90) {
        for (let i = 0; i < cur.length; i++) {
          for (let j = i + 1; j < cur.length; j++) {
            const a = cur[i];
            const c = cur[j];
            const ax = (a.x + a.x2) / 2;
            const ay = (a.y + a.y2) / 2;
            const cx = (c.x + c.x2) / 2;
            const cy = (c.y + c.y2) / 2;
            const dx = ax - cx;
            const dy = ay - cy;
            if (dx * dx + dy * dy < 36 * 36) {
              const id = idRef.current++;
              setSquares((s) => [...s, { id, x: (ax + cx) / 2, y: (ay + cy) / 2 }]);
              window.setTimeout(
                () => setSquares((s) => s.filter((q) => q.id !== id)),
                800,
              );
              a.vx *= -1;
              a.vy *= -1;
              c.vx *= -1;
              c.vy *= -1;
              lastSpawn.current = now;
              i = cur.length;
              break;
            }
          }
        }
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "absolute inset-0 -z-10 overflow-hidden bg-[#0B0F19]",
        className,
      )}
    >
      <svg className="h-full w-full" width="100%" height="100%">
        {beams.map((b) => (
          <g key={b.id} ref={b.ref}>
            <line
              x1="0"
              y1="0"
              x2="180"
              y2="0"
              stroke={b.color}
              strokeWidth="2"
              strokeOpacity="0.6"
              strokeLinecap="round"
            />
          </g>
        ))}
      </svg>
      {squares.map((s) => (
        <motion.div
          key={s.id}
          initial={{ opacity: 0, scale: 0, rotate: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0, 1.3, 0], rotate: 90 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute h-2.5 w-2.5 bg-cyan-300"
          style={{ left: s.x, top: s.y }}
        />
      ))}
      {children ? <div className="relative z-10">{children}</div> : null}
    </div>
  );
}
