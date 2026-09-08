'use client';

import React, { useState } from 'react';
import { 
  X, 
  Shield, 
  Wrench, 
  Bus, 
  HardHat, 
  LayoutDashboard, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  ChevronDown 
} from 'lucide-react';
import { type UserRole } from '@/config/site';
import { useAuthStore, DEMO_PERSONAS } from '@/features/auth/authStore';
import { APP_CONFIG } from '@/config/constants';

interface LandingLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (role: UserRole) => void;
}

export function LandingLoginModal({ isOpen, onClose, onSuccess }: LandingLoginModalProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>('iccc_admin');
  const [pin, setPin] = useState('8821');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const login = useAuthStore((state) => state.login);

  if (!isOpen) return null;

  const activePersona = DEMO_PERSONAS[selectedRole];

  const roleOptions: { id: UserRole; title: string; dept: string; icon: React.ReactNode }[] = [
    {
      id: 'iccc_admin',
      title: 'Executive ICCC Command Admin',
      dept: 'Delhi Integrated Command & Control Center (ICCC)',
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      id: 'pwd_engineer',
      title: 'PWD Road Infrastructure Engineer',
      dept: 'Public Works Department (PWD Road Infra)',
      icon: <Wrench className="h-4 w-4" />,
    },
    {
      id: 'traffic_police',
      title: 'Traffic Police & ANPR Surveillance Officer',
      dept: 'Delhi Traffic Police & Highway Patrol',
      icon: <Shield className="h-4 w-4" />,
    },
    {
      id: 'fleet_ops',
      title: 'Transit Fleet Operations Controller',
      dept: 'Delhi Transport Corporation (DTC)',
      icon: <Bus className="h-4 w-4" />,
    },
    {
      id: 'field_crew',
      title: 'Field Maintenance Contractor Crew',
      dept: 'Shree Balaji Infra Works (PWD Authorized)',
      icon: <HardHat className="h-4 w-4" />,
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      login(selectedRole);
      setIsSubmitting(false);
      onSuccess(selectedRole);
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-panel)] shadow-2xl shadow-[#080e1a]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--surface-canvas)]/60 text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-subtle)] hover:text-[var(--text-primary)]"
          aria-label="Close modal"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Header */}
        <div className="border-b border-[var(--surface-border-subtle)] bg-[var(--surface-canvas)] p-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#2563eb] text-[var(--text-primary)] font-display text-2xl font-bold shadow-lg shadow-[#2563eb]/20">
            S
          </div>
          <h2 className="mt-3 font-display text-2xl font-bold tracking-wider text-[var(--text-primary)] uppercase">
            {APP_CONFIG.APP_NAME} COMMAND CONSOLE
          </h2>
          <p className="mt-0.5 text-xs font-mono text-[var(--text-secondary)]">
            BHARAT ELECTRONICS LIMITED · {APP_CONFIG.PROBLEM_ID}
          </p>
          <p className="mt-1 text-[11px] text-[var(--text-muted)]">
            Select an operational agency to enter the live platform
          </p>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Department Role Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider font-mono">
              Operational Clearance / Role
            </label>
            <div className="relative">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                className="w-full appearance-none rounded-xl border border-[var(--surface-border)] bg-[var(--surface-canvas)] px-3.5 py-2.5 text-xs font-medium text-[var(--text-primary)] outline-none transition-colors focus:border-[#94a3b8] cursor-pointer"
              >
                {roleOptions.map((opt) => (
                  <option key={opt.id} value={opt.id} className="bg-[var(--surface-panel)] text-[var(--text-primary)]">
                    {opt.title}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3.5 top-3 h-4 w-4 text-[var(--text-secondary)]" />
            </div>
          </div>

          {/* Persona Card */}
          <div className="rounded-xl border border-[var(--surface-border-subtle)] bg-[var(--surface-canvas)]/90 p-3.5 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[var(--text-primary)]">{activePersona.name}</span>
              <span className="rounded-full border border-[var(--color-accent-primary)] bg-[var(--surface-subtle)] px-2.5 py-0.5 text-[10px] font-mono text-[var(--text-secondary)]">
                {activePersona.badgeId}
              </span>
            </div>
            <div className="text-[11px] font-mono space-y-0.5 text-[var(--text-secondary)]">
              <p className="truncate">Department: <span className="text-[var(--text-primary)]">{activePersona.department}</span></p>
              <p className="truncate">Jurisdiction: <span className="text-[var(--text-primary)]">{activePersona.jurisdiction}</span></p>
            </div>
          </div>

          {/* Access PIN */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider font-mono">
                Security Access Token / PIN
              </label>
              <span className="text-[10px] font-mono text-[var(--text-muted)]">Pre-authorized demo key</span>
            </div>
            <div className="flex items-center rounded-xl border border-[var(--surface-border)] bg-[var(--surface-canvas)] px-3 py-2">
              <Lock className="h-4 w-4 text-[var(--text-secondary)] mr-2 shrink-0" />
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="PIN..."
                className="w-full bg-transparent text-xs font-mono text-[var(--text-primary)] outline-none"
                required
              />
            </div>
          </div>

          {/* Launch Action */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#94a3b8] text-xs font-bold text-[#080e1a] uppercase tracking-wider transition-all hover:bg-[#f8fafc] active:scale-[0.98] disabled:opacity-50 cursor-pointer shadow-lg shadow-[#94a3b8]/20"
          >
            {isSubmitting ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Launch Department Console</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-1.5 pt-1 text-center text-[10px] font-mono text-[var(--text-muted)]">
            <CheckCircle2 className="h-3.5 w-3.5 text-[var(--color-accent-cyan)]" />
            <span>BEL Multi-Agency Role-Based Access Control (RBAC)</span>
          </div>
        </form>
      </div>
    </div>
  );
}
