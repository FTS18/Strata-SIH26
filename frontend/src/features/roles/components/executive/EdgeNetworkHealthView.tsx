'use client';

import React, { useState } from 'react';
import { Cpu, Wifi, HardDrive, Zap, Radio, RefreshCw, Server, Activity, CheckCircle2, AlertTriangle } from 'lucide-react';
import { MetricCard } from '@/components/ui/MetricCard';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { useTelemetryStore } from '@/features/fleet-telemetry/telemetryStore';

interface EdgeNodeStatus {
  busId: string;
  hardware: string;
  quantization: string;
  inferenceFps: number;
  cpuTempC: number;
  bandwidthSavedPct: number;
  connectionState: 'Optimal' | 'Degraded' | 'Offline';
  ipAddress: string;
  uptimeHours: number;
}

export function EdgeNetworkHealthView() {
  const bandwidthMetrics = useTelemetryStore((state) => state.bandwidthMetrics);
  const avgFleetFps = useTelemetryStore((state) => state.avgFleetFps);
  const [selectedBusId, setSelectedBusId] = useState<string>('CH-01-TB-4820 (Bus 101)');
  const [isStressTesting, setIsStressTesting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeToast, setActiveToast] = useState<string | null>(null);

  const [edgeNodes, setEdgeNodes] = useState<EdgeNodeStatus[]>([
    {
      busId: 'CH-01-TB-4820 (Bus 101)',
      hardware: 'Jetson Orin Nano 8GB',
      quantization: 'TensorRT INT8',
      inferenceFps: 29.4,
      cpuTempC: 48.2,
      bandwidthSavedPct: 99.91,
      connectionState: 'Optimal',
      ipAddress: '10.24.11.101',
      uptimeHours: 142,
    },
    {
      busId: 'CH-01-GA-9210 (Bus 102)',
      hardware: 'Jetson Orin Nano 8GB',
      quantization: 'TensorRT INT8',
      inferenceFps: 28.8,
      cpuTempC: 51.0,
      bandwidthSavedPct: 99.88,
      connectionState: 'Optimal',
      ipAddress: '10.24.11.102',
      uptimeHours: 98,
    },
    {
      busId: 'CH-01-TB-5532 (Bus 103)',
      hardware: 'Jetson Orin Nano 8GB',
      quantization: 'TensorRT INT8',
      inferenceFps: 30.1,
      cpuTempC: 46.5,
      bandwidthSavedPct: 99.94,
      connectionState: 'Optimal',
      ipAddress: '10.24.11.103',
      uptimeHours: 216,
    },
    {
      busId: 'CH-01-GA-6674 (Bus 104)',
      hardware: 'Jetson Orin Nano 8GB',
      quantization: 'TensorRT INT8',
      inferenceFps: 27.5,
      cpuTempC: 53.4,
      bandwidthSavedPct: 99.85,
      connectionState: 'Optimal',
      ipAddress: '10.24.11.104',
      uptimeHours: 64,
    },
  ]);

  const showToast = (msg: string) => {
    setActiveToast(msg);
    setTimeout(() => setActiveToast(null), 4000);
  };

  const activeNode = edgeNodes.find((n) => n.busId === selectedBusId) || edgeNodes[0];

  const handleRunStressTest = () => {
    if (!activeNode || isStressTesting) return;
    setIsStressTesting(true);
    showToast(`Initiating 100% GPU thermal load test on ${activeNode.busId}...`);

    setTimeout(() => {
      setEdgeNodes((prev) =>
        prev.map((n) =>
          n.busId === activeNode.busId
            ? { ...n, cpuTempC: Number((n.cpuTempC + 1.2).toFixed(1)), inferenceFps: 30.0 }
            : n
        )
      );
      setIsStressTesting(false);
      showToast(`Stress test complete for ${activeNode.busId}: Thermal dissipation within safe limits (Delta +1.2°C).`);
    }, 1800);
  };

  const handleSyncModels = () => {
    if (!activeNode || isSyncing) return;
    setIsSyncing(true);
    showToast(`Dispatching TensorRT INT8 model manifest OTA to ${activeNode.ipAddress}...`);

    setTimeout(() => {
      setEdgeNodes((prev) =>
        prev.map((n) =>
          n.busId === activeNode.busId
            ? { ...n, connectionState: 'Optimal' }
            : n
        )
      );
      setIsSyncing(false);
      showToast(`OTA Jetson model sync successful on ${activeNode.busId}: All 4 inference pipelines up to date.`);
    }, 1500);
  };

  const columns: Column<EdgeNodeStatus>[] = [
    { key: 'busId', header: 'Edge Bus Node' },
    {
      key: 'hardware',
      header: 'Hardware Target',
      render: (n) => <span className="font-mono text-xs text-[#8BBB92]">{n.hardware}</span>,
    },
    {
      key: 'quantization',
      header: 'Precision Engine',
      render: (n) => <span className="font-mono text-xs text-[#8BBB92]">{n.quantization}</span>,
    },
    {
      key: 'inferenceFps',
      header: 'Compute Speed',
      align: 'right',
      render: (n) => <span className="font-mono font-bold text-[#f0fdf4]">{n.inferenceFps} FPS</span>,
    },
    {
      key: 'cpuTempC',
      header: 'Node Temp',
      align: 'right',
      render: (n) => (
        <span className={`font-mono font-bold ${n.cpuTempC < 50 ? 'text-emerald-400' : 'text-amber-400'}`}>
          {n.cpuTempC}°C
        </span>
      ),
    },
    {
      key: 'bandwidthSavedPct',
      header: 'Bandwidth Saved',
      align: 'right',
      render: (n) => <span className="font-mono font-bold text-[#8BBB92]">{n.bandwidthSavedPct}%</span>,
    },
    {
      key: 'connectionState',
      header: 'Mesh State',
      align: 'center',
      render: (n) => (
        <span className="inline-flex items-center rounded border border-[#2A835F] bg-[#12544F] px-2 py-0.5 text-[11px] font-mono text-[#8BBB92] font-semibold">
          {n.connectionState}
        </span>
      ),
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

      {/* Top Health Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5 shrink-0">
        <MetricCard
          label="Edge Bandwidth Savings"
          value={`${bandwidthMetrics.savingsPercentage.toFixed(2)}%`}
          caption="Metadata JSON vs Raw Video Upload"
          change="99.9% Goal"
          changeType="positive"
          icon={<Wifi className="h-4 w-4 text-[#8BBB92]" />}
        />
        <MetricCard
          label="Average Fleet Compute"
          value={`${avgFleetFps.toFixed(1)} FPS`}
          caption="Speed-adaptive INT8 inference"
          change="Target: 30 FPS"
          changeType="positive"
          icon={<Cpu className="h-4 w-4 text-[#8BBB92]" />}
        />
        <MetricCard
          label="Active Edge Nodes"
          value={`${edgeNodes.length} / ${edgeNodes.length}`}
          unit="Buses"
          caption="NVIDIA Jetson Orin Nano fleet"
          change="Online"
          changeType="positive"
          icon={<Server className="h-4 w-4 text-[#8BBB92]" />}
        />
        <MetricCard
          label="Average SoC Temp"
          value="49.8°C"
          caption="Passive heatsink + bus airflow"
          change="Nominal"
          changeType="neutral"
          icon={<Zap className="h-4 w-4 text-[#8BBB92]" />}
        />
      </div>

      {/* Main Full-Height Content Stack */}
      <div className="flex flex-1 flex-col gap-3 sm:gap-4">
        {/* Main Table Card */}
        <div className="w-full rounded-xl border border-[#12544F] bg-[#0d3137] p-3 sm:p-4 shadow-sm">
          <div className="mb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
            <div>
              <h3 className="text-sm font-semibold text-[#f0fdf4]">
                CTU Fleet Edge Compute Telemetry Grid
              </h3>
              <p className="text-xs text-[#8BBB92]">
                Real-time health, thermal diagnostics, and INT8 model quantization per bus
              </p>
            </div>
            <span className="self-start sm:self-auto rounded border border-[#12544F] bg-[#12544F]/50 px-2.5 py-1 text-xs font-mono text-[#8BBB92]">
              Mesh Sync: 2s Interval
            </span>
          </div>

          <div className="w-full overflow-x-auto">
            <DataTable<EdgeNodeStatus>
              columns={columns}
              data={edgeNodes}
              keyExtractor={(n) => n.busId}
              onRowClick={(n) => setSelectedBusId(n.busId)}
            />
          </div>
        </div>

        {/* Selected Node Real-Time Diagnostics Strip */}
        {activeNode && (
          <div className="w-full rounded-xl border border-[#1d6d63] bg-[#0d3137] p-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#12544F] border border-[#2A835F] text-[#8BBB92] shrink-0">
                <Server className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-bold text-[#f0fdf4]">
                    {activeNode.busId}
                  </span>
                  <span className="text-xs text-[#8BBB92]">({activeNode.hardware})</span>
                  <span className="rounded border border-[#2A835F] bg-[#12544F] px-2 py-0.5 text-[10px] font-mono text-[#8BBB92] font-semibold">
                    {activeNode.quantization}
                  </span>
                </div>
                <p className="text-xs text-[#8BBB92]">
                  Edge IP: <span className="text-[#f0fdf4] font-mono">{activeNode.ipAddress}</span> · Inference:{' '}
                  <span className="text-emerald-400 font-mono font-bold">{activeNode.inferenceFps} FPS</span> · SoC Temp:{' '}
                  <span className="text-[#f0fdf4] font-mono">{activeNode.cpuTempC}°C</span>
                </p>
                <p className="text-[11px] font-mono text-[#5b9076]">
                  Uptime: {activeNode.uptimeHours}h continuous · Uplink: 4G/5G Cellular MQTT (0.1% Bandwidth Load)
                </p>
              </div>
            </div>

            <div className="flex w-full lg:w-auto items-center gap-2 pt-2 lg:pt-0">
              <Button
                variant="primary"
                size="sm"
                onClick={handleRunStressTest}
                disabled={isStressTesting}
                className="flex-1 lg:flex-initial bg-[#8BBB92] text-[#092328] font-bold hover:bg-[#f0fdf4] text-xs cursor-pointer"
              >
                <Activity className={`h-3.5 w-3.5 ${isStressTesting ? 'animate-pulse' : ''}`} />
                <span>{isStressTesting ? 'Running Thermal Test...' : 'Run Thermal Stress Test'}</span>
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleSyncModels}
                disabled={isSyncing}
                className="flex-1 lg:flex-initial bg-[#12544F] text-[#f0fdf4] border-[#2A835F] hover:bg-[#2A835F] text-xs cursor-pointer"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Syncing Models...' : 'Sync Jetson Models'}</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
