import React from 'react';
import { cn } from '@/lib/utils';

export interface SegmentOption<T extends string = string> {
  id: T;
  label: string;
  badge?: string | number;
  icon?: React.ReactNode;
}

export interface SegmentedControlProps<T extends string = string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  size?: 'sm' | 'md';
  className?: string;
}

export function SegmentedControl<T extends string = string>({
  options,
  value,
  onChange,
  size = 'md',
  className,
}: SegmentedControlProps<T>) {
  const containerPadding = size === 'sm' ? 'p-0.5' : 'p-1';
  const itemPadding = size === 'sm' ? 'px-2 py-1 text-[11px]' : 'px-3 py-1.5 text-xs';

  return (
    <div
      role="tablist"
      className={cn(
        'inline-flex items-center rounded-[var(--radius-lg)] bg-[var(--surface-subtle)] border border-[var(--surface-border)] select-none',
        containerPadding,
        className
      )}
    >
      {options.map((option) => {
        const isActive = option.id === value;
        return (
          <button
            key={option.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(option.id)}
            className={cn(
              'inline-flex items-center gap-1.5 font-medium rounded-[var(--radius-md)] transition-all duration-150 outline-none',
              itemPadding,
              isActive
                ? 'bg-[var(--surface-panel)] text-[var(--text-primary)] shadow-[var(--shadow-subtle)] font-semibold'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-active)]/50'
            )}
          >
            {option.icon}
            <span>{option.label}</span>
            {option.badge !== undefined && (
              <span
                className={cn(
                  'rounded-full px-1.5 py-0.2 text-[10px] tabular-nums font-mono',
                  isActive
                    ? 'bg-[var(--surface-subtle)] text-[var(--text-primary)]'
                    : 'bg-[var(--surface-active)] text-[var(--text-secondary)]'
                )}
              >
                {option.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
