import type { Metadata } from 'next';
import { Anton, Bricolage_Grotesque } from 'next/font/google';
import './globals.css';

const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-anton',
  display: 'swap',
});

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  display: 'swap',
});

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
    <html lang="en" className={`h-full w-full dark ${anton.variable} ${bricolage.variable}`}>
      <body className="min-h-screen w-full bg-[#092328] font-sans text-[#f0fdf4] antialiased">
        {children}
      </body>
    </html>
  );
}
