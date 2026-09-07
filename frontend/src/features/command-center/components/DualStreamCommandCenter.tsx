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
  const selectedDefectId = useTelemetryStore((state) => state.selectedDefectId);
  const bandwidthMetrics = useTelemetryStore((state) => state.bandwidthMetrics);
  const avgFleetFps = useTelemetryStore((state) => state.avgFleetFps);

  const setSelectedDefectId = useTelemetryStore((state) => state.setSelectedDefectId);
  const createTicketFromDefect = useWorkOrderStore((state) => state.createTicketFromDefect);

  const activeSelectedDefect = defects.find((d) => d.id === selectedDefectId) || null;
  const activeCam = CAMERA_FEEDS.find((c) => c.id === selectedCamId) || CAMERA_FEEDS[0];

  const [isSpeedBreakerModalOpen, setIsSpeedBreakerModalOpen] = useState(false);
  const [isRingBufferModalOpen, setIsRingBufferModalOpen] = useState(false);
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

      {/* Top Operational Header */}
      <div className="flex items-center justify-between gap-2 border-b border-[#12544F] bg-[#0d3137] px-3 sm:px-4 py-1.5 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <span className="rounded bg-[#12544F] border border-[#2A835F] px-2 py-0.5 text-[10px] font-bold text-[#8BBB92] uppercase font-mono shrink-0 flex items-center gap-1">
            <Zap className="h-3 w-3 text-[#8BBB92]" />
            EDGE TELEMETRY
          </span>
          <span className="text-xs font-medium text-[#8BBB92] truncate hidden sm:inline">
            Jetson Edge Inferencing & Central GIS Dispatch
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono text-[#8BBB92] shrink-0">
          {/* BEL PS 26124: Speed Breaker GIS Whitelist Button */}
          <button
            type="button"
            onClick={() => setIsSpeedBreakerModalOpen(true)}
            className="flex items-center gap-1.5 rounded border border-[#2A835F] bg-[#12544F] px-2.5 py-1 text-xs text-[#f0fdf4] hover:bg-[#2A835F] cursor-pointer transition-colors font-medium"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Speed Breaker GIS Filter</span>
            <span className="sm:hidden">GIS Filter</span>
          </button>

          {/* BEL PS 26124: 72-Hour Offline Circular Ring Buffer Button */}
          <button
            type="button"
            onClick={() => setIsRingBufferModalOpen(true)}
            className="flex items-center gap-1.5 rounded border border-[#12544F] bg-[#092328] px-2.5 py-1 text-xs text-[#8BBB92] hover:bg-[#12544F] hover:text-[#f0fdf4] cursor-pointer transition-colors font-medium"
          >
            <HardDrive className="h-3.5 w-3.5 text-cyan-400" />
            <span className="hidden md:inline">72h Ring Buffer (NVMe)</span>
            <span className="md:hidden">Ring Buffer</span>
          </button>

          <span className="h-1.5 w-1.5 rounded-full bg-[#8BBB92] animate-pulse shrink-0 ml-1" />
          <span className="hidden sm:inline">Latency: &lt; 35ms</span>
        </div>
      </div>

      {/* Main Responsive Grid: 1 Col on Mobile/Tablet, 2 Cols on Desktop */}
      <div className="grid flex-1 grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-[#12544F] overflow-y-auto">
        {/* ================= SCREEN 1: ONBOARD EDGE UNIT (JETSON ORIN) ================= */}
        <div className="flex flex-col p-3 sm:p-4 space-y-3 bg-[#092328]">
          {/* Screen 1 Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#12544F] pb-2">
            <div className="flex items-center gap-2">
              <Video className="h-4 w-4 text-[#8BBB92]" />
              <span className="text-xs font-bold text-[#f0fdf4] uppercase font-mono">
                SCREEN 1: Onboard Jetson Orin Edge Unit
              </span>
            </div>
            <span className="text-[11px] font-mono text-[#8BBB92]">Bus CH-01-TB-4820 · CTU Fleet</span>
          </div>

          {/* 2x2 Camera Quad Grid & 1-Up View Handler */}
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

          {/* 5-Tier Edge AI Perception Status Strip (Consolidated or Focused) */}
          <FiveTierPerceptionEngine
            viewMode={viewMode}
            selectedCamId={selectedCamId}
            activeCamName={activeCam.shortName}
            allDetections={allVision}
            singleDetection={singleVision}
          />

          {/* Real-time Dynamic 3-Axis IMU Waveform & Vibration Graph */}
          <ImuTelemetryGraph imu={currentImu} />

          {/* Vulnerable Pedestrian & School Zone Safety Engine */}
          <SchoolZoneSafetyAlert camId={selectedCamId} />

          {/* Live Edge Compute Health & Bandwidth Savings Graph */}
          <EdgeComputeHealthGraph
            currentFps={avgFleetFps}
            savingsPercentage={
              singleVision?.bandwidth?.savings_percentage ||
              allVision?.aggregate?.total_bandwidth_saved_pct ||
              bandwidthMetrics.savingsPercentage
            }
            rawMbPerMin={singleVision?.bandwidth?.raw_stream_mb_per_min || 112.5}
            edgeKbPerMin={singleVision?.bandwidth?.edge_telemetry_kb_per_min || 14.2}
          />
        </div>

        {/* ================= SCREEN 2: CENTRAL COMMAND GIS ================= */}
        <div className="flex flex-col bg-[#092328] min-h-[500px] lg:min-h-0">
          {/* Screen 2 Header */}
          <div className="flex items-center justify-between border-b border-[#12544F] bg-[#092328] px-3 sm:px-4 py-2.5">
            <div className="flex items-center gap-2">
              <Radio className="h-4 w-4 text-[#2A835F] animate-pulse" />
              <span className="text-xs font-bold text-[#f0fdf4] uppercase font-mono">
                SCREEN 2: Central GIS Command & Incident Dispatch
              </span>
            </div>
            <span className="text-[11px] font-mono text-[#8BBB92] hidden sm:inline">ArcGIS Dark Gray</span>
          </div>

          {/* Map + Mini Feed */}
          <div className="relative flex flex-1 flex-col sm:flex-row overflow-hidden min-h-[400px]">
            {/* Map Canvas */}
            <div className="flex-1 h-64 sm:h-auto overflow-hidden">
              <MapViewport
                onDefectClick={handleSelectDefect}
                onBusClick={(busId) => {
                  showTelemetryToast(`Selected telemetry stream for transit vehicle: ${busId}`);
                }}
              />
            </div>

            {/* Mini Live Incident Feed */}
            <div className="w-full sm:w-64 md:w-72 h-64 sm:h-auto border-t sm:border-t-0 sm:border-l border-[#12544F] bg-[#0d3137] overflow-hidden flex flex-col">
              <LiveIncidentFeed
                defects={defects}
                incidents={incidents}
                onSelectDefect={handleSelectDefect}
                onSelectIncident={handleSelectIncident}
              />
            </div>
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
