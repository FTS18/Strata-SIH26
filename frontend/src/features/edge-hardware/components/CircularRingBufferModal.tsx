'use client';

import React, { useState } from 'react';
import { HardDrive, Wifi, RefreshCw, X, CheckCircle2, ShieldCheck, Database, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface CircularRingBufferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export function CircularRingBufferModal({
  isOpen,
  onClose,
  onShowToast,
}: CircularRingBufferModalProps) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [usedGb, setUsedGb] = useState(14.8);
  const [totalClips, setTotalClips] = useState(48);
  const [networkMode, setNetworkMode] = useState<'cellular' | 'depot_wifi'>('depot_wifi');

  if (!isOpen) return null;

  const handleTriggerDepotSync = () => {
    setIsSyncing(true);
    setSyncProgress(10);

    const interval = setInterval(() => {
      setSyncProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsSyncing(false);
          setUsedGb(1.2);
          setTotalClips(4);
          onShowToast('Depot Wi-Fi Sync complete: 44 UHD video evidence clips offloaded to central vault.');
          return 100;
        }
        return prev + 25;
      });
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-xl border border-[#12544F] bg-[#092328] p-5 shadow-2xl font-mono text-xs max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#12544F] pb-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#12544F] border border-[#2A835F] text-[#8BBB92]">
              <HardDrive className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-[#f0fdf4] text-sm">
                72-Hour Offline Circular Ring Buffer (BEL PS 26124)
              </h3>
              <p className="text-[11px] text-[#8BBB92]">
                Cyclic onboard NVMe storage for cellular dead zones with opportunistic Depot Wi-Fi offload
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#8BBB92] hover:text-[#f0fdf4]">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Core Buffer Capacity Status */}
        <div className="space-y-3 my-4">
          <div className="rounded-lg border border-[#12544F] bg-[#0d3137] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#8BBB92] uppercase">
                NVMe Ring Buffer Partition (/dev/nvme0n1p3)
              </span>
              <span className="rounded bg-[#12544F] px-2 py-0.5 text-[10px] text-[#8BBB92] font-bold">
                Circular FIFO Active
              </span>
            </div>

            {/* Storage Progress Bar */}
            <div>
              <div className="flex justify-between text-xs pb-1 font-bold">
                <span className="text-[#f0fdf4]">{usedGb.toFixed(1)} GB Used</span>
                <span className="text-[#8BBB92]">64.0 GB Capacity (72h Horizon)</span>
              </div>
              <div className="w-full h-3 bg-[#092328] rounded border border-[#12544F] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-[#2A835F] transition-all duration-300"
                  style={{ width: `${(usedGb / 64) * 100}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1 text-[11px]">
              <div className="rounded border border-[#12544F] bg-[#092328] p-2 text-center">
                <span className="text-[#8BBB92]">Buffered Clips</span>
                <p className="font-bold text-[#f0fdf4] text-sm mt-0.5">{totalClips}</p>
              </div>
              <div className="rounded border border-[#12544F] bg-[#092328] p-2 text-center">
                <span className="text-[#8BBB92]">IMU/GPS Logs</span>
                <p className="font-bold text-[#f0fdf4] text-sm mt-0.5">21,480 pkts</p>
              </div>
              <div className="rounded border border-[#12544F] bg-[#092328] p-2 text-center">
                <span className="text-[#8BBB92]">Retention Window</span>
                <p className="font-bold text-emerald-400 text-sm mt-0.5">72 Hours</p>
              </div>
            </div>
          </div>

          {/* Network Link & Depot Wi-Fi Detection */}
          <div className="rounded-lg border border-[#12544F] bg-[#0d3137] p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#8BBB92] uppercase">
                Transport Link Physical Layer
              </span>
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px]">
                <Wifi className="h-3.5 w-3.5 animate-pulse" />
                <span>CTU Depot 1 Wi-Fi 6 Detected</span>
              </div>
            </div>

            <p className="text-[11px] text-[#8BBB92]">
              On-route, only 14 KB/min JSON telemetry was uploaded over 4G to conserve city data costs. High-resolution raw MP4 evidence clips were safely buffered in the 72-hour ring buffer and are now ready for bulk transfer.
            </p>

            {/* Sync Progress if Active */}
            {isSyncing && (
              <div className="space-y-1.5 pt-2 border-t border-[#12544F]">
                <div className="flex justify-between text-xs font-bold text-[#f0fdf4]">
                  <span>Offloading 4K Evidence Clips via 802.11ax...</span>
                  <span className="text-emerald-400">{syncProgress}%</span>
                </div>
                <div className="w-full h-2 bg-[#092328] rounded border border-[#12544F] overflow-hidden">
                  <div
                    className="h-full bg-[#8BBB92] transition-all duration-300"
                    style={{ width: `${syncProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#12544F] shrink-0">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleTriggerDepotSync}
            disabled={isSyncing}
            className="bg-[#2A835F] text-[#f0fdf4] hover:bg-[#12544F] font-bold"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Synchronizing with Depot...' : 'Trigger Opportunistic Wi-Fi Sync'}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
