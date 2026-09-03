import { create } from 'zustand';
import {
  type BusTelemetryNode,
  type RoadDefect,
  type VehicleIncident,
  type RoadSegmentPCI,
  type BandwidthSavingsMetrics,
  type TrafficDensityMetrics,
} from '@/types';

export interface TelemetryState {
  // Live Bus Fleet Nodes (keyed by bus ID)
  buses: Record<string, BusTelemetryNode>;
  selectedBusId: string | null;

  // Active Road Defects
  defects: RoadDefect[];
  selectedDefectId: string | null;

  // Real-time Traffic & Police Incidents
  incidents: VehicleIncident[];
  selectedIncidentId: string | null;

  // Real-time Traffic Modal Breakdown & Congestion
  trafficDensity: TrafficDensityMetrics;

  // Road Network Pavement Condition Index (PCI)
  roadSegments: RoadSegmentPCI[];

  // Bandwidth & Fleet Performance Metrics
  bandwidthMetrics: BandwidthSavingsMetrics;
  avgFleetFps: number;
  autoVerifiedRepairsCount: number;

  // Actions
  updateBusTelemetry: (bus: BusTelemetryNode) => void;
  updateTrafficDensity: (metrics: Partial<TrafficDensityMetrics>) => void;
  addRoadDefect: (defect: RoadDefect) => void;
  addVehicleIncident: (incident: VehicleIncident) => void;
  setSelectedBusId: (id: string | null) => void;
  setSelectedDefectId: (id: string | null) => void;
  setSelectedIncidentId: (id: string | null) => void;
  setRoadSegments: (segments: RoadSegmentPCI[]) => void;
}

export const useTelemetryStore = create<TelemetryState>((set) => ({
  buses: {},
  selectedBusId: null,
  defects: [],
  selectedDefectId: null,
  incidents: [
    {
      id: 'INC-901-T14',
      type: 'rash_driving',
      coords: { lat: 30.7485, lng: 76.7925 },
      timestamp: Date.now() - 1000 * 60 * 4,
      reportedByBusId: 'BUS-101 (CH-01-TB-4820)',
      locationName: 'Madhya Marg (Sec 9/10 Matka Chowk)',
      suspectPlate: 'HR 03 AA 5580',
      ocrConfidence: 0.964,
      speedKmH: 76.4,
      reason: 'Erratic High-Speed Lane Weaving Corridor',
      vehicleDescription: 'Black Hatchback (Track #14)',
      isFlaggedWatchlist: true,
    },
    {
      id: 'INC-882-T08',
      type: 'hit_and_run',
      coords: { lat: 30.7070, lng: 76.7940 },
      timestamp: Date.now() - 1000 * 60 * 25,
      reportedByBusId: 'BUS-102 (CH-01-GA-9210)',
      locationName: 'Tribune Chowk Southbound Ramp',
      suspectPlate: 'PB 65 AB 9142',
      ocrConfidence: 0.978,
      speedKmH: 82.0,
      reason: 'Hit & Run Suspect (Active Police Hotlist)',
      vehicleDescription: 'Silver Commercial LCV (Track #08)',
      isFlaggedWatchlist: true,
    },
  ],
  selectedIncidentId: 'INC-901-T14',
  trafficDensity: {
    busId: 'CH-01-TB-4820',
    routeId: 'Route 1 (Madhya Marg)',
    timestamp: Date.now(),
    coords: { lat: 30.7485, lng: 76.7925 },
    carsCount: 14,
    twoWheelersCount: 9,
    busesCount: 3,
    trucksCount: 2,
    pedestriansCount: 4,
    totalVehicles: 28,
    averageSpeedKmH: 28.8,
    congestionIndex: 0.44,
  },
  roadSegments: [],
  avgFleetFps: 28.4,
  autoVerifiedRepairsCount: 42,
  bandwidthMetrics: {
    rawStreamBytes: 428000000,
    edgeTelemetryBytes: 524000,
    savingsPercentage: 99.88,
    totalEventsProcessed: 18420,
  },

  updateBusTelemetry: (bus) =>
    set((state) => ({
      buses: { ...state.buses, [bus.id]: bus },
      bandwidthMetrics: {
        ...state.bandwidthMetrics,
        rawStreamBytes: state.bandwidthMetrics.rawStreamBytes + 150000,
        edgeTelemetryBytes: state.bandwidthMetrics.edgeTelemetryBytes + 140,
        totalEventsProcessed: state.bandwidthMetrics.totalEventsProcessed + 1,
      },
    })),

  updateTrafficDensity: (metrics) =>
    set((state) => ({
      trafficDensity: { ...state.trafficDensity, ...metrics },
    })),

  addRoadDefect: (defect) =>
    set((state) => {
      const existingIndex = state.defects.findIndex((d) => d.id === defect.id);
      if (existingIndex >= 0) {
        const updated = [...state.defects];
        updated[existingIndex] = {
          ...updated[existingIndex],
          observationsCount: updated[existingIndex].observationsCount + 1,
          lastDetectedAt: defect.detectedAt,
        } as any;
        return { defects: updated };
      }
      return { defects: [defect, ...state.defects] };
    }),

  addVehicleIncident: (incident) =>
    set((state) => ({
      incidents: [incident, ...state.incidents],
    })),

  setSelectedBusId: (id) => set({ selectedBusId: id }),
  setSelectedDefectId: (id) => set({ selectedDefectId: id }),
  setSelectedIncidentId: (id) => set({ selectedIncidentId: id }),
  setRoadSegments: (segments) => set({ roadSegments: segments }),
}));

