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
    <div className="flex h-full flex-col gap-4 overflow-y-auto p-5 bg-[#092328] text-[#f0fdf4]">
      {/* Toast Notification Banner */}
      {activeToast && (
        <div className="flex items-center justify-between rounded-lg border border-[#2A835F] bg-[#12544F] px-4 py-2 font-mono text-xs text-[#f0fdf4] shadow-md animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-[#8BBB92]" />
            <span>{activeToast}</span>
          </div>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#12544F] pb-3 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#12544F] border border-[#2A835F] text-[#8BBB92]">
            <Calculator className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-[#f0fdf4]">
              Automated PWD Material & Asphalt Tonnage Estimator
            </h2>
            <p className="text-xs text-[#8BBB92]">
              Physics-based volumetric calculations derived from optical polygon area and IMU Z-axis depth estimation
            </p>
          </div>
        </div>

        <span className="self-start sm:self-auto rounded border border-[#12544F] bg-[#0d3137] px-3 py-1 text-xs font-mono text-[#8BBB92]">
          CPWD Rate Schedule 2026
        </span>
      </div>

      {/* Corridor Target Selector Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-lg border border-[#12544F] bg-[#0d3137] px-4 py-2.5 font-mono text-xs">
        <span className="text-[#8BBB92] font-semibold">TARGET CORRIDOR CLUSTER:</span>
        <select
          value={selectedRoad}
          onChange={(e) => setSelectedRoad(e.target.value)}
          className="bg-[#092328] text-[#f0fdf4] border border-[#12544F] rounded px-3 py-1 text-xs outline-none"
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
        <div className="flex flex-col gap-4 rounded-xl border border-[#12544F] bg-[#0d3137] p-5 shadow-sm">
          <h3 className="text-xs font-semibold text-[#8BBB92] uppercase tracking-wider font-mono">
            Optical & Sensor Parameters
          </h3>

          <div className="space-y-4 text-xs font-mono">
            <div>
              <div className="flex justify-between pb-1 text-[#8BBB92]">
                <span>Pothole Surface Area:</span>
                <span className="text-[#f0fdf4] font-bold">{areaSqM} m²</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="15.0"
                step="0.1"
                value={areaSqM}
                onChange={(e) => setAreaSqM(parseFloat(e.target.value))}
                className="w-full accent-[#8BBB92] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between pb-1 text-[#8BBB92]">
                <span>Estimated Defect Depth (from IMU Z-Spike):</span>
                <span className="text-[#f0fdf4] font-bold">{depthCm} cm</span>
              </div>
              <input
                type="range"
                min="2.0"
                max="20.0"
                step="0.5"
                value={depthCm}
                onChange={(e) => setDepthCm(parseFloat(e.target.value))}
                className="w-full accent-[#8BBB92] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between pb-1 text-[#8BBB92]">
                <span>Bituminous Concrete Density (VG-30):</span>
                <span className="text-[#f0fdf4] font-bold">{asphaltDensity} tonnes/m³</span>
              </div>
              <input
                type="range"
                min="2.0"
                max="2.6"
                step="0.05"
                value={asphaltDensity}
                onChange={(e) => setAsphaltDensity(parseFloat(e.target.value))}
                className="w-full accent-[#8BBB92] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between pb-1 text-[#8BBB92]">
                <span>PWD Asphalt Rate per Tonne:</span>
                <span className="text-[#f0fdf4] font-bold">₹{ratePerTonneInr} / MT</span>
              </div>
              <input
                type="range"
                min="3000"
                max="9000"
                step="250"
                value={ratePerTonneInr}
                onChange={(e) => setRatePerTonneInr(parseFloat(e.target.value))}
                className="w-full accent-[#8BBB92] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right: Output Material Bill & Tendering Preview */}
        <div className="flex flex-col justify-between rounded-xl border border-[#12544F] bg-[#0d3137] p-5 shadow-sm">
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-[#8BBB92] uppercase tracking-wider font-mono">
              Generated Material Bill & Work Order Specs
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-[#12544F] bg-[#092328] p-3.5">
                <span className="text-xs text-[#8BBB92]">Asphalt Required</span>
                <div className="mt-1 font-display text-2xl font-bold text-[#f0fdf4]">
                  {asphaltTons.toFixed(2)} <span className="text-xs font-mono text-[#8BBB92]">MT</span>
                </div>
                <span className="text-[10px] font-mono text-[#5b9076]">Volume: {volumeM3.toFixed(3)} m³</span>
              </div>

              <div className="rounded-lg border border-[#12544F] bg-[#092328] p-3.5">
                <span className="text-xs text-[#8BBB92]">Approved Budget</span>
                <div className="mt-1 font-display text-2xl font-bold text-[#8BBB92]">
                  {formatCurrency(totalCost)}
                </div>
                <span className="text-[10px] font-mono text-[#5b9076]">Incl. labor & compaction</span>
              </div>
            </div>

            <div className="rounded-lg border border-[#12544F] bg-[#12544F]/40 p-3.5 text-xs font-mono space-y-1.5 text-[#8BBB92]">
              <div className="flex justify-between">
                <span>Material Cost (Asphalt VG-30):</span>
                <span className="text-[#f0fdf4]">{formatCurrency(estimatedCost)}</span>
              </div>
              <div className="flex justify-between">
                <span>Labor & Compaction Machinery:</span>
                <span className="text-[#f0fdf4]">{formatCurrency(laborAndCompactionCost)}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-[#12544F] font-bold text-[#f0fdf4]">
                <span>Total Work Order Estimate:</span>
                <span className="text-[#8BBB92]">{formatCurrency(totalCost)}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-[#12544F] mt-4">
            <Button
              variant="primary"
              size="md"
              onClick={handleGenerateWorkOrder}
              className="flex-1 justify-center bg-[#8BBB92] text-[#092328] font-bold hover:bg-[#f0fdf4] text-xs"
            >
              <Wrench className="h-4 w-4" />
              <span>Generate PWD Work Order</span>
            </Button>

            <Button
              variant="secondary"
              size="md"
              onClick={handleExportPdf}
              className="bg-[#12544F] text-[#f0fdf4] border-[#2A835F] hover:bg-[#2A835F] text-xs font-semibold justify-center"
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
