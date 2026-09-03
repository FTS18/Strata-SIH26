'use client';

import React, { useState } from 'react';
import { HardHat, Navigation, Upload } from 'lucide-react';
import { useWorkOrderStore } from '@/features/roles/stores/workOrderStore';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatEnumLabel } from '@/lib/utils';

export function FieldCrewConsole() {
  const tickets = useWorkOrderStore((state) => state.tickets);
  const submitRepairVerification = useWorkOrderStore((state) => state.submitRepairVerification);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(tickets[0]?.id || null);

  const activeTickets = tickets.filter((t) => t.status !== 'verified_closed');
  const selectedTicket = tickets.find((t) => t.id === selectedTicketId) || activeTickets[0];

  const handleCompleteFieldRepair = (ticketId: string) => {
    submitRepairVerification(
      ticketId,
      'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=600&auto=format&fit=crop&q=80',
      'Bus 104 (DL-1PC-6674)'
    );
  };

  return (
    <div className="flex h-full flex-col gap-4 overflow-hidden p-4 bg-[#092328] text-[#f0fdf4]">
      <div className="flex items-center justify-between border-b border-[#12544F] pb-3">
        <div className="flex items-center gap-2">
          <HardHat className="h-5 w-5 text-[#8BBB92]" />
          <div>
            <h2 className="text-sm font-semibold text-[#f0fdf4]">
              Field Maintenance Queue (Mobile-Ready)
            </h2>
            <p className="text-xs text-[#8BBB92]">
              Turn-by-turn GPS dispatch and photographic repair verification
            </p>
          </div>
        </div>
        <span className="rounded border border-[#12544F] bg-[#0d3137] px-3 py-1 text-xs font-mono text-[#8BBB92]">
          Contractor: Shree Balaji Infra Works
        </span>
      </div>

      <div className="grid flex-1 grid-cols-1 lg:grid-cols-2 gap-4 overflow-y-auto">
        {/* Left: Task List */}
        <div className="flex flex-col rounded-lg border border-[#12544F] bg-[#0d3137] overflow-hidden">
          <div className="border-b border-[#12544F] bg-[#092328] px-4 py-2.5 text-xs font-semibold text-[#f0fdf4]">
            Assigned Work Orders ({activeTickets.length})
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {activeTickets.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => setSelectedTicketId(ticket.id)}
                className={`flex cursor-pointer flex-col gap-1.5 rounded-lg border p-3 transition-all select-none ${
                  selectedTicket?.id === ticket.id
                    ? 'border-[#2A835F] bg-[#12544F]'
                    : 'border-[#12544F] bg-[#092328] hover:bg-[#12544F]/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#f0fdf4]">{ticket.id}</span>
                  <span
                    className={`rounded border px-2 py-0.5 text-[10px] font-mono font-medium ${
                      ticket.severity === 'critical'
                        ? 'border-rose-800/40 bg-rose-950/40 text-rose-400'
                        : 'border-amber-800/40 bg-amber-950/40 text-amber-400'
                    }`}
                  >
                    {formatEnumLabel(ticket.status)}
                  </span>
                </div>
                <h4 className="text-xs font-semibold text-[#f0fdf4]">{ticket.title}</h4>
                <p className="text-[11px] text-[#8BBB92]">{ticket.locationName}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Active Task Details */}
        {selectedTicket && (
          <div className="flex flex-col rounded-lg border border-[#12544F] bg-[#0d3137] p-4 overflow-y-auto space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm font-bold text-[#f0fdf4]">{selectedTicket.id}</span>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${selectedTicket.coords.lat},${selectedTicket.coords.lng}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded border border-[#2A835F] bg-[#12544F] px-2.5 py-1 text-xs font-medium text-[#f0fdf4] hover:bg-[#2A835F]"
              >
                <Navigation className="h-3.5 w-3.5 text-[#8BBB92]" />
                <span>Navigate to GPS</span>
              </a>
            </div>

            <h3 className="text-sm font-semibold text-[#f0fdf4]">{selectedTicket.title}</h3>
            <p className="text-xs text-[#8BBB92]">{selectedTicket.locationName}</p>

            {/* Before Photo */}
            <div className="space-y-1">
              <span className="text-[11px] font-medium text-[#8BBB92]">Before Repair (Captured by Bus Camera):</span>
              <img
                src={selectedTicket.beforePhotoUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80'}
                alt="Before repair"
                className="h-32 w-full rounded-md object-cover border border-[#12544F]"
              />
            </div>

            {/* Material & Cost Specs */}
            <div className="rounded-lg border border-[#12544F] bg-[#12544F]/40 p-3 text-xs font-mono space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#8BBB92]">Asphalt Required:</span>
                <span className="font-semibold text-[#f0fdf4]">{selectedTicket.estimatedAsphaltTons} MT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8BBB92]">Approved Budget:</span>
                <span className="font-semibold text-[#8BBB92]">{formatCurrency(selectedTicket.estimatedCostInr || 0)}</span>
              </div>
            </div>

            {/* Submit Repair Flow */}
            <div className="pt-2">
              <Button
                variant="primary"
                size="md"
                className="w-full justify-center bg-[#8BBB92] text-[#092328] font-semibold hover:bg-[#f0fdf4]"
                onClick={() => handleCompleteFieldRepair(selectedTicket.id)}
              >
                <Upload className="h-4 w-4" />
                <span>Upload Repair Photo & Trigger Auto-Audit</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
