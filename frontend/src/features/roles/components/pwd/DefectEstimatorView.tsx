'use client';

import React, { useState } from 'react';
import { Calculator, Layers, AlertTriangle, ArrowRight, Check, Download, CheckCircle2, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import { useWorkOrderStore } from '@/features/roles/stores/workOrderStore';
import { exportPwdTenderDossier } from '@/lib/pdfExporter';

export function DefectEstimatorView() {
  const [selectedRoad, setSelectedRoad] = useState('Madhya Marg (Near Sec 26 Grain Market)');
  const [areaSqM, setAreaSqM] = useState<number>(3.8);
  const [depthCm, setDepthCm] = useState<number>(7.5);
  const [asphaltDensity, setAsphaltDensity] = useState<number>(2.4); // tonnes/m^3 standard
  const [ratePerTonneInr, setRatePerTonneInr] = useState<number>(5500);

  const createCustomTicket = useWorkOrderStore((state) => state.createCustomTicket);
  const activeToast = useWorkOrderStore((state) => state.activeToast);

  // Volumetric formula: Area (m^2) * (Depth (cm) / 100) * Density (t/m^3)
  const volumeM3 = areaSqM * (depthCm / 100);
  const asphaltTons = volumeM3 * asphaltDensity;
  const estimatedCost = asphaltTons * ratePerTonneInr;
  const laborAndCompactionCost = 3500;
  const totalCost = estimatedCost + laborAndCompactionCost;

  const handleGenerateWorkOrder = () => {
    createCustomTicket({
      defectId: `DEF-${Math.floor(10000 + Math.random() * 90000)}`,
      title: `Bituminous Resurfacing: ${asphaltTons.toFixed(1)} MT Spec`,
      locationName: selectedRoad,
      coords: { lat: 30.7315, lng: 76.8140 },
      severity: asphaltTons > 2.0 ? 'critical' : 'high',
      status: 'detected',
      estimatedAsphaltTons: Number(asphaltTons.toFixed(2)),
      estimatedCostInr: Math.round(totalCost),
      deadlineAt: Date.now() + 3600000 * 48,
    });
  };

  const handleExportPdf = () => {
    exportPwdTenderDossier({
      workOrderId: `WO-TEND-${Math.floor(1000 + Math.random() * 9000)}`,
      roadName: selectedRoad,
      estimatedAsphaltTons: asphaltTons,
      totalCostInr: Math.round(totalCost),
      areaSqM,
      depthCm,
      asphaltDensity,
      deadlineHours: 48,
    });
  };

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto p-5 bg-[var(--surface-canvas)] text-[var(--text-primary)]">
      {/* Toast Notification Banner */}
      {activeToast && (
        <div className="flex items-center justify-between rounded-lg border border-[var(--color-accent-primary)] bg-[var(--surface-subtle)] px-4 py-2 font-mono text-xs text-[var(--text-primary)] shadow-md animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-[var(--text-secondary)]" />
            <span>{activeToast}</span>
          </div>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--surface-border)] pb-3 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--surface-subtle)] border border-[var(--color-accent-primary)] text-[var(--text-secondary)]">
            <Calculator className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">
              Automated PWD Material & Asphalt Tonnage Estimator
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              Physics-based volumetric calculations derived from optical polygon area and IMU Z-axis depth estimation
            </p>
          </div>
        </div>

        <span className="self-start sm:self-auto rounded border border-[var(--surface-border)] bg-[var(--surface-panel)] px-3 py-1 text-xs font-mono text-[var(--text-secondary)]">
          CPWD Rate Schedule 2026
        </span>
      </div>

      {/* Corridor Target Selector Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-lg border border-[var(--surface-border)] bg-[var(--surface-panel)] px-4 py-2.5 font-mono text-xs">
        <span className="text-[var(--text-secondary)] font-semibold">TARGET CORRIDOR CLUSTER:</span>
        <select
          value={selectedRoad}
          onChange={(e) => setSelectedRoad(e.target.value)}
          className="bg-[var(--surface-canvas)] text-[var(--text-primary)] border border-[var(--surface-border)] rounded px-3 py-1 text-xs outline-none"
        >
          <option value="Madhya Marg (Near Sec 26 Grain Market)">Madhya Marg (Near Sec 26 Grain Market)</option>
          <option value="Tribune Chowk Flyover Approach (Dakshin Marg)">Tribune Chowk Flyover Approach (Dakshin Marg)</option>
          <option value="Jan Marg (Sector 17/18 Light Point)">Jan Marg (Sector 17/18 Light Point)</option>
          <option value="Panjab University Gate 2 (Sector 14 Corridor)">Panjab University Gate 2 (Sector 14 Corridor)</option>
        </select>
      </div>

      {/* Main Calculation Grid */}
      <div className="grid flex-1 grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 overflow-y-auto">
        {/* Left: Input Parameters */}
        <div className="flex flex-col gap-4 rounded-xl border border-[var(--surface-border)] bg-[var(--surface-panel)] p-5 shadow-sm">
          <h3 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider font-mono">
            Optical & Sensor Parameters
          </h3>

          <div className="space-y-4 text-xs font-mono">
            <div>
              <div className="flex justify-between pb-1 text-[var(--text-secondary)]">
                <span>Pothole Surface Area:</span>
                <span className="text-[var(--text-primary)] font-bold">{areaSqM} m²</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="15.0"
                step="0.1"
                value={areaSqM}
                onChange={(e) => setAreaSqM(parseFloat(e.target.value))}
                className="w-full accent-[#94a3b8] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between pb-1 text-[var(--text-secondary)]">
                <span>Estimated Defect Depth (from IMU Z-Spike):</span>
                <span className="text-[var(--text-primary)] font-bold">{depthCm} cm</span>
              </div>
              <input
                type="range"
                min="2.0"
                max="20.0"
                step="0.5"
                value={depthCm}
                onChange={(e) => setDepthCm(parseFloat(e.target.value))}
                className="w-full accent-[#94a3b8] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between pb-1 text-[var(--text-secondary)]">
                <span>Bituminous Concrete Density (VG-30):</span>
                <span className="text-[var(--text-primary)] font-bold">{asphaltDensity} tonnes/m³</span>
              </div>
              <input
                type="range"
                min="2.0"
                max="2.6"
                step="0.05"
                value={asphaltDensity}
                onChange={(e) => setAsphaltDensity(parseFloat(e.target.value))}
                className="w-full accent-[#94a3b8] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between pb-1 text-[var(--text-secondary)]">
                <span>PWD Asphalt Rate per Tonne:</span>
                <span className="text-[var(--text-primary)] font-bold">₹{ratePerTonneInr} / MT</span>
              </div>
              <input
                type="range"
                min="3000"
                max="9000"
                step="250"
                value={ratePerTonneInr}
                onChange={(e) => setRatePerTonneInr(parseFloat(e.target.value))}
                className="w-full accent-[#94a3b8] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right: Output Material Bill & Tendering Preview */}
        <div className="flex flex-col justify-between rounded-xl border border-[var(--surface-border)] bg-[var(--surface-panel)] p-5 shadow-sm">
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider font-mono">
              Generated Material Bill & Work Order Specs
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-[var(--surface-border)] bg-[var(--surface-canvas)] p-3.5">
                <span className="text-xs text-[var(--text-secondary)]">Asphalt Required</span>
                <div className="mt-1 font-display text-2xl font-bold text-[var(--text-primary)]">
                  {asphaltTons.toFixed(2)} <span className="text-xs font-mono text-[var(--text-secondary)]">MT</span>
                </div>
                <span className="text-[10px] font-mono text-[var(--text-muted)]">Volume: {volumeM3.toFixed(3)} m³</span>
              </div>

              <div className="rounded-lg border border-[var(--surface-border)] bg-[var(--surface-canvas)] p-3.5">
                <span className="text-xs text-[var(--text-secondary)]">Approved Budget</span>
                <div className="mt-1 font-display text-2xl font-bold text-[var(--text-secondary)]">
                  {formatCurrency(totalCost)}
                </div>
                <span className="text-[10px] font-mono text-[var(--text-muted)]">Incl. labor & compaction</span>
              </div>
            </div>

            <div className="rounded-lg border border-[var(--surface-border)] bg-[var(--surface-subtle)]/40 p-3.5 text-xs font-mono space-y-1.5 text-[var(--text-secondary)]">
              <div className="flex justify-between">
                <span>Material Cost (Asphalt VG-30):</span>
                <span className="text-[var(--text-primary)]">{formatCurrency(estimatedCost)}</span>
              </div>
              <div className="flex justify-between">
                <span>Labor & Compaction Machinery:</span>
                <span className="text-[var(--text-primary)]">{formatCurrency(laborAndCompactionCost)}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-[var(--surface-border)] font-bold text-[var(--text-primary)]">
                <span>Total Work Order Estimate:</span>
                <span className="text-[var(--text-secondary)]">{formatCurrency(totalCost)}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-[var(--surface-border)] mt-4">
            <Button
              variant="primary"
              size="md"
              onClick={handleGenerateWorkOrder}
              className="flex-1 justify-center bg-[#94a3b8] text-[#080e1a] font-bold hover:bg-[#f8fafc] text-xs"
            >
              <Wrench className="h-4 w-4" />
              <span>Generate PWD Work Order</span>
            </Button>

            <Button
              variant="secondary"
              size="md"
              onClick={handleExportPdf}
              className="bg-[var(--surface-subtle)] text-[var(--text-primary)] border-[var(--color-accent-primary)] hover:bg-[#2563eb] text-xs font-semibold justify-center"
            >
              <Download className="h-4 w-4" />
              <span>Export Tender PDF</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
