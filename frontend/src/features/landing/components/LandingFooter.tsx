'use client';

import React from 'react';
import { APP_CONFIG } from '@/config/constants';

interface LandingFooterProps {
  onOpenLogin: () => void;
}

export function LandingFooter({ onOpenLogin }: LandingFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-[#092328] pt-16 pb-12 text-[#8BBB92] border-t border-[#12544F]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-16 border-b border-[#144943]">
          {/* Brand & Mission Statement */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2A835F] text-[#f0fdf4] font-display text-lg font-bold">
                S
              </div>
              <span className="font-display text-2xl font-bold tracking-tight text-[#f0fdf4] uppercase">
                {APP_CONFIG.APP_NAME}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#8BBB92] leading-relaxed max-w-sm font-sans">
              Autonomous Mobile Urban Intelligence Platform developed in response to Bharat Electronics Limited (BEL) SIH26124. Transforming municipal transit fleets into continuous edge sensory networks.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#1d6d63] bg-[#0d3137] px-3 py-1 text-[11px] font-mono text-[#f0fdf4]">
                <span className="h-2 w-2 rounded-full bg-[#2A835F] animate-pulse" />
                Edge Ingestion Network: Operational
              </span>
            </div>
          </div>

          {/* Navigation Links Columns */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {/* Column 1: Platform */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#f0fdf4] font-semibold">
                Platform
              </h4>
              <ul className="space-y-2 text-xs font-sans">
                <li>
                  <a href="#capabilities" className="transition-colors hover:text-[#f0fdf4]">
                    Road Hazard Vision
                  </a>
                </li>
                <li>
                  <a href="#capabilities" className="transition-colors hover:text-[#f0fdf4]">
                    ANPR Surveillance
                  </a>
                </li>
                <li>
                  <a href="#capabilities" className="transition-colors hover:text-[#f0fdf4]">
                    Corridor Kinematics
                  </a>
                </li>
                <li>
                  <a href="#capabilities" className="transition-colors hover:text-[#f0fdf4]">
                    Edge Compression
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 2: Agencies */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#f0fdf4] font-semibold">
                Agencies
              </h4>
              <ul className="space-y-2 text-xs font-sans">
                <li>
                  <button 
                    type="button"
                    onClick={onOpenLogin}
                    className="transition-colors hover:text-[#f0fdf4] text-left cursor-pointer"
                  >
                    ICCC Central Command
                  </button>
                </li>
                <li>
                  <button 
                    type="button"
                    onClick={onOpenLogin}
                    className="transition-colors hover:text-[#f0fdf4] text-left cursor-pointer"
                  >
                    PWD Road Infra
                  </button>
                </li>
                <li>
                  <button 
                    type="button"
                    onClick={onOpenLogin}
                    className="transition-colors hover:text-[#f0fdf4] text-left cursor-pointer"
                  >
                    Delhi Traffic Police
                  </button>
                </li>
                <li>
                  <button 
                    type="button"
                    onClick={onOpenLogin}
                    className="transition-colors hover:text-[#f0fdf4] text-left cursor-pointer"
                  >
                    DTC Transit Fleet
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Tech Stack */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#f0fdf4] font-semibold">
                Architecture
              </h4>
              <ul className="space-y-2 text-xs font-sans">
                <li>
                  <span className="text-[#5b9076]">NVIDIA Jetson Orin</span>
                </li>
                <li>
                  <span className="text-[#5b9076]">Intel OpenVINO</span>
                </li>
                <li>
                  <span className="text-[#5b9076]">MapLibre GL Vector</span>
                </li>
                <li>
                  <span className="text-[#5b9076]">FastAPI Real-time</span>
                </li>
              </ul>
            </div>

            {/* Column 4: Compliance */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#f0fdf4] font-semibold">
                Compliance
              </h4>
              <ul className="space-y-2 text-xs font-sans">
                <li>
                  <a href="#sovereignty" className="transition-colors hover:text-[#f0fdf4]">
                    DPDP 2023 Privacy
                  </a>
                </li>
                <li>
                  <a href="#sovereignty" className="transition-colors hover:text-[#f0fdf4]">
                    BEL Defense Security
                  </a>
                </li>
                <li>
                  <a href="#sovereignty" className="transition-colors hover:text-[#f0fdf4]">
                    Zero-Trust RBAC
                  </a>
                </li>
                <li>
                  <a href="#sovereignty" className="transition-colors hover:text-[#f0fdf4]">
                    Sovereign Cloud
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 text-xs font-mono text-[#5b9076] gap-4">
          <p>
            © {currentYear} STRATA · Bharat Electronics Limited (BEL SIH26124). All rights reserved.
          </p>
          <p>
            Built for Smart Cities Mission & Municipal Edge Infrastructure.
          </p>
        </div>
      </div>

      {/* Giant Stylized Watermark Typography "STRATA" across the footer background */}
      <div 
        className="pointer-events-none absolute -bottom-10 sm:-bottom-16 left-1/2 -translate-x-1/2 select-none font-display text-[120px] sm:text-[220px] md:text-[320px] lg:text-[380px] font-bold tracking-tight text-[#0d3137]/35 whitespace-nowrap leading-none z-0"
        aria-hidden="true"
      >
        STRATA
      </div>
    </footer>
  );
}
