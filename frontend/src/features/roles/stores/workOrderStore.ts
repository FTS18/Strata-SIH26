import { create } from 'zustand';
import { type WorkOrderTicket, type WorkOrderStatus, type RoadDefect } from '@/types';
import { calculateAsphaltRequirement } from '@/lib/geoAlgorithms';

export interface PotholeCluster {
  clusterId: string;
  roadName: string;
  potholeCount: number;
  recurrenceRate: string;
  originalContractor: string;
  riskLevel: 'Severe' | 'Moderate' | 'Low';
  gpsCentroid: string;
  slaBreachDays: number;
  estAsphaltTons: number;
  status: 'Pending Dispatch' | 'Work Order Active' | 'Penalized';
}

export interface AutoAuditRecord {
  ticketId: string;
  roadName: string;
  contractor: string;
  repairDate: string;
  verifiedByBus: string;
  postRepairZSpike: number;
  auditResult: 'Verified Smooth' | 'Defect Persists' | 'Under Observation';
  paymentStatus: 'Pending Payment' | 'Payment Released' | 'Rectification Demanded';
  milestonePaymentInr: number;
}

export interface ContractorPenalty {
  id: string;
  clusterId: string;
  contractorName: string;
  amountInr: number;
  reason: string;
  timestamp: number;
}

export interface WorkOrderState {
  tickets: WorkOrderTicket[];
  selectedTicketId: string | null;
  clusters: PotholeCluster[];
  auditRecords: AutoAuditRecord[];
  penalties: ContractorPenalty[];
  activeToast: string | null;

  // Ticket CRUD
  createTicketFromDefect: (defect: RoadDefect, dispatchRef?: string) => WorkOrderTicket;
  createCustomTicket: (ticket: Omit<WorkOrderTicket, 'id' | 'createdAt'>) => WorkOrderTicket;
  assignTicket: (ticketId: string, contractorName: string) => void;
  updateTicketStatus: (ticketId: string, status: WorkOrderStatus) => void;
  deleteTicket: (ticketId: string) => void;
  submitRepairVerification: (ticketId: string, afterPhotoUrl: string, verifiedByBusId: string) => void;
  setSelectedTicketId: (id: string | null) => void;

  // Cluster Actions
  dispatchClusterWorkOrder: (clusterId: string) => WorkOrderTicket | null;
  penalizeContractor: (clusterId: string, amountInr: number, reason: string) => void;

  // Auto-Audit Actions
  releaseContractorPayment: (ticketId: string) => void;
  demandWarrantyRectification: (ticketId: string) => void;

  // Toast
  showToast: (msg: string) => void;
  clearToast: () => void;
}

export const useWorkOrderStore = create<WorkOrderState>((set, get) => ({
  tickets: [
    {
      id: 'WO-8421',
      defectId: 'DEF-30731-76814',
      title: 'Pothole Patch & Bitumen Resurfacing',
      locationName: 'Madhya Marg (Near Sec 26 Grain Market)',
      coords: { lat: 30.7315, lng: 76.8140 },
      severity: 'critical',
      status: 'detected',
      estimatedAsphaltTons: 1.8,
      estimatedCostInr: 9060,
      createdAt: Date.now() - 3600000 * 2,
      deadlineAt: Date.now() + 3600000 * 22,
      beforePhotoUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'WO-8419',
      defectId: 'DEF-30707-76794',
      title: 'Damaged Concrete Divider Leveling',
      locationName: 'Tribune Chowk Flyover Approach (Dakshin Marg)',
      coords: { lat: 30.7070, lng: 76.7940 },
      severity: 'critical',
      status: 'assigned',
      assignedContractor: 'Shree Balaji Infra Works Ltd (Chandigarh)',
      estimatedAsphaltTons: 2.4,
      estimatedCostInr: 12480,
      createdAt: Date.now() - 3600000 * 18,
      deadlineAt: Date.now() + 3600000 * 48,
      beforePhotoUrl: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'WO-8412',
      defectId: 'DEF-30741-76785',
      title: 'Monsoon Drainage Clearing & Resurfacing',
      locationName: 'Sector 17 / 18 Underpass (Jan Marg)',
      coords: { lat: 30.7410, lng: 76.7850 },
      severity: 'high',
      status: 'in_progress',
      assignedContractor: 'MCC Engineering Division 2',
      estimatedAsphaltTons: 3.4,
      estimatedCostInr: 15780,
      createdAt: Date.now() - 3600000 * 30,
      deadlineAt: Date.now() + 3600000 * 14,
      beforePhotoUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'WO-8401',
      defectId: 'DEF-30759-76774',
      title: 'Pedestrian Zebra Crossing Repaint & Thermal Marking',
      locationName: 'Panjab University Gate 2 (Sector 14 Corridor)',
      coords: { lat: 30.7595, lng: 76.7740 },
      severity: 'high',
      status: 'verified_closed',
      assignedContractor: 'Shree Balaji Infra Works Ltd',
      estimatedAsphaltTons: 1.1,
      estimatedCostInr: 7200,
      createdAt: Date.now() - 3600000 * 72,
      deadlineAt: Date.now() - 3600000 * 24,
      verifiedAt: Date.now() - 3600000 * 12,
      verifiedByBusId: 'Bus 104 (CH-01-GA-6674)',
      beforePhotoUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80',
      afterPhotoUrl: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=600&auto=format&fit=crop&q=80',
    },
  ],

  selectedTicketId: null,

  clusters: [
    {
      clusterId: 'CLS-CHD-04',
      roadName: 'Madhya Marg (Near Sec 26 Grain Market)',
      potholeCount: 14,
      recurrenceRate: '3rd time in 6 months',
      originalContractor: 'Apex Roadways Ltd',
      riskLevel: 'Severe',
      gpsCentroid: '30.7315° N, 76.8140° E',
      slaBreachDays: 14,
      estAsphaltTons: 18.4,
      status: 'Pending Dispatch',
    },
    {
      clusterId: 'CLS-CHD-11',
      roadName: 'Tribune Chowk Flyover Approach (Dakshin Marg)',
      potholeCount: 9,
      recurrenceRate: '2nd time in 3 months',
      originalContractor: 'MCC Engineering Div 2',
      riskLevel: 'Severe',
      gpsCentroid: '30.7070° N, 76.7940° E',
      slaBreachDays: 8,
      estAsphaltTons: 11.2,
      status: 'Pending Dispatch',
    },
    {
      clusterId: 'CLS-CHD-02',
      roadName: 'Jan Marg (Sector 17/18 Light Point)',
      potholeCount: 7,
      recurrenceRate: 'Monsoon Water Wear',
      originalContractor: 'MCC Direct Works',
      riskLevel: 'Moderate',
      gpsCentroid: '30.7410° N, 76.7850° E',
      slaBreachDays: 3,
      estAsphaltTons: 8.5,
      status: 'Pending Dispatch',
    },
    {
      clusterId: 'CLS-CHD-08',
      roadName: 'Panjab University Gate 2 (Sector 14 Corridor)',
      potholeCount: 5,
      recurrenceRate: 'Fresh Formation',
      originalContractor: 'Shree Balaji Infra',
      riskLevel: 'Moderate',
      gpsCentroid: '30.7595° N, 76.7740° E',
      slaBreachDays: 0,
      estAsphaltTons: 6.1,
      status: 'Pending Dispatch',
    },
  ],

  auditRecords: [
    {
      ticketId: 'WO-2026-0811',
      roadName: 'Madhya Marg (Near Sec 26 Grain Market)',
      contractor: 'Shree Balaji Infra',
      repairDate: '28 Aug 2026',
      verifiedByBus: 'Bus 101 (CH-01-TB-4820)',
      postRepairZSpike: 1.08,
      auditResult: 'Verified Smooth',
      paymentStatus: 'Pending Payment',
      milestonePaymentInr: 45000,
    },
    {
      ticketId: 'WO-2026-0814',
      roadName: 'Tribune Chowk Flyover Approach',
      contractor: 'Apex Roadways Ltd',
      repairDate: '29 Aug 2026',
      verifiedByBus: 'Bus 102 (CH-01-GA-9210)',
      postRepairZSpike: 1.12,
      auditResult: 'Verified Smooth',
      paymentStatus: 'Payment Released',
      milestonePaymentInr: 68000,
    },
    {
      ticketId: 'WO-2026-0819',
      roadName: 'Jan Marg (Sector 17/18 Light Point)',
      contractor: 'MCC Direct Works',
      repairDate: '30 Aug 2026',
      verifiedByBus: 'Bus 104 (CH-01-GA-6674)',
      postRepairZSpike: 2.34,
      auditResult: 'Defect Persists',
      paymentStatus: 'Rectification Demanded',
      milestonePaymentInr: 32000,
    },
    {
      ticketId: 'WO-2026-0822',
      roadName: 'Panjab University Gate 2 (Sec 14)',
      contractor: 'MCC Engineering Div 2',
      repairDate: '31 Aug 2026',
      verifiedByBus: 'Bus 103 (CH-01-TB-5532)',
      postRepairZSpike: 1.15,
      auditResult: 'Verified Smooth',
      paymentStatus: 'Pending Payment',
      milestonePaymentInr: 28000,
    },
  ],

  penalties: [],
  activeToast: null,

  showToast: (msg: string) => {
    set({ activeToast: msg });
    setTimeout(() => {
      set({ activeToast: null });
    }, 4000);
  },

  clearToast: () => set({ activeToast: null }),

  createTicketFromDefect: (defect, dispatchRef) => {
    const { asphaltTons, estimatedCostInr } = calculateAsphaltRequirement(defect.estimatedAreaSqM);
    const ref = dispatchRef || defect.dispatchReference;
    const newTicket: WorkOrderTicket = {
      id: `WO-${Math.floor(1000 + Math.random() * 9000)}`,
      defectId: defect.id,
      title: `Surface Repair: ${defect.type.toUpperCase()}`,
      locationName: defect.roadName,
      coords: defect.coords,
      severity: defect.severity,
      status: 'detected',
      estimatedAsphaltTons: asphaltTons,
      estimatedCostInr: estimatedCostInr,
      createdAt: Date.now(),
      deadlineAt: Date.now() + 3600000 * 48,
      beforePhotoUrl: defect.proofImageUrl,
      dispatchReference: ref,
      assignedAgency: defect.assignedAgency || 'Punjab/Chandigarh PWD Civil Works',
    };

    set((state) => ({
      tickets: [newTicket, ...state.tickets],
      selectedTicketId: newTicket.id,
    }));
    get().showToast(
      ref
        ? `Official PWD Docket ${ref} assigned to Work Order ${newTicket.id}`
        : `Work order ${newTicket.id} created from AI defect detection.`
    );
    return newTicket;
  },

  createCustomTicket: (data) => {
    const newTicket: WorkOrderTicket = {
      ...data,
      id: `WO-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: Date.now(),
      deadlineAt: data.deadlineAt || Date.now() + 3600000 * 48,
    };

    set((state) => ({
      tickets: [newTicket, ...state.tickets],
      selectedTicketId: newTicket.id,
    }));
    get().showToast(`New Work Order ${newTicket.id} generated for ${newTicket.locationName}.`);
    return newTicket;
  },

  assignTicket: (ticketId, contractorName) => {
    set((state) => ({
      tickets: state.tickets.map((t) =>
        t.id === ticketId ? { ...t, status: 'assigned', assignedContractor: contractorName } : t
      ),
    }));
    get().showToast(`Ticket ${ticketId} assigned to ${contractorName}.`);
  },

  updateTicketStatus: (ticketId, status) => {
    set((state) => ({
      tickets: state.tickets.map((t) => (t.id === ticketId ? { ...t, status } : t)),
    }));
    get().showToast(`Work order status updated to ${status}.`);
  },

  deleteTicket: (ticketId) => {
    set((state) => ({
      tickets: state.tickets.filter((t) => t.id !== ticketId),
      selectedTicketId: state.selectedTicketId === ticketId ? null : state.selectedTicketId,
    }));
    get().showToast(`Ticket ${ticketId} removed.`);
  },

  submitRepairVerification: (ticketId, afterPhotoUrl, verifiedByBusId) => {
    set((state) => ({
      tickets: state.tickets.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              status: 'verified_closed',
              afterPhotoUrl,
              verifiedAt: Date.now(),
              verifiedByBusId,
            }
          : t
      ),
    }));
    get().showToast(`Work order ${ticketId} verified smooth and closed via bus pass.`);
  },

  setSelectedTicketId: (id) => set({ selectedTicketId: id }),

  dispatchClusterWorkOrder: (clusterId) => {
    const cluster = get().clusters.find((c) => c.clusterId === clusterId);
    if (!cluster) return null;

    const newTicket: WorkOrderTicket = {
      id: `WO-${Math.floor(1000 + Math.random() * 9000)}`,
      defectId: cluster.clusterId,
      title: `Cluster Resurfacing: ${cluster.potholeCount} Defects`,
      locationName: cluster.roadName,
      coords: { lat: 30.7315, lng: 76.8140 },
      severity: cluster.riskLevel === 'Severe' ? 'critical' : 'high',
      status: 'assigned',
      assignedContractor: cluster.originalContractor,
      estimatedAsphaltTons: cluster.estAsphaltTons,
      estimatedCostInr: Math.round(cluster.estAsphaltTons * 5500 + 4000),
      createdAt: Date.now(),
      deadlineAt: Date.now() + 3600000 * 48,
    };

    set((state) => ({
      tickets: [newTicket, ...state.tickets],
      clusters: state.clusters.map((c) =>
        c.clusterId === clusterId ? { ...c, status: 'Work Order Active' } : c
      ),
    }));
    get().showToast(`Work Order ${newTicket.id} dispatched for cluster ${cluster.clusterId}.`);
    return newTicket;
  },

  penalizeContractor: (clusterId, amountInr, reason) => {
    const cluster = get().clusters.find((c) => c.clusterId === clusterId);
    if (!cluster) return;

    const penalty: ContractorPenalty = {
      id: `PEN-${Math.floor(100 + Math.random() * 900)}`,
      clusterId,
      contractorName: cluster.originalContractor,
      amountInr,
      reason,
      timestamp: Date.now(),
    };

    set((state) => ({
      penalties: [penalty, ...state.penalties],
      clusters: state.clusters.map((c) =>
        c.clusterId === clusterId ? { ...c, status: 'Penalized' } : c
      ),
    }));
    get().showToast(`Penalty of INR ${amountInr.toLocaleString('en-IN')} levied on ${cluster.originalContractor}.`);
  },

  releaseContractorPayment: (ticketId) => {
    set((state) => ({
      auditRecords: state.auditRecords.map((a) =>
        a.ticketId === ticketId ? { ...a, paymentStatus: 'Payment Released' } : a
      ),
    }));
    get().showToast(`Contractor milestone payment released for ${ticketId}.`);
  },

  demandWarrantyRectification: (ticketId) => {
    set((state) => ({
      auditRecords: state.auditRecords.map((a) =>
        a.ticketId === ticketId ? { ...a, paymentStatus: 'Rectification Demanded' } : a
      ),
    }));
    get().showToast(`24-hour warranty rectification demanded for ${ticketId}.`);
  },
}));
