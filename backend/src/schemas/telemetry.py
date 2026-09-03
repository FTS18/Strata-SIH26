from typing import Optional, Literal, Dict, Any, List
from pydantic import BaseModel, Field

class GeoPoint(BaseModel):
    lat: float = Field(..., ge=-90.0, le=90.0)
    lng: float = Field(..., ge=-180.0, le=180.0)

class BusTelemetryPacket(BaseModel):
    bus_id: str
    bus_number: str
    route_id: str
    coords: GeoPoint
    heading: float = Field(default=0.0, ge=0.0, le=360.0)
    speed_km_h: float = Field(default=0.0, ge=0.0)
    fps: float = Field(default=28.0, ge=0.0)
    cpu_temp_c: float = Field(default=42.0)
    bandwidth_kbps: float = Field(default=1.4)
    timestamp: float

class TrafficDensityPacket(BaseModel):
    bus_id: str
    route_id: str
    timestamp: float
    coords: GeoPoint
    cars_count: int = Field(default=0, ge=0)
    two_wheelers_count: int = Field(default=0, ge=0)
    buses_count: int = Field(default=0, ge=0)
    trucks_count: int = Field(default=0, ge=0)
    pedestrians_count: int = Field(default=0, ge=0)
    total_vehicles: int = Field(default=0, ge=0)
    average_speed_km_h: float = Field(default=0.0, ge=0.0)
    congestion_index: float = Field(default=0.0, ge=0.0, le=1.0)

class RoadDefectEvent(BaseModel):
    defect_id: str
    defect_type: Literal["pothole", "crack", "missing_divider", "damaged_sign", "waterlogging", "alligator_crack", "sunken_manhole"]
    coords: GeoPoint
    road_name: str
    severity: Literal["low", "moderate", "critical"]
    confidence_score: float = Field(..., ge=0.0, le=1.0)
    imu_vibration_z: float = Field(default=1.0)
    detected_by_bus_id: str
    timestamp: float
    crop_base64: Optional[str] = None

class IncidentEvent(BaseModel):
    incident_id: str
    incident_type: Literal["hit_and_run", "rash_driving", "overspeeding", "wrong_way", "vulnerable_pedestrian", "school_children_crossing"]
    coords: GeoPoint
    location_name: str
    reported_by_bus_id: str
    timestamp: float
    license_plate: Optional[str] = None
    ocr_confidence: Optional[float] = None
    vehicle_description: Optional[str] = None
    speed_km_h: Optional[float] = None
    is_flagged_watchlist: bool = False
    proof_crop_base64: Optional[str] = None
    reason: Optional[str] = None
    hotlist_details: Optional[Dict[str, Any]] = None

class PedestrianSafetyAlert(BaseModel):
    alert_id: str
    bus_id: str
    route_id: str = "ROUTE-12"
    zone_type: Literal["SCHOOL_ZONE_CROSSING", "MIDBLOCK_JAYWALKING", "TRANSIT_BOTTLENECK"] = "SCHOOL_ZONE_CROSSING"
    location: str = "Delhi Public School Corridor (Mathura Road)"
    pedestrians_count: int = 4
    children_detected: bool = True
    crosswalk_status: Literal["NORMAL", "FADED_MARKING", "MISSING_SIGNAGE"] = "FADED_MARKING"
    speed_limit_km_h: float = 25.0
    current_speed_km_h: float = 34.2
    driver_advisory: str = "BRAKE NOW: School Children in Crosswalk Ahead"
    in_cabin_alert_active: bool = True
    forward_to_pwd: bool = True
    pwd_work_order_id: Optional[str] = "WR-2026-904"
    coords: GeoPoint
    timestamp: float
    boxes: List[List[int]] = Field(default_factory=list)


