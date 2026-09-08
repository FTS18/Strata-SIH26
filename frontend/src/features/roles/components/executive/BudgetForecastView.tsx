'use client';

import React from 'react';
import {
  DollarSign,
  Layers,
  PieChart,
  TrendingDown,
  CheckCircle2,
  FileSpreadsheet,
  Check,
} from 'lucide-react';
import { MetricCard } from '@/components/ui/MetricCard';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import { useExecutiveStore, type BudgetAllocation } from '../../stores/executiveStore';
import { exportCpwdBoqDossier } from '@/lib/pdfExporter';

export function BudgetForecastView() {
  const budgetZones = useExecutiveStore((s) => s.budgetZones);
  const selectedZoneId = useExecutiveStore((s) => s.selectedZoneId);
  const setSelectedZoneId = useExecutiveStore((s) => s.setSelectedZoneId);
  const sanctionZoneBudget = useExecutiveStore((s) => s.sanctionZoneBudget);
  const activeToast = useExecutiveStore((s) => s.activeToast);

  const activeZone = budgetZones.find((b) => b.zoneId === selectedZoneId) || budgetZones[0];

  const handleExportBoq = () => {
    if (!activeZone) return;
    exportCpwdBoqDossier({
      zoneName: activeZone.zoneName,
      chiefEngineer: activeZone.chiefEngineer,
      allocatedBudgetInr: activeZone.allocatedBudgetInr,
      estimatedCostInr: activeZone.estimatedCostInr,
      asphaltTonsRequired: activeZone.asphaltTonsRequired,
      potholesLogged: activeZone.potholesLogged,
      budgetUtilizationPct: activeZone.budgetUtilizationPct,
      sanctionStatus: activeZone.sanctionStatus,
    });
  };

  const columns: Column<BudgetAllocation>[] = [
    { key: 'zoneName', header: 'Municipal Zone' },
    {
      key: 'potholesLogged',
      header: 'Defects Logged',
      align: 'right',
      render: (b) => <span className="font-mono text-[var(--text-primary)] font-semibold">{b.potholesLogged}</span>,
    },
    {
      key: 'asphaltTonsRequired',
      header: 'Asphalt Mix Needed',
      align: 'right',
      render: (b) => <span className="font-mono text-[var(--text-secondary)]">{b.asphaltTonsRequired} MT</span>,
    },
    {
      key: 'estimatedCostInr',
      header: 'Estimated Repair Cost',
      align: 'right',
      render: (b) => <span className="font-mono font-semibold text-[var(--text-primary)]">{formatCurrency(b.estimatedCostInr)}</span>,
    },
    {
      key: 'allocatedBudgetInr',
      header: 'Annual PWD Budget',
      align: 'right',
      render: (b) => <span className="font-mono text-[var(--text-secondary)]">{formatCurrency(b.allocatedBudgetInr)}</span>,
    },
    {
      key: 'budgetUtilizationPct',
      header: 'Budget Utilized',
      align: 'right',
      render: (b) => (
        <span
          className={`inline-flex items-center rounded border px-2 py-0.5 text-[11px] font-mono font-medium ${
            b.budgetUtilizationPct < 60
              ? 'border-[var(--color-accent-primary)] bg-[var(--surface-subtle)] text-[var(--text-secondary)]'
              : 'border-amber-800/40 bg-amber-950/40 text-amber-400 font-bold'
          }`}
        >
          {b.budgetUtilizationPct}%
        </span>
      ),
    },
    {
      key: 'sanctionStatus',
      header: 'Sanction State',
      align: 'center',
      render: (b) => (
        <span
          className={`inline-flex items-center rounded border px-2 py-0.5 text-[10px] font-mono font-bold ${
            b.sanctionStatus === 'Fully Sanctioned'
              ? 'border-emerald-700/50 bg-emerald-950/50 text-emerald-300'
              : 'border-amber-700/50 bg-amber-950/50 text-amber-300'
          }`}
        >
          {b.sanctionStatus}
        </span>
      ),
    },
  ];

  const totalAsphalt = budgetZones.reduce((acc, b) => acc + b.asphaltTonsRequired, 0);
  const totalEstimatedCost = budgetZones.reduce((acc, b) => acc + b.estimatedCostInr, 0);
  const totalAllocated = budgetZones.reduce((acc, b) => acc + b.allocatedBudgetInr, 0);

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
          label="Total Asphalt Required"
          value={totalAsphalt.toFixed(1)}
          unit="MT"
          caption="Hot Bituminous Mix (VG-30)"
          change="AI Volume Calc"
          changeType="neutral"
          icon={<Layers className="h-4 w-4 text-[var(--text-secondary)]" />}
        />
        <MetricCard
          label="Total Repair Budget Estimated"
          value={formatCurrency(totalEstimatedCost)}
          caption="Current open defect pipeline"
          change="Within Budget"
          changeType="positive"
          icon={<DollarSign className="h-4 w-4 text-[var(--text-secondary)]" />}
        />
        <MetricCard
          label="Govt Budget Utilization"
          value={`${((totalEstimatedCost / totalAllocated) * 100).toFixed(1)}%`}
          caption={`Allocated: ${formatCurrency(totalAllocated)}`}
          change="Sustainable"
          changeType="positive"
          icon={<PieChart className="h-4 w-4 text-[var(--text-secondary)]" />}
        />
        <MetricCard
          label="Preventive Cost Savings"
          value="₹34.8 Lakh"
          caption="Saved by early pothole detection"
          change="3.8x ROI"
          changeType="positive"
          icon={<TrendingDown className="h-4 w-4 text-emerald-400" />}
        />
      </div>

      {/* Main Full-Height Content Stack */}
      <div className="flex flex-1 flex-col gap-3 sm:gap-4">
        {/* Main Table Card */}
        <div className="w-full rounded-xl border border-[var(--surface-border)] bg-[var(--surface-panel)] p-3 sm:p-4 shadow-sm">
          <div className="mb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
            <div>
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                Zonal Asphalt Material Allocation & Civil Repair Budgeting
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                Automated bill-of-quantities (BOQ) derived from optical contour sizing and IMU vertical depth inversion
              </p>
            </div>
            <span className="self-start sm:self-auto rounded border border-[var(--surface-border)] bg-[var(--surface-subtle)]/50 px-2.5 py-1 text-xs font-mono text-[var(--text-secondary)]">
              CPWD Schedule of Rates 2026
            </span>
          </div>

          <div className="w-full overflow-x-auto">
            <DataTable<BudgetAllocation>
              columns={columns}
              data={budgetZones}
              keyExtractor={(b) => b.zoneId}
              onRowClick={(b) => setSelectedZoneId(b.zoneId)}
            />
          </div>
        </div>

        {/* Selected Zone Sanction Action Strip */}
        {activeZone && (
          <div className="w-full rounded-xl border border-[var(--surface-border)] bg-[var(--surface-panel)] p-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--surface-subtle)] border border-[var(--color-accent-primary)] text-[var(--text-secondary)] shrink-0">
                <DollarSign className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-bold text-[var(--text-primary)]">
                    {activeZone.zoneName}
                  </span>
                  <span className="text-xs text-[var(--text-secondary)]">· {activeZone.chiefEngineer}</span>
                  <span
                    className={`rounded border px-2 py-0.5 text-[10px] font-mono font-bold ${
                      activeZone.sanctionStatus === 'Fully Sanctioned'
                        ? 'border-emerald-700/50 bg-emerald-950/50 text-emerald-300'
                        : 'border-amber-700/50 bg-amber-950/50 text-amber-300'
                    }`}
                  >
                    {activeZone.sanctionStatus}
                  </span>
                </div>
                <p className="text-xs text-[var(--text-secondary)]">
                  Defects: <span className="text-[var(--text-primary)] font-semibold">{activeZone.potholesLogged}</span> · Required Asphalt: <span className="text-emerald-400 font-mono font-bold">{activeZone.asphaltTonsRequired} MT</span> · Estimated Cost: <span className="text-[var(--text-primary)] font-bold">{formatCurrency(activeZone.estimatedCostInr)}</span>
                </p>
                <p className="text-[11px] font-mono text-[var(--text-muted)]">
                  Annual Allocation: {formatCurrency(activeZone.allocatedBudgetInr)} · Utilization: {activeZone.budgetUtilizationPct}%
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto pt-2 lg:pt-0">
              <Button
                variant="primary"
                size="sm"
                onClick={() => sanctionZoneBudget(activeZone.zoneId)}
                disabled={activeZone.sanctionStatus === 'Fully Sanctioned'}
                className={`text-xs font-bold ${
                  activeZone.sanctionStatus === 'Fully Sanctioned'
                    ? 'bg-[var(--surface-subtle)] text-[var(--text-secondary)] cursor-default'
                    : 'bg-[#94a3b8] text-[#080e1a] hover:bg-[#f8fafc]'
                }`}
              >
                <Check className="h-3.5 w-3.5" />
                <span>
                  {activeZone.sanctionStatus === 'Fully Sanctioned'
                    ? 'Tranche Sanctioned'
                    : 'Sanction Zone Tender Tranche'}
                </span>
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleExportBoq}
                className="bg-[var(--surface-subtle)] text-[var(--text-primary)] border-[var(--color-accent-primary)] hover:bg-[#2563eb] text-xs font-semibold"
              >
                <FileSpreadsheet className="h-3.5 w-3.5" />
                <span>Export CPWD BOQ Bill</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
