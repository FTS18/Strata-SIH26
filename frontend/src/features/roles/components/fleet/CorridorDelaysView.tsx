'use client';

import React from 'react';
import { Clock, Gauge, Bus, AlertCircle, RefreshCw, Compass, CheckCircle2, Plus } from 'lucide-react';
import { MetricCard } from '@/components/ui/MetricCard';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { useFleetStore, type CorridorDelayInfo } from '../../stores/fleetStore';

export function CorridorDelaysView() {
  const corridors = useFleetStore((s) => s.corridors);
  const selectedCorridorId = useFleetStore((s) => s.selectedCorridorId);
  const setSelectedCorridorId = useFleetStore((s) => s.setSelectedCorridorId);
  const transmitRerouteAdvisory = useFleetStore((s) => s.transmitRerouteAdvisory);
  const adjustFleetFrequency = useFleetStore((s) => s.adjustFleetFrequency);
  const activeToast = useFleetStore((s) => s.activeToast);

  const activeCorridor = corridors.find((c) => c.corridorId === selectedCorridorId) || corridors[0];

  const columns: Column<CorridorDelayInfo>[] = [
    { key: 'corridorName', header: 'Corridor Name' },
    {
      key: 'routeId',
      header: 'Assigned Routes',
      render: (c) => <span className="font-mono text-xs text-[var(--text-secondary)] font-semibold">{c.routeId}</span>,
    },
    {
      key: 'avgSpeedKmH',
      header: 'Current Speed',
      align: 'right',
      render: (c) => (
        <span className={`font-mono font-bold ${c.avgSpeedKmH < 20 ? 'text-rose-400' : 'text-[var(--text-secondary)]'}`}>
          {c.avgSpeedKmH} km/h
        </span>
      ),
    },
    {
      key: 'delayMinutes',
      header: 'Schedule Delay',
      align: 'right',
      render: (c) => (
        <span className={`font-mono font-bold ${c.delayMinutes > 10 ? 'text-rose-400' : c.delayMinutes > 0 ? 'text-amber-400' : 'text-[var(--text-secondary)]'}`}>
          {c.delayMinutes === 0 ? 'On Time' : `+${c.delayMinutes} min`}
        </span>
      ),
    },
    {
      key: 'activeFleetCount',
      header: 'Buses in Corridor',
      align: 'right',
      render: (c) => <span className="font-mono font-bold text-[var(--text-primary)]">{c.activeFleetCount}</span>,
    },
    {
      key: 'congestionLevel',
      header: 'Corridor State',
      align: 'center',
      render: (c) => {
        const isSevere = c.congestionLevel === 'Severe Bottleneck';
        const isModerate = c.congestionLevel === 'Moderate Delay';
        return (
          <span
            className={`inline-flex items-center rounded border px-2 py-0.5 text-[11px] font-mono font-medium ${
              isSevere
                ? 'border-rose-800/40 bg-rose-950/40 text-rose-400 font-bold'
                : isModerate
                ? 'border-amber-800/40 bg-amber-950/40 text-amber-400'
                : 'border-[var(--color-accent-primary)] bg-[var(--surface-subtle)] text-[var(--text-secondary)]'
            }`}
          >
            {c.congestionLevel}
          </span>
        );
      },
    },
  ];

  return (
    <div className="flex h-full w-full flex-col gap-3 sm:gap-4 overflow-y-auto p-3 sm:p-5 bg-[var(--surface-canvas)] text-[var(--text-primary)]">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5 shrink-0">
        <MetricCard
          label="Average City Fleet Speed"
          value="23.0"
          unit="km/h"
          caption="Free-flow speed: 45 km/h"
          change="-48% Delay"
          changeType="negative"
          icon={<Gauge className="h-4 w-4 text-rose-400" />}
        />
        <MetricCard
          label="Active Corridor Congestion Points"
          value="2"
          unit="Bottlenecks"
          caption="Delay exceeding 10 min threshold"
          change="Critical Delay"
          changeType="negative"
          icon={<AlertCircle className="h-4 w-4 text-rose-400" />}
        />
        <MetricCard
          label="On-Schedule Reliability Rate"
          value="78.4%"
          caption="Routes within +3 min headway"
          change="Below 85% SLA"
          changeType="neutral"
          icon={<Clock className="h-4 w-4 text-amber-400" />}
        />
        <MetricCard
          label="Total Monitored Corridor Length"
          value="142"
          unit="km"
          caption="Continuous public transport tracking"
          change="Full Coverage"
          changeType="positive"
          icon={<Bus className="h-4 w-4 text-[var(--text-secondary)]" />}
        />
      </div>

      {/* Main Full-Height Content Stack */}
      <div className="flex flex-1 flex-col gap-3 sm:gap-4">
        {/* Main Table Card */}
        <div className="w-full rounded-xl border border-[var(--surface-border)] bg-[var(--surface-panel)] p-3 sm:p-4 shadow-sm">
          <div className="mb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
            <div>
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                Corridor Travel-Time Index & Schedule Delay Deviations
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                Passive GPS telemetry correlated against published transport timetables across major arterial roads
              </p>
            </div>
            <span className="self-start sm:self-auto rounded border border-[var(--surface-border)] bg-[var(--surface-subtle)]/50 px-2.5 py-1 text-xs font-mono text-[var(--text-secondary)]">
              Real-Time Telematics
            </span>
          </div>

          <div className="w-full overflow-x-auto">
            <DataTable<CorridorDelayInfo>
              columns={columns}
              data={corridors}
              keyExtractor={(c) => c.corridorId}
              onRowClick={(c) => setSelectedCorridorId(c.corridorId)}
            />
          </div>
        </div>

        {/* Selected Corridor Optimization Strip */}
        {activeCorridor && (
          <div className="w-full rounded-xl border border-[var(--surface-border)] bg-[var(--surface-panel)] p-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--surface-subtle)] border border-[var(--color-accent-primary)] text-[var(--text-secondary)] shrink-0">
                <Compass className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-bold text-[var(--text-primary)]">
                    {activeCorridor.corridorName}
                  </span>
                  <span className="text-xs text-[var(--text-secondary)]">({activeCorridor.routeId})</span>
                  <span
                    className={`rounded border px-2 py-0.5 text-[10px] font-mono font-bold ${
                      activeCorridor.delayMinutes > 10
                        ? 'border-rose-800/40 bg-rose-950/40 text-rose-400'
                        : 'border-[var(--color-accent-primary)] bg-[var(--surface-subtle)] text-[var(--text-secondary)]'
                    }`}
                  >
                    {activeCorridor.delayMinutes === 0 ? 'On Schedule' : `Delay: +${activeCorridor.delayMinutes} min`}
                  </span>
                  {activeCorridor.rerouteActive && (
                    <span className="rounded border border-cyan-800/40 bg-cyan-950/40 px-2 py-0.5 text-[10px] font-mono text-cyan-300 font-bold">
                      Dynamic Reroute Active (-8 min)
                    </span>
                  )}
                </div>
                <p className="text-xs text-[var(--text-secondary)]">
                  Choke Point: <span className="text-[var(--text-primary)] font-medium">{activeCorridor.primaryChokePoint}</span> · Avg Velocity: <span className="text-rose-400 font-mono font-bold">{activeCorridor.avgSpeedKmH} km/h (Free Flow: {activeCorridor.freeFlowSpeedKmH})</span>
                </p>
                <p className="text-[11px] font-mono text-[var(--text-muted)]">
                  Advisory: <span className="text-[var(--text-secondary)]">{activeCorridor.recommendedReroute}</span> · Active Fleet: {activeCorridor.activeFleetCount} buses
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto pt-2 lg:pt-0">
              <Button
                variant="primary"
                size="sm"
                onClick={() => transmitRerouteAdvisory(activeCorridor.corridorId)}
                className="bg-[#94a3b8] text-[#080e1a] font-bold hover:bg-[#f8fafc] text-xs"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>
                  {activeCorridor.rerouteActive ? 'Revert Corridor Routing' : 'Transmit Reroute Advisory'}
                </span>
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => adjustFleetFrequency(activeCorridor.corridorId, 2)}
                className="bg-[var(--surface-subtle)] text-[var(--text-primary)] border-[var(--color-accent-primary)] hover:bg-[#2563eb] text-xs font-semibold"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Deploy +2 Buses</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
