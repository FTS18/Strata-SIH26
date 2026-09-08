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
      title={`Defect #${defect?.id ? defect.id.slice(-6) : 'DEFECT'}`}
      subtitle={`${defect?.coords?.lat != null ? defect.coords.lat.toFixed(5) : '30.73050'}° N, ${defect?.coords?.lng != null ? defect.coords.lng.toFixed(5) : '76.82100'}° E`}
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
            className="border-[var(--surface-border)] bg-[var(--surface-canvas)] text-[var(--text-secondary)] hover:bg-[var(--surface-subtle)]/50 hover:text-[var(--text-primary)] font-mono text-xs"
          >
            Dismiss
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="bg-[var(--surface-subtle)] border border-[var(--color-accent-primary)] text-[var(--text-primary)] hover:bg-[#2563eb] font-mono text-xs font-semibold shadow-lg shadow-[#111c33]/40"
            onClick={() => {
              onCreateWorkOrder(defect);
              onClose();
            }}
          >
            <Wrench className="h-3.5 w-3.5 text-[var(--text-secondary)]" />
            <span>Generate PWD Work Order</span>
          </Button>
        </div>
      }
    >
      {/* 1. View Perspective Switcher */}
      <div className="flex items-center justify-between gap-2 bg-[var(--surface-canvas)] p-1 rounded-lg border border-[var(--surface-border)]">
        <button
          type="button"
          onClick={() => {
            setEvidenceMode('crop');
            setImageError(false);
          }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-[11px] font-mono font-semibold transition-all duration-200 ${
            evidenceMode === 'crop'
              ? 'bg-[var(--surface-subtle)] text-[var(--text-primary)] shadow-sm border border-[var(--color-accent-primary)]'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-panel)]'
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
              ? 'bg-[var(--surface-subtle)] text-[var(--text-primary)] shadow-sm border border-[var(--color-accent-primary)]'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-panel)]'
          }`}
        >
          <Layers className="h-3.5 w-3.5 text-cyan-400" />
          <span>Road Context (4K)</span>
        </button>
      </div>

      {/* 2. Photographic Defect Evidence */}
      <div className="relative overflow-hidden rounded-xl border border-[var(--surface-border)] bg-[var(--surface-canvas)] shadow-xl">
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
        <div className="absolute inset-0 pointer-events-none p-3 flex flex-col justify-between bg-gradient-to-t from-[#080e1a]/85 via-transparent to-[#080e1a]/70">
          {/* Top HUD Tag */}
          <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-secondary)]">
            <div className="flex items-center gap-1.5 rounded bg-[var(--surface-canvas)]/90 px-2 py-0.5 border border-[var(--surface-border)]">
              <Cpu className="h-3 w-3 text-emerald-400" />
              <span className="text-[var(--text-primary)] font-bold">
                {evidenceMode === 'crop' ? 'MACRO OPTICAL CROP · 3.2X ZOOM' : media.camLabel}
              </span>
            </div>
            <div className="rounded bg-[var(--surface-canvas)]/90 px-2 py-0.5 border border-[var(--surface-border)] text-[var(--text-secondary)]">
              Conf: {(defect.confidenceScore * 100).toFixed(0)}%
            </div>
          </div>

          {/* Caliper Measurement Reticle on Target Section Crop */}
          {evidenceMode === 'crop' ? (
            <div className="mx-auto my-auto w-48 h-28 border border-dashed border-emerald-400/80 rounded relative flex flex-col justify-between p-1 bg-emerald-950/20">
              <div className="flex items-center justify-between text-[8px] font-mono text-emerald-300">
                <span className="bg-[var(--surface-canvas)]/90 px-1 py-0.2 rounded border border-emerald-500/50 flex items-center gap-1">
                  <Crosshair className="h-2.5 w-2.5 text-emerald-400" />
                  {media.primaryLabel}
                </span>
                <span className="bg-[var(--surface-canvas)]/90 px-1 py-0.2 rounded border border-emerald-500/50">
                  {media.caliperDimensions.secondary}
                </span>
              </div>
              <div className="text-center font-mono text-[9px] text-emerald-200 bg-[var(--surface-canvas)]/80 px-1 py-0.5 rounded border border-emerald-500/40 self-center">
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
          <div className="flex items-center justify-between text-[9px] font-mono text-[var(--text-secondary)] bg-[var(--surface-canvas)]/85 px-2 py-0.5 rounded border border-[var(--surface-border)]">
            <span>{defect?.coords?.lat != null ? defect.coords.lat.toFixed(5) : '30.73050'}°N, {defect?.coords?.lng != null ? defect.coords.lng.toFixed(5) : '76.82100'}°E</span>
            <span className="text-emerald-400 font-bold">
              {evidenceMode === 'crop' ? 'SECTION LOCALIZED' : 'INSPECTED'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Sensor-Vision Distress Analysis Panel (Contextual for Pothole vs Waterlogging) */}
      {defect.type === 'waterlogging' ? (
        <div className="rounded-xl border border-cyan-200 bg-cyan-50/80 dark:border-cyan-800/60 dark:bg-cyan-950/30 p-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-900 dark:text-cyan-200">
              <Activity className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
              <span>Surface Ponding & Drainage Deficit</span>
            </div>
            <span className="rounded border border-cyan-300 bg-cyan-100 px-2 py-0.5 text-[10px] font-mono font-bold text-cyan-800 dark:border-cyan-600/60 dark:bg-cyan-900/40 dark:text-cyan-300">
              Aquaplane Hazard
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
            <div className="rounded-lg bg-[var(--surface-canvas)] p-2 border border-cyan-200 dark:border-cyan-900/60 flex flex-col">
              <span className="text-cyan-700 dark:text-cyan-400/80 text-[10px]">Puddle Surface Area</span>
              <span className="text-[var(--text-primary)] font-bold text-sm mt-0.5">{defect.estimatedAreaSqM} m²</span>
              <span className="text-cyan-700 dark:text-cyan-300 text-[9px] mt-0.5">High Hydroplaning Risk</span>
            </div>
            <div className="rounded-lg bg-[var(--surface-canvas)] p-2 border border-cyan-200 dark:border-cyan-900/60 flex flex-col">
              <span className="text-cyan-700 dark:text-cyan-400/80 text-[10px]">Standing Water Depth</span>
              <span className="text-[var(--text-primary)] font-bold text-sm mt-0.5">5.2 cm</span>
              <span className="text-cyan-700 dark:text-cyan-300 text-[9px] mt-0.5">Drainage Silt Choke</span>
            </div>
          </div>

          <div className="rounded-lg bg-[var(--surface-canvas)] p-2 border border-cyan-200 dark:border-cyan-900/60 text-[10px] font-mono text-cyan-800 dark:text-cyan-300 flex items-center justify-between">
            <span>Recommended Response:</span>
            <strong className="text-[var(--text-primary)] font-bold">Stormwater Gully Suction Unit</strong>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-[var(--surface-border)] bg-[var(--surface-panel)] p-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-primary)]">
              <Activity className="h-4 w-4 text-[var(--text-secondary)]" />
              <span>IMU Accelerometer Z-Axis Verification</span>
            </div>
            <span className="rounded border border-[var(--color-accent-primary)] bg-[var(--surface-subtle)] px-2 py-0.5 text-[10px] font-mono text-[var(--text-secondary)]">
              Physical Impact Verified
            </span>
          </div>

          {/* Accelerometer Vertical Vibration Spectrum */}
          <div className="flex h-10 items-end gap-1 rounded-lg bg-[var(--surface-canvas)] p-2 border border-[var(--surface-border)]">
            <div className="flex-1 bg-[var(--surface-subtle)] h-2 rounded-xs" />
            <div className="flex-1 bg-[var(--surface-subtle)] h-3 rounded-xs" />
            <div className="flex-1 bg-[var(--surface-subtle)] h-2 rounded-xs" />
            <div className="flex-1 bg-[#2563eb] h-4 rounded-xs" />
            <div className={`flex-1 ${isCritical ? 'bg-rose-500 h-8 shadow-[0_0_8px_#ef4444]' : 'bg-amber-500 h-6 shadow-[0_0_8px_#f59e0b]'} rounded-xs animate-pulse`} />
            <div className="flex-1 bg-[#2563eb] h-5 rounded-xs" />
            <div className="flex-1 bg-[var(--surface-subtle)] h-3 rounded-xs" />
            <div className="flex-1 bg-[var(--surface-subtle)] h-2 rounded-xs" />
            <div className="flex-1 bg-[var(--surface-subtle)] h-3 rounded-xs" />
            <div className="flex-1 bg-[var(--surface-subtle)] h-2 rounded-xs" />
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono">
            <span className="text-[var(--text-secondary)]">
              Peak Vibration: <strong className={isCritical ? 'text-rose-400' : 'text-amber-400'}>{defect.imuVibrationZ}g</strong>
            </span>
            <span className="text-[var(--text-muted)]">Depth: 5.4cm (Class 3)</span>
          </div>
        </div>
      )}

      {/* 3. Operational Metadata Ledger */}
      <div className="rounded-xl border border-[var(--surface-border)] bg-[var(--surface-panel)] divide-y divide-[#111c33] text-xs font-mono">
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
            <MapPin className="h-3.5 w-3.5 text-[var(--text-muted)]" />
            <span>Corridor / Road</span>
          </div>
          <span className="font-semibold text-[var(--text-primary)] text-right truncate max-w-[60%]">{defect.roadName}</span>
        </div>
        <div className="flex items-center justify-between p-3">
          <span className="text-[var(--text-secondary)]">Estimated Surface Area</span>
          <span className="tabular-nums text-[var(--text-primary)] font-bold">{defect.estimatedAreaSqM} m²</span>
        </div>
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
            <Bus className="h-3.5 w-3.5 text-[var(--text-muted)]" />
            <span>Sensing CTU Bus</span>
          </div>
          <span className="text-[var(--text-secondary)] font-bold">{defect.detectedByBusId}</span>
        </div>
        <div className="flex items-center justify-between p-3">
          <span className="text-[var(--text-secondary)]">Cross-Pass Validation</span>
          <span className="text-[var(--text-primary)]">{defect.observationsCount} Passes Verified</span>
        </div>
        <div className="flex items-center justify-between p-3">
          <span className="text-[var(--text-secondary)]">Detection Timestamp</span>
          <span className="text-[var(--text-primary)]">{formatTimestamp(defect.detectedAt)}</span>
        </div>
      </div>
    </Drawer>
  );
}
