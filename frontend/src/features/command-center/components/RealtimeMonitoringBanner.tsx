'use client';

import React from 'react';
import { Video, ShieldCheck, Activity, Cpu, Wifi } from 'lucide-react';

export function RealtimeMonitoringBanner() {
  return (
    <div className="relative flex-1 min-h-[140px] flex flex-col justify-between rounded-xl border border-[#12544F] bg-gradient-to-br from-[#0d3137] via-[#0b2b31] to-[#092328] p-4 overflow-hidden shadow-md">
      {/* Top Header Row */}
      <div className="flex items-start justify-between gap-3 z-10">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#12544F]/80 border border-[#2A835F] text-[#00e5bf] shadow-[0_0_12px_rgba(0,229,191,0.2)]">
            <Video className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-[#f0fdf4] font-mono tracking-tight">
              Real-time Monitoring
            </span>
            <span className="text-xs text-[#8BBB92] font-mono">
              AI + IoT Powered Urban Infrastructure Safety
            </span>
          </div>
        </div>

        {/* Live Active Badge */}
        <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-950/40 px-2.5 py-1 text-[10px] font-mono text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold tracking-wide">ACTIVE</span>
        </div>
      </div>

      {/* Middle Telemetry Badges Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 z-10 font-mono text-[10px]">
        <div className="flex items-center gap-1.5 rounded-lg border border-[#12544F]/60 bg-[#092328]/80 px-2.5 py-1.5 text-[#8BBB92]">
          <Cpu className="h-3.5 w-3.5 text-[#00e5bf]" />
          <div className="flex flex-col">
            <span className="text-[9px] text-[#8BBB92]/80">LATENCY</span>
            <span className="font-bold text-white">14ms Edge</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 rounded-lg border border-[#12544F]/60 bg-[#092328]/80 px-2.5 py-1.5 text-[#8BBB92]">
          <Activity className="h-3.5 w-3.5 text-emerald-400" />
          <div className="flex flex-col">
            <span className="text-[9px] text-[#8BBB92]/80">STREAM</span>
            <span className="font-bold text-white">4K @ 30 FPS</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 rounded-lg border border-[#12544F]/60 bg-[#092328]/80 px-2.5 py-1.5 text-[#8BBB92]">
          <Wifi className="h-3.5 w-3.5 text-cyan-400" />
          <div className="flex flex-col">
            <span className="text-[9px] text-[#8BBB92]/80">BANDWIDTH</span>
            <span className="font-bold text-white">99.88% Saved</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 rounded-lg border border-[#12544F]/60 bg-[#092328]/80 px-2.5 py-1.5 text-[#8BBB92]">
          <ShieldCheck className="h-3.5 w-3.5 text-[#8BBB92]" />
          <div className="flex flex-col">
            <span className="text-[9px] text-[#8BBB92]/80">NVME BUFFER</span>
            <span className="font-bold text-white">72h Encrypted</span>
          </div>
        </div>
      </div>

      {/* Vector City Skyline Silhouette Graphic on Right */}
      <div className="absolute right-0 bottom-0 h-28 w-64 opacity-25 pointer-events-none flex items-end">
        <svg
          viewBox="0 0 240 80"
          className="h-full w-full fill-[#00e5bf]"
          preserveAspectRatio="none"
        >
          {/* Stylized Modern City Skyline */}
          <rect x="5" y="55" width="10" height="25" />
          <rect x="18" y="42" width="14" height="38" />
          <rect x="35" y="28" width="16" height="52" />
          <polygon points="43,28 43,15 43,28" />
          <rect x="55" y="48" width="12" height="32" />
          <polygon points="72,80 72,18 78,8 84,18 84,80" />
          <rect x="88" y="36" width="15" height="44" />
          <rect x="106" y="22" width="18" height="58" />
          <polygon points="115,22 115,4 115,22" />
          <rect x="127" y="46" width="13" height="34" />
          <rect x="143" y="14" width="22" height="66" />
          <polygon points="154,14 154,0 154,14" />
          <rect x="168" y="40" width="16" height="40" />
          <rect x="187" y="30" width="15" height="50" />
          <rect x="205" y="50" width="14" height="30" />
          <rect x="222" y="38" width="14" height="42" />
        </svg>
      </div>
    </div>
  );
}
