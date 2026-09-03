import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'good' | 'warning' | 'critical' | 'transit' | 'neutral';
  size?: 'sm' | 'md';
  children: React.ReactNode;
}

export function Badge({
  variant = 'neutral',
  size = 'md',
  className,
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    good: 'bg-(--status-good-bg) text-(--status-good-text) border-(--status-good-border)',
    warning: 'bg-(--status-warning-bg) text-(--status-warning-text) border-(--status-warning-border)',
    critical: 'bg-(--status-critical-bg) text-(--status-critical-text) border-(--status-critical-border)',
    transit: 'bg-(--status-transit-bg) text-(--status-transit-text) border-(--status-transit-border)',
    neutral: 'bg-(--surface-subtle) text-(--text-secondary) border-(--surface-border)',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-medium',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border leading-none transition-colors select-none font-mono',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
