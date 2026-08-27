import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { BackgroundBeams } from './ui/background-beams';
import { TypewriterEffect } from './ui/typewriter-effect';
import { AnimatedDigits } from './AnimatedDigits';
import { ThemeToggle } from './ThemeToggle';
import { formatTime } from '../lib/interview';
import { Theme } from '../lib/theme';

interface InterviewScreenProps {
  questions: string[];
  secondsPerQuestion: number;
  theme: Theme;
  onToggleTheme: () => void;
  onFinish: (usedTimes: number[]) => void;
  onExit: () => void;
}

function QuestionTimer({
  seconds,
  onTimeout,
  onTick,
}: {
  seconds: number;
  onTimeout: () => void;
  onTick: (remaining: number) => void;
}) {
  const [remaining, setRemaining] = useState(seconds);
  const timedOut = useRef(false);
  const onTimeoutRef = useRef(onTimeout);
  const onTickRef = useRef(onTick);

  useEffect(() => {
    onTimeoutRef.current = onTimeout;
    onTickRef.current = onTick;
  });

  useEffect(() => {
    const id = setInterval(() => {
      setRemaining((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    onTickRef.current(remaining);
  }, [remaining]);

  useEffect(() => {
    if (remaining !== 0 || timedOut.current) return;
    timedOut.current = true;
    const t = setTimeout(() => onTimeoutRef.current(), 400);
    return () => clearTimeout(t);
  }, [remaining]);

  return null;
}

const slideVariants = {
  initial: {
    scale: 0.92,
    opacity: 0,
    rotateX: 25,
  },
  visible: {
    scale: 1,
    rotateX: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.645, 0.045, 0.355, 1.0] as const,
    },
  },
  upExit: {
    opacity: 0,
    y: '-40%',
    transition: {
      duration: 0.35,
    },
  },
};

export function InterviewScreen({
  questions,
  secondsPerQuestion,
  theme,
  onToggleTheme,
  onFinish,
  onExit,
}: InterviewScreenProps) {
  const [index, setIndex] = useState(0);
  const [remaining, setRemaining] = useState(secondsPerQuestion);
  const [elapsed, setElapsed] = useState(0);
  const usedTimesRef = useRef<number[]>([]);

  useEffect(() => {
    const id = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const advance = (manual: boolean) => {
    const used = manual
      ? Math.min(secondsPerQuestion - remaining, secondsPerQuestion)
      : secondsPerQuestion;
    usedTimesRef.current = [...usedTimesRef.current, used];
    if (index < questions.length - 1) {
      setIndex(index + 1);
      setRemaining(secondsPerQuestion);
    } else {
      onFinish(usedTimesRef.current);
    }
  };

  const goBack = () => {
    if (index === 0) return;
    setIndex(index - 1);
    setRemaining(secondsPerQuestion);
  };

  const question = questions[index];
  const words = question.split(' ').map((text) => ({ text }));

  const pct = remaining / secondsPerQuestion;
  const timerColor =
    pct > 0.5
      ? 'text-emerald-600 dark:text-emerald-400'
      : pct > 0.15
        ? 'text-amber-500 dark:text-amber-400'
        : 'text-red-600 dark:text-red-500';
  const barColor =
    pct > 0.5
      ? 'bg-emerald-500'
      : pct > 0.15
        ? 'bg-amber-500'
        : 'bg-red-500';
  const alertPulse = pct <= 0.15;

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-neutral-50 dark:bg-neutral-950">
      <BackgroundBeams className="opacity-25 dark:opacity-60" />

      <QuestionTimer
        key={index}
        seconds={secondsPerQuestion}
        onTimeout={() => advance(false)}
        onTick={(r) => setRemaining(r)}
      />

      <header className="relative z-10 flex w-full items-center justify-between px-6 py-5 md:px-10">
        <div className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
          Pregunta{' '}
          <span className="text-lg font-bold text-neutral-900 dark:text-white">
            {index + 1}
          </span>{' '}
          <span className="text-neutral-400 dark:text-neutral-600">
            / {questions.length}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden text-sm text-neutral-500 dark:text-neutral-500 sm:block">
            Tiempo total:{' '}
            <span className="font-semibold text-neutral-700 dark:text-neutral-300">
              {formatTime(elapsed)}
            </span>
          </div>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <button
            type="button"
            onClick={onExit}
            className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs text-neutral-500 transition-colors hover:border-red-400 hover:text-red-600 dark:border-neutral-800 dark:text-neutral-400 dark:hover:border-red-800 dark:hover:text-red-400"
          >
            Salir
          </button>
        </div>
      </header>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center gap-10 px-6 pb-24">
        <div className="flex flex-col items-center gap-3">
          <AnimatedDigits
            value={formatTime(remaining)}
            className={`text-7xl tracking-tight md:text-8xl ${timerColor} ${
              alertPulse ? 'animate-pulse' : ''
            }`}
          />
          <div className="h-2 w-72 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800 md:w-96">
            <div
              className={`h-full rounded-full transition-all duration-1000 ease-linear ${barColor}`}
              style={{ width: `${pct * 100}%` }}
            />
          </div>
          <span className="text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
            Tiempo para responder
          </span>
        </div>

        <div
          className="w-full max-w-3xl"
          style={{ perspective: '1000px' }}
        >
          <AnimatePresence mode="popLayout">
            <motion.div
              key={`question-${index}`}
              initial="initial"
              animate="visible"
              exit="upExit"
              variants={slideVariants}
              className="rounded-3xl border border-neutral-200 bg-white/85 px-6 py-10 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/70 dark:shadow-none md:px-12"
            >
              <TypewriterEffect
                words={words}
                className="text-xl font-bold md:text-3xl"
                cursorClassName="bg-emerald-500"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={goBack}
            disabled={index === 0}
            className="rounded-xl border border-neutral-300 px-6 py-3 text-sm font-semibold text-neutral-600 transition-colors hover:border-neutral-500 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-30 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-neutral-500 dark:hover:text-white"
          >
            ← Anterior
          </button>
          <button
            type="button"
            onClick={() => advance(true)}
            className="rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 px-8 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:from-emerald-500 hover:to-green-400"
          >
            {index === questions.length - 1 ? 'Finalizar' : 'Siguiente →'}
          </button>
        </div>
      </main>
    </div>
  );
}
