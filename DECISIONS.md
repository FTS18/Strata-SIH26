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

