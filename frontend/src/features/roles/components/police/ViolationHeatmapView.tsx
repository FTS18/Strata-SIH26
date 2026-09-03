'use client';

import React, { useState } from 'react';
import {
  Flame,
  ShieldAlert,
  Car,
  MapPin,
  Radio,
  Siren,
  Eye,
  CheckCircle2,
  X,
  Radar,
} from 'lucide-react';
import { MetricCard } from '@/components/ui/MetricCard';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { usePoliceStore, type ViolationCorridor } from '../../stores/policeStore';

export function ViolationHeatmapView({ onNavigateToFeed }: { onNavigateToFeed?: (camId: string) => void }) {
  const [selectedCorridorId, setSelectedCorridorId] = useState<string>('HOT-CHD-01');
  const [isCameraPreviewOpen, setIsCameraPreviewOpen] = useState(false);

  const corridors = usePoliceStore((s) => s.corridors);
  const dispatchCorridorInterceptor = usePoliceStore((s) => s.dispatchCorridorInterceptor);
  const toggleCorridorRadar = usePoliceStore((s) => s.toggleCorridorRadar);
  const activeToast = usePoliceStore((s) => s.activeToast);

  const activeCorridor = corridors.find((c) => c.id === selectedCorridorId) || corridors[0];

  const columns: Column<ViolationCorridor>[] = [
    {
      key: 'id',
      header: 'Corridor ID',
      render: (c) => <span className="font-mono text-xs text-[#8BBB92] font-semibold">{c.id}</span>,
    },
    { key: 'locationName', header: 'Corridor Location' },
    {
      key: 'primaryOffense',
      header: 'Primary Violation',
      render: (c) => <span className="text-xs font-semibold text-rose-400">{c.primaryOffense}</span>,
    },
    {
      key: 'violationsCount',
      header: 'Detections (24h)',
      align: 'right',
      render: (c) => <span className="font-mono font-bold text-[#f0fdf4]">{c.violationsCount}</span>,
    },
    {
      key: 'radarActive',
      header: 'Radar Enforcement',
      align: 'center',
      render: (c) => (
        <span
          className={`inline-flex items-center rounded border px-2 py-0.5 text-[10px] font-mono font-bold ${
            c.radarActive
              ? 'border-emerald-800/40 bg-emerald-950/40 text-emerald-300'
              : 'border-[#12544F] bg-[#0d3137] text-[#8BBB92]'
          }`}
        >
          {c.radarActive ? 'ACTIVE' : 'STANDBY'}
        </span>
      ),
    },
    {
      key: 'recommendedAction',
      header: 'Deployment Advisory',
      render: (c) => <span className="text-xs text-[#8BBB92]">{c.recommendedAction}</span>,
    },
  ];

  return (
    <div className="flex h-full w-full flex-col gap-3 sm:gap-4 overflow-y-auto p-3 sm:p-5 bg-[#092328] text-[#f0fdf4]">
      {/* Toast Notification Banner */}
      {activeToast && (
        <div className="flex items-center justify-between rounded-lg border border-[#2A835F] bg-[#12544F] px-4 py-2 font-mono text-xs text-[#f0fdf4] shadow-md animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-[#8BBB92]" />
            <span>{activeToast}</span>
          </div>
        </div>
      )}

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5 shrink-0">
        <MetricCard
          label="Total Violations Logged (24h)"
          value="97"
          unit="Incidents"
          caption="Captured by on-bus AI cameras"
          change="+12% vs Average"
          changeType="negative"
          icon={<ShieldAlert className="h-4 w-4 text-rose-400" />}
        />
        <MetricCard
          label="Active Violation Corridors"
          value={String(corridors.length)}
          unit="Choke Points"
          caption="High-incidence monitored corridors"
          change="Real-Time"
          changeType="neutral"
          icon={<Flame className="h-4 w-4 text-amber-400" />}
        />
        <MetricCard
          label="Bus Lane Obstructions"
          value="31"
          unit="Obstructions"
          caption="Commercial vehicles blocking transit"
          change="Action Required"
          changeType="negative"
          icon={<Car className="h-4 w-4 text-[#8BBB92]" />}
        />
        <MetricCard
          label="Automated E-Challans Generated"
          value="78"
          unit="Challans"
          caption="Ready for MoRTH court dispatch"
          change="82% Conversion"
          changeType="positive"
          icon={<MapPin className="h-4 w-4 text-[#8BBB92]" />}
        />
      </div>

      {/* Main Full-Height Content Stack */}
      <div className="flex flex-1 flex-col gap-3 sm:gap-4">
        {/* Main Table Card */}
        <div className="w-full rounded-xl border border-[#12544F] bg-[#0d3137] p-3 sm:p-4 shadow-sm">
          <div className="mb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
            <div>
              <h3 className="text-sm font-semibold text-[#f0fdf4]">
                City-Wide Traffic Violation Hotspots & Patrol Deployment Guidance
              </h3>
              <p className="text-xs text-[#8BBB92]">
                Real-time spatial aggregation of rash driving, overspeeding, and illegal bus-lane encroachment
              </p>
            </div>
            <span className="self-start sm:self-auto rounded border border-[#12544F] bg-[#12544F]/50 px-2.5 py-1 text-xs font-mono text-[#8BBB92]">
              Delhi & Chandigarh Traffic Police Radar
            </span>
          </div>

          <div className="w-full overflow-x-auto">
            <DataTable<ViolationCorridor>
              columns={columns}
              data={corridors}
              keyExtractor={(h) => h.id}
              onRowClick={(h) => setSelectedCorridorId(h.id)}
            />
          </div>
        </div>

        {/* Selected Hotspot Details Panel */}
        {activeCorridor && (
          <div className="w-full rounded-xl border border-[#1d6d63] bg-[#0d3137] p-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-950/60 border border-rose-700/50 text-rose-400 shrink-0">
                <Siren className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-bold text-[#f0fdf4]">
                    {activeCorridor.id}
                  </span>
                  <span className="text-xs text-[#8BBB92]">· {activeCorridor.locationName}</span>
                  <span className="rounded border border-rose-800/40 bg-rose-950/40 px-2 py-0.5 text-[10px] font-mono text-rose-400 font-bold">
                    {activeCorridor.violationsCount} Detections
                  </span>
                </div>
                <p className="text-xs text-[#8BBB92]">
                  Primary Offense: <span className="text-[#f0fdf4] font-medium">{activeCorridor.primaryOffense}</span> · Avg Offense Speed: <span className="text-rose-400 font-mono font-bold">{activeCorridor.avgOffenseSpeed}</span>
                </p>
                <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-[#5b9076]">
                  <span>Advisory: {activeCorridor.recommendedAction}</span>
                  <span>· Station: {activeCorridor.nearestPcrUnit}</span>
                  {activeCorridor.activeUnitsDispatched > 0 && (
                    <span className="rounded bg-rose-950/80 px-2 py-0.5 border border-rose-500/50 text-rose-300 font-bold">
                      {activeCorridor.activeUnitsDispatched} Interceptor Unit(s) Active On-Scene
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto pt-2 lg:pt-0">
              <Button
                variant="primary"
                size="sm"
                onClick={() => toggleCorridorRadar(activeCorridor.id)}
                className={`text-xs font-bold ${
                  activeCorridor.radarActive
                    ? 'bg-[#12544F] text-[#8BBB92] border-[#2A835F]'
                    : 'bg-[#2A835F] text-[#f0fdf4] hover:bg-[#12544F]'
                }`}
              >
                <Radar className="h-3.5 w-3.5" />
                <span>{activeCorridor.radarActive ? 'Radar Active' : 'Arm Optical Speed Radar'}</span>
              </Button>

              <Button
                variant="danger"
                size="sm"
                onClick={() => dispatchCorridorInterceptor(activeCorridor.id)}
                className="text-xs font-bold"
              >
                <Radio className="h-3.5 w-3.5" />
                <span>Dispatch Interceptor Unit</span>
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsCameraPreviewOpen(true)}
                className="bg-[#12544F] text-[#f0fdf4] border-[#2A835F] hover:bg-[#2A835F] text-xs"
              >
                <Eye className="h-3.5 w-3.5" />
                <span>Inspect Sighting Crop</span>
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Corridor Camera Inspection Modal */}
      {isCameraPreviewOpen && activeCorridor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-xl border border-[#12544F] bg-[#092328] p-5 shadow-2xl font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[#12544F] pb-3 mb-4">
              <div>
                <span className="font-bold text-[#f0fdf4] text-sm">
                  Live Edge Camera Feed: {activeCorridor.locationName}
                </span>
                <p className="text-[10px] text-[#8BBB92]">
                  Autonomous Optical Sighting via Bus Transit Interceptor Node
                </p>
              </div>
              <button
                onClick={() => setIsCameraPreviewOpen(false)}
                className="text-[#8BBB92] hover:text-[#f0fdf4] cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="relative flex h-64 w-full items-center justify-center rounded-lg border border-[#12544F] bg-black overflow-hidden mb-4">
              <img
                src="/videos/delhi_rajpath_anpr.gif"
                alt="Corridor ANPR Stream"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 pointer-events-none p-3 flex flex-col justify-between bg-gradient-to-t from-black/70 via-transparent to-black/40">
                <div className="flex justify-between text-[10px] text-[#8BBB92]">
                  <span className="bg-black/70 px-2 py-0.5 rounded border border-[#12544F] text-emerald-400 font-bold">
                    EDGE SENSOR STREAM ACTIVE
                  </span>
                  <span className="bg-black/70 px-2 py-0.5 rounded border border-[#12544F]">
                    {activeCorridor.id}
                  </span>
                </div>
                <div className="flex justify-between text-[10px] text-[#8BBB92] bg-black/75 px-2 py-1 rounded border border-[#12544F]">
                  <span>PRIMARY OFFENSE: {activeCorridor.primaryOffense}</span>
                  <span className="text-rose-400 font-bold">AVG SPEED: {activeCorridor.avgOffenseSpeed}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsCameraPreviewOpen(false)}
              >
                Close Stream
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  dispatchCorridorInterceptor(activeCorridor.id);
                  setIsCameraPreviewOpen(false);
                }}
              >
                Dispatch Interceptor To This Corridor
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
