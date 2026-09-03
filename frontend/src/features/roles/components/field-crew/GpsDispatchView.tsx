'use client';

import React, { useState } from 'react';
import { Navigation, MapPin, ExternalLink, HardHat, Check, Copy } from 'lucide-react';
import { useWorkOrderStore } from '@/features/roles/stores/workOrderStore';
import { Button } from '@/components/ui/Button';

export function GpsDispatchView() {
  const tickets = useWorkOrderStore((state) => state.tickets);
  const activeTickets = tickets.filter((t) => t.status !== 'verified_closed');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyCoords = (ticketId: string, lat: number, lng: number) => {
    navigator.clipboard.writeText(`${lat}, ${lng}`);
    setCopiedId(ticketId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto p-5 bg-[#092328] text-[#f0fdf4]">
      {/* Top Header with Flex-Wrap to prevent overlap */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#12544F] pb-3">
        <div className="flex items-center gap-2.5 min-w-[280px]">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#12544F] border border-[#2A835F] text-[#8BBB92]">
            <Navigation className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-[#f0fdf4]">
              Turn-by-Turn GPS Dispatch & Field Navigation
            </h2>
            <p className="text-xs text-[#8BBB92]">
              Centimeter-level defect coordinates captured by public transit buses
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded border border-[#12544F] bg-[#0d3137] px-3 py-1 text-xs font-mono text-[#8BBB92]">
            Crew: Team Alpha (South Zone)
          </span>
          <span className="rounded border border-[#2A835F] bg-[#12544F] px-2.5 py-1 text-xs font-mono font-bold text-[#f0fdf4]">
            {activeTickets.length} Stops Pending
          </span>
        </div>
      </div>

      {/* Responsive Grid of Work Order Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {activeTickets.map((ticket, idx) => (
          <div
            key={ticket.id}
            className="flex flex-col justify-between rounded-xl border border-[#12544F] bg-[#0d3137] p-4 shadow-sm space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#8BBB92]">
                  STOP #{idx + 1} · {ticket.id}
                </span>
                <span className="rounded border border-amber-800/40 bg-amber-950/40 px-2 py-0.5 text-[10px] font-mono text-amber-400 font-medium">
                  {ticket.severity.toUpperCase()}
                </span>
              </div>

              <h3 className="text-sm font-semibold text-[#f0fdf4] line-clamp-1">{ticket.title}</h3>
              <p className="text-xs text-[#8BBB92] line-clamp-1">{ticket.locationName}</p>

              <div className="rounded-lg border border-[#12544F] bg-[#092328] p-3 text-xs font-mono space-y-1 text-[#8BBB92]">
                <div className="flex justify-between">
                  <span>GPS Coords:</span>
                  <span className="text-[#f0fdf4] font-bold">
                    {ticket.coords.lat.toFixed(5)}° N, {ticket.coords.lng.toFixed(5)}° E
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Asphalt Mix:</span>
                  <span className="text-[#8BBB92]">{ticket.estimatedAsphaltTons} MT (VG-30)</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${ticket.coords.lat},${ticket.coords.lng}`}
                target="_blank"
                rel="noreferrer"
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#8BBB92] py-2 text-xs font-bold text-[#092328] uppercase transition-all hover:bg-[#f0fdf4] cursor-pointer"
              >
                <Navigation className="h-3.5 w-3.5" />
                <span>Navigate</span>
              </a>

              <button
                onClick={() => handleCopyCoords(ticket.id, ticket.coords.lat, ticket.coords.lng)}
                title="Copy GPS Coordinates"
                className="flex items-center justify-center rounded-lg border border-[#12544F] bg-[#12544F]/50 px-3 text-xs text-[#8BBB92] hover:bg-[#12544F] hover:text-[#f0fdf4] transition-colors cursor-pointer"
              >
                {copiedId === ticket.id ? (
                  <Check className="h-3.5 w-3.5 text-[#8BBB92]" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
