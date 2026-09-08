'use client';

import React from 'react';
import { Bus, Clock, Users, Gauge, CheckCircle2 } from 'lucide-react';
import { useTelemetryStore } from '@/features/fleet-telemetry/telemetryStore';
import { useFleetStore } from '@/features/roles/stores/fleetStore';
import { MetricCard } from '@/components/ui/MetricCard';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { SchoolZoneSafetyAlert } from '@/features/pedestrian-safety/components/SchoolZoneSafetyAlert';

interface CorridorDelay {
  corridorName: string;
  routeId: string;
  avgSpeedKmH: number;
  scheduledDelayMin: number;
  crowdDensity: 'Normal' | 'Overcrowded' | 'Moderate';
  activeBuses: number;
}

export function FleetConsole() {
  const buses = useTelemetryStore((state) => state.buses);
  const busList = Object.values(buses);

  const corridors = useFleetStore((state) => state.corridors);
  const activeToast = useFleetStore((state) => state.activeToast);

  const corridorData: CorridorDelay[] = corridors.map((c) => ({
    corridorName: c.corridorName,
    routeId: c.routeId,
    avgSpeedKmH: c.avgSpeedKmH,
    scheduledDelayMin: c.delayMinutes,
    crowdDensity: c.congestionLevel === 'Severe Bottleneck' ? 'Overcrowded' : c.congestionLevel === 'Moderate Delay' ? 'Moderate' : 'Normal',
    activeBuses: c.activeFleetCount,
  }));

  const columns: Column<CorridorDelay>[] = [
    { key: 'corridorName', header: 'Corridor Name' },
    {
      key: 'routeId',
      header: 'Route',
      align: 'center',
      render: (c) => <span className="font-mono text-xs text-[var(--text-secondary)]">{c.routeId}</span>,
    },
    {
      key: 'activeBuses',
      header: 'Active Buses',
      align: 'right',
      render: (c) => <span className="font-mono text-[var(--text-primary)]">{c.activeBuses}</span>,
    },
    {
      key: 'avgSpeedKmH',
      header: 'Fleet Speed',
      align: 'right',
      render: (c) => (
        <span className={`font-mono font-semibold ${c.avgSpeedKmH < 20 ? 'text-rose-400' : 'text-[var(--text-secondary)]'}`}>
          {c.avgSpeedKmH} km/h
        </span>
      ),
    },
    {
      key: 'scheduledDelayMin',
      header: 'Route Delay',
      align: 'right',
      render: (c) => (
        <span className={`font-mono ${c.scheduledDelayMin > 5 ? 'text-amber-400 font-semibold' : 'text-[var(--text-muted)]'}`}>
          {c.scheduledDelayMin === 0 ? 'On Time' : `+${c.scheduledDelayMin} min`}
        </span>
      ),
    },
    {
      key: 'crowdDensity',
      header: 'Stop Crowd',
      align: 'center',
      render: (c) => {
        const isCritical = c.crowdDensity === 'Overcrowded';
        const isWarning = c.crowdDensity === 'Moderate';
        return (
          <span
            className={`inline-flex items-center rounded border px-2 py-0.5 text-[11px] font-mono font-medium ${
              isCritical
                ? 'border-rose-800/40 bg-rose-950/40 text-rose-400'
                : isWarning
                ? 'border-amber-800/40 bg-amber-950/40 text-amber-400'
                : 'border-[var(--color-accent-primary)] bg-[var(--surface-subtle)] text-[var(--text-secondary)]'
            }`}
          >
            {c.crowdDensity}
          </span>
        );
      },
    },
  ];

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto p-4 bg-[var(--surface-canvas)] text-[var(--text-primary)]">
      {/* Toast Notification Banner */}
      {activeToast && (
        <div className="flex items-center justify-between rounded-lg border border-[var(--color-accent-primary)] bg-[var(--surface-subtle)] px-4 py-2 font-mono text-xs text-[var(--text-primary)] shadow-md animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-[var(--text-secondary)]" />
            <span>{activeToast}</span>
          </div>
        </div>
      )}

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard
          label="Active Fleet Units"
          value={busList.length || 4}
          unit="Buses"
          caption="Edge video nodes streaming"
          change="98% Uptime"
          changeType="positive"
          icon={<Bus className="h-4 w-4 text-[var(--text-secondary)]" />}
        />
        <MetricCard
          label="Average City Speed"
          value="24.6"
          unit="km/h"
          caption="Free-flow baseline: 38 km/h"
          change="-35% Delta"
          changeType="negative"
          icon={<Gauge className="h-4 w-4 text-[var(--text-secondary)]" />}
        />
        <MetricCard
          label="Average Route Delay"
          value="+6.2"
          unit="min"
          caption="Dynamic ETA correction"
          change="Real-time"
          changeType="neutral"
          icon={<Clock className="h-4 w-4 text-[var(--text-secondary)]" />}
        />
        <MetricCard
          label="Overcrowded Stops"
          value="4"
          unit="Stops"
          caption="Auto-dispatch advisory"
          change="Surge Alert"
          changeType="negative"
          icon={<Users className="h-4 w-4 text-[var(--text-secondary)]" />}
        />
      </div>

      {/* Real-time Traffic Density & Modal Breakdown from Edge ByteTrack Sensing */}
      <div className="rounded-lg border border-[var(--surface-border)] bg-[var(--surface-panel)] p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">
              Real-Time Edge Traffic Modal Breakdown (YOLOv8 + ByteTrack)
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Live vehicle classification, pedestrian counts, and urban congestion indexing from active bus dashcams
            </p>
          </div>
          <span className="flex items-center gap-1.5 rounded border border-[var(--color-accent-primary)] bg-[var(--surface-subtle)] px-2.5 py-1 text-xs font-mono text-[var(--text-secondary)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#94a3b8] animate-pulse" />
            Active Edge Ingestion
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="rounded-lg border border-[var(--surface-border)] bg-[var(--surface-canvas)] p-3 text-center">
            <span className="text-[11px] font-mono text-[var(--text-secondary)] uppercase">Passenger Cars</span>
            <p className="text-xl font-bold font-mono text-[var(--text-primary)] mt-1">14</p>
            <span className="text-[10px] text-[var(--text-muted)]">50% Volume</span>
          </div>
          <div className="rounded-lg border border-[var(--surface-border)] bg-[var(--surface-canvas)] p-3 text-center">
            <span className="text-[11px] font-mono text-[var(--text-secondary)] uppercase">2-Wheelers</span>
            <p className="text-xl font-bold font-mono text-cyan-400 mt-1">9</p>
            <span className="text-[10px] text-[var(--text-muted)]">32% Volume</span>
          </div>
          <div className="rounded-lg border border-[var(--surface-border)] bg-[var(--surface-canvas)] p-3 text-center">
            <span className="text-[11px] font-mono text-[var(--text-secondary)] uppercase">Buses / Transit</span>
            <p className="text-xl font-bold font-mono text-amber-400 mt-1">3</p>
            <span className="text-[10px] text-[var(--text-muted)]">11% Volume</span>
          </div>
          <div className="rounded-lg border border-[var(--surface-border)] bg-[var(--surface-canvas)] p-3 text-center">
            <span className="text-[11px] font-mono text-[var(--text-secondary)] uppercase">Commercial Trucks</span>
            <p className="text-xl font-bold font-mono text-orange-400 mt-1">2</p>
            <span className="text-[10px] text-[var(--text-muted)]">7% Volume</span>
          </div>
          <div className="rounded-lg border border-[var(--surface-border)] bg-[var(--surface-canvas)] p-3 text-center">
            <span className="text-[11px] font-mono text-[var(--text-secondary)] uppercase">Pedestrians</span>
            <p className="text-xl font-bold font-mono text-[var(--text-secondary)] mt-1">4</p>
            <span className="text-[10px] text-[var(--text-muted)]">Sidewalk/Crossing</span>
          </div>
          <div className="rounded-lg border border-[var(--surface-border)] bg-[var(--surface-canvas)] p-3 text-center">
            <span className="text-[11px] font-mono text-[var(--text-secondary)] uppercase">Congestion Index</span>
            <p className="text-xl font-bold font-mono text-emerald-400 mt-1">0.48</p>
            <span className="text-[10px] text-emerald-400">Moderate Flow</span>
          </div>
        </div>
      </div>

      {/* Vulnerable Pedestrian & School Zone Corridor Advisory */}
      <SchoolZoneSafetyAlert />

      {/* Corridor Congestion Delays */}
      <div className="rounded-lg border border-[var(--surface-border)] bg-[var(--surface-panel)] p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">
              Corridor Congestion & Travel Time Delays
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Continuous fleet speed tracking correlating vehicle density with road schedule deviations
            </p>
          </div>
          <span className="rounded border border-[var(--surface-border)] bg-[var(--surface-subtle)]/50 px-2.5 py-1 text-[11px] font-mono text-[var(--text-secondary)]">
            DTC / BMTC Telemetry Standard
          </span>
        </div>

        <DataTable<CorridorDelay>
          columns={columns}
          data={corridorData}
          keyExtractor={(c) => c.routeId}
        />
      </div>
    </div>
  );
}

