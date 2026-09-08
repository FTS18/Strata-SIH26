import React, { Suspense } from 'react';
import AppClient from './AppClient';

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen w-full items-center justify-center bg-[var(--surface-canvas)] text-xs font-mono text-[var(--text-secondary)]">
          Initializing Strata Platform...
        </div>
      }
    >
      <AppClient />
    </Suspense>
  );
}
