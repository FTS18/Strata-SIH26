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

  const points = history.map((val, idx) => {
    const x = (idx / (history.length - 1)) * width;
    const y = getY(val);
    return { x, y, val };
  });

  const polylineString = points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const areaPath = `M 0,${baselineY} L ${polylineString} L ${width},${baselineY} Z`;

  return (
    <div className="rounded-xl border border-[#12544F] bg-[#0d3137] p-3 space-y-2 font-mono shadow-md">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 text-xs">
        <div className="flex items-center gap-1.5 text-[#f0fdf4] font-bold">
          <Activity className="h-3.5 w-3.5 text-[#8BBB92]" />
          <span className="text-[11px] uppercase tracking-wider">
            IMU 3-Axis Accelerometer (Z-Axis Vibration Fusion)
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[10px]">
          <span
            className={`px-1.5 py-0.5 rounded border transition-colors ${
              isSpike
                ? 'bg-rose-950/90 border-rose-600 text-rose-400 font-bold animate-pulse'
                : 'bg-[#12544F] border-[#2A835F] text-[#8BBB92]'
            }`}
          >
            Z = {currentZ.toFixed(2)}g {isSpike ? '[!] SHOCK IMPACT' : '(Nominal)'}
          </span>
          <span className="text-[#5b9076]">Threshold: 2.2g</span>
        </div>
      </div>

      {/* SVG Waveform Canvas */}
      <div className="relative h-14 w-full overflow-hidden rounded-lg bg-[#092328] border border-[#12544F]">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" preserveAspectRatio="none">
          {/* Subtle Gridlines */}
          <line x1="0" y1={getY(0.5)} x2={width} y2={getY(0.5)} stroke="#12544F" strokeWidth="0.5" opacity="0.4" />
          <line x1="0" y1={getY(1.5)} x2={width} y2={getY(1.5)} stroke="#12544F" strokeWidth="0.5" opacity="0.4" />
          <line x1="0" y1={getY(2.5)} x2={width} y2={getY(2.5)} stroke="#12544F" strokeWidth="0.5" opacity="0.4" />

          {/* Area fill under curve */}
          <path d={areaPath} fill={isSpike ? 'rgba(239, 68, 68, 0.15)' : 'rgba(42, 131, 95, 0.15)'} />

          {/* 1.0g Gravity Baseline Reference Line */}
          <line
            x1="0"
            y1={baselineY}
            x2={width}
            y2={baselineY}
            stroke="#12544F"
            strokeWidth="1"
            strokeDasharray="4 4"
          />

          {/* 2.2g Shock Threshold Line */}
          <line
            x1="0"
            y1={thresholdY}
            x2={width}
            y2={thresholdY}
            stroke="#ef4444"
            strokeWidth="1.2"
            strokeDasharray="3 3"
            opacity="0.85"
          />

          {/* Continuous Polyline */}
          <polyline
            fill="none"
            stroke={isSpike ? '#f87171' : '#8BBB92'}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={polylineString}
          />

          {/* Current tip pulse circle */}
          {points.length > 0 && (
            <circle
              cx={points[points.length - 1].x}
              cy={points[points.length - 1].y}
              r="3"
              fill={isSpike ? '#ef4444' : '#8BBB92'}
              className="animate-ping"
            />
          )}
        </svg>

        {/* Legend overlays */}
        <div className="absolute top-1 left-2 text-[8px] text-[#5b9076] pointer-events-none flex items-center gap-2">
          <span className="text-rose-400">--- 2.2g Shock Threshold</span>
          <span>- - - 1.0g Baseline</span>
        </div>

        <div className="absolute bottom-1 right-2 text-[8px] text-[#8BBB92] pointer-events-none">
          Peak Hold: <span className="font-bold text-[#f0fdf4]">{peakZ.toFixed(2)}g</span>
        </div>
      </div>

      {/* Telemetry Footer with Speed and Correlation */}
      <div className="flex flex-wrap items-center justify-between text-[10px] text-[#5b9076]">
        <div className="flex items-center gap-2">
          <span>Axle Latency Gate: L/v Coincidence Active</span>
          {spikeCount > 0 && (
            <span className="text-amber-400 font-bold">· {spikeCount} Shock Events</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span>Speed: <strong className="text-[#f0fdf4]">{speed} km/h</strong></span>
          <span>Suspension Health: <strong className="text-emerald-400">96% (Optimal)</strong></span>
        </div>
      </div>
    </div>
  );
}
