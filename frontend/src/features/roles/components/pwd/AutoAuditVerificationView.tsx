'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  ShieldCheck,
  Bus,
  Clock,
  FileCheck,
  RefreshCw,
  AlertOctagon,
  Search,
  CreditCard,
  AlertTriangle,
} from 'lucide-react';
import { MetricCard } from '@/components/ui/MetricCard';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { useWorkOrderStore, type AutoAuditRecord } from '@/features/roles/stores/workOrderStore';
import { formatCurrency } from '@/lib/utils';

export function AutoAuditVerificationView() {
  const [selectedTicketId, setSelectedTicketId] = useState<string>('WO-2026-0811');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const auditRecords = useWorkOrderStore((state) => state.auditRecords);
  const releaseContractorPayment = useWorkOrderStore((state) => state.releaseContractorPayment);
  const demandWarrantyRectification = useWorkOrderStore((state) => state.demandWarrantyRectification);
  const activeToast = useWorkOrderStore((state) => state.activeToast);

  const filtered = auditRecords.filter((a) => {
    if (statusFilter !== 'ALL' && a.auditResult !== statusFilter) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      a.ticketId.toLowerCase().includes(q) ||
      a.roadName.toLowerCase().includes(q) ||
      a.contractor.toLowerCase().includes(q)
    );
  });

  const activeAudit = auditRecords.find((a) => a.ticketId === selectedTicketId) || filtered[0] || auditRecords[0];

  const columns: Column<AutoAuditRecord>[] = [
    {
      key: 'ticketId',
      header: 'Work Order ID',
      render: (a) => <span className="font-mono text-xs font-semibold text-[var(--text-primary)]">{a.ticketId}</span>,
    },
    { key: 'roadName', header: 'Road Location' },
    {
      key: 'contractor',
      header: 'Assigned Contractor',
      render: (a) => <span className="font-sans text-xs text-[var(--text-secondary)]">{a.contractor}</span>,
    },
    {
      key: 'verifiedByBus',
      header: 'Auditing Bus Unit',
      render: (a) => <span className="font-mono text-xs text-[var(--text-secondary)]">{a.verifiedByBus}</span>,
    },
    {
      key: 'postRepairZSpike',
      header: 'Z-Axis Vibration',
      align: 'right',
      render: (a) => (
        <span className={`font-mono font-semibold ${a.postRepairZSpike < 1.5 ? 'text-emerald-400' : 'text-rose-400'}`}>
          {a.postRepairZSpike}g
        </span>
      ),
    },
    {
      key: 'auditResult',
      header: 'Autonomous Audit Decision',
      align: 'center',
      render: (a) => {
        const isSuccess = a.auditResult === 'Verified Smooth';
        return (
          <span
            className={`inline-flex items-center rounded border px-2 py-0.5 text-[11px] font-mono font-bold ${
              isSuccess
                ? 'border-emerald-800/40 bg-emerald-950/40 text-emerald-300'
                : 'border-rose-800/40 bg-rose-950/40 text-rose-400'
            }`}
          >
            {a.auditResult}
          </span>
        );
      },
    },
    {
      key: 'paymentStatus',
      header: 'Milestone Payout',
      align: 'center',
      render: (a) => (
        <span
          className={`inline-flex items-center rounded border px-2 py-0.5 text-[10px] font-mono font-bold ${
            a.paymentStatus === 'Payment Released'
              ? 'border-emerald-700/50 bg-emerald-950/50 text-emerald-300'
              : a.paymentStatus === 'Rectification Demanded'
              ? 'border-rose-700/50 bg-rose-950/50 text-rose-300'
              : 'border-amber-700/50 bg-amber-950/50 text-amber-300'
          }`}
        >
          {a.paymentStatus}
        </span>
      ),
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
          label="Auto-Closed Work Orders"
          value="42"
          unit="Tickets"
          caption="Verified smooth by public buses"
          change="100% Autonomous"
          changeType="positive"
          icon={<CheckCircle2 className="h-4 w-4 text-[var(--text-secondary)]" />}
        />
        <MetricCard
          label="Contractor Audit Pass Rate"
          value="94.6%"
          caption="Vibration Z < 1.5g threshold"
          change="Passing"
          changeType="positive"
          icon={<ShieldCheck className="h-4 w-4 text-[var(--text-secondary)]" />}
        />
        <MetricCard
          label="Substandard Patch Rejections"
          value="2"
          unit="Failed"
          caption="Escalated for contractor re-work"
          change="Zero Escapes"
          changeType="negative"
          icon={<Clock className="h-4 w-4 text-rose-400" />}
        />
        <MetricCard
          label="Active Auditing Bus Fleet"
          value="4"
          unit="Buses"
          caption="Continuous passive road inspection"
          change="Always Scanning"
          changeType="positive"
          icon={<Bus className="h-4 w-4 text-[var(--text-secondary)]" />}
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 shrink-0">
        <div className="flex flex-1 items-center gap-2 rounded-lg border border-[var(--surface-border)] bg-[var(--surface-panel)] px-3.5 py-1.5">
          <Search className="h-4 w-4 text-[var(--text-secondary)] shrink-0" />
          <input
            type="text"
            placeholder="Search audit records (Ticket ID, road, contractor)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs font-mono text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
          />
        </div>

        <div className="flex items-center gap-1 rounded-lg border border-[var(--surface-border)] bg-[var(--surface-panel)] p-1 text-[11px] font-mono">
          {['ALL', 'Verified Smooth', 'Defect Persists'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`rounded px-2.5 py-1 transition-all cursor-pointer ${
                statusFilter === st ? 'bg-[var(--surface-subtle)] text-[var(--text-primary)] font-bold' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Main Full-Height Content Stack */}
      <div className="flex flex-1 flex-col gap-3 sm:gap-4">
        {/* Audit Log Table */}
        <div className="w-full rounded-xl border border-[var(--surface-border)] bg-[var(--surface-panel)] p-3 sm:p-4 shadow-sm">
          <div className="mb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
            <div>
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                Closed-Loop Autonomous Bus Pass Re-Audit Stream
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                When contractors mark repairs complete, subsequent bus passes automatically verify road smoothness using camera + IMU fusion
              </p>
            </div>
            <span className="self-start sm:self-auto rounded border border-[var(--surface-border)] bg-[var(--surface-subtle)]/50 px-2.5 py-1 text-xs font-mono text-[var(--text-secondary)]">
              Self-Auditing Infrastructure
            </span>
          </div>

          <div className="w-full overflow-x-auto">
            <DataTable<AutoAuditRecord>
              columns={columns}
              data={filtered}
              keyExtractor={(a) => a.ticketId}
              onRowClick={(a) => setSelectedTicketId(a.ticketId)}
            />
          </div>
        </div>

        {/* Selected Audit Record Details Panel */}
        {activeAudit && (
          <div className="w-full rounded-xl border border-[var(--surface-border)] bg-[var(--surface-panel)] p-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--surface-subtle)] border border-[var(--color-accent-primary)] text-[var(--text-secondary)] shrink-0">
                <FileCheck className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-bold text-[var(--text-primary)]">
                    {activeAudit.ticketId}
                  </span>
                  <span className="text-xs text-[var(--text-secondary)]">· {activeAudit.roadName}</span>
                  <span
                    className={`rounded border px-2 py-0.5 text-[10px] font-mono font-bold ${
                      activeAudit.auditResult === 'Verified Smooth'
                        ? 'border-emerald-800/40 bg-emerald-950/40 text-emerald-300'
                        : 'border-rose-800/40 bg-rose-950/40 text-rose-400'
                    }`}
                  >
                    {activeAudit.auditResult}
                  </span>
                  <span className="rounded border border-[var(--surface-border)] bg-[var(--surface-canvas)] px-2 py-0.5 text-[10px] font-mono text-[var(--text-secondary)]">
                    Milestone: {formatCurrency(activeAudit.milestonePaymentInr)}
                  </span>
                </div>
                <p className="text-xs text-[var(--text-secondary)]">
                  Contractor: <span className="text-[var(--text-primary)] font-medium">{activeAudit.contractor}</span> · Repaired: <span className="text-[var(--text-primary)]">{activeAudit.repairDate}</span> · IMU Reading: <span className="font-mono font-bold text-emerald-400">{activeAudit.postRepairZSpike}g (Threshold &lt;1.5g)</span>
                </p>
                <div className="flex items-center gap-2 text-[11px] font-mono text-[var(--text-muted)]">
                  <span>Verified Pass by: {activeAudit.verifiedByBus}</span>
                  <span>· Status: <strong className="text-[var(--text-primary)]">{activeAudit.paymentStatus}</strong></span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto pt-2 lg:pt-0">
              {activeAudit.auditResult === 'Verified Smooth' ? (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => releaseContractorPayment(activeAudit.ticketId)}
                  disabled={activeAudit.paymentStatus === 'Payment Released'}
                  className={`text-xs font-bold ${
                    activeAudit.paymentStatus === 'Payment Released'
                      ? 'bg-[var(--surface-subtle)] text-[var(--text-secondary)] cursor-default'
                      : 'bg-[#2563eb] text-[var(--text-primary)] hover:bg-[var(--surface-subtle)]'
                  }`}
                >
                  <CreditCard className="h-3.5 w-3.5" />
                  <span>
                    {activeAudit.paymentStatus === 'Payment Released'
                      ? 'Payment Dispatched'
                      : 'Release Contractor Milestone Payment'}
                  </span>
                </Button>
              ) : (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => demandWarrantyRectification(activeAudit.ticketId)}
                  disabled={activeAudit.paymentStatus === 'Rectification Demanded'}
                  className="text-xs font-bold"
                >
                  <AlertOctagon className="h-3.5 w-3.5" />
                  <span>
                    {activeAudit.paymentStatus === 'Rectification Demanded'
                      ? 'Rectification Claim Raised'
                      : 'Demand 24-Hour Warranty Rectification'}
                  </span>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
