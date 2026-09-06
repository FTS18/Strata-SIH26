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
      proofImageUrl: '/evidence/pothole_cam1_annotated.jpg',
      cropImageUrl: '/evidence/pothole_cam1_crop.jpg',
      reportStatus: 'draft',
      inspectorNotes: 'Class 3 asphalt crater detected. Accelerometer registered 2.84g impact spike. Immediate bituminous patch work order required.',
      assignedAgency: 'Punjab/Chandigarh PWD Civil Works',
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
      proofImageUrl: '/evidence/waterlogging_cam1_annotated.jpg',
      cropImageUrl: '/evidence/waterlogging_cam1_crop.jpg',
      reportStatus: 'draft',
      inspectorNotes: 'Severe road surface ponding (14.5 m² area, 5.2 cm depth). High hydroplaning hazard. Recommend stormwater suction dispatch.',
      assignedAgency: 'MCC Stormwater & Drainage Wing',
    },
    {
      type: 'pothole',
      roadName: 'Dakshin Marg (Tribune Flyover Approach)',
      wardName: 'MCC Ward 24 (South)',
      severity: 'critical',
      confidenceScore: 0.93,
      imuVibrationZ: 2.62,
      estimatedAreaSqM: 3.5,
      coords: { lat: 30.707, lng: 76.794 },
      proofImageUrl: '/evidence/pothole_cam1_annotated.jpg',
      cropImageUrl: '/evidence/pothole_cam1_crop.jpg',
      reportStatus: 'draft',
      inspectorNotes: 'Deep wheel-track depression with edge fracturing. Suspension shock logged by CTU Fleet.',
      assignedAgency: 'Punjab/Chandigarh PWD Civil Works',
    },
  ];

  private incidentCatalogue: Partial<VehicleIncident>[] = [
    {
      type: 'overspeeding',
      locationName: 'Dakshin Marg (Tribune Flyover Approach)',
      suspectPlate: 'HR 26 DQ 5512',
      vehicleDescription: 'Silver Toyota Innova (Track #19)',
      speedKmH: 78.5,
      ocrConfidence: 0.974,
      reason: 'Extreme Speed Violation: 78.5 km/h in 50 km/h Zone (Rash Driving)',
      isFlaggedWatchlist: true,
      coords: { lat: 30.707, lng: 76.794 },
      proofImageUrl: '/evidence/pothole_cam1_annotated.jpg',
      cropImageUrl: '/evidence/pothole_cam1_crop.jpg',
      reportStatus: 'draft',
      inspectorNotes: 'Vehicle clocked exceeding speed limit by +28.5 km/h with reckless lane changes. E-Challan draft generated.',
      assignedAgency: 'Chandigarh Traffic Police Central E-Challan Cell',
    },
    {
      type: 'crosswalk_incursion',
      locationName: 'Panjab University / PGI Gate (Madhya Marg)',
      vehicleDescription: 'Vulnerable Pedestrian in Rapid Transit Busway',
      ocrConfidence: 0.94,
      reason: 'Vulnerable Pedestrian Safety Incursion in Active Corridor',
      isFlaggedWatchlist: true,
      coords: { lat: 30.763, lng: 76.7725 },
      proofImageUrl: '/evidence/pothole_cam1_annotated.jpg',
      cropImageUrl: '/evidence/pothole_cam1_crop.jpg',
      reportStatus: 'draft',
      inspectorNotes: 'Pedestrian detected inside barricaded high-speed BRT lane. Audio cab warning triggered.',
      assignedAgency: 'Chandigarh Municipal Transit Enforcement',
    },
    {
      type: 'bus_lane_obstruction',
      locationName: 'Jan Marg (Aroma Chowk Sec 22)',
      suspectPlate: 'PB 01 C 3302',
      vehicleDescription: 'White Delivery Van (Track #04)',
      speedKmH: 0.0,
      ocrConfidence: 0.965,
      reason: 'Illegal Stationary Corridor Obstruction (> 90s)',
      isFlaggedWatchlist: false,
      coords: { lat: 30.7295, lng: 76.7795 },
      proofImageUrl: '/evidence/pothole_cam1_annotated.jpg',
      cropImageUrl: '/evidence/pothole_cam1_crop.jpg',
      reportStatus: 'draft',
      inspectorNotes: 'Commercial van obstructing public transit stop. Towing dispatch notice drafted.',
      assignedAgency: 'Chandigarh Traffic Police Central E-Challan Cell',
    },
    {
      type: 'overspeeding',
      locationName: 'Madhya Marg (Press Chowk)',
      suspectPlate: 'CH 01 BG 9012',
      vehicleDescription: 'White Hyundai Verna (Track #44)',
      speedKmH: 82.0,
      ocrConfidence: 0.981,
      reason: 'Dangerous Rash Driving & Severe Speeding: 82 km/h in Urban Corridor',
      isFlaggedWatchlist: true,
      coords: { lat: 30.739, lng: 76.8095 },
      proofImageUrl: '/evidence/pothole_cam1_annotated.jpg',
      cropImageUrl: '/evidence/pothole_cam1_crop.jpg',
      reportStatus: 'draft',
      inspectorNotes: 'Radar speed trigger + optical OCR confirmed speed violation. E-Challan draft generated.',
      assignedAgency: 'Chandigarh Traffic Police Central E-Challan Cell',
    },
  ];

  private knownDefectIds = new Set<string>();
  private knownIncidentIds = new Set<string>();

  connect(callbacks: TelemetryCallbacks) {
    let tick = 0;

    // Initial bus emit
    this.buses.forEach((b) => callbacks.onBusUpdate(b));

    // Initial defect emit
    this.defectCatalogue.forEach((item, idx) => {
      const defId = `def_chd_${Date.now()}_${idx}`;
      this.knownDefectIds.add(defId);
      callbacks.onDefectDetected({
        id: defId,
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
        cropImageUrl: item.cropImageUrl,
        status: 'active',
        reportStatus: item.reportStatus || 'draft',
        inspectorNotes: item.inspectorNotes,
        assignedAgency: item.assignedAgency,
      });
    });

    // Real-time GPS Velocity Dispatcher & Live Backend Telemetry Ingestion (Every 800ms)
    this.timer = setInterval(() => {
      tick++;

      // Ingest live real-time defects & incidents from backend vision engine
      if (tick % 2 === 0) {
        fetch('http://localhost:8000/api/v1/distress/feed')
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => {
            if (!data) return;
            if (Array.isArray(data.defects)) {
              data.defects.forEach((d: any) => {
                if (!this.knownDefectIds.has(d.defect_id)) {
                  this.knownDefectIds.add(d.defect_id);
                  callbacks.onDefectDetected({
                    id: d.defect_id,
                    type: d.defect_type,
                    coords: d.coords,
                    severity: d.severity,
                    confidenceScore: d.confidence_score,
                    detectedAt: d.timestamp,
                    detectedByBusId: d.detected_by_bus_id,
                    roadName: d.road_name,
                    wardName: d.wardName || 'MCC Ward 04',
                    estimatedAreaSqM: d.estimated_area_sq_m,
                    imuVibrationZ: d.imu_vibration_z,
                    observationsCount: 1,
                    proofImageUrl: d.proof_image_url,
                    cropImageUrl: d.crop_image_url,
                    status: 'active',
                    reportStatus: 'draft',
                    inspectorNotes: d.inspectorNotes,
                    assignedAgency: d.assignedAgency,
                  });
                }
              });
            }
            if (Array.isArray(data.incidents)) {
              data.incidents.forEach((inc: any) => {
                if (!this.knownIncidentIds.has(inc.id)) {
                  this.knownIncidentIds.add(inc.id);
                  callbacks.onIncidentDetected({
                    id: inc.id,
                    type: inc.type,
                    coords: inc.coords,
                    timestamp: inc.timestamp,
                    reportedByBusId: inc.reported_by_bus_id,
                    locationName: inc.location_name,
                    speedKmH: inc.speed_km_h,
                    suspectPlate: inc.suspect_plate,
                    ocrConfidence: inc.ocr_confidence,
                    reason: inc.reason,
                    vehicleDescription: inc.vehicle_description,
                    isFlaggedWatchlist: inc.is_flagged_watchlist,
                    proofImageUrl: inc.proof_image_url,
                    cropImageUrl: inc.crop_image_url,
                    reportStatus: 'draft',
                    inspectorNotes: inc.inspectorNotes,
                    assignedAgency: inc.assignedAgency,
                  });
                }
              });
            }
          })
          .catch(() => {});
      }

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
          type: inc.type || 'overspeeding',
          coords: inc.coords || { ...reportingBus.coords },
          timestamp: Date.now(),
          reportedByBusId: reportingBus.busNumber,
          locationName: inc.locationName || 'Chandigarh Sector Corridor',
          suspectPlate: inc.suspectPlate,
          ocrConfidence: inc.ocrConfidence,
          speedKmH: inc.speedKmH,
          vehicleDescription: inc.vehicleDescription,
          reason: inc.reason,
          isFlaggedWatchlist: inc.isFlaggedWatchlist,
          proofImageUrl: inc.proofImageUrl,
          cropImageUrl: inc.cropImageUrl,
          reportStatus: inc.reportStatus || 'draft',
          inspectorNotes: inc.inspectorNotes,
          assignedAgency: inc.assignedAgency,
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
