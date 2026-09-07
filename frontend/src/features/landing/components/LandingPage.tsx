'use client';

import React, { useState } from 'react';
import { type UserRole } from '@/config/site';
import { LandingNavbar } from './LandingNavbar';
import { LandingHero } from './LandingHero';
import { LandingFeatureShowcase } from './LandingFeatureShowcase';
import { LandingSovereigntySection } from './LandingSovereigntySection';
import { LandingInfrastructureSection } from './LandingInfrastructureSection';
import { LandingFAQ } from './LandingFAQ';
import { LandingCtaBanner } from './LandingCtaBanner';
import { LandingFooter } from './LandingFooter';
import { LandingLoginModal } from './LandingLoginModal';

interface LandingPageProps {
  onLaunchConsole?: (role?: UserRole) => void;
}

export function LandingPage({ onLaunchConsole }: LandingPageProps) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleOpenLogin = () => {
    setIsLoginModalOpen(true);
  };

  const handleCloseLogin = () => {
    setIsLoginModalOpen(false);
  };

  const handleLoginSuccess = (role: UserRole) => {
    setIsLoginModalOpen(false);
    if (onLaunchConsole) {
      onLaunchConsole(role);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#FBFDFB] text-[#092328] selection:bg-[#2A835F] selection:text-[#f0fdf4]">
      {/* Top Navbar */}
      <LandingNavbar onOpenLogin={handleOpenLogin} />

      {/* Main Content Sections */}
      <main>
        {/* Hero Section with Floating Mockup */}
        <LandingHero onOpenLogin={handleOpenLogin} />

        {/* Section 2: Interactive Vertical Tab Capabilities Showcase */}
        <LandingFeatureShowcase />

        {/* Section 3: Sovereignty, Privacy & Defense-Grade Security */}
        <LandingSovereigntySection />

        {/* Section 4: 4 Department Modules & Stat Counters */}
        <LandingInfrastructureSection />

        {/* Section 5: Frequently Asked Questions */}
        <LandingFAQ />

        {/* Section 6: High-Impact Gradient CTA Banner */}
        <LandingCtaBanner onOpenLogin={handleOpenLogin} />
      </main>

      {/* Section 7: Rich Dark Footer with Giant Watermark */}
      <LandingFooter onOpenLogin={handleOpenLogin} />

      {/* Quick Launch & Department Authentication Modal */}
      <LandingLoginModal
        isOpen={isLoginModalOpen}
        onClose={handleCloseLogin}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
}
