'use client';

import React from 'react';
import {
  LayoutDashboard,
  Wrench,
  Shield,
  Bus,
  HardHat,
  X,
  CheckCircle2,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { type UserRole } from '@/config/site';
import { useAuthStore, DEMO_PERSONAS } from '@/features/auth/authStore';

export interface RoleSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRole: (role: UserRole) => void;
}

export function RoleSwitcherModal({
  isOpen,
  onClose,
  onSelectRole,
}: RoleSwitcherModalProps) {
  const currentUser = useAuthStore((state) => state.currentUser);
  const currentRole = currentUser?.role || 'iccc_admin';

  if (!isOpen) return null;

  const roleOptions: {
    id: UserRole;
    title: string;
    badge: string;
    name: string;
    dept: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'iccc_admin',
      title: 'Executive ICCC Command Admin',
      badge: 'ICCC-ADMIN-8821',
      name: 'Dr. Alok Verma, IAS',
      dept: 'Delhi Integrated Command & Control Center (ICCC)',
      icon: <LayoutDashboard className="h-5 w-5 text-[#8BBB92]" />,
    },
    {
      id: 'pwd_engineer',
      title: 'PWD Road Infrastructure Engineer',
      badge: 'PWD-EXEC-4091',
      name: 'Er. Rajesh K. Mehta',
      dept: 'Public Works Department (PWD Road Infra)',
      icon: <Wrench className="h-5 w-5 text-[#8BBB92]" />,
    },
    {
      id: 'traffic_police',
      title: 'Traffic Police & ANPR Surveillance Officer',
      badge: 'DL-POLICE-9120',
      name: 'Insp. Vikram Rathore',
      dept: 'Delhi Traffic Police & Highway Patrol',
      icon: <Shield className="h-5 w-5 text-rose-400" />,
    },
    {
      id: 'fleet_ops',
      title: 'Transit Fleet Operations Controller',
      badge: 'DTC-DISPATCH-311',
      name: 'Sunil G. Nair',
      dept: 'Delhi Transport Corporation (DTC Fleet Ops)',
      icon: <Bus className="h-5 w-5 text-[#8BBB92]" />,
    },
    {
      id: 'field_crew',
      title: 'Field Maintenance Contractor Crew',
      badge: 'CREW-LEAD-104',
      name: 'Manish Rawat',
      dept: 'Shree Balaji Infra Works (PWD Authorized)',
      icon: <HardHat className="h-5 w-5 text-amber-400" />,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in select-none">
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-[#12544F] bg-[#0d3137] shadow-2xl shadow-black">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#12544F] bg-[#092328] px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#12544F] border border-[#2A835F] text-[#8BBB92]">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[#f0fdf4]">
                Switch Department Role (Multi-Agency RBAC)
              </h2>
              <p className="text-xs text-[#8BBB92]">
                Instant 1-click multi-agency department switching (ICCC, PWD, Police, CTU, Field Crew)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#8BBB92] hover:bg-[#12544F] hover:text-[#f0fdf4] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Role Cards List */}
        <div className="max-h-[70vh] overflow-y-auto p-4 space-y-2.5">
          {roleOptions.map((opt) => {
            const isSelected = currentRole === opt.id;
            return (
              <div
                key={opt.id}
                onClick={() => {
                  onSelectRole(opt.id);
                  onClose();
                }}
                className={`group flex cursor-pointer items-center justify-between rounded-xl border p-3.5 transition-all ${
                  isSelected
                    ? 'border-[#2A835F] bg-[#12544F] shadow-md'
                    : 'border-[#12544F] bg-[#092328] hover:bg-[#12544F]/50 hover:border-[#2A835F]/60'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0d3137] border border-[#12544F]">
                    {opt.icon}
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#f0fdf4]">
                        {opt.title}
                      </span>
                      {isSelected && (
                        <span className="flex items-center gap-1 rounded bg-[#2A835F] px-1.5 py-0.2 text-[9px] font-mono font-bold text-[#f0fdf4]">
                          <CheckCircle2 className="h-2.5 w-2.5" />
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#f0fdf4] font-medium">
                      {opt.name}{' '}
                      <span className="text-[11px] font-mono text-[#8BBB92]">
                        ({opt.badge})
                      </span>
                    </p>
                    <p className="text-[11px] text-[#8BBB92] truncate max-w-sm">
                      {opt.dept}
                    </p>
                  </div>
                </div>

                <div className="flex items-center text-[#8BBB92] group-hover:text-[#f0fdf4] transition-colors">
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="border-t border-[#12544F] bg-[#092328] px-5 py-3 text-center text-xs font-mono text-[#5b9076]">
          BEL Multi-Agency Role-Based Access Control (RBAC) System
        </div>
      </div>
    </div>
  );
}
