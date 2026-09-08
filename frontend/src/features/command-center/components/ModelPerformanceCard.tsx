'use client';

import React from 'react';
import { ArrowUpRight, Cpu } from 'lucide-react';

interface MetricItem {
  label: string;
  value: number;
}

const METRICS: MetricItem[] = [
  { label: 'Object Detection', value: 98.7 },
  { label: 'ANPR Accuracy', value: 96.3 },
  { label: 'Traffic Flow', value: 94.8 },
  { label: 'Road Damage', value: 91.2 },
  { label: 'Speed Estimation', value: 89.6 },
];

export function ModelPerformanceCard() {
  return (
    <div className="flex flex-col rounded-xl border border-[var(--surface-border)] bg-[var(--surface-panel)] p-3.5 shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--surface-border)]/80 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <Cpu className="h-3.5 w-3.5 text-[var(--text-secondary)]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] font-mono">
            Model Performance
          </span>
        </div>
        <button
          type="button"
          className="flex items-center gap-1 text-[11px] font-mono text-[var(--text-secondary)] hover:text-[#00e5bf] transition-colors cursor-pointer"
        >
          <span>View Details</span>
          <ArrowUpRight className="h-3 w-3" />
        </button>
      </div>

      {/* Progress Bars */}
      <div className="flex flex-col space-y-2.5">
        {METRICS.map((metric) => (
          <div key={metric.label} className="flex items-center gap-3">
            <span className="w-28 shrink-0 text-[11px] font-mono text-[var(--text-secondary)] truncate">
              {metric.label}
            </span>

            {/* Bar */}
            <div className="relative flex-1 h-2 rounded-full bg-[var(--surface-canvas)] border border-[var(--surface-border)] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#2dd4bf] transition-all duration-500 shadow-[0_0_8px_rgba(45,212,191,0.25)]"
                style={{ width: `${metric.value}%` }}
              />
            </div>

            {/* Percentage Value */}
            <span className="w-11 text-right text-[11px] font-mono font-bold text-[var(--text-primary)] tabular-nums">
              {metric.value.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
