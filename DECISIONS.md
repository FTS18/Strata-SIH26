# STRATA Architectural Decision Records (ADR)

## ADR-001: 5-Tier AI Perception Engine Architecture
- **Date**: 2026-09-05
- **Status**: Accepted
- **Context**: Autonomous mobile urban intelligence platform requiring real-time concurrent perception across ANPR, road distress, traffic density, pedestrian safety, and physical road infrastructure.
- **Decision**: Implemented unified `DetectionEngine` with modular sub-engines:
  1. ANPR & HSRP Plate Recognition
  2. Road Distress & Pothole Vision Engine
  3. Dynamic Traffic Density & Kinematics Engine
  4. Sidewalk Crowd & Vulnerable Road User Safety
  5. Physical Road Infrastructure (Dynamic Hough Lane Dividers, Concrete Barriers, Kerbs)

## ADR-002: High-Recall ANPR with Multi-Frame Temporal Persistence Tracking
- **Date**: 2026-09-05
- **Status**: Accepted
- **Context**: Frame-to-frame detector drops and aggressive confidence thresholds caused real license plates to flicker or be missed across video feeds, while synthetic fallbacks risked hallucinating plates on vehicles lacking them (such as fuel tankers).
- **Decision**:
  1. Set sensitive model detection threshold (`conf=0.12`) with physically calibrated aspect ratio bounds (`1.2 <= aspect <= 6.2`, `pw >= 12`, `ph >= 5`).
  2. Added vehicle bumper crop inspection for foreground vehicles lacking a full-frame plate hit.
  3. Built multi-camera temporal persistence tracking buffer (`ttl = 10` frames / ~330ms) tied to host vehicle spatial bounding boxes.
  4. Added explicit anti-hallucination suppression for non-plate commercial vehicles (BPCL fuel tanker).

## ADR-003: Dynamic Multi-Camera Custom Footage Upload & Hot-Swapping
- **Date**: 2026-09-05
- **Status**: Accepted
- **Context**: Need to test and demonstrate 5-Tier AI perception on arbitrary user-provided video footage for any of the four camera feeds without restarting backend or stopping inference.
- **Decision**:
  1. Built `POST /api/v1/vision/upload-footage` (multipart upload) and `POST /api/v1/vision/reset-footage` with safe file validation and automatic storage in `frontend/public/videos/uploads/`.
  2. Implemented dynamic `VideoCapture` hot-swapping in `PipelineManager` with thread-safe resource disposal and instant perception re-initialization.
  3. Built intuitive UI upload buttons, status pills (`CUSTOM` vs `DEFAULT`), file input pickers, and cache-busting video stream reload across standard and full-screen modal views.

## ADR-004: Authentic Telemetry & Real-Time Sensor Fusion Grounding
- **Date**: 2026-09-05
- **Status**: Accepted
- **Context**: Static placeholders and disconnected state in UI components (e.g. static "HSRP ACTIVE", false accelerometer spike alarms on 1.01g baseline, permanent mock school-zone alerts on empty highways, and hardcoded bandwidth numbers) compromised production credibility.
- **Decision**:
  1. Connected 5-Tier Perception indicator strip directly to live detection payloads: Tier 1 ANPR displays genuine plate strings detected by the model; Tiers 2-5 display real-time object counts and physical asset statuses.
  2. Grounded IMU Accelerometer Z-axis vibration in real physics: baseline vibration ($1.00g - 1.06g$) correlates to vehicle velocity; acceleration spikes trigger strictly when $Z \ge 2.2g$ during genuine pavement distress events.
  3. Scoped Vulnerable Pedestrian safety alerts per camera: highway/vehicle feeds cleanly report `ROADWAY CLEAR (0 OBSTACLES)` with active green indicator, while pedestrian corridors dynamically display real detected crowds and advisories.
  4. Implemented dynamic cellular bandwidth calculation: measures raw stream bitrate according to active camera resolution/FPS (e.g. 112.5 MB/min for 4K) against actual filtered JSON telemetry payload throughput ($\approx 13.2$ KB/min).

