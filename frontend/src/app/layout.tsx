import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'STRATA — Autonomous Mobile Urban Intelligence Platform',
  description: 'Bharat Electronics Limited (SIH26124) Fleet Urban Intelligence Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full w-full">
      <body className="min-h-screen w-full bg-[#092328] font-sans text-[#f0fdf4] antialiased">
        {children}
      </body>
    </html>
  );
}
