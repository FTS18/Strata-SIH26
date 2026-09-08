'use client';

import React, { useState } from 'react';
import {
  FileText,
  ShieldAlert,
  Download,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Search,
  Check,
  XCircle,
  Gavel,
  X,
  CreditCard,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import { exportEChallanDossier } from '@/lib/pdfExporter';
import { usePoliceStore, type EChallanRecord } from '../../stores/policeStore';

export function EChallanView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isRevokeModalOpen, setIsRevokeModalOpen] = useState(false);
  const [revokeReason, setRevokeReason] = useState('');

  // New Challan Form State
  const [newPlate, setNewPlate] = useState('');
  const [newType, setNewType] = useState('Private SUV / Sedan');
  const [newViolation, setNewViolation] = useState('Corridor Over-Speeding (>20 km/h over limit)');
  const [newFine, setNewFine] = useState(2000);
  const [newSpeed, setNewSpeed] = useState(72);
  const [newLimit, setNewLimit] = useState(50);
  const [newLocation, setNewLocation] = useState('Madhya Marg (Sector 26)');
  const [newBus, setNewBus] = useState('Bus 102 (DL-1PC-9210)');

  const challans = usePoliceStore((s) => s.challans);
  const selectedChallanId = usePoliceStore((s) => s.selectedChallanId);
  const setSelectedChallanId = usePoliceStore((s) => s.setSelectedChallanId);
  const issueChallan = usePoliceStore((s) => s.issueChallan);
  const updateChallanStatus = usePoliceStore((s) => s.updateChallanStatus);
  const revokeChallan = usePoliceStore((s) => s.revokeChallan);
  const activeToast = usePoliceStore((s) => s.activeToast);

  const filteredChallans = challans.filter((c) => {
    if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.plate.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q) ||
      c.violationType.toLowerCase().includes(q) ||
      c.location.toLowerCase().includes(q)
    );
  });

  const activeChallan = challans.find((c) => c.id === selectedChallanId) || filteredChallans[0] || challans[0];

  const handleCreateChallan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlate.trim()) return;

    issueChallan({
      plate: newPlate.toUpperCase().trim(),
      vehicleType: newType,
      violationType: newViolation,
      fineAmount: Number(newFine),
      speedObservedKmH: Number(newSpeed),
      speedLimitKmH: Number(newLimit),
      location: newLocation,
      coords: { lat: 30.7333, lng: 76.7794 },
      reportingBusId: newBus,
      ocrConfidence: 0.984,
      status: 'UNPAID',
    });

    setNewPlate('');
    setIsNewModalOpen(false);
  };

  const handleConfirmRevoke = () => {
    if (!activeChallan || !revokeReason.trim()) return;
    revokeChallan(activeChallan.id, revokeReason.trim());
    setRevokeReason('');
    setIsRevokeModalOpen(false);
  };

  const handleExportPdf = () => {
    if (!activeChallan) return;
    exportEChallanDossier({
      challanNumber: activeChallan.id,
      plateNumber: activeChallan.plate,
      violationType: activeChallan.violationType,
      fineAmount: activeChallan.fineAmount,
      location: activeChallan.location,
      timestamp: new Date(activeChallan.timestamp).toLocaleString('en-IN'),
      reportingBusId: activeChallan.reportingBusId,
      ocrConfidence: activeChallan.ocrConfidence,
      vehicleSpeed: activeChallan.speedObservedKmH,
      speedLimit: activeChallan.speedLimitKmH,
    });
  };

  return (
    <div className="flex h-full w-full flex-col gap-3 sm:gap-4 overflow-y-auto p-3 sm:p-5 bg-[var(--surface-canvas)] text-[var(--text-primary)]">
      {/* Toast Notification Banner */}
      {activeToast && (
        <div className="flex items-center justify-between rounded-lg border border-[var(--color-accent-primary)] bg-[var(--surface-subtle)] px-4 py-2 font-mono text-xs text-[var(--text-primary)] shadow-md animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-[var(--text-secondary)]" />
            <span>{activeToast}</span>
          </div>
        </div>
      )}

      {/* Top Header & Search Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--surface-border)] pb-3 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--surface-subtle)] border border-[var(--color-accent-primary)] text-[var(--text-secondary)] shrink-0">
            <FileText className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">
              Automated E-Challan & Digital Violation Evidence Dossier
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              Cryptographic OCR + Telemetry capture under Motor Vehicles Amendment Act 2019
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsNewModalOpen(true)}
            className="bg-[#2563eb] text-[var(--text-primary)] border-[var(--surface-border)] hover:bg-[var(--surface-subtle)] text-xs font-bold"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Issue Manual Challan</span>
          </Button>
          <span className="rounded border border-[var(--surface-border)] bg-[var(--surface-panel)] px-3 py-1 text-xs font-mono text-[var(--text-secondary)]">
            MoRTH Ready
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 shrink-0">
        <div className="flex flex-1 items-center gap-2 rounded-lg border border-[var(--surface-border)] bg-[var(--surface-panel)] px-3.5 py-1.5">
          <Search className="h-4 w-4 text-[var(--text-secondary)] shrink-0" />
          <input
            type="text"
            placeholder="Search Challan (Plate number, Challan ID, violation)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs font-mono text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
          />
        </div>

        <div className="flex items-center gap-1 rounded-lg border border-[var(--surface-border)] bg-[var(--surface-panel)] p-1 text-[11px] font-mono">
          {['ALL', 'UNPAID', 'PAID', 'COURT_ESCALATED', 'REVOKED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`rounded px-2.5 py-1 transition-all cursor-pointer ${
                statusFilter === st ? 'bg-[var(--surface-subtle)] text-[var(--text-primary)] font-bold' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Master-Detail Layout */}
      <div className="grid flex-1 grid-cols-1 lg:grid-cols-12 gap-4 overflow-y-auto">
        {/* Left Column: Challan List Selector (5 Cols) */}
        <div className="col-span-1 lg:col-span-5 flex flex-col rounded-xl border border-[var(--surface-border)] bg-[var(--surface-panel)] overflow-hidden">
          <div className="border-b border-[var(--surface-border)] bg-[var(--surface-canvas)] px-3.5 py-2 flex justify-between items-center text-xs font-mono">
            <span className="text-[var(--text-secondary)] font-semibold">REGISTERED CITATIONS</span>
            <span className="text-emerald-400 font-bold">{filteredChallans.length} Records</span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-[#111c33]/50">
            {filteredChallans.map((c) => {
              const isSelected = c.id === activeChallan?.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedChallanId(c.id)}
                  className={`w-full text-left p-3 transition-colors cursor-pointer flex flex-col gap-1 ${
                    isSelected ? 'bg-[var(--surface-subtle)]/60 border-l-4 border-l-emerald-400' : 'hover:bg-[#06191c]/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[var(--text-primary)]">{c.plate}</span>
                    <span
                      className={`rounded px-1.5 py-0.2 text-[9px] font-mono font-bold border ${
                        c.status === 'PAID'
                          ? 'border-emerald-800/50 bg-emerald-950/50 text-emerald-300'
                          : c.status === 'COURT_ESCALATED'
                          ? 'border-rose-800/50 bg-rose-950/50 text-rose-300'
                          : c.status === 'REVOKED'
                          ? 'border-neutral-700 bg-neutral-900 text-neutral-400'
                          : 'border-amber-800/50 bg-amber-950/50 text-amber-300'
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--text-secondary)] line-clamp-1">{c.violationType}</p>
                  <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)]">
                    <span>{c.id}</span>
                    <span className="text-[var(--text-primary)] font-bold">{formatCurrency(c.fineAmount)}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Evidence & Action Panel (7 Cols) */}
        {activeChallan && (
          <div className="col-span-1 lg:col-span-7 flex flex-col gap-3 rounded-xl border border-[var(--surface-border)] bg-[var(--surface-panel)] p-4 sm:p-5 overflow-y-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--surface-border)] pb-3">
              <div>
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                  Citation Notice: {activeChallan.id}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] font-mono">{activeChallan.violationType}</p>
              </div>

              <span
                className={`self-start sm:self-auto rounded border px-2.5 py-1 text-xs font-mono font-bold ${
                  activeChallan.status === 'PAID'
                    ? 'border-emerald-700/50 bg-emerald-950/50 text-emerald-400'
                    : activeChallan.status === 'COURT_ESCALATED'
                    ? 'border-rose-700/50 bg-rose-950/50 text-rose-400'
                    : activeChallan.status === 'REVOKED'
                    ? 'border-neutral-700 bg-neutral-900 text-neutral-400'
                    : 'border-amber-700/50 bg-amber-950/50 text-amber-400'
                }`}
              >
                {activeChallan.status}
              </span>
            </div>

            {/* Evidence Crop Visualizer */}
            <div className="rounded-lg border border-[var(--surface-border)] bg-[#06191c] p-3 font-mono text-xs">
              <div className="flex justify-between items-center text-[10px] text-[var(--text-secondary)] border-b border-[var(--surface-border-subtle)] pb-1 mb-2">
                <span>OCR CONFIDENCE: {(activeChallan.ocrConfidence * 100).toFixed(1)}%</span>
                <span className="text-rose-400 font-bold">
                  SPEED: {activeChallan.speedObservedKmH} km/h (Limit: {activeChallan.speedLimitKmH} km/h)
                </span>
              </div>
              <div className="flex flex-col items-center justify-center py-3">
                <div className="rounded border-2 border-rose-500/80 bg-[var(--surface-canvas)] px-5 py-2.5 text-center shadow-lg">
                  <span className="text-xl font-bold text-[var(--text-primary)] tracking-widest">
                    {activeChallan.plate}
                  </span>
                  <p className="text-[9px] text-[var(--text-secondary)] mt-0.5">HSRP SECURITY THREAD CONFIRMED</p>
                </div>
              </div>
              <div className="flex justify-between text-[10px] text-[var(--text-muted)] border-t border-[var(--surface-border-subtle)] pt-1">
                <span>Witness: {activeChallan.reportingBusId}</span>
                <span>Location: {activeChallan.location}</span>
              </div>
            </div>

            {/* Citation Details Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="rounded-lg border border-[var(--surface-border)] bg-[var(--surface-canvas)] p-3 space-y-1">
                <span className="text-[var(--text-secondary)]">Statutory Penalty Amount:</span>
                <p className="text-base font-bold text-rose-400">
                  {formatCurrency(activeChallan.fineAmount)}
                </p>
                <p className="text-[10px] text-[var(--text-muted)]">MoRTH Scheduled Fine</p>
              </div>

              <div className="rounded-lg border border-[var(--surface-border)] bg-[var(--surface-canvas)] p-3 space-y-1">
                <span className="text-[var(--text-secondary)]">Vehicle Specs:</span>
                <p className="text-xs font-bold text-[var(--text-primary)]">{activeChallan.vehicleType}</p>
                <p className="text-[10px] text-[var(--text-muted)]">Registered Owner: {activeChallan.ownerName || 'State Transport Authority'}</p>
              </div>
            </div>

            {activeChallan.revocationReason && (
              <div className="rounded-lg border border-neutral-700 bg-neutral-900/60 p-3 text-xs font-mono text-neutral-300">
                <span className="font-bold text-neutral-400">Judicial Revocation Reason:</span>
                <p className="mt-0.5">{activeChallan.revocationReason}</p>
              </div>
            )}

            {activeChallan.paymentReceiptId && (
              <div className="rounded-lg border border-emerald-800/40 bg-emerald-950/30 p-3 text-xs font-mono text-emerald-300">
                <span className="font-bold">Payment Transaction Reference:</span>
                <p className="mt-0.5">{activeChallan.paymentReceiptId}</p>
              </div>
            )}

            {/* Action Buttons Bar */}
            <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-[var(--surface-border)] mt-auto">
              {activeChallan.status !== 'PAID' && activeChallan.status !== 'REVOKED' && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() =>
                    updateChallanStatus(activeChallan.id, 'PAID', {
                      receiptId: `PAY-SBI-${Math.floor(1000000 + Math.random() * 9000000)}`,
                    })
                  }
                  className="bg-[#2563eb] text-[var(--text-primary)] hover:bg-[var(--surface-subtle)] text-xs font-bold"
                >
                  <CreditCard className="h-3.5 w-3.5" />
                  <span>Mark as Paid</span>
                </Button>
              )}

              {activeChallan.status === 'UNPAID' && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => updateChallanStatus(activeChallan.id, 'COURT_ESCALATED')}
                  className="text-xs font-bold"
                >
                  <Gavel className="h-3.5 w-3.5" />
                  <span>Escalate to Virtual Court</span>
                </Button>
              )}

              <Button
                variant="secondary"
                size="sm"
                onClick={handleExportPdf}
                className="bg-[var(--surface-subtle)] text-[var(--text-primary)] border-[var(--color-accent-primary)] hover:bg-[#2563eb] text-xs"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export Evidence PDF</span>
              </Button>

              {activeChallan.status !== 'REVOKED' && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsRevokeModalOpen(true)}
                  className="border-neutral-700 bg-neutral-900 text-neutral-300 hover:bg-neutral-800 text-xs ml-auto"
                >
                  <XCircle className="h-3.5 w-3.5" />
                  <span>Revoke Citation</span>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Manual E-Challan Issue Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl border border-[var(--surface-border)] bg-[var(--surface-canvas)] p-5 shadow-2xl font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[var(--surface-border)] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-[var(--text-secondary)]" />
                <span className="font-bold text-[var(--text-primary)] text-sm">Issue Manual Digital E-Challan</span>
              </div>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateChallan} className="space-y-3">
              <div>
                <label className="block text-[11px] text-[var(--text-secondary)] mb-1">License Plate Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DL 03 CB 9142"
                  value={newPlate}
                  onChange={(e) => setNewPlate(e.target.value)}
                  className="w-full rounded border border-[var(--surface-border)] bg-[var(--surface-panel)] px-3 py-2 text-[var(--text-primary)] outline-none uppercase font-bold text-sm tracking-wider"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-[var(--text-secondary)] mb-1">Vehicle Classification</label>
                  <input
                    type="text"
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full rounded border border-[var(--surface-border)] bg-[var(--surface-panel)] px-3 py-2 text-[var(--text-primary)] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[var(--text-secondary)] mb-1">Fine Amount (INR) *</label>
                  <input
                    type="number"
                    required
                    value={newFine}
                    onChange={(e) => setNewFine(Number(e.target.value))}
                    className="w-full rounded border border-[var(--surface-border)] bg-[var(--surface-panel)] px-3 py-2 text-[var(--text-primary)] outline-none font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-[var(--text-secondary)] mb-1">Specific Motor Vehicle Infraction *</label>
                <select
                  value={newViolation}
                  onChange={(e) => setNewViolation(e.target.value)}
                  className="w-full rounded border border-[var(--surface-border)] bg-[var(--surface-panel)] px-3 py-2 text-[var(--text-primary)] outline-none text-xs"
                >
                  <option value="Corridor Over-Speeding (>20 km/h over limit)">Corridor Over-Speeding (Sec 183)</option>
                  <option value="Dedicated Bus Rapid Transit (BRT) Lane Intrusion">BRT Dedicated Lane Intrusion (Sec 177)</option>
                  <option value="Dangerous Overtaking at Pedestrian Zebra Crossing">Zebra Crossing Dangerous Driving (Sec 184)</option>
                  <option value="High-Security Zone Speeding & Lane Violation">High-Security Perimeter Violation</option>
                  <option value="Non-Standard / Obscured License Plate">HSRP Plate Obscuration (Sec 39)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-[var(--text-secondary)] mb-1">Observed Speed (km/h)</label>
                  <input
                    type="number"
                    value={newSpeed}
                    onChange={(e) => setNewSpeed(Number(e.target.value))}
                    className="w-full rounded border border-[var(--surface-border)] bg-[var(--surface-panel)] px-3 py-2 text-[var(--text-primary)] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[var(--text-secondary)] mb-1">Corridor Speed Limit (km/h)</label>
                  <input
                    type="number"
                    value={newLimit}
                    onChange={(e) => setNewLimit(Number(e.target.value))}
                    className="w-full rounded border border-[var(--surface-border)] bg-[var(--surface-panel)] px-3 py-2 text-[var(--text-primary)] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-[var(--text-secondary)] mb-1">Corridor Location</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full rounded border border-[var(--surface-border)] bg-[var(--surface-panel)] px-3 py-2 text-[var(--text-primary)] outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--surface-border)] mt-4">
                <Button type="button" variant="secondary" size="sm" onClick={() => setIsNewModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" className="bg-[#2563eb] text-[var(--text-primary)] hover:bg-[var(--surface-subtle)]">
                  Issue and Transmit to MoRTH
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Revocation Confirmation Modal */}
      {isRevokeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-neutral-700 bg-[var(--surface-canvas)] p-5 shadow-2xl font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[var(--surface-border)] pb-3 mb-3">
              <span className="font-bold text-rose-400 text-sm">Official Judicial Citation Revocation</span>
              <button onClick={() => setIsRevokeModalOpen(false)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-[var(--text-secondary)] mb-3">
              Provide mandatory legal rationale for cancelling citation {activeChallan?.id}:
            </p>

            <textarea
              rows={3}
              required
              placeholder="e.g. Verified emergency ambulance escort / Optical character misread by OCR"
              value={revokeReason}
              onChange={(e) => setRevokeReason(e.target.value)}
              className="w-full rounded border border-[var(--surface-border)] bg-[var(--surface-panel)] p-2 text-[var(--text-primary)] outline-none text-xs"
            />

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--surface-border)] mt-3">
              <Button type="button" variant="secondary" size="sm" onClick={() => setIsRevokeModalOpen(false)}>
                Cancel
              </Button>
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={handleConfirmRevoke}
                disabled={!revokeReason.trim()}
              >
                Confirm Revocation
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
