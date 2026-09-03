'use client';

import React from 'react';
import { Sparkles, MoreHorizontal } from 'lucide-react';
import { useAuthStore } from '@/features/auth/authStore';
import { ROLE_NAVIGATION } from '@/features/navigation/roleNavConfig';
import { type UserRole } from '@/config/site';

export interface MobileBottomNavProps {
  activeView: string;
  onViewChange: (view: string) => void;
  onOpenRoleSwitcher: () => void;
  onOpenMobileDrawer: () => void;
}

export function MobileBottomNav({
  activeView,
  onViewChange,
  onOpenRoleSwitcher,
  onOpenMobileDrawer,
}: MobileBottomNavProps) {
  const currentUser = useAuthStore((state) => state.currentUser);
  const currentRole: UserRole = currentUser?.role || 'iccc_admin';

  const allNavItems = ROLE_NAVIGATION[currentRole] || ROLE_NAVIGATION.iccc_admin;

  // Show first 4 items on the bar, and a 'More' drawer trigger if > 4 items
  const hasMore = allNavItems.length > 4;
  const visibleItems = hasMore ? allNavItems.slice(0, 3) : allNavItems.slice(0, 4);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-14 w-full items-center justify-around border-t border-[#12544F] bg-[#092328]/95 backdrop-blur-md px-1 md:hidden select-none">
      {/* 1. Visible Core Sub-Page Tabs */}
      {visibleItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeView === item.id;

        return (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`relative flex flex-1 flex-col items-center justify-center py-1 transition-all cursor-pointer ${
              isActive ? 'text-[#f0fdf4]' : 'text-[#8BBB92] hover:text-[#f0fdf4]'
            }`}
          >
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-lg transition-all ${
                isActive
                  ? 'bg-[#12544F] border border-[#2A835F] text-[#f0fdf4] shadow-sm'
                  : 'bg-transparent text-[#8BBB92]'
              }`}
            >
              <Icon className="h-4 w-4" />
            </div>

            <span
              className={`mt-0.5 text-[9px] font-medium tracking-tight truncate max-w-[72px] text-center ${
                isActive ? 'font-bold text-[#f0fdf4]' : 'text-[#8BBB92]'
              }`}
            >
              {item.label.replace('&', '').split(' ').filter(Boolean).slice(0, 2).join(' ')}
            </span>

            {/* Badge Indicator */}
            {item.badge && (
              <span className="absolute top-1 right-2 flex h-2 w-2 rounded-full bg-[#2A835F] ring-1 ring-[#092328]" />
            )}
          </button>
        );
      })}

      {/* 2. 'More' Menu Trigger (if role has > 4 sub-pages) */}
      {hasMore && (
        <button
          onClick={onOpenMobileDrawer}
          className="flex flex-1 flex-col items-center justify-center py-1 text-[#8BBB92] hover:text-[#f0fdf4] transition-all cursor-pointer"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg text-[#8BBB92]">
            <MoreHorizontal className="h-4 w-4" />
          </div>
          <span className="mt-0.5 text-[9px] font-medium tracking-tight">More</span>
        </button>
      )}

      {/* 3. Quick Role Switcher Button */}
      <button
        onClick={onOpenRoleSwitcher}
        title="Switch Department Role"
        className="flex flex-1 flex-col items-center justify-center py-1 text-[#8BBB92] hover:text-[#f0fdf4] transition-all cursor-pointer"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#2A835F] bg-[#12544F] text-[#8BBB92]">
          <Sparkles className="h-3.5 w-3.5" />
        </div>
        <span className="mt-0.5 text-[9px] font-medium tracking-tight text-[#8BBB92]">Role</span>
      </button>
    </nav>
  );
}
