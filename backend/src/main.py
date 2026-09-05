import os
import sys
import json
import time
import shutil
import re

# Ensure backend root is on PYTHONPATH
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from src.config import settings
from src.schemas.telemetry import BusTelemetryPacket, RoadDefectEvent, IncidentEvent, TrafficDensityPacket
from src.pipeline_manager import pipeline_manager

import asyncio

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Set the main running asyncio loop for thread-safe WebSocket emissions
    pipeline_manager.set_event_loop(asyncio.get_running_loop())
    # Auto-start multi-camera edge pipelines and port 8080 MJPEG server on backend boot
    pipeline_manager.start_all_pipelines()
    yield
    # Gracefully stop pipelines and release video handles on shutdown
    pipeline_manager.stop_all_pipelines()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="High-Throughput Mobile Fleet Telemetry & Urban Defect Ingestion Service for Bharat Electronics Limited (SIH26124)",
    lifespan=lifespan,
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Active WebSocket connections
connected_clients: list[WebSocket] = []

async def broadcast_to_clients(event_type: str, payload: dict):
    """Broadcasts typed JSON packets to all connected dashboard WebSockets."""
    message = json.dumps({"event": event_type, "data": payload})
    stale_clients = []
    for client in connected_clients:
        try:
            await client.send_text(message)
        except Exception:
            stale_clients.append(client)
    for stale in stale_clients:
        if stale in connected_clients:
            connected_clients.remove(stale)

# Set broadcast callback for background pipeline events
pipeline_manager.set_broadcast_callback(broadcast_to_clients)

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "active_ws_clients": len(connected_clients),
        "pipelines_active": pipeline_manager.is_running,
    }

@app.websocket("/ws/telemetry")
async def websocket_telemetry_endpoint(websocket: WebSocket):
    await websocket.accept()
    connected_clients.append(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Broadcast incoming telemetry to all dashboard clients
            for client in connected_clients:
                if client != websocket:
                    try:
                        await client.send_text(data)
                    except Exception:
                        pass
    except WebSocketDisconnect:
        if websocket in connected_clients:
            connected_clients.remove(websocket)

@app.post("/api/v1/ingest/telemetry")
async def ingest_telemetry(packet: BusTelemetryPacket):
    await broadcast_to_clients("BUS_TELEMETRY", packet.model_dump())
    return {"status": "ingested", "bus_id": packet.bus_id}

@app.post("/api/v1/ingest/traffic")
async def ingest_traffic(packet: TrafficDensityPacket):
    await broadcast_to_clients("TRAFFIC_DENSITY", packet.model_dump())
    return {"status": "traffic_ingested", "bus_id": packet.bus_id, "congestion_index": packet.congestion_index}

@app.post("/api/v1/ingest/defect")
async def ingest_defect(defect: RoadDefectEvent):
    await broadcast_to_clients("ROAD_DEFECT", defect.model_dump())
    return {"status": "defect_recorded", "defect_id": defect.defect_id}

@app.post("/api/v1/ingest/incident")
async def ingest_incident(incident: IncidentEvent):
    await broadcast_to_clients("VEHICLE_INCIDENT", incident.model_dump())
    return {"status": "incident_recorded", "incident_id": incident.incident_id}

@app.get("/api/v1/anpr/latest")
async def get_latest_anpr():
    return pipeline_manager.get_latest_anpr_detection()

@app.get("/api/v1/pedestrian/latest")
async def get_latest_pedestrian():
    return pipeline_manager.get_latest_pedestrian_alert()

@app.get("/api/v1/vision/detections")
async def get_vision_detections(cam: str = "cam1"):
    return pipeline_manager.get_vision_detections(cam)

@app.get("/api/v1/vision/sources")
async def get_camera_sources():
    """Returns the current footage status and filenames for each camera."""
    return pipeline_manager.get_camera_sources_status()

@app.post("/api/v1/vision/upload-footage")
async def upload_camera_footage(
    cam: str = Form(...),
    file: UploadFile = File(...)
):
    """Uploads and hot-swaps live footage for a specified camera stream."""
    if cam not in ["cam1", "cam2", "cam3", "cam4"]:
        raise HTTPException(status_code=400, detail=f"Invalid camera ID: '{cam}'. Expected cam1, cam2, cam3, or cam4.")

    allowed_exts = {".mp4", ".avi", ".mov", ".mkv", ".webm", ".mjpeg"}
    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in allowed_exts:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported video format '{ext}'. Supported formats: {', '.join(sorted(allowed_exts))}"
        )

    # Sanitize filename and construct destination path
    raw_name = file.filename or "custom_footage.mp4"
    safe_name = re.sub(r"[^a-zA-Z0-9_.-]", "_", raw_name)
    timestamp = int(time.time())
    dest_filename = f"{cam}_{timestamp}_{safe_name}"

    upload_dir = os.path.join(pipeline_manager.project_root, "frontend", "public", "videos", "uploads")
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, dest_filename)

    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save uploaded file: {e}")
    finally:
        await file.close()

    # Hot-swap camera source in the pipeline manager
    success = pipeline_manager.update_camera_source(cam, file_path, raw_name)
    if not success:
        try:
            os.remove(file_path)
        except Exception:
            pass
        raise HTTPException(
            status_code=400,
            detail="Failed to decode uploaded video stream. Please ensure the file is a valid, uncorrupted video."
        )

    await broadcast_to_clients("CAMERA_SOURCE_UPDATED", {
        "cam": cam,
        "is_custom": True,
        "filename": raw_name,
        "source_path": file_path
    })

    return {
        "success": True,
        "cam": cam,
        "filename": raw_name,
        "is_custom": True,
        "message": f"Footage updated for {cam.upper()} successfully."
    }

@app.post("/api/v1/vision/reset-footage")
async def reset_camera_footage(cam: str):
    """Restores the default video footage for a specified camera."""
    if cam not in ["cam1", "cam2", "cam3", "cam4"]:
        raise HTTPException(status_code=400, detail=f"Invalid camera ID: '{cam}'.")

    success = pipeline_manager.reset_camera_source(cam)
    if not success:
        raise HTTPException(status_code=500, detail=f"Failed to reset footage for {cam}.")

    default_name = os.path.basename(pipeline_manager.default_camera_sources[cam])
    await broadcast_to_clients("CAMERA_SOURCE_UPDATED", {
        "cam": cam,
        "is_custom": False,
        "filename": default_name
    })

    return {
        "success": True,
        "cam": cam,
        "is_custom": False,
        "message": f"Footage for {cam.upper()} restored to default ({default_name})."
    }


@app.post("/api/v1/pedestrian/simulate")
async def simulate_pedestrian(payload: dict = None):
    result = pipeline_manager.simulate_pedestrian_alert(payload)
    await broadcast_to_clients("PEDESTRIAN_SAFETY_ALERT", result.get("alert"))
    return result

@app.get("/api/v1/pipeline/status")
async def get_pipeline_status():
    return pipeline_manager.get_status()

@app.post("/api/v1/pipeline/control")
async def control_pipeline(payload: dict):
    pipe_id = payload.get("pipeline_id")
    action = payload.get("action")  # start, stop, restart, tune
    params = payload.get("params")
    
    result = pipeline_manager.control_pipeline(pipe_id, action, params)
    if result.get("status") == "acknowledged":
        await broadcast_to_clients("PIPELINE_STATUS_CHANGED", {
            "pipeline_id": pipe_id,
            "action": action,
            "current_state": result.get("current_state")
        })
    return result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)



