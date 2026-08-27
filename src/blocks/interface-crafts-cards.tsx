"use client";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import React, { useEffect, useRef, useState } from "react";

type Card = {
  title: string;
  description: string;
  skeleton: React.ReactNode;
  className: string;
  config: {
    y: number;
    zIndex: number;
  };
};

type SpringConfig = {
  type: "spring";
  bounce?: number;
  visualDuration?: number;
  stiffness?: number;
  damping?: number;
  mass?: number;
};

export interface CardsProps {
  spring?: SpringConfig;
  activeScale?: number;
  cardSpacing?: number;
}

const defaultSpring: SpringConfig = {
  type: "spring",
  visualDuration: 0.6,
  bounce: 0.25,
};

export const Cards = ({
  spring = defaultSpring,
  activeScale = 1.15,
  cardSpacing = 180,
}: CardsProps = {}) => {
  const cards = [
    {
      title: "Simulaciones ilimitadas",
      description:
        "Lanza tantas prácticas como quieras, con temporizador real y sin esperas.",
      skeleton: (
        <div className="h-40 w-full rounded-xl bg-linear-to-r from-cyan-600 to-cyan-600/40"></div>
      ),
      className: "bg-slate-900/50 border border-slate-800 [&_h2]:text-slate-100",
      config: { y: -20, x: 0, rotate: -15, zIndex: 2 },
    },
    {
      title: "Bancos personalizados",
      description:
        "Crea tus propios bancos de preguntas y reordénalos con un clic.",
      skeleton: (
        <div className="h-40 w-full rounded-xl bg-linear-to-r from-slate-400 to-slate-500/40"></div>
      ),
      className: "bg-slate-900/50 border border-slate-800 [&_h2]:text-slate-100",
      config: { y: 20, x: 180, rotate: 8, zIndex: 3 },
    },
    {
      title: "Historial y métricas",
      description:
        "Revisa tu progreso, tiempos de respuesta y sesiones completadas.",
      skeleton: (
        <div className="h-40 w-full rounded-xl bg-linear-to-r from-violet-600 to-violet-600/40"></div>
      ),
      className: "bg-slate-900/50 border border-slate-800 [&_h2]:text-slate-100",
      config: { y: -80, x: 360, rotate: -5, zIndex: 4 },
    },
    {
      title: "Entrevistas, IELTS y más",
      description:
        "Plantillas listas para idiomas, negocios, entrevistas y ocio.",
      skeleton: (
        <div className="h-40 w-full rounded-xl bg-linear-to-r from-emerald-600 to-emerald-600/40"></div>
      ),
      className: "bg-slate-900/50 border border-slate-800 [&_h2]:text-slate-100",
      config: { y: 20, x: 540, rotate: 12, zIndex: 5 },
    },
    {
      title: "Modo invitado sin registro",
      description:
        "Prueba la experiencia al instante y crea cuenta cuando lo desees.",
      skeleton: (
        <div className="h-40 w-full rounded-xl bg-linear-to-r from-slate-950 to-slate-800/40"></div>
      ),
      className: "bg-slate-900/50 border border-slate-800 [&_h2]:text-slate-100",
      config: { y: 20, x: 720, rotate: -5, zIndex: 6 },
    },
  ];

  const [active, setActive] = useState<Card | null>(null);
  const [spacing, setSpacing] = useState(cardSpacing);

  const ref = useRef<HTMLDivElement>(null);

  const cardSpring = spring;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setActive(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () =>
      setSpacing(mq.matches ? cardSpacing : Math.round(cardSpacing * 0.39));
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [cardSpacing]);

  const middle = (cards.length - 1) / 2;

  const isAnyCardActive = () => {
    return active?.title;
  };

  const isCurrentActive = (card: Card) => {
    return active?.title === card.title;
  };
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <motion.div
        ref={ref}
        onClick={() => setActive(null)}
        className="relative mx-auto flex h-120 w-full max-w-5xl items-center justify-center [--height:300px] [--width:220px] lg:[--height:400px] lg:[--width:300px]"
      >
        {cards.map((card, index) => {
          const offsetX = (index - middle) * spacing;
          return (
            <motion.div key={card.title}>
              <motion.button
                initial={{
                  x: 0,
                  scale: 0,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setActive(card);
                }}
                animate={{
                  y: isCurrentActive(card)
                    ? 0
                    : isAnyCardActive()
                      ? 400
                      : card.config.y,
                  x: isCurrentActive(card)
                    ? 0
                    : isAnyCardActive()
                      ? offsetX * 0.4
                      : offsetX,
                  rotate: isCurrentActive(card)
                    ? 0
                    : isAnyCardActive()
                      ? 0.2 * card.config.rotate
                      : card.config.rotate,
                  scale: isCurrentActive(card)
                    ? activeScale
                    : isAnyCardActive()
                      ? 0.7
                      : 1,
                }}
                whileHover={{
                  scale: isCurrentActive(card)
                    ? activeScale
                    : isAnyCardActive()
                      ? 0.7
                      : 1.05,
                }}
                transition={cardSpring}
                style={{
                  width: `var(--width)`,
                  height: `var(--height)`,
                  marginLeft: `calc(var(--width) / -2)`,
                  marginTop: `calc(var(--height) / -2)`,
                  zIndex: isCurrentActive(card) ? 50 : card.config.zIndex,
                }}
                className={cn(
                  "absolute top-1/2 left-1/2 flex cursor-pointer flex-col items-start justify-between overflow-hidden rounded-2xl p-2 md:p-4",
                  card.className,
                )}
              >
                {card.skeleton}
                <div className="mt-5">
                  <motion.h2
                    layoutId={card.title + "title"}
                    className="font-regular max-w-40 text-left text-base md:text-3xl"
                  >
                    {card.title}
                  </motion.h2>
                  <AnimatePresence mode="popLayout">
                    {active?.title === card.title && (
                      <motion.p
                        layoutId={card.title + "description"}
                        initial={{ opacity: 0, x: 20, y: 20, height: 0 }}
                        animate={{ opacity: 1, x: 0, y: 0, height: 100 }}
                        exit={{ opacity: 0, x: 40, y: 40 }}
                        transition={cardSpring}
                        className="mt-3 text-left text-sm text-slate-400 md:text-base"
                      >
                        {card.description}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </motion.button>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default Cards;
