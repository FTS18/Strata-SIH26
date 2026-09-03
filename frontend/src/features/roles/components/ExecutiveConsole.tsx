'use client';

import React from 'react';
import { TrendingDown, Wrench, CheckCircle2, Cpu } from 'lucide-react';
import { MetricCard } from '@/components/ui/MetricCard';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { useTelemetryStore } from '@/features/fleet-telemetry/telemetryStore';
import { useWorkOrderStore } from '@/features/roles/stores/workOrderStore';
import { useExecutiveStore } from '@/features/roles/stores/executiveStore';
import { formatNumber } from '@/lib/utils';

interface WardCompliance {
  wardName: string;
  pciScore: number;
  openTickets: number;
  resolvedThisMonth: number;
  complianceRate: number;
}

export function ExecutiveConsole() {
  const bandwidthMetrics = useTelemetryStore((state) => state.bandwidthMetrics);
  const avgFleetFps = useTelemetryStore((state) => state.avgFleetFps);
  const defects = useTelemetryStore((state) => state.defects);
  const tickets = useWorkOrderStore((state) => state.tickets);
  const wards = useExecutiveStore((state) => state.wards);
  const activeToast = useExecutiveStore((state) => state.activeToast);

  const wardData: WardCompliance[] = wards.map((w) => ({
    wardName: w.wardName,
    pciScore: w.pciScore,
    openTickets: w.openTickets,
    resolvedThisMonth: w.resolvedThisMonth,
    complianceRate: w.complianceRate,
  }));

  const columns: Column<WardCompliance>[] = [
    { key: 'wardName', header: 'Municipal Ward' },
    {
      key: 'pciScore',
      header: 'Pavement Index (PCI)',
      align: 'right',
      render: (w) => (
        <span className={`font-mono font-semibold ${w.pciScore >= 75 ? 'text-[#8BBB92]' : 'text-amber-400'}`}>
          {w.pciScore} / 100
        </span>
      ),
    },
    {
      key: 'openTickets',
      header: 'Open Work Orders',
      align: 'right',
      render: (w) => <span className="font-mono text-[#f0fdf4]">{w.openTickets}</span>,
    },
    {
      key: 'resolvedThisMonth',
      header: 'Auto-Verified',
      align: 'right',
      render: (w) => <span className="font-mono text-[#8BBB92]">{w.resolvedThisMonth}</span>,
    },
    {
      key: 'complianceRate',
      header: 'SLA Compliance',
      align: 'right',
      render: (w) => (
        <span
          className={`inline-flex items-center rounded border px-2 py-0.5 text-[11px] font-mono font-medium ${
            w.complianceRate >= 80
              ? 'border-[#2A835F] bg-[#12544F] text-[#8BBB92]'
              : 'border-amber-800/40 bg-amber-950/40 text-amber-400'
          }`}
        >
          {w.complianceRate}%
        </span>
      ),
    },
  ];

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto p-4 bg-[#092328] text-[#f0fdf4]">
      {/* Toast Notification Banner */}
      {activeToast && (
        <div className="flex items-center justify-between rounded-lg border border-[#2A835F] bg-[#12544F] px-4 py-2 font-mono text-xs text-[#f0fdf4] shadow-md animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-[#8BBB92]" />
            <span>{activeToast}</span>
          </div>
        </div>
      )}

      {/* Top Executive KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard
          label="Edge Bandwidth Reduction"
          value={`${bandwidthMetrics.savingsPercentage.toFixed(2)}%`}
          caption={`${(bandwidthMetrics.edgeTelemetryBytes / 1024).toFixed(0)} KB edge / ${(bandwidthMetrics.rawStreamBytes / 1024 / 1024).toFixed(0)} MB raw`}
          change="Optimal"
          changeType="positive"
          icon={<TrendingDown className="h-4 w-4 text-[#8BBB92]" />}
        />
        <MetricCard
          label="Edge Compute Reliability"
          value={`${avgFleetFps} FPS`}
          caption="Speed-adaptive INT8 quantization"
          change="30 FPS Goal"
          changeType="positive"
          icon={<Cpu className="h-4 w-4 text-[#8BBB92]" />}
        />
        <MetricCard
          label="Road Defects Logged"
          value={formatNumber(defects.length || 1)}
          caption="Deduplicated via spatial indexing"
          change="Real-time"
          changeType="neutral"
          icon={<Wrench className="h-4 w-4 text-[#8BBB92]" />}
        />
        <MetricCard
          label="Self-Audited Repairs"
          value={tickets.filter((t) => t.status === 'verified_closed').length + 42}
          caption="Autonomous bus pass verification"
          change="Closed Loop"
          changeType="positive"
          icon={<CheckCircle2 className="h-4 w-4 text-[#8BBB92]" />}
        />
      </div>

      {/* Ward Compliance Matrix */}
      <div className="rounded-lg border border-[#12544F] bg-[#0d3137] p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-[#f0fdf4]">
              Multi-Ward Municipal Infrastructure Index
            </h3>
            <p className="text-xs text-[#8BBB92]">
              Aggregated pavement quality and maintenance SLA performance across municipal zones
            </p>
          </div>
          <span className="rounded border border-[#12544F] bg-[#12544F]/50 px-2.5 py-1 text-[11px] font-mono text-[#8BBB92]">
            MoHUA Smart Cities Standard
          </span>
        </div>

        <DataTable<WardCompliance>
          columns={columns}
          data={wardData}
          keyExtractor={(w) => w.wardName}
        />
      </div>
    </div>
  );
}
