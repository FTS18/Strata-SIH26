import {
  type BusTelemetry,
  type RoadDefect,
  type VehicleIncident,
} from '@/types';
import busPaths from '@/config/chandigarhBusPaths.json';

export interface TelemetryCallbacks {
  onBusUpdate: (bus: BusTelemetry) => void;
  onDefectDetected: (defect: RoadDefect) => void;
  onIncidentDetected: (incident: VehicleIncident) => void;
}

// Authentic OpenStreetMap Road Trajectories
const OSM_BUS_PATHS: Record<string, Array<[number, number]>> = {
  'Route 1': (busPaths as any)['Madhya Marg'] || [],
  'Route 2': (busPaths as any)['Jan Marg'] || [],
  'Route 3': (busPaths as any)['Dakshin Marg'] || [],
  'Route 4': (busPaths as any)['Himalaya Marg'] || [],
};

interface BusTrajectoryState {
  progress: number;
  speedKmH: number;
  direction: 1 | -1;
}

export class FleetTelemetryAdapter {
  private timer: NodeJS.Timeout | null = null;
  private busStates: Record<string, BusTrajectoryState> = {
    bus_101: { progress: 0.15, speedKmH: 34, direction: 1 },
    bus_102: { progress: 0.40, speedKmH: 30, direction: 1 },
    bus_103: { progress: 0.65, speedKmH: 36, direction: -1 },
    bus_104: { progress: 0.30, speedKmH: 32, direction: 1 },
  };

  private buses: BusTelemetry[] = [
    {
      id: 'bus_101',
      busNumber: 'CH-01-TB-4820',
      routeId: 'Route 1',
      coords: { lat: 30.763, lng: 76.7725 },
      speedKmH: 34.0,
      headingDeg: 128,
      fps: 29.4,
      passengerCount: 42,
      activeCameraCount: 4,
      lastPing: Date.now(),
    },
    {
      id: 'bus_102',
      busNumber: 'CH-01-GA-9210',
      routeId: 'Route 2',
      coords: { lat: 30.7385, lng: 76.789 },
      speedKmH: 30.0,
      headingDeg: 38,
      fps: 28.8,
      passengerCount: 58,
      activeCameraCount: 4,
      lastPing: Date.now(),
    },
    {
      id: 'bus_103',
      busNumber: 'CH-01-TB-5532',
      routeId: 'Route 3',
      coords: { lat: 30.7005, lng: 76.804 },
      speedKmH: 36.0,
      headingDeg: 128,
      fps: 30.1,
      passengerCount: 36,
      activeCameraCount: 4,
      lastPing: Date.now(),
    },
    {
      id: 'bus_104',
      busNumber: 'CH-01-GA-6674',
      routeId: 'Route 4',
      coords: { lat: 30.73, lng: 76.7995 },
      speedKmH: 32.0,
      headingDeg: 38,
      fps: 27.5,
      passengerCount: 31,
      activeCameraCount: 4,
      lastPing: Date.now(),
    },
  ];

  private defectCatalogue: Partial<RoadDefect>[] = [
    {
      type: 'pothole',
      roadName: 'Madhya Marg (Sec 26 Grain Market Choke)',
      wardName: 'MCC Ward 04 (East)',
      severity: 'critical',
      confidenceScore: 0.96,
      imuVibrationZ: 2.84,
      estimatedAreaSqM: 4.2,
      coords: { lat: 30.7305, lng: 76.821 },
      proofImageUrl:
        'https://images.unsplash.com/photo-1515865644861-8bedc4fb2344?w=800&auto=format&fit=crop&q=80',
    },
    {
      type: 'damaged_divider',
      roadName: 'Tribune Chowk Flyover (Dakshin Marg)',
      wardName: 'MCC Ward 24 (South)',
      severity: 'critical',
      confidenceScore: 0.94,
      imuVibrationZ: 2.45,
      estimatedAreaSqM: 6.8,
      coords: { lat: 30.7005, lng: 76.804 },
      proofImageUrl:
        'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800&auto=format&fit=crop&q=80',
    },
    {
      type: 'waterlogging',
      roadName: 'Jan Marg (Rose Garden / Sec 16)',
      wardName: 'MCC Ward 12 (Central)',
      severity: 'high',
      confidenceScore: 0.98,
      imuVibrationZ: 1.15,
      estimatedAreaSqM: 14.5,
      coords: { lat: 30.7385, lng: 76.789 },
      proofImageUrl:
        'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=800&auto=format&fit=crop&q=80',
    },
    {
      type: 'missing_zebra_crossing',
      roadName: 'Panjab University / PGI Gate (Madhya Marg)',
      wardName: 'MCC Ward 02 (West)',
      severity: 'high',
      confidenceScore: 0.91,
      imuVibrationZ: 1.05,
      estimatedAreaSqM: 7.5,
      coords: { lat: 30.763, lng: 76.7725 },
      proofImageUrl:
        'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
    },
  ];

  private incidentCatalogue: Partial<VehicleIncident>[] = [
    {
      type: 'school_children_crossing',
      locationName: 'Madhya Marg (Press Chowk)',
      suspectPlate: 'CH 01 BG 4412',
      speedKmH: 14.0,
      ocrConfidence: 0.99,
      coords: { lat: 30.739, lng: 76.8095 },
    },
    {
      type: 'hit_and_run',
      locationName: 'Tribune Chowk Southbound Flyover',
      suspectPlate: 'PB 65 AB 9142',
      speedKmH: 82.4,
      ocrConfidence: 0.964,
      coords: { lat: 30.7005, lng: 76.804 },
    },
    {
      type: 'rash_driving',
      locationName: 'Jan Marg (Aroma Chowk Sec 22)',
      suspectPlate: 'HR 03 AA 5580',
      speedKmH: 76.0,
      ocrConfidence: 0.942,
      coords: { lat: 30.7295, lng: 76.7795 },
    },
  ];

  connect(callbacks: TelemetryCallbacks) {
    let tick = 0;

    // Initial bus emit
    this.buses.forEach((b) => callbacks.onBusUpdate(b));

    // Initial defect emit
    this.defectCatalogue.forEach((item, idx) => {
      callbacks.onDefectDetected({
        id: `def_chd_${Date.now()}_${idx}`,
        type: item.type || 'pothole',
        coords: item.coords || { lat: 30.7475, lng: 76.7978 },
        severity: item.severity || 'high',
        confidenceScore: item.confidenceScore || 0.92,
        detectedAt: Date.now() - idx * 90000,
        detectedByBusId: `CH-01-TB-4820`,
        roadName: item.roadName || 'Chandigarh Transit Arterial',
        wardName: item.wardName || 'MCC Ward 12',
        estimatedAreaSqM: item.estimatedAreaSqM || 3.5,
        imuVibrationZ: item.imuVibrationZ || 2.4,
        observationsCount: idx + 1,
        proofImageUrl: item.proofImageUrl,
        status: 'active',
      });
    });

    // Real-time GPS Velocity Dispatcher (Every 800ms)
    this.timer = setInterval(() => {
      tick++;

      this.buses.forEach((bus) => {
        const route = OSM_BUS_PATHS[bus.routeId];
        const state = this.busStates[bus.id];
        if (!route || !state || route.length < 2) return;

        // Progress increment proportional to vehicle speed
        const speedMultiplier = state.speedKmH / 35;
        state.progress += 0.0016 * speedMultiplier * state.direction;

        // Terminal turnaround logic
        if (state.progress >= 1.0) {
          state.progress = 1.0;
          state.direction = -1;
        } else if (state.progress <= 0.0) {
          state.progress = 0.0;
          state.direction = 1;
        }

        // Exact sub-meter coordinate interpolation on OSM road way
        const totalNodes = route.length - 1;
        const exactIndex = state.progress * totalNodes;
        const lowerIndex = Math.floor(exactIndex);
        const upperIndex = Math.min(totalNodes, lowerIndex + 1);
        const fraction = exactIndex - lowerIndex;

        const p1 = route[lowerIndex];
        const p2 = route[upperIndex];

        if (p1 && p2) {
          const lng = Number((p1[0] + (p2[0] - p1[0]) * fraction).toFixed(6));
          const lat = Number((p1[1] + (p2[1] - p1[1]) * fraction).toFixed(6));

          // Calculate target heading from vector
          const dLng = (p2[0] - p1[0]) * state.direction;
          const dLat = (p2[1] - p1[1]) * state.direction;
          let targetHeading = Math.round((Math.atan2(dLng, dLat) * 180) / Math.PI);
          if (targetHeading < 0) targetHeading += 360;

          // Angular Exponential Moving Average (Smooth 360 deg interpolation)
          let diff = targetHeading - bus.headingDeg;
          if (diff > 180) diff -= 360;
          if (diff < -180) diff += 360;
          const smoothedHeading = Math.round((bus.headingDeg + diff * 0.45 + 360) % 360);

          // Speed variation
          const speedJitter = Math.round(Math.sin(tick * 0.2 + lowerIndex) * 4);
          const currentSpeed = Math.max(24, Math.min(46, state.speedKmH + speedJitter));

          bus.coords = { lat, lng };
          bus.headingDeg = smoothedHeading;
          bus.speedKmH = currentSpeed;
          bus.lastPing = Date.now();

          callbacks.onBusUpdate({ ...bus });
        }
      });

      // Periodic live incidents
      if (tick % 35 === 0) {
        const catalogIndex = Math.floor(Math.random() * this.incidentCatalogue.length);
        const inc = this.incidentCatalogue[catalogIndex];
        const reportingBus = this.buses[Math.floor(Math.random() * this.buses.length)];

        callbacks.onIncidentDetected({
          id: `inc_chd_${Date.now()}`,
          type: inc.type || 'rash_driving',
          coords: inc.coords || { ...reportingBus.coords },
          timestamp: Date.now(),
          reportedByBusId: reportingBus.busNumber,
          locationName: inc.locationName || 'Chandigarh Sector Corridor',
          suspectPlate: inc.suspectPlate,
          ocrConfidence: inc.ocrConfidence,
          speedKmH: inc.speedKmH,
        });
      }
    }, 800);
  }

  disconnect() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}
