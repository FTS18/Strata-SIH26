'use client';

import React, { useState } from 'react';
import { Drawer } from '@/components/ui/Drawer';
import { Button } from '@/components/ui/Button';
import { type RoadDefect, type VehicleIncident } from '@/types';
import {
  Activity,
  Send,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Cpu,
  MapPin,
  Bus,
  ZoomIn,
  Layers,
  Crosshair,
  Gauge,
  FileText,
  Clock,
  Printer,
  Copy,
  Check,
} from 'lucide-react';
import { formatTimestamp } from '@/lib/utils';
import { useTelemetryStore } from '@/features/fleet-telemetry/telemetryStore';
import { useWorkOrderStore } from '@/features/roles/stores/workOrderStore';
import { usePoliceStore } from '@/features/roles/stores/policeStore';

export interface IncidentReportDrawerProps {
  item: RoadDefect | VehicleIncident | null;
  category: 'defect' | 'incident' | null;
  isOpen: boolean;
  onClose: () => void;
  onReportPublished?: (code: string) => void;
}

export function IncidentReportDrawer({
  item,
  category,
  isOpen,
  onClose,
  onReportPublished,
}: IncidentReportDrawerProps) {
  const [evidenceMode, setEvidenceMode] = useState<'crop' | 'context'>('crop');
  const [imageError, setImageError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [notes, setNotes] = useState<string>('');

  const publishDefectReport = useTelemetryStore((state) => state.publishDefectReport);
  const publishIncidentReport = useTelemetryStore((state) => state.publishIncidentReport);
  const createTicketFromDefect = useWorkOrderStore((state) => state.createTicketFromDefect);
  const syncPublishedIncident = usePoliceStore((state) => state.syncPublishedIncident);

  React.useEffect(() => {
    if (!item || !category) return;
    const isDefect = category === 'defect';
    const latStr = item.coords?.lat != null ? item.coords.lat.toFixed(5) : '30.73050';
    const lngStr = item.coords?.lng != null ? item.coords.lng.toFixed(5) : '76.82100';
    setNotes(
      item.inspectorNotes ||
        (isDefect
          ? `Mobile sensing unit registered road distress at ${latStr}°N, ${lngStr}°E. Automated civil engineering maintenance action recommended.`
          : `Traffic perception unit detected violation at ${latStr}°N, ${lngStr}°E. Notice under Motor Vehicles Act drafted.`)
    );
    setImageError(false);
  }, [item, category]);

  if (!item || !category) return null;

  const isDefect = category === 'defect';
  const defect = isDefect ? (item as RoadDefect) : null;
  const incident = !isDefect ? (item as VehicleIncident) : null;

  const isPublished = item.reportStatus === 'published';
  const isCritical = defect ? defect.severity === 'critical' : incident?.isFlaggedWatchlist;

  // Resolve Image URLs
  let cropUrl = item.cropImageUrl;
  let contextUrl = item.proofImageUrl;
  let defaultCropUrl = '/evidence/pothole_cam1_crop.jpg';
  let defaultContextUrl = '/evidence/pothole_cam1_annotated.jpg';

  if (defect) {
    if (defect.type === 'waterlogging') {
      defaultCropUrl = '/evidence/waterlogging_cam1_crop.jpg';
      defaultContextUrl = '/evidence/waterlogging_cam1_annotated.jpg';
    }
  } else if (incident) {
    defaultCropUrl = '/evidence/pothole_cam1_crop.jpg';
    defaultContextUrl = '/evidence/pothole_cam1_annotated.jpg';
  }

  const activeImageSrc = evidenceMode === 'crop'
    ? (imageError || !cropUrl ? defaultCropUrl : cropUrl)
    : (imageError || !contextUrl ? defaultContextUrl : contextUrl);

  const handlePublish = () => {
    setIsPublishing(true);
    setTimeout(() => {
      let dispatchCode = '';
      if (isDefect && defect) {
        dispatchCode = publishDefectReport(defect.id, notes, defect.assignedAgency);
        createTicketFromDefect(defect, dispatchCode);
      } else if (incident) {
        dispatchCode = publishIncidentReport(incident.id, notes, incident.assignedAgency);
        syncPublishedIncident(incident, dispatchCode, notes);
      }
      setIsPublishing(false);
      if (dispatchCode) {
        onReportPublished?.(dispatchCode);
      }
    }, 450);
  };

  const handleCopyDispatch = () => {
    if (item.dispatchReference) {
      navigator.clipboard.writeText(item.dispatchReference);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        defect
          ? `Report: ${defect.type.replace('_', ' ').toUpperCase()}`
          : `Violation: ${incident?.type.replace('_', ' ').toUpperCase()}`
      }
      subtitle={`${item?.coords?.lat != null ? item.coords.lat.toFixed(5) : '30.73050'}° N, ${item?.coords?.lng != null ? item.coords.lng.toFixed(5) : '76.82100'}° E`}
      badge={
        isPublished ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border bg-emerald-950/70 border-emerald-600/80 text-emerald-400">
            <CheckCircle2 className="h-3 w-3 text-emerald-400" />
            DISPATCHED
          </span>
        ) : (
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${
              isCritical
                ? 'bg-rose-950/70 border-rose-600/80 text-rose-400'
                : 'bg-amber-950/70 border-amber-600/80 text-amber-400'
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isCritical ? 'bg-rose-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
            DRAFT · PENDING AUDIT
          </span>
        )
      }
      footer={
        <div className="flex items-center justify-between gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="border-[#12544F] bg-[#092328] text-[#8BBB92] hover:bg-[#12544F]/50 hover:text-[#f0fdf4] font-mono text-xs"
          >
            Close
          </Button>

          {isPublished ? (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyDispatch}
                className="border-emerald-800 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/60 font-mono text-xs flex items-center gap-1.5"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-emerald-400" />}
                <span>{copied ? 'Copied' : item.dispatchReference}</span>
              </Button>
            </div>
          ) : (
            <Button
              variant="primary"
              size="sm"
              disabled={isPublishing}
              className="bg-emerald-600 border border-emerald-400 text-[#f0fdf4] hover:bg-emerald-500 font-mono text-xs font-semibold shadow-lg shadow-emerald-900/50 flex items-center gap-1.5"
              onClick={handlePublish}
            >
              <Send className="h-3.5 w-3.5 text-white" />
              <span>{isPublishing ? 'Publishing...' : 'Publish Official Report'}</span>
            </Button>
          )}
        </div>
      }
    >
      {/* 1. Perspective Switcher */}
      <div className="flex items-center justify-between gap-2 bg-[#092328] p-1 rounded-lg border border-[#12544F]">
        <button
          type="button"
          onClick={() => {
            setEvidenceMode('crop');
            setImageError(false);
          }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-[11px] font-mono font-semibold transition-all duration-200 ${
            evidenceMode === 'crop'
              ? 'bg-[#12544F] text-[#f0fdf4] shadow-sm border border-[#2A835F]'
              : 'text-[#8BBB92] hover:text-[#f0fdf4] hover:bg-[#0d3137]'
          }`}
        >
          <ZoomIn className="h-3.5 w-3.5 text-emerald-400" />
          <span>Target Section Crop (Macro 3.2x)</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setEvidenceMode('context');
            setImageError(false);
          }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-[11px] font-mono font-semibold transition-all duration-200 ${
            evidenceMode === 'context'
              ? 'bg-[#12544F] text-[#f0fdf4] shadow-sm border border-[#2A835F]'
              : 'text-[#8BBB92] hover:text-[#f0fdf4] hover:bg-[#0d3137]'
          }`}
        >
          <Layers className="h-3.5 w-3.5 text-cyan-400" />
          <span>Full Camera Context (4K)</span>
        </button>
      </div>

      {/* 2. Photographic Defect & Violation Evidence Snapshot */}
      <div className="relative overflow-hidden rounded-xl border border-[#12544F] bg-[#092328] shadow-xl">
        <img
          key={activeImageSrc}
          src={activeImageSrc}
          alt="Visual incident evidence"
          className="h-56 w-full object-cover"
          onError={() => setImageError(true)}
        />

        {/* HUD Overlay */}
        <div className="absolute inset-0 pointer-events-none p-3 flex flex-col justify-between bg-gradient-to-t from-[#092328]/90 via-transparent to-[#092328]/70">
          <div className="flex items-center justify-between text-[10px] font-mono text-[#8BBB92]">
            <div className="flex items-center gap-1.5 rounded bg-[#092328]/90 px-2 py-0.5 border border-[#12544F]">
              <Cpu className="h-3 w-3 text-emerald-400" />
              <span className="text-[#f0fdf4] font-bold">
                {evidenceMode === 'crop' ? 'MACRO OPTICAL EVIDENCE CROP · 3.2X' : 'CAM 1 · FRONT (4K)'}
              </span>
            </div>
            <div className="rounded bg-[#092328]/90 px-2 py-0.5 border border-[#12544F] text-[#8BBB92]">
              Auto-Captured
            </div>
          </div>

          {/* Caliper Reticle Overlay */}
          {evidenceMode === 'crop' && (
            <div className="mx-auto my-auto w-44 h-24 border border-dashed border-emerald-400/80 rounded relative flex flex-col justify-between p-1 bg-emerald-950/20">
              <div className="flex items-center justify-between text-[8px] font-mono text-emerald-300">
                <span className="bg-[#092328]/90 px-1 py-0.2 rounded border border-emerald-500/50 flex items-center gap-1">
                  <Crosshair className="h-2.5 w-2.5 text-emerald-400" />
                  {defect ? defect.type.toUpperCase() : 'VIOLATION TARGET'}
                </span>
                <span className="bg-[#092328]/90 px-1 py-0.2 rounded border border-emerald-500/50">
                  {defect?.depthCm ? `Depth: ${defect.depthCm}` : incident?.speedKmH ? `${incident.speedKmH} km/h` : 'VERIFIED'}
                </span>
              </div>
              <div className="text-center font-mono text-[9px] text-emerald-200 bg-[#092328]/80 px-1 py-0.5 rounded border border-emerald-500/40 self-center">
                {defect ? '54 cm (W) × 28 cm (L)' : incident?.suspectPlate || 'RADAR LOCKED'}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-[9px] font-mono text-[#8BBB92] bg-[#092328]/85 px-2 py-0.5 rounded border border-[#12544F]">
            <span>{item.coords.lat.toFixed(5)}°N, {item.coords.lng.toFixed(5)}°E</span>
            <span className="text-emerald-400 font-bold">PHYSICAL EVIDENCE LOGGED</span>
          </div>
        </div>
      </div>

      {/* 3. Published Confirmation Banner */}
      {isPublished && (
        <div className="rounded-xl border border-emerald-700/60 bg-emerald-950/30 p-3 space-y-1 text-xs font-mono">
          <div className="flex items-center justify-between text-emerald-300">
            <span className="font-bold flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              Published & Dispatched to {item.assignedAgency}
            </span>
            <span className="text-emerald-400 font-bold">{item.dispatchReference}</span>
          </div>
          <p className="text-[11px] text-emerald-400/80">
            Dispatched at {item.publishedAt ? formatTimestamp(item.publishedAt) : 'Just Now'}. Ticket has been officially recorded in the central municipal ledger.
          </p>
        </div>
      )}

      {/* 4. Telemetry & Sensor Ledger */}
      <div className="rounded-xl border border-[#12544F] bg-[#0d3137] divide-y divide-[#12544F] text-xs font-mono">
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-1.5 text-[#8BBB92]">
            <MapPin className="h-3.5 w-3.5 text-[#5b9076]" />
            <span>Corridor / Road</span>
          </div>
          <span className="font-semibold text-[#f0fdf4] text-right truncate max-w-[60%]">
            {defect ? defect.roadName : incident?.locationName}
          </span>
        </div>

        {defect && (
          <>
            <div className="flex items-center justify-between p-3">
              <span className="text-[#8BBB92]">Estimated Surface Area</span>
              <span className="tabular-nums text-[#f0fdf4] font-bold">{defect.estimatedAreaSqM} m²</span>
            </div>
            <div className="flex items-center justify-between p-3">
              <span className="text-[#8BBB92]">IMU Z-Axis Impact</span>
              <span className="tabular-nums font-bold text-rose-400">{defect.imuVibrationZ}g</span>
            </div>
          </>
        )}

        {incident && (
          <>
            {incident.suspectPlate && (
              <div className="flex items-center justify-between p-3">
                <span className="text-[#8BBB92]">Vehicle Registration</span>
                <span className="font-bold text-amber-300 bg-[#092328] px-2 py-0.5 rounded border border-amber-600/50">
                  {incident.suspectPlate}
                </span>
              </div>
            )}
            {incident.speedKmH && (
              <div className="flex items-center justify-between p-3">
                <span className="text-[#8BBB92]">Radar Speed Clocked</span>
                <span className="tabular-nums font-bold text-rose-400 flex items-center gap-1">
                  <Gauge className="h-3.5 w-3.5" />
                  {incident.speedKmH} km/h (Limit: 50 km/h)
                </span>
              </div>
            )}
          </>
        )}

        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-1.5 text-[#8BBB92]">
            <Bus className="h-3.5 w-3.5 text-[#5b9076]" />
            <span>Sensing Vehicle Unit</span>
          </div>
          <span className="text-[#8BBB92] font-bold">
            {defect ? defect.detectedByBusId : incident?.reportedByBusId}
          </span>
        </div>

        <div className="flex items-center justify-between p-3">
          <span className="text-[#8BBB92]">Assigned Authority</span>
          <span className="text-[#f0fdf4] font-semibold">{item.assignedAgency || 'Public Works Department (PWD)'}</span>
        </div>
      </div>

      {/* 5. Editable Inspector Observations & Action Plan */}
      <div className="space-y-1.5">
        <label className="text-xs font-mono text-[#8BBB92] flex items-center gap-1.5 font-semibold">
          <FileText className="h-3.5 w-3.5 text-[#5b9076]" />
          <span>Official Inspector Remarks & Action Order</span>
        </label>
        <textarea
          value={notes}
          disabled={isPublished}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-[#12544F] bg-[#092328] p-2.5 text-xs font-mono text-[#f0fdf4] focus:outline-none focus:border-emerald-500 disabled:opacity-60 resize-none"
          placeholder="Enter inspector remarks and corrective instructions..."
        />
      </div>
    </Drawer>
  );
}
