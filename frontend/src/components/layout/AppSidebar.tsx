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
import { ThemeToggle } from '@/components/ui/ThemeToggle';

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
        className={`z-50 flex h-screen flex-col justify-between border-r border-[var(--surface-border)] bg-[var(--surface-canvas)] py-3.5 select-none shrink-0 transition-all duration-200 ${
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
              title="STRATA — Bharat Electronics Limited (BEL)"
              className="group flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg p-0.5 transition-transform hover:scale-105 shrink-0"
            >
              {/* Dark mode emblem: crisp high-contrast white */}
              <img
                src="/emblem-dark.svg"
                alt="State Emblem of India"
                className="hidden dark:block h-10 w-auto max-w-full object-contain opacity-90 group-hover:opacity-100 transition-opacity drop-shadow-sm"
              />
              {/* Light mode emblem: crisp deep navy slate */}
              <img
                src="/emblem-light.svg"
                alt="State Emblem of India"
                className="block dark:hidden h-10 w-auto max-w-full object-contain opacity-95 group-hover:opacity-100 transition-opacity drop-shadow-sm"
              />
            </div>

            {(isExpanded || isMobileOpen) && (
              <div className="flex flex-1 flex-col pl-2.5 overflow-hidden">
                <span className="font-display text-base font-bold tracking-wider text-[var(--text-primary)] uppercase truncate">
                  STRATA
                </span>
                <span className="text-[10px] font-mono text-[var(--text-secondary)] truncate">
                  BEL · SIH26124
                </span>
              </div>
            )}

            {/* Close button on Mobile, Collapse/Expand on Desktop */}
            {isMobileOpen ? (
              <button
                onClick={onCloseMobile}
                className="flex md:hidden h-8 w-8 items-center justify-center rounded-md text-[var(--text-secondary)] hover:bg-[var(--surface-subtle)] hover:text-[var(--text-primary)]"
              >
                <X className="h-4 w-4" />
              </button>
            ) : isExpanded ? (
              <button
                onClick={() => setIsExpanded(false)}
                title="Collapse Sidebar"
                className="hidden md:flex h-7 w-7 items-center justify-center rounded-md text-[var(--text-secondary)] hover:bg-[var(--surface-subtle)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            ) : null}
          </div>

          {!isExpanded && !isMobileOpen && (
            <button
              onClick={() => setIsExpanded(true)}
              title="Expand Sidebar"
              className="hidden md:flex h-6 w-full items-center justify-center rounded text-[var(--text-muted)] hover:bg-[var(--surface-subtle)] hover:text-[var(--text-secondary)] transition-colors cursor-pointer"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          )}

          {(isExpanded || isMobileOpen) && currentUser && (
            <div className="rounded-lg border border-[var(--surface-border)] bg-[var(--surface-panel)] p-2 space-y-0.5">
              <span className="text-[10px] font-mono uppercase text-[var(--text-muted)]">
                Active Console
              </span>
              <p className="text-xs font-bold text-[var(--text-primary)] truncate">
                {formatEnumLabel(currentRole)}
              </p>
            </div>
          )}

          <div className="h-px w-full bg-[var(--surface-subtle)]" />

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
                      ? 'bg-[var(--surface-active)] text-white shadow-md shadow-blue-950/40 font-semibold'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--surface-subtle)] hover:text-[var(--text-primary)]'
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
                      } flex h-3.5 items-center justify-center rounded bg-[var(--color-accent-primary)] px-1 text-[8px] font-mono font-bold text-[var(--text-inverse)]`}
                    >
                      {item.badge}
                    </span>
                  )}

                  {/* Tooltip on hover when desktop collapsed */}
                  {!isExpanded && !isMobileOpen && (
                    <div className="pointer-events-none absolute left-14 z-50 hidden rounded border border-[var(--surface-border)] bg-[var(--surface-panel)] px-2.5 py-1 text-xs font-medium text-[var(--text-primary)] shadow-lg whitespace-nowrap group-hover:flex">
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
          <div className="h-px w-full bg-[var(--surface-subtle)]" />

          {/* Theme Mode Toggle Button */}
          <ThemeToggle
            variant="sidebar"
            showLabel={isExpanded || isMobileOpen}
            className={isExpanded || isMobileOpen ? 'w-full px-2.5 gap-2 justify-start' : 'w-10 justify-center mx-auto'}
          />

          {/* Quick Role Switcher Button */}
          <button
            onClick={() => {
              if (onCloseMobile) onCloseMobile();
              if (onOpenRoleSwitcher) onOpenRoleSwitcher();
            }}
            title="Switch Department Role"
            className={`flex h-10 items-center rounded-lg border border-[var(--surface-border)] bg-[var(--surface-panel)] text-xs font-semibold text-[var(--text-secondary)] hover:bg-[var(--surface-subtle)] hover:text-[var(--text-primary)] transition-all cursor-pointer ${
              isExpanded || isMobileOpen ? 'w-full px-2.5 gap-2 justify-start' : 'w-10 justify-center mx-auto'
            }`}
          >
            <Sparkles className="h-4 w-4 text-[var(--text-secondary)] shrink-0" />
            {(isExpanded || isMobileOpen) && <span>Switch Persona</span>}
          </button>

          {currentUser && (
            <div
              onClick={() => {
                if (onCloseMobile) onCloseMobile();
                if (onOpenRoleSwitcher) onOpenRoleSwitcher();
              }}
              title={`${currentUser.name} (${currentUser.badgeId})\nClick to switch department`}
              className={`flex items-center rounded-lg border border-[var(--surface-border)] bg-[var(--surface-panel)] text-xs font-bold text-[var(--text-secondary)] font-mono cursor-pointer transition-colors hover:bg-[var(--surface-subtle)] hover:text-[var(--text-primary)] ${
                isExpanded || isMobileOpen ? 'w-full p-2 gap-2.5' : 'h-10 w-10 justify-center mx-auto'
              }`}
            >
              <span className="shrink-0 text-[var(--text-secondary)] font-bold">{currentUser.avatarInitials}</span>
              {(isExpanded || isMobileOpen) && (
                <div className="flex flex-col text-left overflow-hidden">
                  <span className="text-xs font-semibold text-[var(--text-primary)] truncate">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)] font-mono truncate">
                    {currentUser.badgeId}
                  </span>
                </div>
              )}
            </div>
          )}

          <button
            onClick={logout}
            title="Logout"
            className={`flex h-9 items-center justify-center rounded-lg text-[var(--text-secondary)] transition-colors hover:bg-rose-950/40 hover:text-rose-400 hover:border hover:border-rose-800/40 cursor-pointer ${
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

