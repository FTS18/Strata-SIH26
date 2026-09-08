'use client';

import React from 'react';
import { Radio, Sparkles, Menu, ShieldCheck, HardDrive } from 'lucide-react';
import { APP_CONFIG } from '@/config/constants';
import { useAuthStore } from '@/features/auth/authStore';
import { useTelemetryStore } from '@/features/fleet-telemetry/telemetryStore';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export interface HeaderProps {
  activeBusCount: number;
  activeViewTitle?: string;
  onOpenRoleSwitcher?: () => void;
  onToggleMobileNav?: () => void;
  onOpenLanding?: () => void;
}

export function Header({
  activeBusCount,
  activeViewTitle = 'GIS SPATIAL INTELLIGENCE CANVAS',
  onOpenRoleSwitcher,
  onToggleMobileNav,
  onOpenLanding,
}: HeaderProps) {
  const currentUser = useAuthStore((state) => state.currentUser);
  const setIsSpeedBreakerModalOpen = useTelemetryStore((state) => state.setIsSpeedBreakerModalOpen);
  const setIsRingBufferModalOpen = useTelemetryStore((state) => state.setIsRingBufferModalOpen);
  const isCommandCenter = activeViewTitle.includes('COMMAND CENTER') || activeViewTitle.includes('DUAL-STREAM');

  return (
    <header className="flex h-12 w-full items-center justify-between border-b border-[var(--surface-border)] bg-[var(--surface-canvas)] px-3 sm:px-4 select-none z-20 shrink-0">
      {/* Left: Mobile Menu Trigger + Clean View Title */}
      <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 overflow-hidden">
        {/* Mobile Menu Button */}
        <button
          onClick={onToggleMobileNav}
          title="Open Navigation Menu"
          className="flex md:hidden h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[var(--surface-border)] bg-[var(--surface-panel)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        >
          <Menu className="h-4 w-4" />
        </button>

        {/* View Title & Subtitle */}
        <div className="flex flex-col min-w-0">
          <span className="text-xs sm:text-sm font-bold text-[var(--text-primary)] tracking-wide uppercase truncate">
            {activeViewTitle}
          </span>
          {isCommandCenter && (
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 leading-none">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live Operations</span>
            </div>
          )}
        </div>
      </div>

      {/* Right: Indicators + Modals + Switch Role + Landing Portal */}
      <div className="flex items-center gap-2 sm:gap-2.5 text-xs font-mono shrink-0">
        {/* Bus Count */}
        <div className="hidden sm:flex items-center gap-1.5 text-[var(--text-secondary)]">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-[var(--text-primary)] tabular-nums">{activeBusCount}</span>
          <span className="hidden md:inline text-[var(--text-secondary)] text-[11px]">Buses Active</span>
        </div>

        {/* Live Mesh Indicator */}
        <div className="hidden sm:flex items-center gap-1.5 text-[var(--text-secondary)]">
          <Radio className="h-3.5 w-3.5 text-blue-600 dark:text-[var(--color-accent-cyan)] animate-pulse" />
          <span className="hidden md:inline text-[11px] font-semibold text-[var(--text-primary)]">EDGE MESH</span>
        </div>

        {/* Command Center Action Buttons: Speed Breaker Whitelist + 72h Ring Buffer */}
        {isCommandCenter && (
          <>
            <button
              type="button"
              onClick={() => setIsSpeedBreakerModalOpen(true)}
              className="hidden lg:flex items-center gap-1.5 rounded-md border border-[var(--surface-border)] bg-[var(--surface-canvas)] px-2.5 py-1 text-[11px] font-semibold text-[var(--text-secondary)] transition-all hover:bg-[var(--surface-subtle)] hover:text-[var(--text-primary)] cursor-pointer shadow-xs active:scale-95 shrink-0"
              title="Speed Breaker GIS Spatial Whitelist"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Speed Breaker GIS Filter</span>
            </button>

            <button
              type="button"
              onClick={() => setIsRingBufferModalOpen(true)}
              className="hidden lg:flex items-center gap-1.5 rounded-md border border-[var(--surface-border)] bg-[var(--surface-canvas)] px-2.5 py-1 text-[11px] font-semibold text-[var(--text-secondary)] transition-all hover:bg-[var(--surface-subtle)] hover:text-[var(--text-primary)] cursor-pointer shadow-xs active:scale-95 shrink-0"
              title="72-Hour Offline Circular Ring Buffer"
            >
              <HardDrive className="h-3.5 w-3.5 text-sky-600 dark:text-cyan-400" />
              <span>72h Ring Buffer (NVMe)</span>
            </button>
          </>
        )}

        {/* Return to Landing Page Button */}
        {onOpenLanding && (
          <button
            onClick={onOpenLanding}
            title="Return to Public Landing Page"
            className="flex items-center gap-1 sm:gap-1.5 rounded-md border border-[var(--surface-border)] bg-[var(--surface-panel)] px-2.5 py-1 text-[11px] font-semibold text-[var(--text-secondary)] transition-all hover:bg-[var(--surface-subtle)] hover:text-[var(--text-primary)] cursor-pointer shadow-xs active:scale-95 shrink-0"
          >
            <span>Landing Page</span>
          </button>
        )}

        {/* Light / Dark Mode Toggle */}
        <ThemeToggle showLabel={false} />

        {/* Switch Role Button */}
        <button
          onClick={onOpenRoleSwitcher}
          title="Switch Department Role"
          className="flex items-center gap-1 sm:gap-1.5 rounded-md border border-blue-600 bg-blue-600 text-white hover:bg-blue-700 px-2.5 py-1 text-[11px] font-semibold transition-all cursor-pointer shadow-xs active:scale-95 shrink-0"
        >
          <Sparkles className="h-3 w-3 text-white" />
          <span className="hidden sm:inline">Switch Role</span>
          <span className="sm:hidden">Role</span>
        </button>
      </div>
    </header>
  );
}
