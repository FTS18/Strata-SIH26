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
  const combinedEvents = [
    ...defects.map((d) => ({ ...d, eventCategory: 'defect' as const })),
    ...incidents.map((i) => ({ ...i, eventCategory: 'incident' as const })),
  ].sort((a, b) => {
    const timeA = 'detectedAt' in a ? a.detectedAt : a.timestamp;
    const timeB = 'detectedAt' in b ? b.detectedAt : b.timestamp;
    return timeB - timeA;
  });

  const getDefectIcon = (type: string) => {
    switch (type) {
      case 'waterlogging':
        return <Droplets className="h-3.5 w-3.5 text-cyan-400" />;
      case 'missing_zebra_crossing':
        return <Footprints className="h-3.5 w-3.5 text-amber-300" />;
      case 'damaged_divider':
        return <Construction className="h-3.5 w-3.5 text-orange-400" />;
      case 'missing_signboard':
        return <HelpCircle className="h-3.5 w-3.5 text-amber-400" />;
      default:
        return <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />;
    }
  };

  const getIncidentIcon = (type: string) => {
    switch (type) {
      case 'school_children_crossing':
        return <Users className="h-3.5 w-3.5 text-emerald-400" />;
      default:
        return <ShieldAlert className="h-3.5 w-3.5 text-rose-400" />;
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-[#0d3137]">
      <div className="flex items-center justify-between border-b border-[#12544F] px-3.5 py-2 bg-[#092328]">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#f0fdf4]">
          <Activity className="h-3.5 w-3.5 text-[#8BBB92]" />
          <span>Real-time Ingestion Stream</span>
        </div>
        <span className="font-mono text-xs text-[#8BBB92] tabular-nums">
          {combinedEvents.length} Events
        </span>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-[#12544F]">
        {combinedEvents.length === 0 ? (
          <div className="flex h-32 flex-col items-center justify-center text-center text-xs text-[#8BBB92]">
            <Clock className="mb-1.5 h-4 w-4 opacity-50" />
            <span>Listening for live bus telemetry...</span>
          </div>
        ) : (
          combinedEvents.map((event) => {
            const isDefect = event.eventCategory === 'defect';
            const defectItem = isDefect ? (event as RoadDefect) : null;
            const incidentItem = !isDefect ? (event as VehicleIncident) : null;
            const isCritical = isDefect
              ? defectItem?.severity === 'critical'
              : incidentItem?.type === 'hit_and_run' || incidentItem?.type === 'rash_driving';

            const eventTitle = isDefect
              ? defectItem!.type.replace(/_/g, ' ').toUpperCase()
              : incidentItem!.type.replace(/_/g, ' ').toUpperCase();

            const badgeText = isDefect
              ? `${Math.round(defectItem!.confidenceScore * 100)}% AI Conf`
              : isCritical
              ? 'Priority Alert'
              : 'Advisory';

            return (
              <div
                key={event.id}
                onClick={() =>
                  isDefect
                    ? onSelectDefect(event.id)
                    : onSelectIncident(event.id)
                }
                className="group relative flex cursor-pointer flex-col gap-1 py-2.5 pl-3.5 pr-3 transition-colors hover:bg-[#12544F]/40 select-none"
              >
                {/* 2px Subtle Status Accent Indicator */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-0.5 ${
                    isCritical ? 'bg-rose-500' : 'bg-[#2A835F]'
                  }`}
                />

                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    {isDefect ? getDefectIcon(defectItem!.type) : getIncidentIcon(incidentItem!.type)}
                    <span className="text-xs font-semibold text-[#f0fdf4] truncate">
                      {eventTitle}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded border shrink-0 ${
                      isCritical
                        ? 'border-rose-900/60 bg-rose-950/40 text-rose-400 font-semibold'
                        : 'border-[#1d6d63] bg-[#12544F]/50 text-[#8BBB92]'
                    }`}
                  >
                    {badgeText}
                  </span>
                </div>

                <p className="text-xs text-[#8BBB92] truncate">
                  {isDefect ? defectItem?.roadName : incidentItem?.locationName}
                </p>

                <div className="flex items-center justify-between text-[11px] font-mono text-[#5b9076] pt-0.5">
                  <span>
                    Bus {isDefect ? defectItem?.detectedByBusId : incidentItem?.reportedByBusId}
                  </span>
                  <span suppressHydrationWarning>
                    {formatRelativeTime(isDefect ? defectItem!.detectedAt : incidentItem!.timestamp)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
