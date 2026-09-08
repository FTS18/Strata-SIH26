'use client';

import React, { useRef } from 'react';
import {
  Camera,
  Shield,
  Eye,
  Users,
  Maximize2,
  Upload,
  RotateCcw,
  LayoutGrid,
  Square,
} from 'lucide-react';

export interface CameraFeedConfig {
  id: string;
  label: string;
  shortName: string;
  description: string;
  pythonStream: string;
  staticImage: string;
  model: string;
  resolution: string;
  latency: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const CAMERA_FEEDS: CameraFeedConfig[] = [
  {
    id: 'cam1',
    label: 'CAM 1 · FRONT (4K)',
    shortName: 'CAM 1',
    description: 'Road Surface Distress & Lead Traffic Tracking',
    pythonStream: 'http://localhost:8081/stream',
    staticImage: '/evidence/demo_cam1.jpg',
    model: 'YOLOv8s-RoadDistress · TensorRT INT8',
    resolution: '3840x2160 @ 30FPS',
    latency: '12.4ms',
    icon: Camera,
  },
  {
    id: 'cam2',
    label: 'CAM 2 · REAR (UHD)',
    shortName: 'CAM 2',
    description: 'ANPR Plate Recognition & Tailgating Analytics',
    pythonStream: 'http://localhost:8082/stream',
    staticImage: '/evidence/demo_cam2.jpg',
    model: 'PaddleOCR + ByteTrack · TensorRT INT8',
    resolution: '3840x2160 @ 30FPS',
    latency: '14.2ms',
    icon: Shield,
  },
  {
    id: 'cam3',
    label: 'CAM 3 · KERB (1080P)',
    shortName: 'CAM 3',
    description: 'Passenger Queue Density & Stop Encroachment',
    pythonStream: 'http://localhost:8083/stream',
    staticImage: '/evidence/demo_cam3.jpg',
    model: 'OpticalFlow-QueueCount · TensorRT INT8',
    resolution: '1920x1080 @ 24FPS',
    latency: '9.8ms',
    icon: Eye,
  },
  {
    id: 'cam4',
    label: 'CAM 4 · CABIN (DMS)',
    shortName: 'CAM 4',
    description: 'Driver Fatigue & Attention Monitoring',
    pythonStream: 'http://localhost:8084/stream',
    staticImage: '/evidence/demo_cam4.jpg',
    model: 'Driver-DMS PERCLOS · TensorRT INT8',
    resolution: '1920x1080 @ 30FPS',
    latency: '11.1ms',
    icon: Users,
  },
];

interface CameraQuadGridProps {
  viewMode: 'grid' | 'single';
  onViewModeChange: (mode: 'grid' | 'single') => void;
  selectedCamId: string;
  onSelectCamId: (camId: string) => void;
  avgFleetFps: number;
  cameraSourcesStatus: Record<string, { is_custom: boolean; filename: string }>;
  onFileUpload: (camId: string, file: File) => void;
  onResetFootage: (camId: string) => void;
  isUploading: boolean;
  streamBuster: number;
  onExpandModal: () => void;
  allDetectionsSummary?: Record<string, { vehicles: number; potholes: number; pedestrians: number }>;
}

export function CameraQuadGrid({
  viewMode,
  onViewModeChange,
  selectedCamId,
  onSelectCamId,
  avgFleetFps,
  cameraSourcesStatus,
  onFileUpload,
  onResetFootage,
  isUploading,
  streamBuster,
  onExpandModal,
  allDetectionsSummary,
}: CameraQuadGridProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const activeCam = CAMERA_FEEDS.find((c) => c.id === selectedCamId) || CAMERA_FEEDS[0];
  const [currentTime, setCurrentTime] = React.useState<string>('14:32:17');

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toTimeString().split(' ')[0] || '14:32:17'
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleQuadrantClick = (camId: string) => {
    if (viewMode === 'grid') {
      onSelectCamId(camId);
      onViewModeChange('single');
    } else {
      onViewModeChange('grid');
    }
  };

  return (
    <div className="flex flex-col space-y-2 rounded-xl border border-[var(--surface-border)] bg-[var(--surface-panel)] p-3 shadow-md h-full">
      {/* Top View Mode & Camera Selector Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--surface-border)] pb-2.5 font-mono text-xs">
        {/* Title and subtitle */}
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center h-4 w-4 text-[var(--color-accent-primary)]">
            <Camera className="h-4 w-4 text-[var(--color-accent-primary)]" />
          </div>
          <span className="font-bold text-[var(--text-primary)] tracking-wider uppercase text-xs">
            LIVE CAMERA FEEDS
          </span>
          <span className="hidden xl:inline text-[11px] text-[var(--text-secondary)]">
            4 Angles • Real-time Monitoring
          </span>
        </div>

        {/* Camera Selector Pills & Mode Toggles */}
        <div className="flex items-center gap-1.5 shrink-0">
          {CAMERA_FEEDS.map((feed) => {
            const isSelected = selectedCamId === feed.id;
            return (
              <button
                key={feed.id}
                type="button"
                onClick={() => {
                  onSelectCamId(feed.id);
                  if (viewMode === 'grid') {
                    onViewModeChange('single');
                  }
                }}
                className={`rounded-md px-2 py-1 text-[11px] font-mono uppercase tracking-wider transition-all cursor-pointer select-none ${
                  isSelected
                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                    : 'bg-[var(--surface-canvas)] border border-[var(--surface-border)] text-[var(--text-secondary)] hover:bg-[var(--surface-subtle)] hover:text-[var(--text-primary)]'
                }`}
              >
                {feed.shortName}
              </button>
            );
          })}

          {/* Grid Layout Toggle */}
          <button
            type="button"
            onClick={() => onViewModeChange('grid')}
            className={`flex items-center justify-center rounded-md p-1 border transition-colors cursor-pointer select-none ${
              viewMode === 'grid'
                ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                : 'bg-[var(--surface-canvas)] border-[var(--surface-border)] text-[var(--text-secondary)] hover:bg-[var(--surface-subtle)] hover:text-[var(--text-primary)]'
            }`}
            title="2x2 Grid View"
          >
            <LayoutGrid className="h-3.5 w-3.5" />
          </button>

          {/* Single Camera View Toggle */}
          <button
            type="button"
            onClick={() => onViewModeChange('single')}
            className={`flex items-center justify-center rounded-md p-1 border transition-colors cursor-pointer select-none ${
              viewMode === 'single'
                ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                : 'bg-[var(--surface-canvas)] border-[var(--surface-border)] text-[var(--text-secondary)] hover:bg-[var(--surface-subtle)] hover:text-[var(--text-primary)]'
            }`}
            title="Single Focus View"
          >
            <Square className="h-3.5 w-3.5" />
          </button>

          {/* Hidden File Input & Upload / Reset / Fullscreen */}
          <input
            type="file"
            ref={fileInputRef}
            accept="video/mp4,video/quicktime,video/x-msvideo,video/webm"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                onFileUpload(selectedCamId, file);
                e.target.value = '';
              }
            }}
          />

          <button
            type="button"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1 rounded-md border border-[var(--surface-border)] bg-[var(--surface-canvas)] px-2 py-1 text-[10px] font-mono font-semibold text-[var(--text-secondary)] hover:bg-[var(--surface-subtle)] hover:text-[var(--text-primary)] transition-all cursor-pointer shadow-xs disabled:opacity-50"
            title={`Upload footage for ${activeCam.shortName}`}
          >
            <Upload className="h-3 w-3 text-[var(--text-secondary)]" />
            <span className="hidden sm:inline">{isUploading ? '...' : 'Upload'}</span>
          </button>

          {cameraSourcesStatus[selectedCamId]?.is_custom && (
            <button
              type="button"
              onClick={() => onResetFootage(selectedCamId)}
              className="flex items-center gap-1 rounded-md border border-amber-300 bg-amber-50 dark:border-amber-800/80 dark:bg-amber-950/40 px-1.5 py-1 text-[10px] font-mono text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-colors cursor-pointer"
              title="Reset footage"
            >
              <RotateCcw className="h-3 w-3 text-amber-600 dark:text-amber-400" />
            </button>
          )}

          <button
            type="button"
            onClick={onExpandModal}
            className="flex items-center justify-center rounded-md bg-[var(--surface-canvas)] p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-subtle)] border border-[var(--surface-border)] transition-colors cursor-pointer"
            title="Expand Fullscreen"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Main Stream Canvas: 2x2 Grid or 1-Up Focus */}
      {viewMode === 'grid' ? (
        /* ================= 2x2 QUAD CAMERA GRID ================= */
        <div className="grid grid-cols-2 gap-2 flex-1 min-h-0 w-full">
          {CAMERA_FEEDS.map((feed) => {
            const isCustom = cameraSourcesStatus[feed.id]?.is_custom;
            const summary = allDetectionsSummary?.[feed.id];
            const angleLabel =
              feed.id === 'cam1'
                ? 'CAM 1 - FRONT (4K)'
                : feed.id === 'cam2'
                ? 'CAM 2 - LEFT (4K)'
                : feed.id === 'cam3'
                ? 'CAM 3 - RIGHT (4K)'
                : 'CAM 4 - REAR (4K)';

            return (
              <div
                key={feed.id}
                onClick={() => handleQuadrantClick(feed.id)}
                className="group relative flex items-center justify-center rounded-lg border border-[var(--surface-border)] hover:border-[#00e5bf] bg-black overflow-hidden shadow-lg cursor-pointer transition-all duration-150"
                title={`Click to focus ${feed.label}`}
              >
                {/* Live MJPEG Stream for this quadrant */}
                <img
                  src={feed.pythonStream}
                  alt={`Live Stream - ${feed.label}`}
                  className="absolute inset-0 h-full w-full object-cover z-0"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.dataset.retried) {
                      target.dataset.retried = 'true';
                      target.src = `http://localhost:8080/stream?cam=${feed.id}`;
                    } else if (feed.staticImage && target.src !== feed.staticImage) {
                      target.src = feed.staticImage;
                    }
                  }}
                />

                {/* Top Overlay Badges */}
                <div className="absolute top-2 inset-x-2 flex items-center justify-between z-10 pointer-events-none font-mono text-[10px]">
                  <div className="flex items-center gap-1.5 rounded-full bg-black/75 backdrop-blur-md px-2 py-0.5 border border-[var(--surface-border)]/80">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-bold text-white uppercase">{angleLabel}</span>
                  </div>

                  <div className="rounded-full bg-black/75 backdrop-blur-md px-2 py-0.5 border border-[var(--surface-border)]/80 text-[var(--text-secondary)]">
                    {currentTime}
                  </div>
                </div>

                {/* Bottom Left Live Badge */}
                <div className="absolute bottom-2 left-2 z-10 pointer-events-none font-mono text-[10px]">
                  <div className="flex items-center gap-1.5 rounded-full bg-black/75 backdrop-blur-md px-2 py-0.5 border border-[var(--surface-border)]/80">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[var(--text-primary)]">Live</span>
                  </div>
                </div>

                {/* Hover Cue Center Overlay */}
                <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150 bg-black/40 pointer-events-none">
                  <div className="flex items-center gap-1.5 rounded-md bg-[var(--surface-subtle)]/90 border border-[#94a3b8] px-2.5 py-1 text-[10px] font-mono font-bold text-[var(--text-primary)] shadow-lg">
                    <Square className="h-3 w-3 text-[var(--text-secondary)]" />
                    <span>CLICK TO FOCUS (1-UP)</span>
                  </div>
                </div>

                {/* Bottom Right Detection Summary */}
                {summary && (
                  <div className="absolute bottom-2 right-2 z-10 pointer-events-none font-mono text-[9px] rounded-full bg-black/75 backdrop-blur-md px-2 py-0.5 border border-[var(--surface-border)]/80 text-[var(--text-secondary)]">
                    {summary.vehicles} VEH · {summary.potholes} DEF
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* ================= 1-UP SINGLE FOCUS VIEW ================= */
        <div
          onClick={() => handleQuadrantClick(selectedCamId)}
          className="group relative flex flex-1 min-h-0 w-full items-center justify-center rounded-xl border-2 border-[var(--surface-border)] hover:border-[#94a3b8] bg-black overflow-hidden shadow-2xl cursor-pointer transition-all"
          title="Click feed to return to 2x2 Quad Grid"
        >
          {/* Focused Live MJPEG Stream */}
          <img
            key={activeCam.id}
            src={activeCam.pythonStream}
            alt={`Live Focused Stream - ${activeCam.label}`}
            className="absolute inset-0 h-full w-full object-cover z-0"
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.dataset.retried) {
                target.dataset.retried = 'true';
                target.src = `http://localhost:8080/stream?cam=${activeCam.id}`;
              } else if (activeCam.staticImage && target.src !== activeCam.staticImage) {
                target.src = activeCam.staticImage;
              }
            }}
          />

          {/* Telemetry Header & Footer HUD Overlay */}
          <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-2.5 sm:p-3 bg-gradient-to-t from-black/60 via-transparent to-black/40 z-20">
            {/* Top HUD Row */}
            <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-secondary)]">
              <div className="flex items-center gap-1.5 rounded bg-black/80 px-2 py-0.5 border border-[var(--surface-border)]">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[var(--text-primary)] font-bold">JETSON ORIN NANO</span>
                <span className="text-[var(--text-secondary)]">· {avgFleetFps.toFixed(1)} FPS (LIVE)</span>
              </div>

              <div className="flex items-center gap-1.5 pointer-events-auto">
                {/* Back to 2x2 Grid Badge Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewModeChange('grid');
                  }}
                  className="flex items-center gap-1 rounded bg-[var(--surface-subtle)] px-2 py-0.5 border border-[var(--color-accent-primary)] text-[9px] font-bold font-mono text-[var(--text-primary)] hover:bg-[#2563eb] transition-colors cursor-pointer shadow-sm"
                  title="Return to 2x2 Grid"
                >
                  <LayoutGrid className="h-3 w-3 text-[var(--text-secondary)]" />
                  <span>BACK TO 2x2 GRID</span>
                </button>

                <div className="rounded bg-black/80 px-2 py-0.5 border border-[var(--surface-border)] text-[var(--text-secondary)]">
                  {activeCam.label}
                </div>
              </div>
            </div>

            {/* Center Hover Cue */}
            <div className="flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none">
              <div className="flex items-center gap-1.5 rounded-md bg-[var(--surface-panel)]/90 border border-[#94a3b8] px-3 py-1.5 text-xs font-mono font-bold text-[var(--text-primary)] shadow-lg">
                <LayoutGrid className="h-3.5 w-3.5 text-[var(--text-secondary)]" />
                <span>CLICK ANYWHERE TO RETURN TO 2x2 GRID</span>
              </div>
            </div>

            {/* Bottom Telemetry Footer */}
            <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-secondary)] bg-black/80 px-2.5 py-1 rounded border border-[var(--surface-border)]">
              <span className="truncate max-w-[55%]">MODEL: {activeCam.model}</span>
              <span className="text-[var(--text-primary)] font-bold hidden sm:inline">
                ACCELERATION: DIRECT3D/NVDEC
              </span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                LIVE ACTIVE
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
