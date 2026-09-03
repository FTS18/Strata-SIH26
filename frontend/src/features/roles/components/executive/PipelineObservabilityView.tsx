'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Square,
  RotateCw,
  Sliders,
  Terminal,
  Activity,
  Cpu,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Clock,
  Layers,
  ChevronRight,
  HardDrive,
  Copy,
  Trash2,
  RefreshCw,
  Video,
  Camera,
  Eye,
  Maximize2,
  Sparkles,
  ShieldAlert,
  X,
} from 'lucide-react';
import { MetricCard } from '@/components/ui/MetricCard';
import { Button } from '@/components/ui/Button';

export type PipelineStatus = 'running' | 'stopped' | 'restarting' | 'degraded';

export interface PipelineInfo {
  id: string;
  name: string;
  category: string;
  architecture: string;
  hardwareDevice: string;
  status: PipelineStatus;
  currentFps: number;
  targetFps: number;
  cpuLoadPct: number;
  gpuLoadPct: number;
  memoryMb: number;
  latencyMs: number;
  processedFrames: number;
  confidenceThresh: number;
  quantization: 'TensorRT INT8' | 'FP16 Half' | 'FP32';
  lastStarted: string;
  description: string;
  cameraView: 'front_road' | 'traffic_radar' | 'anpr_plate' | 'kerb_sidewalk' | 'cabin_driver' | 'adaptive_stream';
}

export function PipelineObservabilityView() {
  const [pipelines, setPipelines] = useState<PipelineInfo[]>([
    {
      id: 'pipe-road-distress',
      name: 'Road Distress & Pothole Vision Engine',
      category: 'Surface Distress',
      architecture: 'YOLOv8-Nano + 3-Axis IMU Fusion Gate',
      hardwareDevice: 'Jetson Orin DLA:0',
      status: 'running',
      currentFps: 28.4,
      targetFps: 30,
      cpuLoadPct: 34,
      gpuLoadPct: 62,
      memoryMb: 412,
      latencyMs: 16.2,
      processedFrames: 124810,
      confidenceThresh: 0.70,
      quantization: 'TensorRT INT8',
      lastStarted: 'Today 06:00 AM (Active)',
      description: 'Continuous ASTM D6433 detection (Potholes, Alligator Cracks, Sunken Manholes) with accelerometer physical impact validation.',
      cameraView: 'front_road',
    },
    {
      id: 'pipe-traffic-tracker',
      name: 'Multi-Object Traffic & Vehicle Kinematics Engine',
      category: 'Traffic & Transit',
      architecture: 'Pretrained YOLOv8n (COCO) + ByteTrack',
      hardwareDevice: 'Jetson Orin CUDA:0',
      status: 'running',
      currentFps: 27.8,
      targetFps: 30,
      cpuLoadPct: 41,
      gpuLoadPct: 74,
      memoryMb: 528,
      latencyMs: 18.5,
      processedFrames: 124650,
      confidenceThresh: 0.40,
      quantization: 'TensorRT INT8',
      lastStarted: 'Today 06:00 AM (Active)',
      description: 'Tracks cars, buses, 2-wheelers, pedestrians, optical velocity vectors, and flags erratic zig-zag lane weaving / overspeeding.',
      cameraView: 'traffic_radar',
    },
    {
      id: 'pipe-anpr-ocr',
      name: 'Indian HSRP ANPR & OCR Radar Engine',
      category: 'Law Enforcement',
      architecture: 'YOLOv8-Plate + PaddleOCR + Levenshtein RegEx',
      hardwareDevice: 'Jetson Orin CUDA:0',
      status: 'running',
      currentFps: 22.0,
      targetFps: 25,
      cpuLoadPct: 29,
      gpuLoadPct: 58,
      memoryMb: 380,
      latencyMs: 24.1,
      processedFrames: 99430,
      confidenceThresh: 0.65,
      quantization: 'FP16 Half',
      lastStarted: 'Today 06:00 AM (Active)',
      description: 'Auto-triggered on traffic violations and hotlist targets; validates Indian plate standard formats and matches police warrants.',
      cameraView: 'anpr_plate',
    },
    {
      id: 'pipe-kerb-crowd',
      name: 'Kerb-Side Crowd Density & Zebra Corridor AI',
      category: 'Urban Safety',
      architecture: 'Optical Flow + MobileNet-SSD Crowd Estimator',
      hardwareDevice: 'Jetson Orin CPU Core 4-6',
      status: 'running',
      currentFps: 15.2,
      targetFps: 15,
      cpuLoadPct: 18,
      gpuLoadPct: 24,
      memoryMb: 240,
      latencyMs: 12.0,
      processedFrames: 62840,
      confidenceThresh: 0.50,
      quantization: 'TensorRT INT8',
      lastStarted: 'Today 06:00 AM (Active)',
      description: 'Monitors bus stop passenger queue buildup, kerb overhang hazards, and vulnerable pedestrian crossings.',
      cameraView: 'kerb_sidewalk',
    },
    {
      id: 'pipe-cabin-occupancy',
      name: 'Cabin Occupancy & Driver Fatigue Guard',
      category: 'Fleet Safety',
      architecture: 'MediaPipe Iris Landmark + Headcount AI',
      hardwareDevice: 'Jetson Orin CPU Core 7-8',
      status: 'stopped',
      currentFps: 0.0,
      targetFps: 10,
      cpuLoadPct: 0,
      gpuLoadPct: 0,
      memoryMb: 45,
      latencyMs: 0.0,
      processedFrames: 38120,
      confidenceThresh: 0.60,
      quantization: 'TensorRT INT8',
      lastStarted: 'Stopped (Standby Mode)',
      description: 'Measures passenger seat occupancy ratios and monitors driver PERCLOS (Percentage Eye Closure) drowsiness index.',
      cameraView: 'cabin_driver',
    },
    {
      id: 'pipe-mjpeg-streamer',
      name: 'Speed-Adaptive MJPEG Broadcast Daemon (Port 8080)',
      category: 'Telemetry Ingestion',
      architecture: 'Async BaseHTTP Streaming Loop (2 - 28 FPS)',
      hardwareDevice: 'Edge Network Uplink Socket',
      status: 'running',
      currentFps: 28.4,
      targetFps: 30,
      cpuLoadPct: 8,
      gpuLoadPct: 12,
      memoryMb: 110,
      latencyMs: 4.5,
      processedFrames: 151200,
      confidenceThresh: 0.50,
      quantization: 'FP32',
      lastStarted: 'Today 06:00 AM (Active)',
      description: 'Dynamically scales ingestion rate proportional to bus velocity ($2\\text{ FPS}$ idle to $28\\text{ FPS}$ cruise), serving live feed to browser.',
      cameraView: 'adaptive_stream',
    },
  ]);

  const [selectedPipelineId, setSelectedPipelineId] = useState<string>('pipe-road-distress');
  const [totalProcessedFrames, setTotalProcessedFrames] = useState(601090);
  const [liveGpuLoad, setLiveGpuLoad] = useState(58.4);
  const [liveLatency, setLiveLatency] = useState(16.2);
  const [streamAvailable, setStreamAvailable] = useState(false);
  const [showOverlays, setShowOverlays] = useState(true);
  const [activeImpactTest, setActiveImpactTest] = useState(false);

  const [logs, setLogs] = useState<{ id: string; time: string; level: 'INFO' | 'WARN' | 'ERROR'; pipeId: string; message: string }[]>([
    { id: '1', time: '21:17:02', level: 'INFO', pipeId: 'pipe-road-distress', message: '[ROAD_DISTRESS] INT8 TensorRT engine active. Inferencing frame #124810 (16.2ms).' },
    { id: '2', time: '21:17:04', level: 'INFO', pipeId: 'pipe-traffic-tracker', message: '[TRAFFIC_TRACKER] ByteTrack tracking 14 active vehicles in forward FOV.' },
    { id: '3', time: '21:17:06', level: 'WARN', pipeId: 'pipe-traffic-tracker', message: '[INCIDENT_ENGINE] Track #14 flagged: Erratic High-Speed Lane Weaving (Speed: 78.4 km/h).' },
    { id: '4', time: '21:17:07', level: 'INFO', pipeId: 'pipe-anpr-ocr', message: '[ANPR_RADAR] Plate crop triggered for Track #14 -> OCR parsed "HR26DQ4410" (Confidence: 96.4%).' },
    { id: '5', time: '21:17:08', level: 'INFO', pipeId: 'pipe-mjpeg-streamer', message: '[STREAM_BROADCAST] Serving live MJPEG frames to active client on port 8080.' },
  ]);

  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<PipelineInfo | null>(null);
  const logTerminalRef = useRef<HTMLDivElement>(null);
  const videoCanvasRef = useRef<HTMLCanvasElement>(null);

  // Active Selected Pipeline
  const activePipeline = pipelines.find((p) => p.id === selectedPipelineId) || pipelines[0];
  const runningCount = pipelines.filter((p) => p.status === 'running').length;

  // Real-time ticking telemetry simulation (Frames count, FPS fluctuations, GPU jitter, Periodic logs)
  useEffect(() => {
    const interval = setInterval(() => {
      if (runningCount > 0) {
        setTotalProcessedFrames((prev) => prev + runningCount * 3);
        setLiveGpuLoad((prev) => Math.min(85, Math.max(45, +(prev + (Math.random() * 2 - 1)).toFixed(1))));
        setLiveLatency((prev) => Math.min(22, Math.max(13, +(prev + (Math.random() * 0.8 - 0.4)).toFixed(1))));

        // Fluctuate pipeline FPS slightly
        setPipelines((prev) =>
          prev.map((p) => {
            if (p.status === 'running') {
              const jitter = (Math.random() * 0.6 - 0.3);
              const newFps = Math.max(1, Math.min(p.targetFps, +(p.targetFps + jitter).toFixed(1)));
              return { ...p, currentFps: newFps, processedFrames: p.processedFrames + 3 };
            }
            return p;
          })
        );
      }
    }, 500);

    return () => clearInterval(interval);
  }, [runningCount]);

  // Periodic automatic live log generation
  useEffect(() => {
    const logInterval = setInterval(() => {
      if (runningCount > 0) {
        const activePipes = pipelines.filter((p) => p.status === 'running');
        if (activePipes.length > 0) {
          const samplePipe = activePipes[Math.floor(Math.random() * activePipes.length)];
          const timeStr = new Date().toTimeString().split(' ')[0];
          let msg = '';
          let level: 'INFO' | 'WARN' | 'ERROR' = 'INFO';

          if (samplePipe.id === 'pipe-road-distress') {
            msg = `[ROAD_DISTRESS] Pothole candidate detected at (28.5672N, 77.2100E) | IMU fusion Z=1.02g (False positive suppressed).`;
          } else if (samplePipe.id === 'pipe-traffic-tracker') {
            msg = `[TRAFFIC_TRACKER] Tracking frame complete. Active volume: 14 Cars, 9 Two-Wheelers, 4 Pedestrians (Flow: Moderate).`;
          } else if (samplePipe.id === 'pipe-anpr-ocr') {
            msg = `[ANPR_RADAR] Foreground vehicle plate scanned: "DL 03 CB 9142" -> Hotlist Match: Stolen LCV Alert!`;
            level = 'WARN';
          } else if (samplePipe.id === 'pipe-kerb-crowd') {
            msg = `[KERB_CROWD] Stop queue count: 6 passengers on pavement corridor. Overhang risk: Low.`;
          } else {
            msg = `[STREAM_DAEMON] Frame payload uploaded: 1.4 KB compressed metadata packet broadcasted via WebSocket.`;
          }

          setLogs((prev) => [...prev.slice(-30), { id: String(Date.now() + Math.random()), time: timeStr, level, pipeId: samplePipe.id, message: msg }]);
        }
      }
    }, 4000);

    return () => clearInterval(logInterval);
  }, [runningCount, pipelines]);

  // Auto-scroll logs
  useEffect(() => {
    if (logTerminalRef.current) {
      logTerminalRef.current.scrollTop = logTerminalRef.current.scrollHeight;
    }
  }, [logs]);

  // Live High-Fidelity Canvas Dashcam & AI Overlay Animation
  useEffect(() => {
    const canvas = videoCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;
    let tick = 0;

    const render = () => {
      tick++;
      const w = canvas.width;
      const h = canvas.height;

      // 1. Clear Screen
      ctx.fillStyle = '#06191c';
      ctx.fillRect(0, 0, w, h);

      if (activePipeline.status === 'stopped') {
        // Render High-Tech Offline Standby Screen
        ctx.fillStyle = '#051214';
        ctx.fillRect(0, 0, w, h);

        // Scanline grid
        ctx.strokeStyle = 'rgba(18, 84, 79, 0.4)';
        ctx.lineWidth = 1;
        for (let y = 0; y < h; y += 12) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
          ctx.stroke();
        }

        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 14px "Bricolage Grotesque", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('PROCESS DAEMON STOPPED — NO INGESTION', w / 2, h / 2 - 10);

        ctx.fillStyle = '#8BBB92';
        ctx.font = '11px monospace';
        ctx.fillText(`Pipeline [${activePipeline.id}] is currently offline. Click 'Start' to activate.`, w / 2, h / 2 + 15);
        animFrameId = requestAnimationFrame(render);
        return;
      }

      if (activePipeline.status === 'restarting') {
        // Hot reload animation
        ctx.fillStyle = '#051214';
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 13px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('HOT-RELOAD: SYNCHRONIZING CUDA INT8 ENGINE...', w / 2, h / 2 - 5);

        ctx.fillStyle = '#8BBB92';
        ctx.font = '11px monospace';
        ctx.fillText('Allocating memory blocks and binding tensor buffers...', w / 2, h / 2 + 18);
        animFrameId = requestAnimationFrame(render);
        return;
      }

      // 2. Render Animated Perspective Road Surface
      const horizonY = h * 0.42;

      // Sky / City Skyline Background
      const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
      skyGrad.addColorStop(0, '#041013');
      skyGrad.addColorStop(1, '#092328');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, horizonY);

      // Asphalt Ground
      const roadGrad = ctx.createLinearGradient(0, horizonY, 0, h);
      roadGrad.addColorStop(0, '#102427');
      roadGrad.addColorStop(1, '#071518');
      ctx.fillStyle = roadGrad;
      ctx.fillRect(0, horizonY, w, h - horizonY);

      // Road Lane Perspective Lines
      ctx.strokeStyle = '#1d6d63';
      ctx.lineWidth = 2;

      // Left Curb
      ctx.beginPath();
      ctx.moveTo(w * 0.38, horizonY);
      ctx.lineTo(w * 0.05, h);
      ctx.stroke();

      // Right Curb
      ctx.beginPath();
      ctx.moveTo(w * 0.62, horizonY);
      ctx.lineTo(w * 0.95, h);
      ctx.stroke();

      // Dashed Center Lanes (Animated moving towards camera)
      const offset = (tick * 4) % 40;
      ctx.strokeStyle = '#8BBB92';
      ctx.setLineDash([20, 20]);
      ctx.lineDashOffset = -offset;

      // Center Divider
      ctx.beginPath();
      ctx.moveTo(w * 0.5, horizonY);
      ctx.lineTo(w * 0.5, h);
      ctx.stroke();
      ctx.setLineDash([]);

      // 3. Render AI Dynamic Bounding Boxes according to active pipeline
      if (showOverlays) {
        if (activePipeline.id === 'pipe-road-distress') {
          // Render Moving Pothole on Road
          const potholeY = horizonY + ((tick * 2.5) % (h - horizonY - 40));
          const scale = (potholeY - horizonY) / (h - horizonY);
          const potholeW = Math.max(30, scale * 90);
          const potholeH = Math.max(16, scale * 40);
          const potholeX = w * 0.42 + (scale * 30);

          // Pothole Asphalt Defect Graphic
          ctx.fillStyle = '#02090b';
          ctx.beginPath();
          ctx.ellipse(potholeX + potholeW / 2, potholeY + potholeH / 2, potholeW / 2, potholeH / 2, 0, 0, Math.PI * 2);
          ctx.fill();

          // Defect Bounding Box
          ctx.strokeStyle = activeImpactTest ? '#ef4444' : '#2A835F';
          ctx.lineWidth = 2;
          ctx.strokeRect(potholeX, potholeY, potholeW, potholeH);

          // Badge
          ctx.fillStyle = activeImpactTest ? '#ef4444' : '#2A835F';
          ctx.fillRect(potholeX, potholeY - 18, 140, 18);
          ctx.fillStyle = '#f0fdf4';
          ctx.font = 'bold 10px monospace';
          ctx.textAlign = 'left';
          ctx.fillText(activeImpactTest ? 'POTHOLE (94.2%) [Z=2.9g]' : 'POTHOLE (91.8%)', potholeX + 4, potholeY - 5);
        } else if (activePipeline.id === 'pipe-traffic-tracker') {
          // Render Moving Vehicles with Track IDs & Trajectory Tails
          const v1Y = horizonY + 30 + ((tick * 1.8) % (h - horizonY - 70));
          const v1Scale = (v1Y - horizonY) / (h - horizonY);
          const v1W = Math.max(40, v1Scale * 95);
          const v1H = Math.max(25, v1Scale * 60);
          const v1X = w * 0.58 + (v1Scale * 40) + Math.sin(tick * 0.08) * 15; // Weaving car

          // Trajectory tail
          ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(v1X + v1W / 2, v1Y + v1H);
          ctx.lineTo(v1X + v1W / 2 - 10, v1Y + v1H + 30);
          ctx.stroke();

          // Vehicle Bounding Box (Rash Driver in Red)
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 2;
          ctx.strokeRect(v1X, v1Y, v1W, v1H);

          ctx.fillStyle = '#ef4444';
          ctx.fillRect(v1X, v1Y - 18, 148, 18);
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 10px monospace';
          ctx.textAlign = 'left';
          ctx.fillText('#14 CAR | 78 KM/H | WEAVING', v1X + 4, v1Y - 5);

          // Oncoming Bus in Yellow
          const busX = w * 0.22;
          const busY = horizonY + 40;
          ctx.strokeStyle = '#eab308';
          ctx.lineWidth = 2;
          ctx.strokeRect(busX, busY, 70, 50);
          ctx.fillStyle = '#eab308';
          ctx.fillRect(busX, busY - 16, 100, 16);
          ctx.fillStyle = '#000000';
          ctx.font = 'bold 9px monospace';
          ctx.fillText('#08 TRANSIT BUS', busX + 4, busY - 4);
        } else if (activePipeline.id === 'pipe-anpr-ocr') {
          // Large High Security Registration Plate Crop Radar
          const plateW = 200;
          const plateH = 70;
          const plateX = w / 2 - plateW / 2;
          const plateY = h / 2 - plateH / 2;

          ctx.fillStyle = 'rgba(9, 35, 40, 0.85)';
          ctx.fillRect(plateX - 10, plateY - 25, plateW + 20, plateH + 45);
          ctx.strokeStyle = '#2A835F';
          ctx.lineWidth = 2;
          ctx.strokeRect(plateX - 10, plateY - 25, plateW + 20, plateH + 45);

          // Plate Graphic
          ctx.fillStyle = '#f0fdf4';
          ctx.fillRect(plateX, plateY, plateW, plateH);
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 3;
          ctx.strokeRect(plateX + 2, plateY + 2, plateW - 4, plateH - 4);

          // Blue IND Strip
          ctx.fillStyle = '#1d4ed8';
          ctx.fillRect(plateX + 4, plateY + 4, 22, plateH - 8);
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 8px monospace';
          ctx.textAlign = 'center';
          ctx.fillText('IND', plateX + 15, plateY + plateH / 2 + 3);

          // Plate Characters
          ctx.fillStyle = '#000000';
          ctx.font = 'bold 22px "Bricolage Grotesque", monospace';
          ctx.textAlign = 'center';
          ctx.fillText('HR 26 DQ 4410', plateX + plateW / 2 + 10, plateY + plateH / 2 + 8);

          ctx.fillStyle = '#8BBB92';
          ctx.font = '10px monospace';
          ctx.textAlign = 'center';
          ctx.fillText('OCR CONFIDENCE: 96.4% · STATE: HARYANA', w / 2, plateY + plateH + 15);
        } else if (activePipeline.id === 'pipe-kerb-crowd') {
          // Kerb-Side Pedestrian Crowd Heatmap
          ctx.fillStyle = 'rgba(42, 131, 95, 0.25)';
          ctx.fillRect(w * 0.05, horizonY + 20, 160, h - horizonY - 40);
          ctx.strokeStyle = '#8BBB92';
          ctx.lineWidth = 2;
          ctx.strokeRect(w * 0.05, horizonY + 20, 160, h - horizonY - 40);

          ctx.fillStyle = '#8BBB92';
          ctx.fillRect(w * 0.05, horizonY + 2, 140, 18);
          ctx.fillStyle = '#092328';
          ctx.font = 'bold 10px monospace';
          ctx.textAlign = 'left';
          ctx.fillText('BUS STOP QUEUE: 4 PAX', w * 0.05 + 4, horizonY + 14);
        } else {
          // Default Front Camera HUD
          ctx.fillStyle = 'rgba(9, 35, 40, 0.7)';
          ctx.fillRect(10, 10, 200, 30);
          ctx.strokeStyle = '#12544F';
          ctx.strokeRect(10, 10, 200, 30);
          ctx.fillStyle = '#8BBB92';
          ctx.font = '10px monospace';
          ctx.textAlign = 'left';
          ctx.fillText('FEED: LIVE INFERENCE READY', 20, 28);
        }
      }

      // 4. Top Telemetry HUD Overlay on Video
      ctx.fillStyle = 'rgba(9, 35, 40, 0.85)';
      ctx.fillRect(0, 0, w, 28);
      ctx.strokeStyle = '#12544F';
      ctx.beginPath();
      ctx.moveTo(0, 28);
      ctx.lineTo(w, 28);
      ctx.stroke();

      ctx.fillStyle = '#8BBB92';
      ctx.font = '10px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`STRATA LIVE SENSING | DAEMON: ${activePipeline.id.toUpperCase()} | ${activePipeline.currentFps.toFixed(1)} FPS | INT8 TENSORRT`, 12, 18);

      ctx.textAlign = 'right';
      ctx.fillStyle = '#f0fdf4';
      ctx.fillText(`LATENCY: ${liveLatency} MS | FRAME #${totalProcessedFrames}`, w - 12, 18);

      animFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animFrameId);
  }, [activePipeline, showOverlays, activeImpactTest, liveLatency, totalProcessedFrames]);

  const handleStartPipeline = (pipeId: string) => {
    setPipelines((prev) =>
      prev.map((p) =>
        p.id === pipeId
          ? {
              ...p,
              status: 'running',
              currentFps: p.targetFps,
              cpuLoadPct: Math.floor(Math.random() * 20) + 25,
              gpuLoadPct: Math.floor(Math.random() * 25) + 50,
              lastStarted: 'Just now (Active)',
            }
          : p
      )
    );
    appendLog(pipeId, 'INFO', `[PIPELINE_ORCHESTRATOR] Successfully started daemon: ${pipeId}`);
  };

  const handleStopPipeline = (pipeId: string) => {
    setPipelines((prev) =>
      prev.map((p) =>
        p.id === pipeId
          ? {
              ...p,
              status: 'stopped',
              currentFps: 0.0,
              cpuLoadPct: 0,
              gpuLoadPct: 0,
              latencyMs: 0.0,
              lastStarted: 'Stopped by Administrator',
            }
          : p
      )
    );
    appendLog(pipeId, 'WARN', `[PIPELINE_ORCHESTRATOR] Process stopped and memory unmapped: ${pipeId}`);
  };

  const handleRestartPipeline = (pipeId: string) => {
    setPipelines((prev) =>
      prev.map((p) =>
        p.id === pipeId
          ? { ...p, status: 'restarting', currentFps: 0.0 }
          : p
      )
    );
    appendLog(pipeId, 'WARN', `[HOT_RELOAD] Initiating graceful rolling restart for ${pipeId}...`);

    setTimeout(() => {
      setPipelines((prev) =>
        prev.map((p) =>
          p.id === pipeId
            ? {
                ...p,
                status: 'running',
                currentFps: p.targetFps,
                cpuLoadPct: Math.floor(Math.random() * 20) + 25,
                gpuLoadPct: Math.floor(Math.random() * 25) + 50,
                lastStarted: 'Hot Reloaded Just now',
              }
            : p
        )
      );
      appendLog(pipeId, 'INFO', `[HOT_RELOAD] Engine online and CUDA stream synchronized: ${pipeId}`);
    }, 1000);
  };

  const handleStartAll = () => {
    pipelines.forEach((p) => {
      if (p.status !== 'running') handleStartPipeline(p.id);
    });
  };

  const handleStopAll = () => {
    pipelines.forEach((p) => {
      if (p.status === 'running') handleStopPipeline(p.id);
    });
  };

  const handleRestartAll = () => {
    pipelines.forEach((p) => handleRestartPipeline(p.id));
  };

  const triggerImpactTest = () => {
    setActiveImpactTest(true);
    appendLog('pipe-road-distress', 'WARN', '[IMU_SPIKE] Physical impact bump detected: Z=2.94g! Optical pothole verified.');
    setTimeout(() => setActiveImpactTest(false), 2000);
  };

  const appendLog = (pipeId: string, level: 'INFO' | 'WARN' | 'ERROR', message: string) => {
    const timeStr = new Date().toTimeString().split(' ')[0];
    setLogs((prev) => [
      ...prev,
      {
        id: String(Date.now() + Math.random()),
        time: timeStr,
        level,
        pipeId,
        message,
      },
    ]);
  };

  const openConfigModal = (pipe: PipelineInfo) => {
    setEditingConfig({ ...pipe });
    setIsConfigModalOpen(true);
  };

  const saveConfig = () => {
    if (!editingConfig) return;
    setPipelines((prev) =>
      prev.map((p) => (p.id === editingConfig.id ? editingConfig : p))
    );
    appendLog(
      editingConfig.id,
      'INFO',
      `[CONFIG_UPDATE] Parameters applied: Target FPS=${editingConfig.targetFps}, Conf=${editingConfig.confidenceThresh}, Precision=${editingConfig.quantization}`
    );
    setIsConfigModalOpen(false);
  };

  return (
    <div className="flex h-full w-full flex-col gap-3.5 overflow-y-auto p-4 sm:p-5 bg-[#092328] text-[#f0fdf4]">
      {/* Top Header & Orchestration Controls */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 border-b border-[#12544F] pb-3.5 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#12544F] border border-[#2A835F] text-[#8BBB92]">
              <Activity className="h-4 w-4" />
            </div>
            <h2 className="text-base font-semibold text-[#f0fdf4]">
              Edge AI Pipeline Observability & Process Orchestration
            </h2>
            <span className="rounded border border-[#2A835F] bg-[#12544F] px-2 py-0.5 text-[11px] font-mono text-[#8BBB92] font-medium">
              {runningCount} / {pipelines.length} Active Engines
            </span>
          </div>
          <p className="text-xs text-[#8BBB92] mt-0.5">
            Real-time process daemon control, live camera visualizer, dynamic parameter tuning, and hot reloading across mobile bus fleets
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="bg-[#12544F] text-[#f0fdf4] border-[#2A835F] hover:bg-[#2A835F] py-1.5 text-xs font-mono"
            onClick={handleStartAll}
          >
            <Play className="h-3.5 w-3.5 text-emerald-400" />
            <span>Start All</span>
          </Button>

          <Button
            variant="secondary"
            size="sm"
            className="bg-[#12544F] text-[#f0fdf4] border-[#2A835F] hover:bg-[#2A835F] py-1.5 text-xs font-mono"
            onClick={handleRestartAll}
          >
            <RotateCw className="h-3.5 w-3.5 text-amber-400" />
            <span>Restart All (Rolling)</span>
          </Button>

          <Button
            variant="danger"
            size="sm"
            className="py-1.5 text-xs font-mono"
            onClick={handleStopAll}
          >
            <Square className="h-3.5 w-3.5" />
            <span>Emergency Stop All</span>
          </Button>
        </div>
      </div>

      {/* Top Telemetry KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
        <MetricCard
          label="Total Frames Processed"
          value={totalProcessedFrames.toLocaleString()}
          caption="Speed-proportional adaptive ingestion"
          change="Real-time Live"
          changeType="positive"
          icon={<Layers className="h-4 w-4 text-[#8BBB92]" />}
        />
        <MetricCard
          label="Average Engine Latency"
          value={`${liveLatency} ms`}
          caption="Sub-20ms Jetson Orin budget"
          change="Within SLA"
          changeType="positive"
          icon={<Zap className="h-4 w-4 text-[#8BBB92]" />}
        />
        <MetricCard
          label="Cluster GPU Compute Load"
          value={`${liveGpuLoad}%`}
          caption="TensorRT INT8 Precision"
          change="Optimal Thermal"
          changeType="positive"
          icon={<Cpu className="h-4 w-4 text-[#8BBB92]" />}
        />
        <MetricCard
          label="Process Health Score"
          value="99.4%"
          caption="Zero unhandled process crashes"
          change="Nominal"
          changeType="positive"
          icon={<CheckCircle2 className="h-4 w-4 text-[#8BBB92]" />}
        />
      </div>

      {/* Main Studio Grid: Left Pipeline Controls, Right Live Video Visualizer + Terminal Logs */}
      <div className="grid flex-1 grid-cols-1 lg:grid-cols-12 gap-4 overflow-hidden min-h-[560px]">
        {/* Left 5 Columns: Interactive Pipeline Daemon List */}
        <div className="lg:col-span-5 flex flex-col rounded-xl border border-[#12544F] bg-[#0d3137] overflow-hidden shadow-sm">
          <div className="flex items-center justify-between border-b border-[#12544F] bg-[#092328] px-4 py-2.5 shrink-0">
            <span className="text-xs font-semibold text-[#f0fdf4]">
              Edge AI Daemon Controls ({pipelines.length})
            </span>
            <span className="text-[11px] font-mono text-[#8BBB92]">
              Click to inspect feed
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {pipelines.map((pipe) => {
              const isSelected = selectedPipelineId === pipe.id;
              const isRunning = pipe.status === 'running';
              const isRestarting = pipe.status === 'restarting';

              return (
                <div
                  key={pipe.id}
                  onClick={() => setSelectedPipelineId(pipe.id)}
                  className={`flex flex-col gap-2 rounded-lg border p-3 transition-all select-none cursor-pointer ${
                    isSelected
                      ? 'border-[#2A835F] bg-[#12544F] shadow-md ring-1 ring-[#2A835F]/60'
                      : 'border-[#12544F] bg-[#092328]/60 hover:bg-[#12544F]/40'
                  }`}
                >
                  {/* Card Header: Title & Status Badge */}
                  <div className="flex items-center justify-between gap-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={`h-2.5 w-2.5 rounded-full shrink-0 ${
                          isRunning
                            ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse'
                            : isRestarting
                            ? 'bg-amber-400 animate-spin'
                            : 'bg-zinc-500'
                        }`}
                      />
                      <h4 className="text-xs font-bold text-[#f0fdf4] truncate">{pipe.name}</h4>
                    </div>

                    <span
                      className={`rounded border px-2 py-0.5 text-[10px] font-mono font-semibold uppercase shrink-0 ${
                        isRunning
                          ? 'border-emerald-800/40 bg-emerald-950/40 text-emerald-400'
                          : isRestarting
                          ? 'border-amber-800/40 bg-amber-950/40 text-amber-400'
                          : 'border-zinc-700 bg-zinc-800/60 text-zinc-400'
                      }`}
                    >
                      {pipe.status}
                    </span>
                  </div>

                  {/* Telemetry Metrics Bar */}
                  <div className="grid grid-cols-3 gap-1.5 rounded bg-[#092328] p-2 text-[10px] font-mono border border-[#144943]">
                    <div>
                      <span className="text-[#5b9076]">FPS: </span>
                      <span className={`font-bold ${isRunning ? 'text-emerald-400' : 'text-zinc-500'}`}>
                        {pipe.currentFps.toFixed(1)} / {pipe.targetFps}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#5b9076]">GPU: </span>
                      <span className="text-[#8BBB92]">{pipe.gpuLoadPct}%</span>
                    </div>
                    <div>
                      <span className="text-[#5b9076]">Target: </span>
                      <span className="text-cyan-400 truncate">{pipe.hardwareDevice.split(' ')[0]}</span>
                    </div>
                  </div>

                  {/* Control Action Buttons Bar */}
                  <div className="flex items-center justify-between gap-1.5 pt-1 border-t border-[#12544F]/50">
                    <span className="text-[10px] font-mono text-[#5b9076] truncate">
                      {pipe.category}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {isRunning ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStopPipeline(pipe.id);
                          }}
                          className="flex items-center gap-1 rounded border border-rose-800/40 bg-rose-950/40 px-2 py-1 text-[10px] font-mono text-rose-400 hover:bg-rose-900/50"
                        >
                          <Square className="h-3 w-3" />
                          <span>Stop</span>
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartPipeline(pipe.id);
                          }}
                          className="flex items-center gap-1 rounded border border-emerald-800/40 bg-emerald-950/40 px-2 py-1 text-[10px] font-mono text-emerald-400 hover:bg-emerald-900/50"
                        >
                          <Play className="h-3 w-3" />
                          <span>Start</span>
                        </button>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRestartPipeline(pipe.id);
                        }}
                        className="flex items-center gap-1 rounded border border-[#12544F] bg-[#092328] px-2 py-1 text-[10px] font-mono text-[#8BBB92] hover:bg-[#12544F] hover:text-[#f0fdf4]"
                      >
                        <RotateCw className="h-3 w-3" />
                        <span>Restart</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openConfigModal(pipe);
                        }}
                        className="flex items-center gap-1 rounded border border-[#12544F] bg-[#092328] px-2 py-1 text-[10px] font-mono text-[#8BBB92] hover:bg-[#12544F] hover:text-[#f0fdf4]"
                      >
                        <Sliders className="h-3 w-3" />
                        <span>Tune</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 7 Columns: Live AI Visualizer Monitor (Top) + Daemon Logs (Bottom) */}
        <div className="lg:col-span-7 flex flex-col gap-3.5 overflow-hidden">
          {/* ================= 1. LIVE VIDEO VISUALIZER MONITOR ================= */}
          <div className="flex flex-col rounded-xl border border-[#12544F] bg-black overflow-hidden shadow-xl shrink-0">
            {/* Monitor Header */}
            <div className="flex items-center justify-between border-b border-[#12544F] bg-[#092328] px-4 py-2 text-xs font-mono text-[#8BBB92]">
              <div className="flex items-center gap-2">
                <Video className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
                <span className="font-bold text-[#f0fdf4]">
                  LIVE INFERENCE MONITOR: {activePipeline.name.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={triggerImpactTest}
                  className="flex items-center gap-1 rounded border border-[#2A835F] bg-[#12544F] px-2 py-0.5 text-[10px] font-mono text-[#8BBB92] hover:bg-[#2A835F] hover:text-[#f0fdf4]"
                >
                  <Zap className="h-3 w-3 text-amber-400" />
                  <span>Trigger Test Impact</span>
                </button>
                <button
                  onClick={() => setShowOverlays(!showOverlays)}
                  className="flex items-center gap-1 rounded border border-[#12544F] bg-[#0d3137] px-2 py-0.5 text-[10px] font-mono text-[#8BBB92] hover:bg-[#12544F]"
                >
                  <Eye className="h-3 w-3" />
                  <span>{showOverlays ? 'Hide Boxes' : 'Show Boxes'}</span>
                </button>
              </div>
            </div>

            {/* Video Canvas Element */}
            <div className="relative h-60 sm:h-64 lg:h-72 w-full bg-[#051214] flex items-center justify-center overflow-hidden">
              <canvas
                ref={videoCanvasRef}
                width={640}
                height={360}
                className="h-full w-full object-contain"
              />
            </div>
          </div>

          {/* ================= 2. LIVE DAEMON TERMINAL LOGS ================= */}
          <div className="flex flex-1 flex-col rounded-xl border border-[#12544F] bg-[#06191c] overflow-hidden shadow-sm min-h-[220px]">
            {/* Terminal Header */}
            <div className="flex items-center justify-between border-b border-[#144943] bg-[#092328] px-4 py-2 shrink-0 font-mono">
              <div className="flex items-center gap-2 text-xs text-[#8BBB92]">
                <Terminal className="h-3.5 w-3.5 text-emerald-400" />
                <span>DAEMON LOGS: {activePipeline.id.toUpperCase()}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-emerald-400 animate-pulse">● LIVE STREAMING</span>
                <button
                  onClick={() => setLogs([])}
                  className="text-[11px] text-[#5b9076] hover:text-[#f0fdf4]"
                  title="Clear Logs"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Terminal Output Stream */}
            <div
              ref={logTerminalRef}
              className="flex-1 overflow-y-auto p-3 font-mono text-[11px] space-y-1.5 bg-[#051417] leading-relaxed select-text"
            >
              {logs.length === 0 ? (
                <div className="flex h-full items-center justify-center text-[#5b9076]">
                  No active log events. Trigger pipeline action above.
                </div>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="flex items-start gap-2">
                    <span className="text-[#5b9076] shrink-0">[{log.time}]</span>
                    <span
                      className={`font-semibold shrink-0 ${
                        log.level === 'WARN'
                          ? 'text-amber-400'
                          : log.level === 'ERROR'
                          ? 'text-rose-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      [{log.level}]
                    </span>
                    <span className="text-[#f0fdf4] break-all">{log.message}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Parameter Tuning Modal */}
      {isConfigModalOpen && editingConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-xl border border-[#2A835F] bg-[#0d3137] p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#12544F] pb-3">
              <div>
                <h3 className="text-sm font-semibold text-[#f0fdf4]">
                  Engine Tuning: {editingConfig.name}
                </h3>
                <p className="text-xs text-[#8BBB92]">
                  Live runtime hyperparameter calibration without stopping inference loop
                </p>
              </div>
              <button
                onClick={() => setIsConfigModalOpen(false)}
                className="text-xs font-mono text-[#8BBB92] hover:text-[#f0fdf4]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs font-mono">
              {/* Target FPS */}
              <div className="space-y-1">
                <div className="flex justify-between text-[#8BBB92]">
                  <span>Target Ingestion Framerate:</span>
                  <span className="text-[#f0fdf4] font-bold">{editingConfig.targetFps} FPS</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="30"
                  step="1"
                  value={editingConfig.targetFps}
                  onChange={(e) =>
                    setEditingConfig({ ...editingConfig, targetFps: Number(e.target.value) })
                  }
                  className="w-full accent-[#2A835F]"
                />
              </div>

              {/* Confidence Threshold */}
              <div className="space-y-1">
                <div className="flex justify-between text-[#8BBB92]">
                  <span>Vision Confidence Gate:</span>
                  <span className="text-[#f0fdf4] font-bold">
                    {(editingConfig.confidenceThresh * 100).toFixed(0)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.20"
                  max="0.95"
                  step="0.05"
                  value={editingConfig.confidenceThresh}
                  onChange={(e) =>
                    setEditingConfig({ ...editingConfig, confidenceThresh: Number(e.target.value) })
                  }
                  className="w-full accent-[#2A835F]"
                />
              </div>

              {/* Quantization Engine */}
              <div className="space-y-1">
                <label className="text-[#8BBB92]">Inference Quantization:</label>
                <select
                  value={editingConfig.quantization}
                  onChange={(e) =>
                    setEditingConfig({
                      ...editingConfig,
                      quantization: e.target.value as any,
                    })
                  }
                  className="w-full rounded border border-[#12544F] bg-[#092328] p-2 text-xs text-[#f0fdf4] outline-none"
                >
                  <option value="TensorRT INT8">TensorRT INT8 (High-Throughput Sub-15W)</option>
                  <option value="FP16 Half">FP16 Half Precision (Balanced)</option>
                  <option value="FP32">FP32 Full Precision (Diagnostic Baseline)</option>
                </select>
              </div>

              {/* Hardware Device Target */}
              <div className="space-y-1">
                <label className="text-[#8BBB92]">Compute Core Target:</label>
                <input
                  type="text"
                  value={editingConfig.hardwareDevice}
                  onChange={(e) =>
                    setEditingConfig({ ...editingConfig, hardwareDevice: e.target.value })
                  }
                  className="w-full rounded border border-[#12544F] bg-[#092328] p-2 text-xs text-[#f0fdf4] outline-none"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#12544F]">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsConfigModalOpen(false)}
                className="bg-[#12544F] text-[#f0fdf4]"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={saveConfig}
                className="bg-[#2A835F] hover:bg-[#18635c] text-[#f0fdf4]"
              >
                Apply Parameters Hot
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
