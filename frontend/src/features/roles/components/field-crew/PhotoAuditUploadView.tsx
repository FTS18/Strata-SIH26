'use client';

import React, { useState } from 'react';
import { Upload, CheckCircle2, Camera, Clock, AlertTriangle } from 'lucide-react';
import { useWorkOrderStore } from '@/features/roles/stores/workOrderStore';
import { Button } from '@/components/ui/Button';

export function PhotoAuditUploadView() {
  const tickets = useWorkOrderStore((state) => state.tickets);
  const submitRepairVerification = useWorkOrderStore((state) => state.submitRepairVerification);
  const activeTickets = tickets.filter((t) => t.status !== 'verified_closed');

  const [selectedTicketId, setSelectedTicketId] = useState<string>(activeTickets[0]?.id || '');
  const [isUploaded, setIsUploaded] = useState(false);

  const selectedTicket = tickets.find((t) => t.id === selectedTicketId) || activeTickets[0];

  const handleUploadAndTrigger = () => {
    if (!selectedTicket) return;
    submitRepairVerification(
      selectedTicket.id,
      'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=600&auto=format&fit=crop&q=80',
      'Bus 104 (DL-1PC-6674)'
    );
    setIsUploaded(true);
  };

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto p-5 bg-[#092328] text-[#f0fdf4]">
      <div className="flex items-center justify-between border-b border-[#12544F] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#12544F] border border-[#2A835F] text-[#8BBB92]">
            <Upload className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-[#f0fdf4]">
              Photographic Repair Upload & Autonomous Bus Audit Trigger
            </h2>
            <p className="text-xs text-[#8BBB92]">
              Upload geotagged completion proof to notify upcoming transit bus cameras for optical + IMU smoothness verification
            </p>
          </div>
        </div>

        <span className="rounded border border-[#12544F] bg-[#0d3137] px-3 py-1 text-xs font-mono text-[#8BBB92]">
          Contractor Compliance Portal
        </span>
      </div>

      <div className="grid flex-1 grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 overflow-y-auto">
        {/* Left: Select Work Order */}
        <div className="flex flex-col gap-3 rounded-xl border border-[#12544F] bg-[#0d3137] p-5 shadow-sm">
          <h3 className="text-xs font-semibold text-[#8BBB92] uppercase tracking-wider font-mono">
            Select Active Work Order
          </h3>

          <select
            value={selectedTicketId}
            onChange={(e) => {
              setSelectedTicketId(e.target.value);
              setIsUploaded(false);
            }}
            className="w-full rounded-lg border border-[#12544F] bg-[#092328] p-3 text-xs font-mono text-[#f0fdf4] outline-none"
          >
            {activeTickets.map((t) => (
              <option key={t.id} value={t.id}>
                {t.id} - {t.title} ({t.locationName})
              </option>
            ))}
          </select>

          {selectedTicket && (
            <div className="space-y-3 pt-2">
              <div className="space-y-1">
                <span className="text-xs font-medium text-[#8BBB92]">Before Repair (Captured by Bus Camera):</span>
                <img
                  src={selectedTicket.beforePhotoUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80'}
                  alt="Before repair"
                  className="h-40 w-full rounded-lg object-cover border border-[#12544F]"
                />
              </div>

              <div className="rounded-lg border border-[#12544F] bg-[#092328] p-3 text-xs font-mono space-y-1 text-[#8BBB92]">
                <p>Location: <span className="text-[#f0fdf4]">{selectedTicket.locationName}</span></p>
                <p>Asphalt Mix: <span className="text-[#f0fdf4]">{selectedTicket.estimatedAsphaltTons} MT</span></p>
                <p>Status: <span className="text-amber-400 font-semibold">{selectedTicket.status.toUpperCase()}</span></p>
              </div>
            </div>
          )}
        </div>

        {/* Right: Upload Repair Photo */}
        <div className="flex flex-col justify-between rounded-xl border border-[#12544F] bg-[#0d3137] p-5 shadow-sm">
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-[#8BBB92] uppercase tracking-wider font-mono">
              Upload Post-Repair Visual Proof
            </h3>

            <div className="relative flex h-48 flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#12544F] bg-[#092328] p-4 text-center">
              {isUploaded ? (
                <div className="space-y-2">
                  <CheckCircle2 className="mx-auto h-8 w-8 text-[#8BBB92]" />
                  <span className="font-semibold text-xs text-[#f0fdf4]">
                    Repair Photo Uploaded & Geotag Verified!
                  </span>
                  <p className="text-[11px] font-mono text-[#8BBB92]">
                    Next passing bus (Bus 104) will audit smoothness within ~8 mins
                  </p>
                </div>
              ) : (
                <div className="space-y-2 cursor-pointer">
                  <Camera className="mx-auto h-8 w-8 text-[#8BBB92]" />
                  <span className="text-xs font-medium text-[#f0fdf4]">
                    Click to capture or upload freshly compacted asphalt photo
                  </span>
                  <p className="text-[10px] font-mono text-[#5b9076]">
                    EXIF GPS metadata will be automatically validated
                  </p>
                </div>
              )}
            </div>

            <div className="rounded-lg border border-[#12544F] bg-[#12544F]/30 p-3 text-xs text-[#8BBB92] space-y-1">
              <p className="font-semibold text-[#f0fdf4]">How Autonomous Re-Audit Works:</p>
              <p>1. When uploaded, the work order status updates to <strong>In Progress</strong>.</p>
              <p>2. The next DTC/BMTC bus passing over the patch executes IMU vibration checks.</p>
              <p>3. If Z-spike &lt; 1.5g, the ticket is automatically marked <strong>Verified Closed</strong> without manual inspection!</p>
            </div>
          </div>

          <Button
            variant="primary"
            size="md"
            className="w-full justify-center bg-[#8BBB92] text-[#092328] font-bold hover:bg-[#f0fdf4] mt-4"
            onClick={handleUploadAndTrigger}
          >
            <Upload className="h-4 w-4" />
            <span>Submit Repair & Trigger Autonomous Bus Audit</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
