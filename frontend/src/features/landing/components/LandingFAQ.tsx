'use client';

import React, { useState } from 'react';
import { ChevronDown, Plus, Minus } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

export function LandingFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      question: 'How does Strata install on existing municipal transit fleets?',
      answer: 'Strata requires zero mechanical modifications to city buses. An edge AI compute box (NVIDIA Jetson / Intel VPU) connects to the vehicle 24V power supply and taps into ruggedized exterior 4K cameras. Installation takes under 45 minutes per bus during scheduled overnight maintenance depot stops.',
    },
    {
      question: 'How does Strata achieve 99.8% cellular bandwidth reduction?',
      answer: 'Traditional systems stream raw video to the cloud, consuming up to 112.5 MB/min per camera. Strata runs the entire 5-Tier AI perception pipeline directly on-device. The bus transmits only lightweight, cryptographically signed JSON vector telemetry (13.2 KB/min) containing bounding boxes, GPS coordinates, and distress dimensions over standard 4G/5G SIMs.',
    },
    {
      question: 'How is citizen privacy protected under Indian DPDP regulations?',
      answer: 'All non-target citizen faces and innocent vehicle license plates are blurred on-device in memory before any video or thumbnail is saved. Raw video never enters unencrypted public transmission, ensuring complete alignment with Bharat Electronics Limited defense guidelines and the Digital Personal Data Protection (DPDP) Act.',
    },
    {
      question: 'Can Strata integrate with our existing City ICCC and GIS systems?',
      answer: 'Yes. Strata provides standardized REST, WebSocket, and GeoJSON feeds that plug directly into municipal Integrated Command & Control Centers (ICCC), Smart Cities Mission dashboards, MapLibre / ArcGIS servers, and state police dispatch centers.',
    },
    {
      question: 'How does the automated PWD contractor repair audit work?',
      answer: 'When road contractors report a pothole patch as completed, Strata flags the GPS coordinates. When any transit bus traverses that road segment on its regular route, the AI takes updated depth and profile measurements. If the pavement is verified smooth, the work order automatically closes. If the repair is defective, an escalation penalty is issued.',
    },
    {
      question: 'What happens if a bus loses cellular connectivity in a tunnel or dead zone?',
      answer: 'Strata operates completely offline-first. All detections, GPS fixes, and IMU accelerometer spikes are cached in on-device SQLite storage with cryptographic timestamping. When the vehicle re-enters network coverage, the backlog is synced in seconds without loss of telemetry.',
    },
  ];

  const toggleIndex = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="relative bg-[#FBFDFB] py-24 text-[#080e1a]">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-accent-cyan)] font-semibold">
            Common Inquiries
          </span>
          <h2 className="mt-2 font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#080e1a] uppercase">
            Frequently asked questions
          </h2>
          <p className="mt-3 text-base text-[#080e1a]/70 font-sans">
            Everything you need to know about deploying and operating Strata across municipal fleets.
          </p>
        </div>

        {/* Accordion List */}
        <div className="divide-y divide-[#111c33]/15 border-y border-[var(--surface-border)]/15">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div key={idx} className="py-5 sm:py-6 transition-colors">
                <button
                  type="button"
                  onClick={() => toggleIndex(idx)}
                  className="flex w-full items-center justify-between text-left cursor-pointer group"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg font-bold text-[#080e1a] group-hover:text-[var(--color-accent-cyan)] transition-colors pr-4">
                    {faq.question}
                  </span>
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--surface-border)]/20 text-[#080e1a] transition-colors group-hover:border-[var(--color-accent-primary)] group-hover:text-[var(--color-accent-cyan)]">
                    {isOpen ? (
                      <Minus className="h-4 w-4" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </div>
                </button>

                {isOpen && (
                  <div className="mt-4 pr-12 text-sm sm:text-base text-[#080e1a]/80 leading-relaxed font-sans animate-in fade-in duration-200">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Subtle Dot Grid pattern below FAQ */}
      <div className="mt-16 h-12 w-full bg-dot-grid-light opacity-50" />
    </section>
  );
}
