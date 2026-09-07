'use client';

import React, { useState } from 'react';
import { 
  Wrench, 
  ShieldAlert, 
  Activity, 
  Users, 
  Cpu, 
  CheckCircle2, 
  ArrowRight, 
  Radio, 
  Zap, 
  ShieldCheck,
  Eye,
  Crosshair,
  FileCheck
} from 'lucide-react';

interface FeatureItem {
  id: string;
  title: string;
  shortDesc: string;
  detailedDesc: string;
  badge: string;
  icon: React.ReactNode;
  hudTitle: string;
  hudMetric: string;
  hudStatus: string;
  hudDetails: { label: string; value: string }[];
}

export function LandingFeatureShowcase() {
  const [activeFeatureId, setActiveFeatureId] = useState<string>('potholes');

  const features: FeatureItem[] = [
    {
      id: 'potholes',
      title: 'Autonomous Road Hazard Auditing',
      shortDesc: 'Continuous pavement scanning at 30 FPS with sub-centimeter GPS accuracy.',
      detailedDesc: 'Trained on 85,000+ Indian road distress images, our edge vision model identifies potholes, structural fissures, and rutting in real time. Work orders are generated instantly with verified surface area, volume, and GPS coordinates.',
      badge: 'PWD Road Infra',
      icon: <Wrench className="h-5 w-5" />,
      hudTitle: 'PWD Pothole Vision Engine',
      hudMetric: '0.42 m² Surface Area',
      hudStatus: 'Auto-Audited (WO #892)',
      hudDetails: [
        { label: 'Severity Index', value: 'Critical (88/100)' },
        { label: 'GPS Geofence', value: '28.5355° N, 77.2610° E' },
        { label: 'Ward & Zone', value: 'Ward 14 (South East Delhi)' },
        { label: 'Dispatched To', value: 'Shree Balaji Contractor' },
      ],
    },
    {
      id: 'anpr',
      title: 'High-Recall ANPR & Hotlist Intercepts',
      shortDesc: 'Multi-frame temporal tracking cross-referenced with national databases.',
      detailedDesc: 'Eliminates detector drops and synthetic hallucinations. High-precision license plate recognition runs at edge speeds to flag stolen vehicles, expired fitness certificates, and red-light violations in milliseconds.',
      badge: 'Traffic Police',
      icon: <ShieldAlert className="h-5 w-5" />,
      hudTitle: 'ANPR Neural Surveillance',
      hudMetric: 'Plate DL-01-AB-1234',
      hudStatus: 'Warrant Intercept Flag',
      hudDetails: [
        { label: 'Match Confidence', value: '99.4% (Multi-Frame)' },
        { label: 'Vehicle Type', value: 'BPCL Commercial Tanker' },
        { label: 'Flag Reason', value: 'Warrant / Stolen Vehicle' },
        { label: 'Action Taken', value: 'E-Challan #8841 Dispatched' },
      ],
    },
    {
      id: 'kinematics',
      title: 'Corridor Kinematics & Congestion Flow',
      shortDesc: 'Real-time vehicle classification, density metrics, and bottleneck alerts.',
      detailedDesc: 'DTC buses act as continuous moving radar across 40+ arteries, calculating lane velocity, micro-delays, and traffic density without expensive static roadside sensors.',
      badge: 'Transit Telemetry',
      icon: <Activity className="h-5 w-5" />,
      hudTitle: 'Corridor Flow Radar',
      hudMetric: '42 km/h Avg Velocity',
      hudStatus: 'Fluid Flow (Grade A)',
      hudDetails: [
        { label: 'Corridor Route', value: 'Outer Ring Road (Nehru Place)' },
        { label: 'Vehicle Density', value: '78 Vehicles / Min' },
        { label: 'Congestion Index', value: '0.38 (Nominal)' },
        { label: 'Delay Prediction', value: '0 Min Delay Variance' },
      ],
    },
    {
      id: 'pedestrian',
      title: 'Sidewalk Safety & Pedestrian Corridors',
      shortDesc: 'Edge crowd density alerts for school zones and transit interchanges.',
      detailedDesc: 'Scans roadway margins to identify pedestrian overhangs, jaywalking spikes, and vulnerable road users, instantly pinging bus operators with preemptive safety advisories.',
      badge: 'Citizen Safety',
      icon: <Users className="h-5 w-5" />,
      hudTitle: 'Pedestrian Spatial HUD',
      hudMetric: 'Roadway Clear (0 Overhangs)',
      hudStatus: 'Safe Operating Zone',
      hudDetails: [
        { label: 'Corridor Type', value: 'High Footfall Transit Depot' },
        { label: 'Sidewalk Crowd', value: 'Moderate (Active Buffer)' },
        { label: 'Speed Advisory', value: 'Maintain 35 km/h' },
        { label: 'Vision Stream', value: 'Wide Angle Edge Cam #2' },
      ],
    },
    {
      id: 'bandwidth',
      title: '99.8% Edge Bandwidth Compression',
      shortDesc: 'Process raw video on-device and transmit only cryptographic JSON payloads.',
      detailedDesc: 'Instead of streaming gigabytes of raw video over costly cellular links, Strata extracts vector coordinates, telemetry, and bounding boxes on-device. Bandwidth drops from 112.5 MB/min to 13.2 KB/min.',
      badge: 'Zero Cloud Congestion',
      icon: <Cpu className="h-5 w-5" />,
      hudTitle: 'Edge Bitrate Optimizer',
      hudMetric: '13.2 KB/min Cellular Uplink',
      hudStatus: '99.8% Data Reduction',
      hudDetails: [
        { label: 'Raw Camera Stream', value: '112.5 MB/min (4K 30 FPS)' },
        { label: 'Telemetry Uplink', value: '13.2 KB/min JSON Vector' },
        { label: 'Latency to Cloud', value: '12ms On-Device Edge' },
        { label: 'Carrier Cost Saving', value: '98.7% Monthly Cellular' },
      ],
    },
    {
      id: 'verification',
      title: 'Automated Contractor Repair Verification',
      shortDesc: 'Autonomous closed-loop before-and-after auditing for civic maintenance.',
      detailedDesc: 'When contractors patch a pothole, recurring transit buses autonomously rescan the coordinates. The AI checks pavement leveling and depth, automatically clearing or rejecting the contractor work order.',
      badge: 'Fiscal Accountability',
      icon: <FileCheck className="h-5 w-5" />,
      hudTitle: 'Audit Closed-Loop Protocol',
      hudMetric: 'Repair Verified (98.6%)',
      hudStatus: 'Work Order #WO-892 Cleared',
      hudDetails: [
        { label: 'Initial Defect', value: '0.42 m² Critical Pothole' },
        { label: 'Rescan Verification', value: 'Level Surface (0mm Rut)' },
        { label: 'Contractor Audit', value: 'Approved for Payout' },
        { label: 'Inspection Bus', value: 'DL-1PC-8821 (Route 428)' },
      ],
    },
  ];

  const activeFeature = features.find((f) => f.id === activeFeatureId) || features[0];

  return (
    <section id="capabilities" className="relative bg-[#FBFDFB] py-24 text-[#092328] border-t border-[#12544F]/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#092328] uppercase leading-[1.1]">
            Your transit fleet was built to move people. <br />
            <span className="text-[#2A835F]">Now it powers the city.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#092328]/75 font-sans">
            Transform municipal buses into an autonomous edge-AI sensory grid delivering continuous real-time intelligence to Public Works, Traffic Police, and City Command Centers.
          </p>
        </div>

        {/* Two-Column Interactive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Vertical Interactive Accordion Tabs */}
          <div className="lg:col-span-6 space-y-3">
            {features.map((feature) => {
              const isActive = feature.id === activeFeatureId;

              return (
                <div
                  key={feature.id}
                  onClick={() => setActiveFeatureId(feature.id)}
                  className={`rounded-2xl border transition-all cursor-pointer p-4 sm:p-5 ${
                    isActive
                      ? 'border-[#2A835F] bg-[#f0fdf4] shadow-md shadow-[#2A835F]/10'
                      : 'border-[#12544F]/15 bg-white hover:border-[#2A835F]/40 hover:bg-[#fafdfb]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${
                          isActive
                            ? 'bg-[#2A835F] text-[#f0fdf4]'
                            : 'bg-[#12544F]/10 text-[#092328]'
                        }`}
                      >
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-base font-bold text-[#092328]">
                          {feature.title}
                        </h3>
                        <span className="text-[11px] font-mono text-[#2A835F] font-medium">
                          {feature.badge}
                        </span>
                      </div>
                    </div>

                    <ArrowRight
                      className={`h-4 w-4 transition-transform ${
                        isActive
                          ? 'translate-x-1 text-[#2A835F]'
                          : 'text-[#092328]/40'
                      }`}
                    />
                  </div>

                  {/* Expanded Content for Active Tab */}
                  {isActive && (
                    <div className="mt-3 pl-12 text-xs sm:text-sm text-[#092328]/80 leading-relaxed font-sans border-t border-[#2A835F]/15 pt-3 animate-in fade-in duration-200">
                      <p>{feature.detailedDesc}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column: High-Impact Vibrant Showcase Card */}
          <div className="lg:col-span-6">
            <div className="sticky top-28 overflow-hidden rounded-3xl bg-gradient-to-br from-[#2A835F] via-[#359B70] to-[#8BBB92] p-6 sm:p-8 shadow-2xl shadow-[#2A835F]/20 text-[#f0fdf4]">
              {/* Dynamic Feature Label */}
              <div className="flex items-center justify-between mb-6">
                <span className="rounded-full bg-[#092328]/40 px-3.5 py-1 text-xs font-mono font-medium backdrop-blur-md text-[#f0fdf4]">
                  {activeFeature.badge}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-mono text-[#092328] font-bold bg-white/80 px-2.5 py-1 rounded-full">
                  <Radio className="h-3 w-3 text-[#2A835F] animate-pulse" />
                  LIVE EDGE INFERENCE
                </span>
              </div>

              {/* Floating Dark HUD Card inside */}
              <div className="rounded-2xl border border-[#1d6d63] bg-[#092328] p-5 sm:p-6 shadow-2xl text-[#f0fdf4]">
                {/* HUD Header */}
                <div className="flex items-center justify-between border-b border-[#144943] pb-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2A835F] text-[#f0fdf4]">
                      {activeFeature.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold uppercase tracking-wide font-display text-[#f0fdf4]">
                        {activeFeature.hudTitle}
                      </h4>
                      <p className="text-[11px] font-mono text-[#8BBB92]">
                        Sensor Fusion & Edge Neural Pipeline
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full border border-[#2A835F]/40 bg-[#12544F] px-2.5 py-1 text-[10px] font-mono text-[#8BBB92]">
                    {activeFeature.hudStatus}
                  </span>
                </div>

                {/* Primary Metric Callout */}
                <div className="rounded-xl border border-[#144943] bg-[#0d3137] p-4 mb-4">
                  <span className="text-[10px] font-mono uppercase text-[#8BBB92] tracking-wider">
                    Edge Detection Payload
                  </span>
                  <div className="mt-1 font-display text-2xl sm:text-3xl font-bold text-[#f0fdf4] tracking-tight">
                    {activeFeature.hudMetric}
                  </div>
                </div>

                {/* Structured Metadata Breakdown */}
                <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
                  {activeFeature.hudDetails.map((detail, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-[#144943]/60 bg-[#0d3137]/60 p-2.5"
                    >
                      <span className="block text-[10px] text-[#8BBB92]">{detail.label}</span>
                      <span className="font-semibold text-[#f0fdf4] truncate block mt-0.5">
                        {detail.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Verification Footer */}
                <div className="mt-4 flex items-center justify-between pt-3 border-t border-[#144943] text-[11px] font-mono text-[#8BBB92]">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#2A835F]" />
                    <span>Cryptographic Edge Verification</span>
                  </div>
                  <span className="text-[#f0fdf4]">12ms Latency</span>
                </div>
              </div>

              {/* Bottom Card Summary */}
              <p className="mt-6 text-xs sm:text-sm text-[#092328] font-medium leading-relaxed">
                {activeFeature.shortDesc}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Dot Grid Matrix Backdrop below this section */}
      <div className="mt-16 h-12 w-full bg-dot-grid-light opacity-60" />
    </section>
  );
}
