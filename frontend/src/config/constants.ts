export const APP_CONFIG = {
  APP_NAME: 'Strata',
  APP_TAGLINE: 'Autonomous Mobile Urban Intelligence Platform',
  ORGANIZATION: 'Bharat Electronics Limited (BEL)',
  PROBLEM_ID: 'SIH26124',
  
  // Default Map Viewport (Chandigarh Smart City Transit Grid)
  DEFAULT_CENTER: {
    lat: 30.7333,
    lng: 76.7794,
  },
  DEFAULT_ZOOM: 13.0,
  MIN_ZOOM: 10,
  MAX_ZOOM: 18,

  // Bandwidth & Telemetry Constants
  RAW_STREAM_KBPS: 12500, // 12.5 Mbps baseline for raw HD bus video
  TELEMETRY_KBPS: 1.4,    // 1.4 KB/s edge-thinned payload
  DEFAULT_FLEET_SIZE: 32,

  // Pavement Quality Thresholds (PCI Index 0-100)
  PCI_GOOD_THRESHOLD: 75,
  PCI_WARNING_THRESHOLD: 50,
  IMU_VIBRATION_SPIKE_G: 2.2, // Z-axis accelerometer spike trigger

  // SLA Resolution Targets (Hours)
  SLA_CRITICAL_HOURS: 24,
  SLA_WARNING_HOURS: 72,
  SLA_ROUTINE_HOURS: 168,
} as const;
