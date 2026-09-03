'use client';

import React, { useState } from 'react';
import {
  Users,
  AlertTriangle,
  Bus,
  ArrowUpRight,
  Radio,
  Send,
  CheckCircle2,
  X,
  Megaphone,
} from 'lucide-react';
import { MetricCard } from '@/components/ui/MetricCard';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { useFleetStore, type StopCrowd } from '../../stores/fleetStore';

export function CrowdDensityView() {
  const [isAdvisoryModalOpen, setIsAdvisoryModalOpen] = useState(false);
  const [customAdvisory, setCustomAdvisory] = useState('');

  const stops = useFleetStore((s) => s.stops);
  const selectedStopId = useFleetStore((s) => s.selectedStopId);
  const setSelectedStopId = useFleetStore((s) => s.setSelectedStopId);
  const injectSurgeTripper = useFleetStore((s) => s.injectSurgeTripper);
  const broadcastPassengerAdvisory = useFleetStore((s) => s.broadcastPassengerAdvisory);
  const activeToast = useFleetStore((s) => s.activeToast);

  const activeStop = stops.find((s) => s.stopId === selectedStopId) || stops[0];

  const handleBroadcast = () => {
    if (!activeStop) return;
    broadcastPassengerAdvisory(activeStop.stopId, customAdvisory || undefined);
    setCustomAdvisory('');
    setIsAdvisoryModalOpen(false);
  };

  const columns: Column<StopCrowd>[] = [
    { key: 'stopName', header: 'Bus Stop / Terminal' },
    {
      key: 'corridor',
      header: 'Corridor',
      render: (s) => <span className="font-mono text-xs text-[#8BBB92]">{s.corridor}</span>,
    },
    {
      key: 'waitingCommuters',
      header: 'Waiting Commuters',
      align: 'right',
      render: (s) => (
        <span className={`font-mono font-bold ${s.waitingCommuters > 50 ? 'text-rose-400' : 'text-[#f0fdf4]'}`}>
          {s.waitingCommuters} pax
        </span>
      ),
    },
    {
      key: 'crowdLevel',
      header: 'Density Level',
      align: 'center',
      render: (s) => {
        const isOver = s.crowdLevel.startsWith('Overcrowded');
        const isMod = s.crowdLevel.startsWith('Moderate');
        return (
          <span
            className={`inline-flex items-center rounded border px-2 py-0.5 text-[11px] font-mono font-medium ${
              isOver
                ? 'border-rose-800/40 bg-rose-950/40 text-rose-400 font-bold'
                : isMod
                ? 'border-amber-800/40 bg-amber-950/40 text-amber-400 font-semibold'
                : 'border-[#2A835F] bg-[#12544F] text-[#8BBB92]'
            }`}
          >
            {s.crowdLevel}
          </span>
        );
      },
    },
    {
      key: 'suggestedDispatch',
      header: 'AI Surge Dispatch Advisory',
      render: (s) => <span className="text-xs text-[#8BBB92]">{s.suggestedDispatch}</span>,
    },
  ];

  const totalOvercrowded = stops.filter((s) => s.crowdLevel.startsWith('Overcrowded')).length;
  const totalTrippers = stops.reduce((acc, s) => acc + s.trippersDispatched, 3);

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
          label="Overcrowded Bus Stops"
          value={String(totalOvercrowded)}
          unit="Stops"
          caption="AI Camera Passenger Density"
          change="Surge Alert"
          changeType="negative"
          icon={<Users className="h-4 w-4 text-rose-400" />}
        />
        <MetricCard
          label="Average Passenger Wait Time"
          value="8.4"
          unit="min"
          caption="Target max wait time: 10 min"
          change="Optimal"
          changeType="positive"
          icon={<Bus className="h-4 w-4 text-[#8BBB92]" />}
        />
        <MetricCard
          label="Surge Tripper Buses Dispatched"
          value={String(totalTrippers)}
          unit="Trippers"
          caption="Dispatched to clear queue spikes"
          change="High Frequency"
          changeType="positive"
          icon={<ArrowUpRight className="h-4 w-4 text-[#8BBB92]" />}
        />
        <MetricCard
          label="Fleet Capacity Headroom"
          value="18%"
          caption="Available standby depot buses"
          change="Ready to Deploy"
          changeType="neutral"
          icon={<AlertTriangle className="h-4 w-4 text-amber-400" />}
        />
      </div>

      {/* Main Full-Height Content Stack */}
      <div className="flex flex-1 flex-col gap-3 sm:gap-4">
        {/* Main Table Card */}
        <div className="w-full rounded-xl border border-[#12544F] bg-[#0d3137] p-3 sm:p-4 shadow-sm">
          <div className="mb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
            <div>
              <h3 className="text-sm font-semibold text-[#f0fdf4]">
                Terminal Crowd Density & AI-Triggered Surge Tripper Queue
              </h3>
              <p className="text-xs text-[#8BBB92]">
                Passenger counting from exterior bus cameras detecting queue buildup exceeding headway capacity
              </p>
            </div>
            <span className="self-start sm:self-auto rounded border border-[#12544F] bg-[#12544F]/50 px-2.5 py-1 text-xs font-mono text-[#8BBB92]">
              Transit Demand Management
            </span>
          </div>

          <div className="w-full overflow-x-auto">
            <DataTable<StopCrowd>
              columns={columns}
              data={stops}
              keyExtractor={(s) => s.stopId}
              onRowClick={(s) => setSelectedStopId(s.stopId)}
            />
          </div>
        </div>

        {/* Selected Stop Details Panel */}
        {activeStop && (
          <div className="w-full rounded-xl border border-[#1d6d63] bg-[#0d3137] p-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#12544F] border border-[#2A835F] text-[#8BBB92] shrink-0">
                <Users className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-bold text-[#f0fdf4]">
                    {activeStop.stopName}
                  </span>
                  <span className="text-xs text-[#8BBB92]">· {activeStop.corridor}</span>
                  <span
                    className={`rounded border px-2 py-0.5 text-[10px] font-mono font-bold ${
                      activeStop.crowdLevel.startsWith('Overcrowded')
                        ? 'border-rose-800/40 bg-rose-950/40 text-rose-400'
                        : 'border-[#2A835F] bg-[#12544F] text-[#8BBB92]'
                    }`}
                  >
                    {activeStop.waitingCommuters} Waiting Pax
                  </span>
                  {activeStop.trippersDispatched > 0 && (
                    <span className="rounded border border-emerald-700/50 bg-emerald-950/40 px-2 py-0.5 text-[10px] font-mono text-emerald-300 font-bold">
                      {activeStop.trippersDispatched} Surge Tripper(s) Active
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#8BBB92]">
                  Advisory: <span className="text-[#f0fdf4] font-medium">{activeStop.suggestedDispatch}</span> · Available Standby: <span className="text-emerald-400 font-mono font-bold">{activeStop.standbyTripperId}</span>
                </p>
                <p className="text-[11px] font-mono text-[#5b9076]">
                  Nearest Fleet Depot: <span className="text-[#8BBB92]">{activeStop.nearestDepot}</span> · Automatic Frequency Adjustment Active
                </p>
                {activeStop.activeAdvisory && (
                  <p className="text-[11px] font-mono text-cyan-300 pt-0.5">
                    Live Broadcast: {activeStop.activeAdvisory}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto pt-2 lg:pt-0">
              <Button
                variant="danger"
                size="sm"
                onClick={() => injectSurgeTripper(activeStop.stopId)}
                className="text-xs font-bold"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Inject Surge Tripper Bus</span>
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsAdvisoryModalOpen(true)}
                className="bg-[#12544F] text-[#f0fdf4] border-[#2A835F] hover:bg-[#2A835F] text-xs font-bold"
              >
                <Radio className="h-3.5 w-3.5" />
                <span>Broadcast Passenger Advisory</span>
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Broadcast Passenger Advisory Modal */}
      {isAdvisoryModalOpen && activeStop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-[#12544F] bg-[#092328] p-5 shadow-2xl font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[#12544F] pb-3 mb-3">
              <div className="flex items-center gap-2">
                <Megaphone className="h-4 w-4 text-cyan-400" />
                <span className="font-bold text-[#f0fdf4] text-sm">
                  Broadcast Commuter Advisory ({activeStop.stopName})
                </span>
              </div>
              <button onClick={() => setIsAdvisoryModalOpen(false)} className="text-[#8BBB92] hover:text-[#f0fdf4]">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-[#8BBB92]">
                Custom message for digital display boards at the terminal:
              </p>
              <textarea
                rows={3}
                placeholder={`High passenger density observed. Surge tripper bus ${activeStop.standbyTripperId} is en-route with estimated arrival in 4 minutes.`}
                value={customAdvisory}
                onChange={(e) => setCustomAdvisory(e.target.value)}
                className="w-full rounded border border-[#12544F] bg-[#0d3137] p-2 text-[#f0fdf4] outline-none text-xs"
              />

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#12544F]">
                <Button variant="secondary" size="sm" onClick={() => setIsAdvisoryModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" onClick={handleBroadcast} className="bg-[#2A835F] text-[#f0fdf4] hover:bg-[#12544F]">
                  Transmit to Digital Signs
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
