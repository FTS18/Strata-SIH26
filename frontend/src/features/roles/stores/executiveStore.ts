import { create } from 'zustand';

export interface WardCompliance {
  wardId: string;
  wardName: string;
  zone: string;
  pciScore: number;
  openTickets: number;
  resolvedThisMonth: number;
  contractorName: string;
  complianceRate: number;
  wardCouncillor: string;
  slaOverdueTickets: number;
  auditStatus: 'Audit Verified' | 'Audit Flagged' | 'Pending Audit';
}

export interface BudgetAllocation {
  zoneId: string;
  zoneName: string;
  potholesLogged: number;
  asphaltTonsRequired: number;
  estimatedCostInr: number;
  allocatedBudgetInr: number;
  budgetUtilizationPct: number;
  chiefEngineer: string;
  sanctionStatus: 'Fully Sanctioned' | 'Sanction Pending Review' | 'Critical Allocation';
}

export interface ExecutiveState {
  wards: WardCompliance[];
  budgetZones: BudgetAllocation[];
  selectedWardId: string;
  selectedZoneId: string;
  activeToast: string | null;

  // Actions
  auditWard: (wardId: string, status: 'Audit Verified' | 'Audit Flagged') => void;
  sanctionZoneBudget: (zoneId: string) => void;
  setSelectedWardId: (wardId: string) => void;
  setSelectedZoneId: (zoneId: string) => void;

  showToast: (msg: string) => void;
  clearToast: () => void;
}

export const useExecutiveStore = create<ExecutiveState>((set, get) => ({
  wards: [
    {
      wardId: 'WARD-14',
      wardName: 'Ward 14 - NDMC Central',
      zone: 'Central Zone',
      pciScore: 88,
      openTickets: 4,
      resolvedThisMonth: 42,
      contractorName: 'Shree Balaji Infra',
      complianceRate: 96,
      wardCouncillor: 'Shri Manoj Tyagi',
      slaOverdueTickets: 0,
      auditStatus: 'Audit Verified',
    },
    {
      wardId: 'WARD-28',
      wardName: 'Ward 28 - Ring Road Dhaula Kuan',
      zone: 'South-West Zone',
      pciScore: 74,
      openTickets: 12,
      resolvedThisMonth: 38,
      contractorName: 'Apex Roadways Ltd',
      complianceRate: 84,
      wardCouncillor: 'Smt. Rekha Gupta',
      slaOverdueTickets: 2,
      auditStatus: 'Audit Verified',
    },
    {
      wardId: 'WARD-42',
      wardName: 'Ward 42 - Ashram & Mathura Rd',
      zone: 'South Zone',
      pciScore: 61,
      openTickets: 29,
      resolvedThisMonth: 51,
      contractorName: 'MCD Direct Works',
      complianceRate: 68,
      wardCouncillor: 'Shri Praveen Kumar',
      slaOverdueTickets: 9,
      auditStatus: 'Audit Flagged',
    },
    {
      wardId: 'WARD-09',
      wardName: 'Ward 09 - ITO & Vikas Marg',
      zone: 'East Zone',
      pciScore: 66,
      openTickets: 22,
      resolvedThisMonth: 31,
      contractorName: 'Delhi PWD Division 4',
      complianceRate: 72,
      wardCouncillor: 'Shri Arvind Gautam',
      slaOverdueTickets: 5,
      auditStatus: 'Pending Audit',
    },
    {
      wardId: 'WARD-33',
      wardName: 'Ward 33 - Outer Ring Pitampura',
      zone: 'North-West Zone',
      pciScore: 82,
      openTickets: 9,
      resolvedThisMonth: 29,
      contractorName: 'National Highway PWD',
      complianceRate: 91,
      wardCouncillor: 'Smt. Pooja Aggarwal',
      slaOverdueTickets: 1,
      auditStatus: 'Audit Verified',
    },
  ],

  budgetZones: [
    {
      zoneId: 'ZONE-CENTRAL',
      zoneName: 'Central Municipal Zone',
      potholesLogged: 14,
      asphaltTonsRequired: 22.4,
      estimatedCostInr: 124000,
      allocatedBudgetInr: 500000,
      budgetUtilizationPct: 24.8,
      chiefEngineer: 'Er. Sandeep Verma',
      sanctionStatus: 'Fully Sanctioned',
    },
    {
      zoneId: 'ZONE-SOUTH-1',
      zoneName: 'South Delhi Zone 1',
      potholesLogged: 38,
      asphaltTonsRequired: 68.2,
      estimatedCostInr: 395000,
      allocatedBudgetInr: 800000,
      budgetUtilizationPct: 49.3,
      chiefEngineer: 'Er. Rajesh K. Mehta',
      sanctionStatus: 'Sanction Pending Review',
    },
    {
      zoneId: 'ZONE-EAST',
      zoneName: 'East Delhi Trans-Yamuna',
      potholesLogged: 42,
      asphaltTonsRequired: 74.0,
      estimatedCostInr: 440000,
      allocatedBudgetInr: 650000,
      budgetUtilizationPct: 67.6,
      chiefEngineer: 'Er. Alok Sharma',
      sanctionStatus: 'Critical Allocation',
    },
    {
      zoneId: 'ZONE-WEST',
      zoneName: 'West Delhi Outer Zone',
      potholesLogged: 21,
      asphaltTonsRequired: 34.5,
      estimatedCostInr: 198000,
      allocatedBudgetInr: 550000,
      budgetUtilizationPct: 36.0,
      chiefEngineer: 'Er. Pradeep Yadav',
      sanctionStatus: 'Fully Sanctioned',
    },
  ],

  selectedWardId: 'WARD-42',
  selectedZoneId: 'ZONE-SOUTH-1',
  activeToast: null,

  showToast: (msg: string) => {
    set({ activeToast: msg });
    setTimeout(() => {
      set({ activeToast: null });
    }, 4000);
  },

  clearToast: () => set({ activeToast: null }),

  auditWard: (wardId, status) => {
    set((state) => ({
      wards: state.wards.map((w) => (w.wardId === wardId ? { ...w, auditStatus: status } : w)),
    }));
    const ward = get().wards.find((w) => w.wardId === wardId);
    get().showToast(`Ward ${ward?.wardName || ''} audit completed: ${status}.`);
  },

  sanctionZoneBudget: (zoneId) => {
    set((state) => ({
      budgetZones: state.budgetZones.map((z) =>
        z.zoneId === zoneId ? { ...z, sanctionStatus: 'Fully Sanctioned' } : z
      ),
    }));
    const zone = get().budgetZones.find((z) => z.zoneId === zoneId);
    get().showToast(`Municipal budget tranche released for ${zone?.zoneName || ''}.`);
  },

  setSelectedWardId: (id) => set({ selectedWardId: id }),
  setSelectedZoneId: (id) => set({ selectedZoneId: id }),
}));
