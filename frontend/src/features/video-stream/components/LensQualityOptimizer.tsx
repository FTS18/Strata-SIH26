'use client';

import React, { useState } from 'react';
import { Eye, Droplets, Sparkles, ShieldCheck, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function LensQualityOptimizer() {
  const [lqiScore, setLqiScore] = useState<number>(88);
  const [isClaheActive, setIsClaheActive] = useState<boolean>(true);
  const [isOcclusionMaskActive, setIsOcclusionMaskActive] = useState<boolean>(false);
  const [maintenanceAlertLogged, setMaintenanceAlertLogged] = useState<boolean>(false);

  const isDegraded = lqiScore < 60;

  const handleTriggerOcclusion = () => {
    setLqiScore(44);
    setIsOcclusionMaskActive(true);
    setMaintenanceAlertLogged(true);
  };

  const handleRecalibrateCleanLens = () => {
    setLqiScore(94);
    setIsOcclusionMaskActive(false);
    setMaintenanceAlertLogged(false);
  };

  return (
    <div className="flex flex-col rounded-xl border border-[var(--surface-border)] bg-[var(--surface-panel)] p-5 shadow-sm space-y-4 select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--surface-border)] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--surface-subtle)] border border-[var(--color-accent-primary)] text-[var(--text-secondary)]">
            <Eye className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">
              Autonomous Lens Quality Index (LQI) & CLAHE De-Hazing Engine
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Real-time Laplacian variance edge blur and soot/mud occlusion detection on Indian bus cameras
            </p>
          </div>
        </div>

        <span
          className={`rounded border px-2.5 py-1 text-xs font-mono font-bold ${
            isDegraded
              ? 'border-rose-800/40 bg-rose-950/40 text-rose-400'
              : 'border-[var(--color-accent-primary)] bg-[var(--surface-subtle)] text-[var(--text-secondary)]'
          }`}
        >
          LQI CLARITY: {lqiScore}%
        </span>
      </div>

      {/* Optimizer Controls & Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {/* Metric 1: Laplacian Variance */}
        <div className="rounded-lg border border-[var(--surface-border)] bg-[var(--surface-canvas)] p-3.5 space-y-1">
          <span className="text-xs text-[var(--text-secondary)]">Laplacian Focus Score</span>
          <div className="font-display text-2xl font-bold text-[var(--text-primary)]">
            {Math.round(lqiScore * 2.8)} <span className="text-xs font-mono text-[var(--text-secondary)]">var</span>
          </div>
          <span className="text-[10px] font-mono text-[var(--text-muted)]">Min Threshold: 120 var</span>
        </div>

        {/* Metric 2: CLAHE State */}
        <div className="rounded-lg border border-[var(--surface-border)] bg-[var(--surface-canvas)] p-3.5 space-y-1">
          <span className="text-xs text-[var(--text-secondary)]">CLAHE De-Haze Filter</span>
          <div className="font-display text-2xl font-bold text-[var(--text-secondary)]">
            {isClaheActive ? 'ACTIVE' : 'BYPASSED'}
          </div>
          <span className="text-[10px] font-mono text-[var(--text-muted)]">Monsoon & Dust Storm Mode</span>
        </div>

        {/* Metric 3: Depot Maintenance */}
        <div className="rounded-lg border border-[var(--surface-border)] bg-[var(--surface-canvas)] p-3.5 space-y-1">
          <span className="text-xs text-[var(--text-secondary)]">Depot Cleaning Trigger</span>
          <div className={`font-display text-2xl font-bold ${maintenanceAlertLogged ? 'text-rose-400' : 'text-[var(--text-secondary)]'}`}>
            {maintenanceAlertLogged ? 'SCHEDULED' : 'CLEAN'}
          </div>
          <span className="text-[10px] font-mono text-[var(--text-muted)]">Sarojini Nagar Depot Crew</span>
        </div>
      </div>

      {/* Live Video Lens Preview with Real-time CSS Filter Pipeline */}
      <div className="relative h-44 sm:h-52 w-full rounded-xl border border-[var(--surface-border)] bg-black overflow-hidden shadow-inner flex items-center justify-center">
        <video
          autoPlay
          loop
          muted
          playsInline
          className={`h-full w-full object-cover transition-all duration-500 ${
            isOcclusionMaskActive ? 'blur-[3px] contrast-75 brightness-75' : ''
          } ${isClaheActive ? 'contrast-125 saturate-110' : 'contrast-90'}`}
          src="/videos/13191182_3840_2160_30fps.mp4"
        />

        {/* Mud / Soot Occlusion Splatter Overlay */}
        {isOcclusionMaskActive && (
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-950/70 via-transparent to-transparent flex items-center justify-center">
            <div className="rounded-full bg-amber-950/80 border-2 border-amber-600/60 p-6 text-center text-amber-300 font-mono text-xs shadow-2xl backdrop-blur-xs">
              <Droplets className="h-6 w-6 mx-auto mb-1 text-amber-400 animate-bounce" />
              <span>OCCLUSION MASK ACTIVE (LQI: 44%)</span>
              <p className="text-[10px] text-amber-400/80">Sector [X: 620, Y: 180] Blinded</p>
            </div>
          </div>
        )}

        {/* Live Filter Telemetry HUD */}
        <div className="absolute top-2 left-2 rounded bg-black/80 px-2 py-0.5 text-[10px] font-mono text-[var(--text-secondary)] border border-[var(--surface-border)]">
          LIVE LENS FEED · {isClaheActive ? 'CLAHE EQUALIZED' : 'RAW SENSOR FEED'}
        </div>

        <div className="absolute bottom-2 right-2 rounded bg-black/80 px-2 py-0.5 text-[10px] font-mono text-[var(--text-secondary)] border border-[var(--surface-border)]">
          LAPLACIAN VAR: {Math.round(lqiScore * 2.8)}
        </div>
      </div>

      {/* Interactive Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 pt-1">
        <Button
          variant="secondary"
          size="sm"
          className="flex-1 bg-[var(--surface-subtle)] text-[var(--text-primary)] border-[var(--color-accent-primary)] hover:bg-[#2563eb] text-xs font-semibold"
          onClick={handleTriggerOcclusion}
        >
          <Droplets className="h-3.5 w-3.5 text-amber-400" />
          <span>Induce Lens Occlusion Stress Event</span>
        </Button>

        <Button
          variant="secondary"
          size="sm"
          className="flex-1 bg-[var(--surface-subtle)] text-[var(--text-primary)] border-[var(--color-accent-primary)] hover:bg-[#2563eb] text-xs font-semibold"
          onClick={() => setIsClaheActive(!isClaheActive)}
        >
          <Sparkles className="h-3.5 w-3.5 text-[var(--text-secondary)]" />
          <span>Toggle Adaptive CLAHE De-Hazing</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="border-[var(--surface-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-semibold"
          onClick={handleRecalibrateCleanLens}
        >
          <ShieldCheck className="h-3.5 w-3.5 text-[var(--text-secondary)]" />
          <span>Recalibrate Optical Clarity</span>
        </Button>
      </div>

      {/* Engineering Note */}
      {isDegraded && (
        <div className="flex items-center gap-2 rounded-lg border border-rose-800/40 bg-rose-950/30 p-3 text-xs text-rose-300">
          <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />
          <span>
            <strong>Lens Quality Alert ($LQI &lt; 60\%$):</strong> Sector occlusion detected on Front Lens. Applying adaptive occlusion mask to prevent false positive defect logging. Automated maintenance ticket dispatched to Depot 14.
          </span>
        </div>
      )}
    </div>
  );
}
