'use client';
import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}: HTMLAttributes<HTMLDivElement> & { showRadialGradient?: boolean }) => {
  return (
    <div
      className={cn(
        'relative flex min-h-screen w-full flex-col overflow-hidden',
        className
      )}
      {...props}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className={cn(
            'animate-aurora absolute -inset-[10px] opacity-60 blur-[10px] will-change-transform',
            `[--aurora-light:repeating-linear-gradient(100deg,var(--aurora-stripe)_0%,var(--aurora-stripe)_7%,transparent_10%,transparent_12%,var(--aurora-stripe)_16%)]`,
            `[--aurora-glow:repeating-linear-gradient(100deg,var(--aurora-c1)_10%,var(--aurora-c2)_15%,var(--aurora-c3)_20%,var(--aurora-c4)_25%,var(--aurora-c5)_30%)]`,
            '[background-image:var(--aurora-light),var(--aurora-glow)]',
            '[background-size:300%,200%]',
            '[background-position:50%_50%,50%_50%]',
            showRadialGradient &&
              '[mask-image:radial-gradient(ellipse_at_50%_0%,black_30%,transparent_78%)]'
          )}
        />
      </div>
      {children}
    </div>
  );
};
