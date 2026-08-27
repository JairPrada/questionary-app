import { AnimatePresence, motion } from 'motion/react';
import { cn } from '@/lib/utils';

export function AnimatedDigits({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-center font-bold tabular-nums',
        className
      )}
      aria-label={value}
    >
      {value.split('').map((char, i) => (
        <div
          key={`slot-${i}`}
          className="relative flex w-[1ch] items-center justify-center overflow-hidden"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={`${i}-${char}`}
              initial={{ y: '80%', opacity: 0, filter: 'blur(4px)' }}
              animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
              exit={{ y: '-80%', opacity: 0, filter: 'blur(4px)' }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="inline-block"
            >
              {char}
            </motion.span>
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
