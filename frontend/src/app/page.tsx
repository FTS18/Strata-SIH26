import React, { Suspense } from 'react';
import AppClient from './AppClient';

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen w-full items-center justify-center bg-[#092328] text-xs font-mono text-[#8BBB92]">
          Initializing Strata Platform...
        </div>
      }
    >
      <AppClient />
    </Suspense>
  );
}
