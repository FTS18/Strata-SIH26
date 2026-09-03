import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, children, disabled, ...props }, ref) => {
    const variantStyles = {
      primary:
        'bg-(--text-primary) text-(--text-inverse) hover:opacity-90 border-transparent active:scale-[0.98]',
      secondary:
        'bg-(--surface-subtle) text-(--text-primary) hover:bg-(--surface-active) border-(--surface-border) active:scale-[0.98]',
      outline:
        'bg-transparent text-(--text-primary) hover:bg-(--surface-subtle) border-(--surface-border) active:scale-[0.98]',
      ghost:
        'bg-transparent text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--surface-subtle) border-transparent',
      danger:
        'bg-(--status-critical) text-white hover:opacity-90 border-transparent active:scale-[0.98]',
    };

    const sizeStyles = {
      sm: 'h-7 px-2.5 text-xs rounded-sm gap-1.5',
      md: 'h-8 px-3 text-xs font-medium rounded-md gap-2',
      lg: 'h-10 px-4 text-sm font-medium rounded-lg gap-2',
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          'inline-flex items-center justify-center border font-medium transition-all duration-150 outline-none select-none disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
