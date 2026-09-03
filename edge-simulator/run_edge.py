import time
import math
import random
import json

class EdgeBusSimulator:
    """
    Simulates onboard edge compute processing for a public transport bus,
    including speed-proportional framerate throttling and IMU sensor fusion.
    """
    def __init__(self, bus_id: str, bus_number: str, route_id: str):
        self.bus_id = bus_id
        self.bus_number = bus_number
        self.route_id = route_id
        self.base_lat = 28.6139
        self.base_lng = 77.2090
        self.step = 0

    def generate_telemetry_frame(self):
        self.step += 1
        # Simulated route trajectory along an urban corridor
        lat = self.base_lat + math.sin(self.step * 0.05) * 0.015
        lng = self.base_lng + math.cos(self.step * 0.05) * 0.018
        
        # Speed variation (0 km/h at signals, up to 45 km/h)
        speed = max(0.0, 25.0 + math.sin(self.step * 0.1) * 18.0)
        
        # Speed-proportional FPS adaptation
        fps = 2.0 if speed < 5.0 else 28.5

        # 3-axis accelerometer simulation (Z-axis vibration spike on pothole)
        is_pothole_event = (self.step % 30 == 0)
        imu_z = random.uniform(2.4, 3.2) if is_pothole_event else random.uniform(0.95, 1.05)

        packet = {
            "bus_id": self.bus_id,
            "bus_number": self.bus_number,
            "route_id": self.route_id,
            "coords": {"lat": round(lat, 6), "lng": round(lng, 6)},
            "speed_km_h": round(speed, 1),
            "fps": round(fps, 1),
            "cpu_temp_c": round(41.0 + (fps / 28.5) * 4.5, 1),
            "bandwidth_kbps": 1.4,
            "imu_vibration_z": round(imu_z, 2),
            "pothole_detected": is_pothole_event,
            "timestamp": time.time(),
        }
        return packet

if __name__ == "__main__":
    simulator = EdgeBusSimulator("BUS-108", "DL-1PC-4820", "ROUTE-419")
    print(f"Starting Edge Bus Simulator for {simulator.bus_number}...")
    for _ in range(5):
        frame = simulator.generate_telemetry_frame()
        print(json.dumps(frame, indent=2))
        time.sleep(0.5)
