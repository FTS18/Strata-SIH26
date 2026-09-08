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
    <div className="flex flex-col rounded-xl border border-[#12544F] bg-[#0d3137]/90 p-3 shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#12544F]/70 pb-2 mb-2 font-mono text-xs">
        <div className="flex items-center gap-2">
          <Radar className="h-4 w-4 text-[#00e5bf] animate-pulse" />
          <span className="font-bold text-white tracking-wider uppercase text-xs">
            5-TIER PERCEPTION RADAR
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-[#00e5bf]">
          <ShieldCheck className="h-3 w-3 text-emerald-400" />
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
              <stop offset="0%" stopColor="#00e5bf" stopOpacity="0.35" />
              <stop offset="60%" stopColor="#12544F" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#092328" stopOpacity="0.05" />
            </radialGradient>
            <linearGradient id="polyStrokeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00e5bf" />
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
              stroke="#12544F"
              strokeWidth={idx === rings.length - 1 ? '1.5' : '1'}
              strokeDasharray={idx === rings.length - 1 ? 'none' : '2,2'}
              opacity={0.8}
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
                stroke="#12544F"
                strokeWidth="1"
                opacity={0.6}
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
                  fill="#00e5bf"
                  stroke="#092328"
                  strokeWidth="1.5"
                />

                {/* Outer Label */}
                <text
                  x={labelX}
                  y={labelY}
                  textAnchor={textAnchor}
                  dominantBaseline="central"
                  className="font-mono text-[9px] font-semibold fill-[#8BBB92]"
                >
                  {axis.shortLabel}{' '}
                  <tspan className="fill-white font-bold">{axis.value}%</tspan>
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Metric Mini Pills Strip */}
      <div className="grid grid-cols-5 gap-1 pt-1.5 border-t border-[#12544F]/60 text-center font-mono text-[9px]">
        {axes.map((a) => (
          <div
            key={a.shortLabel}
            className="flex flex-col rounded bg-[#092328] px-1 py-0.5 border border-[#12544F]/80"
          >
            <span className="text-[#8BBB92] truncate">{a.shortLabel}</span>
            <span className="font-bold text-white">{a.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
