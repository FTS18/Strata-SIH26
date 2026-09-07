'use client';

import React from 'react';
import { Radio, Sparkles, Menu } from 'lucide-react';
import { APP_CONFIG } from '@/config/constants';
import { useAuthStore } from '@/features/auth/authStore';

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

  return (
    <header className="flex h-11 w-full items-center justify-between border-b border-[#12544F] bg-[#092328] px-3 sm:px-4 select-none z-20 shrink-0">
      {/* Left: Mobile Menu Trigger + Clean View Title */}
      <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 overflow-hidden">
        {/* Mobile Menu Button */}
        <button
          onClick={onToggleMobileNav}
          title="Open Navigation Menu"
          className="flex md:hidden h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[#12544F] bg-[#0d3137] text-[#8BBB92] hover:text-[#f0fdf4]"
        >
          <Menu className="h-4 w-4" />
        </button>

        {/* Mobile-only brand badge when sidebar is hidden */}
        <span className="md:hidden font-display text-sm font-bold tracking-wider text-[#f0fdf4] uppercase shrink-0">
          {APP_CONFIG.APP_NAME}
        </span>
        <span className="md:hidden text-xs text-[#5b9076] shrink-0">/</span>

        {/* View Title */}
        <span className="text-xs sm:text-sm font-bold text-[#f0fdf4] tracking-wide uppercase truncate max-w-[200px] sm:max-w-[340px] md:max-w-none">
          {activeViewTitle}
        </span>
      </div>

      {/* Right: Indicators + Theme Toggle + Switch Role + Landing Portal */}
      <div className="flex items-center gap-2 sm:gap-3 text-xs font-mono shrink-0">
        {/* Bus Count */}
        <div className="hidden sm:flex items-center gap-1.5 text-[#8BBB92]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#8BBB92]" />
          <span className="font-semibold text-[#f0fdf4] tabular-nums">{activeBusCount}</span>
          <span className="hidden md:inline text-[#8BBB92] text-[11px]">Buses Active</span>
        </div>

        {/* Live Mesh Indicator */}
        <div className="hidden sm:flex items-center gap-1.5 text-[#8BBB92]">
          <Radio className="h-3.5 w-3.5 text-[#2A835F] animate-pulse" />
          <span className="hidden md:inline text-[11px] font-semibold text-[#f0fdf4]">EDGE MESH</span>
        </div>

        {/* Return to Landing Page Button */}
        {onOpenLanding && (
          <button
            onClick={onOpenLanding}
            title="Return to Public Landing Page"
            className="flex items-center gap-1 sm:gap-1.5 rounded border border-[#144943] bg-[#0d3137] px-2.5 py-1 text-[11px] font-semibold text-[#8BBB92] transition-all hover:bg-[#12544F] hover:text-[#f0fdf4] cursor-pointer shadow-sm active:scale-95 shrink-0"
          >
            <span>Landing Page</span>
          </button>
        )}

        {/* Switch Role Button */}
        <button
          onClick={onOpenRoleSwitcher}
          title="Switch Department Role"
          className="flex items-center gap-1 sm:gap-1.5 rounded border border-[#2A835F] bg-[#12544F] px-2.5 py-1 text-[11px] font-semibold text-[#f0fdf4] transition-all hover:bg-[#2A835F] cursor-pointer shadow-sm active:scale-95 shrink-0"
        >
          <Sparkles className="h-3 w-3 text-[#8BBB92]" />
          <span className="hidden sm:inline">Switch Role</span>
          <span className="sm:hidden">Role</span>
        </button>
      </div>
    </header>
  );
}
