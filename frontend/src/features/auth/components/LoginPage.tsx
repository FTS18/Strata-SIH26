'use client';

import React, { useState } from 'react';
import { Shield, Wrench, Bus, HardHat, LayoutDashboard, Lock, ArrowRight, CheckCircle2, ChevronDown } from 'lucide-react';
import { type UserRole } from '@/config/site';
import { useAuthStore, DEMO_PERSONAS } from '../authStore';
import { APP_CONFIG } from '@/config/constants';

export function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole>('iccc_admin');
  const [pin, setPin] = useState('8821');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const login = useAuthStore((state) => state.login);

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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      login(selectedRole);
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="flex min-h-screen w-screen items-center justify-center bg-[#092328] p-4 text-[#f0fdf4] select-none">
      <div className="w-full max-w-md overflow-hidden rounded-xl border border-[#12544F] bg-[#0d3137] shadow-2xl shadow-[#092328]">
        {/* Top Header Banner */}
        <div className="border-b border-[#12544F] bg-[#092328] p-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-[#8BBB92] text-[#092328] font-display text-2xl font-bold shadow-md">
            S
          </div>
          <h1 className="mt-3 font-display text-2xl font-bold tracking-wider text-[#f0fdf4] uppercase">
            {APP_CONFIG.APP_NAME}
          </h1>
          <p className="mt-0.5 text-xs font-mono text-[#8BBB92]">
            BHARAT ELECTRONICS LIMITED · {APP_CONFIG.PROBLEM_ID}
          </p>
          <p className="mt-1 text-[11px] text-[#5b9076]">
            AI-Powered Mobile Urban Intelligence Platform
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleLogin} className="p-6 space-y-4">
          {/* Role Selection Dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#8BBB92] uppercase tracking-wider font-mono">
              Select Department & Role
            </label>
            <div className="relative">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                className="w-full appearance-none rounded-lg border border-[#12544F] bg-[#12544F]/60 px-3.5 py-2.5 text-xs font-medium text-[#f0fdf4] outline-none transition-colors focus:border-[#2A835F] cursor-pointer"
              >
                {roleOptions.map((opt) => (
                  <option key={opt.id} value={opt.id} className="bg-[#0d3137] text-[#f0fdf4]">
                    {opt.title}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3.5 top-3 h-4 w-4 text-[#8BBB92]" />
            </div>
          </div>

          {/* Persona Clearance Card */}
          <div className="rounded-lg border border-[#12544F] bg-[#092328]/80 p-3.5 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#f0fdf4]">{activePersona.name}</span>
              <span className="rounded border border-[#2A835F] bg-[#12544F] px-2 py-0.5 text-[10px] font-mono text-[#8BBB92]">
                {activePersona.badgeId}
              </span>
            </div>

            <div className="text-[11px] font-mono space-y-0.5 text-[#8BBB92]">
              <p className="truncate">Dept: <span className="text-[#f0fdf4]">{activePersona.department}</span></p>
              <p className="truncate">Zone: <span className="text-[#f0fdf4]">{activePersona.jurisdiction}</span></p>
            </div>
          </div>

          {/* Security PIN / Access Code */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-[#8BBB92] uppercase tracking-wider font-mono">
                Security Access Token / PIN
              </label>
              <span className="text-[10px] font-mono text-[#5b9076]">Demo pre-filled</span>
            </div>
            <div className="flex items-center rounded-lg border border-[#12544F] bg-[#12544F]/60 px-3 py-2">
              <Lock className="h-4 w-4 text-[#8BBB92] mr-2" />
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter 4-digit PIN..."
                className="w-full bg-transparent text-xs font-mono text-[#f0fdf4] outline-none placeholder:text-[#5b9076]"
                required
              />
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#8BBB92] text-xs font-bold text-[#092328] uppercase tracking-wider transition-all hover:bg-[#f0fdf4] active:scale-[0.98] disabled:opacity-50 cursor-pointer shadow-md"
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

          {/* Security Standard Note */}
          <div className="flex items-center justify-center gap-1.5 pt-2 text-center text-[10px] font-mono text-[#5b9076]">
            <CheckCircle2 className="h-3.5 w-3.5 text-[#2A835F]" />
            <span>BEL Multi-Agency Role-Based Access Control (RBAC)</span>
          </div>
        </form>
      </div>
    </div>
  );
}
