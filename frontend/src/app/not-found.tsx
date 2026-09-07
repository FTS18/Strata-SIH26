import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#092328] text-[#f0fdf4] p-4 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#2A835F] text-[#f0fdf4] font-display text-xl font-bold mb-4">
        404
      </div>
      <h2 className="font-display text-3xl font-bold uppercase text-[#f0fdf4]">
        Node Location Not Found
      </h2>
      <p className="mt-2 text-sm text-[#8BBB92] max-w-md font-sans">
        The requested urban intelligence node or telemetry route does not exist.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#2A835F] px-6 py-2.5 text-xs font-bold text-[#f0fdf4] uppercase tracking-wider hover:bg-[#8BBB92] hover:text-[#092328] transition-all"
      >
        Return to Strata Portal
      </Link>
    </div>
  );
}
