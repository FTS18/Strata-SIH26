'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { StatusTicker } from '@/components/layout/StatusTicker';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { RightSidebar } from '@/components/layout/RightSidebar';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { RoleSwitcherModal } from '@/components/ui/RoleSwitcherModal';
import { LoginPage } from '@/features/auth/components/LoginPage';
import { LandingPage } from '@/features/landing';
import { useAuthStore } from '@/features/auth/authStore';
import { ROLE_NAVIGATION } from '@/features/navigation/roleNavConfig';
import { type RoadDefect, type VehicleIncident } from '@/types';
import { type UserRole } from '@/config/site';

// Spatial Map & HUD
import { MapViewport } from '@/features/gis-map/components/MapViewport';
import { DualStreamCommandCenter } from '@/features/command-center/components/DualStreamCommandCenter';

import { DefectInspectionDrawer } from '@/features/road-defects/components/DefectInspectionDrawer';
import { IncidentReportDrawer } from '@/features/command-center/components/IncidentReportDrawer';

// Executive Sub-Pages
import { WardComplianceView } from '@/features/roles/components/executive/WardComplianceView';
import { BudgetForecastView } from '@/features/roles/components/executive/BudgetForecastView';
import { EdgeNetworkHealthView } from '@/features/roles/components/executive/EdgeNetworkHealthView';
import { PipelineObservabilityView } from '@/features/roles/components/executive/PipelineObservabilityView';

// PWD Sub-Pages
import { PwdConsole } from '@/features/roles/components/PwdConsole';
import { DefectEstimatorView } from '@/features/roles/components/pwd/DefectEstimatorView';
import { AutoAuditVerificationView } from '@/features/roles/components/pwd/AutoAuditVerificationView';
import { RoadHeatmapView } from '@/features/roles/components/pwd/RoadHeatmapView';

// Police Sub-Pages
import { PoliceConsole } from '@/features/roles/components/PoliceConsole';
import { WarrantHotlistView } from '@/features/roles/components/police/WarrantHotlistView';
import { EChallanView } from '@/features/roles/components/police/EChallanView';
import { ViolationHeatmapView } from '@/features/roles/components/police/ViolationHeatmapView';

// Fleet Sub-Pages
import { FleetConsole } from '@/features/roles/components/FleetConsole';
import { CorridorDelaysView } from '@/features/roles/components/fleet/CorridorDelaysView';
import { CrowdDensityView } from '@/features/roles/components/fleet/CrowdDensityView';
import { LiveVideoStreamView } from '@/features/video-stream/components/LiveVideoStreamView';

// Field Crew Sub-Pages
import { FieldCrewConsole } from '@/features/roles/components/FieldCrewConsole';
import { GpsDispatchView } from '@/features/roles/components/field-crew/GpsDispatchView';
import { PhotoAuditUploadView } from '@/features/roles/components/field-crew/PhotoAuditUploadView';
import { MaterialInventoryView } from '@/features/roles/components/field-crew/MaterialInventoryView';

// Stores & Adapters
import { useTelemetryStore } from '@/features/fleet-telemetry/telemetryStore';
import { useWorkOrderStore } from '@/features/roles/stores/workOrderStore';
import { FleetTelemetryAdapter } from '@/services/fleetTelemetryAdapter';
import { soundEffects } from '@/lib/soundEffects';

export default function AppClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const currentUser = useAuthStore((state) => state.currentUser);
  const login = useAuthStore((state) => state.login);
  const currentRole = currentUser?.role || 'iccc_admin';

  const [isRoleSwitcherOpen, setIsRoleSwitcherOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [activeReportItem, setActiveReportItem] = useState<{
    item: RoadDefect | VehicleIncident | null;
    category: 'defect' | 'incident' | null;
  }>({ item: null, category: null });
  const [isReportDrawerOpen, setIsReportDrawerOpen] = useState(false);

  // Read URL query params on initial mount
  const urlMode = searchParams.get('mode');
  const urlRole = searchParams.get('role') as UserRole | null;
  const urlView = searchParams.get('view');

  const [isConsoleMode, setIsConsoleMode] = useState<boolean>(() => {
    return Boolean(urlMode === 'console' || (urlView && urlView !== 'landing'));
  });

  const roleNavItems = ROLE_NAVIGATION[currentRole] || ROLE_NAVIGATION.iccc_admin;
  const [activeView, setActiveView] = useState<string>(urlView || roleNavItems[0]?.id || 'gis_map');

  // Sync console mode from URL
  useEffect(() => {
    if (urlMode === 'console' || (urlView && urlView !== 'landing')) {
      setIsConsoleMode(true);
    }
  }, [urlMode, urlView]);

  // Sync role if specified in URL
  useEffect(() => {
    if (urlRole && urlRole !== currentRole) {
      login(urlRole);
    }
  }, [urlRole, currentRole, login]);

  // Sync view from URL if valid for current role
  useEffect(() => {
    if (urlView && urlView !== 'landing') {
      setActiveView(urlView);
    } else {
      const items = ROLE_NAVIGATION[currentRole] || ROLE_NAVIGATION.iccc_admin;
      setActiveView(items[0]?.id || 'gis_map');
    }
  }, [urlView, currentRole]);

  // Ensure light mode attributes are completely stripped
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('light');
      document.documentElement.removeAttribute('data-theme');
    }
  }, []);

  // Helper to handle view changes and update URL
  const handleViewChange = (newView: string) => {
    setActiveView(newView);
    const params = new URLSearchParams();
    params.set('role', currentRole);
    params.set('view', newView);
    router.push(`/?${params.toString()}`, { scroll: false });
  };

  // Helper to handle role selection from modal
  const handleSelectRole = (newRole: UserRole) => {
    login(newRole);
    const items = ROLE_NAVIGATION[newRole] || ROLE_NAVIGATION.iccc_admin;
    const defaultView = items[0]?.id || 'gis_map';
    setActiveView(defaultView);
    const params = new URLSearchParams();
    params.set('role', newRole);
    params.set('view', defaultView);
    router.push(`/?${params.toString()}`, { scroll: false });
  };

  // Global Zustand state selectors
  const buses = useTelemetryStore((state) => state.buses);
  const defects = useTelemetryStore((state) => state.defects);
  const incidents = useTelemetryStore((state) => state.incidents);
  const selectedDefectId = useTelemetryStore((state) => state.selectedDefectId);
  const bandwidthMetrics = useTelemetryStore((state) => state.bandwidthMetrics);
  const avgFleetFps = useTelemetryStore((state) => state.avgFleetFps);
  const autoVerifiedRepairs = useTelemetryStore((state) => state.autoVerifiedRepairsCount);

  const updateBusTelemetry = useTelemetryStore((state) => state.updateBusTelemetry);
  const addRoadDefect = useTelemetryStore((state) => state.addRoadDefect);
  const addVehicleIncident = useTelemetryStore((state) => state.addVehicleIncident);
  const setSelectedDefectId = useTelemetryStore((state) => state.setSelectedDefectId);
  const createTicketFromDefect = useWorkOrderStore((state) => state.createTicketFromDefect);

  // Initialize Telemetry Ingestion Adapter on mount
  useEffect(() => {
    const adapter = new FleetTelemetryAdapter();
    adapter.connect({
      onBusUpdate: (bus) => updateBusTelemetry(bus),
      onDefectDetected: (defect) => {
        addRoadDefect(defect);
      },
      onIncidentDetected: (incident) => {
        addVehicleIncident(incident);
      },
    });

    return () => adapter.disconnect();
  }, [updateBusTelemetry, addRoadDefect, addVehicleIncident]);

  const activeBusCount = useMemo(() => Object.keys(buses).length || 4, [buses]);

  const activeSelectedDefect = useMemo(() => {
    return defects.find((d) => d.id === selectedDefectId) || null;
  }, [defects, selectedDefectId]);

  const handleSelectDefect = (defectId: string) => {
    setSelectedDefectId(defectId);
    const defect = defects.find((d) => d.id === defectId) || null;
    if (defect) {
      setActiveReportItem({ item: defect, category: 'defect' });
      setIsReportDrawerOpen(true);
    }
  };

  const handleSelectIncident = (incidentId: string) => {
    const inc = incidents.find((i) => i.id === incidentId) || null;
    if (inc) {
      setActiveReportItem({ item: inc, category: 'incident' });
      setIsReportDrawerOpen(true);
    }
  };

  const currentActiveReportItem = useMemo(() => {
    if (!activeReportItem.item || !activeReportItem.category) return null;
    if (activeReportItem.category === 'defect') {
      return defects.find((d) => d.id === activeReportItem.item?.id) || activeReportItem.item;
    }
    return incidents.find((i) => i.id === activeReportItem.item?.id) || activeReportItem.item;
  }, [activeReportItem, defects, incidents]);

  // Find active label for header title
  const currentNavConfig = roleNavItems.find((item) => item.id === activeView);
  const activeViewTitle = currentNavConfig?.label.toUpperCase() || 'OPERATIONAL CONSOLE';

  const handleLaunchConsole = (selectedRole?: UserRole) => {
    if (selectedRole) {
      login(selectedRole);
    }
    setIsConsoleMode(true);
    const params = new URLSearchParams();
    params.set('mode', 'console');
    if (selectedRole) params.set('role', selectedRole);
    router.push(`/?${params.toString()}`, { scroll: false });
  };

  const handleReturnToLanding = () => {
    setIsConsoleMode(false);
    router.push('/', { scroll: false });
  };

  if (!isAuthenticated || !isConsoleMode) {
    return (
      <LandingPage
        onLaunchConsole={handleLaunchConsole}
      />
    );
  }

  const isMapOrOverview = activeView === 'gis_map';

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[var(--surface-canvas)] text-[var(--text-primary)]">
      {/* 1. Far Left: Expandable Dynamic Role-Based Sidebar (Responsive Overlay on Mobile) */}
      <AppSidebar
        activeView={activeView}
        onViewChange={handleViewChange}
        onOpenRoleSwitcher={() => setIsRoleSwitcherOpen(true)}
        isMobileOpen={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
      />

      {/* 2. Main Center & Right Container */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        {/* Top 44px Header */}
        <Header
          activeBusCount={activeBusCount}
          activeViewTitle={activeViewTitle}
          onOpenRoleSwitcher={() => setIsRoleSwitcherOpen(true)}
          onToggleMobileNav={() => setIsMobileNavOpen(!isMobileNavOpen)}
          onOpenLanding={handleReturnToLanding}
        />

        {/* Viewport Canvas + Draggable Right Situational HUD */}
        <div className="relative flex flex-1 overflow-hidden pb-14 md:pb-0">
          {/* Main Canvas Viewport */}
          <main className="relative flex flex-1 h-full w-full overflow-hidden bg-[var(--surface-canvas)]">
            {/* Edge Vision & GIS Dual-Stream Operations Command Center */}
            {activeView === 'command_center' && (
              <DualStreamCommandCenter />
            )}

            {/* GIS Map */}
            {activeView === 'gis_map' && (
              <MapViewport
                onDefectClick={handleSelectDefect}
                onBusClick={(busId) => console.log('Bus clicked:', busId)}
              />
            )}

            {/* Executive Views */}
            {activeView === 'ward_compliance' && <WardComplianceView />}
            {activeView === 'budget_forecast' && <BudgetForecastView />}
            {activeView === 'edge_health' && <EdgeNetworkHealthView />}
            {activeView === 'pipeline_observability' && <PipelineObservabilityView />}

            {/* PWD Views */}
            {activeView === 'pwd_kanban' && <PwdConsole />}
            {activeView === 'defect_estimator' && <DefectEstimatorView />}
            {activeView === 'auto_audit' && <AutoAuditVerificationView />}
            {activeView === 'road_heatmaps' && <RoadHeatmapView />}

            {/* Police Views */}
            {activeView === 'anpr_radar' && <PoliceConsole />}
            {activeView === 'warrant_hotlist' && <WarrantHotlistView />}
            {activeView === 'echallan' && <EChallanView />}
            {activeView === 'violation_heatmaps' && <ViolationHeatmapView />}

            {/* Fleet Views */}
            {activeView === 'fleet_grid' && <FleetConsole />}
            {activeView === 'corridor_delays' && <CorridorDelaysView />}
            {activeView === 'crowd_density' && <CrowdDensityView />}
            {activeView === 'video_stream' && <LiveVideoStreamView />}

            {/* Field Crew Views */}
            {activeView === 'field_queue' && <FieldCrewConsole />}
            {activeView === 'gps_dispatch' && <GpsDispatchView />}
            {activeView === 'photo_audit' && <PhotoAuditUploadView />}
            {activeView === 'material_inventory' && <MaterialInventoryView />}
          </main>

          {/* Right Situational HUD (Draggable / Resizable / Collapsible) */}
          {isMapOrOverview && (
            <RightSidebar
              defects={defects}
              incidents={incidents}
              bandwidthMetrics={bandwidthMetrics}
              activeBusCount={activeBusCount}
              onSelectDefect={handleSelectDefect}
              onSelectIncident={handleSelectIncident}
            />
          )}

          {/* Incident & Distress Official Report Publisher Drawer */}
          <IncidentReportDrawer
            item={currentActiveReportItem}
            category={activeReportItem.category}
            isOpen={isReportDrawerOpen}
            onClose={() => setIsReportDrawerOpen(false)}
            onReportPublished={() => {}}
          />
        </div>

        {/* Bottom Status Ticker (Hidden on mobile or above bottom nav) */}
        <div className="hidden sm:block">
          <StatusTicker
            metrics={bandwidthMetrics}
            avgFps={avgFleetFps}
            totalPotholes={defects.length || 1}
            activeIncidents={incidents.length || 6}
            autoVerifiedRepairs={autoVerifiedRepairs}
          />
        </div>
      </div>

      {/* 3. Mobile Bottom Navigation Bar (Across all roles) */}
      <MobileBottomNav
        activeView={activeView}
        onViewChange={handleViewChange}
        onOpenRoleSwitcher={() => setIsRoleSwitcherOpen(true)}
        onOpenMobileDrawer={() => setIsMobileNavOpen(true)}
      />

      {/* In-Place Role Switcher Modal */}
      <RoleSwitcherModal
        isOpen={isRoleSwitcherOpen}
        onClose={() => setIsRoleSwitcherOpen(false)}
        onSelectRole={handleSelectRole}
      />
    </div>
  );
}
