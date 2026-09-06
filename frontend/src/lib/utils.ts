import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats raw snake_case or SCREAMING_SNAKE_CASE strings into clean Title Case.
 * Example: 'fleet_ops' -> 'Fleet Operations', 'rash_driving' -> 'Rash Driving'
 */
export function formatEnumLabel(value: string): string {
  if (!value) return '';

  const explicitMap: Record<string, string> = {
    iccc_admin: 'Executive Command Center',
    pwd_engineer: 'PWD Road Infrastructure',
    traffic_police: 'Traffic Police & ANPR',
    fleet_ops: 'Transit Fleet Operations',
    field_crew: 'Field Maintenance Crew',
    anpr_plate_hit: 'ANPR Plate Hit',
    overspeeding: 'Overspeeding Violation',
    bus_lane_obstruction: 'Bus Lane Obstruction',
    crosswalk_incursion: 'Crosswalk Incursion',
    rash_driving: 'Rash Driving',
    wrong_side: 'Wrong Side Driving',
    hit_and_run: 'Hit & Run Suspect',
    stolen_vehicle: 'Stolen Vehicle Alert',
    illegal_parking: 'Illegal Lane Obstruction',
    detected: 'Detected',
    assigned: 'Assigned',
    in_progress: 'In Progress',
    verified_closed: 'AI Self-Verified & Closed',
    good: 'Optimal',
    warning: 'Caution',
    critical: 'Critical',
  };

  if (explicitMap[value.toLowerCase()]) {
    return explicitMap[value.toLowerCase()];
  }

  return value
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export function formatCurrency(amount: number, currency: string = 'INR'): string {
  if (currency === 'INR') {
    return `₹${amount.toLocaleString('en-IN')}`;
  }
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-IN').format(num);
}

export function formatRelativeTime(timestamp: number): string {
  const diffSec = Math.floor((Date.now() - timestamp) / 1000);
  if (diffSec < 5) return 'Just now';
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHour = Math.floor(diffMin / 60);
  return `${diffHour}h ago`;
}

export function formatTimestamp(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}
