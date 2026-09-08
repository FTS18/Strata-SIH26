import React, { useState } from 'react';
import { Video, Cpu, Activity, RefreshCw, Radio, Camera, Shield, Eye, Users } from 'lucide-react';
import { useTelemetryStore } from '@/features/fleet-telemetry/telemetryStore';
import { LensQualityOptimizer } from './LensQualityOptimizer';

export type CameraAngle = 'front' | 'rear' | 'kerb_side' | 'cabin';

interface CameraAngleConfig {
  id: CameraAngle;
  label: string;
  description: string;
  aiTarget: string;
  icon: React.ReactNode;
  videoSrc: string;
  detectedObjects: { label: string; conf: string; boxClass: string; color: string }[];
}

export function LiveVideoStreamView() {
  const [selectedAngle, setSelectedAngle] = useState<CameraAngle>('front');
  const avgFleetFps = useTelemetryStore((state) => state.avgFleetFps);

  const cameraAngles: CameraAngleConfig[] = [
    {
      id: 'front',
      label: '1. Front Road Camera (3840x2160)',
      description: 'Road Surface Distress, Potholes, Waterlogging & Dividers',
      aiTarget: 'YOLOv8 Road Damage + IMU Fusion',
      icon: <Camera className="h-4 w-4" />,
      videoSrc: '/videos/13191182_3840_2160_30fps.mp4',
      detectedObjects: [
        { label: 'HEAVY VEHICLE (98.6%) · DL-01-GB-4019 [DIST: 16.4m]', conf: '98.6%', boxClass: 'top-[28%] right-[6%] sm:right-[8%] w-[150px] sm:w-[190px] h-[115px] sm:h-[135px]', color: 'border-emerald-400 bg-emerald-500/10' },
        { label: 'ROAD POTHOLE (94.2%) [IMU Z=2.84g SPIKE]', conf: '94.2%', boxClass: 'bottom-3 sm:bottom-4 left-[34%] sm:left-[38%] w-[130px] sm:w-[155px] h-[40px] sm:h-[48px]', color: 'border-amber-400 bg-amber-500/20' },
      ],
    },
    {
      id: 'rear',
      label: '2. Rear Traffic Camera (UHD 4K)',
      description: 'Tailgating, Rash Driving & Hit-and-Run ANPR OCR',
      aiTarget: 'PaddleOCR + Indian Plate RegEx',
      icon: <Shield className="h-4 w-4" />,
      videoSrc: '/videos/delhi_rajpath_anpr.mp4',
      detectedObjects: [
        { label: 'ANPR: UP-16-BT-5797 [INNOVA · 68 km/h]', conf: '98.4%', boxClass: 'bottom-12 left-[38%]', color: 'border-emerald-400 bg-emerald-500/15' },
        { label: 'HIGH-SECURITY ZONE: KARTAVYA PATH', conf: '96.2%', boxClass: 'top-10 right-[32%]', color: 'border-[var(--color-accent-primary)] bg-[var(--surface-subtle)]/40' },
      ],
    },
    {
      id: 'kerb_side',
      label: '3. Kerb / Bus Stop Camera (1080p)',
      description: 'Zebra Crossings, Missing Signboards & Bus Stop Passenger Queue',
      aiTarget: 'Optical Flow Crowd Density',
      icon: <Eye className="h-4 w-4" />,
      videoSrc: '/videos/3695964-hd_1920_1080_24fps.mp4',
      detectedObjects: [
        { label: 'BUS STOP QUEUE: 42 COMMUTERS [SURGE DETECTED]', conf: '96.4%', boxClass: 'bottom-10 left-[24%]', color: 'border-amber-400 bg-amber-500/15' },
        { label: 'ENCROACHMENT: STREET CART (86.1%)', conf: '86.1%', boxClass: 'top-12 right-[20%]', color: 'border-cyan-400 bg-cyan-500/15' },
      ],
    },
    {
      id: 'cabin',
      label: '4. Driver Cabin DMS Camera',
      description: 'Onboard Passenger Occupancy & Driver Drowsiness',
      aiTarget: 'Driver Monitoring System (DMS)',
      icon: <Users className="h-4 w-4" />,
      videoSrc: '/videos/13191182_3840_2160_30fps.mp4',
      detectedObjects: [
        { label: 'DRIVER ALERT: ATTENTIVE (PERCLOS: 4.2%)', conf: '99.2%', boxClass: 'top-16 left-[35%]', color: 'border-emerald-400 bg-emerald-500/15' },
      ],
    },
  ];

  const handleAngleChange = (angle: CameraAngle) => {
    setSelectedAngle(angle);
  };

  const activeAngleConfig = cameraAngles.find((c) => c.id === selectedAngle) || cameraAngles[0];

  return (
    <div className="flex h-full w-full flex-col gap-4 overflow-y-auto p-3 sm:p-5 bg-[var(--surface-canvas)] text-[var(--text-primary)]">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-[var(--surface-border)] pb-3 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--surface-subtle)] border border-[var(--color-accent-primary)] text-[var(--text-secondary)]">
            <Video className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">
              Edge AI Multi-Camera Inference Stream (BEL SIH26124)
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              Simultaneous 4-camera onboard sensing on NVIDIA Jetson Orin Nano with INT8 TensorRT acceleration
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 rounded border border-[var(--color-accent-primary)] bg-[var(--surface-subtle)] px-2.5 py-1 text-xs font-mono text-[var(--text-secondary)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#94a3b8] animate-pulse" />
            4 Channels Synced (Edge Bus 101)
          </span>
        </div>
      </div>

      {/* 4-Camera Angle Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 shrink-0">
        {cameraAngles.map((cam) => {
          const isSelected = selectedAngle === cam.id;
          return (
            <button
              key={cam.id}
              onClick={() => handleAngleChange(cam.id)}
              className={`flex flex-col items-start gap-1 rounded-lg border p-2.5 sm:p-3 text-left transition-all cursor-pointer ${
                isSelected
                  ? 'border-[var(--color-accent-primary)] bg-[var(--surface-subtle)] text-[var(--text-primary)] shadow-sm ring-1 ring-[#94a3b8]'
                  : 'border-[var(--surface-border)] bg-[var(--surface-panel)] text-[var(--text-secondary)] hover:bg-[var(--surface-subtle)]/50'
              }`}
            >
              <div className="flex items-center gap-2">
                {cam.icon}
                <span className="text-xs font-semibold">{cam.label.split('(')[0].trim()}</span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] line-clamp-1">{cam.description}</p>
            </button>
          );
        })}
      </div>

      {/* Main Video Screen Container */}
      <div className="grid flex-1 grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 overflow-y-auto">
        {/* Left 2 Cols on Desktop, Full on Mobile: Video Stream with Overlay */}
        <div className="col-span-1 lg:col-span-2 flex flex-col rounded-xl border border-[var(--surface-border)] bg-black overflow-hidden shadow-2xl min-h-[340px] sm:min-h-[380px]">
          <div className="flex items-center justify-between border-b border-[var(--surface-border)] bg-[var(--surface-canvas)] px-4 py-2 text-xs font-mono text-[var(--text-secondary)] shrink-0">
            <div className="flex items-center gap-2">
              <Radio className="h-3.5 w-3.5 text-[var(--color-accent-cyan)] animate-pulse" />
              <span className="font-bold text-[var(--text-primary)]">CHANNEL: {activeAngleConfig.label.toUpperCase()}</span>
            </div>
            <span className="text-[var(--text-secondary)]">AI TARGET: {activeAngleConfig.aiTarget.toUpperCase()}</span>
          </div>

          <div className="relative flex flex-1 items-center justify-center bg-black overflow-hidden">
            {/* Live Python YOLOv8 stream on front camera if online */}
            {selectedAngle === 'front' && (
              <img
                src="http://localhost:8080/stream"
                alt="Live Python YOLOv8 Stream"
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
                onLoad={(e) => {
                  (e.target as HTMLElement).style.display = 'block';
                }}
              />
            )}

            {/* Real Active Video Stream */}
            <video
              key={activeAngleConfig.videoSrc}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 h-full w-full object-cover -z-10"
              src={activeAngleConfig.videoSrc}
            />

            {/* Inference HUD Overlay */}
            <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3 bg-gradient-to-t from-black/60 via-transparent to-black/30">
              {/* Top HUD Telemetry */}
              <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-secondary)]">
                <div className="flex items-center gap-1.5 rounded bg-black/75 px-2 py-0.5 border border-[var(--surface-border)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[var(--text-primary)] font-bold">EDGE INFERENCE ONLINE</span>
                  <span className="text-[var(--text-secondary)]">· {avgFleetFps.toFixed(1)} FPS</span>
                </div>
                <div className="rounded bg-black/75 px-2 py-0.5 border border-[var(--surface-border)] text-[var(--text-secondary)]">
                  NVIDIA JETSON ORIN NANO 8GB
                </div>
              </div>

              {/* Bottom HUD Telemetry Footer */}
              <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-secondary)] bg-black/75 px-3 py-1 rounded border border-[var(--surface-border)]">
                <span>MODEL: {activeAngleConfig.aiTarget}</span>
                <span className="text-[var(--text-primary)] font-bold">LATENCY: 14.8ms</span>
                <span className="text-emerald-400">INT8 QUANTIZED</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Real-time Edge Diagnostics */}
        <div className="flex flex-col gap-3 overflow-y-auto">
          {/* Edge Compute Metrics */}
          <div className="rounded-lg border border-[var(--surface-border)] bg-[var(--surface-panel)] p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[var(--surface-border)] pb-2 text-xs font-semibold text-[var(--text-primary)]">
              <span>Onboard Sensing Specification</span>
              <Cpu className="h-4 w-4 text-[var(--text-secondary)]" />
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Camera Angle:</span>
                <span className="text-[var(--text-primary)] font-semibold">{activeAngleConfig.label}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Target Task:</span>
                <span className="text-[var(--text-secondary)]">{activeAngleConfig.aiTarget}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Speed-Adaptive FPS:</span>
                <span className="text-[var(--text-primary)] font-bold">{avgFleetFps.toFixed(1)} FPS</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Jetson Power Draw:</span>
                <span className="text-[var(--text-secondary)]">14.2 W (Orin Nano)</span>
              </div>
            </div>
          </div>

          {/* Bandwidth Minimization Proof */}
          <div className="rounded-lg border border-[var(--surface-border)] bg-[var(--surface-panel)] p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-[var(--text-primary)]">
              <span>Bandwidth Minimization Proof</span>
              <Activity className="h-4 w-4 text-[var(--text-secondary)]" />
            </div>
            <p className="text-xs text-[var(--text-secondary)]">
              Video processed locally on edge bus. Only tiny lightweight JSON metadata (&lt; 2 KB) is uploaded over 4G/5G:
            </p>
            <div className="rounded border border-[var(--surface-border)] bg-[var(--surface-canvas)] p-2.5 text-[11px] font-mono space-y-1 text-[var(--text-secondary)]">
              <p>• Raw Video Stream: <strong className="text-rose-400">12.0 MB / min</strong></p>
              <p>• Edge Metadata JSON: <strong className="text-[var(--text-secondary)]">14.2 KB / min</strong></p>
              <p>• Bandwidth Saved: <strong className="text-[var(--text-primary)]">99.88%</strong></p>
            </div>
          </div>
        </div>
      </div>

      {/* Lens Quality Index (LQI) & CLAHE De-Hazing Module */}
      <div className="pt-2">
        <LensQualityOptimizer />
      </div>
    </div>
  );
}
