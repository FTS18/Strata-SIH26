'use client';

import React from 'react';
import { Drawer } from '@/components/ui/Drawer';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { type RoadDefect } from '@/types';
import { Activity, Wrench, ShieldAlert, Cpu, Eye, MapPin, Bus } from 'lucide-react';
import { formatTimestamp } from '@/lib/utils';

export interface DefectInspectionDrawerProps {
  defect: RoadDefect | null;
  isOpen: boolean;
  onClose: () => void;
  onCreateWorkOrder: (defect: RoadDefect) => void;
}

export function DefectInspectionDrawer({
  defect,
  isOpen,
  onClose,
  onCreateWorkOrder,
}: DefectInspectionDrawerProps) {
  if (!defect) return null;

  const isCritical = defect.severity === 'critical';

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={`Defect #${defect.id.slice(-6)}`}
      subtitle={`${defect.coords.lat.toFixed(5)}° N, ${defect.coords.lng.toFixed(5)}° E`}
      badge={
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${
          isCritical
            ? 'bg-rose-950/70 border-rose-600/80 text-rose-400'
            : 'bg-amber-950/70 border-amber-600/80 text-amber-400'
        }`}>
          <span className={`h-1.5 w-1.5 rounded-full ${isCritical ? 'bg-rose-400 animate-pulse' : 'bg-amber-400'}`} />
          {defect.severity}
        </span>
      }
      footer={
        <div className="flex items-center justify-between gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="border-[#12544F] bg-[#092328] text-[#8BBB92] hover:bg-[#12544F]/50 hover:text-[#f0fdf4] font-mono text-xs"
          >
            Dismiss
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="bg-[#12544F] border border-[#2A835F] text-[#f0fdf4] hover:bg-[#2A835F] font-mono text-xs font-semibold shadow-lg shadow-[#12544F]/40"
            onClick={() => {
              onCreateWorkOrder(defect);
              onClose();
            }}
          >
            <Wrench className="h-3.5 w-3.5 text-[#8BBB92]" />
            <span>Generate PWD Work Order</span>
          </Button>
        </div>
      }
    >
      {/* 1. Photographic Defect Evidence */}
      <div className="relative overflow-hidden rounded-xl border border-[#12544F] bg-black shadow-xl group">
        <img
          src={defect.proofImageUrl || 'https://images.unsplash.com/photo-1515865644861-8bedc4fb2344?w=800&auto=format&fit=crop&q=80'}
          alt="Defect visual evidence"
          className="h-48 w-full object-cover opacity-85"
        />

        {/* AI Bounding Box Overlay */}
        <div className="absolute inset-0 pointer-events-none p-3 flex flex-col justify-between bg-gradient-to-t from-black/80 via-transparent to-black/60">
          {/* Top HUD Tag */}
          <div className="flex items-center justify-between text-[10px] font-mono text-[#8BBB92]">
            <div className="flex items-center gap-1.5 rounded bg-black/80 px-2 py-0.5 border border-[#12544F]">
              <Cpu className="h-3 w-3 text-emerald-400" />
              <span className="text-[#f0fdf4] font-bold">CAM 1 · FRONT (4K)</span>
            </div>
            <div className="rounded bg-black/80 px-2 py-0.5 border border-[#12544F] text-[#8BBB92]">
              Conf: {(defect.confidenceScore * 100).toFixed(0)}%
            </div>
          </div>

          {/* Center Optical Target Box */}
          <div className="mx-auto my-auto w-36 h-20 border-2 border-emerald-400/90 rounded-sm relative shadow-[0_0_12px_rgba(16,185,129,0.5)]">
            <span className="absolute -top-3 left-1 bg-emerald-950/90 border border-emerald-500 text-emerald-300 font-mono text-[8.5px] px-1 py-0.2 rounded">
              YOLOv8: {defect.type.replace('_', ' ').toUpperCase()}
            </span>
          </div>

          {/* Bottom GPS Watermark Stamp */}
          <div className="flex items-center justify-between text-[9px] font-mono text-[#8BBB92] bg-black/75 px-2 py-0.5 rounded border border-[#12544F]">
            <span>{defect.coords.lat.toFixed(5)}°N, {defect.coords.lng.toFixed(5)}°E</span>
            <span className="text-emerald-400 font-bold">INSPECTED</span>
          </div>
        </div>
      </div>

      {/* 2. Sensor-Vision IMU Fusion Panel */}
      <div className="rounded-xl border border-[#12544F] bg-[#0d3137] p-3.5 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#f0fdf4]">
            <Activity className="h-4 w-4 text-[#8BBB92]" />
            <span>IMU Accelerometer Z-Axis Verification</span>
          </div>
          <span className="rounded border border-[#2A835F] bg-[#12544F] px-2 py-0.5 text-[10px] font-mono text-[#8BBB92]">
            Physical Impact Verified
          </span>
        </div>

        {/* Accelerometer Vertical Vibration Spectrum */}
        <div className="flex h-10 items-end gap-1 rounded-lg bg-[#092328] p-2 border border-[#12544F]">
          <div className="flex-1 bg-[#12544F] h-2 rounded-xs" />
          <div className="flex-1 bg-[#12544F] h-3 rounded-xs" />
          <div className="flex-1 bg-[#12544F] h-2 rounded-xs" />
          <div className="flex-1 bg-[#2A835F] h-4 rounded-xs" />
          <div className={`flex-1 ${isCritical ? 'bg-rose-500 h-8 shadow-[0_0_8px_#ef4444]' : 'bg-amber-500 h-6 shadow-[0_0_8px_#f59e0b]'} rounded-xs animate-pulse`} />
          <div className="flex-1 bg-[#2A835F] h-5 rounded-xs" />
          <div className="flex-1 bg-[#12544F] h-3 rounded-xs" />
          <div className="flex-1 bg-[#12544F] h-2 rounded-xs" />
          <div className="flex-1 bg-[#12544F] h-3 rounded-xs" />
          <div className="flex-1 bg-[#12544F] h-2 rounded-xs" />
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono">
          <span className="text-[#8BBB92]">
            Peak Vibration: <strong className={isCritical ? 'text-rose-400' : 'text-amber-400'}>{defect.imuVibrationZ}g</strong>
          </span>
          <span className="text-[#5b9076]">Threshold: 2.2g</span>
        </div>
      </div>

      {/* 3. Operational Metadata Ledger */}
      <div className="rounded-xl border border-[#12544F] bg-[#0d3137] divide-y divide-[#12544F] text-xs font-mono">
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-1.5 text-[#8BBB92]">
            <MapPin className="h-3.5 w-3.5 text-[#5b9076]" />
            <span>Corridor / Road</span>
          </div>
          <span className="font-semibold text-[#f0fdf4] text-right truncate max-w-[60%]">{defect.roadName}</span>
        </div>
        <div className="flex items-center justify-between p-3">
          <span className="text-[#8BBB92]">Estimated Surface Area</span>
          <span className="tabular-nums text-[#f0fdf4] font-bold">{defect.estimatedAreaSqM} m²</span>
        </div>
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-1.5 text-[#8BBB92]">
            <Bus className="h-3.5 w-3.5 text-[#5b9076]" />
            <span>Sensing CTU Bus</span>
          </div>
          <span className="text-[#8BBB92] font-bold">{defect.detectedByBusId}</span>
        </div>
        <div className="flex items-center justify-between p-3">
          <span className="text-[#8BBB92]">Cross-Pass Validation</span>
          <span className="text-[#f0fdf4]">{defect.observationsCount} Passes Verified</span>
        </div>
        <div className="flex items-center justify-between p-3">
          <span className="text-[#8BBB92]">Detection Timestamp</span>
          <span className="text-[#f0fdf4]">{formatTimestamp(defect.detectedAt)}</span>
        </div>
      </div>
    </Drawer>
  );
}
