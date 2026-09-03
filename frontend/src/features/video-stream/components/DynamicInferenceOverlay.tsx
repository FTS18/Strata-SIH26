'use client';

import React, { useRef, useEffect } from 'react';

interface DynamicInferenceOverlayProps {
  className?: string;
  fps?: number;
  cameraName?: string;
}

export function DynamicInferenceOverlay({
  className = '',
  fps = 29.4,
  cameraName = 'CAM-01 FRONT (3840x2160)',
}: DynamicInferenceOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const startTime = performance.now();

    const render = (time: number) => {
      const elapsed = (time - startTime) / 1000;
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // 1. Perspective Road Lane Segmentation Grid (Dynamic Scanning Polygon)
      const scanPhase = (elapsed * 1.2) % 1;
      const vanishingX = w * 0.48;
      const vanishingY = h * 0.38;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(vanishingX - w * 0.04, vanishingY);
      ctx.lineTo(vanishingX + w * 0.22, vanishingY);
      ctx.lineTo(w * 0.92, h);
      ctx.lineTo(w * 0.18, h);
      ctx.closePath();
      ctx.fillStyle = 'rgba(42, 131, 95, 0.05)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(139, 187, 146, 0.2)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);
      ctx.stroke();

      // Dynamic scanning pulse bar moving towards camera
      const scanY = vanishingY + (h - vanishingY) * Math.pow(scanPhase, 1.4);
      const scanWidthRatio = (scanY - vanishingY) / (h - vanishingY);
      const scanLeft = vanishingX - (vanishingX - w * 0.18) * scanWidthRatio;
      const scanRight = vanishingX + (w * 0.92 - vanishingX) * scanWidthRatio;

      ctx.beginPath();
      ctx.moveTo(scanLeft, scanY);
      ctx.lineTo(scanRight, scanY);
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.6)';
      ctx.lineWidth = 2;
      ctx.setLineDash([]);
      ctx.stroke();
      ctx.restore();

      // 2. Dynamic Object Tracker: Lead Commercial Truck (Tracking Ahead)
      const truckJitterX = Math.sin(elapsed * 4.2) * 1.5;
      const truckJitterY = Math.cos(elapsed * 3.8) * 1.2;
      const truckX = w * 0.64 + truckJitterX;
      const truckY = h * 0.33 + truckJitterY;
      const truckW = w * 0.26;
      const truckH = h * 0.38;

      ctx.save();
      // Bounding Box
      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 2;
      ctx.fillStyle = 'rgba(52, 211, 153, 0.08)';
      ctx.fillRect(truckX, truckY, truckW, truckH);
      ctx.strokeRect(truckX, truckY, truckW, truckH);

      // Corner Reticles
      const cornerSize = 10;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;

      // Top-Left
      ctx.beginPath();
      ctx.moveTo(truckX, truckY + cornerSize);
      ctx.lineTo(truckX, truckY);
      ctx.lineTo(truckX + cornerSize, truckY);
      ctx.stroke();

      // Top-Right
      ctx.beginPath();
      ctx.moveTo(truckX + truckW - cornerSize, truckY);
      ctx.lineTo(truckX + truckW, truckY);
      ctx.lineTo(truckX + truckW, truckY + cornerSize);
      ctx.stroke();

      // Bottom-Left
      ctx.beginPath();
      ctx.moveTo(truckX, truckY + truckH - cornerSize);
      ctx.lineTo(truckX, truckY + truckH);
      ctx.lineTo(truckX + cornerSize, truckY + truckH);
      ctx.stroke();

      // Bottom-Right
      ctx.beginPath();
      ctx.moveTo(truckX + truckW - cornerSize, truckY + truckH);
      ctx.lineTo(truckX + truckW, truckY + truckH);
      ctx.lineTo(truckX + truckW, truckY + truckH - cornerSize);
      ctx.stroke();

      // Center Crosshair
      const centerX = truckX + truckW / 2;
      const centerY = truckY + truckH / 2;
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.8)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(centerX - 6, centerY);
      ctx.lineTo(centerX + 6, centerY);
      ctx.moveTo(centerX, centerY - 6);
      ctx.lineTo(centerX, centerY + 6);
      ctx.stroke();

      // Label Header Badge
      const labelText = 'TRUCK #4019 · 98.6%';
      ctx.font = 'bold 10px monospace';
      const textMetrics = ctx.measureText(labelText);
      const badgeW = textMetrics.width + 12;
      const badgeH = 16;

      ctx.fillStyle = '#34d399';
      ctx.fillRect(truckX, truckY - badgeH - 2, badgeW, badgeH);
      ctx.fillStyle = '#000000';
      ctx.fillText(labelText, truckX + 6, truckY - 6);

      // ANPR & Telemetry Footnote
      const distanceM = (16.2 + Math.sin(elapsed * 0.8) * 0.6).toFixed(1);
      const speedKmH = (48.4 + Math.sin(elapsed * 1.2) * 1.4).toFixed(0);
      const plateText = `DL-01-GB-4019 · ${distanceM}m · ${speedKmH} km/h`;
      ctx.font = '9px monospace';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
      ctx.fillRect(truckX, truckY + truckH + 3, ctx.measureText(plateText).width + 8, 14);
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.5)';
      ctx.lineWidth = 1;
      ctx.strokeRect(truckX, truckY + truckH + 3, ctx.measureText(plateText).width + 8, 14);
      ctx.fillStyle = '#6ee7b7';
      ctx.fillText(plateText, truckX + 4, truckY + truckH + 13);
      ctx.restore();

      // 3. Dynamic Road Distress / Pothole Tracker (Appears and tracks on lane)
      const defectCycle = (elapsed * 0.35) % 3;
      if (defectCycle < 2.4) {
        const defectProgress = defectCycle / 2.4;
        const defectX = w * 0.36 + Math.sin(elapsed * 2) * 2;
        const defectY = h * 0.74 + defectProgress * 20;
        const defectW = w * 0.22;
        const defectH = h * 0.12;

        ctx.save();
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.8;
        ctx.setLineDash([4, 3]);
        ctx.fillStyle = 'rgba(245, 158, 11, 0.15)';
        ctx.fillRect(defectX, defectY, defectW, defectH);
        ctx.strokeRect(defectX, defectY, defectW, defectH);

        // Pothole Label Tag
        const potholeLabel = 'POTHOLE (94.2%) [IMU Z=2.84g]';
        ctx.font = 'bold 9.5px monospace';
        const pBadgeW = ctx.measureText(potholeLabel).width + 10;
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(defectX, defectY - 16, pBadgeW, 15);
        ctx.fillStyle = '#000000';
        ctx.fillText(potholeLabel, defectX + 5, defectY - 4);
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={720}
      height={405}
      className={`pointer-events-none absolute inset-0 h-full w-full object-cover ${className}`}
    />
  );
}
