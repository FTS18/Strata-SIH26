"""
Edge Sensor Fusion Module (Optical Vision + IMU Accelerometer).
Fuses camera bounding box detections with high-frequency Z-axis accelerometer vibration spikes.
Rejects optical false positives (shadows, oil spills, wet asphalt patches) before transmitting telemetry.
"""

import time
import numpy as np
from typing import Dict, Optional, Tuple

class ImuFusionGate:
    def __init__(
        self,
        z_vibration_threshold_g: float = 2.2,
        vision_confidence_threshold: float = 0.70,
        high_confidence_bypass: float = 0.92
    ):
        self.z_threshold = z_vibration_threshold_g
        self.min_vision_conf = vision_confidence_threshold
        self.bypass_conf = high_confidence_bypass
        self.recent_imu_buffer: list[Tuple[float, float]] = [] # [(timestamp, z_g)]

    def record_imu_reading(self, z_acceleration_g: float):
        """Buffers high-frequency accelerometer telemetry (100Hz)."""
        now = time.time()
        self.recent_imu_buffer.append((now, z_acceleration_g))
        # Keep only the last 2.0 seconds of accelerometer readings
        cutoff = now - 2.0
        self.recent_imu_buffer = [r for r in self.recent_imu_buffer if r[0] >= cutoff]

    def evaluate_fusion_event(
        self,
        vision_confidence: float,
        detection_timestamp: float,
        time_window_sec: float = 0.8
    ) -> Dict[str, any]:
        """
        Cross-correlates optical detection timestamp with peak Z-axis vibration spikes
        within the time window when the bus tires roll across the road defect.
        """
        # If visual confidence is exceptionally high, bypass IMU requirement
        if vision_confidence >= self.bypass_conf:
            return {
                'verified': True,
                'mode': 'VISION_HIGH_CONFIDENCE_BYPASS',
                'peak_z_g': 1.0,
                'confidence': vision_confidence,
                'reason': 'Optical confidence exceeded 92% bypass threshold'
            }

        # Look for physical impact spike in IMU buffer around detection window
        min_time = detection_timestamp - time_window_sec
        max_time = detection_timestamp + time_window_sec
        relevant_spikes = [
            abs(z) for ts, z in self.recent_imu_buffer if min_time <= ts <= max_time
        ]

        peak_z = max(relevant_spikes) if relevant_spikes else 1.0
        has_physical_impact = peak_z >= self.z_threshold

        if vision_confidence >= self.min_vision_conf and has_physical_impact:
            return {
                'verified': True,
                'mode': 'FUSED_VISION_AND_IMU',
                'peak_z_g': round(peak_z, 2),
                'confidence': vision_confidence,
                'reason': f'Optical defect confirmed by {peak_z:.1f}g physical impact spike'
            }

        # Suppressed at edge: Rejects optical shadow/wet road false positive
        return {
            'verified': False,
            'mode': 'SUPPRESSED_EDGE_FALSE_POSITIVE',
            'peak_z_g': round(peak_z, 2),
            'confidence': vision_confidence,
            'reason': f'No physical impact detected (Peak Z: {peak_z:.1f}g < {self.z_threshold}g)'
        }
