'use client';

import React, { useState, useEffect } from 'react';
import { Wifi, Cpu, HardDrive, Zap, TrendingUp } from 'lucide-react';

interface EdgeComputeHealthGraphProps {
  currentFps?: number;
  savingsPercentage?: number;
  rawMbPerMin?: number;
  edgeKbPerMin?: number;
}

export function EdgeComputeHealthGraph({
  currentFps = 28.5,
  savingsPercentage = 99.88,
  rawMbPerMin = 112.5,
  edgeKbPerMin = 14.2,
}: EdgeComputeHealthGraphProps) {
  const [fpsHistory, setFpsHistory] = useState<number[]>(() =>
    Array.from({ length: 32 }, () => 28.0 + (Math.random() * 2.0))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setFpsHistory((prev) => {
        const jitter = (Math.random() - 0.5) * 1.8;
        const nextFps = Math.max(24.0, Math.min(30.0, currentFps + jitter));
        return [...prev.slice(1), nextFps];
      });
    }, 800);
    return () => clearInterval(interval);
  }, [currentFps]);

  const width = 360;
  const height = 40;
  const minFps = 20;
  const maxFps = 32;

  const getY = (val: number) => {
    const clamped = Math.max(minFps, Math.min(maxFps, val));
    const ratio = (clamped - minFps) / (maxFps - minFps);
    return height - ratio * height;
  };

  const points = fpsHistory.map((val, idx) => {
    const x = (idx / (fpsHistory.length - 1)) * width;
    const y = getY(val);
    return { x, y };
  });

  const polylineString = points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

  return (
    <div className="rounded-xl border border-[#12544F] bg-[#0d3137] p-3 space-y-2.5 font-mono shadow-md">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 text-xs">
        <div className="flex items-center gap-1.5 font-semibold text-[#f0fdf4]">
          <Wifi className="h-3.5 w-3.5 text-[#8BBB92]" />
          <span className="text-[11px] uppercase tracking-wider">
            Live Cellular Bandwidth & Edge Compute Telemetry
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px]">
          <span className="font-bold text-[#8BBB92] px-1.5 py-0.5 rounded bg-[#12544F] border border-[#2A835F]">
            {savingsPercentage.toFixed(2)}% SAVED
          </span>
        </div>
      </div>

      {/* Real-time FPS Sparkline Waveform */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[10px] text-[#8BBB92]">
          <span className="flex items-center gap-1">
            <Cpu className="h-3 w-3 text-[#8BBB92]" />
            <span>NPU Edge Inference Throughput:</span>
            <strong className="text-[#f0fdf4]">{fpsHistory[fpsHistory.length - 1]?.toFixed(1)} FPS</strong>
          </span>
          <span className="text-[9px] text-[#5b9076]">Target: 30.0 FPS</span>
        </div>

        <div className="relative h-10 w-full overflow-hidden rounded-lg bg-[#092328] border border-[#12544F]">
          <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" preserveAspectRatio="none">
            {/* Target 30 FPS guide */}
            <line
              x1="0"
              y1={getY(30)}
              x2={width}
              y2={getY(30)}
              stroke="#2A835F"
              strokeWidth="0.8"
              strokeDasharray="2 2"
              opacity="0.6"
            />
            {/* Waveform */}
            <polyline
              fill="none"
              stroke="#8BBB92"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={polylineString}
            />
          </svg>
          <span className="absolute bottom-1 right-2 text-[8px] text-[#5b9076] pointer-events-none">
            30 FPS Reference Line
          </span>
        </div>
      </div>

      {/* Bandwidth Savings Comparison Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        <div className="rounded-lg border border-[#12544F] bg-[#092328] p-2 space-y-0.5">
          <span className="text-[#8BBB92] text-[10px]">RAW VIDEO STREAM (CLOUD):</span>
          <p className="text-sm font-bold text-rose-400">
            {rawMbPerMin.toFixed(1)} MB / min
          </p>
          <span className="text-[9px] text-[#5b9076]">
            Uncompressed Multi-Camera Uplink
          </span>
        </div>

        <div className="rounded-lg border border-[#12544F] bg-[#092328] p-2 space-y-0.5">
          <span className="text-[#8BBB92] text-[10px]">EDGE TELEMETRY JSON (STRATA):</span>
          <p className="text-sm font-bold text-[#8BBB92]">
            {edgeKbPerMin.toFixed(1)} KB / min
          </p>
          <span className="text-[9px] text-[#5b9076]">
            Filtered Deduplicated AIS-140 Payloads
          </span>
        </div>
      </div>

      {/* Edge Hardware Status Footprint */}
      <div className="grid grid-cols-3 gap-1 text-[9px] pt-1 border-t border-[#12544F]/60 text-[#8BBB92]">
        <div className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span>GPU Load: <strong className="text-[#f0fdf4]">64%</strong></span>
        </div>
        <div className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
          <span>Latency: <strong className="text-[#f0fdf4]">12.4ms</strong></span>
        </div>
        <div className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span>Temp: <strong className="text-[#f0fdf4]">43.5°C</strong></span>
        </div>
      </div>
    </div>
  );
}
