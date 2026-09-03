export type DefectSeverity = 'low' | 'medium' | 'moderate' | 'high' | 'critical';
export type SeverityLevel = DefectSeverity;

export type RoadDefectType =
  | 'pothole'
  | 'waterlogging'
  | 'missing_zebra_crossing'
  | 'damaged_divider'
  | 'missing_signboard'
  | 'pedestrian_blindspot';

export type DefectType = RoadDefectType;

export type IncidentType =
  | 'rash_driving'
  | 'hit_and_run'
  | 'illegal_parking'
  | 'lane_violation'
  | 'overspeeding'
  | 'school_children_crossing';

export interface GeoCoordinate {
  lat: number;
  lng: number;
  altitude?: number;
}

export interface RoadDefect {
  id: string;
  type: RoadDefectType;
  coords: GeoCoordinate;
  severity: DefectSeverity;
  confidenceScore: number;
  detectedAt: number;
  detectedByBusId: string;
  roadName: string;
  wardName: string;
  estimatedAreaSqM: number;
  imuVibrationZ: number;
  observationsCount: number;
  proofImageUrl?: string;
  status: 'active' | 'in_repair' | 'resolved';
}

export interface VehicleIncident {
  id: string;
  type: IncidentType;
  coords: GeoCoordinate;
  timestamp: number;
  reportedByBusId: string;
  locationName: string;
  suspectPlate?: string;
  ocrConfidence?: number;
  speedKmH?: number;
  videoProofUrl?: string;
  reason?: string;
  vehicleDescription?: string;
  isFlaggedWatchlist?: boolean;
}

export interface TrafficDensityMetrics {
  busId: string;
  routeId: string;
  timestamp: number;
  coords: GeoCoordinate;
  carsCount: number;
  twoWheelersCount: number;
  busesCount: number;
  trucksCount: number;
  pedestriansCount: number;
  totalVehicles: number;
  averageSpeedKmH: number;
  congestionIndex: number;
}


export interface BusTelemetry {
  id: string;
  busNumber: string;
  routeId: string;
  coords: GeoCoordinate;
  speedKmH: number;
  headingDeg: number;
  fps: number;
  passengerCount: number;
  activeCameraCount: number;
  lastPing: number;
}

export type BusTelemetryNode = BusTelemetry;

export interface BandwidthMetrics {
  edgeTelemetryBytes: number;
  rawStreamBytes: number;
  savingsPercentage: number;
  totalEventsProcessed: number;
}

export type BandwidthSavingsMetrics = BandwidthMetrics;

export interface RoadSegmentPCI {
  id: string;
  segmentName: string;
  pciScore: number;
  lastInspected: number;
  severityDistribution: Record<DefectSeverity, number>;
}

export type WorkOrderStatus = 'detected' | 'assigned' | 'in_progress' | 'verified_closed';

export interface WorkOrder {
  id: string;
  defectId: string;
  title: string;
  locationName: string;
  coords: GeoCoordinate;
  severity: DefectSeverity;
  defectType?: RoadDefectType;
  status: WorkOrderStatus;
  assignedContractor?: string;
  estimatedAsphaltTons?: number;
  estimatedCostInr?: number;
  createdAt: number;
  updatedAt?: number;
  deadlineAt?: number;
  verifiedAt?: number;
  beforePhotoUrl?: string;
  afterPhotoUrl?: string;
  verifiedByBusId?: string;
}

export type WorkOrderTicket = WorkOrder;
