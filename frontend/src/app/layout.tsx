import type { Metadata } from 'next';
import { Anton, Bricolage_Grotesque } from 'next/font/google';
import './globals.css';

const displayFont = Anton({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const bricolageFont = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-sans',
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
    <html
      lang="en"
      className={`h-full w-full ${displayFont.variable} ${bricolageFont.variable}`}
    >
      <body className="h-full w-full overflow-hidden bg-[#092328] font-sans text-[#f0fdf4] antialiased select-none">
        {children}
      </body>
    </html>
  );
}
