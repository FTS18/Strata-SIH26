'use client';

import React, { useState } from 'react';
import {
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  X,
} from 'lucide-react';
import { useAuthStore } from '@/features/auth/authStore';
import { ROLE_NAVIGATION } from '@/features/navigation/roleNavConfig';
import { formatEnumLabel } from '@/lib/utils';

export interface AppSidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  onOpenRoleSwitcher?: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function AppSidebar({
  activeView,
  onViewChange,
  onOpenRoleSwitcher,
  isMobileOpen = false,
  onCloseMobile,
}: AppSidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const currentUser = useAuthStore((state) => state.currentUser);
  const logout = useAuthStore((state) => state.logout);

  const currentRole = currentUser?.role || 'iccc_admin';
  const navItems = ROLE_NAVIGATION[currentRole] || ROLE_NAVIGATION.iccc_admin;

  const handleItemClick = (id: string) => {
    onViewChange(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden animate-in fade-in"
        />
      )}

      {/* Main Sidebar Container (Fixed overlay on Mobile, Flex on Desktop) */}
      <aside
        className={`z-50 flex h-screen flex-col justify-between border-r border-[#12544F] bg-[#092328] py-3.5 select-none shrink-0 transition-all duration-200 ${
          isMobileOpen
            ? 'fixed inset-y-0 left-0 w-64 px-3 shadow-2xl flex md:relative'
            : 'hidden md:flex'
        } ${isExpanded ? 'md:w-60 md:px-3' : 'md:w-16 md:items-center md:px-2'}`}
      >
        {/* Top: Brand Logo & Role Title */}
        <div className="flex w-full flex-col gap-3">
          <div className={`flex items-center ${isExpanded || isMobileOpen ? 'justify-between' : 'justify-center'} w-full`}>
            <div
              onClick={() => handleItemClick(navItems[0]?.id || 'gis_map')}
              title="STRATA — BEL SIH26124"
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-[#2A835F] text-[#092328] font-display text-lg font-bold shadow-md transition-transform hover:scale-105 shrink-0"
            >
              S
            </div>

            {(isExpanded || isMobileOpen) && (
              <div className="flex flex-1 flex-col pl-2.5 overflow-hidden">
                <span className="font-display text-base font-bold tracking-wider text-[#f0fdf4] uppercase truncate">
                  STRATA
                </span>
                <span className="text-[10px] font-mono text-[#8BBB92] truncate">
                  BEL · SIH26124
                </span>
              </div>
            )}

            {/* Close button on Mobile, Collapse/Expand on Desktop */}
            {isMobileOpen ? (
              <button
                onClick={onCloseMobile}
                className="flex md:hidden h-8 w-8 items-center justify-center rounded-md text-[#8BBB92] hover:bg-[#12544F] hover:text-[#f0fdf4]"
              >
                <X className="h-4 w-4" />
              </button>
            ) : isExpanded ? (
              <button
                onClick={() => setIsExpanded(false)}
                title="Collapse Sidebar"
                className="hidden md:flex h-7 w-7 items-center justify-center rounded-md text-[#8BBB92] hover:bg-[#12544F] hover:text-[#f0fdf4] transition-colors cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            ) : null}
          </div>

          {!isExpanded && !isMobileOpen && (
            <button
              onClick={() => setIsExpanded(true)}
              title="Expand Sidebar"
              className="hidden md:flex h-6 w-full items-center justify-center rounded text-[#5b9076] hover:bg-[#12544F] hover:text-[#8BBB92] transition-colors cursor-pointer"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          )}

          {(isExpanded || isMobileOpen) && currentUser && (
            <div className="rounded-lg border border-[#12544F] bg-[#0d3137] p-2 space-y-0.5">
              <span className="text-[10px] font-mono uppercase text-[#5b9076]">
                Active Console
              </span>
              <p className="text-xs font-bold text-[#f0fdf4] truncate">
                {formatEnumLabel(currentRole)}
              </p>
            </div>
          )}

          <div className="h-px w-full bg-[#12544F]" />

          {/* Dynamic Navigation Items */}
          <nav className="flex w-full flex-col gap-1.5 overflow-y-auto max-h-[calc(100vh-280px)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  title={!isExpanded && !isMobileOpen ? item.label : undefined}
                  className={`group relative flex h-10 items-center rounded-lg transition-all cursor-pointer ${
                    isExpanded || isMobileOpen ? 'w-full px-2.5 gap-2.5' : 'w-10 justify-center mx-auto'
                  } ${
                    isActive
                      ? 'bg-[#12544F] text-[#f0fdf4] border border-[#2A835F] shadow-sm'
                      : 'text-[#8BBB92] hover:bg-[#12544F]/60 hover:text-[#f0fdf4]'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />

                  {(isExpanded || isMobileOpen) && (
                    <span className="text-xs font-semibold truncate text-left flex-1">
                      {item.label}
                    </span>
                  )}

                  {item.badge && (
                    <span
                      className={`${
                        isExpanded || isMobileOpen ? 'ml-auto' : 'absolute -top-1 -right-1'
                      } flex h-3.5 items-center justify-center rounded bg-[#2A835F] px-1 text-[8px] font-mono font-bold text-[#092328]`}
                    >
                      {item.badge}
                    </span>
                  )}

                  {/* Tooltip on hover when desktop collapsed */}
                  {!isExpanded && !isMobileOpen && (
                    <div className="pointer-events-none absolute left-14 z-50 hidden rounded border border-[#12544F] bg-[#0d3137] px-2.5 py-1 text-xs font-medium text-[#f0fdf4] shadow-lg whitespace-nowrap group-hover:flex">
                      {item.label}
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom: Officer Profile & Switch/Logout */}
        <div className="flex w-full flex-col gap-2">
          <div className="h-px w-full bg-[#12544F]" />

          {/* Quick Role Switcher Button */}
          <button
            onClick={() => {
              if (onCloseMobile) onCloseMobile();
              if (onOpenRoleSwitcher) onOpenRoleSwitcher();
            }}
            title="Switch Department Role"
            className={`flex h-10 items-center rounded-lg border border-[#12544F] bg-[#0d3137] text-xs font-semibold text-[#8BBB92] hover:bg-[#12544F] hover:text-[#f0fdf4] transition-all cursor-pointer ${
              isExpanded || isMobileOpen ? 'w-full px-2.5 gap-2 justify-start' : 'w-10 justify-center mx-auto'
            }`}
          >
            <Sparkles className="h-4 w-4 text-[#8BBB92] shrink-0" />
            {(isExpanded || isMobileOpen) && <span>Switch Persona</span>}
          </button>

          {currentUser && (
            <div
              onClick={() => {
                if (onCloseMobile) onCloseMobile();
                if (onOpenRoleSwitcher) onOpenRoleSwitcher();
              }}
              title={`${currentUser.name} (${currentUser.badgeId})\nClick to switch department`}
              className={`flex items-center rounded-lg border border-[#12544F] bg-[#0d3137] text-xs font-bold text-[#8BBB92] font-mono cursor-pointer transition-colors hover:bg-[#12544F] hover:text-[#f0fdf4] ${
                isExpanded || isMobileOpen ? 'w-full p-2 gap-2.5' : 'h-10 w-10 justify-center mx-auto'
              }`}
            >
              <span className="shrink-0 text-[#8BBB92] font-bold">{currentUser.avatarInitials}</span>
              {(isExpanded || isMobileOpen) && (
                <div className="flex flex-col text-left overflow-hidden">
                  <span className="text-xs font-semibold text-[#f0fdf4] truncate">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-[#5b9076] font-mono truncate">
                    {currentUser.badgeId}
                  </span>
                </div>
              )}
            </div>
          )}

          <button
            onClick={logout}
            title="Logout"
            className={`flex h-9 items-center justify-center rounded-lg text-[#8BBB92] transition-colors hover:bg-rose-950/40 hover:text-rose-400 hover:border hover:border-rose-800/40 cursor-pointer ${
              isExpanded || isMobileOpen ? 'w-full gap-2 text-xs font-semibold' : 'w-10 mx-auto'
            }`}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {(isExpanded || isMobileOpen) && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}

