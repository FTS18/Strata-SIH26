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
    <div className="flex flex-col rounded-xl border border-[#12544F] bg-[#0d3137] p-3.5 shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#12544F]/80 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <Cpu className="h-3.5 w-3.5 text-[#8BBB92]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#f0fdf4] font-mono">
            Model Performance
          </span>
        </div>
        <button
          type="button"
          className="flex items-center gap-1 text-[11px] font-mono text-[#8BBB92] hover:text-[#00e5bf] transition-colors cursor-pointer"
        >
          <span>View Details</span>
          <ArrowUpRight className="h-3 w-3" />
        </button>
      </div>

      {/* Progress Bars */}
      <div className="flex flex-col space-y-2.5">
        {METRICS.map((metric) => (
          <div key={metric.label} className="flex items-center gap-3">
            <span className="w-28 shrink-0 text-[11px] font-mono text-[#8BBB92] truncate">
              {metric.label}
            </span>

            {/* Bar */}
            <div className="relative flex-1 h-2 rounded-full bg-[#092328] border border-[#12544F]/60 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#2A835F] to-[#00e5bf] transition-all duration-500 shadow-[0_0_8px_rgba(0,229,191,0.25)]"
                style={{ width: `${metric.value}%` }}
              />
            </div>

            {/* Percentage Value */}
            <span className="w-11 text-right text-[11px] font-mono font-bold text-[#f0fdf4] tabular-nums">
              {metric.value.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
