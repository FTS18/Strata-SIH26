'use client';

import React, { useState } from 'react';
import { 
  ArrowRight, 
  Shield, 
  Bus, 
  Wrench, 
  Activity, 
  Radio, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp, 
  Layers,
  ChevronRight,
  Sparkles,
  SlidersHorizontal,
  Download
} from 'lucide-react';
import { APP_CONFIG } from '@/config/constants';

interface LandingHeroProps {
  onOpenLogin: () => void;
}

export function LandingHero({ onOpenLogin }: LandingHeroProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'defects' | 'anpr' | 'fleet'>('all');

  const mockTelemetryItems = [
    {
      id: 'DTC-8821',
      type: 'fleet',
      title: 'DTC Transit Corridor 428',
      vehicle: 'Bus DL-1PC-8821',
      subtitle: 'Outer Ring Road (Nehru Place -> AIIMS)',
      metric: '30 FPS · 12ms Edge Latency',
      status: 'Active Stream',
      statusColor: 'text-[#2A835F] bg-[#2A835F]/15 border-[#2A835F]/30',
      icon: <Bus className="h-4 w-4 text-[#2A835F]" />,
      badge: '99.8% Compressed'
    },
    {
      id: 'PWD-892',
      type: 'defects',
      title: 'Severe Structural Pothole (0.42 m²)',
      vehicle: 'PWD Ward 14 · Sector 9 Junction',
      subtitle: 'Depth: 64mm · Severity: CRITICAL',
      metric: 'Work Order #WO-892 Auto-Issued',
      status: 'Dispatched',
      statusColor: 'text-[#f59e0b] bg-[#f59e0b]/15 border-[#f59e0b]/30',
      icon: <Wrench className="h-4 w-4 text-[#f59e0b]" />,
      badge: 'Auto-Audited'
    },
    {
      id: 'POL-1234',
      type: 'anpr',
      title: 'ANPR Warrant Hotlist Intercept Flag',
      vehicle: 'Commercial Tanker DL-01-AB-1234',
      subtitle: 'Match Confidence: 99.4% · Spatial Box: [340, 110]',
      metric: 'E-Challan & Highway Patrol Alerted',
      status: 'Intercept Flag',
      statusColor: 'text-[#ef4444] bg-[#ef4444]/15 border-[#ef4444]/30',
      icon: <Shield className="h-4 w-4 text-[#ef4444]" />,
      badge: 'Challan #8841'
    },
    {
      id: 'EDGE-OPT',
      type: 'fleet',
      title: 'Municipal Cellular Bandwidth Optimization',
      vehicle: '4-Camera Neural Inference Subsystem',
      subtitle: 'Raw Bitrate: 112.5 MB/min -> Telemetry: 13.2 KB/min',
      metric: 'Zero Cellular Congestion · On-Device Jetson Orin',
      status: 'Optimal',
      statusColor: 'text-[#2A835F] bg-[#2A835F]/15 border-[#2A835F]/30',
      icon: <Activity className="h-4 w-4 text-[#2A835F]" />,
      badge: 'Sovereign Edge'
    }
  ];

  const filteredItems = activeFilter === 'all' 
    ? mockTelemetryItems 
    : mockTelemetryItems.filter(item => item.type === activeFilter);

  return (
    <section className="relative overflow-hidden bg-[#FBFDFB] pt-12 pb-24 text-[#092328]">
      {/* Mint / Sage Ambient Glow Orbs behind the mockup */}
      <div 
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full opacity-35 blur-[120px]"
        style={{
          background: 'radial-gradient(circle, #8BBB92 0%, #2A835F 45%, transparent 70%)'
        }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Tagline / Beacon */}
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#2A835F]/30 bg-[#2A835F]/10 px-4 py-1.5 text-xs font-semibold text-[#092328] mb-6">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2A835F] opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#2A835F]"></span>
            </span>
            <span>Real-time edge telemetry active across 40+ transit corridors</span>
          </div>

          {/* Hero Typography */}
          <h1 className="max-w-4xl font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#092328] leading-[1.08] uppercase">
            One platform. Zero blindspots. <br className="hidden sm:inline" />
            <span className="text-[#2A835F]">Your city intelligence</span>, on the edge.
          </h1>

          {/* Subtitle */}
          <p className="mt-6 max-w-2xl text-base sm:text-lg text-[#092328]/80 leading-relaxed font-sans">
            Equip municipal transit fleets with sovereign edge AI to autonomously audit road hazards, track stolen vehicles, quantify traffic kinematics, and streamline civic maintenance in real time.
          </p>

          {/* Primary CTA Row */}
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
            <button
              type="button"
              onClick={onOpenLogin}
              className="group flex h-13 items-center gap-3 rounded-full bg-[#092328] px-8 text-sm font-bold text-[#f0fdf4] transition-all hover:bg-[#12544F] hover:shadow-xl hover:shadow-[#092328]/20 active:scale-95 cursor-pointer uppercase tracking-wider"
            >
              <span>Launch Command Console</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 text-[#8BBB92]" />
            </button>

            <span className="text-xs font-mono text-[#092328]/60">
              Live in Delhi NCR · 4 DTC Depots Active
            </span>
          </div>
        </div>

        {/* Floating High-Fidelity Dashboard Mockup Card */}
        <div className="mt-16 sm:mt-20 relative">
          {/* Subtle Outer Glow behind card */}
          <div 
            className="pointer-events-none absolute -inset-2 sm:-inset-4 rounded-3xl opacity-30 blur-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(42, 131, 95, 0.4), rgba(139, 187, 146, 0.4))'
            }}
          />

          <div className="relative rounded-2xl sm:rounded-3xl border border-[#12544F]/30 bg-[#092328] p-3 sm:p-6 shadow-2xl shadow-[#092328]/40 text-[#f0fdf4] overflow-hidden">
            {/* Mockup Top Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#12544F] pb-4 mb-4 gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2A835F] text-[#f0fdf4] font-display text-sm font-bold">
                  S
                </div>
                <div>
                  <h2 className="text-xs sm:text-sm font-bold tracking-wide uppercase font-display text-[#f0fdf4]">
                    STRATA Command Stream · Real-Time Telemetry
                  </h2>
                  <p className="text-[11px] font-mono text-[#8BBB92]">
                    5-Tier Autonomous Neural Engine · Active Edge Uplink
                  </p>
                </div>
              </div>

              {/* Status Badges & Controls */}
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#2A835F]/40 bg-[#12544F]/60 px-3 py-1 text-[11px] font-mono text-[#8BBB92]">
                  <span className="h-2 w-2 rounded-full bg-[#2A835F] animate-pulse"></span>
                  4 DTC Corridors Live
                </span>
                <span className="rounded-full border border-[#12544F] bg-[#0d3137] px-3 py-1 text-[11px] font-mono text-[#f0fdf4]">
                  99.8% Bandwidth Saved
                </span>
              </div>
            </div>

            {/* Dashboard Overview Metrics Banner */}
            <div className="rounded-xl border border-[#144943] bg-[#0d3137]/80 p-4 sm:p-5 mb-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-mono text-[#8BBB92] uppercase tracking-wider">
                    Total Municipal Events Ingested
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-display text-3xl sm:text-4xl font-bold text-[#f0fdf4] tracking-tight">
                      150,216
                    </span>
                    <span className="text-xs font-mono text-[#2A835F] font-semibold flex items-center gap-0.5">
                      <TrendingUp className="h-3.5 w-3.5" /> +24.8% edge efficiency
                    </span>
                  </div>
                </div>

                {/* Filter / Category Pills */}
                <div className="flex flex-wrap items-center gap-1.5 bg-[#092328] p-1 rounded-xl border border-[#144943]">
                  <button
                    type="button"
                    onClick={() => setActiveFilter('all')}
                    className={`rounded-lg px-3 py-1.5 text-xs font-mono transition-all cursor-pointer ${
                      activeFilter === 'all'
                        ? 'bg-[#2A835F] text-[#f0fdf4] font-semibold'
                        : 'text-[#8BBB92] hover:text-[#f0fdf4]'
                    }`}
                  >
                    All Events
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveFilter('defects')}
                    className={`rounded-lg px-3 py-1.5 text-xs font-mono transition-all cursor-pointer ${
                      activeFilter === 'defects'
                        ? 'bg-[#2A835F] text-[#f0fdf4] font-semibold'
                        : 'text-[#8BBB92] hover:text-[#f0fdf4]'
                    }`}
                  >
                    PWD Hazards
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveFilter('anpr')}
                    className={`rounded-lg px-3 py-1.5 text-xs font-mono transition-all cursor-pointer ${
                      activeFilter === 'anpr'
                        ? 'bg-[#2A835F] text-[#f0fdf4] font-semibold'
                        : 'text-[#8BBB92] hover:text-[#f0fdf4]'
                    }`}
                  >
                    ANPR Hotlists
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveFilter('fleet')}
                    className={`rounded-lg px-3 py-1.5 text-xs font-mono transition-all cursor-pointer ${
                      activeFilter === 'fleet'
                        ? 'bg-[#2A835F] text-[#f0fdf4] font-semibold'
                        : 'text-[#8BBB92] hover:text-[#f0fdf4]'
                    }`}
                  >
                    Transit Edge
                  </button>
                </div>
              </div>
            </div>

            {/* Telemetry Stream Items Table / List */}
            <div className="space-y-2.5">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-[#144943] bg-[#0d3137]/60 p-3.5 sm:p-4 transition-all hover:border-[#2A835F]/60 hover:bg-[#12544F]/40 gap-3"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#144943] bg-[#092328]">
                      {item.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-semibold text-[#f0fdf4]">
                          {item.title}
                        </span>
                        <span className="rounded border border-[#144943] bg-[#092328] px-1.5 py-0.5 text-[10px] font-mono text-[#8BBB92]">
                          {item.badge}
                        </span>
                      </div>
                      <div className="mt-0.5 text-xs font-mono text-[#8BBB92]">
                        {item.vehicle} · {item.subtitle}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 pl-13 sm:pl-0">
                    <div className="text-left sm:text-right">
                      <div className="text-xs font-mono text-[#f0fdf4] font-medium">
                        {item.metric}
                      </div>
                    </div>
                    <span className={`rounded-full border px-2.5 py-1 text-[11px] font-mono font-medium ${item.statusColor}`}>
                      {item.status}
                    </span>
                    <ChevronRight className="h-4 w-4 text-[#8BBB92] transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Quick Action bar inside mockup */}
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between pt-3 border-t border-[#12544F] text-xs font-mono text-[#8BBB92] gap-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-[#2A835F]" />
                <span>Zero bandwidth video storage · Edge cryptographic proof active</span>
              </div>
              <button
                type="button"
                onClick={onOpenLogin}
                className="flex items-center gap-1.5 text-[#f0fdf4] hover:text-[#8BBB92] font-semibold transition-colors cursor-pointer"
              >
                <span>Enter Live Operational Map</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
