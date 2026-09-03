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
      <div className="z-30 hidden lg:flex h-full items-center bg-[#092328] border-l border-[#12544F] select-none">
        <button
          onClick={() => setIsCollapsed(false)}
          title="Expand Situational Telemetry HUD"
          className="flex h-20 w-6 flex-col items-center justify-center rounded-l-md border-y border-l border-[#2A835F] bg-[#12544F] text-[#f0fdf4] hover:bg-[#2A835F] transition-colors cursor-pointer shadow-lg"
        >
          <ChevronLeft className="h-4 w-4 text-[#8BBB92]" />
          <span className="[writing-mode:vertical-lr] text-[9px] font-mono font-bold uppercase tracking-widest mt-1 text-[#f0fdf4]">
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
      className="relative z-20 hidden lg:flex h-full flex-col border-l border-[#12544F] bg-[#0d3137] overflow-hidden select-none shrink-0 transition-all duration-75"
    >
      {/* Draggable Divider Handle */}
      <div
        onMouseDown={() => setIsDragging(true)}
        title="Drag to resize HUD width"
        className={`absolute left-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-[#2A835F] transition-colors z-30 flex items-center justify-center ${
          isDragging ? 'bg-[#2A835F]' : 'bg-transparent'
        }`}
      >
        <div className="h-8 w-1 rounded-full bg-[#12544F] opacity-60" />
      </div>

      {/* Telemetry Header */}
      <div className="flex items-center justify-between border-b border-[#12544F] px-4 py-2.5 bg-[#092328]">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-[#8BBB92]" />
          <span className="text-xs font-semibold tracking-wide text-[#f0fdf4] uppercase">
            Situational Telemetry HUD
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-[11px] font-mono text-[#f0fdf4] bg-[#12544F] px-2 py-0.5 rounded border border-[#2A835F]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#8BBB92] animate-pulse" />
            Live Sync
          </span>

          <button
            onClick={() => setIsCollapsed(true)}
            title="Collapse Sidebar for Fullscreen Map"
            className="flex h-6 w-6 items-center justify-center rounded text-[#8BBB92] hover:bg-[#12544F] hover:text-[#f0fdf4] transition-colors cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Real-Time Telemetry Metrics */}
      <div className="grid grid-cols-2 divide-x divide-y divide-[#12544F] border-b border-[#12544F] bg-[#0d3137]">
        <div className="p-3.5">
          <div className="flex items-center justify-between text-xs text-[#8BBB92]">
            <span>Bandwidth Saved</span>
            <TrendingDown className="h-3.5 w-3.5 text-[#8BBB92]" />
          </div>
          <div className="mt-1.5 flex items-baseline gap-1.5">
            <span className="font-display text-2xl font-bold tracking-wide text-[#f0fdf4] tabular-nums">
              {bandwidthMetrics.savingsPercentage.toFixed(1)}%
            </span>
            <span className="text-[11px] text-[#5b9076]">Saved</span>
          </div>
        </div>

        <div className="p-3.5">
          <div className="flex items-center justify-between text-xs text-[#8BBB92]">
            <span>Active Buses</span>
            <Bus className="h-3.5 w-3.5 text-[#8BBB92]" />
          </div>
          <div className="mt-1.5 flex items-baseline gap-1.5">
            <span className="font-display text-2xl font-bold tracking-wide text-[#f0fdf4] tabular-nums">
              {activeBusCount}
            </span>
            <span className="text-[11px] text-[#5b9076]">Units</span>
          </div>
        </div>

        <div className="p-3.5">
          <div className="flex items-center justify-between text-xs text-[#8BBB92]">
            <span>Road Defects</span>
            <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
          </div>
          <div className="mt-1.5 flex items-baseline gap-1.5">
            <span className="font-display text-2xl font-bold tracking-wide text-[#f0fdf4] tabular-nums">
              {defects.length || 1}
            </span>
            <span className="text-[11px] text-[#5b9076]">Logged</span>
          </div>
        </div>

        <div className="p-3.5">
          <div className="flex items-center justify-between text-xs text-[#8BBB92]">
            <span>Police Alerts</span>
            <ShieldAlert className="h-3.5 w-3.5 text-rose-400" />
          </div>
          <div className="mt-1.5 flex items-baseline gap-1.5">
            <span className="font-display text-2xl font-bold tracking-wide text-[#f0fdf4] tabular-nums">
              {incidents.length || 6}
            </span>
            <span className="text-[11px] text-[#5b9076]">Flagged</span>
          </div>
        </div>
      </div>

      {/* Live Incident Stream */}
      <div className="flex-1 overflow-hidden bg-[#0d3137]">
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
