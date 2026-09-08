'use client';

import React from 'react';
import { APP_CONFIG } from '@/config/constants';

interface LandingFooterProps {
  onOpenLogin: () => void;
}

export function LandingFooter({ onOpenLogin }: LandingFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-[var(--surface-canvas)] pt-16 pb-12 text-[var(--text-secondary)] border-t border-[var(--surface-border)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-16 border-b border-[var(--surface-border-subtle)]">
          {/* Brand & Mission Statement */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2563eb] text-[var(--text-primary)] font-display text-lg font-bold">
                S
              </div>
              <span className="font-display text-2xl font-bold tracking-tight text-[var(--text-primary)] uppercase">
                {APP_CONFIG.APP_NAME}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed max-w-sm font-sans">
              Autonomous Mobile Urban Intelligence Platform developed in response to Bharat Electronics Limited (BEL) SIH26124. Transforming municipal transit fleets into continuous edge sensory networks.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--surface-border)] bg-[var(--surface-panel)] px-3 py-1 text-[11px] font-mono text-[var(--text-primary)]">
                <span className="h-2 w-2 rounded-full bg-[#2563eb] animate-pulse" />
                Edge Ingestion Network: Operational
              </span>
            </div>
          </div>

          {/* Navigation Links Columns */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {/* Column 1: Platform */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[var(--text-primary)] font-semibold">
                Platform
              </h4>
              <ul className="space-y-2 text-xs font-sans">
                <li>
                  <a href="#capabilities" className="transition-colors hover:text-[var(--text-primary)]">
                    Road Hazard Vision
                  </a>
                </li>
                <li>
                  <a href="#capabilities" className="transition-colors hover:text-[var(--text-primary)]">
                    ANPR Surveillance
                  </a>
                </li>
                <li>
                  <a href="#capabilities" className="transition-colors hover:text-[var(--text-primary)]">
                    Corridor Kinematics
                  </a>
                </li>
                <li>
                  <a href="#capabilities" className="transition-colors hover:text-[var(--text-primary)]">
                    Edge Compression
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 2: Agencies */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[var(--text-primary)] font-semibold">
                Agencies
              </h4>
              <ul className="space-y-2 text-xs font-sans">
                <li>
                  <button 
                    type="button"
                    onClick={onOpenLogin}
                    className="transition-colors hover:text-[var(--text-primary)] text-left cursor-pointer"
                  >
                    ICCC Central Command
                  </button>
                </li>
                <li>
                  <button 
                    type="button"
                    onClick={onOpenLogin}
                    className="transition-colors hover:text-[var(--text-primary)] text-left cursor-pointer"
                  >
                    PWD Road Infra
                  </button>
                </li>
                <li>
                  <button 
                    type="button"
                    onClick={onOpenLogin}
                    className="transition-colors hover:text-[var(--text-primary)] text-left cursor-pointer"
                  >
                    Delhi Traffic Police
                  </button>
                </li>
                <li>
                  <button 
                    type="button"
                    onClick={onOpenLogin}
                    className="transition-colors hover:text-[var(--text-primary)] text-left cursor-pointer"
                  >
                    DTC Transit Fleet
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Tech Stack */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[var(--text-primary)] font-semibold">
                Architecture
              </h4>
              <ul className="space-y-2 text-xs font-sans">
                <li>
                  <span className="text-[var(--text-muted)]">NVIDIA Jetson Orin</span>
                </li>
                <li>
                  <span className="text-[var(--text-muted)]">Intel OpenVINO</span>
                </li>
                <li>
                  <span className="text-[var(--text-muted)]">MapLibre GL Vector</span>
                </li>
                <li>
                  <span className="text-[var(--text-muted)]">FastAPI Real-time</span>
                </li>
              </ul>
            </div>

            {/* Column 4: Compliance */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[var(--text-primary)] font-semibold">
                Compliance
              </h4>
              <ul className="space-y-2 text-xs font-sans">
                <li>
                  <a href="#sovereignty" className="transition-colors hover:text-[var(--text-primary)]">
                    DPDP 2023 Privacy
                  </a>
                </li>
                <li>
                  <a href="#sovereignty" className="transition-colors hover:text-[var(--text-primary)]">
                    BEL Defense Security
                  </a>
                </li>
                <li>
                  <a href="#sovereignty" className="transition-colors hover:text-[var(--text-primary)]">
                    Zero-Trust RBAC
                  </a>
                </li>
                <li>
                  <a href="#sovereignty" className="transition-colors hover:text-[var(--text-primary)]">
                    Sovereign Cloud
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 text-xs font-mono text-[var(--text-muted)] gap-4">
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
        className="pointer-events-none absolute -bottom-10 sm:-bottom-16 left-1/2 -translate-x-1/2 select-none font-display text-[120px] sm:text-[220px] md:text-[320px] lg:text-[380px] font-bold tracking-tight text-[#0d1527]/35 whitespace-nowrap leading-none z-0"
        aria-hidden="true"
      >
        STRATA
      </div>
    </footer>
  );
}
