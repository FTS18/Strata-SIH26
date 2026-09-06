'use client';

import React, { useState, useMemo } from 'react';
import { ShieldAlert, Search, FileText, CheckCircle2, Navigation, AlertTriangle, Flag, Download } from 'lucide-react';
import { calculateLevenshteinDistance } from '@/lib/geoAlgorithms';
import { Button } from '@/components/ui/Button';
import { useTelemetryStore } from '@/features/fleet-telemetry/telemetryStore';
import { usePoliceStore } from '../stores/policeStore';
import { exportEChallanDossier } from '@/lib/pdfExporter';

export function PoliceConsole() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlate, setSelectedPlate] = useState<string>('KA 02 MM 9091');
  const [challanIssued, setChallanIssued] = useState<string | null>(null);
  const [mediaMode, setMediaMode] = useState<'delhi_gif' | 'delhi_mp4' | 'auto_anpr'>('auto_anpr');
  const [streamSource, setStreamSource] = useState<'live_model' | 'video_hud'>('live_model');
  const [showBoundingBoxes, setShowBoundingBoxes] = useState<boolean>(true);

  const incidents = useTelemetryStore((state) => state.incidents);
  const warrants = usePoliceStore((state) => state.warrants);
  const challans = usePoliceStore((state) => state.challans);
  const issueChallan = usePoliceStore((state) => state.issueChallan);
  const addWarrant = usePoliceStore((state) => state.addWarrant);
  const activeToast = usePoliceStore((state) => state.activeToast);

  const baselineHotlist = useMemo(
    () => [
      {
        plate: 'KA 02 MM 9091',
        reason: 'Commercial Lane Infraction & HSRP Verification',
        status: 'Live Radar Sighting',
        flaggedAt: 'Live (Just Now)',
        location: 'Central Outer Ring Road (ANPR Lane)',
        speed: 64.8,
        busId: 'Bus 104 (DL-1PC-8840)',
        confidence: 98.4,
        vehicleType: 'Volvo XC60 Luxury SUV (Black)',
        sourceTag: 'YOLOV8 + PLATENET DETECTED',
        targetMode: 'auto_anpr' as const,
        proofImageUrl: undefined as string | undefined,
        isPublished: false,
        dispatchReference: undefined as string | undefined,
      },
      {
        plate: 'UP 16 BT 5797',
        reason: 'Commercial Carrier Speeding in High Security Zone',
        status: 'Live Radar Sighting',
        flaggedAt: '2 mins ago',
        location: 'Kartavya Path / Rajpath (India Gate Corridor)',
        speed: 68.2,
        busId: 'Bus 102 (DL-1PC-9210)',
        confidence: 98.4,
        vehicleType: 'White Toyota Innova (Balaji Travels)',
        sourceTag: 'BYTETRACK VERIFIED',
        targetMode: 'delhi_gif' as const,
        proofImageUrl: undefined as string | undefined,
        isPublished: false,
        dispatchReference: undefined as string | undefined,
      },
      {
        plate: 'DL 2C AS 7150',
        reason: 'Dangerous Overtaking & Corridor Speeding',
        status: 'Active Police Warrant',
        flaggedAt: '12 mins ago',
        location: 'C-Hexagon Corridor (India Gate)',
        speed: 74.0,
        busId: 'Bus 102 (DL-1PC-9210)',
        confidence: 96.8,
        vehicleType: 'Silver Toyota Innova',
        sourceTag: 'ANPR RADAR SIGHTING',
        targetMode: 'delhi_mp4' as const,
        proofImageUrl: undefined as string | undefined,
        isPublished: false,
        dispatchReference: undefined as string | undefined,
      },
      {
        plate: 'KA 02 MH 7256',
        reason: 'Suspected False Registration Tag',
        status: 'Investigation Alert',
        flaggedAt: '35 mins ago',
        location: 'Outer Ring Road (Tech Corridor)',
        speed: 52.0,
        busId: 'Bus 104 (DL-1PC-8840)',
        confidence: 94.6,
        vehicleType: 'Blue Honda City Sedan',
        sourceTag: 'ANPR OCR CONFIRMED',
        targetMode: 'auto_anpr' as const,
        proofImageUrl: undefined as string | undefined,
        isPublished: false,
        dispatchReference: undefined as string | undefined,
      },
      {
        plate: 'DL 1P B 4820',
        reason: 'Missing Commercial Fitness Certificate & Lane Weaving',
        status: 'Impound Notice',
        flaggedAt: 'Today 08:30 AM',
        location: 'Janpath Light Point (Central Secretariat)',
        speed: 42.0,
        busId: 'Bus 108 (DL-1PC-4820)',
        confidence: 94.2,
        vehicleType: 'Yellow-Green Auto Rickshaw',
        sourceTag: 'HSRP OCR CONFIRMED',
        targetMode: 'delhi_gif' as const,
        proofImageUrl: undefined as string | undefined,
        isPublished: false,
        dispatchReference: undefined as string | undefined,
      },
    ],
    []
  );

  const hotlist = useMemo(() => {
    // 1. ONLY include incidents that have been officially PUBLISHED by the operator
    const dynamicItems = incidents
      .filter((inc) => inc.suspectPlate && inc.reportStatus === 'published')
      .map((inc) => {
        const matchingChallan = challans.find(
          (c) => c.incidentId === inc.id || c.plate === inc.suspectPlate || c.id === inc.dispatchReference
        );
        const matchingWarrant = warrants.find(
          (w) => w.incidentId === inc.id || w.plate === inc.suspectPlate || w.caseFir === inc.dispatchReference
        );
        const ref = inc.dispatchReference || matchingChallan?.id || matchingWarrant?.caseFir;

        return {
          plate: inc.suspectPlate!,
          reason: inc.reason || `${inc.type.replace(/_/g, ' ').toUpperCase()}`,
          status: `DISPATCHED · ${ref || 'CTP-CHALLAN'}`,
          flaggedAt: inc.publishedAt ? 'Dispatched' : 'Just Now (Edge Bus)',
          location: inc.locationName,
          speed: inc.speedKmH || 65.0,
          busId: inc.reportedByBusId || 'CTU Sensing Bus (CAM1)',
          confidence: Math.round((inc.ocrConfidence || 0.98) * 100),
          vehicleType: inc.vehicleDescription || 'Private Vehicle (Sedan/SUV)',
          sourceTag: 'CENTRAL E-CHALLAN DISPATCHED',
          targetMode: 'auto_anpr' as const,
          proofImageUrl: inc.cropImageUrl || inc.proofImageUrl || '/evidence/pothole_cam1_crop.jpg',
          isPublished: true,
          dispatchReference: ref,
        };
      });

    // 2. Add any official challans not already mapped
    const challanItems = challans
      .filter((c) => !dynamicItems.some((d) => d.plate === c.plate))
      .map((c) => ({
        plate: c.plate,
        reason: c.violationType,
        status: `DISPATCHED · ${c.id}`,
        flaggedAt: 'E-Challan Cell',
        location: c.location,
        speed: c.speedObservedKmH,
        busId: c.reportingBusId,
        confidence: Math.round(c.ocrConfidence * 100),
        vehicleType: c.vehicleType,
        sourceTag: 'OFFICIAL E-CHALLAN RECORD',
        targetMode: 'auto_anpr' as const,
        proofImageUrl: c.proofImageUrl || '/evidence/pothole_cam1_crop.jpg',
        isPublished: true,
        dispatchReference: c.id,
      }));

    const combined = [...dynamicItems, ...challanItems];
    const baselineFiltered = baselineHotlist.filter((b) => !combined.some((c) => c.plate === b.plate));
    return [...combined, ...baselineFiltered];
  }, [incidents, challans, warrants, baselineHotlist]);

  const filteredHotlist = hotlist.filter((item) => {
    if (!searchQuery.trim()) return true;
    const dist = calculateLevenshteinDistance(searchQuery, item.plate);
    return dist <= 3 || item.plate.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const activeEvidence = hotlist.find((h) => h.plate === selectedPlate) || hotlist[0];

  const handleSelectHotlistItem = (item: (typeof hotlist)[0]) => {
    setSelectedPlate(item.plate);
    if (item.targetMode) {
      setMediaMode(item.targetMode);
    }
  };

  const handleModeSwitch = (mode: 'delhi_gif' | 'delhi_mp4' | 'auto_anpr') => {
    setMediaMode(mode);
    if (mode === 'auto_anpr') {
      setSelectedPlate('KA 02 MM 9091');
    } else {
      setSelectedPlate('UP 16 BT 5797');
    }
  };

  const handleIssueChallan = () => {
    issueChallan({
      plate: activeEvidence.plate,
      vehicleType: activeEvidence.vehicleType,
      violationType: activeEvidence.reason,
      fineAmount: 2000,
      speedObservedKmH: activeEvidence.speed,
      speedLimitKmH: 50,
      location: activeEvidence.location,
      coords: { lat: 28.6143, lng: 77.2090 },
      reportingBusId: activeEvidence.busId,
      ocrConfidence: activeEvidence.confidence / 100,
      status: 'UNPAID',
    });
    setChallanIssued(activeEvidence.plate);
    setTimeout(() => {
      setChallanIssued(null);
    }, 4000);
  };

  const handleExportDossier = () => {
    exportEChallanDossier({
      challanNumber: activeEvidence.dispatchReference || `ECH-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      plateNumber: activeEvidence.plate,
      violationType: activeEvidence.reason,
      fineAmount: 2000,
      location: activeEvidence.location,
      timestamp: new Date().toLocaleString('en-IN'),
      reportingBusId: activeEvidence.busId,
      ocrConfidence: activeEvidence.confidence / 100,
      vehicleSpeed: activeEvidence.speed,
      speedLimit: 50,
    });
  };

  const handleFlagToHotlist = () => {
    addWarrant({
      plate: activeEvidence.plate,
      vehicleModel: activeEvidence.vehicleType,
      warrantReason: activeEvidence.reason,
      caseFir: `FIR #${Math.floor(200 + Math.random() * 800)}/2026`,
      policeStation: 'Delhi Traffic Police Headquarters',
      lastSightedByBus: activeEvidence.busId,
      status: 'Active Warrant',
      priority: 'Critical',
    });
  };

  return (
    <div className="flex h-full w-full flex-col gap-3 sm:gap-4 overflow-y-auto p-3 sm:p-4 bg-[#092328] text-[#f0fdf4]">
      {/* Toast Notification Banner */}
      {activeToast && (
        <div className="flex items-center justify-between rounded-lg border border-[#2A835F] bg-[#12544F] px-4 py-2 font-mono text-xs text-[#f0fdf4] shadow-md animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-[#8BBB92]" />
            <span>{activeToast}</span>
          </div>
        </div>
      )}
      {/* Top Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-4 border-b border-[#12544F] pb-3 shrink-0">
        <div className="flex flex-1 items-center gap-2 rounded-lg border border-[#12544F] bg-[#0d3137] px-3.5 py-2 shadow-sm">
          <Search className="h-4 w-4 text-[#8BBB92] shrink-0" />
          <input
            type="text"
            placeholder="Search License Plate (Fuzzy ANPR: e.g. HR 26 DQ 4410)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs font-mono text-[#f0fdf4] outline-none placeholder:text-[#5b9076]"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-xs text-[#8BBB92] hover:text-[#f0fdf4] shrink-0">
              Clear
            </button>
          )}
        </div>

        <span className="self-start sm:self-auto rounded border border-rose-800/40 bg-rose-950/40 px-3 py-1.5 text-xs font-mono text-rose-400 font-medium shrink-0">
          {hotlist.length} Law Enforcement Hotlists Active
        </span>
      </div>

      {/* Main Responsive Grid: 1 Col on Mobile/Tablet, 2 Cols on Large Desktop */}
      <div className="grid flex-1 grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 overflow-y-auto">
        {/* Left: Hotlist & Live Incident Database */}
        <div className="flex flex-col rounded-lg border border-[#12544F] bg-[#0d3137] overflow-hidden min-h-[280px]">
          <div className="flex items-center justify-between border-b border-[#12544F] bg-[#092328] px-3.5 py-2.5 shrink-0">
            <span className="text-xs font-semibold text-[#f0fdf4]">
              Active Incidents & Police Hotlist (ByteTrack + ANPR)
            </span>
            <span className="text-[11px] font-mono text-[#8BBB92]">Fuzzy Match Enabled</span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {filteredHotlist.map((item) => (
              <div
                key={item.plate}
                onClick={() => handleSelectHotlistItem(item)}
                className={`flex cursor-pointer flex-col gap-1.5 rounded-lg border p-3 transition-all select-none ${
                  selectedPlate === item.plate
                    ? 'border-rose-600/60 bg-rose-950/30'
                    : 'border-[#12544F] bg-[#12544F]/40 hover:bg-[#12544F]'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-[#f0fdf4]">
                      {item.plate}
                    </span>
                    <span className="text-[11px] text-[#8BBB92]">({item.vehicleType})</span>
                  </div>
                  {item.isPublished ? (
                    <span className="rounded border border-emerald-500/70 bg-emerald-950/80 px-2 py-0.5 text-[10px] font-mono text-emerald-300 font-bold shrink-0 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                      {item.dispatchReference || 'DISPATCHED'}
                    </span>
                  ) : (
                    <span className="rounded border border-rose-800/40 bg-rose-950/40 px-2 py-0.5 text-[10px] font-mono text-rose-400 shrink-0">
                      {item.status}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#8BBB92]">{item.reason}</p>
                <div className="flex justify-between text-[11px] font-mono text-[#5b9076]">
                  <span>Speed: {item.speed} km/h</span>
                  <span>{item.flaggedAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Live Sighting Evidence & Kinematics Dossier */}
        <div className="flex flex-col rounded-lg border border-[#12544F] bg-[#0d3137] overflow-hidden min-h-[320px]">
          <div className="flex items-center justify-between border-b border-[#12544F] bg-[#092328] px-3.5 py-2.5 shrink-0">
            <span className="text-xs font-semibold text-[#f0fdf4]">
              Live Edge Sighting Evidence & Trajectory Kinematics
            </span>
            <span className="rounded border border-[#2A835F] bg-[#12544F] px-2 py-0.5 text-[10px] font-mono text-[#8BBB92] font-medium">
              {activeEvidence.confidence}% OCR Confidence
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
            {/* ANPR Live Video Tracking Stream */}
            <div className="relative flex min-h-[220px] w-full flex-col justify-between rounded-lg border border-[#12544F] bg-[#06191c] overflow-hidden font-mono shadow-md">
              {/* Media Header & Mode Switcher */}
              <div className="flex flex-wrap justify-between items-center gap-1.5 text-[10px] text-[#8BBB92] bg-[#092328]/95 px-3 py-1.5 border-b border-[#144943] z-20">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-bold text-[#f0fdf4]">{activeEvidence.busId.toUpperCase()}</span>
                  <span className="hidden sm:inline text-[#5b9076]">· YOLOV8 + PLATENET</span>
                </div>
                
                <div className="flex items-center gap-1 flex-wrap">
                  {/* Stream Engine Selector */}
                  <div className="flex items-center bg-[#06191c] rounded p-0.5 border border-[#144943] mr-1">
                    <button
                      onClick={() => setStreamSource('live_model')}
                      className={`px-1.5 py-0.5 rounded text-[9px] font-bold cursor-pointer transition-all ${
                        streamSource === 'live_model'
                          ? 'bg-emerald-600 text-white shadow'
                          : 'text-[#8BBB92] hover:text-white'
                      }`}
                      title="Direct Python YOLOv8 Inference Stream on Port 8080"
                    >
                      LIVE MODEL
                    </button>
                    <button
                      onClick={() => setStreamSource('video_hud')}
                      className={`px-1.5 py-0.5 rounded text-[9px] font-bold cursor-pointer transition-all ${
                        streamSource === 'video_hud'
                          ? 'bg-[#2A835F] text-[#f0fdf4]'
                          : 'text-[#8BBB92] hover:text-white'
                      }`}
                      title="HD Video Stream with Vehicle Detection HUD"
                    >
                      HD + HUD
                    </button>
                  </div>

                  {/* Camera Angles */}
                  <button
                    onClick={() => handleModeSwitch('auto_anpr')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-all ${
                      mediaMode === 'auto_anpr'
                        ? 'bg-[#2A835F] text-[#f0fdf4]'
                        : 'bg-[#0d3137] text-[#8BBB92] hover:text-[#f0fdf4]'
                    }`}
                  >
                    ANPR LANE (VOLVO)
                  </button>
                  <button
                    onClick={() => handleModeSwitch('delhi_gif')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-all ${
                      mediaMode === 'delhi_gif'
                        ? 'bg-[#2A835F] text-[#f0fdf4]'
                        : 'bg-[#0d3137] text-[#8BBB92] hover:text-[#f0fdf4]'
                    }`}
                  >
                    DELHI RAJPATH (INNOVA)
                  </button>
                  <button
                    onClick={() => handleModeSwitch('delhi_mp4')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-all ${
                      mediaMode === 'delhi_mp4'
                        ? 'bg-[#2A835F] text-[#f0fdf4]'
                        : 'bg-[#0d3137] text-[#8BBB92] hover:text-[#f0fdf4]'
                    }`}
                  >
                    DELHI RADAR
                  </button>
                </div>
              </div>

              {/* Live Computer Vision Model Video Stream */}
              <div className="relative flex-1 flex items-center justify-center bg-black overflow-hidden min-h-[190px] max-h-[250px]">
                {streamSource === 'live_model' ? (
                  <img
                    src={`http://localhost:8080/stream?cam=${mediaMode === 'auto_anpr' ? 'cam2' : 'cam4'}`}
                    alt="Strata Live Python YOLOv8 & PlateNet AI Inference Stream"
                    className="h-full w-full object-cover"
                    onError={() => setStreamSource('video_hud')}
                  />
                ) : activeEvidence.proofImageUrl ? (
                  <div className="relative h-full w-full flex items-center justify-center bg-[#06191c]">
                    <img
                      src={activeEvidence.proofImageUrl}
                      alt="Captured ANPR Optical Evidence"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/evidence/pothole_cam1_crop.jpg';
                      }}
                    />
                    <div className="absolute inset-0 pointer-events-none p-3 flex flex-col justify-between bg-gradient-to-t from-[#092328]/80 via-transparent to-[#092328]/50">
                      <div className="flex items-center justify-between text-[9px] font-mono">
                        <span className="bg-[#092328]/90 text-emerald-400 border border-emerald-500/50 px-2 py-0.5 rounded font-bold">
                          RADAR LOCKED · {activeEvidence.speed} km/h
                        </span>
                        {activeEvidence.isPublished && (
                          <span className="bg-emerald-950/90 text-emerald-300 border border-emerald-500/70 px-2 py-0.5 rounded font-bold">
                            {activeEvidence.dispatchReference}
                          </span>
                        )}
                      </div>
                      <div className="mx-auto my-auto w-48 h-18 border-2 border-dashed border-emerald-400/90 rounded relative flex flex-col justify-between p-1.5 bg-emerald-950/30 shadow-[0_0_15px_rgba(52,211,153,0.3)]">
                        <span className="text-[10px] font-mono font-bold text-emerald-300 text-center">
                          {activeEvidence.plate}
                        </span>
                        <span className="text-[8px] font-mono text-[#8BBB92] text-center">
                          {activeEvidence.vehicleType}
                        </span>
                      </div>
                      <div className="flex justify-between text-[8px] font-mono text-[#8BBB92] bg-[#092328]/80 px-2 py-0.5 rounded">
                        <span>{activeEvidence.location}</span>
                        <span className="text-emerald-400 font-bold">{activeEvidence.confidence}% OCR CONF</span>
                      </div>
                    </div>
                  </div>
                ) : mediaMode === 'delhi_gif' ? (
                  <img
                    src="/videos/tracker_output.gif"
                    alt="ANPR Delhi Rajpath Vehicle Tracker"
                    className="h-full w-full object-cover opacity-95"
                  />
                ) : mediaMode === 'delhi_mp4' ? (
                  <video
                    src="/videos/delhi_rajpath_anpr.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <video
                    src="/videos/Automatic Number Plate Recognition (ANPR) _ Vehicle Number Plate Recognition (1).mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="h-full w-full object-cover"
                  />
                )}

                {/* Real-Time AI Detection Bounding Box HUD (Shown on Video/Fallback) */}
                {streamSource !== 'live_model' && (
                  <div className="absolute inset-0 pointer-events-none z-10 select-none">
                    {mediaMode === 'auto_anpr' ? (
                      <>
                        {/* 1. Target Car: Volvo XC60 */}
                        <div className="absolute top-[25%] left-[28%] w-[46%] h-[64%] border-2 border-emerald-400 rounded-xs shadow-[0_0_12px_rgba(52,211,153,0.4)]">
                          {/* Corner Reticle Brackets */}
                          <div className="absolute -top-0.5 -left-0.5 w-3 h-3 border-t-2 border-l-2 border-white" />
                          <div className="absolute -top-0.5 -right-0.5 w-3 h-3 border-t-2 border-r-2 border-white" />
                          <div className="absolute -bottom-0.5 -left-0.5 w-3 h-3 border-b-2 border-l-2 border-white" />
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 border-b-2 border-r-2 border-white" />
                          
                          {/* Vehicle Classification Badge */}
                          <div className="absolute -top-5 left-0 bg-[#092328]/95 border border-emerald-400 px-1.5 py-0.5 text-[9px] font-mono font-bold text-emerald-300">
                            [CAR 94.2%] VOLVO XC60
                          </div>
                        </div>

                        {/* 2. License Plate Crop: KA 02 MM 9091 */}
                        <div className="absolute top-[66.5%] left-[44.2%] w-[11.2%] h-[5.6%] border-2 border-emerald-400 bg-emerald-500/25 shadow-[0_0_20px_rgba(52,211,153,0.9)] rounded-xs animate-pulse">
                          {/* Targeting Crosshair */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-emerald-400" />
                          </div>
                          
                          {/* OCR Plate Banner */}
                          <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-emerald-950/95 border border-emerald-400 px-2 py-0.5 text-[9px] font-mono font-bold text-emerald-300 whitespace-nowrap shadow-lg">
                            PLATE: KA 02 MM 9091 · 98.4% OCR
                          </div>
                        </div>

                        {/* 3. Secondary Vehicle: Blue Sedan */}
                        <div className="absolute top-[48%] left-[76%] w-[9%] h-[6%] border border-cyan-400/80 bg-cyan-500/10">
                          <div className="absolute -top-4 left-0 bg-black/80 text-[8px] text-cyan-300 px-1 whitespace-nowrap">
                            KA 02 MH 7256
                          </div>
                        </div>

                        {/* 4. Secondary Vehicle: Red Hatchback */}
                        <div className="absolute top-[35%] left-[14%] w-[24%] h-[27%] border border-amber-400/70 bg-amber-500/10">
                          <div className="absolute -top-4 left-0 bg-black/80 text-[8px] text-amber-300 px-1">
                            [CAR 91%] VW POLO
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* 1. Target Car: White Toyota Innova */}
                        <div className="absolute top-[30%] left-[11%] w-[36%] h-[62%] border-2 border-emerald-400 rounded-xs shadow-[0_0_12px_rgba(52,211,153,0.4)]">
                          <div className="absolute -top-0.5 -left-0.5 w-3 h-3 border-t-2 border-l-2 border-white" />
                          <div className="absolute -top-0.5 -right-0.5 w-3 h-3 border-t-2 border-r-2 border-white" />
                          <div className="absolute -bottom-0.5 -left-0.5 w-3 h-3 border-b-2 border-l-2 border-white" />
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 border-b-2 border-r-2 border-white" />
                          
                          <div className="absolute -top-5 left-0 bg-[#092328]/95 border border-emerald-400 px-1.5 py-0.5 text-[9px] font-mono font-bold text-emerald-300">
                            [CAR 98.4%] TOYOTA INNOVA
                          </div>
                        </div>

                        {/* 2. License Plate Crop: UP 16 BT 5797 */}
                        <div className="absolute top-[55.5%] left-[19.5%] w-[12%] h-[6.8%] border-2 border-emerald-400 bg-emerald-500/25 shadow-[0_0_20px_rgba(52,211,153,0.9)] rounded-xs animate-pulse">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-emerald-400" />
                          </div>
                          <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-emerald-950/95 border border-emerald-400 px-2 py-0.5 text-[9px] font-mono font-bold text-emerald-300 whitespace-nowrap shadow-lg">
                            PLATE: UP 16 BT 5797 · 98.4% OCR
                          </div>
                        </div>

                        {/* 3. Oncoming Silver Innova */}
                        <div className="absolute top-[47%] left-[53%] w-[25%] h-[35%] border border-cyan-400/80 bg-cyan-500/10">
                          <div className="absolute -top-4 left-0 bg-black/80 text-[8px] text-cyan-300 px-1 whitespace-nowrap">
                            [CAR 96.8%] DL 2C AS 7150
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Floating Telemetry Badge from Model */}
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none z-20">
                  <div className="rounded border border-[#2A835F] bg-[#092328]/90 backdrop-blur-sm px-2.5 py-1 text-center shadow-lg">
                    <span className="text-xs sm:text-sm font-bold text-[#f0fdf4] tracking-wider">
                      {activeEvidence.plate}
                    </span>
                    <p className="text-[8px] text-[#8BBB92]">IND · HSRP DETECTED</p>
                  </div>
                  <div className="rounded border border-emerald-500/40 bg-emerald-950/80 px-2 py-0.5 text-[10px] text-emerald-400 font-bold">
                    {activeEvidence.confidence}% OCR CONF
                  </div>
                </div>
              </div>

              {/* Canvas Bottom Bar */}
              <div className="flex justify-between items-center text-[10px] text-[#5b9076] bg-[#092328]/95 px-3 py-1 border-t border-[#144943] z-10 font-mono">
                <span>Speed: {activeEvidence.speed} km/h</span>
                <span className="text-emerald-400 font-bold">STATUS: {activeEvidence.sourceTag || 'ACTIVE RADAR TRACK'}</span>
              </div>
            </div>

            {activeEvidence.isPublished && (
              <div className="flex items-center justify-between rounded-lg border border-emerald-600/70 bg-emerald-950/50 p-2.5 text-xs font-mono text-emerald-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>
                    Official E-Challan Dispatched: <strong className="text-emerald-200">{activeEvidence.dispatchReference}</strong> (Chandigarh Traffic Police Central E-Challan Cell)
                  </span>
                </div>
              </div>
            )}

            <div className="rounded-lg border border-[#12544F] bg-[#12544F]/40 p-3 text-xs space-y-2 font-mono">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-0.5">
                <span className="text-[#8BBB92]">Target Vehicle:</span>
                <span className="font-semibold text-[#f0fdf4]">{activeEvidence.plate} ({activeEvidence.vehicleType})</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-0.5">
                <span className="text-[#8BBB92]">Captured By:</span>
                <span className="text-[#8BBB92]">{activeEvidence.busId}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-0.5">
                <span className="text-[#8BBB92]">Location:</span>
                <span className="text-[#f0fdf4] truncate">{activeEvidence.location}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-0.5">
                <span className="text-[#8BBB92]">Violation Reason:</span>
                <span className="font-semibold text-rose-400">{activeEvidence.reason}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-0.5">
                <span className="text-[#8BBB92]">Measured Speed:</span>
                <span className="font-bold text-rose-400">{activeEvidence.speed} km/h (Speed Limit: 50 km/h)</span>
              </div>
            </div>

            {challanIssued === activeEvidence.plate && (
              <div className="flex items-center gap-2 rounded-lg border border-emerald-800/40 bg-emerald-950/40 p-2.5 text-xs font-mono text-emerald-400">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Instant E-Challan #ECH-9042 successfully transmitted to MoRTH VAHAN & Traffic Police Server.</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <Button
                variant="danger"
                size="sm"
                className="flex-1 py-2 text-xs"
                onClick={handleIssueChallan}
              >
                <ShieldAlert className="h-3.5 w-3.5" />
                <span>Issue Instant E-Challan</span>
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleFlagToHotlist}
                className="border-rose-900/50 bg-rose-950/40 text-rose-300 hover:bg-rose-900/40 py-2 text-xs"
              >
                <Flag className="h-3.5 w-3.5" />
                <span>Flag to Hotlist</span>
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleExportDossier}
                className="bg-[#12544F] text-[#f0fdf4] border-[#2A835F] hover:bg-[#2A835F] py-2 text-xs"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export Dossier PDF</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

