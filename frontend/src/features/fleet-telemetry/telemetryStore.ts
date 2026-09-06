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
  activeReportModal: { id: string; category: 'defect' | 'incident' } | null;
  setActiveReportModal: (modal: { id: string; category: 'defect' | 'incident' } | null) => void;
  publishDefectReport: (defectId: string, notes?: string, agency?: string) => string;
  publishIncidentReport: (incidentId: string, notes?: string, agency?: string) => string;
}

export const useTelemetryStore = create<TelemetryState>((set, get) => ({
  buses: {},
  selectedBusId: null,
  defects: [],
  selectedDefectId: null,
  activeReportModal: null,
  incidents: [
    {
      id: 'ANPR-882-T08',
      type: 'anpr_plate_hit',
      coords: { lat: 30.7070, lng: 76.7940 },
      timestamp: Date.now() - 1000 * 20,
      reportedByBusId: 'CH-01-GA-9210',
      locationName: 'Tribune Chowk Southbound Flyover',
      suspectPlate: 'MH 02 CZ 8820',
      ocrConfidence: 0.986,
      speedKmH: 58.4,
      reason: 'High-Precision Edge ANPR Optical Hit',
      vehicleDescription: 'White Mercedes-Benz GLS 400d (Track #08)',
      isFlaggedWatchlist: false,
      cropImageUrl: '/evidence/rashdrive_cam1_crop.jpg',
      proofImageUrl: '/evidence/rashdrive_cam1_annotated.jpg',
      reportStatus: 'draft',
      assignedAgency: 'Chandigarh Traffic Police Central E-Challan Cell',
    },
    {
      id: 'SPD-901-T14',
      type: 'overspeeding',
      coords: { lat: 30.7485, lng: 76.7925 },
      timestamp: Date.now() - 1000 * 60 * 3,
      reportedByBusId: 'CH-01-TB-4820',
      locationName: 'Madhya Marg (Sec 9/10 Matka Chowk)',
      suspectPlate: 'HR 03 AA 5580',
      ocrConfidence: 0.964,
      speedKmH: 74.8,
      reason: 'Exceeded 50 km/h Urban Arterial Limit',
      vehicleDescription: 'Black Hyundai Creta (Track #14)',
      isFlaggedWatchlist: true,
      cropImageUrl: '/evidence/rashdrive_cam1_crop.jpg',
      proofImageUrl: '/evidence/rashdrive_cam1_annotated.jpg',
      reportStatus: 'draft',
      assignedAgency: 'Chandigarh Traffic Police Central E-Challan Cell',
    },
    {
      id: 'ANPR-744-T22',
      type: 'anpr_plate_hit',
      coords: { lat: 30.7385, lng: 76.7890 },
      timestamp: Date.now() - 1000 * 60 * 12,
      reportedByBusId: 'CH-01-TB-4820',
      locationName: 'Jan Marg (Sector 17 Plaza Corridor)',
      suspectPlate: 'KA 02 MM 9091',
      ocrConfidence: 0.974,
      speedKmH: 42.0,
      reason: 'Edge OCR Auto-Captured Plate Record',
      vehicleDescription: 'Grey Tata Nexon EV (Track #22)',
      isFlaggedWatchlist: false,
      cropImageUrl: '/evidence/rashdrive_cam1_crop.jpg',
      proofImageUrl: '/evidence/rashdrive_cam1_annotated.jpg',
      reportStatus: 'draft',
      assignedAgency: 'Chandigarh Traffic Police Central E-Challan Cell',
    },
  ],
  selectedIncidentId: 'ANPR-882-T08',
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
      // Deduplicate: same ID, or same defect type on the same camera/bus, or within 300m
      const existingIndex = state.defects.findIndex((d) =>
        d.id === defect.id ||
        (d.type === defect.type &&
          (d.detectedByBusId === defect.detectedByBusId ||
            (Math.abs(d.coords.lat - defect.coords.lat) < 0.003 &&
             Math.abs(d.coords.lng - defect.coords.lng) < 0.003)))
      );
      if (existingIndex >= 0) {
        const updated = [...state.defects];
        updated[existingIndex] = {
          ...updated[existingIndex],
          observationsCount: (updated[existingIndex].observationsCount || 1) + 1,
          lastDetectedAt: defect.detectedAt,
        } as any;
        return { defects: updated };
      }
      return { defects: [defect, ...state.defects] };
    }),

  addVehicleIncident: (incident) =>
    set((state) => {
      const existingIndex = state.incidents.findIndex((i) =>
        i.id === incident.id ||
        (i.type === incident.type &&
          (i.reportedByBusId === incident.reportedByBusId ||
           (i.suspectPlate && i.suspectPlate === incident.suspectPlate)))
      );
      if (existingIndex >= 0) return state;
      return { incidents: [incident, ...state.incidents] };
    }),

  setSelectedBusId: (id) => set({ selectedBusId: id }),
  setSelectedDefectId: (id) => set({ selectedDefectId: id }),
  setSelectedIncidentId: (id) => set({ selectedIncidentId: id }),
  setRoadSegments: (segments) => set({ roadSegments: segments }),

  setActiveReportModal: (modal) => set({ activeReportModal: modal }),

  publishDefectReport: (defectId, notes, agency) => {
    const ref = `PWD-CHD-${Math.floor(10000 + Math.random() * 90000)}`;
    set((state) => ({
      defects: state.defects.map((d) =>
        d.id === defectId
          ? {
              ...d,
              reportStatus: 'published',
              dispatchReference: ref,
              publishedAt: Date.now(),
              inspectorNotes: notes || d.inspectorNotes,
              assignedAgency: agency || 'Punjab/Chandigarh PWD Civil Works',
            }
          : d
      ),
    }));
    return ref;
  },

  publishIncidentReport: (incidentId, notes, agency) => {
    const ref = `CTP-CHALLAN-${Math.floor(10000 + Math.random() * 90000)}`;
    set((state) => ({
      incidents: state.incidents.map((i) =>
        i.id === incidentId
          ? {
              ...i,
              reportStatus: 'published',
              dispatchReference: ref,
              publishedAt: Date.now(),
              inspectorNotes: notes || i.inspectorNotes,
              assignedAgency: agency || 'Chandigarh Traffic Police Central E-Challan Cell',
            }
          : i
      ),
    }));
    return ref;
  },
}));

