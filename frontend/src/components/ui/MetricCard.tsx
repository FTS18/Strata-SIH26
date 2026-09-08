import React from 'react';
import { cn } from '@/lib/utils';

export interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  caption?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function MetricCard({
  label,
  value,
  unit,
  change,
  changeType = 'neutral',
  caption,
  icon,
  className,
}: MetricCardProps) {
  const changeColors = {
    positive: 'text-[var(--text-secondary)] bg-[var(--surface-subtle)] border-[var(--color-accent-primary)]',
    negative: 'text-rose-400 bg-rose-950/40 border-rose-800/40',
    neutral: 'text-[var(--text-secondary)] bg-[var(--surface-panel)] border-[var(--surface-border)]',
  };

  return (
    <div
      className={cn(
        'flex flex-col justify-between rounded-lg border border-[var(--surface-border)] bg-[var(--surface-panel)] p-4 shadow-sm transition-all',
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-[var(--text-secondary)]">{label}</span>
        {icon && <div className="text-[var(--text-secondary)]">{icon}</div>}
      </div>

      <div className="mt-2.5 flex items-baseline justify-between gap-2">
        <div className="flex items-baseline gap-1.5">
          <span className="font-display text-2xl font-bold tracking-wide text-[var(--text-primary)] tabular-nums">
            {value}
          </span>
          {unit && <span className="text-xs font-mono text-[var(--text-secondary)]">{unit}</span>}
        </div>

        {change && (
          <span
            className={cn(
              'inline-flex items-center rounded border px-2 py-0.5 text-[11px] font-mono font-medium',
              changeColors[changeType]
            )}
          >
            {change}
          </span>
        )}
      </div>

      {caption && (
        <p className="mt-1.5 text-xs text-[var(--text-muted)] leading-tight font-mono">{caption}</p>
      )}
    </div>
  );
}
