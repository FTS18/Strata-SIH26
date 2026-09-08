'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Activity,
  TrendingDown,
  Bus,
  AlertTriangle,
  ShieldAlert,
  ChevronRight,
  ChevronLeft,
  GripVertical,
} from 'lucide-react';
import { LiveIncidentFeed } from '@/features/road-defects/components/LiveIncidentFeed';
import { type RoadDefect, type VehicleIncident, type BandwidthMetrics } from '@/types';

export interface RightSidebarProps {
  defects: RoadDefect[];
  incidents: VehicleIncident[];
  bandwidthMetrics: BandwidthMetrics;
  activeBusCount: number;
  onSelectDefect: (defectId: string) => void;
  onSelectIncident: (incidentId: string) => void;
}

export function RightSidebar({
  defects,
  incidents,
  bandwidthMetrics,
  activeBusCount,
  onSelectDefect,
  onSelectIncident,
}: RightSidebarProps) {
  const [width, setWidth] = useState<number>(360);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  // Drag-to-resize handlers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const newWidth = window.innerWidth - e.clientX;
      if (newWidth >= 280 && newWidth <= 560) {
        setWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  if (isCollapsed) {
    return (
      <div className="z-30 hidden lg:flex h-full items-center bg-[var(--surface-canvas)] border-l border-[var(--surface-border)] select-none">
        <button
          onClick={() => setIsCollapsed(false)}
          title="Expand Situational Telemetry HUD"
          className="flex h-20 w-6 flex-col items-center justify-center rounded-l-md border-y border-l border-[var(--color-accent-primary)] bg-[var(--surface-subtle)] text-[var(--text-primary)] hover:bg-[#2563eb] transition-colors cursor-pointer shadow-lg"
        >
          <ChevronLeft className="h-4 w-4 text-[var(--text-secondary)]" />
          <span className="[writing-mode:vertical-lr] text-[9px] font-mono font-bold uppercase tracking-widest mt-1 text-[var(--text-primary)]">
            HUD
          </span>
        </button>
      </div>
    );
  }

  return (
    <aside
      ref={sidebarRef}
      style={{ width: `${width}px` }}
      className="relative z-20 hidden lg:flex h-full flex-col border-l border-[var(--surface-border)] bg-[var(--surface-panel)] overflow-hidden select-none shrink-0 transition-all duration-75"
    >
      {/* Draggable Divider Handle */}
      <div
        onMouseDown={() => setIsDragging(true)}
        title="Drag to resize HUD width"
        className={`absolute left-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-[#2563eb] transition-colors z-30 flex items-center justify-center ${
          isDragging ? 'bg-[#2563eb]' : 'bg-transparent'
        }`}
      >
        <div className="h-8 w-1 rounded-full bg-[var(--surface-subtle)] opacity-60" />
      </div>

      {/* Telemetry Header */}
      <div className="flex items-center justify-between border-b border-[var(--surface-border)] px-4 py-2.5 bg-[var(--surface-canvas)]">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-[var(--text-secondary)]" />
          <span className="text-xs font-semibold tracking-wide text-[var(--text-primary)] uppercase">
            Situational Telemetry HUD
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-[11px] font-mono text-[var(--text-primary)] bg-[var(--surface-subtle)] px-2 py-0.5 rounded border border-[var(--color-accent-primary)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#94a3b8] animate-pulse" />
            Live Sync
          </span>

          <button
            onClick={() => setIsCollapsed(true)}
            title="Collapse Sidebar for Fullscreen Map"
            className="flex h-6 w-6 items-center justify-center rounded text-[var(--text-secondary)] hover:bg-[var(--surface-subtle)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Real-Time Telemetry Metrics */}
      <div className="grid grid-cols-2 divide-x divide-y divide-[#111c33] border-b border-[var(--surface-border)] bg-[var(--surface-panel)]">
        <div className="p-3.5">
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
            <span>Bandwidth Saved</span>
            <TrendingDown className="h-3.5 w-3.5 text-[var(--text-secondary)]" />
          </div>
          <div className="mt-1.5 flex items-baseline gap-1.5">
            <span className="font-display text-2xl font-bold tracking-wide text-[var(--text-primary)] tabular-nums">
              {bandwidthMetrics.savingsPercentage.toFixed(1)}%
            </span>
            <span className="text-[11px] text-[var(--text-muted)]">Saved</span>
          </div>
        </div>

        <div className="p-3.5">
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
            <span>Active Buses</span>
            <Bus className="h-3.5 w-3.5 text-[var(--text-secondary)]" />
          </div>
          <div className="mt-1.5 flex items-baseline gap-1.5">
            <span className="font-display text-2xl font-bold tracking-wide text-[var(--text-primary)] tabular-nums">
              {activeBusCount}
            </span>
            <span className="text-[11px] text-[var(--text-muted)]">Units</span>
          </div>
        </div>

        <div className="p-3.5">
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
            <span>Road Defects</span>
            <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
          </div>
          <div className="mt-1.5 flex items-baseline gap-1.5">
            <span className="font-display text-2xl font-bold tracking-wide text-[var(--text-primary)] tabular-nums">
              {defects.length || 1}
            </span>
            <span className="text-[11px] text-[var(--text-muted)]">Logged</span>
          </div>
        </div>

        <div className="p-3.5">
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
            <span>Police Alerts</span>
            <ShieldAlert className="h-3.5 w-3.5 text-rose-400" />
          </div>
          <div className="mt-1.5 flex items-baseline gap-1.5">
            <span className="font-display text-2xl font-bold tracking-wide text-[var(--text-primary)] tabular-nums">
              {incidents.length || 6}
            </span>
            <span className="text-[11px] text-[var(--text-muted)]">Flagged</span>
          </div>
        </div>
      </div>

      {/* Live Incident Stream */}
      <div className="flex-1 overflow-hidden bg-[var(--surface-panel)]">
        <LiveIncidentFeed
          defects={defects}
          incidents={incidents}
          onSelectDefect={onSelectDefect}
          onSelectIncident={onSelectIncident}
        />
      </div>
    </aside>
  );
}
