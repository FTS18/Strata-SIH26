'use client';

import React from 'react';
import { ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface LandingCtaBannerProps {
  onOpenLogin: () => void;
}

export function LandingCtaBanner({ onOpenLogin }: LandingCtaBannerProps) {
  return (
    <section className="relative overflow-hidden bg-[#FBFDFB] py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#2563eb] via-[#359B70] to-[#94a3b8] p-8 sm:p-14 lg:p-16 shadow-2xl shadow-[#2563eb]/20 text-[#080e1a]">
          {/* Subtle geometric pattern overlay */}
          <div className="pointer-events-none absolute inset-0 opacity-10 bg-[radial-gradient(#080e1a_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="relative z-10 max-w-2xl">
            <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#080e1a] uppercase leading-[1.08]">
              Your city's edge intelligence <br />
              is seconds away.
            </h2>
            <p className="mt-4 text-base sm:text-lg text-[#080e1a]/85 font-sans font-medium">
              Deploy Strata across municipal transit fleets or experience the live multi-agency command console in your browser right now.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                type="button"
                onClick={onOpenLogin}
                className="group flex h-13 items-center justify-center gap-3 rounded-full bg-[var(--surface-canvas)] px-8 text-sm font-bold text-[var(--text-primary)] transition-all hover:bg-[var(--surface-subtle)] hover:shadow-xl hover:shadow-[#080e1a]/30 active:scale-95 cursor-pointer uppercase tracking-wider"
              >
                <span>Launch Command Console</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 text-[var(--text-secondary)]" />
              </button>

              <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-mono text-[#080e1a] font-semibold">
                <ShieldCheck className="h-4 w-4 text-[#080e1a]" />
                <span>Zero Installation Required · Demo Pre-loaded</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
