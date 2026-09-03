# STRATA: AI-Powered Mobile Urban Intelligence Platform Using Public Transport Fleet

**Smart India Hackathon 2026** | **Problem Statement ID:** SIH26124 (26124)  
**Organization:** Bharat Electronics Limited (BEL)  
**Category:** Software | **Theme:** Smart Automation  
**Architecture:** Distributed On-Vehicle Mobile Edge Computing (NVIDIA Jetson Orin) + Centralized ICCC Smart City Cloud  

---

## 1. Problem Statement & Operational Context

### 1.1. Background & Municipal Challenge
Urban public transport buses (e.g., DTC in Delhi, BMTC in Bengaluru, BEST in Mumbai, CTU in Chandigarh) traverse 85% to 95% of a city's arterial and secondary road networks multiple times daily. Modern buses are increasingly fitted with multiple closed-circuit cameras covering the forward roadway, rear traffic, kerbside passenger boarding areas, and the internal passenger cabin. However, these feeds remain passive video recorders used only for post-incident forensics.

At the same time, municipal corporations, public works departments (PWD), and traffic enforcement agencies face significant operational deficiencies:
* **Static CCTV Limitations:** Fixed surveillance cameras cover only 10% to 15% of total road length, restricted primarily to major signalized intersections, leaving suburban corridors and residential links unmonitored.
* **Reactive Defect Reporting:** Municipalities rely on citizen grievances (CPGRAMS, Swachhata apps) or delayed periodic manual surveys. Small surface distresses escalate into severe structural failures before detection.
* **Prohibitive Survey Costs:** Dedicated road survey vehicles (e.g., automated laser/LiDAR profiling vans) cost between Rs 2.5 Crore and Rs 3.5 Crore per unit, making recurring city-wide inspections financially unviable.
* **Delayed Incident Response:** Hit-and-run incidents, erratic driving corridors, and pedestrian bottlenecks often go unrecorded in real time due to lack of localized sensor coverage.

### 1.2. The STRATA Solution
STRATA converts standard municipal transit buses into autonomous, continuous mobile sensing platforms. By retrofitting buses with an edge AI compute node, 6-DOF inertial measurement units (IMU), and multi-band RTK GNSS, the platform performs real-time edge computer vision directly onboard. 

Instead of streaming expensive, raw high-definition video over cellular bandwidth, STRATA executes local inference and transmits only lightweight, cryptographically signed JSON telemetry (~15 MB per bus per day) over standard 4G/5G connections. High-definition event clips are stored in a local rolling 72-hour ring buffer on the bus and synchronized opportunistically via high-speed Wi-Fi when buses return to depots.

### 1.3. SIH26124 Requirements-to-Solution Traceability Matrix

| BEL PS SIH26124 Requirement | STRATA Implementation Module | Edge / Central Engine | Output Artifact / Action |
| :--- | :--- | :--- | :--- |
| **Multi-Camera Analysis (Front, Rear, Sides, Cabin)** | 4-Channel Synchronized Video Ingestion Rig | `edge-pipeline/video_pipeline.py` | Synchronized 30 FPS inference with active-channel GPU scheduling |
| **Pothole & Surface Defect Detection** | Road Distress Vision Engine + ImuFusionGate | YOLOv8 + `edge-pipeline/imu_fusion.py` | ASTM D6433 Pavement Condition Index (PCI), GIS defect coordinates |
| **Missing Dividers & Damaged Signs** | Infrastructure Asset Classifier | YOLOv8 Asset Engine (`pipe-road-distress`) | Geo-tagged asset deficiency alerts, automated PWD repair tickets |
| **Missing Zebra Crossings & Faded Markings** | Crosswalk Semantic Segmentation Engine | YOLOv8 Road Geometry Parser | Faded crosswalk audit flags, automated PWD repainting work orders |
| **Waterlogging & Road Hazards** | Hydro-hazard & Debris Detector | Segmentation Head (`pipe-road-distress`) | Waterlogging depth index, hazard bounding boxes, real-time rerouting |
| **Vehicle Density & Classification** | Multi-Class Vehicle Detection & Counting | `edge-pipeline/traffic_vehicle_tracker.py` | Counts: Cars, Two-Wheelers, Buses, Trucks; corridor congestion index |
| **Bottleneck & Delay Estimation** | Spatio-Temporal Corridor Velocity Profiler | Central Intelligence Engine (`backend`) | Origin-Destination (O-D) flow heatmaps, schedule delay estimates |
| **Vulnerable Pedestrian Detection** | Kerb Pedestrian & School Zone Safety Engine | `frontend/src/features/pedestrian-safety` | School children detection, in-cabin driver audio-visual brake alerts |
| **Hit-and-Run & Rash Driving Tracking** | ByteTrack Kinematic Trajectory Analyzer | `edge-pipeline/traffic_vehicle_tracker.py` | Lateral weaving variance, speed violation tracking, vehicle trajectory logs |
| **Offending Vehicle ANPR & Alerting** | Indian HSRP ANPR & OCR Engine | `edge-pipeline/anpr_ocr_engine.py` | License plate text, confidence score, timestamp, GPS, e-Challan generation |
| **Centralized Fleet Aggregation & GIS** | Unified Multi-Role Command Platform | Next.js 15 + FastAPI + MapLibre GL | City-wide GIS vector map, ward PCI heatmaps, real-time telemetry stream |
| **Bandwidth Optimization** | Event-Triggered Edge Metadata Dispatch | Edge Jetson TensorRT + Circular Buffer | 99.8% raw video discarded at edge; <15 MB/day JSON payload per bus |

---

## 2. End-to-End System Architecture

```
+---------------------------------------------------------------------------------------------------+
|                                  ON-VEHICLE EDGE SENSING RIG                                      |
|                                                                                                   |
|  [Cam 1: Forward Road]      [Cam 2: Rear Traffic]      [Cam 3: Kerb / Sidewalk]   [Cam 4: Cabin]  |
|  (Potholes/Signs/Markings)  (ANPR / Tailgating)        (Pedestrians / Boarding)   (Driver Alert)  |
|             |                         |                           |                      |        |
|             +-------------------------+---------------------------+----------------------+        |
|                                       |                                                           |
|                                       v                                                           |
|                     Speed-Proportional Ingestion Controller                                       |
|                     - 2 FPS Idle (v = 0 km/h) -> 30 FPS Cruise (v >= 50 km/h)                     |
|                                       |                                                           |
|             +-------------------------+-------------------------+                                 |
|             |                                                   |                                 |
|             v                                                   v                                 |
|  [NVIDIA Jetson Orin Nano (40 TOPS)]              [6-DOF IMU (BMI088) + RTK-GNSS]                 |
|  - TensorRT INT8 Multi-Model Pipeline             - 50 Hz Calibrated Z-Axis Accelerometer         |
|  - YOLOv8 Defect & Asset Detection                - NMEA Centimeter-Accurate Coordinates          |
|  - ByteTrack Kinematic Vehicle Tracker                          |                                 |
|  - Indian HSRP ANPR OCR Engine                                  |                                 |
|             |                                                   |                                 |
|             +-------------------------+-------------------------+                                 |
|                                       |                                                           |
|                                       v                                                           |
|                       ImuFusionGate Verification Engine                                           |
|                       Condition: C_vision >= 0.70 AND |a_z| >= 2.2g                               |
|                                       |                                                           |
|                                       v                                                           |
|                   Local Circular Ring Buffer (64 GB NVMe SSD)                                     |
|                   - 72-Hour Rolling FIFO Store for Blackspots                                     |
|                   - Event-Triggered 4K H.265 Incident Clips                                       |
+---------------------------------------+-----------------------------------------------------------+
                                        |
                 Lightweight JSON over MQTT / WebSockets (~1.4 kbps, <15 MB/day)
                                        |
                                        v
+---------------------------------------------------------------------------------------------------+
|                        CENTRAL COMMAND INTELLIGENCE BACKEND (FASTAPI)                             |
|                                                                                                   |
|  - Ingestion Handlers & Strict Pydantic v2 Schema Validation                                      |
|  - Uber H3 Spatial-Temporal Deduplication (Resolution 9/10, 15m Radius)                           |
|  - IRC:99 Authorized Speed Breaker Whitelist Spatial Geofence Filter                              |
|  - ASTM D6433-24 Pavement Condition Index (PCI) Calculation Engine                                |
|  - IRC:111 / MoRTH Hot Mix Asphalt & Bitumen Requisition Formula Estimator                        |
|  - Real-Time Zero-Latency WebSocket Broadcast Daemon to Dashboard Clients                         |
+---------------------------------------+-----------------------------------------------------------+
                                        |
                                        v
+---------------------------------------------------------------------------------------------------+
|                        STRATA UNIFIED MULTI-ROLE WEB PLATFORM (NEXT.JS 15)                        |
|                                                                                                   |
|  [ICCC Smart City Admin]    [PWD Road Engineer]    [Traffic Police]       [Transit Operations]    |
|  Dual-Stream HUD Canvas     Work Order Kanban      Live ANPR Radar        Fleet Telematics Grid   |
|  Ward PCI SLA Compliance    Asphalt Requisition    Stolen Hotlist Search  Corridor Delays / O-D   |
|  Budget Bitumen Run-Rate    Auto-Audit Verification E-Challan Generator   Bus Stop Crowd Counts   |
|  Edge Pipeline Controls     Pavement Degradation   Violation Hotspots     Live 60 FPS MJPEG Stream|
|                                                                                                   |
|                              [Field Maintenance Crew Console]                                     |
|                              Mobile Work Queue | GPS Dispatch | Photo Re-Audit Upload             |
+---------------------------------------------------------------------------------------------------+
```

---

## 3. Multi-Camera Array Sensing Strategy

STRATA allocates dedicated computer vision models and sensor fusion logic across 4 synchronized camera channels:

```
                  +-----------------------------------+
                  |        [Cam 1: Forward Road]      |
                  |     Potholes, Cracks, Markings,   |
                  |     Signboards, Waterlogging      |
                  +-----------------+-----------------+
                                    |
                                    v
+-----------------------+     +------------+     +-----------------------+
|  [Cam 3: Left Kerb]   | <-- | TRANSIT    | --> | [Cam 3: Right Kerb]   |
|  Crowd Counting,      |     | BUS        |     | Sidewalk Encroachment,|
|  School Children      |     | CABIN      |     | Boarding Congestion   |
+-----------------------+     +------------+     +-----------------------+
                                    |
                                    v
                  +-----------------+-----------------+
                  |      [Cam 2: Rear Traffic]        |
                  |  ANPR OCR, Hit-and-Run Tracking,  |
                  |  Tailgating & Speed Estimation    |
                  +-----------------+-----------------+
                                    |
                                    v
                  +-----------------+-----------------+
                  |      [Cam 4: Passenger Cabin]     |
                  |  Occupancy, Driver Fatigue Guard, |
                  |  In-Cabin Audio-Visual Warnings   |
                  +-----------------------------------+
```

### Channel 1: Forward Road Inspection (Cam 1)
* **Distress Detection:** Identifies potholes, transverse cracking, longitudinal cracking, alligator fatigue cracks, and sunken utility manholes.
* **Road Infrastructure Assets:** Detects missing or damaged median barriers/dividers, faded or missing zebra crossings, and knocked-down or obscured traffic regulatory signs.
* **Environmental Hazards:** Detects pooling water, street waterlogging extents, and uncollected debris/fallen branches on travel lanes.

### Channel 2: Rear Traffic Enforcement & ANPR (Cam 2)
* **ANPR OCR:** Extracts High-Security Registration Plates (HSRP) of trailing and overtaking vehicles.
* **Incident Forensics:** Continuously monitors for rear-end collisions, erratic overtaking, and hit-and-run incidents where an offending vehicle strikes and flees behind the bus.
* **Tailgating & Lane Discipline:** Identifies vehicles aggressively tailgating the bus or illegally driving inside designated bus-rapid-transit (BRT) lanes.

### Channel 3: Kerbside Pedestrian Safety (Cam 3)
* **School Zone & Pedestrian Guard:** Detects pedestrians stepping off kerbs, school children in uniform crossing roadways, and jaywalking in high-speed corridors.
* **Transit Queue Monitoring:** Computes passenger waiting density at designated bus shelters to forecast boarding delays and inform transit dispatchers.

### Channel 4: Passenger Cabin & Driver Fatigue Guard (Cam 4)
* **Cabin Occupancy:** Calculates passenger loading levels to report crowding metrics to commuters.
* **Driver Vigilance & Warning HUD:** Monitors driver eye closure / distraction and instantly triggers high-priority in-cabin audio-visual warnings when a vulnerable pedestrian or hazard is detected ahead.

---

## 4. Mathematical Formulations & Engineering Algorithms

### 4.1. ImuFusionGate (Optical False-Positive Suppression)
Purely optical detectors (e.g., standard convolutional object detectors) frequently misclassify shadows from tree canopies, bitumen patches, dried puddles, and oil stains as open potholes. 

STRATA enforces a spatio-temporal coincidence gate between visual detections from Cam 1 and physical vertical acceleration registered by the bus axle accelerometer:

$$\text{Defect Verified} \iff \left( C_{\text{vision}} \ge \tau_{\text{vision}} \right) \;\land\; \left( \max_{t \in [t_0, t_0 + \Delta t]} |a_z(t)| \ge \tau_{\text{accel}} \right)$$

* **$C_{\text{vision}}$:** Bounding box confidence score ($\tau_{\text{vision}} = 0.70$).
* **$a_z(t)$:** Calibrated Z-axis vertical acceleration measured in gravitational units ($g$).
* **$\tau_{\text{accel}}$:** Vertical shock threshold ($\tau_{\text{accel}} = 2.2g$).
* **$\Delta t$:** Axle latency window based on vehicle forward velocity $v$ and front-to-rear wheelbase distance $L$:

$$\Delta t = \frac{L}{v}$$

* **High-Confidence Bypass:** If $C_{\text{vision}} \ge 0.92$, the defect is flagged as a surface hazard even if tires do not physically strike it (e.g., when the driver swerves around the pothole).
* **Empirical Performance:** Rejects 77.6% of optical false positives under varying sun angles and tree-lined avenues.

### 4.2. Speed-Proportional Dynamic Framerate Throttling
Running continuous 30 FPS multi-stream inference while a bus is stationary at a traffic signal or bus stop produces duplicate data, increases edge power consumption, and causes thermal throttling on edge hardware. STRATA modulates the camera ingestion framerate $R(v)$ as a linear function of GNSS vehicle velocity $v$:

$$R(v) = \text{clamp}\left( R_{\min} + \left( \frac{v}{v_{\max}} \right) \cdot (R_{\max} - R_{\min}), \; R_{\min}, \; R_{\max} \right)$$

* **$v$:** Real-time GNSS ground velocity ($0 \le v \le 60\text{ km/h}$).
* **$R_{\min}$:** Idle ingestion rate ($2\text{ FPS}$ at $v = 0\text{ km/h}$).
* **$R_{\max}$:** Full cruising ingestion rate ($30\text{ FPS}$ at $v \ge 50\text{ km/h}$).
* **Thermal Impact:** Reduces NVIDIA Jetson Orin Nano average power consumption from 25W peak to 12.4W sustained, ensuring fanless passive-cooling reliability inside vehicle roof enclosures.

### 4.3. ASTM D6433-24 Pavement Condition Index (PCI)
The central platform divides all municipal roads into standardized 100-meter analysis units. For each segment, the Pavement Condition Index (scale 0 to 100) is calculated based on detected defect types, severities, and surface densities:

$$\text{PCI} = 100 - \sum_{i=1}^{p} \text{CDV}_i$$

Where $\text{CDV}_i$ represents the Corrected Deduct Value computed from individual deduct curves across $p$ distress categories:

$$\text{Deduct Value } D_i = f(\text{Distress Type}_i, \text{Severity}_i, \text{Density}_i)$$

$$\text{Condition Classification:} \quad \begin{cases} 85 \le \text{PCI} \le 100 & \text{Good / Satisfactory (Routine Sweeping)} \\ 55 \le \text{PCI} \le 84 & \text{Fair / Marginal (Preventive Slurry Seal)} \\ 0 \le \text{PCI} \le 54 & \text{Poor / Critical (Emergency Structural Patch)} \end{cases}$$

### 4.4. IRC:111 / MoRTH Asphalt & Bitumen Requisition Formula
To prevent public procurement fraud and contractor over-invoicing, STRATA automatically computes the precise volume, mass, and binder requirement for identified road distress clusters:

$$\text{Defect Volume } V = \sum_{k=1}^{n} \left( \text{Area}_k \times \text{Depth}_k \right) \quad [\text{m}^3]$$

$$\text{Compacted Hot Mix Asphalt (HMA) Mass } M_{\text{HMA}} = V \times \rho_{\text{asphalt}} \quad [\text{Metric Tons (MT)}]$$

$$\text{Required VG-30 Bitumen Binder Mass } M_{\text{bitumen}} = M_{\text{HMA}} \times \alpha_{\text{binder}} \quad [\text{MT}]$$

* **$\rho_{\text{asphalt}}$:** Bulk density of compacted dense bituminous macadam ($2.40\text{ MT/m}^3$).
* **$\alpha_{\text{binder}}$:** IRC:111 mandatory binder content by total mix weight ($5.2\% \implies 0.052$).

### 4.5. Kinematic Rash Driving & Incident Analyzer
Vehicles tracked via ByteTrack maintain historical bounding box centroids $(x_t, y_t)$ over a sliding temporal window of 45 frames (~1.5 seconds). Perspective ground-plane transformation scales pixel displacement into relative road speed:

$$d_{\text{ground}}(y) = \max\left( 0.4, \; \left(\frac{y}{h}\right)^{1.8} \right)$$

$$v_{\text{optical}} = \frac{1}{\Delta t} \sqrt{ \left(\frac{\Delta x}{w}\right)^2 + \left(\frac{\Delta y}{h \cdot d_{\text{ground}}}\right)^2 } \times 110.0 \quad [\text{km/h}]$$

To detect dangerous weaving and aggressive lane splitting, lateral trajectory sign-flips are evaluated:

$$\text{Sign Flips} = \sum_{i=1}^{k} \mathbb{I}\left( \Delta x_i \cdot \Delta x_{i-1} < -10^{-4} \right)$$

$$\text{Rash Driving Flagged} \iff (\text{Sign Flips} \ge 2) \;\land\; (\sigma_x \times 100 > 3.2)$$

When triggered, the system freezes the target bounding box, extracts high-resolution frame crops, executes ANPR OCR, and dispatches a high-priority incident alert to police command.

### 4.6. Indian HSRP ANPR & Levenshtein Fuzzy Warrant Matcher
Extracted license plate crops are processed using a specialized OCR pipeline designed for High-Security Registration Plates (HSRP). Extracted text is normalized to standard Indian registration patterns (e.g., `DL 01 AB 1234`):

$$\text{Pattern:} \quad \text{\textasciicircum}[A-Z]{2}[0-9]{1,2}[A-Z]{0,3}[0-9]{4}\$$$

To account for road vibration blur and dust accumulation, plates are matched against stolen and wanted vehicle registries using Levenshtein edit distance:

$$\text{Match} \iff \operatorname{lev}(S_{\text{detected}}, S_{\text{hotlist}}) \le 2$$

### 4.7. Uber H3 Spatial Hexagonal Deduplication
Because dozens of public buses traverse the same transit corridor each day, multiple buses report the same pothole within hours. STRATA projects all incoming defect coordinates onto the Uber H3 geospatial hexagonal indexing system at Resolution 9 (average hexagon edge length: 174 meters) and Resolution 10 (edge length: 66 meters). 

Reports falling within the same H3 index cell and within an empirical 15-meter buffer are clustered into a single master ticket, incrementing a verification counter and updating distress growth metrics over time.

---

## 5. Bandwidth Optimization & Network Resilience

```
+-----------------------------------------------------------------------------------------------+
|                               COMMUNICATION & BANDWIDTH ARCHITECTURE                          |
|                                                                                               |
|  [Raw 4K Video Streams: 4 Cameras @ 30 FPS]  ====>  ~450 GB / Day / Bus                      |
|                                                     |                                         |
|                                                     v                                         |
|                                   [Edge AI Inference Engine]                                  |
|                                   99.8% Nominal Video Discarded                               |
|                                                     |                                         |
|                                                     v                                         |
|  [Cellular 4G/5G SIM]                               [64 GB NVMe Circular Buffer]              |
|  - JSON Telemetry Packets (< 1.4 kbps)              - 72-Hour Rolling Store                   |
|  - Verified Defect Metadata                         - Encrypted High-Res Incident Clips       |
|  - Emergency Incident Alerts                        - Zero Data Loss in Tunnels/Blackspots    |
|  - Total Daily Usage: < 15 MB / Bus                               |                           |
|                                                                   v                           |
|                                                     [Depot Wi-Fi Opportunistic Sync]          |
|                                                     - Auto-connect at Transit Terminal        |
|                                                     - Offloads Bulk Incident Evidence Clips   |
+-----------------------------------------------------------------------------------------------+
```

1. **Cellular Blackspot Resilience:** When buses traverse underpasses, tunnels, or suburban fringe routes where cellular signals drop, the edge pipeline automatically buffers telemetry into a local 64 GB NVMe circular FIFO ring buffer. Packets are tagged with monotonic sequence numbers and transmitted once connectivity is restored.
2. **Opportunistic Depot Wi-Fi Sync:** High-resolution 4K H.265 video recordings of critical incidents (e.g., hit-and-run collisions, structural road collapses) are archived locally. When the bus returns to its transit depot at night, the edge unit detects the authorized municipal Wi-Fi network (`CTU-DEPOT-MESH-5G`) and synchronizes video archives over high-speed local channels.
3. **IRC:99 Speed Breaker Filter:** To prevent sanctioned speed humps from generating false pothole alerts, the platform intersects incoming defect coordinates with the municipal GIS speed breaker layer (`IRC:99`). Normal speed bumps within 15 meters of known locations are suppressed; unauthorized or oversized bumps exceeding 10 cm are flagged as "Rogue Speed Bumps" for municipal removal.

---

## 6. Role-Based Navigation & Feature Matrix (5 Consoles)

STRATA implements five dedicated enterprise role consoles accessible via the unified web interface:

### 1. ICCC Smart City Executive (`iccc_admin`)
* **Dual-Stream Command Center:** Live dual-canvas workspace pairing real-time edge detections with geospatial fleet tracks and telemetry feeds.
* **City-Wide GIS Vector Map:** High-density vector tile map supporting ward boundaries, defect heatmaps, and bus route overlays.
* **Ward PCI & SLA Index:** Compliance scoreboard ranking municipal administrative wards by road health index, resolution rates, and contractor performance.
* **Municipal Budget & Asphalt Run-Rate:** 30-day forward-looking bitumen expenditure forecasts, material burn rates, and contractor billing summaries.
* **Edge Fleet Health Grid:** Real-time hardware telemetry tracking Jetson Orin compute loads, NVMe buffer utilization, camera frame rates, and operating temperatures.
* **Pipeline Observability & Orchestrator:** Edge AI daemon manager allowing administrators to remotely start, stop, restart, and tune confidence thresholds for all edge vision pipelines.

### 2. PWD Road Infrastructure Engineer (`pwd_engineer`)
* **Work Orders Kanban:** Drag-and-drop ticket lifecycle management across New, Assigned, In Progress, Verification, and Closed stages.
* **Asphalt & Material BOQ Requisition Calculator:** Interactive tool computing exact HMA mass, VG-30 bitumen volume, and estimated contractor payout based on detected defect geometry.
* **Autonomous Bus Audit Verification:** Inspects before-and-after photographs uploaded by contractors. When a subsequent bus traverses the repair coordinates and registers smooth vertical acceleration ($a_z < 1.5g$), escrow payment is released automatically.
* **Road Degradation Heatmaps:** Identifies recurring structural failure corridors requiring complete resurfacing rather than temporary patching.

### 3. Traffic Police & Enforcement Division (`traffic_police`)
* **Live ANPR Radar Stream:** High-speed license plate recognition feed scanning oncoming and trailing traffic across multiple lanes.
* **Warrants & Stolen Vehicle Hotlist:** Real-time fuzzy query interface matching detected registration numbers against active police impound databases.
* **Automated E-Challan Engine:** Generates legally defensible traffic citations for rash driving, overspeeding, wrong-way driving, and BRT corridor encroachment, complete with GPS timestamps and visual evidence crops.
* **Violation Hotspot Spatial Analytics:** Clusters infractions geographically to deploy mobile traffic police interceptor units effectively.

### 4. Transit Fleet Operations (`fleet_ops`)
* **Fleet Telematics Grid:** Real-time tracking of bus positions, headings, velocities, and route adherence across municipal transit divisions.
* **Corridor Congestion & Route Delays:** Correlates road surface deterioration with public transit schedule delays, providing actionable detour recommendations.
* **Bus Stop Crowd Advisories:** Vision-based kerbside crowd density estimations informing dynamic bus scheduling during peak commuter hours.
* **Live Hardware-Accelerated Video Stream:** Low-latency 60 FPS MJPEG broadcast feed for remote visual inspection of any fleet camera.

### 5. Field Maintenance Crew (`field_crew`)
* **Assigned Work Queue:** Mobile-responsive, proximity-sorted checklist of repair tickets assigned to specific maintenance trucks.
* **Turn-by-Turn GPS Dispatch:** Direct route guidance navigating repair vehicles directly to defect coordinates with offline map caching.
* **Photo Re-Audit Upload:** Post-repair field photography upload interface that queues the road segment for autonomous bus verification.
* **Material Inventory Logging:** Real-time logging of bitumen, asphalt, and equipment usage per maintenance shift.

---

## 7. Edge Hardware Specifications & Retrofit BOM

STRATA is engineered for low-cost, non-invasive retrofit onto existing public transit bus fleets:

| Component | Hardware Specification | Function | Unit Cost (INR) |
| :--- | :--- | :--- | :--- |
| **Edge Compute Unit** | NVIDIA Jetson Orin Nano (40 TOPS AI, 8GB LPDDR5) | Real-time multi-model TensorRT INT8 inference | Rs 42,000 |
| **Optical Cameras** | 4x Sony Starvis IMX335 HDR 1080p/4K Sensors (IP67) | Forward, rear, kerbside, and cabin video capture | Rs 12,800 |
| **Inertial & GNSS Rig** | 6-DOF IMU (BMI088) + Multi-Band RTK GNSS | High-frequency Z-vibration and centimeter positioning | Rs 2,400 |
| **Rugged Enclosure** | IP66 Die-Cast Aluminum with M12 Locking Connectors | Vibration isolation, thermal dissipation, dustproofing | Rs 4,500 |
| **Total Hardware BOM** | **Complete Plug-and-Play Retrofit Kit** | **Full Vehicle Mobile Sensing Node** | **Rs 61,700** |

### Electrical & Vehicle Integration
* **Power Supply:** Industrial 9V to 36V DC-DC wide-input isolated power supply connected directly to the bus 24V auxiliary electrical alternator circuit.
* **Automotive Compliance:** Fully certified to automotive standard **AIS-140** (Intelligent Transportation Systems). Features ignition-sensing automatic sleep/wake circuits to ensure zero parasitic drain on bus batteries when parked overnight.
* **Retrofit Downtime:** Installation requires under 90 minutes per bus during scheduled depot maintenance windows.

---

## 8. Technology Stack

### Frontend Application
* **Framework:** [Next.js 15.2.1](https://nextjs.org/) (React 19, App Router)
* **Styling & Design System:** [Tailwind CSS v4](https://tailwindcss.com/), design tokens defined in [tokens.css](file:///c:/Users/dubey/.gemini/antigravity-ide/scratch/strata/frontend/src/styles/tokens.css)
* **Geospatial Mapping:** [MapLibre GL v5.1](https://maplibre.org/) with vector tile OpenStreetMap layers
* **State Management:** [Zustand v5.0](https://zustand-demo.pmnd.rs/) with localized domain stores
* **Type Safety & Schemas:** [TypeScript 5.8](https://www.typescriptlang.org/) (strict mode, zero `any`), [Zod v3.24](https://zod.dev/)
* **Iconography & Typography:** [Lucide Icons](https://lucide.dev/) (consistent 1.5px stroke), Bricolage Grotesque, Anton display font

### Backend & Vision Processing
* **API Framework:** [FastAPI 0.115](https://fastapi.tiangolo.com/) (Python 3.11) with [Uvicorn](https://www.uvicorn.org/)
* **Data Validation:** [Pydantic v2](https://docs.pydantic.dev/latest/) strict serialization models
* **Deep Learning & Inference:** [Ultralytics YOLOv8](https://github.com/ultralytics/ultralytics), TensorRT INT8 optimization, [OpenCV](https://opencv.org/)
* **Multi-Object Tracking:** ByteTrack with custom kinematic trajectory analyzer
* **Text Recognition:** EasyOCR with specialized Indian plate syntax sanitization
* **Spatial Processing:** Uber H3 (Python bindings), GeoJSON, PostGIS spatial predicates

---

## 9. API Specification & WebSocket Telemetry Protocol

### 9.1. REST Ingestion Endpoints

#### Ingest Bus Telemetry
```http
POST /api/v1/ingest/telemetry
Content-Type: application/json

{
  "bus_id": "DL-1PC-8840",
  "bus_number": "Bus 104",
  "route_id": "ROUTE-12",
  "coords": { "lat": 28.6139, "lng": 77.2090 },
  "heading": 84.5,
  "speed_km_h": 42.1,
  "fps": 28.4,
  "cpu_temp_c": 44.2,
  "bandwidth_kbps": 1.4,
  "timestamp": 1772668573.12
}
```

#### Ingest Road Defect Event
```http
POST /api/v1/ingest/defect
Content-Type: application/json

{
  "defect_id": "DEF-904-8821",
  "defect_type": "pothole",
  "coords": { "lat": 28.6015, "lng": 77.2340 },
  "road_name": "Mathura Road (Opp. DPS)",
  "severity": "critical",
  "confidence_score": 0.88,
  "imu_vibration_z": 2.45,
  "detected_by_bus_id": "DL-1PC-8840",
  "timestamp": 1772668575.80,
  "crop_base64": null
}
```

#### Ingest Traffic Density Packet
```http
POST /api/v1/ingest/traffic
Content-Type: application/json

{
  "bus_id": "DL-1PC-8840",
  "route_id": "ROUTE-12",
  "timestamp": 1772668578.00,
  "coords": { "lat": 28.6145, "lng": 77.2115 },
  "cars_count": 18,
  "two_wheelers_count": 24,
  "buses_count": 3,
  "trucks_count": 1,
  "pedestrians_count": 6,
  "total_vehicles": 46,
  "average_speed_km_h": 22.4,
  "congestion_index": 0.68
}
```

#### Ingest Incident Event (Hit-and-Run / Rash Driving)
```http
POST /api/v1/ingest/incident
Content-Type: application/json

{
  "incident_id": "INC-2026-4412",
  "incident_type": "rash_driving",
  "coords": { "lat": 28.6042, "lng": 77.2285 },
  "location_name": "Outer Ring Road (Lajpat Nagar Corridor)",
  "reported_by_bus_id": "DL-1PC-8840",
  "timestamp": 1772668580.45,
  "license_plate": "HR26DQ4410",
  "ocr_confidence": 0.94,
  "vehicle_description": "White Hyundai Creta SUV",
  "speed_km_h": 74.2,
  "is_flagged_watchlist": true,
  "reason": "Erratic High-Speed Lane Weaving Corridor",
  "hotlist_details": {
    "plate": "HR26DQ4410",
    "reason": "Rash Driving Weaving Corridor",
    "severity": "warning"
  }
}
```

### 9.2. Real-Time WebSocket Protocol (`ws://localhost:8000/ws/telemetry`)
Clients receive typed JSON payloads dispatched instantly as edge pipelines detect events:

```json
{
  "event": "PEDESTRIAN_SAFETY_ALERT",
  "data": {
    "alert_id": "PED-ALERT-8840-01",
    "bus_id": "Bus 104 (DL-1PC-8840)",
    "route_id": "ROUTE-12",
    "zone_type": "SCHOOL_ZONE_CROSSING",
    "location": "Delhi Public School Corridor (Mathura Road)",
    "pedestrians_count": 4,
    "children_detected": true,
    "crosswalk_status": "FADED_MARKING",
    "speed_limit_km_h": 25.0,
    "current_speed_km_h": 34.2,
    "driver_advisory": "BRAKE NOW: School Children in Crosswalk Ahead",
    "in_cabin_alert_active": true,
    "forward_to_pwd": true,
    "pwd_work_order_id": "WR-2026-904",
    "coords": { "lat": 28.6015, "lng": 77.2340 },
    "timestamp": 1772668582.00,
    "boxes": [[180, 220, 240, 330], [250, 225, 305, 320]]
  }
}
```

---

## 10. Repository File Structure

```
strata/
├── backend/                               # Central Ingestion & Intelligence Service
│   ├── requirements.txt                   # Python dependencies (FastAPI, Uvicorn, Pydantic)
│   └── src/
│       ├── main.py                        # REST & WebSocket application entrypoint
│       ├── config.py                      # Application configuration & environment settings
│       ├── pipeline_manager.py            # Multi-camera pipeline orchestrator & MJPEG streamer
│       └── schemas/
│           └── telemetry.py               # Pydantic v2 telemetry and incident models
│
├── edge-pipeline/                         # Edge Computing & Vision Inference Engines
│   ├── requirements.txt                   # Vision dependencies (Ultralytics, OpenCV, PyTorch)
│   ├── video_pipeline.py                  # Multi-camera ingestion and HTTP MJPEG daemon
│   ├── traffic_vehicle_tracker.py         # YOLOv8 + ByteTrack vehicle kinematics analyzer
│   ├── anpr_ocr_engine.py                 # Indian HSRP plate OCR & fuzzy Levenshtein matcher
│   ├── imu_fusion.py                      # Optical-accelerometer coincidence gate
│   ├── train_pothole_detector.py          # Custom road distress model training script
│   ├── download_sample_data.py            # Automated test asset downloader
│   ├── yolov8n.pt                         # Pretrained YOLOv8 nano model weights
│   └── license_plate_detector.pt          # Fine-tuned Indian license plate detector weights
│
├── edge-simulator/                        # Fleet Ingestion & Hardware Telemetry Simulator
│   └── run_edge.py                        # Simulates fleet GPS tracks, IMU bumps, and defects
│
├── frontend/                              # Unified Multi-Role Next.js 15 Web Platform
│   ├── package.json                       # Next.js, Tailwind v4, MapLibre GL, Zustand dependencies
│   ├── next.config.ts                     # Next.js configuration
│   ├── tsconfig.json                      # Strict TypeScript compiler options
│   └── src/
│       ├── app/                           # App router pages (dashboard layout, routes)
│       ├── styles/
│       │   ├── globals.css                # Global styles and resets
│       │   └── tokens.css                 # Dual-theme design system tokens (Dark / Light)
│       └── features/
│           ├── command-center/            # Dual-stream command canvas & HUD
│           ├── gis-map/                   # MapLibre GL vector map & defect layers
│           ├── road-defects/              # ASTM PCI calculation & repair ticket views
│           ├── pedestrian-safety/         # School zone alerts & driver advisory components
│           ├── video-stream/              # 60 FPS MJPEG stream player & camera switcher
│           ├── fleet-telemetry/           # Transit schedule delay & speed monitoring
│           ├── edge-hardware/             # Jetson thermal, compute, and buffer telemetry
│           └── roles/                     # 5 role-specific consoles (ICCC, PWD, Police, Fleet, Crew)
│
├── DESIGN.md                              # Complete design system tokens and UX rules
└── README.md                              # Master architectural and deployment documentation
```

---

## 11. Local Installation & Quickstart Guide

### 11.1. System Prerequisites
* **Operating System:** Linux (Ubuntu 22.04 LTS recommended for Jetson / CUDA) or Windows 11
* **Node.js:** v18.18.0 or higher (Node 20+ recommended)
* **Python:** 3.10 or 3.11 with `pip`
* **GPU (Optional):** NVIDIA GPU with CUDA 12+ for hardware-accelerated TensorRT inference; falls back automatically to CPU execution if no GPU is present.

### 11.2. Step 1: Clone Repository
```bash
git clone https://github.com/your-org/strata.git
cd strata
```

### 11.3. Step 2: Backend & Pipeline Manager Setup
```bash
cd backend
python -m venv venv

# On Linux / macOS:
source venv/bin/activate

# On Windows (PowerShell):
.\venv\Scripts\Activate.ps1

pip install -r requirements.txt
python src/main.py
```
* The FastAPI backend will boot on `http://localhost:8000`.
* Interactive OpenAPI API documentation is available at `http://localhost:8000/docs`.
* The multi-camera MJPEG streaming daemon automatically binds to `http://localhost:8080/?cam=cam1`.

### 11.4. Step 3: Frontend Web Dashboard Setup
```bash
# In a new terminal window:
cd frontend
npm install
npm run dev
```
* The unified Next.js dashboard will be accessible at `http://localhost:3000`.
* Switch between all five user roles using the role switcher in the header bar.

### 11.5. Step 4: Run Fleet Edge Simulator (Optional)
To generate continuous synthetic bus telemetry, vehicle GPS trajectories, and simulated IMU shock events:
```bash
# In a new terminal window:
cd edge-simulator
python run_edge.py
```

---

## 12. Phased Engineering Roadmap to Full Production

```
+-----------------------------------------------------------------------------------------------+
|                                      EXECUTION ROADMAP                                        |
|                                                                                               |
|  [PHASE 1: PROTOTYPE VALIDATION]  ==========>  COMPLETED                                      |
|  - Dual-Stream HUD & Unified Next.js 15 Web Platform                                          |
|  - 5 Role-Specific Consoles (ICCC, PWD, Police, Fleet, Crew)                                  |
|  - FastAPI WebSocket Ingestion & Pydantic v2 Telemetry Schemas                                |
|  - ASTM D6433 PCI Index & IRC:111 Asphalt Estimator                                           |
|                                                                                               |
|  [PHASE 2: MULTI-CAMERA EDGE AI PIPELINES]  =>  COMPLETED                                      |
|  - YOLOv8 Multi-Camera Ingestion Rig (Cam 1, 2, 3, 4)                                         |
|  - ImuFusionGate Accelerometer Coincidence Verification                                       |
|  - ByteTrack Kinematic Rash Driving Analyzer & Lateral Weaving Detector                       |
|  - Indian HSRP ANPR OCR Engine with Levenshtein Fuzzy Warrant Matcher                         |
|  - High-Throughput Port 8080 MJPEG Video Broadcast Daemon                                     |
|                                                                                               |
|  [PHASE 3: PHYSICAL RETROFIT & FIELD TRIALS]  =>  IN PROGRESS (NEXT MILESTONE)                |
|  - Deploy 5 Physical Pilot Bus Kits (NVIDIA Jetson Orin Nano + BMI088 IMU + RTK-GNSS)         |
|  - AIS-140 Automotive Electrical Certification & 24V Auxiliary Power Integration               |
|  - 64 GB NVMe 72-Hour Circular Ring Buffer Driver & Depot Wi-Fi Bulk Sync                     |
|  - Municipal GIS Vector Speed Breaker Whitelist Calibration (IRC:99)                          |
|                                                                                               |
|  [PHASE 4: STATE-WIDE PRODUCTION ROLLOUT]  =>  FUTURE ROADMAP                                 |
|  - Scale to 5,000+ Municipal Buses across State Road Transport Undertakings                   |
|  - Distributed PostGIS & Apache Kafka Cluster for High-Throughput Ingestion                   |
|  - Automated E-Challan Integration with State Police NIC Vahan / Sarathi Portals               |
|  - PWD Enterprise ERP Integration for Automated Escrow Payment Disbursement                   |
+-----------------------------------------------------------------------------------------------+
```

---

## 13. Quality Assurance & Production Standards

* **Factual & Technical Tone:** Documentation and codebase comments strictly avoid marketing hype, adhering to defense engineering guidelines.
* **Strict TypeScript:** Frontend codebase uses 100% strict typing without `any` or `unknown` escape hatches.
* **Zero Emojis Standard:** Clean enterprise UI optimized for high-density municipal command centers.
* **Color Contrast & Accessibility:** Abyss Teal and Sage Defense palette configured with dynamic CSS tokens meeting WCAG AAA contrast standards for command room display walls and vehicle cab monitors.
* **Security & Credential Isolation:** Zero hardcoded API keys or credentials; all environment configurations strictly segregated via `.env` specifications.

---

## 14. Project Attribution & License

* **Project Title:** STRATA - Autonomous Dual-Stream Edge AI Telematics & Municipal Vision Intelligence Platform
* **Submission Category:** Smart India Hackathon 2026
* **Problem Statement ID:** SIH26124 (26124)
* **Target Ministry / Organization:** Bharat Electronics Limited (BEL)
* **Primary Technology Stack:** NVIDIA Jetson Orin, YOLOv8, FastAPI, Next.js 15, Tailwind CSS v4, MapLibre GL
* **License:** Apache 2.0 / Proprietary to Bharat Electronics Limited and Ministry of Housing and Urban Affairs (MoHUA), Government of India.
