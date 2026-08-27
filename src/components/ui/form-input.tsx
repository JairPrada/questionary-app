import { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export const LabelInputContainer = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn('flex w-full flex-col space-y-2', className)}>
      {children}
    </div>
  );
};

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-0 transition-opacity duration-300 group-focus-within/container:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-0 blur-sm transition-opacity duration-300 group-focus-within/container:opacity-100" />
    </>
  );
};

export const Label = ({
  htmlFor,
  children,
  className,
}: {
  htmlFor: string;
  children: ReactNode;
  className?: string;
}) => {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        'text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400',
        className
      )}
    >
      {children}
    </label>
  );
};

export const Input = ({
  className,
  suffix,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { suffix?: string }) => {
  return (
    <div className="group/container relative w-full">
      <input
        {...props}
        className={cn(
          'flex h-11 w-full rounded-t-md border-b border-neutral-300 bg-transparent px-3 py-2 text-sm font-medium text-neutral-900 outline-none placeholder:text-neutral-400 focus-visible:outline-none dark:border-neutral-700 dark:text-white dark:placeholder:text-neutral-600',
          suffix && 'pr-20',
          className
        )}
      />
      {suffix && (
        <span className="pointer-events-none absolute bottom-0 right-3 flex h-11 items-center text-xs font-medium text-neutral-400 dark:text-neutral-500">
          {suffix}
        </span>
      )}
      <BottomGradient />
    </div>
  );
};

export const Textarea = ({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) => {
  return (
    <div className="group/container relative w-full">
      <textarea
        {...props}
        className={cn(
          'flex min-h-36 w-full resize-y rounded-t-md border-b border-neutral-300 bg-transparent px-3 py-2 text-sm leading-6 text-neutral-900 outline-none placeholder:text-neutral-400 focus-visible:outline-none dark:border-neutral-700 dark:text-white dark:placeholder:text-neutral-600',
          className
        )}
      />
      <BottomGradient />
    </div>
  );
};
