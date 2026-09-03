'use client';

import React, { useState } from 'react';
import {
  Flame,
  AlertTriangle,
  MapPin,
  ShieldAlert,
  ArrowRight,
  Activity,
  Wrench,
  CheckCircle2,
  X,
  Scale,
} from 'lucide-react';
import { MetricCard } from '@/components/ui/MetricCard';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { useWorkOrderStore, type PotholeCluster } from '@/features/roles/stores/workOrderStore';
import { formatCurrency } from '@/lib/utils';

export function RoadHeatmapView() {
  const [selectedClusterId, setSelectedClusterId] = useState<string>('CLS-CHD-04');
  const [isPenaltyModalOpen, setIsPenaltyModalOpen] = useState(false);
  const [penaltyAmount, setPenaltyAmount] = useState(50000);
  const [penaltyReason, setPenaltyReason] = useState('Recurrent defect SLA overdue by 14 days under warranty clause');

  const clusters = useWorkOrderStore((state) => state.clusters);
  const dispatchClusterWorkOrder = useWorkOrderStore((state) => state.dispatchClusterWorkOrder);
  const penalizeContractor = useWorkOrderStore((state) => state.penalizeContractor);
  const activeToast = useWorkOrderStore((state) => state.activeToast);

  const activeCluster = clusters.find((c) => c.clusterId === selectedClusterId) || clusters[0];

  const handleConfirmPenalty = () => {
    if (!activeCluster) return;
    penalizeContractor(activeCluster.clusterId, Number(penaltyAmount), penaltyReason);
    setIsPenaltyModalOpen(false);
  };

  const columns: Column<PotholeCluster>[] = [
    {
      key: 'clusterId',
      header: 'Cluster ID',
      render: (c) => <span className="font-mono text-xs text-[#8BBB92] font-semibold">{c.clusterId}</span>,
    },
    { key: 'roadName', header: 'Corridor Cluster' },
    {
      key: 'potholeCount',
      header: 'Defect Density',
      align: 'right',
      render: (c) => <span className="font-mono font-bold text-[#f0fdf4]">{c.potholeCount} defects</span>,
    },
    {
      key: 'recurrenceRate',
      header: 'Recurrence Pattern',
      render: (c) => <span className="text-xs font-mono text-amber-400">{c.recurrenceRate}</span>,
    },
    {
      key: 'originalContractor',
      header: 'Liable Contractor',
      render: (c) => <span className="text-xs text-[#8BBB92]">{c.originalContractor}</span>,
    },
    {
      key: 'status',
      header: 'Cluster Status',
      align: 'center',
      render: (c) => (
        <span
          className={`inline-flex items-center rounded border px-2 py-0.5 text-[10px] font-mono font-bold ${
            c.status === 'Work Order Active'
              ? 'border-emerald-800/40 bg-emerald-950/40 text-emerald-300'
              : c.status === 'Penalized'
              ? 'border-rose-800/40 bg-rose-950/40 text-rose-300'
              : 'border-amber-800/40 bg-amber-950/40 text-amber-300'
          }`}
        >
          {c.status}
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

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5 shrink-0">
        <MetricCard
          label="Identified Defect Clusters"
          value={String(clusters.length)}
          unit="Spatial Clusters"
          caption="Aggregated from passive fleet bus runs"
          change="Real-Time"
          changeType="neutral"
          icon={<Flame className="h-4 w-4 text-amber-400" />}
        />
        <MetricCard
          label="Severe Road Risk Corridors"
          value="2"
          unit="Corridors"
          caption="Require immediate asphalt intervention"
          change="Action Required"
          changeType="negative"
          icon={<ShieldAlert className="h-4 w-4 text-rose-400" />}
        />
        <MetricCard
          label="Estimated Asphalt Tonnage Needed"
          value="44.2"
          unit="MT"
          caption="Total compacted VG-30 requirement"
          change="Tender Ready"
          changeType="positive"
          icon={<Activity className="h-4 w-4 text-[#8BBB92]" />}
        />
        <MetricCard
          label="Liable Contractor Penalties"
          value="INR 3.2 Lakh"
          caption="Statutory SLA deductions"
          change="Automatic Enforcement"
          changeType="positive"
          icon={<Scale className="h-4 w-4 text-[#8BBB92]" />}
        />
      </div>

      {/* Main Full-Height Content Stack */}
      <div className="flex flex-1 flex-col gap-3 sm:gap-4">
        {/* Main Table Card */}
        <div className="w-full rounded-xl border border-[#12544F] bg-[#0d3137] p-3 sm:p-4 shadow-sm">
          <div className="mb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
            <div>
              <h3 className="text-sm font-semibold text-[#f0fdf4]">
                Spatial Pothole Clusters & Contractor Maintenance Liability
              </h3>
              <p className="text-xs text-[#8BBB92]">
                DBSCAN spatial clustering grouping nearby road distress occurrences within 50-meter envelopes
              </p>
            </div>
            <span className="self-start sm:self-auto rounded border border-[#12544F] bg-[#12544F]/50 px-2.5 py-1 text-xs font-mono text-[#8BBB92]">
              Municipal Corporation PWD
            </span>
          </div>

          <div className="w-full overflow-x-auto">
            <DataTable<PotholeCluster>
              columns={columns}
              data={clusters}
              keyExtractor={(c) => c.clusterId}
              onRowClick={(c) => setSelectedClusterId(c.clusterId)}
            />
          </div>
        </div>

        {/* Selected Cluster Details Panel */}
        {activeCluster && (
          <div className="w-full rounded-xl border border-[#1d6d63] bg-[#0d3137] p-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#12544F] border border-[#2A835F] text-[#8BBB92] shrink-0">
                <Activity className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-bold text-[#f0fdf4]">
                    {activeCluster.clusterId}
                  </span>
                  <span className="text-xs text-[#8BBB92]">· {activeCluster.roadName}</span>
                  <span className="rounded border border-rose-800/40 bg-rose-950/40 px-2 py-0.5 text-[10px] font-mono text-rose-400 font-bold">
                    {activeCluster.riskLevel} Risk
                  </span>
                </div>
                <p className="text-xs text-[#8BBB92]">
                  Centroid GPS: <span className="text-[#f0fdf4] font-mono">{activeCluster.gpsCentroid}</span> · Density: <span className="text-[#f0fdf4] font-semibold">{activeCluster.potholeCount} defects</span> · Est Asphalt: <span className="text-emerald-400 font-mono font-bold">{activeCluster.estAsphaltTons} MT</span>
                </p>
                <p className="text-[11px] font-mono text-[#5b9076]">
                  Liable Contractor: <span className="text-[#8BBB92] font-semibold">{activeCluster.originalContractor}</span> ({activeCluster.recurrenceRate} · SLA Overdue: {activeCluster.slaBreachDays} days)
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto pt-2 lg:pt-0">
              <Button
                variant="danger"
                size="sm"
                onClick={() => setIsPenaltyModalOpen(true)}
                className="text-xs font-bold"
              >
                <ShieldAlert className="h-3.5 w-3.5" />
                <span>Issue Contractor Penalty Notice</span>
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => dispatchClusterWorkOrder(activeCluster.clusterId)}
                className="bg-[#12544F] text-[#f0fdf4] border-[#2A835F] hover:bg-[#2A835F] text-xs font-bold"
              >
                <Wrench className="h-3.5 w-3.5" />
                <span>Dispatch PWD Work Order</span>
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Contractor Penalty Issuance Modal */}
      {isPenaltyModalOpen && activeCluster && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-rose-900/60 bg-[#092328] p-5 shadow-2xl font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[#12544F] pb-3 mb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-rose-400" />
                <span className="font-bold text-rose-300 text-sm">Issue Statutory Contractor Penalty</span>
              </div>
              <button onClick={() => setIsPenaltyModalOpen(false)} className="text-[#8BBB92] hover:text-[#f0fdf4]">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="rounded border border-[#12544F] bg-[#0d3137] p-2.5 space-y-1">
                <p className="text-[#8BBB92]">Contractor: <span className="text-[#f0fdf4] font-bold">{activeCluster.originalContractor}</span></p>
                <p className="text-[#8BBB92]">Corridor: <span className="text-[#f0fdf4]">{activeCluster.roadName}</span></p>
                <p className="text-[#5b9076]">Breach: {activeCluster.slaBreachDays} days overdue past mandatory rectification window</p>
              </div>

              <div>
                <label className="block text-[11px] text-[#8BBB92] mb-1">Deduction Penalty Amount (INR) *</label>
                <input
                  type="number"
                  value={penaltyAmount}
                  onChange={(e) => setPenaltyAmount(Number(e.target.value))}
                  className="w-full rounded border border-[#12544F] bg-[#0d3137] px-3 py-2 text-[#f0fdf4] outline-none font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] text-[#8BBB92] mb-1">Legal / Contractual Clause *</label>
                <textarea
                  rows={2}
                  value={penaltyReason}
                  onChange={(e) => setPenaltyReason(e.target.value)}
                  className="w-full rounded border border-[#12544F] bg-[#0d3137] p-2 text-[#f0fdf4] outline-none text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#12544F] mt-3">
                <Button variant="secondary" size="sm" onClick={() => setIsPenaltyModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="danger" size="sm" onClick={handleConfirmPenalty}>
                  Confirm & Deduct from Invoice
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
