'use client';

import React from 'react';
import { Shield, Lock, Server, Cpu, Database, EyeOff, CheckCircle2 } from 'lucide-react';

export function LandingSovereigntySection() {
  const pillars = [
    {
      icon: <EyeOff className="h-6 w-6 text-[var(--color-accent-cyan)]" />,
      title: 'On-Device Privacy & Citizen Scrubbing',
      description: 'Automated on-device face and non-target license plate redaction. Raw video never streams over public cellular channels, guaranteeing 100% DPDP citizen privacy compliance.',
    },
    {
      icon: <Lock className="h-6 w-6 text-[var(--text-secondary)]" />,
      title: 'Zero-Trust Multi-Agency Partitioning',
      description: 'Cryptographically segregated RBAC channels ensure PWD engineers only see pavement distress, while traffic officers access ANPR hotlists under strict audit trails.',
    },
    {
      icon: <Server className="h-6 w-6 text-[var(--color-accent-cyan)]" />,
      title: 'Sovereign Defense-Grade Infrastructure',
      description: 'Engineered in partnership with Bharat Electronics Limited (BEL). Telemetry is hosted on sovereign municipal cloud servers with end-to-end cryptographic hashing.',
    },
  ];

  const ecosystemPartners = [
    { name: 'Bharat Electronics', role: 'Defense Tech Sponsor', badge: 'BEL' },
    { name: 'Delhi Transport Corp', role: 'Fleet Transit Host', badge: 'DTC' },
    { name: 'Public Works Dept', role: 'Road Infrastructure', badge: 'PWD' },
    { name: 'Delhi Traffic Police', role: 'ANPR Surveillance', badge: 'POLICE' },
    { name: 'NVIDIA Jetson', role: 'Edge Inference', badge: 'CUDA' },
    { name: 'Intel OpenVINO', role: 'Model Acceleration', badge: 'VPU' },
    { name: 'Smart Cities Mission', role: 'Civic Modernization', badge: 'MoHUA' },
    { name: 'MapLibre GL', role: 'Vector Spatial GIS', badge: 'GIS' },
  ];

  return (
    <section id="sovereignty" className="relative bg-[var(--surface-canvas)] py-24 text-[var(--text-primary)] border-t border-[var(--surface-border)]">
      {/* Subtle line grid backdrop */}
      <div className="pointer-events-none absolute inset-0 bg-line-grid opacity-25" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <div className="max-w-3xl mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-[var(--text-secondary)] font-semibold">
            Sovereign Security & DPDP Compliance
          </span>
          <h2 className="mt-2 font-display text-3xl sm:text-5xl font-bold tracking-tight text-[var(--text-primary)] uppercase leading-[1.1]">
            Keep municipal operations confidential & sovereign.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[var(--text-secondary)] font-sans">
            Enterprise-grade privacy protecting citizen identities with on-device blurring, edge cryptography, and Bharat Electronics defense-grade compliance standards.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-[var(--surface-border-subtle)] bg-[var(--surface-panel)]/70 p-6 sm:p-8 transition-all hover:border-[var(--color-accent-primary)] hover:bg-[var(--surface-panel)] shadow-xl"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--surface-border-subtle)] bg-[var(--surface-canvas)] mb-6">
                {pillar.icon}
              </div>
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-3">
                {pillar.title}
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-sans">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>

        {/* Ecosystem / Agency Ticker Bar */}
        <div className="border-t border-[var(--surface-border)] pt-12">
          <p className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] text-center mb-8">
            Powered by sovereign defense, edge hardware, and civic administration partners
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
            {ecosystemPartners.map((item, idx) => (
              <div
                key={idx}
                className="group flex flex-col items-center justify-center rounded-xl border border-[var(--surface-border-subtle)] bg-[var(--surface-panel)]/40 p-3 text-center transition-all hover:border-[var(--color-accent-primary)] hover:bg-[var(--surface-subtle)]/40"
              >
                <span className="rounded-md border border-[var(--color-accent-primary)]/40 bg-[var(--surface-canvas)] px-2 py-0.5 text-[10px] font-mono font-bold text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">
                  {item.badge}
                </span>
                <span className="mt-2 text-[11px] font-bold text-[var(--text-primary)] line-clamp-1">
                  {item.name}
                </span>
                <span className="text-[10px] font-mono text-[var(--text-muted)]">
                  {item.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
