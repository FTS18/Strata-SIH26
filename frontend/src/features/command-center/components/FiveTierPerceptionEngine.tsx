'use client';

import React from 'react';
import { Camera, Shield, Eye, Users, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';

export interface VisionSummary {
  vehicles_count: number;
  potholes_count: number;
  waterlogging_count: number;
  pedestrians_count: number;
  infrastructure_count: number;
}

export interface VisionTelemetryData {
  status: string;
  cam_id: string;
  summary: VisionSummary;
  plates: Array<[number, number, number, number, string, number]>;
  imu: {
    current_z: number;
    is_spike: boolean;
    threshold_g: number;
    baseline_g: number;
    speed_km_h: number;
    pothole_active: boolean;
  };
  bandwidth: {
    raw_stream_mb_per_min: number;
    edge_telemetry_kb_per_min: number;
    savings_percentage: number;
    resolution: string;
    fps: number;
  };
}

export interface AllVisionDetectionsData {
  status: string;
  cameras: Record<string, VisionTelemetryData>;
  aggregate: {
    vehicles_count: number;
    potholes_count: number;
    waterlogging_count: number;
    pedestrians_count: number;
    infrastructure_count: number;
    plates_count: number;
    primary_plate: string | null;
    plates: Array<[number, number, number, number, string, number]>;
    avg_speed_km_h: number;
    max_imu_z: number;
    is_any_spike: boolean;
    total_bandwidth_saved_pct: number;
  };
  active_cams: string[];
}

interface FiveTierPerceptionEngineProps {
  viewMode: 'grid' | 'single';
  selectedCamId: string;
  activeCamName: string;
  allDetections: AllVisionDetectionsData | null;
  singleDetection: VisionTelemetryData | null;
}

export function FiveTierPerceptionEngine({
  viewMode,
  selectedCamId,
  activeCamName,
  allDetections,
  singleDetection,
}: FiveTierPerceptionEngineProps) {
  const isGrid = viewMode === 'grid';

  // Aggregate stats when in grid mode
  const agg = allDetections?.aggregate || {
    vehicles_count: 0,
    potholes_count: 0,
    waterlogging_count: 0,
    pedestrians_count: 0,
    infrastructure_count: 0,
    plates_count: 0,
    primary_plate: null,
    plates: [],
    avg_speed_km_h: 0,
    max_imu_z: 1.0,
    is_any_spike: false,
    total_bandwidth_saved_pct: 99.88,
  };

  // Single cam stats when in 1-up mode
  const singleSummary = singleDetection?.summary || {
    vehicles_count: 0,
    potholes_count: 0,
    waterlogging_count: 0,
    pedestrians_count: 0,
    infrastructure_count: 0,
  };
  const singlePlates = singleDetection?.plates || [];
  const singlePrimaryPlate = singlePlates.length > 0 ? singlePlates[0][4] : null;

  return (
    <div className="rounded-xl border border-[var(--surface-border)] bg-[var(--surface-panel)] p-3 space-y-2.5 shadow-md">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--surface-border)]/80 pb-2">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-[var(--text-secondary)]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] font-mono">
            5-Tier Edge AI Perception Engines
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono text-[var(--text-secondary)]">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>All 5 Models Active Simultaneously</span>
        </div>
      </div>

      {/* 5-Tier Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono text-[10px]">
        {/* Tier 1: ANPR */}
        <div className="flex flex-col justify-between rounded-xl border border-emerald-300/80 bg-emerald-50/80 dark:border-emerald-500/40 dark:bg-emerald-950/25 p-2.5 shadow-xs hover:border-emerald-400 transition-colors">
          <div className="flex items-center gap-1.5">
            <Camera className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-bold text-xs text-emerald-900 dark:text-emerald-300">1. ANPR Engine</span>
          </div>
          <span className="text-[10px] text-emerald-700 dark:text-emerald-400/80 mt-1">Plate OCR & Watchlist</span>
          <span className="mt-2 font-extrabold text-emerald-950 dark:text-white text-xs truncate">
            {isGrid
              ? agg.primary_plate
                ? `${agg.primary_plate}`
                : agg.plates_count > 0
                ? `${agg.plates_count} PLATES (SCAN)`
                : '0 PLATES (SCAN)'
              : singlePrimaryPlate
              ? singlePrimaryPlate
              : '0 PLATES (SCAN)'}
          </span>
        </div>

        {/* Tier 2: Road Distress */}
        <div className="flex flex-col justify-between rounded-xl border border-amber-300/80 bg-amber-50/80 dark:border-amber-500/40 dark:bg-amber-950/25 p-2.5 shadow-xs hover:border-amber-400 transition-colors">
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span className="font-bold text-xs text-amber-900 dark:text-amber-300">2. Road Distress</span>
          </div>
          <span className="text-[10px] text-amber-700 dark:text-amber-400/80 mt-1">Pothole / Waterlogging</span>
          <span className="mt-2 font-extrabold text-amber-950 dark:text-white text-xs truncate">
            {isGrid
              ? agg.potholes_count + agg.waterlogging_count > 0
                ? `${agg.potholes_count + agg.waterlogging_count} DETECTED`
                : '0 DISTRESS (CLEAR)'
              : singleSummary.potholes_count + singleSummary.waterlogging_count > 0
              ? `${singleSummary.potholes_count + singleSummary.waterlogging_count} DETECTED`
              : '0 DISTRESS (CLEAR)'}
          </span>
        </div>

        {/* Tier 3: Traffic Flow */}
        <div className="flex flex-col justify-between rounded-xl border border-purple-300/80 bg-purple-50/80 dark:border-purple-500/40 dark:bg-purple-950/25 p-2.5 shadow-xs hover:border-purple-400 transition-colors">
          <div className="flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
            <span className="font-bold text-xs text-purple-900 dark:text-purple-300">3. Traffic Flow</span>
          </div>
          <span className="text-[10px] text-purple-700 dark:text-purple-400/80 mt-1">Velocity & Headway</span>
          <span className="mt-2 font-extrabold text-purple-950 dark:text-white text-xs truncate">
            {isGrid
              ? `${agg.vehicles_count} VEHICLES`
              : `${singleSummary.vehicles_count} VEHICLES`}
          </span>
        </div>

        {/* Tier 4: Pedestrian Safety */}
        <div className="flex flex-col justify-between rounded-xl border border-cyan-300/80 bg-cyan-50/80 dark:border-cyan-500/40 dark:bg-cyan-950/25 p-2.5 shadow-xs hover:border-cyan-400 transition-colors">
          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
            <span className="font-bold text-xs text-cyan-900 dark:text-cyan-300">4. Pedestrian/Crowd</span>
          </div>
          <span className="text-[10px] text-cyan-700 dark:text-cyan-400/80 mt-1">Queue Surge / School</span>
          <span className="mt-2 font-extrabold text-cyan-950 dark:text-white text-xs truncate">
            {isGrid
              ? `${agg.pedestrians_count} IN ZONE (SURGE)`
              : `${singleSummary.pedestrians_count} IN ZONE`}
          </span>
        </div>

        {/* Tier 5: Road Markings */}
        <div className="flex flex-col justify-between rounded-xl border border-sky-300/80 bg-sky-50/80 dark:border-sky-500/40 dark:bg-sky-950/25 p-2.5 shadow-xs hover:border-sky-400 transition-colors">
          <div className="flex items-center gap-1.5">
            <Eye className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
            <span className="font-bold text-xs text-sky-900 dark:text-sky-300">5. Road Markings</span>
          </div>
          <span className="text-[10px] text-sky-700 dark:text-sky-400/80 mt-1">Zebra / Speed Bumps</span>
          <span className="mt-2 font-extrabold text-sky-950 dark:text-white text-xs truncate">
            {isGrid
              ? `${agg.infrastructure_count} DETECTED (AUDITING)`
              : `${singleSummary.infrastructure_count} DETECTED`}
          </span>
        </div>
      </div>
    </div>
  );
}
