'use client';

import React, { useState } from 'react';
import { Menu, X, ArrowUpRight, ShieldCheck, Activity } from 'lucide-react';
import { APP_CONFIG } from '@/config/constants';

interface LandingNavbarProps {
  onOpenLogin: () => void;
}

export function LandingNavbar({ onOpenLogin }: LandingNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#12544F]/20 bg-[#FBFDFB]/95 backdrop-blur-md text-[#092328] transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2A835F] text-[#f0fdf4] font-display text-lg font-bold shadow-md shadow-[#2A835F]/20">
            S
          </div>
          <div className="flex flex-col">
            <span className="font-display text-xl font-bold tracking-tight text-[#092328] leading-none uppercase">
              {APP_CONFIG.APP_NAME}
            </span>
            <span className="text-[10px] font-mono tracking-wider text-[#2A835F] font-semibold">
              URBAN EDGE INTELLIGENCE
            </span>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#092328]/80">
          <a 
            href="#capabilities" 
            className="transition-colors hover:text-[#2A835F]"
          >
            Capabilities
          </a>
          <a 
            href="#sovereignty" 
            className="transition-colors hover:text-[#2A835F]"
          >
            Sovereignty & Security
          </a>
          <a 
            href="#infrastructure" 
            className="transition-colors hover:text-[#2A835F]"
          >
            Infrastructure
          </a>
          <a 
            href="#faq" 
            className="transition-colors hover:text-[#2A835F]"
          >
            FAQ
          </a>
        </nav>

        {/* Right Action / CTA */}
        <div className="hidden sm:flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2 rounded-full border border-[#2A835F]/30 bg-[#2A835F]/10 px-3 py-1 text-xs font-mono text-[#092328]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2A835F] opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#2A835F]"></span>
            </span>
            <span>BEL SIH26124 Active</span>
          </div>

          <button
            type="button"
            onClick={onOpenLogin}
            className="group flex items-center gap-2 rounded-full bg-[#092328] px-5 py-2.5 text-xs font-semibold text-[#f0fdf4] transition-all hover:bg-[#12544F] hover:shadow-lg hover:shadow-[#092328]/15 active:scale-95 cursor-pointer"
          >
            <span>Launch Console</span>
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[#8BBB92]" />
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-[#092328] hover:bg-[#12544F]/10"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="border-b border-[#12544F]/20 bg-[#FBFDFB] px-4 py-4 sm:hidden space-y-3 shadow-lg">
          <nav className="flex flex-col gap-2.5 text-sm font-medium text-[#092328]">
            <a 
              href="#capabilities" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 rounded-md hover:bg-[#2A835F]/10"
            >
              Capabilities
            </a>
            <a 
              href="#sovereignty" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 rounded-md hover:bg-[#2A835F]/10"
            >
              Sovereignty & Security
            </a>
            <a 
              href="#infrastructure" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 rounded-md hover:bg-[#2A835F]/10"
            >
              Infrastructure
            </a>
            <a 
              href="#faq" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 rounded-md hover:bg-[#2A835F]/10"
            >
              FAQ
            </a>
          </nav>
          <div className="pt-2 border-t border-[#12544F]/15">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLogin();
              }}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#092328] py-2.5 text-xs font-semibold text-[#f0fdf4]"
            >
              <span>Launch Console</span>
              <ArrowUpRight className="h-3.5 w-3.5 text-[#8BBB92]" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
