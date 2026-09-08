'use client';

import React from 'react';
import { Radar, ShieldCheck } from 'lucide-react';

interface RadarAxis {
  label: string;
  shortLabel: string;
  value: number; // 0 - 100
  color: string;
}

interface PentagonPerceptionRadarProps {
  anprScore?: number;
  distressScore?: number;
  trafficScore?: number;
  pedestrianScore?: number;
  markingsScore?: number;
}

export function PentagonPerceptionRadar({
  anprScore = 96.3,
  distressScore = 91.2,
  trafficScore = 94.8,
  pedestrianScore = 98.7,
  markingsScore = 89.6,
}: PentagonPerceptionRadarProps) {
  const axes: RadarAxis[] = [
    { label: 'ANPR ENGINE', shortLabel: 'ANPR', value: anprScore, color: '#00e5bf' },
    { label: 'ROAD DISTRESS', shortLabel: 'DISTRESS', value: distressScore, color: '#f59e0b' },
    { label: 'TRAFFIC FLOW', shortLabel: 'TRAFFIC', value: trafficScore, color: '#10b981' },
    { label: 'PEDESTRIAN SAFETY', shortLabel: 'VRU / CROWD', value: pedestrianScore, color: '#a855f7' },
    { label: 'ROAD MARKINGS', shortLabel: 'MARKINGS', value: markingsScore, color: '#38bdf8' },
  ];

  const size = 260;
  const center = size / 2;
  const radius = 88;
  const totalAxes = 5;

  // Compute pentagon vertex at specific radius and index (starting from top)
  const getVertex = (r: number, index: number): [number, number] => {
    const angle = (index * 2 * Math.PI) / totalAxes - Math.PI / 2;
    return [center + r * Math.cos(angle), center + r * Math.sin(angle)];
  };

  // Concentric pentagon ring polygons
  const ringLevels = [0.25, 0.5, 0.75, 1.0];
  const rings = ringLevels.map((lvl) => {
    return Array.from({ length: totalAxes })
      .map((_, i) => getVertex(radius * lvl, i).join(','))
      .join(' ');
  });

  // Data polygon points
  const dataPolygon = axes
    .map((axis, i) => {
      const r = radius * (Math.min(100, Math.max(20, axis.value)) / 100);
      return getVertex(r, i).join(',');
    })
    .join(' ');

  const compositeScore = (
    axes.reduce((sum, a) => sum + a.value, 0) / axes.length
  ).toFixed(1);

  return (
    <div className="flex flex-col rounded-xl border border-[var(--surface-border)] bg-[var(--surface-panel)] p-3 shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--surface-border)] pb-2 mb-2 font-mono text-xs">
        <div className="flex items-center gap-2">
          <Radar className="h-4 w-4 text-[var(--color-accent-primary)] animate-pulse" />
          <span className="font-bold text-[var(--text-primary)] tracking-wider uppercase text-xs">
            5-TIER PERCEPTION RADAR
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-teal-700 dark:text-[#00e5bf]">
          <ShieldCheck className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
          <span>FUSION {compositeScore}%</span>
        </div>
      </div>

      {/* Radar SVG Visualization */}
      <div className="relative flex items-center justify-center py-1">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="overflow-visible select-none"
        >
          <defs>
            <radialGradient id="radarFillGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.30" />
              <stop offset="60%" stopColor="#2563eb" stopOpacity="0.10" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
            </radialGradient>
            <linearGradient id="polyStrokeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="50%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>

          {/* Concentric Pentagon Web Grid */}
          {rings.map((points, idx) => (
            <polygon
              key={`ring_${idx}`}
              points={points}
              fill="none"
              stroke="var(--surface-border)"
              strokeWidth={idx === rings.length - 1 ? '1.5' : '1'}
              strokeDasharray={idx === rings.length - 1 ? 'none' : '2,2'}
              opacity={1}
            />
          ))}

          {/* Spokes from Center */}
          {axes.map((_, i) => {
            const [vx, vy] = getVertex(radius, i);
            return (
              <line
                key={`spoke_${i}`}
                x1={center}
                y1={center}
                x2={vx}
                y2={vy}
                stroke="var(--surface-border)"
                strokeWidth="1"
                opacity={0.8}
              />
            );
          })}

          {/* Active Data Filled Polygon */}
          <polygon
            points={dataPolygon}
            fill="url(#radarFillGrad)"
            stroke="url(#polyStrokeGrad)"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* Vertex Points and Labels */}
          {axes.map((axis, i) => {
            const r = radius * (Math.min(100, Math.max(20, axis.value)) / 100);
            const [dx, dy] = getVertex(r, i);
            const [labelX, labelY] = getVertex(radius + 20, i);

            // Label text alignment based on quadrant
            let textAnchor: 'start' | 'middle' | 'end' = 'middle';
            if (i === 1 || i === 2) textAnchor = 'start';
            else if (i === 3 || i === 4) textAnchor = 'end';

            return (
              <g key={`point_${i}`}>
                {/* Vertex Marker */}
                <circle
                  cx={dx}
                  cy={dy}
                  r="3.5"
                  fill="#2563eb"
                  stroke="var(--surface-panel)"
                  strokeWidth="1.5"
                />

                {/* Outer Label */}
                <text
                  x={labelX}
                  y={labelY}
                  textAnchor={textAnchor}
                  dominantBaseline="central"
                  className="font-mono text-[9px] font-semibold fill-[var(--text-secondary)]"
                >
                  {axis.shortLabel}{' '}
                  <tspan className="fill-[var(--text-primary)] font-bold">{axis.value}%</tspan>
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Metric Mini Pills Strip */}
      <div className="grid grid-cols-5 gap-1 pt-1.5 border-t border-[var(--surface-border)]/60 text-center font-mono text-[9px]">
        {axes.map((a) => (
          <div
            key={a.shortLabel}
            className="flex flex-col rounded bg-[var(--surface-canvas)] px-1 py-0.5 border border-[var(--surface-border)]"
          >
            <span className="text-[var(--text-secondary)] truncate">{a.shortLabel}</span>
            <span className="font-bold text-[var(--text-primary)]">{a.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
