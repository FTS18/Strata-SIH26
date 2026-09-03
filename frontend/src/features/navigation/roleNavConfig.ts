import React from 'react';
import {
  Map,
  BarChart3,
  DollarSign,
  Cpu,
  Kanban,
  Calculator,
  CheckCircle2,
  Flame,
  Radio,
  FileText,
  Clock,
  Users,
  Video,
  ListTodo,
  Navigation,
  Upload,
  Boxes,
  Layers,
  Activity,
} from 'lucide-react';
import { type UserRole } from '@/config/site';

export interface NavItemConfig {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const ROLE_NAVIGATION: Record<UserRole, NavItemConfig[]> = {
  iccc_admin: [
    { id: 'command_center', label: 'Dual-Stream ICCC Command Center', icon: Layers },
    { id: 'gis_map', label: 'City GIS Vector Map', icon: Map },
    { id: 'ward_compliance', label: 'Ward PCI & SLA Index', icon: BarChart3 },
    { id: 'budget_forecast', label: 'Budget & Asphalt Forecast', icon: DollarSign },
    { id: 'edge_health', label: 'Edge Network Health', icon: Cpu },
    { id: 'pipeline_observability', label: 'Pipeline Observability & Orchestrator', icon: Activity, badge: 'OPS' },
  ],
  pwd_engineer: [
    { id: 'command_center', label: 'Dual-Stream ICCC Command Center', icon: Layers },
    { id: 'pwd_kanban', label: 'Work Orders Kanban', icon: Kanban },
    { id: 'defect_estimator', label: 'Asphalt & Material Estimator', icon: Calculator },
    { id: 'auto_audit', label: 'Autonomous Bus Audit Verification', icon: CheckCircle2 },
    { id: 'road_heatmaps', label: 'Road Degradation Heatmaps', icon: Flame },
    { id: 'gis_map', label: 'GIS Vector Map', icon: Map },
  ],
  traffic_police: [
    { id: 'command_center', label: 'Dual-Stream ICCC Command Center', icon: Layers },
    { id: 'anpr_radar', label: 'Live ANPR Radar Stream', icon: Radio },
    { id: 'warrant_hotlist', label: 'Warrants & Fuzzy Search', icon: FileText },
    { id: 'echallan', label: 'E-Challan Issuance', icon: FileText },
    { id: 'violation_heatmaps', label: 'Violation Hotspots Map', icon: Flame },
  ],
  fleet_ops: [
    { id: 'command_center', label: 'Dual-Stream ICCC Command Center', icon: Layers },
    { id: 'fleet_grid', label: 'Fleet Telematics Grid', icon: Map },
    { id: 'corridor_delays', label: 'Corridor Bottlenecks & Delays', icon: Clock },
    { id: 'crowd_density', label: 'Bus Stop Crowd Advisories', icon: Users },
    { id: 'video_stream', label: 'Live Edge AI Video (Port 8080)', icon: Video, badge: 'LIVE' },
  ],
  field_crew: [
    { id: 'command_center', label: 'Dual-Stream ICCC Command Center', icon: Layers },
    { id: 'field_queue', label: 'Assigned Work Queue', icon: ListTodo },
    { id: 'gps_dispatch', label: 'Turn-by-Turn GPS Dispatch', icon: Navigation },
    { id: 'photo_audit', label: 'Photo Repair Upload & Re-Audit', icon: Upload },
    { id: 'material_inventory', label: 'Material & Asphalt Inventory', icon: Boxes },
  ],
};
