import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TypewriterTextProps {
  text: string;
  className?: string;
  cursorClassName?: string;
  /** Segundos por caracter. */
  speed?: number;
}

/**
 * Efecto de maquina de escribir (patron aceternity Typewriter Effect).
 * Escribe el texto caracter por caracter con un cursor parpadeante.
 * La linea se parte entre palabras (nunca a mitad de palabra).
 * Se reanima automaticamente cuando cambia `text` (nueva pregunta/termino).
 * Respeta `prefers-reduced-motion`: muestra el texto sin animar.
 */
export function TypewriterText({
  text,
  className,
  cursorClassName,
  speed = 0.025,
}: TypewriterTextProps) {
  const reduce = useReducedMotion();

  const cursorClassNameResolved = cn(
    "ml-0.5 inline-block h-[1.1em] w-[3px] translate-y-[0.18em] rounded-sm bg-current",
    cursorClassName,
  );

  if (reduce) {
    return (
      <span className={cn("inline-block", className)}>
        {text}
        <span aria-hidden className={cursorClassNameResolved} />
      </span>
    );
  }

  const words = text.split(" ");
  let cursorGlobal = 0;
  const wordItems = words.map((word) => {
    const start = cursorGlobal;
    cursorGlobal += word.length;
    return { word, start };
  });

  return (
    <span className={cn("inline-block", className)}>
      {wordItems.map(({ word, start }, wi) => {
        const chars = Array.from(word);
        return (
          <span key={`${text}-${wi}`}>
            <span className="inline-block whitespace-nowrap">
              {chars.map((char, ci) => (
                <motion.span
                  key={`${text}-${wi}-${ci}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: 0.01,
                    delay: (start + ci) * speed,
                    ease: "linear",
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </span>
            {wi < wordItems.length - 1 ? " " : null}
          </span>
        );
      })}
      <motion.span
        aria-hidden
        initial={{ opacity: 1 }}
        animate={{ opacity: [1, 0, 0, 1] }}
        transition={{
          duration: 1,
          repeat: Infinity,
          times: [0, 0.1, 0.5, 0.9],
          ease: "linear",
        }}
        className={cursorClassNameResolved}
      />
    </span>
  );
}
