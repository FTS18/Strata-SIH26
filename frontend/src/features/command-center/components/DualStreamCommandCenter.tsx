'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Video,
  Zap,
  Radio,
  HardDrive,
  ShieldCheck,
  CheckCircle2,
  X,
  Upload,
  RotateCcw,
  Star,
  Map as MapIcon,
} from 'lucide-react';
import { MapViewport } from '@/features/gis-map/components/MapViewport';
import { LiveIncidentFeed } from '@/features/road-defects/components/LiveIncidentFeed';
import { DefectInspectionDrawer } from '@/features/road-defects/components/DefectInspectionDrawer';
import { IncidentReportDrawer } from './IncidentReportDrawer';
import { SpeedBreakerWhitelistModal } from '@/features/road-defects/components/SpeedBreakerWhitelistModal';
import { CircularRingBufferModal } from '@/features/edge-hardware/components/CircularRingBufferModal';
import { useTelemetryStore } from '@/features/fleet-telemetry/telemetryStore';
import { useWorkOrderStore } from '@/features/roles/stores/workOrderStore';
import { type RoadDefect, type VehicleIncident } from '@/types';
import { SchoolZoneSafetyAlert } from '@/features/pedestrian-safety/components/SchoolZoneSafetyAlert';
import { CameraQuadGrid, CAMERA_FEEDS } from './CameraQuadGrid';
import {
  FiveTierPerceptionEngine,
  type VisionTelemetryData,
  type AllVisionDetectionsData,
} from './FiveTierPerceptionEngine';
import { ImuTelemetryGraph } from './ImuTelemetryGraph';
import { EdgeComputeHealthGraph } from './EdgeComputeHealthGraph';
import { RealtimeMonitoringBanner } from './RealtimeMonitoringBanner';
import { PentagonPerceptionRadar } from './PentagonPerceptionRadar';

export function DualStreamCommandCenter() {
  const [viewMode, setViewMode] = useState<'grid' | 'single'>('grid');
  const [selectedCamId, setSelectedCamId] = useState('cam1');
  const [isExpandedModal, setIsExpandedModal] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeReportItem, setActiveReportItem] = useState<{
    item: RoadDefect | VehicleIncident | null;
    category: 'defect' | 'incident' | null;
  }>({ item: null, category: null });
  const [isReportDrawerOpen, setIsReportDrawerOpen] = useState(false);

  const defects = useTelemetryStore((state) => state.defects);
  const incidents = useTelemetryStore((state) => state.incidents);
  const buses = useTelemetryStore((state) => state.buses);
  const selectedDefectId = useTelemetryStore((state) => state.selectedDefectId);
  const bandwidthMetrics = useTelemetryStore((state) => state.bandwidthMetrics);
  const avgFleetFps = useTelemetryStore((state) => state.avgFleetFps);

  const setSelectedDefectId = useTelemetryStore((state) => state.setSelectedDefectId);
  const createTicketFromDefect = useWorkOrderStore((state) => state.createTicketFromDefect);

  const activeSelectedDefect = defects.find((d) => d.id === selectedDefectId) || null;
  const activeCam = CAMERA_FEEDS.find((c) => c.id === selectedCamId) || CAMERA_FEEDS[0];

  const isSpeedBreakerModalOpen = useTelemetryStore((state) => state.isSpeedBreakerModalOpen);
  const setIsSpeedBreakerModalOpen = useTelemetryStore((state) => state.setIsSpeedBreakerModalOpen);
  const isRingBufferModalOpen = useTelemetryStore((state) => state.isRingBufferModalOpen);
  const setIsRingBufferModalOpen = useTelemetryStore((state) => state.setIsRingBufferModalOpen);
  const [telemetryToast, setTelemetryToast] = useState<string | null>(null);

  // Camera Custom Footage State
  const [cameraSourcesStatus, setCameraSourcesStatus] = useState<Record<string, { is_custom: boolean; filename: string }>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [streamBuster, setStreamBuster] = useState<number>(Date.now());
  const modalFileInputRef = useRef<HTMLInputElement | null>(null);

  const fetchCameraSources = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/v1/vision/sources');
      if (res.ok) {
        const data = await res.json();
        setCameraSourcesStatus(data);
      }
    } catch {
      // Offline fallback
    }
  };

  useEffect(() => {
    fetchCameraSources();
    const interval = setInterval(fetchCameraSources, 6000);
    return () => clearInterval(interval);
  }, []);

  // Multi-Camera & Single-Camera Real-time Vision Ingestion
  const [allVision, setAllVision] = useState<AllVisionDetectionsData | null>(null);
  const [singleVision, setSingleVision] = useState<VisionTelemetryData | null>(null);

  useEffect(() => {
    let isMounted = true;
    const pollTelemetry = async () => {
      try {
        const allRes = await fetch('http://localhost:8000/api/v1/vision/all-detections');
        if (allRes.ok) {
          const allData: AllVisionDetectionsData = await allRes.json();
          if (isMounted) {
            setAllVision(allData);
            if (allData.cameras && allData.cameras[selectedCamId]) {
              setSingleVision(allData.cameras[selectedCamId]);
            }
          }
          return;
        }

        // Fallback to single endpoint if all-detections endpoint is unavailable
        const singleRes = await fetch(`http://localhost:8000/api/v1/vision/detections?cam=${selectedCamId}`);
        if (singleRes.ok) {
          const singleData: VisionTelemetryData = await singleRes.json();
          if (isMounted) {
            setSingleVision(singleData);
          }
        }
      } catch {
        // Backend offline fallback
      }
    };

    pollTelemetry();
    const interval = setInterval(pollTelemetry, 700);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [selectedCamId]);

  const handleFileUpload = async (camId: string, file: File) => {
    setIsUploading(true);
    showTelemetryToast(`Uploading footage for ${camId.toUpperCase()} (${file.name})...`);
    const formData = new FormData();
    formData.append('cam', camId);
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:8000/api/v1/vision/upload-footage', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showTelemetryToast(`Switched ${camId.toUpperCase()} to custom footage: ${file.name}`);
        setStreamBuster(Date.now());
        fetchCameraSources();
      } else {
        showTelemetryToast(`Upload failed: ${data.detail || 'Could not process video'}`);
      }
    } catch (err) {
      showTelemetryToast(`Network error: ${err instanceof Error ? err.message : 'Upload failed'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleResetFootage = async (camId: string) => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/vision/reset-footage?cam=${camId}`, {
        method: 'POST',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showTelemetryToast(`Restored default benchmark footage for ${camId.toUpperCase()}`);
        setStreamBuster(Date.now());
        fetchCameraSources();
      }
    } catch {
      showTelemetryToast('Failed to reset footage');
    }
  };

  const handleSelectDefect = (defectId: string) => {
    setSelectedDefectId(defectId);
    const defect = defects.find((d) => d.id === defectId) || null;
    if (defect) {
      setActiveReportItem({ item: defect, category: 'defect' });
      setIsReportDrawerOpen(true);
    } else {
      setIsDrawerOpen(true);
    }
  };

  const handleSelectIncident = (incidentId: string) => {
    const inc = incidents.find((i) => i.id === incidentId) || null;
    if (inc) {
      setActiveReportItem({ item: inc, category: 'incident' });
      setIsReportDrawerOpen(true);
    }
  };

  const handleCreateWorkOrder = (defect: RoadDefect) => {
    createTicketFromDefect(defect);
  };

  const showTelemetryToast = (msg: string) => {
    setTelemetryToast(msg);
    setTimeout(() => setTelemetryToast(null), 4000);
  };

  // Build quadrant mini detection summary
  const quadSummaries: Record<string, { vehicles: number; potholes: number; pedestrians: number }> = {};
  if (allVision?.cameras) {
    for (const [cId, cData] of Object.entries(allVision.cameras)) {
      quadSummaries[cId] = {
        vehicles: cData.summary.vehicles_count,
        potholes: cData.summary.potholes_count,
        pedestrians: cData.summary.pedestrians_count,
      };
    }
  }

  // Active IMU data
  const currentImu = singleVision?.imu || {
    current_z: allVision?.aggregate.max_imu_z || 1.04,
    is_spike: allVision?.aggregate.is_any_spike || false,
    threshold_g: 2.2,
    baseline_g: 1.0,
    speed_km_h: allVision?.aggregate.avg_speed_km_h || 35,
    pothole_active: false,
  };

  return (
    <div className="flex h-full w-full flex-col bg-[#092328] text-[#f0fdf4] overflow-y-auto select-none">
      {/* Toast Notification Banner */}
      {telemetryToast && (
        <div className="flex items-center justify-between border-b border-[#2A835F] bg-[#12544F] px-4 py-2 font-mono text-xs text-[#f0fdf4] shadow-md animate-in fade-in duration-200 shrink-0">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-[#8BBB92]" />
            <span>{telemetryToast}</span>
          </div>
        </div>
      )}

      {/* Main Responsive Swiss Grid */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* ================= TOP SECTION: 3-COLUMN MODULAR ROW ================= */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 items-start">
          {/* Col 1: Live Camera Feeds (xl:col-span-5) */}
          <div className="xl:col-span-5 flex flex-col h-[400px]">
            <CameraQuadGrid
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              selectedCamId={selectedCamId}
              onSelectCamId={setSelectedCamId}
              avgFleetFps={avgFleetFps}
              cameraSourcesStatus={cameraSourcesStatus}
              onFileUpload={handleFileUpload}
              onResetFootage={handleResetFootage}
              isUploading={isUploading}
              streamBuster={streamBuster}
              onExpandModal={() => setIsExpandedModal(true)}
              allDetectionsSummary={quadSummaries}
            />
          </div>

          {/* Col 2: City Road Network & Incidents (xl:col-span-4) */}
          <div className="xl:col-span-4 flex flex-col rounded-xl border border-[#12544F] bg-[#0d3137]/90 p-3 shadow-md h-[400px]">
            <div className="flex items-center justify-between border-b border-[#12544F]/70 pb-2.5 mb-2.5 font-mono text-xs shrink-0">
              <div className="flex items-center gap-2">
                <MapIcon className="h-4 w-4 text-[#00e5bf]" />
                <span className="font-bold text-white tracking-wider uppercase text-xs">
                  CITY ROAD NETWORK & INCIDENTS
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Live</span>
              </div>
            </div>

            <div className="relative flex-1 rounded-lg overflow-hidden border border-[#12544F] min-h-0">
              <MapViewport
                onDefectClick={handleSelectDefect}
                onBusClick={(busId) => {
                  showTelemetryToast(`Selected telemetry stream for transit vehicle: ${busId}`);
                }}
              />

              {/* Bottom Traffic Flow Status Legend */}
              <div className="absolute bottom-2 left-2 z-10 flex items-center gap-2 rounded-full bg-black/80 backdrop-blur-md px-2.5 py-1 text-[9px] font-mono border border-[#12544F]/80 text-[#8BBB92]">
                <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Normal</span>
                <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-amber-400" /> Moderate</span>
                <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-orange-500" /> Congested</span>
                <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-rose-500" /> Critical</span>
              </div>

              {/* Compass Needle */}
              <div className="absolute bottom-2 right-2 z-10 flex items-center justify-center h-6 w-6 rounded-full bg-black/80 border border-[#12544F]/80 text-[10px] font-mono font-bold text-[#8BBB92]">
                N
              </div>
            </div>
          </div>

          {/* Col 3: Incidents & Distress Reports (xl:col-span-3) */}
          <div className="xl:col-span-3 flex flex-col rounded-xl border border-[#12544F] bg-[#0d3137]/90 shadow-md overflow-hidden h-[400px]">
            <div className="flex-1 min-h-0 overflow-y-auto">
              <LiveIncidentFeed
                defects={defects}
                incidents={incidents}
                onSelectDefect={handleSelectDefect}
                onSelectIncident={handleSelectIncident}
              />
            </div>
          </div>
        </div>

        {/* ================= BOTTOM SECTION: 2-COLUMN MODULAR ROW ================= */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 items-stretch">
          {/* Left Column: Perception Engine & IMU Waveform (xl:col-span-8) */}
          <div className="xl:col-span-8 flex flex-col space-y-3">
            {/* 5-Tier Edge AI Perception Status Strip */}
            <FiveTierPerceptionEngine
              viewMode={viewMode}
              selectedCamId={selectedCamId}
              activeCamName={activeCam.shortName}
              allDetections={allVision}
              singleDetection={singleVision}
            />

            {/* Real-time Dynamic 3-Axis IMU Waveform & Vibration Graph */}
            <ImuTelemetryGraph imu={currentImu} />

            {/* Vulnerable Pedestrian & School Zone Alert */}
            <SchoolZoneSafetyAlert camId={selectedCamId} />
          </div>

          {/* Right Column: 5-Tier Perception Radar & Real-time Banner (xl:col-span-4) */}
          <div className="xl:col-span-4 flex flex-col space-y-3 h-full">
            {/* 5-Tier Perception Pentagon Radar Chart */}
            <PentagonPerceptionRadar />

            {/* Real-time Monitoring Card with Vector Skyline Silhouette (Expanded to match bottom height) */}
            <RealtimeMonitoringBanner />
          </div>
        </div>
      </div>

      {/* Manual Incident & Distress Official Report Publisher Drawer */}
      <IncidentReportDrawer
        item={activeReportItem.item}
        category={activeReportItem.category}
        isOpen={isReportDrawerOpen}
        onClose={() => setIsReportDrawerOpen(false)}
        onReportPublished={(code) => {
          showTelemetryToast(`Report Published Successfully! Dispatch Reference: ${code}`);
        }}
      />

      {/* Defect Inspection Drawer */}
      <DefectInspectionDrawer
        defect={activeSelectedDefect}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onCreateWorkOrder={handleCreateWorkOrder}
      />

      {/* Full-Screen Video Stream Inspection Modal */}
      {isExpandedModal && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/90 backdrop-blur-md p-3 sm:p-6 animate-in fade-in duration-200">
          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-[#12544F] pb-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded bg-[#12544F] px-2.5 py-1 text-xs font-mono font-bold text-[#f0fdf4]">
                <Video className="h-4 w-4 text-[#8BBB92]" />
                <span>{activeCam.label}</span>
              </div>
              <span className="text-xs text-[#8BBB92] hidden sm:inline">{activeCam.description}</span>
            </div>

            {/* Camera Switcher Pills inside Modal */}
            <div className="flex items-center gap-1.5">
              {CAMERA_FEEDS.map((feed) => (
                <button
                  key={feed.id}
                  type="button"
                  onClick={() => setSelectedCamId(feed.id)}
                  className={`px-2.5 py-1 text-xs font-mono rounded border transition-colors cursor-pointer ${
                    feed.id === selectedCamId
                      ? 'bg-[#12544F] border-[#8BBB92] text-[#f0fdf4] font-bold'
                      : 'bg-[#0d3137] border-[#12544F] text-[#8BBB92] hover:bg-[#12544F]/50'
                  }`}
                >
                  {feed.shortName}
                </button>
              ))}

              <input
                type="file"
                ref={modalFileInputRef}
                accept="video/mp4,video/quicktime,video/x-msvideo,video/webm"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleFileUpload(selectedCamId, file);
                    e.target.value = '';
                  }
                }}
              />

              <button
                type="button"
                disabled={isUploading}
                onClick={() => modalFileInputRef.current?.click()}
                className="flex items-center gap-1 rounded bg-[#12544F] border border-[#2A835F] px-2 py-1 text-xs font-mono text-[#f0fdf4] hover:bg-[#2A835F] transition-colors ml-1 cursor-pointer disabled:opacity-50"
                title={`Upload footage for ${activeCam.shortName}`}
              >
                <Upload className="h-3 w-3 text-[#8BBB92]" />
                <span className="hidden sm:inline">Upload</span>
              </button>

              {cameraSourcesStatus[selectedCamId]?.is_custom && (
                <button
                  type="button"
                  onClick={() => handleResetFootage(selectedCamId)}
                  className="flex items-center gap-1 rounded bg-amber-950/40 border border-amber-800/80 px-2 py-1 text-xs font-mono text-amber-300 hover:bg-amber-900/60 transition-colors cursor-pointer"
                  title="Reset to default footage"
                >
                  <RotateCcw className="h-3 w-3 text-amber-400" />
                  <span className="hidden sm:inline">Reset</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsExpandedModal(false)}
                className="flex items-center justify-center rounded-lg bg-[#0d3137] p-1.5 text-[#8BBB92] hover:text-[#f0fdf4] hover:bg-rose-900/50 border border-[#12544F] transition-colors ml-2 cursor-pointer"
                title="Close Fullscreen"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Modal Expanded Video Player */}
          <div className="relative flex flex-1 items-center justify-center rounded-xl border border-[#12544F] bg-black overflow-hidden shadow-2xl">
            {/* Live Raw Python YOLOv8 MJPEG Stream for active camera */}
            <img
              key={`${activeCam.id}_modal`}
              src={activeCam.pythonStream}
              alt={`Expanded Raw MJPEG Stream - ${activeCam.label}`}
              className="absolute inset-0 h-full w-full object-contain z-0"
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

            {/* Telemetry Overlays in Expanded View */}
            <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 bg-gradient-to-t from-black/70 via-transparent to-black/50 z-20">
              <div className="flex items-center justify-between text-xs font-mono text-[#8BBB92]">
                <div className="flex items-center gap-2 rounded bg-black/80 px-3 py-1 border border-[#12544F]">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[#f0fdf4] font-bold">NVIDIA JETSON ORIN NANO</span>
                  <span>· {avgFleetFps.toFixed(1)} FPS</span>
                  <span className="ml-1 rounded border border-[#2A835F] bg-[#12544F]/50 px-1.5 py-0.5 text-[10px] text-emerald-400">RAW MJPEG</span>
                </div>
                <div className="rounded bg-black/80 px-3 py-1 border border-[#12544F] text-[#8BBB92]">
                  {activeCam.resolution}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-[#8BBB92] bg-black/80 px-4 py-2 rounded-lg border border-[#12544F]">
                <span>AI MODEL: {activeCam.model}</span>
                <span className="text-[#f0fdf4] font-bold">INFERENCE LATENCY: {activeCam.latency}</span>
                <span className="text-emerald-400 font-semibold">TENSORRT ACCELERATION ACTIVE</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Speed Breaker Spatial Whitelist GIS Modal */}
      <SpeedBreakerWhitelistModal
        isOpen={isSpeedBreakerModalOpen}
        onClose={() => setIsSpeedBreakerModalOpen(false)}
        onShowToast={showTelemetryToast}
      />

      {/* 72-Hour Offline Circular Ring Buffer Modal */}
      <CircularRingBufferModal
        isOpen={isRingBufferModalOpen}
        onClose={() => setIsRingBufferModalOpen(false)}
        onShowToast={showTelemetryToast}
      />
    </div>
  );
}
