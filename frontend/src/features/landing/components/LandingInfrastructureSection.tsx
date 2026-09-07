'use client';

import React from 'react';
import { LayoutDashboard, Wrench, Shield, Bus, CheckCircle2 } from 'lucide-react';

export function LandingInfrastructureSection() {
  const departments = [
    {
      id: 'iccc',
      code: 'ICCC',
      color: 'bg-[#2A835F] text-[#f0fdf4]',
      title: 'Executive ICCC Command',
      desc: 'Centralized spatial GIS digital twin displaying multi-agency alerts, ward-level health indices, and live fleet telemetry on a unified dashboard.',
      role: 'City Commissioners & Disaster Management',
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      id: 'pwd',
      code: 'PWD',
      color: 'bg-[#8BBB92] text-[#092328]',
      title: 'Automated PWD Engineering',
      desc: 'Instant structural road distress grading, precise square-meter area calculation, automated contractor work order issuance, and recurring closed-loop audits.',
      role: 'Public Works & Highway Engineers',
      icon: <Wrench className="h-5 w-5" />,
    },
    {
      id: 'police',
      code: 'POL',
      color: 'bg-[#18635c] text-[#f0fdf4]',
      title: 'Traffic Police & ANPR Hotlists',
      desc: 'Multi-camera license plate capture cross-referenced with national hotlists for stolen vehicles, expired road fitness, and automated e-challan enforcement.',
      role: 'Highway Patrol & Traffic HQ',
      icon: <Shield className="h-5 w-5" />,
    },
    {
      id: 'dtc',
      code: 'DTC',
      color: 'bg-[#12544F] text-[#f0fdf4]',
      title: 'Transit Fleet Telemetry',
      desc: 'High-frequency GPS bus location tracking, real-time corridor delay prediction, sidewalk pedestrian density mapping, and edge camera observability.',
      role: 'Fleet Dispatchers & Depot Managers',
      icon: <Bus className="h-5 w-5" />,
    },
  ];

  const stats = [
    {
      value: '99.8%',
      label: 'Edge Bandwidth Compression',
      subtext: '112.5 MB/min reduced to 13.2 KB/min payload',
    },
    {
      value: '12ms',
      label: 'Edge Inference Latency',
      subtext: 'Real-time multi-model vision execution',
    },
    {
      value: '40+',
      label: 'Monitored DTC Corridors',
      subtext: 'Continuous arterial coverage across Delhi NCR',
    },
    {
      value: '85k+',
      label: 'Autonomous Audits Logged',
      subtext: 'Potholes, cracks, and road defects resolved',
    },
  ];

  return (
    <section id="infrastructure" className="relative bg-[#0d3137] py-24 text-[#f0fdf4] border-t border-[#144943]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-[#8BBB92] font-semibold">
            Modular Municipal Architecture
          </span>
          <h2 className="mt-2 font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#f0fdf4] uppercase leading-[1.1]">
            Built on open edge infrastructure for modern smart cities.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#8BBB92] font-sans">
            Scales seamlessly from a single municipal bus depot to thousands of public transit vehicles with zero disruption to vehicle operations.
          </p>
        </div>

        {/* 4 Department Architecture Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {departments.map((dept) => (
            <div
              key={dept.id}
              className="flex flex-col justify-between rounded-2xl border border-[#144943] bg-[#092328]/80 p-6 transition-all hover:border-[#2A835F] hover:bg-[#092328] shadow-lg group"
            >
              <div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl font-display text-xs font-bold mb-5 ${dept.color}`}>
                  {dept.code}
                </div>
                <h3 className="text-base font-bold text-[#f0fdf4] mb-2 group-hover:text-[#8BBB92] transition-colors">
                  {dept.title}
                </h3>
                <p className="text-xs text-[#8BBB92] leading-relaxed font-sans mb-4">
                  {dept.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-[#144943] text-[11px] font-mono text-[#5b9076]">
                {dept.role}
              </div>
            </div>
          ))}
        </div>

        {/* Stat Numbers Row */}
        <div className="rounded-2xl border border-[#1d6d63] bg-[#092328] p-8 sm:p-12 shadow-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div 
                key={idx} 
                className="flex flex-col border-b sm:border-b-0 sm:border-r border-[#144943] last:border-r-0 pb-6 sm:pb-0 pr-0 sm:pr-6"
              >
                <div className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#f0fdf4]">
                  {stat.value}
                </div>
                <div className="mt-2 text-sm font-bold text-[#8BBB92]">
                  {stat.label}
                </div>
                <div className="mt-1 text-xs font-mono text-[#5b9076]">
                  {stat.subtext}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
