'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  Search,
  Plus,
  Radio,
  FileText,
  CheckCircle2,
  Trash2,
  X,
  Clock,
  Car,
} from 'lucide-react';
import { calculateLevenshteinDistance } from '@/lib/geoAlgorithms';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { usePoliceStore, type WarrantVehicle } from '../../stores/policeStore';

export function WarrantHotlistView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New vehicle form state
  const [newPlate, setNewPlate] = useState('');
  const [newModel, setNewModel] = useState('');
  const [newReason, setNewReason] = useState('');
  const [newFir, setNewFir] = useState('');
  const [newPs, setNewPs] = useState('Sector 17 PS (Chandigarh)');
  const [newPriority, setNewPriority] = useState<'Critical' | 'High' | 'Medium'>('Critical');
  const [newStatus, setNewStatus] = useState<WarrantVehicle['status']>('Active Warrant');

  const warrants = usePoliceStore((s) => s.warrants);
  const selectedWarrantId = usePoliceStore((s) => s.selectedWarrantId);
  const setSelectedWarrantId = usePoliceStore((s) => s.setSelectedWarrantId);
  const addWarrant = usePoliceStore((s) => s.addWarrant);
  const updateWarrant = usePoliceStore((s) => s.updateWarrant);
  const deleteWarrant = usePoliceStore((s) => s.deleteWarrant);
  const dispatchPcrToWarrant = usePoliceStore((s) => s.dispatchPcrToWarrant);
  const issueChallan = usePoliceStore((s) => s.issueChallan);
  const activeToast = usePoliceStore((s) => s.activeToast);

  const filtered = warrants.filter((w) => {
    if (statusFilter !== 'ALL' && w.status !== statusFilter) return false;
    if (!searchQuery.trim()) return true;
    const dist = calculateLevenshteinDistance(searchQuery, w.plate);
    return (
      dist <= 3 ||
      w.plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.vehicleModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.caseFir.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const activeVehicle = warrants.find((w) => w.id === selectedWarrantId) || filtered[0] || warrants[0];

  const handleCreateWarrant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlate.trim() || !newReason.trim()) return;

    addWarrant({
      plate: newPlate.toUpperCase().trim(),
      vehicleModel: newModel.trim() || 'Unspecified Vehicle',
      warrantReason: newReason.trim(),
      caseFir: newFir.trim() || `FIR #${Math.floor(100 + Math.random() * 900)}/2026`,
      policeStation: newPs,
      lastSightedByBus: 'Awaiting Transit Optical Sighting',
      status: newStatus,
      priority: newPriority,
    });

    setNewPlate('');
    setNewModel('');
    setNewReason('');
    setNewFir('');
    setIsAddModalOpen(false);
  };

  const handleTransmitChallan = () => {
    if (!activeVehicle) return;
    issueChallan({
      plate: activeVehicle.plate,
      vehicleType: activeVehicle.vehicleModel,
      violationType: activeVehicle.warrantReason,
      fineAmount: activeVehicle.priority === 'Critical' ? 5000 : 2500,
      speedObservedKmH: 68.0,
      speedLimitKmH: 50,
      location: activeVehicle.policeStation,
      coords: { lat: 30.7333, lng: 76.7794 },
      reportingBusId: activeVehicle.lastSightedByBus.includes('Bus') ? activeVehicle.lastSightedByBus : 'Bus 102 (DL-1PC-9210)',
      ocrConfidence: 0.982,
      status: 'UNPAID',
    });
  };

  const columns: Column<WarrantVehicle>[] = [
    {
      key: 'plate',
      header: 'Vehicle Plate',
      render: (w) => (
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-xs font-bold text-[#f0fdf4]">{w.plate}</span>
          {w.priority === 'Critical' && (
            <span className="rounded bg-rose-950/60 px-1 py-0.2 text-[9px] font-mono text-rose-400 border border-rose-800/40">
              P1
            </span>
          )}
        </div>
      ),
    },
    { key: 'vehicleModel', header: 'Vehicle Specs' },
    { key: 'warrantReason', header: 'Warrant / Offense' },
    {
      key: 'caseFir',
      header: 'FIR / Case No',
      render: (w) => <span className="font-mono text-xs text-[#8BBB92]">{w.caseFir}</span>,
    },
    {
      key: 'lastSightedByBus',
      header: 'Last Edge Sighting',
      render: (w) => <span className="font-mono text-xs text-[#8BBB92]">{w.lastSightedByBus}</span>,
    },
    {
      key: 'status',
      header: 'Warrant Status',
      align: 'center',
      render: (w) => (
        <span
          className={`inline-flex items-center rounded border px-2 py-0.5 text-[10px] font-mono font-bold ${
            w.status === 'Impound Immediate'
              ? 'border-rose-800/40 bg-rose-950/40 text-rose-400'
              : w.status === 'Active Warrant'
              ? 'border-amber-800/40 bg-amber-950/40 text-amber-400'
              : w.status === 'Recovered / Closed'
              ? 'border-emerald-800/40 bg-emerald-950/40 text-emerald-400'
              : 'border-[#12544F] bg-[#0d3137] text-[#8BBB92]'
          }`}
        >
          {w.status}
        </span>
      ),
    },
  ];

  return (
    <div className="flex h-full w-full flex-col gap-3 sm:gap-4 overflow-y-auto p-3 sm:p-5 bg-[#092328] text-[#f0fdf4]">
      {/* Toast Notification Banner */}
      {activeToast && (
        <div className="flex items-center justify-between rounded-lg border border-[#2A835F] bg-[#12544F] px-4 py-2 font-mono text-xs text-[#f0fdf4] shadow-md animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-[#8BBB92]" />
            <span>{activeToast}</span>
          </div>
        </div>
      )}

      {/* Top Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-4 border-b border-[#12544F] pb-3 shrink-0">
        <div className="flex flex-1 items-center gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-[#12544F] bg-[#0d3137] px-3.5 py-2">
            <Search className="h-4 w-4 text-[#8BBB92] shrink-0" />
            <input
              type="text"
              placeholder="Search Police Hotlist (Fuzzy ANPR: plate, model, FIR)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-xs font-mono text-[#f0fdf4] outline-none placeholder:text-[#5b9076]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-[#8BBB92] hover:text-[#f0fdf4] shrink-0 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Status Filter Pill Bar */}
          <div className="hidden md:flex items-center gap-1 rounded-lg border border-[#12544F] bg-[#0d3137] p-1 text-[11px] font-mono">
            {['ALL', 'Impound Immediate', 'Active Warrant', 'Under Surveillance'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`rounded px-2 py-1 transition-all cursor-pointer ${
                  statusFilter === st ? 'bg-[#12544F] text-[#f0fdf4] font-bold' : 'text-[#8BBB92] hover:text-[#f0fdf4]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#2A835F] text-[#f0fdf4] border-[#12544F] hover:bg-[#12544F] text-xs font-bold"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Flag Wanted Vehicle</span>
          </Button>

          <span className="rounded border border-rose-800/40 bg-rose-950/40 px-3 py-1.5 text-xs font-mono font-bold text-rose-400 shrink-0">
            {warrants.length} Intercept Orders Active
          </span>
        </div>
      </div>

      {/* Main Full-Width Content: Table + Interactive Telemetry Strip */}
      <div className="flex flex-1 flex-col gap-4">
        {/* Main Table Card */}
        <div className="w-full rounded-xl border border-[#12544F] bg-[#0d3137] p-3 sm:p-4 shadow-sm">
          <div className="mb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
            <div>
              <h3 className="text-sm font-semibold text-[#f0fdf4]">
                National Police Hotlist & Real-Time Fleet Radar Matcher
              </h3>
              <p className="text-xs text-[#8BBB92]">
                Fuzzy Levenshtein matching tolerating optical motion blur, dust, and non-standard number plates
              </p>
            </div>
            <span className="self-start sm:self-auto rounded border border-[#12544F] bg-[#12544F]/50 px-2.5 py-1 text-xs font-mono text-[#8BBB92]">
              CCTNS Police Integration Active
            </span>
          </div>

          <div className="w-full overflow-x-auto">
            <DataTable<WarrantVehicle>
              columns={columns}
              data={filtered}
              keyExtractor={(w) => w.id}
              onRowClick={(item) => setSelectedWarrantId(item.id)}
            />
          </div>
        </div>

        {/* Selected Vehicle Intercept Action Strip */}
        {activeVehicle && (
          <div className="w-full rounded-xl border border-[#1d6d63] bg-[#0d3137] p-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-950/60 border border-rose-700/50 text-rose-400 shrink-0">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-bold text-[#f0fdf4]">
                    {activeVehicle.plate}
                  </span>
                  <span className="text-xs text-[#8BBB92]">· {activeVehicle.vehicleModel}</span>
                  <span
                    className={`rounded border px-2 py-0.5 text-[10px] font-mono font-bold ${
                      activeVehicle.status === 'Impound Immediate'
                        ? 'border-rose-800/40 bg-rose-950/40 text-rose-400'
                        : 'border-amber-800/40 bg-amber-950/40 text-amber-400'
                    }`}
                  >
                    {activeVehicle.status}
                  </span>
                </div>
                <p className="text-xs text-[#8BBB92]">
                  Offense: <span className="text-[#f0fdf4] font-medium">{activeVehicle.warrantReason}</span> ({activeVehicle.caseFir} · {activeVehicle.policeStation})
                </p>
                <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-[#5b9076]">
                  <span>Last Verified Sighting: {activeVehicle.lastSightedByBus}</span>
                  {activeVehicle.dispatchedUnit && (
                    <span className="rounded bg-rose-950/80 px-2 py-0.5 border border-rose-500/50 text-rose-300 font-bold flex items-center gap-1">
                      <Radio className="h-3 w-3 animate-pulse" />
                      {activeVehicle.dispatchedUnit.callSign} (ETA {activeVehicle.dispatchedUnit.etaMins}m · {activeVehicle.dispatchedUnit.officerName})
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons & Status Controls */}
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto pt-2 lg:pt-0">
              {/* Status Selector */}
              <div className="flex items-center gap-1 rounded bg-[#092328] p-1 border border-[#12544F]">
                <button
                  onClick={() => updateWarrant(activeVehicle.id, { status: 'Impound Immediate' })}
                  className={`px-2 py-1 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                    activeVehicle.status === 'Impound Immediate'
                      ? 'bg-rose-900/60 text-rose-200 border border-rose-700/50'
                      : 'text-[#8BBB92] hover:text-[#f0fdf4]'
                  }`}
                >
                  Impound
                </button>
                <button
                  onClick={() => updateWarrant(activeVehicle.id, { status: 'Active Warrant' })}
                  className={`px-2 py-1 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                    activeVehicle.status === 'Active Warrant'
                      ? 'bg-amber-900/60 text-amber-200 border border-amber-700/50'
                      : 'text-[#8BBB92] hover:text-[#f0fdf4]'
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => updateWarrant(activeVehicle.id, { status: 'Under Surveillance' })}
                  className={`px-2 py-1 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                    activeVehicle.status === 'Under Surveillance'
                      ? 'bg-[#12544F] text-[#f0fdf4]'
                      : 'text-[#8BBB92] hover:text-[#f0fdf4]'
                  }`}
                >
                  Watch
                </button>
              </div>

              <Button
                variant="danger"
                size="sm"
                onClick={() => dispatchPcrToWarrant(activeVehicle.id)}
                className="text-xs"
              >
                <Radio className="h-3.5 w-3.5" />
                <span>{activeVehicle.dispatchedUnit ? 'Re-Route PCR Unit' : 'Dispatch Intercept Patrol'}</span>
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={handleTransmitChallan}
                className="bg-[#12544F] text-[#f0fdf4] border-[#2A835F] hover:bg-[#2A835F] text-xs"
              >
                <FileText className="h-3.5 w-3.5" />
                <span>Transmit E-Challan</span>
              </Button>

              <button
                onClick={() => deleteWarrant(activeVehicle.id)}
                title="Mark Recovered & Archive Warrant"
                className="p-1.5 rounded border border-rose-900/50 bg-rose-950/30 text-rose-400 hover:bg-rose-900/50 hover:text-rose-200 transition-colors cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add New Wanted Vehicle Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl border border-[#12544F] bg-[#092328] p-5 shadow-2xl font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[#12544F] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-rose-400" />
                <span className="font-bold text-[#f0fdf4] text-sm">
                  Flag New Wanted Vehicle for Autonomous ANPR Radar
                </span>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-[#8BBB92] hover:text-[#f0fdf4] cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateWarrant} className="space-y-3">
              <div>
                <label className="block text-[11px] text-[#8BBB92] mb-1">
                  License Plate Number (HSRP Standard) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DL 01 AB 9988"
                  value={newPlate}
                  onChange={(e) => setNewPlate(e.target.value)}
                  className="w-full rounded border border-[#12544F] bg-[#0d3137] px-3 py-2 text-[#f0fdf4] outline-none uppercase font-bold text-sm tracking-wider"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-[#8BBB92] mb-1">Vehicle Make & Model</label>
                  <input
                    type="text"
                    placeholder="e.g. Mahindra Thar (Black)"
                    value={newModel}
                    onChange={(e) => setNewModel(e.target.value)}
                    className="w-full rounded border border-[#12544F] bg-[#0d3137] px-3 py-2 text-[#f0fdf4] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#8BBB92] mb-1">Case / FIR Number</label>
                  <input
                    type="text"
                    placeholder="e.g. FIR #502/2026"
                    value={newFir}
                    onChange={(e) => setNewFir(e.target.value)}
                    className="w-full rounded border border-[#12544F] bg-[#0d3137] px-3 py-2 text-[#f0fdf4] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-[#8BBB92] mb-1">Warrant Offense & Reason *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hit & Run Fatality on Dakshin Marg"
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  className="w-full rounded border border-[#12544F] bg-[#0d3137] px-3 py-2 text-[#f0fdf4] outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-[#8BBB92] mb-1">Police Station</label>
                  <select
                    value={newPs}
                    onChange={(e) => setNewPs(e.target.value)}
                    className="w-full rounded border border-[#12544F] bg-[#0d3137] px-2 py-2 text-[#f0fdf4] outline-none text-xs"
                  >
                    <option value="Sector 17 PS (Chandigarh)">Sector 17 PS</option>
                    <option value="Sector 34 PS (Chandigarh)">Sector 34 PS</option>
                    <option value="Sector 26 PS (Chandigarh)">Sector 26 PS</option>
                    <option value="Parliament Street PS (Delhi)">Parliament St PS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-[#8BBB92] mb-1">Intercept Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full rounded border border-[#12544F] bg-[#0d3137] px-2 py-2 text-[#f0fdf4] outline-none text-xs"
                  >
                    <option value="Critical">Critical (P1)</option>
                    <option value="High">High (P2)</option>
                    <option value="Medium">Medium (P3)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-[#8BBB92] mb-1">Initial Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as any)}
                    className="w-full rounded border border-[#12544F] bg-[#0d3137] px-2 py-2 text-[#f0fdf4] outline-none text-xs"
                  >
                    <option value="Active Warrant">Active Warrant</option>
                    <option value="Impound Immediate">Impound Immediate</option>
                    <option value="Under Surveillance">Under Surveillance</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#12544F] mt-4">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  className="bg-[#2A835F] text-[#f0fdf4] hover:bg-[#12544F]"
                >
                  Broadcast Intercept Order
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
