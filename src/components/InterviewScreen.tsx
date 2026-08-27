import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { AuroraBackground } from './ui/aurora-background';
import { TypewriterEffect } from './ui/typewriter-effect';
import { Button } from './ui/button';
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
    scale: 0.94,
    opacity: 0,
    rotateX: 20,
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
    y: '-30%',
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
  const usedTimesRef = useRef<number[]>([]);

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
  const isLast = index === questions.length - 1;

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
    <AuroraBackground className="bg-background text-foreground">
      <QuestionTimer
        key={index}
        seconds={secondsPerQuestion}
        onTimeout={() => advance(false)}
        onTick={(r) => setRemaining(r)}
      />

      <header className="relative z-10 flex w-full items-center justify-between px-6 py-5 md:px-10">
        <div className="text-sm font-medium text-muted-foreground">
          Pregunta{' '}
          <span className="text-lg font-bold text-foreground">
            {index + 1}
          </span>{' '}
          <span className="text-muted-foreground/60">/ {questions.length}</span>
        </div>
        <div className="flex items-center gap-3 md:gap-4">
          <div className="flex flex-col items-end gap-1">
            <AnimatedDigits
              value={formatTime(remaining)}
              className={`text-2xl tracking-tight md:text-3xl ${timerColor} ${
                alertPulse ? 'animate-pulse' : ''
              }`}
            />
            <div className="h-1 w-24 overflow-hidden rounded-full bg-muted md:w-32">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-linear ${barColor}`}
                style={{ width: `${pct * 100}%` }}
              />
            </div>
          </div>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onExit}
            className="text-muted-foreground hover:text-destructive"
          >
            Salir
          </Button>
        </div>
      </header>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-24 pb-16 md:px-32">
        <div
          className="w-full max-w-4xl text-center"
          style={{ perspective: '1000px' }}
        >
          <AnimatePresence mode="popLayout">
            <motion.div
              key={`question-${index}`}
              initial="initial"
              animate="visible"
              exit="upExit"
              variants={slideVariants}
              className="px-4 py-6"
            >
              <TypewriterEffect
                words={words}
                className="text-2xl font-bold sm:text-4xl md:text-5xl"
                cursorClassName="bg-emerald-500"
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <div className="absolute inset-y-0 left-0 z-10 flex items-center px-3 md:px-8">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={goBack}
          disabled={index === 0}
          aria-label="Pregunta anterior"
          title="Pregunta anterior"
          className="h-14 w-14 rounded-full shadow-sm [&_svg]:size-6 md:h-16 md:w-16"
        >
          <ChevronLeft />
        </Button>
      </div>

      <div className="absolute inset-y-0 right-0 z-10 flex items-center px-3 md:px-8">
        <Button
          type="button"
          size="icon"
          onClick={() => advance(true)}
          aria-label={isLast ? 'Finalizar entrevista' : 'Siguiente pregunta'}
          title={isLast ? 'Finalizar entrevista' : 'Siguiente pregunta'}
          className="h-14 w-14 rounded-full shadow-sm [&_svg]:size-6 md:h-16 md:w-16"
        >
          {isLast ? <Check /> : <ChevronRight />}
        </Button>
      </div>
    </AuroraBackground>
  );
}
