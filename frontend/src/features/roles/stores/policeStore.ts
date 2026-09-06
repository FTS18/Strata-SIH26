import { create } from 'zustand';
import { type VehicleIncident } from '@/types';

export interface DispatchedUnit {
  unitId: string;
  callSign: string;
  officerName: string;
  etaMins: number;
  status: 'Dispatched' | 'En-Route' | 'On-Scene' | 'Intercepted';
  dispatchedAt: number;
}

export interface WarrantVehicle {
  id: string;
  plate: string;
  vehicleModel: string;
  warrantReason: string;
  caseFir: string;
  policeStation: string;
  flaggedDate: string;
  lastSightedByBus: string;
  status: 'Active Warrant' | 'Impound Immediate' | 'Under Surveillance' | 'Recovered / Closed';
  priority: 'Critical' | 'High' | 'Medium';
  dispatchedUnit?: DispatchedUnit;
  incidentId?: string;
  dispatchReference?: string;
  proofImageUrl?: string;
}

export interface EChallanRecord {
  id: string;
  plate: string;
  vehicleType: string;
  violationType: string;
  fineAmount: number;
  speedObservedKmH: number;
  speedLimitKmH: number;
  location: string;
  coords: { lat: number; lng: number };
  reportingBusId: string;
  ocrConfidence: number;
  timestamp: number;
  status: 'UNPAID' | 'PAID' | 'DISPUTED' | 'COURT_ESCALATED' | 'REVOKED';
  revocationReason?: string;
  paymentReceiptId?: string;
  ownerName?: string;
  incidentId?: string;
  dispatchReference?: string;
  proofImageUrl?: string;
}

export interface ViolationCorridor {
  id: string;
  corridorName: string;
  locationName: string;
  primaryOffense: string;
  riskLevel: 'Severe' | 'High' | 'Moderate';
  avgOffenseSpeed: string;
  speedLimit: number;
  violationsCount: number;
  nearestPcrUnit: string;
  recommendedAction: string;
  radarActive: boolean;
  activeUnitsDispatched: number;
}

export interface PoliceState {
  warrants: WarrantVehicle[];
  challans: EChallanRecord[];
  corridors: ViolationCorridor[];
  selectedWarrantId: string | null;
  selectedChallanId: string | null;
  activeToast: string | null;

  // Warrant CRUD
  addWarrant: (warrant: Omit<WarrantVehicle, 'id' | 'flaggedDate'>) => WarrantVehicle;
  updateWarrant: (id: string, updates: Partial<WarrantVehicle>) => void;
  deleteWarrant: (id: string) => void;
  dispatchPcrToWarrant: (id: string, callSign?: string) => void;
  setSelectedWarrantId: (id: string | null) => void;

  // E-Challan CRUD
  issueChallan: (challan: Omit<EChallanRecord, 'id' | 'timestamp'>) => EChallanRecord;
  updateChallanStatus: (id: string, status: EChallanRecord['status'], extra?: { reason?: string; receiptId?: string }) => void;
  revokeChallan: (id: string, reason: string) => void;
  setSelectedChallanId: (id: string | null) => void;
  syncPublishedIncident: (incident: VehicleIncident, dispatchCode: string, notes?: string) => void;

  // Corridor Actions
  toggleCorridorRadar: (id: string) => void;
  dispatchCorridorInterceptor: (id: string) => void;

  // Notification Toast
  showToast: (msg: string) => void;
  clearToast: () => void;
}

export const usePoliceStore = create<PoliceState>((set, get) => ({
  warrants: [
    {
      id: 'WAR-9142',
      plate: 'PB 65 AB 9142',
      vehicleModel: 'Mahindra Scorpio (Black)',
      warrantReason: 'Hit & Run Fatality (Tribune Chowk)',
      caseFir: 'FIR #419/2026',
      policeStation: 'Sector 34 PS (Chandigarh)',
      flaggedDate: '01 Sep 2026',
      lastSightedByBus: 'Bus 102 (CH-01-GA-9210)',
      status: 'Active Warrant',
      priority: 'Critical',
    },
    {
      id: 'WAR-5580',
      plate: 'HR 03 AA 5580',
      vehicleModel: 'Hyundai Creta (White)',
      warrantReason: 'Aggressive Weaving & Hit Cyclist',
      caseFir: 'FIR #388/2026',
      policeStation: 'Sector 17 PS (Chandigarh)',
      flaggedDate: '31 Aug 2026',
      lastSightedByBus: 'Bus 101 (CH-01-TB-4820)',
      status: 'Impound Immediate',
      priority: 'Critical',
    },
    {
      id: 'WAR-8802',
      plate: 'CH 01 Z 8802',
      vehicleModel: 'Tata 407 Commercial LCV',
      warrantReason: 'Stolen Commercial Vehicle Alert',
      caseFir: 'FIR #290/2026',
      policeStation: 'Sector 26 PS (Chandigarh)',
      flaggedDate: '30 Aug 2026',
      lastSightedByBus: 'Bus 104 (CH-01-GA-6674)',
      status: 'Impound Immediate',
      priority: 'High',
    },
    {
      id: 'WAR-4412',
      plate: 'CH 01 BG 4412',
      vehicleModel: 'Maruti Swift (Silver)',
      warrantReason: 'Repeat High-Speed Red Light Runner',
      caseFir: 'Challan #88219',
      policeStation: 'Sector 11 PS (Chandigarh)',
      flaggedDate: '28 Aug 2026',
      lastSightedByBus: 'Bus 103 (CH-01-TB-5532)',
      status: 'Under Surveillance',
      priority: 'Medium',
    },
  ],

  challans: [
    {
      id: 'ECH-2026-9142',
      plate: 'DL 03 CB 9142',
      vehicleType: 'Private SUV (Tata Harrier)',
      violationType: 'Corridor Over-Speeding (>25 km/h over limit)',
      fineAmount: 2000,
      speedObservedKmH: 78.4,
      speedLimitKmH: 50,
      location: 'Madhya Marg (Near Grain Market Sector 26)',
      coords: { lat: 30.7315, lng: 76.8140 },
      reportingBusId: 'Bus 102 (DL-1PC-9210)',
      ocrConfidence: 0.964,
      timestamp: Date.now() - 3600000 * 3,
      status: 'UNPAID',
      ownerName: 'Vikas Sharma',
    },
    {
      id: 'ECH-2026-5797',
      plate: 'UP 16 BT 5797',
      vehicleType: 'Commercial Carrier (Toyota Innova)',
      violationType: 'High-Security Zone Speeding & Lane Violation',
      fineAmount: 2500,
      speedObservedKmH: 68.2,
      speedLimitKmH: 40,
      location: 'Kartavya Path / Rajpath Corridor',
      coords: { lat: 28.6143, lng: 77.2090 },
      reportingBusId: 'Bus 102 (DL-1PC-9210)',
      ocrConfidence: 0.984,
      timestamp: Date.now() - 3600000 * 5,
      status: 'COURT_ESCALATED',
      ownerName: 'Balaji Tour & Travels',
    },
    {
      id: 'ECH-2026-9091',
      plate: 'KA 02 MM 9091',
      vehicleType: 'Luxury SUV (Volvo XC60)',
      violationType: 'Dedicated Bus Rapid Transit (BRT) Lane Intrusion',
      fineAmount: 1500,
      speedObservedKmH: 64.8,
      speedLimitKmH: 50,
      location: 'Central Outer Ring Road (Bus Transit Lane)',
      coords: { lat: 12.9716, lng: 77.5946 },
      reportingBusId: 'Bus 104 (DL-1PC-8840)',
      ocrConfidence: 0.984,
      timestamp: Date.now() - 3600000 * 8,
      status: 'PAID',
      paymentReceiptId: 'PAY-SBI-9842109',
      ownerName: 'Apex Tech Enterprises',
    },
    {
      id: 'ECH-2026-7150',
      plate: 'DL 2C AS 7150',
      vehicleType: 'Multi-Utility Vehicle (Toyota Innova)',
      violationType: 'Dangerous Overtaking at Pedestrian Zebra Crossing',
      fineAmount: 5000,
      speedObservedKmH: 74.0,
      speedLimitKmH: 40,
      location: 'C-Hexagon Corridor (India Gate)',
      coords: { lat: 28.6129, lng: 77.2295 },
      reportingBusId: 'Bus 102 (DL-1PC-9210)',
      ocrConfidence: 0.968,
      timestamp: Date.now() - 3600000 * 14,
      status: 'UNPAID',
      ownerName: 'Rajinder Kumar',
    },
  ],

  corridors: [
    {
      id: 'HOT-CHD-01',
      corridorName: 'Dakshin Marg Corridor',
      locationName: 'Tribune Chowk Approach (Dakshin Marg)',
      primaryOffense: 'Extreme Over-Speeding (>75 km/h)',
      riskLevel: 'Severe',
      avgOffenseSpeed: '76.4 km/h',
      speedLimit: 50,
      violationsCount: 38,
      nearestPcrUnit: 'PCR Zebra 14 (Sector 31)',
      recommendedAction: 'Deploy Mobile Speed Interceptor Radar',
      radarActive: true,
      activeUnitsDispatched: 1,
    },
    {
      id: 'HOT-CHD-02',
      corridorName: 'Jan Marg Corridor',
      locationName: 'Matka Chowk Light Point (Jan Marg)',
      primaryOffense: 'Red Light Jump & Stop-Line Overrun',
      riskLevel: 'Severe',
      avgOffenseSpeed: '58.2 km/h',
      speedLimit: 50,
      violationsCount: 29,
      nearestPcrUnit: 'PCR Falcon 08 (Sector 17)',
      recommendedAction: 'Automate ANPR Camera Enforcement Trigger',
      radarActive: false,
      activeUnitsDispatched: 0,
    },
    {
      id: 'HOT-CHD-03',
      corridorName: 'Madhya Marg Corridor',
      locationName: 'Sector 26 Grain Market Cut (Madhya Marg)',
      primaryOffense: 'Commercial Truck Lane Violation',
      riskLevel: 'High',
      avgOffenseSpeed: '52.1 km/h',
      speedLimit: 40,
      violationsCount: 19,
      nearestPcrUnit: 'PCR Eagle 03 (Sector 26)',
      recommendedAction: 'Restrict Heavy Vehicle Access via Transit Alert',
      radarActive: false,
      activeUnitsDispatched: 0,
    },
    {
      id: 'HOT-CHD-04',
      corridorName: 'Vikas Marg Corridor',
      locationName: 'Kishangarh Turn (Sector 1 Corridors)',
      primaryOffense: 'Wrong-Way Overtaking',
      riskLevel: 'Moderate',
      avgOffenseSpeed: '48.0 km/h',
      speedLimit: 40,
      violationsCount: 11,
      nearestPcrUnit: 'PCR Zebra 02 (Sector 3)',
      recommendedAction: 'Deploy Traffic Marshall Unit',
      radarActive: false,
      activeUnitsDispatched: 0,
    },
  ],

  selectedWarrantId: 'WAR-9142',
  selectedChallanId: 'ECH-2026-9142',
  activeToast: null,

  showToast: (msg: string) => {
    set({ activeToast: msg });
    setTimeout(() => {
      set({ activeToast: null });
    }, 4000);
  },

  clearToast: () => set({ activeToast: null }),

  addWarrant: (data) => {
    const newWarrant: WarrantVehicle = {
      ...data,
      id: `WAR-${Math.floor(1000 + Math.random() * 9000)}`,
      flaggedDate: 'Today (Just Now)',
    };
    set((state) => ({
      warrants: [newWarrant, ...state.warrants],
      selectedWarrantId: newWarrant.id,
    }));
    get().showToast(`Vehicle ${newWarrant.plate} added to Law Enforcement Hotlist.`);
    return newWarrant;
  },

  updateWarrant: (id, updates) => {
    set((state) => ({
      warrants: state.warrants.map((w) => (w.id === id ? { ...w, ...updates } : w)),
    }));
    get().showToast(`Warrant details updated.`);
  },

  deleteWarrant: (id) => {
    const warrant = get().warrants.find((w) => w.id === id);
    set((state) => ({
      warrants: state.warrants.filter((w) => w.id !== id),
      selectedWarrantId: state.selectedWarrantId === id ? null : state.selectedWarrantId,
    }));
    get().showToast(`Warrant ${warrant?.plate || id} closed and archived.`);
  },

  dispatchPcrToWarrant: (id, callSign = 'PCR Interceptor Alpha-01') => {
    const unit: DispatchedUnit = {
      unitId: `UNIT-${Math.floor(100 + Math.random() * 900)}`,
      callSign,
      officerName: 'Inspector R. S. Cheema',
      etaMins: 4,
      status: 'Dispatched',
      dispatchedAt: Date.now(),
    };
    set((state) => ({
      warrants: state.warrants.map((w) => (w.id === id ? { ...w, dispatchedUnit: unit, status: 'Impound Immediate' } : w)),
    }));
    get().showToast(`Patrol unit ${callSign} dispatched (ETA: 4 mins).`);
  },

  setSelectedWarrantId: (id) => set({ selectedWarrantId: id }),

  issueChallan: (data) => {
    const newChallan: EChallanRecord = {
      ...data,
      id: `ECH-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: Date.now(),
    };
    set((state) => ({
      challans: [newChallan, ...state.challans],
      selectedChallanId: newChallan.id,
    }));
    get().showToast(`E-Challan ${newChallan.id} issued for ${newChallan.plate}.`);
    return newChallan;
  },

  updateChallanStatus: (id, status, extra) => {
    set((state) => ({
      challans: state.challans.map((c) => {
        if (c.id !== id) return c;
        return {
          ...c,
          status,
          ...(extra?.reason ? { revocationReason: extra.reason } : {}),
          ...(extra?.receiptId ? { paymentReceiptId: extra.receiptId } : {}),
        };
      }),
    }));
    get().showToast(`Challan status updated to ${status}.`);
  },

  revokeChallan: (id, reason) => {
    set((state) => ({
      challans: state.challans.map((c) => (c.id === id ? { ...c, status: 'REVOKED', revocationReason: reason } : c)),
    }));
    get().showToast(`Challan ${id} officially revoked: ${reason}`);
  },

  setSelectedChallanId: (id) => set({ selectedChallanId: id }),

  toggleCorridorRadar: (id) => {
    set((state) => ({
      corridors: state.corridors.map((c) => {
        if (c.id !== id) return c;
        const nextState = !c.radarActive;
        return { ...c, radarActive: nextState };
      }),
    }));
  },

  dispatchCorridorInterceptor: (id) => {
    set((state) => ({
      corridors: state.corridors.map((c) => {
        if (c.id !== id) return c;
        return { ...c, activeUnitsDispatched: c.activeUnitsDispatched + 1 };
      }),
    }));
    const corridor = get().corridors.find((c) => c.id === id);
    get().showToast(`Interceptor deployed to ${corridor?.corridorName || 'corridor'}.`);
  },

  syncPublishedIncident: (incident, dispatchCode, notes) => {
    const fineAmount =
      incident.type === 'rash_driving' || incident.type === 'hit_and_run'
        ? 5000
        : incident.type === 'bus_lane_obstruction' || incident.type === 'lane_violation'
        ? 1500
        : (incident.speedKmH && incident.speedKmH > 70)
        ? 2500
        : 2000;

    const plate = incident.suspectPlate || 'HR 26 DQ 5512';
    const violationType =
      incident.reason ||
      `${incident.type.replace(/_/g, ' ').toUpperCase()}${
        incident.speedKmH ? ` (${incident.speedKmH} km/h clocked)` : ''
      }`;

    const newChallan: EChallanRecord = {
      id: dispatchCode,
      plate,
      vehicleType: incident.vehicleDescription || 'Private Vehicle (Sedan/SUV)',
      violationType,
      fineAmount,
      speedObservedKmH: incident.speedKmH || 67.4,
      speedLimitKmH: 50,
      location: incident.locationName,
      coords: incident.coords,
      reportingBusId: incident.reportedByBusId || 'CTU Sensing Bus (CAM1)',
      ocrConfidence: incident.ocrConfidence || 0.984,
      timestamp: incident.publishedAt || Date.now(),
      status: 'UNPAID',
      ownerName: 'National VAHAN Registry Record',
      incidentId: incident.id,
      dispatchReference: dispatchCode,
      proofImageUrl: incident.proofImageUrl || incident.cropImageUrl,
    };

    const newWarrant: WarrantVehicle = {
      id: `WAR-${dispatchCode.replace('CTP-CHALLAN-', '')}`,
      plate,
      vehicleModel: incident.vehicleDescription || 'Target Vehicle (Edge Optical Sighting)',
      warrantReason: violationType,
      caseFir: dispatchCode,
      policeStation: 'Sector 26 PS (Chandigarh Traffic Police Central E-Challan Cell)',
      flaggedDate: 'Today (Just Now)',
      lastSightedByBus: incident.reportedByBusId || 'CTU Sensing Bus (CAM1)',
      status:
        incident.isFlaggedWatchlist || (incident.speedKmH && incident.speedKmH > 70)
          ? 'Impound Immediate'
          : 'Active Warrant',
      priority: incident.speedKmH && incident.speedKmH > 65 ? 'Critical' : 'High',
      incidentId: incident.id,
      dispatchReference: dispatchCode,
      proofImageUrl: incident.proofImageUrl || incident.cropImageUrl,
    };

    set((state) => {
      const existingChallanIndex = state.challans.findIndex(
        (c) => c.id === dispatchCode || (c.incidentId && c.incidentId === incident.id)
      );
      const updatedChallans =
        existingChallanIndex >= 0
          ? state.challans.map((c, idx) => (idx === existingChallanIndex ? newChallan : c))
          : [newChallan, ...state.challans];

      const existingWarrantIndex = state.warrants.findIndex(
        (w) => w.caseFir === dispatchCode || w.plate === plate
      );
      const updatedWarrants =
        existingWarrantIndex >= 0
          ? state.warrants.map((w, idx) => (idx === existingWarrantIndex ? { ...w, ...newWarrant } : w))
          : [newWarrant, ...state.warrants];

      const locLower = incident.locationName.toLowerCase();
      const updatedCorridors = state.corridors.map((corridor) => {
        const corrLower = corridor.corridorName.toLowerCase();
        const corrLocLower = corridor.locationName.toLowerCase();
        const isMatch =
          (locLower.includes('madhya') && (corrLower.includes('madhya') || corrLocLower.includes('madhya'))) ||
          (locLower.includes('jan marg') && (corrLower.includes('jan marg') || corrLocLower.includes('jan marg'))) ||
          (locLower.includes('dakshin') && (corrLower.includes('dakshin') || corrLocLower.includes('dakshin')));

        if (isMatch) {
          return {
            ...corridor,
            violationsCount: corridor.violationsCount + 1,
            radarActive: true,
          };
        }
        return corridor;
      });

      return {
        challans: updatedChallans,
        warrants: updatedWarrants,
        corridors: updatedCorridors,
        selectedChallanId: dispatchCode,
        selectedWarrantId: newWarrant.id,
      };
    });

    get().showToast(`Report Synced to Central E-Challan Cell: ${dispatchCode} (${plate})`);
  },
}));
