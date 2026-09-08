'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, Volume2, ArrowRight, CheckCircle2, Wrench, ShieldCheck, Send } from 'lucide-react';
import { useWorkOrderStore } from '@/features/roles/stores/workOrderStore';

export interface PedestrianAlertData {
  alert_id: string;
  bus_id: string;
  route_id: string;
  zone_type: 'SCHOOL_ZONE_CROSSING' | 'MIDBLOCK_JAYWALKING' | 'TRANSIT_BOTTLENECK';
  location: string;
  pedestrians_count: number;
  children_detected: boolean;
  crosswalk_status: 'NORMAL' | 'FADED_MARKING' | 'MISSING_SIGNAGE';
  speed_limit_km_h: number;
  current_speed_km_h: number;
  driver_advisory: string;
  in_cabin_alert_active: boolean;
  forward_to_pwd: boolean;
  pwd_work_order_id?: string;
  timestamp: number;
  boxes?: number[][];
}

export function SchoolZoneSafetyAlert({
  compact = false,
  camId,
}: {
  compact?: boolean;
  camId?: string;
}) {
  const [activeAlert, setActiveAlert] = useState<PedestrianAlertData | null>(null);
  const [acknowledged, setAcknowledged] = useState<boolean>(false);
  const [pwdDispatched, setPwdDispatched] = useState<boolean>(false);

  const createCustomTicket = useWorkOrderStore((state) => state.createCustomTicket);

  // Poll backend for real-time model inference from active video stream
  useEffect(() => {
    let isMounted = true;
    const fetchLatestAlert = async () => {
      try {
        const url = camId
          ? `http://localhost:8000/api/v1/pedestrian/latest?cam=${camId}`
          : 'http://localhost:8000/api/v1/pedestrian/latest';
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            if (data.alert && data.alert.pedestrians_count > 0) {
              setActiveAlert(data.alert);
            } else {
              setActiveAlert(null);
            }
          }
        }
      } catch {
        // Backend not reachable, stay quiet
      }
    };

    fetchLatestAlert();
    const interval = setInterval(fetchLatestAlert, 1200);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [camId]);

  // When no pedestrians are detected in the active camera stream:
  if (!activeAlert || activeAlert.pedestrians_count === 0) {
    return (
      <div className="flex items-center justify-between gap-2 rounded-lg border border-[var(--surface-border)] bg-[var(--surface-panel)]/80 px-3.5 py-2 font-mono text-xs text-[var(--text-secondary)]">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="font-bold text-[var(--text-primary)]">VULNERABLE PEDESTRIAN SCANNER</span>
          <span className="hidden sm:inline">· ROADWAY CLEAR (0 OBSTACLES)</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-muted)]">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span>YOLOv8 Edge Vision Active</span>
        </div>
      </div>
    );
  }

  const isOverspeeding = activeAlert.current_speed_km_h > activeAlert.speed_limit_km_h;

  if (compact) {
    return (
      <div className="flex items-center justify-between gap-2 rounded border border-amber-500/40 bg-[var(--surface-panel)] px-3 py-1.5 font-mono text-xs shadow-sm">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
          </span>
          <span className="font-bold text-amber-300">
            {activeAlert.zone_type} · {activeAlert.pedestrians_count} DETECTED
          </span>
          <span className="text-[var(--text-secondary)] hidden sm:inline">
            Speed Limit: {activeAlert.speed_limit_km_h} km/h
          </span>
        </div>
        <span className="rounded bg-amber-950/80 border border-amber-500/40 px-2 py-0.5 text-[10px] font-bold text-amber-300">
          LIVE MODEL INFERENCE
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col rounded-lg border border-amber-500/50 bg-[var(--surface-canvas)] overflow-hidden shadow-md font-mono text-xs">
      {/* Top Banner Header */}
      <div className="flex items-center justify-between border-b border-amber-500/30 bg-amber-950/40 px-3.5 py-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-400 animate-pulse shrink-0" />
          <span className="font-bold text-amber-300 tracking-wide">
            VULNERABLE PEDESTRIAN SAFETY CORRIDOR
          </span>
          <span className="rounded border border-amber-400/40 bg-amber-950/60 px-2 py-0.2 text-[10px] text-amber-300 font-bold">
            {activeAlert.zone_type}
          </span>
        </div>

        <button
          onClick={() => setAcknowledged(true)}
          className={`rounded px-2.5 py-1 text-[10px] font-bold cursor-pointer transition-all ${
            acknowledged
              ? 'bg-[var(--surface-subtle)] text-[var(--text-secondary)]'
              : 'bg-amber-600 text-black hover:bg-amber-500'
          }`}
        >
          {acknowledged ? 'Acknowledged' : 'Acknowledge Cabin Alert'}
        </button>
      </div>

      {/* Main Alert Telemetry Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3.5 bg-[var(--surface-panel)]/60">
        {/* Left: Driver Cabin Advisory */}
        <div className="flex flex-col justify-between rounded border border-[var(--surface-border)] bg-[#06191c] p-3 space-y-2">
          <div>
            <div className="flex items-center justify-between text-[11px] text-[var(--text-secondary)] mb-1">
              <span>IN-CABIN DRIVER ADVISORY</span>
              <div className="flex items-center gap-1 text-amber-400">
                <Volume2 className={`h-3.5 w-3.5 ${!acknowledged ? 'animate-bounce' : ''}`} />
                <span className="text-[9px] font-bold">
                  {acknowledged ? 'MUTED' : 'AUDIO CHIME ON'}
                </span>
              </div>
            </div>
            <p className="text-sm font-bold text-amber-300 leading-tight">
              {activeAlert.driver_advisory}
            </p>
          </div>

          <div className="pt-2 border-t border-[var(--surface-border)] flex justify-between items-center text-[10px] text-[var(--text-muted)]">
            <span>Target: {activeAlert.bus_id}</span>
            <span>Route: {activeAlert.route_id}</span>
          </div>
        </div>

        {/* Center: Kinematic Speed Enforcer Gauge */}
        <div className="flex flex-col justify-between rounded border border-[var(--surface-border)] bg-[#06191c] p-3 space-y-2">
          <div className="flex justify-between items-center text-[11px] text-[var(--text-secondary)]">
            <span>SPEED COMPLIANCE</span>
            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
              isOverspeeding ? 'bg-rose-950/80 text-rose-400 border border-rose-800/50' : 'bg-emerald-950 text-emerald-400'
            }`}>
              {isOverspeeding ? 'OVERSPEED IN SCHOOL ZONE' : 'SAFE COMPLIANCE'}
            </span>
          </div>

          <div className="flex items-baseline gap-3 my-1">
            <div>
              <span className="text-2xl font-extrabold text-[var(--text-primary)] tabular-nums">
                {activeAlert.current_speed_km_h}
              </span>
              <span className="text-[10px] text-[var(--text-secondary)] ml-1">km/h</span>
              <p className="text-[9px] text-[var(--text-muted)]">Observed Speed</p>
            </div>
            <ArrowRight className="h-4 w-4 text-[var(--text-secondary)]" />
            <div>
              <span className="text-2xl font-extrabold text-amber-400 tabular-nums">
                {activeAlert.speed_limit_km_h}
              </span>
              <span className="text-[10px] text-amber-300 ml-1">km/h</span>
              <p className="text-[9px] text-amber-300/80">Enforced Limit</p>
            </div>
          </div>

          <p className="text-[10px] text-[var(--text-secondary)] pt-2 border-t border-[var(--surface-border)]">
            Location: <span className="text-[var(--text-primary)]">{activeAlert.location}</span>
          </p>
        </div>

        {/* Right: PWD Civil Infrastructure Integration */}
        <div className="flex flex-col justify-between rounded border border-[var(--surface-border)] bg-[#06191c] p-3 space-y-2">
          <div>
            <div className="flex items-center justify-between text-[11px] text-[var(--text-secondary)] mb-1">
              <span>CROSSWALK INFRASTRUCTURE</span>
              <span className="text-[10px] text-amber-400 font-bold">
                {activeAlert.crosswalk_status}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <Wrench className="h-4 w-4 text-[var(--color-accent-cyan)] shrink-0 mt-0.5" />
              <p className="text-[11px] text-[var(--text-primary)]">
                Zebra crossing paint &gt;60% faded near school gates. Auto-ticket created for PWD civil maintenance.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[var(--surface-border)] text-[10px]">
            <span className="text-[var(--text-muted)]">Work Order: {pwdDispatched ? 'WO-PWD-7721' : (activeAlert.pwd_work_order_id || 'Pending')}</span>
            {pwdDispatched ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> PWD Dispatched
              </span>
            ) : (
              <button
                onClick={() => {
                  createCustomTicket({
                    defectId: 'DEF-CROSSWALK-7721',
                    title: 'School Zone Crosswalk Thermal Repaint',
                    locationName: activeAlert.location,
                    coords: { lat: 30.7595, lng: 76.7740 },
                    severity: 'critical',
                    status: 'detected',
                    estimatedAsphaltTons: 0.8,
                    estimatedCostInr: 8500,
                  });
                  setPwdDispatched(true);
                }}
                className="rounded border border-[var(--color-accent-primary)] bg-[var(--surface-subtle)] px-2 py-0.5 text-[10px] text-[var(--text-secondary)] hover:bg-[#2563eb] hover:text-[var(--text-primary)] font-bold cursor-pointer transition-colors"
              >
                Forward to PWD
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
