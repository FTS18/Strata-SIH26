export type UserRole = 'iccc_admin' | 'pwd_engineer' | 'traffic_police' | 'fleet_ops' | 'field_crew';

export interface RoleConfig {
  id: UserRole;
  label: string;
  shortLabel: string;
  description: string;
  badgeColor: string;
}

export const USER_ROLES: Record<UserRole, RoleConfig> = {
  iccc_admin: {
    id: 'iccc_admin',
    label: 'ICCC Command Director',
    shortLabel: 'Executive',
    description: 'City-wide health, inter-agency metrics & edge fleet diagnostics',
    badgeColor: 'var(--status-transit)',
  },
  pwd_engineer: {
    id: 'pwd_engineer',
    label: 'PWD Road Infrastructure',
    shortLabel: 'PWD Road',
    description: 'Pavement condition index, defect tracking & automated repair work-orders',
    badgeColor: 'var(--status-warning)',
  },
  traffic_police: {
    id: 'traffic_police',
    label: 'Traffic Police & ANPR',
    shortLabel: 'Police / ANPR',
    description: 'Hit-and-run detection, rash driving alerts & license plate watchlist',
    badgeColor: 'var(--status-critical)',
  },
  fleet_ops: {
    id: 'fleet_ops',
    label: 'Transit Fleet Dispatch',
    shortLabel: 'Transit Fleet',
    description: 'Real-time bus tracking, route delay analysis & bus-stop crowd density',
    badgeColor: 'var(--status-good)',
  },
  field_crew: {
    id: 'field_crew',
    label: 'Field Maintenance Crew',
    shortLabel: 'Field Crew',
    description: 'Mobile task queue, navigation & after-repair photo verification',
    badgeColor: 'var(--text-secondary)',
  },
};
