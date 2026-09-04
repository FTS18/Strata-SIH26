# STRATA — Project Status Report
**SIH26124 | AI-Powered Mobile Urban Intelligence Platform | Bharat Electronics Limited**
**Audit Date:** 04 Sep 2026 | **Deadline:** 30 Sep 2026 | **Time Left: ~26 days**

---

## 🗺️ ARCHITECTURE OVERVIEW

```
strata/
├── frontend/          Next.js 15 + React 19 + Tailwind v4 + MapLibre GL + Zustand
├── backend/           FastAPI + WebSocket + OpenCV + YOLOv8 MJPEG Streaming (port 8000/8080)
├── edge-pipeline/     Python multi-camera inference engine (standalone, not yet wired to backend)
└── edge-simulator/    run_edge.py (bare bones, single file only)
```

---

## ✅ WHAT IS DONE (Solid / Working)

### Frontend — Core Shell
| Component | File | Status |
|-----------|------|--------|
| Root dashboard page | `app/page.tsx` | ✅ Complete |
| Login / auth wall | `features/auth/components/LoginPage.tsx` | ✅ Complete |
| Auth Zustand store | `features/auth/authStore.ts` | ✅ Complete |
| App sidebar (role-aware) | `components/layout/AppSidebar.tsx` | ✅ Complete |
| Right situational HUD | `components/layout/RightSidebar.tsx` | ✅ Complete |
| Top header | `components/layout/Header.tsx` | ✅ Complete |
| Status ticker (bottom) | `components/layout/StatusTicker.tsx` | ✅ Complete |
| Mobile bottom nav | `components/layout/MobileBottomNav.tsx` | ✅ Complete |
| Role switcher modal | `components/ui/RoleSwitcherModal.tsx` | ✅ Complete |
| URL-synced view routing | `app/page.tsx` (searchParams) | ✅ Complete |
| Sound effects system | `lib/soundEffects.ts` | ✅ Complete |
| PDF exporter | `lib/pdfExporter.ts` | ✅ Complete |
| Geo algorithms | `lib/geoAlgorithms.ts` | ✅ Complete |
| Central type definitions | `types/index.ts` | ✅ Complete |

### Frontend — GIS Map
| Feature | File | Status |
|---------|------|--------|
| MapLibre GL dark-gray ArcGIS basemap | `gis-map/MapViewport.tsx` | ✅ Complete |
| Live animated bus markers (rotating icon) | MapViewport | ✅ Complete |
| Road defect markers (click-to-inspect) | MapViewport | ✅ Complete |
| Vehicle incident markers | MapViewport | ✅ Complete |
| Chandigarh OSM road network overlay | `config/chandigarhOsmRoads.geojson` | ✅ Complete |
| Chandigarh bus path trajectories | `config/chandigarhBusPaths.json` | ✅ Complete |

### Frontend — Live Telemetry Engine
| Feature | File | Status |
|---------|------|--------|
| FleetTelemetryAdapter (GPS simulator) | `services/fleetTelemetryAdapter.ts` | ✅ Complete |
| 4-bus OSM-trajectory simulation (800ms tick) | FleetTelemetryAdapter | ✅ Complete |
| Road defect seeding & deduplication | `telemetryStore.ts` | ✅ Complete |
| Incident seeding & random emission | FleetTelemetryAdapter | ✅ Complete |
| Telemetry Zustand store | `fleet-telemetry/telemetryStore.ts` | ✅ Complete |
| Bandwidth savings metric tracking | TelemetryStore | ✅ Complete |

### Frontend — Role Consoles (5 Roles)
| Role | Main Console | Sub-Views | Status |
|------|-------------|-----------|--------|
| ICCC Admin / Command Center | `DualStreamCommandCenter.tsx` | — | ✅ Complete |
| PWD Engineer | `PwdConsole.tsx` | DefectEstimatorView, AutoAuditVerificationView, RoadHeatmapView | ✅ Complete |
| Police | `PoliceConsole.tsx` | WarrantHotlistView, EChallanView, ViolationHeatmapView | ✅ Complete |
| Fleet Manager | `FleetConsole.tsx` | CorridorDelaysView, CrowdDensityView | ✅ Complete |
| Field Crew | `FieldCrewConsole.tsx` | GpsDispatchView, PhotoAuditUploadView, MaterialInventoryView | ✅ Complete |
| Executive | `ExecutiveConsole.tsx` | WardComplianceView, BudgetForecastView, EdgeNetworkHealthView, PipelineObservabilityView | ✅ Complete |

### Frontend — State Management (Zustand Stores)
| Store | File | Status |
|-------|------|--------|
| Police store (warrants, challans, corridors) | `roles/stores/policeStore.ts` | ✅ Complete |
| Work order / PWD store | `roles/stores/workOrderStore.ts` | ✅ Complete |
| Fleet store | `roles/stores/fleetStore.ts` | ✅ Complete |
| Executive store | `roles/stores/executiveStore.ts` | ✅ Complete |
| Telemetry store | `fleet-telemetry/telemetryStore.ts` | ✅ Complete |

### Frontend — Video & AI Overlay
| Feature | File | Status |
|---------|------|--------|
| Live MJPEG video stream viewer | `video-stream/LiveVideoStreamView.tsx` | ✅ Complete |
| Dynamic inference HUD overlay | `video-stream/DynamicInferenceOverlay.tsx` | ✅ Complete |
| Lens quality optimizer panel | `video-stream/LensQualityOptimizer.tsx` | ✅ Complete |
| School zone safety alert | `pedestrian-safety/SchoolZoneSafetyAlert.tsx` | ✅ Complete |
| Circular ring buffer modal | `edge-hardware/CircularRingBufferModal.tsx` | ✅ Complete |
| Speed breaker whitelist modal | `road-defects/SpeedBreakerWhitelistModal.tsx` | ✅ Complete |
| Defect inspection drawer | `road-defects/DefectInspectionDrawer.tsx` | ✅ Complete |
| Live incident feed | `road-defects/LiveIncidentFeed.tsx` | ✅ Complete |

### Backend — FastAPI Server
| Feature | File | Status |
|---------|------|--------|
| FastAPI app with lifespan hooks | `backend/src/main.py` | ✅ Complete |
| CORS middleware | main.py | ✅ Complete |
| WebSocket broadcast hub `/ws/telemetry` | main.py | ✅ Complete |
| REST ingest routes (telemetry, traffic, defect, incident) | main.py | ✅ Complete |
| ANPR latest detection endpoint | main.py | ✅ Complete |
| Pedestrian safety endpoint | main.py | ✅ Complete |
| Vision detections endpoint | main.py | ✅ Complete |
| Pipeline observability + control endpoints | main.py | ✅ Complete |
| Pydantic schemas (BusTelemetry, TrafficDensity, RoadDefect, Incident) | `schemas/telemetry.py` | ✅ Complete |
| MJPEG server (port 8080) with active-cam prioritization | `pipeline_manager.py` | ✅ Complete |
| YOLOv8 vehicle detection + plate detection inference loop | `pipeline_manager.py` | ✅ Complete |
| EasyOCR license plate text extraction | pipeline_manager.py | ✅ Complete |
| Detection HUD drawing (bounding boxes, corner reticles, badges) | pipeline_manager.py | ✅ Complete |
| Pedestrian detection → auto-alert telemetry | pipeline_manager.py | ✅ Complete |
| Pipeline registry + start/stop/tune control | pipeline_manager.py | ✅ Complete |

### Edge Pipeline (Standalone)
| Feature | File | Status |
|---------|------|--------|
| Multi-camera YOLO inference loop | `edge-pipeline/video_pipeline.py` | ✅ Complete |
| ANPR + Levenshtein fuzzy hotlist matcher | `edge-pipeline/anpr_ocr_engine.py` | ✅ Complete |
| IMU vibration fusion gate | `edge-pipeline/imu_fusion.py` | ✅ Complete |
| Traffic vehicle tracker | `edge-pipeline/traffic_vehicle_tracker.py` | ✅ Complete |
| Pothole detector training script | `edge-pipeline/train_pothole_detector.py` | ✅ Complete |
| YOLOv8n weights | `edge-pipeline/yolov8n.pt` | ✅ Present |
| License plate detector weights | `edge-pipeline/license_plate_detector.pt` | ✅ Present |
| Sample dashcam video | `edge-pipeline/sample_dashcam.mp4` | ✅ Present |

---

## 🔴 CRITICAL GAPS — What's Missing / Broken

### 1. Frontend ↔ Backend WebSocket is NOT CONNECTED
- The `FleetTelemetryAdapter` runs **entirely in-browser** as a JS timer simulation. It does **not** connect to `ws://localhost:8000/ws/telemetry`.
- The backend's WebSocket endpoint and REST ingest routes exist but **no frontend code calls them**.
- **Expected:** Frontend connects to backend WS, receives real YOLOv8 detections from real video.
- **Impact:** The "live" data on the map is 100% mocked. Judges will see through this immediately if they test with backend running.

### 2. Edge Pipeline is Decoupled from Backend
- `edge-pipeline/video_pipeline.py` is a standalone script with no HTTP client / POST to backend.
- It does NOT push detections to `/api/v1/ingest/defect` or `/api/v1/ingest/incident`.
- `edge-simulator/run_edge.py` is a single 2KB file — barely a stub.
- **Expected:** Edge pipeline POSTs structured events to the FastAPI backend after every inference frame.
- **Impact:** The full data flow (Camera → Edge AI → Backend → WebSocket → Dashboard) is broken end-to-end.

### 3. No Real-Time Traffic Density Feed
- `TrafficDensityPacket` schema exists in backend.
- `POST /api/v1/ingest/traffic` endpoint exists.
- `trafficDensity` state exists in the Zustand store.
- But: **nothing emits traffic data**. The store is seeded with one hardcoded object, never updated in real time.

### 4. Backend Has No Persistent Storage / Database
- All state (incidents, defects, pipelines) lives in Python runtime memory.
- If the backend restarts, all accumulated data is lost.
- For the demo this is acceptable, but there's **no SQLite/Redis even for demo persistence**.

### 5. `edge-simulator/run_edge.py` is Essentially Empty
- Only 2067 bytes. Single file, no implementation — it's just a placeholder that likely imports nothing meaningful.
- **Expected:** A proper simulation harness that replays realistic CCTV data and posts to backend.

### 6. No `.env` / Environment Configuration
- Backend `config.py` reads `MQTT_HOST`/`MQTT_PORT` from env but there's no `.env` file or `.env.example`.
- MQTT is configured but **MQTT broker is never actually started** (no broker integration in backend).
- `CORS_ORIGINS` is hardcoded for localhost only — deployment-unfriendly.

### 7. `PipelineObservabilityView.tsx` is 1,097 Lines (File Size Warning ⚠️)
- This violates the 150-200 line limit rule hard.
- Needs to be broken down into sub-components.

### 8. No `README.md` Setup Instructions
- `README.md` is 43KB — it likely has content, but there's no verified "how to run" guide for judges.
- No `docker-compose.yml` or one-command startup script.
- Judges need to be able to run this in minutes.

### 9. Missing Video Assets (Referenced but Not Verified)
- Backend and edge pipeline reference `frontend/public/videos/` for camera sources.
- No way to verify all 4 video files are actually present from this audit.
- If they're missing, the MJPEG server shows a blank "STRATA EDGE FEED READY" dummy frame.

### 10. No Testing
- Zero test files anywhere in the codebase.
- No `pytest` tests for backend routes.
- No component tests for frontend.

---

## 🟡 INCOMPLETE / PARTIALLY DONE

| Feature | What's There | What's Missing |
|---------|-------------|----------------|
| Live video stream view | MJPEG `<img>` polling from `localhost:8080` | WebSocket-driven frame switching when cam changes; error handling if backend is down |
| GpsDispatchView | Basic UI exists | No real GPS dispatch logic wired to work orders |
| PhotoAuditUploadView | UI exists | File upload is a mock — no backend `/api/v1/audit/photo` endpoint |
| MaterialInventoryView | Full UI with inventory table | No backend sync, purely in-memory |
| MQTT integration | Config exists in `config.py` | No broker started, no subscriber/publisher code in backend |
| `chandigarhOsmRoads.json` | 3.4MB raw OSM data present | Only the GeoJSON (199KB) version is used in map; the raw JSON is dead weight |
| IMU fusion gate | `imu_fusion.py` complete | Not integrated into backend `pipeline_manager.py` (uses simpler logic there) |
| Traffic Vehicle Tracker | `traffic_vehicle_tracker.py` complete (16KB!) | Not imported in `pipeline_manager.py` — it bypasses this entirely |
| Executive role nav | All 4 sub-views built | `ExecutiveConsole.tsx` itself is a stub shell (5.5KB) — may not have proper layout |
| ANPR → Warrant auto-match | Police store has warrant hotlist | Backend ANPR detections don't auto-cross-reference the police store hotlist |

---

## 📋 WHAT NEEDS TO BE DONE (Priority Order)

### 🔥 P0 — Critical (Do These First, Demo Will Fail Without Them)

- [ ] **Wire Frontend WebSocket to Backend**
  - Modify `FleetTelemetryAdapter` to also attempt `ws://localhost:8000/ws/telemetry`
  - Fall back to simulation if backend unreachable (keep current sim as fallback)
  - Expected: dashboard reacts to real YOLOv8 detections when backend is running

- [ ] **Wire Edge Pipeline → Backend HTTP POST**
  - Add `requests.post(backend_url + "/api/v1/ingest/defect", ...)` to `video_pipeline.py` after each pothole/incident detection
  - Add similar for traffic density every N frames
  - Expected: full data flow: Camera → YOLO → POST → FastAPI → WebSocket → Map pin

- [ ] **Fix `edge-simulator/run_edge.py`**
  - Should launch the backend AND edge pipeline together
  - Or at minimum be a proper test harness that replays detections to the backend

### 🔴 P1 — High Priority (Demo Quality)

- [ ] **Add `.env.example` and startup script**
  - Create `start.ps1` / `start.sh` that: starts FastAPI backend, starts edge pipeline, starts Next.js
  - Create `.env.example` with all required vars

- [ ] **Verify + document the video files**
  - Confirm all 4 video files exist in `frontend/public/videos/`
  - Add a download script or fallback if missing

- [ ] **Add real-time traffic density emission from edge pipeline to store**
  - Either via WebSocket or periodic REST poll from frontend

- [ ] **Connect PhotoAuditUpload to a backend endpoint**
  - Simple `POST /api/v1/audit/photo` that accepts base64 or multipart
  - Link to work order status update

- [ ] **Cross-reference ANPR detections with Police warrant hotlist on backend**
  - When `latest_anpr_detections` is updated, check against a configurable hotlist
  - Emit `WARRANT_MATCH_ALERT` via WebSocket

### 🟡 P2 — Medium Priority (Polish)

- [ ] **Refactor `PipelineObservabilityView.tsx`** (1097 lines → ≤5 components × ~200 lines each)
- [ ] **Integrate `TrafficVehicleTracker`** into `pipeline_manager.py` (it's written but bypassed)
- [ ] **Integrate `ImuFusionGate`** into backend pipeline (it's written but bypassed)
- [ ] **Remove `chandigarhOsmRoads.json`** (3.4MB dead weight, only GeoJSON is used)
- [ ] **Add SQLite persistence** for defects and incidents (via `aiosqlite` or `tortoise-orm`)
- [ ] **Add MQTT broker** (Mosquitto) for real bus telemetry publishing simulation

### 🟢 P3 — Nice to Have (Presentation Polish)

- [ ] Demo mode toggle (kiosk mode that auto-cycles through role views)
- [ ] Mobile layout testing + fixes
- [ ] Dark/light theme toggle (currently hardcoded dark)
- [ ] Print/export report from Executive view

---

## 📊 OVERALL COMPLETION ESTIMATE

| Layer | Completion |
|-------|-----------|
| Frontend UI (views, components, stores) | **~90%** |
| Backend API (routes, schemas, MJPEG server) | **~75%** |
| Edge AI Pipeline (inference, ANPR, IMU) | **~70%** |
| End-to-End Data Flow (Edge → Backend → Frontend) | **~15%** ❌ |
| Testing | **0%** |
| DevOps / Startup / Docs | **~20%** |
| **Overall** | **~55%** |

---

## ⚡ JUDGE EXPECTATION vs. CURRENT REALITY

| What PS 26124 Expects | Current State |
|----------------------|---------------|
| Real camera video processing on-bus | ✅ YOLOv8 runs on video files |
| GPS location + timestamp on every event | ✅ Simulated; backend schema ready |
| Centralized GIS dashboard | ✅ MapLibre map with live markers |
| Congestion heatmaps | ⚠️ ViolationHeatmapView exists; no real data |
| Road defect detection + PWD work orders | ✅ Full UI + store + PWD console |
| Vehicle incident ANPR + registration plate | ✅ OCR engine + police store |
| School children crossing safety alerts | ✅ SchoolZoneSafetyAlert component |
| Hit-and-run tracking with confident plate + GPS | ✅ Police warrant hotlist system |
| **Edge AI → Central Platform live data flow** | ❌ **Broken — not connected end-to-end** |
| Multi-authority role access | ✅ 5 roles fully implemented |
| Bandwidth reduction via edge processing | ✅ Metric calculated and displayed |

---

> **Bottom line:** The frontend and backend components individually look impressive and are largely complete. The critical missing piece is **the glue** — nothing talks to nothing in production. The edge pipeline doesn't POST to backend, the frontend doesn't connect to the WebSocket, and MQTT is config-only with no broker. Getting this E2E plumbing working in the next ~10 days is the single most important thing before the deadline.
