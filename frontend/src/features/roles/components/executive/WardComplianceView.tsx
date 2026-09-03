'use client';

import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  CheckCircle,
  ShieldCheck,
  FileCheck2,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  X,
  Search,
  AlertOctagon,
} from 'lucide-react';
import { MetricCard } from '@/components/ui/MetricCard';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { useExecutiveStore, type WardCompliance } from '../../stores/executiveStore';

export function WardComplianceView() {
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [auditDecision, setAuditDecision] = useState<'Audit Verified' | 'Audit Flagged'>('Audit Verified');
  const [auditNotes, setAuditNotes] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const wards = useExecutiveStore((s) => s.wards);
  const selectedWardId = useExecutiveStore((s) => s.selectedWardId);
  const setSelectedWardId = useExecutiveStore((s) => s.setSelectedWardId);
  const auditWard = useExecutiveStore((s) => s.auditWard);
  const activeToast = useExecutiveStore((s) => s.activeToast);

  const filteredWards = wards.filter((w) => {
    if (statusFilter !== 'ALL' && w.auditStatus !== statusFilter) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      w.wardName.toLowerCase().includes(q) ||
      w.zone.toLowerCase().includes(q) ||
      w.contractorName.toLowerCase().includes(q) ||
      w.wardCouncillor.toLowerCase().includes(q)
    );
  });

  const activeWard = wards.find((w) => w.wardId === selectedWardId) || filteredWards[0] || wards[0];

  const handleConfirmAudit = () => {
    if (!activeWard) return;
    auditWard(activeWard.wardId, auditDecision);
    setIsAuditModalOpen(false);
  };

  const columns: Column<WardCompliance>[] = [
    { key: 'wardName', header: 'Municipal Ward / Division' },
    {
      key: 'zone',
      header: 'Zone',
      render: (w) => <span className="font-mono text-xs text-[#8BBB92]">{w.zone}</span>,
    },
    {
      key: 'pciScore',
      header: 'Pavement Index (PCI)',
      align: 'right',
      render: (w) => (
        <span className={`font-mono font-bold ${w.pciScore >= 75 ? 'text-emerald-400' : 'text-amber-400'}`}>
          {w.pciScore} / 100
        </span>
      ),
    },
    {
      key: 'openTickets',
      header: 'Open Defects',
      align: 'right',
      render: (w) => <span className="font-mono font-bold text-[#f0fdf4]">{w.openTickets}</span>,
    },
    {
      key: 'resolvedThisMonth',
      header: 'Auto-Verified',
      align: 'right',
      render: (w) => <span className="font-mono text-[#8BBB92]">{w.resolvedThisMonth}</span>,
    },
    {
      key: 'complianceRate',
      header: 'SLA Score',
      align: 'right',
      render: (w) => (
        <span
          className={`inline-flex items-center rounded border px-2 py-0.5 text-[11px] font-mono font-medium ${
            w.complianceRate >= 80
              ? 'border-[#2A835F] bg-[#12544F] text-[#8BBB92] font-semibold'
              : 'border-amber-800/40 bg-amber-950/40 text-amber-400 font-bold'
          }`}
        >
          {w.complianceRate}%
        </span>
      ),
    },
    {
      key: 'auditStatus',
      header: 'Executive Audit',
      align: 'center',
      render: (w) => (
        <span
          className={`inline-flex items-center rounded border px-2 py-0.5 text-[10px] font-mono font-bold ${
            w.auditStatus === 'Audit Verified'
              ? 'border-emerald-700/50 bg-emerald-950/50 text-emerald-300'
              : w.auditStatus === 'Audit Flagged'
              ? 'border-rose-700/50 bg-rose-950/50 text-rose-300'
              : 'border-amber-700/50 bg-amber-950/50 text-amber-300'
          }`}
        >
          {w.auditStatus}
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

      {/* KPI Section with Visual Hierarchy */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-3.5 shrink-0">
        <div className="md:col-span-2 lg:col-span-2 rounded-xl border border-[#1d6d63] bg-[#0d3137] p-4 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#8BBB92] uppercase font-mono tracking-wide">
              Citywide Pavement Condition Index (PCI)
            </span>
            <span className="rounded bg-[#12544F] border border-[#2A835F] px-2 py-0.5 text-[10px] font-mono text-[#8BBB92]">
              +4.1% MoM Trend
            </span>
          </div>

          <div className="my-2.5 flex items-baseline gap-3">
            <span className="font-display text-4xl sm:text-5xl font-bold text-[#f0fdf4] tracking-tight">
              74.2
            </span>
            <span className="text-sm font-mono text-[#8BBB92]">/ 100 (Nominal Condition)</span>
          </div>

          <div className="space-y-1 text-xs text-[#8BBB92]">
            <p>Calculated across 5 municipal zones using passive public transit fleet dashcam runs</p>
          </div>
        </div>

        <MetricCard
          label="Total Open PWD Tickets"
          value="83"
          unit="Active"
          caption="Current citywide backlog"
          change="-14% This Week"
          changeType="positive"
          icon={<AlertTriangle className="h-4 w-4 text-amber-400" />}
        />

        <MetricCard
          label="Autonomous Bus Passes"
          value="191"
          unit="Verifications"
          caption="Repairs verified by revenue buses"
          change="100% Automated"
          changeType="positive"
          icon={<CheckCircle className="h-4 w-4 text-[#8BBB92]" />}
        />
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 shrink-0">
        <div className="flex flex-1 items-center gap-2 rounded-lg border border-[#12544F] bg-[#0d3137] px-3.5 py-1.5">
          <Search className="h-4 w-4 text-[#8BBB92] shrink-0" />
          <input
            type="text"
            placeholder="Search municipal wards, councillors, zones..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs font-mono text-[#f0fdf4] outline-none placeholder:text-[#5b9076]"
          />
        </div>

        <div className="flex items-center gap-1 rounded-lg border border-[#12544F] bg-[#0d3137] p-1 text-[11px] font-mono">
          {['ALL', 'Audit Verified', 'Audit Flagged', 'Pending Audit'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`rounded px-2.5 py-1 transition-all cursor-pointer ${
                statusFilter === st ? 'bg-[#12544F] text-[#f0fdf4] font-bold' : 'text-[#8BBB92] hover:text-[#f0fdf4]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Main Full-Height Content Stack */}
      <div className="flex flex-1 flex-col gap-3 sm:gap-4">
        {/* Main Table Card */}
        <div className="w-full rounded-xl border border-[#12544F] bg-[#0d3137] p-3 sm:p-4 shadow-sm">
          <div className="mb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
            <div>
              <h3 className="text-sm font-semibold text-[#f0fdf4]">
                Zonal Infrastructure Health & Contractor Compliance Scorecard
              </h3>
              <p className="text-xs text-[#8BBB92]">
                Ranked by Pavement Condition Index (PCI) and contractual SLA resolution performance
              </p>
            </div>
            <span className="self-start sm:self-auto rounded border border-[#12544F] bg-[#12544F]/50 px-2.5 py-1 text-xs font-mono text-[#8BBB92]">
              Executive Governance Stream
            </span>
          </div>

          <div className="w-full overflow-x-auto">
            <DataTable<WardCompliance>
              columns={columns}
              data={filteredWards}
              keyExtractor={(w) => w.wardId}
              onRowClick={(w) => setSelectedWardId(w.wardId)}
            />
          </div>
        </div>

        {/* Selected Ward Inspection Action Strip */}
        {activeWard && (
          <div className="w-full rounded-xl border border-[#1d6d63] bg-[#0d3137] p-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#12544F] border border-[#2A835F] text-[#8BBB92] shrink-0">
                <FileCheck2 className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-bold text-[#f0fdf4]">
                    {activeWard.wardName}
                  </span>
                  <span className="text-xs text-[#8BBB92]">· {activeWard.zone}</span>
                  <span className={`rounded border px-2 py-0.5 text-[10px] font-mono font-bold ${
                    activeWard.pciScore >= 75
                      ? 'border-[#2A835F] bg-[#12544F] text-[#8BBB92]'
                      : 'border-amber-800/40 bg-amber-950/40 text-amber-400'
                  }`}>
                    PCI {activeWard.pciScore}/100
                  </span>
                  <span className="rounded border border-[#12544F] bg-[#092328] px-2 py-0.5 text-[10px] font-mono text-[#8BBB92]">
                    Status: {activeWard.auditStatus}
                  </span>
                </div>
                <p className="text-xs text-[#8BBB92]">
                  Contractor: <span className="text-[#f0fdf4] font-medium">{activeWard.contractorName}</span> · Open Defects: <span className="text-[#f0fdf4] font-bold">{activeWard.openTickets}</span> ({activeWard.slaOverdueTickets} SLA Overdue) · Resolved (30d): <span className="text-emerald-400 font-mono font-bold">{activeWard.resolvedThisMonth}</span>
                </p>
                <p className="text-[11px] font-mono text-[#5b9076]">
                  Councillor: <span className="text-[#8BBB92]">{activeWard.wardCouncillor}</span> · SLA Performance Rate: {activeWard.complianceRate}%
                </p>
              </div>
            </div>

            <div className="flex w-full lg:w-auto items-center gap-2 pt-2 lg:pt-0">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsAuditModalOpen(true)}
                className="flex-1 lg:flex-initial bg-[#8BBB92] text-[#092328] font-bold hover:bg-[#f0fdf4] text-xs"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Audit Ward Performance</span>
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Ward Executive Audit Modal */}
      {isAuditModalOpen && activeWard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-[#12544F] bg-[#092328] p-5 shadow-2xl font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[#12544F] pb-3 mb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#8BBB92]" />
                <span className="font-bold text-[#f0fdf4] text-sm">
                  Executive Review: {activeWard.wardName}
                </span>
              </div>
              <button onClick={() => setIsAuditModalOpen(false)} className="text-[#8BBB92] hover:text-[#f0fdf4]">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="rounded border border-[#12544F] bg-[#0d3137] p-2.5 space-y-1">
                <p className="text-[#8BBB92]">Councillor: <span className="text-[#f0fdf4] font-bold">{activeWard.wardCouncillor}</span></p>
                <p className="text-[#8BBB92]">Contractor: <span className="text-[#f0fdf4]">{activeWard.contractorName}</span></p>
                <p className="text-[#8BBB92]">Open Defects: <span className="text-amber-400 font-bold">{activeWard.openTickets}</span> ({activeWard.slaOverdueTickets} Overdue)</p>
              </div>

              <div>
                <label className="block text-[11px] text-[#8BBB92] mb-1">Audit Determination *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAuditDecision('Audit Verified')}
                    className={`rounded border p-2 text-center font-bold cursor-pointer transition-all ${
                      auditDecision === 'Audit Verified'
                        ? 'border-emerald-600 bg-emerald-950/60 text-emerald-300'
                        : 'border-[#12544F] bg-[#0d3137] text-[#8BBB92]'
                    }`}
                  >
                    Clear & Verify
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuditDecision('Audit Flagged')}
                    className={`rounded border p-2 text-center font-bold cursor-pointer transition-all ${
                      auditDecision === 'Audit Flagged'
                        ? 'border-rose-600 bg-rose-950/60 text-rose-300'
                        : 'border-[#12544F] bg-[#0d3137] text-[#8BBB92]'
                    }`}
                  >
                    Flag SLA Breach
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-[#8BBB92] mb-1">Executive Notes & Directions</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Approved contractor performance bonus / Withhold 10% milestone due to 9 overdue tickets."
                  value={auditNotes}
                  onChange={(e) => setAuditNotes(e.target.value)}
                  className="w-full rounded border border-[#12544F] bg-[#0d3137] p-2 text-[#f0fdf4] outline-none text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#12544F]">
                <Button variant="secondary" size="sm" onClick={() => setIsAuditModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" onClick={handleConfirmAudit} className="bg-[#2A835F] text-[#f0fdf4] hover:bg-[#12544F]">
                  Submit Executive Audit
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
