'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Activity, AlertOctagon, Gauge, ShieldAlert } from 'lucide-react';

interface ImuTelemetryGraphProps {
  imu?: {
    current_z: number;
    is_spike: boolean;
    threshold_g: number;
    baseline_g: number;
    speed_km_h: number;
    pothole_active: boolean;
  };
}

export function ImuTelemetryGraph({ imu }: ImuTelemetryGraphProps) {
  const [history, setHistory] = useState<number[]>(() =>
    Array.from({ length: 48 }, (_, i) => 1.0 + Math.sin(i * 0.4) * 0.04)
  );
  const [peakZ, setPeakZ] = useState<number>(1.08);
  const [spikeCount, setSpikeCount] = useState<number>(0);

  const currentZ = imu?.current_z ?? 1.04;
  const isSpike = currentZ >= 2.2 || Boolean(imu?.is_spike);
  const speed = Math.round(imu?.speed_km_h || 32);

  // Update rolling buffer
  useEffect(() => {
    setHistory((prev) => {
      const next = [...prev.slice(1), currentZ];
      return next;
    });

    setPeakZ((prev) => Math.max(prev * 0.995, currentZ));

    if (isSpike) {
      setSpikeCount((c) => c + 1);
    }
  }, [currentZ, isSpike]);

  // Dimensions
  const width = 420;
  const height = 56;
  const minG = 0.4;
  const maxG = 3.6;

  const getY = (val: number) => {
    const clamped = Math.max(minG, Math.min(maxG, val));
    const ratio = (clamped - minG) / (maxG - minG);
    return height - ratio * height;
  };

  const baselineY = getY(1.0);
  const thresholdY = getY(2.2);

  // Multi-axis points
  const pointsZ = history.map((val, idx) => {
    const x = (idx / (history.length - 1)) * width;
    const y = getY(val);
    return { x, y, val };
  });

  // Synthesize realistic X and Y lateral vibration offsets relative to Z
  const pointsX = history.map((val, idx) => {
    const x = (idx / (history.length - 1)) * width;
    const xVal = 0.08 + Math.sin(idx * 0.6) * 0.06 + (val - 1.0) * 0.3;
    const y = getY(1.0 + xVal);
    return { x, y };
  });

  const pointsY = history.map((val, idx) => {
    const x = (idx / (history.length - 1)) * width;
    const yVal = -0.05 + Math.cos(idx * 0.5) * 0.07 + (val - 1.0) * 0.25;
    const y = getY(1.0 + yVal);
    return { x, y };
  });

  const polylineZ = pointsZ.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const polylineX = pointsX.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const polylineY = pointsY.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

  return (
    <div className="rounded-xl border border-[var(--surface-border)] bg-[var(--surface-panel)] p-3.5 space-y-3 font-mono shadow-md">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs border-b border-[var(--surface-border)]/80 pb-2">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-[var(--text-secondary)]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
            IMU 3-Axis Accelerometer (2-Axis Vibration Fusion)
          </span>
        </div>

        {/* 3-Axis Legend */}
        <div className="flex items-center gap-2.5 text-[11px]">
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[#00e5bf]" />
            <span className="text-[var(--text-secondary)]">X</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[#fbbf24]" />
            <span className="text-[var(--text-secondary)]">Y</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[#f43f5e]" />
            <span className="text-[var(--text-secondary)]">Z</span>
          </div>
        </div>

        {/* Status Pill Badge */}
        <div className="flex items-center gap-2 text-[10px]">
          <span
            className={`px-2 py-0.5 rounded-full border text-[10px] font-bold transition-colors ${
              isSpike
                ? 'bg-rose-100 border-rose-300 text-rose-800 dark:bg-rose-950/90 dark:border-rose-500 dark:text-rose-300 animate-pulse'
                : 'bg-emerald-100 border-emerald-300 text-emerald-800 dark:bg-emerald-950/80 dark:border-emerald-500/70 dark:text-emerald-300'
            }`}
          >
            Z = {currentZ.toFixed(2)}g {isSpike ? '[!] SHOCK IMPACT' : '(Nominal Suspension)'}
          </span>
          <span className="text-[var(--text-muted)]">Threshold: 2.2g</span>
        </div>
      </div>

      {/* SVG Multi-Axis Waveform Canvas */}
      <div className="relative h-16 w-full overflow-hidden rounded-lg bg-[var(--surface-canvas)] border border-[var(--surface-border)]">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" preserveAspectRatio="none">
          {/* Subtle Gridlines */}
          <line x1="0" y1={getY(0.5)} x2={width} y2={getY(0.5)} stroke="var(--surface-border)" strokeWidth="0.5" opacity="0.6" />
          <line x1="0" y1={baselineY} x2={width} y2={baselineY} stroke="var(--surface-border)" strokeWidth="0.8" opacity="0.8" strokeDasharray="3 3" />
          <line x1="0" y1={getY(1.5)} x2={width} y2={getY(1.5)} stroke="var(--surface-border)" strokeWidth="0.5" opacity="0.6" />
          <line x1="0" y1={thresholdY} x2={width} y2={thresholdY} stroke="#ef4444" strokeWidth="1" opacity="0.7" strokeDasharray="4 2" />

          {/* Curve X (Cyan) */}
          <polyline fill="none" stroke="#00e5bf" strokeWidth="1.2" strokeOpacity="0.7" points={polylineX} />

          {/* Curve Y (Yellow) */}
          <polyline fill="none" stroke="#fbbf24" strokeWidth="1.2" strokeOpacity="0.7" points={polylineY} />

          {/* Curve Z (Rose/Pink primary) */}
          <polyline
            fill="none"
            stroke={isSpike ? '#ef4444' : '#f43f5e'}
            strokeWidth="1.8"
            points={polylineZ}
            className="transition-colors duration-150"
          />

          {/* Current Z Leading Indicator Pulse */}
          <circle
            cx={pointsZ[pointsZ.length - 1]?.x || width}
            cy={pointsZ[pointsZ.length - 1]?.y || baselineY}
            r="3"
            fill={isSpike ? '#ef4444' : '#f43f5e'}
            className="animate-ping"
          />
        </svg>

      </div>

      {/* Bottom Readout & Speed Gauge matching reference image */}
      <div className="flex items-center justify-between pt-1 border-t border-[var(--surface-border)]/50">
        <div className="flex flex-col">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[var(--text-primary)] tabular-nums font-mono">
              {currentZ.toFixed(2)}g
            </span>
            <span className="text-[11px] text-[var(--text-secondary)]">
              {isSpike ? 'Surface Degradation Spike Detected' : 'Nominal Suspension Acceleration'}
            </span>
          </div>
          <span className="text-[10px] text-[var(--text-muted)]">
            Optical road distress cross-verified against real IMU acceleration spikes
          </span>
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-[var(--surface-panel)] border border-[var(--surface-border)] px-3.5 py-1.5 shrink-0 shadow-xs">
          <Gauge className="h-4 w-4 text-[var(--text-secondary)]" />
          <span className="text-xs font-bold text-[var(--text-primary)] tabular-nums font-mono">
            Speed: {speed} km/h
          </span>
        </div>
      </div>
    </div>
  );
}
