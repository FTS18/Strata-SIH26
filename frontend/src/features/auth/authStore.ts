import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type UserRole } from '@/config/site';

export interface UserProfile {
  id: string;
  name: string;
  badgeId: string;
  role: UserRole;
  department: string;
  jurisdiction: string;
  avatarInitials: string;
}

export const DEMO_PERSONAS: Record<UserRole, UserProfile> = {
  iccc_admin: {
    id: 'USR-NDMC-01',
    name: 'Dr. Alok Verma, IAS',
    badgeId: 'ICCC-ADMIN-8821',
    role: 'iccc_admin',
    department: 'Delhi Integrated Command & Control Center (ICCC)',
    jurisdiction: 'NCT of Delhi (All 12 Municipal Zones)',
    avatarInitials: 'AV',
  },
  pwd_engineer: {
    id: 'USR-PWD-409',
    name: 'Er. Rajesh K. Mehta',
    badgeId: 'PWD-EXEC-4091',
    role: 'pwd_engineer',
    department: 'Public Works Department (PWD Road Infra)',
    jurisdiction: 'South & Central Delhi Ring Road Divisions',
    avatarInitials: 'RM',
  },
  traffic_police: {
    id: 'USR-TP-912',
    name: 'Insp. Vikram Rathore',
    badgeId: 'DL-POLICE-9120',
    role: 'traffic_police',
    department: 'Delhi Traffic Police & ANPR Surveillance',
    jurisdiction: 'Outer Ring Road & Mathura Corridor',
    avatarInitials: 'VR',
  },
  fleet_ops: {
    id: 'USR-DTC-311',
    name: 'Sunil G. Nair',
    badgeId: 'DTC-DISPATCH-311',
    role: 'fleet_ops',
    department: 'Delhi Transport Corporation (Fleet Ops & Scheduling)',
    jurisdiction: 'Depot 14 (Sarojini Nagar Transit Hub)',
    avatarInitials: 'SN',
  },
  field_crew: {
    id: 'USR-CREW-104',
    name: 'Manish Rawat',
    badgeId: 'CREW-LEAD-104',
    role: 'field_crew',
    department: 'Shree Balaji Infra Works (PWD Authorized Contractor)',
    jurisdiction: 'South Segment Maintenance Zone',
    avatarInitials: 'MR',
  },
};

interface AuthState {
  isAuthenticated: boolean;
  currentUser: UserProfile | null;
  login: (role: UserRole) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: true, // pre-authenticated for instant demo
      currentUser: DEMO_PERSONAS.iccc_admin,
      login: (role: UserRole) =>
        set({
          isAuthenticated: true,
          currentUser: DEMO_PERSONAS[role],
        }),
      logout: () =>
        set({
          isAuthenticated: false,
          currentUser: null,
        }),
    }),
    {
      name: 'strata_auth_store',
    }
  )
);
