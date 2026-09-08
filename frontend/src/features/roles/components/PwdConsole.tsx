'use client';

import React, { useState } from 'react';
import {
  ArrowRight,
  Plus,
  Search,
  CheckCircle2,
  Trash2,
  X,
  UserCheck,
  Wrench,
  Clock,
  Layers,
} from 'lucide-react';
import { useWorkOrderStore } from '@/features/roles/stores/workOrderStore';
import { type WorkOrderStatus, type DefectSeverity } from '@/types';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatEnumLabel } from '@/lib/utils';

export function PwdConsole() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [assigningTicketId, setAssigningTicketId] = useState<string | null>(null);
  const [selectedContractor, setSelectedContractor] = useState('Shree Balaji Infra Works Ltd');

  // Form state
  const [newTitle, setNewTitle] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newSeverity, setNewSeverity] = useState<DefectSeverity>('critical');
  const [newAsphaltTons, setNewAsphaltTons] = useState(2.5);
  const [newCost, setNewCost] = useState(14000);

  const tickets = useWorkOrderStore((state) => state.tickets);
  const updateTicketStatus = useWorkOrderStore((state) => state.updateTicketStatus);
  const createCustomTicket = useWorkOrderStore((state) => state.createCustomTicket);
  const assignTicket = useWorkOrderStore((state) => state.assignTicket);
  const deleteTicket = useWorkOrderStore((state) => state.deleteTicket);
  const activeToast = useWorkOrderStore((state) => state.activeToast);

  const columns: { id: WorkOrderStatus; title: string; count: number }[] = [
    { id: 'detected', title: 'AI Detected', count: tickets.filter((t) => t.status === 'detected').length },
    { id: 'assigned', title: 'Assigned', count: tickets.filter((t) => t.status === 'assigned').length },
    { id: 'in_progress', title: 'In Progress', count: tickets.filter((t) => t.status === 'in_progress').length },
    { id: 'verified_closed', title: 'AI Verified & Closed', count: tickets.filter((t) => t.status === 'verified_closed').length },
  ];

  const filteredTickets = tickets.filter((t) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.id.toLowerCase().includes(q) ||
      t.title.toLowerCase().includes(q) ||
      t.locationName.toLowerCase().includes(q) ||
      (t.assignedContractor && t.assignedContractor.toLowerCase().includes(q))
    );
  });

  const handleAdvanceStatus = (ticketId: string, currentStatus: WorkOrderStatus) => {
    if (currentStatus === 'detected') {
      setAssigningTicketId(ticketId);
    } else if (currentStatus === 'assigned') {
      updateTicketStatus(ticketId, 'in_progress');
    } else if (currentStatus === 'in_progress') {
      updateTicketStatus(ticketId, 'verified_closed');
    }
  };

  const handleConfirmAssign = () => {
    if (!assigningTicketId) return;
    assignTicket(assigningTicketId, selectedContractor);
    setAssigningTicketId(null);
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newLocation.trim()) return;

    createCustomTicket({
      defectId: `DEF-${Math.floor(10000 + Math.random() * 90000)}`,
      title: newTitle.trim(),
      locationName: newLocation.trim(),
      coords: { lat: 30.7333, lng: 76.7794 },
      severity: newSeverity,
      status: 'detected',
      estimatedAsphaltTons: Number(newAsphaltTons),
      estimatedCostInr: Number(newCost),
      deadlineAt: Date.now() + 3600000 * 48,
    });

    setNewTitle('');
    setNewLocation('');
    setIsCreateModalOpen(false);
  };

  return (
    <div className="flex h-full flex-col gap-3 overflow-hidden p-4 bg-[var(--surface-canvas)] text-[var(--text-primary)]">
      {/* Toast Notification Banner */}
      {activeToast && (
        <div className="flex items-center justify-between rounded-lg border border-[var(--color-accent-primary)] bg-[var(--surface-subtle)] px-4 py-2 font-mono text-xs text-[var(--text-primary)] shadow-md animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-[var(--text-secondary)]" />
            <span>{activeToast}</span>
          </div>
        </div>
      )}

      {/* Top Header Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--surface-border)] pb-3 shrink-0">
        <div>
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">
            PWD Automated Maintenance & Work Order Pipeline
          </h2>
          <p className="text-xs text-[var(--text-secondary)]">
            Closed-loop lifecycle: AI Detection to Contractor Tendering to Autonomous Bus Pass Verification
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-lg border border-[var(--surface-border)] bg-[var(--surface-panel)] px-3 py-1.5 text-xs font-mono">
            <Search className="h-3.5 w-3.5 text-[var(--text-secondary)]" />
            <input
              type="text"
              placeholder="Search work orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none text-[var(--text-primary)] placeholder:text-[var(--text-muted)] w-36 sm:w-48 text-xs"
            />
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-[#2563eb] text-[var(--text-primary)] hover:bg-[var(--surface-subtle)] text-xs font-bold"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Work Order</span>
          </Button>
        </div>
      </div>

      {/* Responsive Kanban Grid */}
      <div className="grid flex-1 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 overflow-y-auto">
        {columns.map((col) => {
          const colTickets = filteredTickets.filter((t) => t.status === col.id);
          return (
            <div
              key={col.id}
              className="flex flex-col rounded-lg border border-[var(--surface-border)] bg-[var(--surface-panel)] overflow-hidden min-h-[300px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between border-b border-[var(--surface-border)] bg-[var(--surface-canvas)] px-3.5 py-2.5">
                <span className="text-xs font-semibold text-[var(--text-primary)]">{col.title}</span>
                <span className="font-mono text-xs font-semibold text-[var(--text-secondary)]">{col.count}</span>
              </div>

              {/* Column Cards */}
              <div className="flex-1 overflow-y-auto p-2.5 space-y-2.5">
                {colTickets.length === 0 ? (
                  <div className="flex h-24 items-center justify-center text-xs text-[var(--text-muted)]">
                    No work orders in this stage
                  </div>
                ) : (
                  colTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="rounded-lg border border-[var(--surface-border)] bg-[var(--surface-subtle)]/40 p-3 shadow-sm space-y-2 select-none hover:border-[var(--color-accent-primary)] transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="font-mono text-[11px] text-[var(--text-secondary)]">
                            {ticket.id}
                          </span>
                          {ticket.dispatchReference && (
                            <span className="inline-flex items-center rounded border border-emerald-600/60 bg-emerald-950/60 px-1.5 py-0.2 text-[9px] font-mono text-emerald-300 font-bold truncate">
                              {ticket.dispatchReference}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`inline-flex items-center rounded border px-1.5 py-0.2 text-[10px] font-mono font-medium ${
                              ticket.severity === 'critical'
                                ? 'border-rose-800/40 bg-rose-950/40 text-rose-400'
                                : 'border-amber-800/40 bg-amber-950/40 text-amber-400'
                            }`}
                          >
                            {formatEnumLabel(ticket.severity)}
                          </span>
                          <button
                            onClick={() => deleteTicket(ticket.id)}
                            title="Delete / Archive Work Order"
                            className="text-[var(--text-muted)] hover:text-rose-400 p-0.5 cursor-pointer"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>

                      <h4 className="text-xs font-semibold text-[var(--text-primary)] line-clamp-1">
                        {ticket.title}
                      </h4>
                      <p className="text-[11px] text-[var(--text-secondary)] line-clamp-1">
                        {ticket.locationName}
                      </p>

                      <div className="rounded border border-[var(--surface-border)] bg-[var(--surface-panel)] p-2 text-[11px] font-mono space-y-1">
                        <div className="flex justify-between">
                          <span className="text-[var(--text-secondary)]">Asphalt:</span>
                          <span className="text-[var(--text-primary)]">{ticket.estimatedAsphaltTons} MT</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[var(--text-secondary)]">Budget:</span>
                          <span className="font-semibold text-[var(--text-secondary)]">
                            {formatCurrency(ticket.estimatedCostInr || 0)}
                          </span>
                        </div>
                        {ticket.assignedContractor && (
                          <div className="flex justify-between pt-1 border-t border-[var(--surface-border)]">
                            <span className="text-[var(--text-secondary)]">Contractor:</span>
                            <span className="font-sans text-[var(--text-primary)] truncate max-w-[130px]">
                              {ticket.assignedContractor}
                            </span>
                          </div>
                        )}
                        {ticket.verifiedByBusId && (
                          <div className="flex justify-between pt-1 border-t border-[var(--surface-border)] text-[var(--text-secondary)] font-semibold">
                            <span>Audited By:</span>
                            <span>{ticket.verifiedByBusId}</span>
                          </div>
                        )}
                      </div>

                      {ticket.status !== 'verified_closed' && (
                        <Button
                          variant="secondary"
                          size="sm"
                          className="w-full text-xs h-7 justify-between bg-[var(--surface-subtle)] text-[var(--text-primary)] border-[var(--color-accent-primary)] hover:bg-[#2563eb]"
                          onClick={() => handleAdvanceStatus(ticket.id, ticket.status)}
                        >
                          <span>
                            {ticket.status === 'detected' && 'Assign Contractor'}
                            {ticket.status === 'assigned' && 'Mark In Progress'}
                            {ticket.status === 'in_progress' && 'Verify via Bus IMU Pass'}
                          </span>
                          <ArrowRight className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Assign Contractor Modal */}
      {assigningTicketId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-[var(--surface-border)] bg-[var(--surface-canvas)] p-5 shadow-2xl font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[var(--surface-border)] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-[var(--text-secondary)]" />
                <span className="font-bold text-[var(--text-primary)] text-sm">
                  Assign Authorized Maintenance Contractor
                </span>
              </div>
              <button
                onClick={() => setAssigningTicketId(null)}
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-[var(--text-secondary)]">
                Select CPWD-empanelled contractor for Ticket {assigningTicketId}:
              </p>

              <select
                value={selectedContractor}
                onChange={(e) => setSelectedContractor(e.target.value)}
                className="w-full rounded border border-[var(--surface-border)] bg-[var(--surface-panel)] p-2 text-[var(--text-primary)] outline-none text-xs"
              >
                <option value="Shree Balaji Infra Works Ltd (Chandigarh)">Shree Balaji Infra Works Ltd</option>
                <option value="Apex Roadways Ltd">Apex Roadways Ltd</option>
                <option value="MCC Engineering Division 2">MCC Engineering Division 2</option>
                <option value="MCC Direct Works Department">MCC Direct Works Department</option>
              </select>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--surface-border)] mt-4">
                <Button variant="secondary" size="sm" onClick={() => setAssigningTicketId(null)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" onClick={handleConfirmAssign} className="bg-[#2563eb] text-[var(--text-primary)] hover:bg-[var(--surface-subtle)]">
                  Confirm Tender Assignment
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Work Order Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl border border-[var(--surface-border)] bg-[var(--surface-canvas)] p-5 shadow-2xl font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[var(--surface-border)] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Wrench className="h-4 w-4 text-[var(--text-secondary)]" />
                <span className="font-bold text-[var(--text-primary)] text-sm">Issue Custom PWD Work Order</span>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-3">
              <div>
                <label className="block text-[11px] text-[var(--text-secondary)] mb-1">Work Order Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Emergency Bitumen Pothole Patching"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full rounded border border-[var(--surface-border)] bg-[var(--surface-panel)] px-3 py-2 text-[var(--text-primary)] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] text-[var(--text-secondary)] mb-1">Road / Corridor Location *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Madhya Marg Near Sec 26 Grain Market"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full rounded border border-[var(--surface-border)] bg-[var(--surface-panel)] px-3 py-2 text-[var(--text-primary)] outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-[var(--text-secondary)] mb-1">Severity</label>
                  <select
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value as any)}
                    className="w-full rounded border border-[var(--surface-border)] bg-[var(--surface-panel)] px-2 py-2 text-[var(--text-primary)] outline-none text-xs"
                  >
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-[var(--text-secondary)] mb-1">Asphalt (MT)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newAsphaltTons}
                    onChange={(e) => setNewAsphaltTons(Number(e.target.value))}
                    className="w-full rounded border border-[var(--surface-border)] bg-[var(--surface-panel)] px-3 py-2 text-[var(--text-primary)] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-[var(--text-secondary)] mb-1">Budget (INR)</label>
                  <input
                    type="number"
                    value={newCost}
                    onChange={(e) => setNewCost(Number(e.target.value))}
                    className="w-full rounded border border-[var(--surface-border)] bg-[var(--surface-panel)] px-3 py-2 text-[var(--text-primary)] outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--surface-border)] mt-4">
                <Button type="button" variant="secondary" size="sm" onClick={() => setIsCreateModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" className="bg-[#2563eb] text-[var(--text-primary)] hover:bg-[var(--surface-subtle)]">
                  Create Work Order
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
