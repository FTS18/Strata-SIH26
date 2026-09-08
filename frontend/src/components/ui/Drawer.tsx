import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: string;
}

export function Drawer({
  isOpen,
  onClose,
  title,
  subtitle,
  badge,
  children,
  footer,
  width = 'w-[440px]',
}: DrawerProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div
        className={cn(
          'relative z-10 flex h-full flex-col border-l border-[var(--surface-border)] bg-[var(--surface-canvas)] text-[var(--text-primary)] shadow-[0_0_40px_rgba(0,0,0,0.9)] transition-transform duration-200 ease-out animate-in slide-in-from-right',
          width
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--surface-border)] px-5 py-4 bg-[var(--surface-panel)]">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-[var(--text-primary)] font-display">{title}</h2>
              {badge}
            </div>
            {subtitle && (
              <p className="text-xs text-[var(--text-secondary)] font-mono">{subtitle}</p>
            )}
          </div>

          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close drawer" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-subtle)]">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">{children}</div>

        {/* Footer Actions */}
        {footer && (
          <div className="border-t border-[var(--surface-border)] bg-[var(--surface-panel)] px-5 py-3.5">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
