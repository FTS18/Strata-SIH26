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
    positive: 'text-[#8BBB92] bg-[#12544F] border-[#2A835F]',
    negative: 'text-rose-400 bg-rose-950/40 border-rose-800/40',
    neutral: 'text-[#8BBB92] bg-[#0d3137] border-[#12544F]',
  };

  return (
    <div
      className={cn(
        'flex flex-col justify-between rounded-lg border border-[#12544F] bg-[#0d3137] p-4 shadow-sm transition-all',
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-[#8BBB92]">{label}</span>
        {icon && <div className="text-[#8BBB92]">{icon}</div>}
      </div>

      <div className="mt-2.5 flex items-baseline justify-between gap-2">
        <div className="flex items-baseline gap-1.5">
          <span className="font-display text-2xl font-bold tracking-wide text-[#f0fdf4] tabular-nums">
            {value}
          </span>
          {unit && <span className="text-xs font-mono text-[#8BBB92]">{unit}</span>}
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
        <p className="mt-1.5 text-xs text-[#5b9076] leading-tight font-mono">{caption}</p>
      )}
    </div>
  );
}
