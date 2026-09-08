'use client';

import React, { useState } from 'react';
import { ShieldCheck, MapPin, AlertTriangle, Plus, X, Check, Trash2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export interface SpeedBreaker {
  id: string;
  roadName: string;
  coords: { lat: number; lng: number };
  calmerType: string;
  standardCode: string;
  status: 'Whitelisted' | 'Rogue Bump';
  addedBy: string;
}

interface SpeedBreakerWhitelistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export function SpeedBreakerWhitelistModal({
  isOpen,
  onClose,
  onShowToast,
}: SpeedBreakerWhitelistModalProps) {
  const [calmers, setCalmers] = useState<SpeedBreaker[]>([
    {
      id: 'CALM-CHD-01',
      roadName: 'Panjab University School Gate 2 (Sec 14)',
      coords: { lat: 30.7595, lng: 76.774 },
      calmerType: 'Asphalt Parabolic Hump',
      standardCode: 'IRC:99-1988 Spec',
      status: 'Whitelisted',
      addedBy: 'Municipal PWD Wing',
    },
    {
      id: 'CALM-CHD-02',
      roadName: 'PGI Hospital Emergency Gate (Sec 12)',
      coords: { lat: 30.7621, lng: 76.7791 },
      calmerType: 'Tabletop Pedestrian Crossing',
      standardCode: 'IRC:99-1988 Spec',
      status: 'Whitelisted',
      addedBy: 'Smart City GIS Registry',
    },
    {
      id: 'CALM-CHD-03',
      roadName: 'Madhya Marg Grain Market Service Lane',
      coords: { lat: 30.7315, lng: 76.814 },
      calmerType: 'Illegal Concrete Ridge',
      standardCode: 'Unapproved Hazard',
      status: 'Rogue Bump',
      addedBy: 'AI Bus IMU Detection',
    },
    {
      id: 'CALM-CHD-04',
      roadName: 'Dakshin Marg Near Tribune Light Junction',
      coords: { lat: 30.707, lng: 76.794 },
      calmerType: 'Modular Rubber Speed Calmer',
      standardCode: 'IRC:99-1988 Spec',
      status: 'Whitelisted',
      addedBy: 'Traffic Police Advisory',
    },
  ]);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newRoad, setNewRoad] = useState('');
  const [newLat, setNewLat] = useState(30.7333);
  const [newLng, setNewLng] = useState(76.7794);
  const [newType, setNewType] = useState('Asphalt Parabolic Hump');

  if (!isOpen) return null;

  const handleToggleStatus = (id: string) => {
    setCalmers((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const nextStatus = c.status === 'Whitelisted' ? 'Rogue Bump' : 'Whitelisted';
        onShowToast(`Calmer ${c.id} status updated to ${nextStatus}.`);
        return { ...c, status: nextStatus };
      })
    );
  };

  const handleAddCalmer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoad.trim()) return;

    const newCalmer: SpeedBreaker = {
      id: `CALM-CHD-${Math.floor(10 + Math.random() * 90)}`,
      roadName: newRoad.trim(),
      coords: { lat: Number(newLat), lng: Number(newLng) },
      calmerType: newType,
      standardCode: 'IRC:99-1988 Spec',
      status: 'Whitelisted',
      addedBy: 'Executive Engineer',
    };

    setCalmers((prev) => [newCalmer, ...prev]);
    onShowToast(`Authorized Speed Calmer ${newCalmer.id} added to GIS Whitelist.`);
    setNewRoad('');
    setIsAddOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-xl border border-[var(--surface-border)] bg-[var(--surface-canvas)] p-5 shadow-2xl font-mono text-xs max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--surface-border)] pb-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--surface-subtle)] border border-[var(--color-accent-primary)] text-[var(--text-secondary)]">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-[var(--text-primary)] text-sm">
                Speed Breaker Spatial Whitelist GIS Filter (BEL PS 26124)
              </h3>
              <p className="text-[11px] text-[var(--text-secondary)]">
                Eliminating false pothole alarms by cross-referencing vertical IMU spikes against municipal calmers
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Algorithm Explanation Strip */}
        <div className="rounded-lg border border-[var(--surface-border)] bg-[var(--surface-panel)] p-3 my-3 shrink-0 text-[var(--text-secondary)] space-y-1">
          <div className="flex items-center justify-between font-semibold text-[var(--text-primary)]">
            <span>Dual-Layer Disambiguation Pipeline:</span>
            <span className="text-emerald-400 font-bold">15-Meter Geofence Buffer</span>
          </div>
          <p className="text-[11px]">
            1. When bus IMU registers vertical acceleration $Z &gt; 1.8g$, GPS position is matched against registered calmers.
          </p>
          <p className="text-[11px]">
            2. Match within 15m radius = <strong>Authorized Speed Calmer (Whitelisted)</strong>. No pothole work-order created.
          </p>
          <p className="text-[11px]">
            3. Spikes without optical or GIS match = <strong>Severe Pothole or Illegal Rogue Bump</strong>.
          </p>
        </div>

        {/* List of Registered Calmers */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          <div className="flex items-center justify-between pb-1">
            <span className="font-bold text-[var(--text-primary)]">Registered GIS Speed Calmers ({calmers.length})</span>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsAddOpen(true)}
              className="bg-[var(--surface-subtle)] text-[var(--text-primary)] border-[var(--color-accent-primary)] hover:bg-[#2563eb] text-xs h-7"
            >
              <Plus className="h-3 w-3" />
              <span>Add Authorized Calmer</span>
            </Button>
          </div>

          {calmers.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between rounded-lg border border-[var(--surface-border)] bg-[var(--surface-panel)] p-3 hover:border-[var(--color-accent-primary)] transition-colors"
            >
              <div className="space-y-0.5 max-w-[70%]">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[var(--text-primary)]">{c.id}</span>
                  <span
                    className={`rounded px-1.5 py-0.2 text-[9px] font-bold uppercase border ${
                      c.status === 'Whitelisted'
                        ? 'border-emerald-700/60 bg-emerald-950/60 text-emerald-300'
                        : 'border-rose-700/60 bg-rose-950/60 text-rose-300'
                    }`}
                  >
                    {c.status}
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)]">({c.standardCode})</span>
                </div>
                <p className="text-[var(--text-secondary)] text-xs truncate">{c.roadName}</p>
                <p className="text-[10px] text-[var(--text-muted)]">
                  GPS: {c.coords.lat.toFixed(4)}° N, {c.coords.lng.toFixed(4)}° E · Type: {c.calmerType} · Registered by: {c.addedBy}
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleToggleStatus(c.id)}
                  className={`text-[10px] h-7 px-2 font-bold ${
                    c.status === 'Whitelisted'
                      ? 'border-rose-800/40 bg-rose-950/40 text-rose-300 hover:bg-rose-900/40'
                      : 'border-emerald-800/40 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/40'
                  }`}
                >
                  {c.status === 'Whitelisted' ? 'Flag as Rogue' : 'Authorize & Whitelist'}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Modal */}
        {isAddOpen && (
          <div className="border-t border-[var(--surface-border)] pt-3 mt-3 bg-[var(--surface-canvas)]">
            <form onSubmit={handleAddCalmer} className="space-y-2">
              <div className="font-bold text-[var(--text-primary)]">Register Authorized Municipal Calmer:</div>
              <input
                type="text"
                required
                placeholder="Road name / Landmark (e.g. Sector 16 Hospital Entry)"
                value={newRoad}
                onChange={(e) => setNewRoad(e.target.value)}
                className="w-full rounded border border-[var(--surface-border)] bg-[var(--surface-panel)] p-2 text-[var(--text-primary)] outline-none text-xs"
              />
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  step="0.0001"
                  placeholder="Latitude"
                  value={newLat}
                  onChange={(e) => setNewLat(Number(e.target.value))}
                  className="rounded border border-[var(--surface-border)] bg-[var(--surface-panel)] p-2 text-[var(--text-primary)] outline-none text-xs"
                />
                <input
                  type="number"
                  step="0.0001"
                  placeholder="Longitude"
                  value={newLng}
                  onChange={(e) => setNewLng(Number(e.target.value))}
                  className="rounded border border-[var(--surface-border)] bg-[var(--surface-panel)] p-2 text-[var(--text-primary)] outline-none text-xs"
                />
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="rounded border border-[var(--surface-border)] bg-[var(--surface-panel)] p-2 text-[var(--text-primary)] outline-none text-xs"
                >
                  <option value="Asphalt Parabolic Hump">Asphalt Parabolic</option>
                  <option value="Tabletop Pedestrian Crossing">Tabletop Crossing</option>
                  <option value="Modular Rubber Speed Calmer">Modular Rubber</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <Button variant="secondary" size="sm" onClick={() => setIsAddOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit" className="bg-[#2563eb] text-[var(--text-primary)] hover:bg-[var(--surface-subtle)]">
                  Save to GIS Whitelist
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
