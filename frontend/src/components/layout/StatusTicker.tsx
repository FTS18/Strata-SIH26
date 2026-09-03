'use client';

import React from 'react';
import { Cpu, AlertTriangle, ShieldCheck, Flame, Wifi } from 'lucide-react';
import { type BandwidthMetrics } from '@/types';

export interface StatusTickerProps {
  metrics: BandwidthMetrics;
  avgFps: number;
  totalPotholes: number;
  activeIncidents: number;
  autoVerifiedRepairs?: number;
}

export function StatusTicker({
  metrics,
  avgFps,
  totalPotholes,
  activeIncidents,
  autoVerifiedRepairs = 42,
}: StatusTickerProps) {
  return (
    <footer className="flex h-7 w-full items-center justify-between border-t border-[#12544F] bg-[#092328] px-3 sm:px-4 text-[11px] font-mono text-[#8BBB92] select-none z-10 shrink-0 overflow-x-auto whitespace-nowrap scrollbar-none">
      {/* Left Metrics */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        <div className="flex items-center gap-1.5">
          <Wifi className="h-3 w-3 text-[#8BBB92]" />
          <span>Bandwidth Saved:</span>
          <strong className="text-[#f0fdf4] tabular-nums">
            {metrics.savingsPercentage.toFixed(2)}%
          </strong>
        </div>

        <div className="hidden sm:flex items-center gap-1.5">
          <Cpu className="h-3 w-3 text-[#8BBB92]" />
          <span>Edge Compute:</span>
          <strong className="text-[#f0fdf4] tabular-nums">
            {avgFps.toFixed(1)} FPS
          </strong>
        </div>
      </div>

      {/* Right Incident Counters */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0 pl-3">
        <div className="flex items-center gap-1.5">
          <AlertTriangle className="h-3 w-3 text-amber-400" />
          <span>Active Defects:</span>
          <strong className="text-[#f0fdf4] tabular-nums">{totalPotholes}</strong>
        </div>

        <div className="hidden md:flex items-center gap-1.5">
          <ShieldCheck className="h-3 w-3 text-[#8BBB92]" />
          <span>Self-Audited:</span>
          <strong className="text-[#f0fdf4] tabular-nums">{autoVerifiedRepairs}</strong>
        </div>

        <div className="flex items-center gap-1.5">
          <Flame className="h-3 w-3 text-rose-400" />
          <span>Police Alerts:</span>
          <strong className="text-[#f0fdf4] tabular-nums">{activeIncidents}</strong>
        </div>
      </div>
    </footer>
  );
}
