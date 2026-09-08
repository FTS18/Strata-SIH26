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
    <header className="sticky top-0 z-40 w-full border-b border-[var(--surface-border)]/20 bg-[#FBFDFB]/95 backdrop-blur-md text-[#080e1a] transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2563eb] text-[var(--text-primary)] font-display text-lg font-bold shadow-md shadow-[#2563eb]/20">
            S
          </div>
          <div className="flex flex-col">
            <span className="font-display text-xl font-bold tracking-tight text-[#080e1a] leading-none uppercase">
              {APP_CONFIG.APP_NAME}
            </span>
            <span className="text-[10px] font-mono tracking-wider text-[var(--color-accent-cyan)] font-semibold">
              URBAN EDGE INTELLIGENCE
            </span>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#080e1a]/80">
          <a 
            href="#capabilities" 
            className="transition-colors hover:text-[var(--color-accent-cyan)]"
          >
            Capabilities
          </a>
          <a 
            href="#sovereignty" 
            className="transition-colors hover:text-[var(--color-accent-cyan)]"
          >
            Sovereignty & Security
          </a>
          <a 
            href="#infrastructure" 
            className="transition-colors hover:text-[var(--color-accent-cyan)]"
          >
            Infrastructure
          </a>
          <a 
            href="#faq" 
            className="transition-colors hover:text-[var(--color-accent-cyan)]"
          >
            FAQ
          </a>
        </nav>

        {/* Right Action / CTA */}
        <div className="hidden sm:flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2 rounded-full border border-[var(--color-accent-primary)]/30 bg-[#2563eb]/10 px-3 py-1 text-xs font-mono text-[#080e1a]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2563eb] opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#2563eb]"></span>
            </span>
            <span>BEL SIH26124 Active</span>
          </div>

          <button
            type="button"
            onClick={onOpenLogin}
            className="group flex items-center gap-2 rounded-full bg-[var(--surface-canvas)] px-5 py-2.5 text-xs font-semibold text-[var(--text-primary)] transition-all hover:bg-[var(--surface-subtle)] hover:shadow-lg hover:shadow-[#080e1a]/15 active:scale-95 cursor-pointer"
          >
            <span>Launch Console</span>
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[var(--text-secondary)]" />
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-[#080e1a] hover:bg-[var(--surface-subtle)]/10"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="border-b border-[var(--surface-border)]/20 bg-[#FBFDFB] px-4 py-4 sm:hidden space-y-3 shadow-lg">
          <nav className="flex flex-col gap-2.5 text-sm font-medium text-[#080e1a]">
            <a 
              href="#capabilities" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 rounded-md hover:bg-[#2563eb]/10"
            >
              Capabilities
            </a>
            <a 
              href="#sovereignty" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 rounded-md hover:bg-[#2563eb]/10"
            >
              Sovereignty & Security
            </a>
            <a 
              href="#infrastructure" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 rounded-md hover:bg-[#2563eb]/10"
            >
              Infrastructure
            </a>
            <a 
              href="#faq" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 rounded-md hover:bg-[#2563eb]/10"
            >
              FAQ
            </a>
          </nav>
          <div className="pt-2 border-t border-[var(--surface-border)]/15">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLogin();
              }}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--surface-canvas)] py-2.5 text-xs font-semibold text-[var(--text-primary)]"
            >
              <span>Launch Console</span>
              <ArrowUpRight className="h-3.5 w-3.5 text-[var(--text-secondary)]" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
