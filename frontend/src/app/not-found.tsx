import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--surface-canvas)] text-[var(--text-primary)] p-4 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#2563eb] text-[var(--text-primary)] font-display text-xl font-bold mb-4">
        404
      </div>
      <h2 className="font-display text-3xl font-bold uppercase text-[var(--text-primary)]">
        Node Location Not Found
      </h2>
      <p className="mt-2 text-sm text-[var(--text-secondary)] max-w-md font-sans">
        The requested urban intelligence node or telemetry route does not exist.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#2563eb] px-6 py-2.5 text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider hover:bg-[#94a3b8] hover:text-[#080e1a] transition-all"
      >
        Return to Strata Portal
      </Link>
    </div>
  );
}
