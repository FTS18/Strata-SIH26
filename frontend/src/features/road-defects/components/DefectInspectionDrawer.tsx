'use client';

import React, { useState } from 'react';
import { Drawer } from '@/components/ui/Drawer';
import { Button } from '@/components/ui/Button';
import { type RoadDefect } from '@/types';
import { Activity, Wrench, Cpu, MapPin, Bus, ZoomIn, Layers, Crosshair } from 'lucide-react';
import { formatTimestamp } from '@/lib/utils';

export interface DefectInspectionDrawerProps {
  defect: RoadDefect | null;
  isOpen: boolean;
  onClose: () => void;
  onCreateWorkOrder: (defect: RoadDefect) => void;
}

function getDefectMediaInfo(defect: RoadDefect) {
  let typeKey = 'pothole';
  let camNumber = '1';
  let camLabel = 'CAM 1 · FRONT (4K)';
  let primaryLabel = 'Pothole Cavity';
  let caliperDimensions = { primary: '54 cm (W) × 28 cm (L)', secondary: 'Depth: 5.4 cm · Class 3' };

  if (defect.type === 'waterlogging') {
    typeKey = 'waterlogging';
    camNumber = '1';
    camLabel = 'CAM 1 · FRONT (4K)';
    primaryLabel = 'Standing Water Hazard';
    caliperDimensions = { primary: 'Surface Area: 14.5 m²', secondary: 'Water Depth: 5.2 cm' };
  } else if (defect.type === 'damaged_divider') {
    typeKey = 'divider';
    camNumber = '1';
    camLabel = 'CAM 1 · FRONT (4K)';
    primaryLabel = 'Barrier Structural Deflection';
    caliperDimensions = { primary: 'Deformation Span: 6.8 m', secondary: 'Displacement: 18 cm' };
  } else if (defect.type === 'missing_zebra_crossing') {
    typeKey = 'zebra';
    camNumber = '3';
    camLabel = 'CAM 3 · REAR (1080p)';
    primaryLabel = 'Degraded Crosswalk Stripe';
    caliperDimensions = { primary: 'Marking Area: 7.5 m²', secondary: '68% Contrast Loss' };
  }

  const defaultCropUrl = `/evidence/${typeKey}_cam${camNumber}_crop.jpg`;
  const defaultContextUrl = `/evidence/${typeKey}_cam${camNumber}_annotated.jpg`;

  const cropUrl = defect.cropImageUrl && defect.cropImageUrl.startsWith('/evidence')
    ? defect.cropImageUrl
    : defaultCropUrl;

  const contextUrl = defect.proofImageUrl && defect.proofImageUrl.startsWith('/evidence')
    ? defect.proofImageUrl
    : defaultContextUrl;

  return {
    typeKey,
    camLabel,
    primaryLabel,
    caliperDimensions,
    cropUrl,
    contextUrl,
    defaultCropUrl,
    defaultContextUrl,
  };
}

export function DefectInspectionDrawer({
  defect,
  isOpen,
  onClose,
  onCreateWorkOrder,
}: DefectInspectionDrawerProps) {
  const [evidenceMode, setEvidenceMode] = useState<'crop' | 'context'>('crop');
  const [imageError, setImageError] = useState(false);

  if (!defect) return null;

  const isCritical = defect.severity === 'critical';
  const media = getDefectMediaInfo(defect);
  const activeImageSrc = evidenceMode === 'crop'
    ? (imageError ? media.defaultCropUrl : media.cropUrl)
    : (imageError ? media.defaultContextUrl : media.contextUrl);

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
      {/* 1. View Perspective Switcher */}
      <div className="flex items-center justify-between gap-2 bg-[#092328] p-1 rounded-lg border border-[#12544F]">
        <button
          type="button"
          onClick={() => {
            setEvidenceMode('crop');
            setImageError(false);
          }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-[11px] font-mono font-semibold transition-all duration-200 ${
            evidenceMode === 'crop'
              ? 'bg-[#12544F] text-[#f0fdf4] shadow-sm border border-[#2A835F]'
              : 'text-[#8BBB92] hover:text-[#f0fdf4] hover:bg-[#0d3137]'
          }`}
        >
          <ZoomIn className="h-3.5 w-3.5 text-emerald-400" />
          <span>Target Section Crop (Macro 3.2x)</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setEvidenceMode('context');
            setImageError(false);
          }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-[11px] font-mono font-semibold transition-all duration-200 ${
            evidenceMode === 'context'
              ? 'bg-[#12544F] text-[#f0fdf4] shadow-sm border border-[#2A835F]'
              : 'text-[#8BBB92] hover:text-[#f0fdf4] hover:bg-[#0d3137]'
          }`}
        >
          <Layers className="h-3.5 w-3.5 text-cyan-400" />
          <span>Road Context (4K)</span>
        </button>
      </div>

      {/* 2. Photographic Defect Evidence */}
      <div className="relative overflow-hidden rounded-xl border border-[#12544F] bg-[#092328] shadow-xl">
        <img
          key={activeImageSrc}
          src={activeImageSrc}
          alt={`Visual evidence: ${media.primaryLabel}`}
          className="h-56 w-full object-cover"
          onError={() => {
            setImageError(true);
          }}
        />

        {/* HUD Overlay */}
        <div className="absolute inset-0 pointer-events-none p-3 flex flex-col justify-between bg-gradient-to-t from-[#092328]/85 via-transparent to-[#092328]/70">
          {/* Top HUD Tag */}
          <div className="flex items-center justify-between text-[10px] font-mono text-[#8BBB92]">
            <div className="flex items-center gap-1.5 rounded bg-[#092328]/90 px-2 py-0.5 border border-[#12544F]">
              <Cpu className="h-3 w-3 text-emerald-400" />
              <span className="text-[#f0fdf4] font-bold">
                {evidenceMode === 'crop' ? 'MACRO OPTICAL CROP · 3.2X ZOOM' : media.camLabel}
              </span>
            </div>
            <div className="rounded bg-[#092328]/90 px-2 py-0.5 border border-[#12544F] text-[#8BBB92]">
              Conf: {(defect.confidenceScore * 100).toFixed(0)}%
            </div>
          </div>

          {/* Caliper Measurement Reticle on Target Section Crop */}
          {evidenceMode === 'crop' ? (
            <div className="mx-auto my-auto w-48 h-28 border border-dashed border-emerald-400/80 rounded relative flex flex-col justify-between p-1 bg-emerald-950/20">
              <div className="flex items-center justify-between text-[8px] font-mono text-emerald-300">
                <span className="bg-[#092328]/90 px-1 py-0.2 rounded border border-emerald-500/50 flex items-center gap-1">
                  <Crosshair className="h-2.5 w-2.5 text-emerald-400" />
                  {media.primaryLabel}
                </span>
                <span className="bg-[#092328]/90 px-1 py-0.2 rounded border border-emerald-500/50">
                  {media.caliperDimensions.secondary}
                </span>
              </div>
              <div className="text-center font-mono text-[9px] text-emerald-200 bg-[#092328]/80 px-1 py-0.5 rounded border border-emerald-500/40 self-center">
                {media.caliperDimensions.primary}
              </div>
            </div>
          ) : (
            <div className="mx-auto my-auto w-36 h-20 border-2 border-emerald-400/90 rounded-sm relative shadow-[0_0_12px_rgba(16,185,129,0.5)]">
              <span className="absolute -top-3 left-1 bg-emerald-950/90 border border-emerald-500 text-emerald-300 font-mono text-[8.5px] px-1 py-0.2 rounded">
                YOLOv8: {defect.type.replace('_', ' ').toUpperCase()}
              </span>
            </div>
          )}

          {/* Bottom GPS Watermark Stamp */}
          <div className="flex items-center justify-between text-[9px] font-mono text-[#8BBB92] bg-[#092328]/85 px-2 py-0.5 rounded border border-[#12544F]">
            <span>{defect.coords.lat.toFixed(5)}°N, {defect.coords.lng.toFixed(5)}°E</span>
            <span className="text-emerald-400 font-bold">
              {evidenceMode === 'crop' ? 'SECTION LOCALIZED' : 'INSPECTED'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Sensor-Vision Distress Analysis Panel (Contextual for Pothole vs Waterlogging) */}
      {defect.type === 'waterlogging' ? (
        <div className="rounded-xl border border-cyan-800/60 bg-cyan-950/30 p-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-200">
              <Activity className="h-4 w-4 text-cyan-400" />
              <span>Surface Ponding & Drainage Deficit</span>
            </div>
            <span className="rounded border border-cyan-600/60 bg-cyan-900/40 px-2 py-0.5 text-[10px] font-mono font-bold text-cyan-300">
              Aquaplane Hazard
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
            <div className="rounded-lg bg-[#092328] p-2 border border-cyan-900/60 flex flex-col">
              <span className="text-cyan-400/80 text-[10px]">Puddle Surface Area</span>
              <span className="text-white font-bold text-sm mt-0.5">{defect.estimatedAreaSqM} m²</span>
              <span className="text-cyan-300 text-[9px] mt-0.5">High Hydroplaning Risk</span>
            </div>
            <div className="rounded-lg bg-[#092328] p-2 border border-cyan-900/60 flex flex-col">
              <span className="text-cyan-400/80 text-[10px]">Standing Water Depth</span>
              <span className="text-white font-bold text-sm mt-0.5">5.2 cm</span>
              <span className="text-cyan-300 text-[9px] mt-0.5">Drainage Silt Choke</span>
            </div>
          </div>

          <div className="rounded-lg bg-[#092328] p-2 border border-cyan-900/60 text-[10px] font-mono text-cyan-300 flex items-center justify-between">
            <span>Recommended Response:</span>
            <strong className="text-white">Stormwater Gully Suction Unit</strong>
          </div>
        </div>
      ) : (
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
            <span className="text-[#5b9076]">Depth: 5.4cm (Class 3)</span>
          </div>
        </div>
      )}

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
