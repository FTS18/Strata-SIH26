import React from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  Clock,
  Activity,
  Droplets,
  HelpCircle,
  Construction,
  Users,
  Footprints,
  Camera,
  Gauge,
  Car,
} from 'lucide-react';
import { type RoadDefect, type VehicleIncident } from '@/types';
import { formatRelativeTime } from '@/lib/utils';

export interface LiveIncidentFeedProps {
  defects: RoadDefect[];
  incidents: VehicleIncident[];
  onSelectDefect: (defectId: string) => void;
  onSelectIncident: (incidentId: string) => void;
}

export function LiveIncidentFeed({
  defects,
  incidents,
  onSelectDefect,
  onSelectIncident,
}: LiveIncidentFeedProps) {
  // Filter strictly to negative incidents and road distress ("bad things only")
  const badDefects = defects.filter(
    (d) => d.type === 'pothole' || d.type === 'waterlogging'
  );
  const badIncidents = incidents.filter(
    (i) => i.type !== 'anpr_plate_hit' || i.isFlaggedWatchlist
  );

  const combinedEvents = [
    ...badDefects.map((d) => ({ ...d, eventCategory: 'defect' as const })),
    ...badIncidents.map((i) => ({ ...i, eventCategory: 'incident' as const })),
  ].sort((a, b) => {
    const timeA = 'detectedAt' in a ? a.detectedAt : a.timestamp;
    const timeB = 'detectedAt' in b ? b.detectedAt : b.timestamp;
    return timeB - timeA;
  });

  const pendingDraftsCount = combinedEvents.filter((e) => e.reportStatus !== 'published').length;

  const getDefectIcon = (type: string) => {
    switch (type) {
      case 'waterlogging':
        return <Droplets className="h-3.5 w-3.5 text-cyan-400 shrink-0" />;
      case 'missing_zebra_crossing':
        return <Footprints className="h-3.5 w-3.5 text-amber-300 shrink-0" />;
      case 'damaged_divider':
        return <Construction className="h-3.5 w-3.5 text-orange-400 shrink-0" />;
      case 'missing_signboard':
        return <HelpCircle className="h-3.5 w-3.5 text-amber-400 shrink-0" />;
      default:
        return <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0" />;
    }
  };

  const getIncidentIcon = (type: string) => {
    switch (type) {
      case 'anpr_plate_hit':
        return <Camera className="h-3.5 w-3.5 text-emerald-400 shrink-0" />;
      case 'overspeeding':
        return <Gauge className="h-3.5 w-3.5 text-amber-400 shrink-0" />;
      case 'bus_lane_obstruction':
        return <Car className="h-3.5 w-3.5 text-amber-300 shrink-0" />;
      case 'crosswalk_incursion':
      case 'school_children_crossing':
        return <Users className="h-3.5 w-3.5 text-purple-400 shrink-0" />;
      default:
        return <ShieldAlert className="h-3.5 w-3.5 text-rose-400 shrink-0" />;
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-[#0d3137]">
      <div className="flex items-center justify-between border-b border-[#12544F] px-3.5 py-2.5 bg-[#092328]">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#f0fdf4]">
          <Activity className="h-3.5 w-3.5 text-[#8BBB92]" />
          <span>Incident & Distress Reports</span>
        </div>
        <div className="flex items-center gap-1.5">
          {pendingDraftsCount > 0 && (
            <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-amber-950/80 border border-amber-500 text-amber-300 font-bold animate-pulse">
              {pendingDraftsCount} DRAFTS
            </span>
          )}
          <span className="font-mono text-xs text-[#8BBB92] tabular-nums">
            {combinedEvents.length} Total
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-[#12544F]">
        {combinedEvents.length === 0 ? (
          <div className="flex h-32 flex-col items-center justify-center text-center text-xs text-[#8BBB92] p-4">
            <Clock className="mb-1.5 h-4 w-4 opacity-50" />
            <span>Scanning road network for distress & violations...</span>
          </div>
        ) : (
          combinedEvents.map((event) => {
            const isDefect = event.eventCategory === 'defect';
            const defectItem = isDefect ? (event as RoadDefect) : null;
            const incidentItem = !isDefect ? (event as VehicleIncident) : null;

            let eventTitle = '';
            let badgeText = '';
            let badgeClass = 'border-[#1d6d63] bg-[#12544F]/50 text-[#8BBB92]';
            let accentBarClass = 'bg-[#2A835F]';
            let detailSnippet = '';
            let locationName = '';
            let reportedByBus = '';
            let eventTimestamp = 0;
            let thumbUrl = '/evidence/pothole_cam1_crop.jpg';

            if (isDefect && defectItem) {
              eventTimestamp = defectItem.detectedAt;
              reportedByBus = defectItem.detectedByBusId;
              locationName = defectItem.roadName;
              thumbUrl = defectItem.cropImageUrl || (defectItem.type === 'waterlogging' ? '/evidence/waterlogging_cam1_crop.jpg' : '/evidence/pothole_cam1_crop.jpg');

              switch (defectItem.type) {
                case 'pothole':
                  eventTitle = 'ROAD POTHOLE';
                  if (defectItem.imuVibrationZ && defectItem.imuVibrationZ >= 2.0) {
                    badgeText = `IMU Z: ${defectItem.imuVibrationZ.toFixed(2)}g`;
                  } else {
                    badgeText = `${Math.round(defectItem.confidenceScore * 100)}% AI Conf`;
                  }
                  badgeClass =
                    defectItem.severity === 'critical'
                      ? 'border-rose-900/60 bg-rose-950/50 text-rose-400 font-semibold'
                      : 'border-amber-700/60 bg-amber-950/50 text-amber-300 font-semibold';
                  accentBarClass = defectItem.severity === 'critical' ? 'bg-rose-500' : 'bg-amber-500';
                  detailSnippet = `Depth: 5.4cm · Area: ${defectItem.estimatedAreaSqM}m² (Class 3 Crater)`;
                  break;

                case 'waterlogging':
                  eventTitle = 'SURFACE WATERLOGGING';
                  badgeText = `${defectItem.estimatedAreaSqM}m² Ponding`;
                  badgeClass = 'border-cyan-700/60 bg-cyan-950/50 text-cyan-300 font-semibold';
                  accentBarClass = 'bg-cyan-500';
                  detailSnippet = 'Standing Water · High Aquaplane Hazard';
                  break;

                default:
                  eventTitle = defectItem.type.replace(/_/g, ' ').toUpperCase();
                  badgeText = `${Math.round(defectItem.confidenceScore * 100)}% AI Conf`;
                  accentBarClass = defectItem.severity === 'critical' ? 'bg-rose-500' : 'bg-[#2A835F]';
                  detailSnippet = `Area: ${defectItem.estimatedAreaSqM}m²`;
                  break;
              }
            } else if (incidentItem) {
              eventTimestamp = incidentItem.timestamp;
              reportedByBus = incidentItem.reportedByBusId;
              locationName = incidentItem.locationName;
              thumbUrl = incidentItem.cropImageUrl || '/evidence/rashdrive_cam1_crop.jpg';

              switch (incidentItem.type) {
                case 'overspeeding':
                  eventTitle = `RASH DRIVING (${Math.round(incidentItem.speedKmH || 78)} KM/H)`;
                  badgeText = 'Speed Violation';
                  badgeClass = 'border-rose-900/60 bg-rose-950/50 text-rose-400 font-semibold';
                  accentBarClass = 'bg-rose-500';
                  detailSnippet = `${incidentItem.vehicleDescription || incidentItem.suspectPlate || 'Tracked Vehicle'} · Arterial 50 Zone`;
                  break;

                case 'bus_lane_obstruction':
                  eventTitle = 'TRANSIT CORRIDOR OBSTRUCTION';
                  badgeText = 'Corridor Blocked';
                  badgeClass = 'border-amber-700/60 bg-amber-950/50 text-amber-300 font-semibold';
                  accentBarClass = 'bg-amber-500';
                  detailSnippet = `${incidentItem.vehicleDescription || incidentItem.suspectPlate || 'Stationary Vehicle'} · Blocked > 90s`;
                  break;

                case 'crosswalk_incursion':
                case 'school_children_crossing':
                  eventTitle = 'CORRIDOR PEDESTRIAN INCURSION';
                  badgeText = 'VRU Hazard';
                  badgeClass = 'border-purple-700/60 bg-purple-950/50 text-purple-300 font-semibold';
                  accentBarClass = 'bg-purple-500';
                  detailSnippet = incidentItem.vehicleDescription || 'Pedestrian detected inside active busway';
                  break;

                default:
                  eventTitle = incidentItem.type.replace(/_/g, ' ').toUpperCase();
                  badgeText = 'Priority Violation';
                  badgeClass = 'border-rose-900/60 bg-rose-950/50 text-rose-400 font-semibold';
                  accentBarClass = 'bg-rose-500';
                  detailSnippet = incidentItem.vehicleDescription || incidentItem.reason || '';
                  break;
              }
            }

            const isPublished = event.reportStatus === 'published';

            return (
              <div
                key={event.id}
                onClick={() =>
                  isDefect
                    ? onSelectDefect(event.id)
                    : onSelectIncident(event.id)
                }
                className="group relative flex cursor-pointer gap-2.5 p-2.5 transition-colors hover:bg-[#12544F]/40 select-none"
              >
                {/* 2px Status Accent Bar */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1 ${accentBarClass}`}
                />

                {/* Captured Evidence Thumbnail */}
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md border border-[#12544F] bg-[#092328]">
                  <img
                    src={thumbUrl}
                    alt="Evidence thumbnail"
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (!target.dataset.fallback) {
                        target.dataset.fallback = 'true';
                        target.src = isDefect
                          ? (defectItem?.type === 'waterlogging' ? '/evidence/waterlogging_cam1_crop.jpg' : '/evidence/pothole_cam1_crop.jpg')
                          : '/evidence/rashdrive_cam1_crop.jpg';
                      }
                    }}
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-[#092328]/90 text-[7px] font-mono text-center text-[#8BBB92] py-0.2">
                    SNAP
                  </div>
                </div>

                {/* Event Metadata & Publication Trigger */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div className="flex items-center justify-between gap-1.5">
                    <div className="flex items-center gap-1 min-w-0">
                      {isDefect ? getDefectIcon(defectItem!.type) : getIncidentIcon(incidentItem!.type)}
                      <span className="text-xs font-semibold text-[#f0fdf4] truncate">
                        {eventTitle}
                      </span>
                    </div>

                    {isPublished ? (
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-950/80 border border-emerald-500/70 text-emerald-300 font-bold shrink-0 flex items-center gap-0.5">
                        DISPATCHED
                      </span>
                    ) : (
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.2 rounded border shrink-0 ${badgeClass}`}
                      >
                        {badgeText}
                      </span>
                    )}
                  </div>

                  {detailSnippet && (
                    <p className="text-[11px] font-mono text-[#8BBB92] truncate">
                      {detailSnippet}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-[10px] font-mono text-[#5b9076] pt-1">
                    <span className="truncate max-w-[55%] text-[#a2d2bb]">
                      {locationName}
                    </span>
                    <span className="text-emerald-400 group-hover:underline flex items-center gap-1">
                      {isPublished ? 'View Dispatch →' : 'Publish Report →'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
