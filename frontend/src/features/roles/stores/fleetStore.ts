import { create } from 'zustand';

export interface StopCrowd {
  stopId: string;
  stopName: string;
  corridor: string;
  waitingCommuters: number;
  crowdLevel: 'Overcrowded (>50)' | 'Moderate (20-50)' | 'Normal (<20)';
  suggestedDispatch: string;
  nearestDepot: string;
  standbyTripperId: string;
  trippersDispatched: number;
  activeAdvisory?: string;
}

export interface CorridorDelayInfo {
  corridorId: string;
  corridorName: string;
  routeId: string;
  avgSpeedKmH: number;
  freeFlowSpeedKmH: number;
  delayMinutes: number;
  activeFleetCount: number;
  congestionLevel: 'Severe Bottleneck' | 'Moderate Delay' | 'Free Flow';
  primaryChokePoint: string;
  recommendedReroute: string;
  rerouteActive: boolean;
}

export interface FleetState {
  stops: StopCrowd[];
  corridors: CorridorDelayInfo[];
  selectedStopId: string;
  selectedCorridorId: string;
  activeToast: string | null;

  // Actions
  injectSurgeTripper: (stopId: string) => void;
  broadcastPassengerAdvisory: (stopId: string, customMessage?: string) => void;
  transmitRerouteAdvisory: (corridorId: string) => void;
  adjustFleetFrequency: (corridorId: string, additionalBuses: number) => void;
  setSelectedStopId: (stopId: string) => void;
  setSelectedCorridorId: (corridorId: string) => void;

  showToast: (msg: string) => void;
  clearToast: () => void;
}

export const useFleetStore = create<FleetState>((set, get) => ({
  stops: [
    {
      stopId: 'STP-CHD-01',
      stopName: 'PGI Medical Terminal (Sec 12)',
      corridor: 'Madhya Marg V2',
      waitingCommuters: 68,
      crowdLevel: 'Overcrowded (>50)',
      suggestedDispatch: 'Inject 2 Express Trippers from CTU Depot 1',
      nearestDepot: 'CTU Depot 1 (Industrial Area 3.5 km)',
      standbyTripperId: 'Bus Tripper 401 (CH-01-TB-8821)',
      trippersDispatched: 0,
    },
    {
      stopId: 'STP-CHD-02',
      stopName: 'ISBT Sector 17 Plaza Hub',
      corridor: 'Jan Marg Heritage Corridor',
      waitingCommuters: 54,
      crowdLevel: 'Overcrowded (>50)',
      suggestedDispatch: 'Short-loop Route 1 from Matka Chowk',
      nearestDepot: 'CTU Depot 3 (Sector 25 2.1 km)',
      standbyTripperId: 'Bus Tripper 214 (CH-01-GA-7740)',
      trippersDispatched: 0,
    },
    {
      stopId: 'STP-CHD-03',
      stopName: 'Tribune Chowk South Hub',
      corridor: 'Dakshin Marg V2',
      waitingCommuters: 32,
      crowdLevel: 'Moderate (20-50)',
      suggestedDispatch: 'Maintain 5-min headway schedule',
      nearestDepot: 'CTU Depot 2 (Sector 43 3.8 km)',
      standbyTripperId: 'Bus Tripper 109 (CH-01-TB-3319)',
      trippersDispatched: 0,
    },
    {
      stopId: 'STP-CHD-04',
      stopName: 'IT Park DLF Tower Stop',
      corridor: 'Himalaya Marg / Kishangarh',
      waitingCommuters: 14,
      crowdLevel: 'Normal (<20)',
      suggestedDispatch: 'Normal Schedule Operating',
      nearestDepot: 'CTU Depot 1 (Industrial Area 4.2 km)',
      standbyTripperId: 'Standby on Yard',
      trippersDispatched: 0,
    },
  ],

  corridors: [
    {
      corridorId: 'CORR-01',
      corridorName: 'Ring Road (AIIMS to Dhaula Kuan)',
      routeId: 'Route 419 / 505',
      avgSpeedKmH: 14.2,
      freeFlowSpeedKmH: 45.0,
      delayMinutes: 18,
      activeFleetCount: 16,
      congestionLevel: 'Severe Bottleneck',
      primaryChokePoint: 'Moti Bagh Underpass flyover merge',
      recommendedReroute: 'Bypass via Africa Avenue corridor',
      rerouteActive: false,
    },
    {
      corridorId: 'CORR-02',
      corridorName: 'Vikas Marg (ITO to Anand Vihar ISBT)',
      routeId: 'Route 260 / 280',
      avgSpeedKmH: 16.5,
      freeFlowSpeedKmH: 40.0,
      delayMinutes: 14,
      activeFleetCount: 12,
      congestionLevel: 'Severe Bottleneck',
      primaryChokePoint: 'Laxmi Nagar Metro Pillar 42 bottleneck',
      recommendedReroute: 'Divert fleet through Shakarpur inner lane',
      rerouteActive: false,
    },
    {
      corridorId: 'CORR-03',
      corridorName: 'Mathura Road (Ashram to Badarpur Border)',
      routeId: 'Route 502 / 405',
      avgSpeedKmH: 24.8,
      freeFlowSpeedKmH: 50.0,
      delayMinutes: 6,
      activeFleetCount: 10,
      congestionLevel: 'Moderate Delay',
      primaryChokePoint: 'Apollo Hospital junction traffic light',
      recommendedReroute: 'Extend green signal window by 15s',
      rerouteActive: false,
    },
    {
      corridorId: 'CORR-04',
      corridorName: 'Outer Ring Road (Janakpuri to Pitampura)',
      routeId: 'Route 711 / 970',
      avgSpeedKmH: 36.4,
      freeFlowSpeedKmH: 50.0,
      delayMinutes: 0,
      activeFleetCount: 8,
      congestionLevel: 'Free Flow',
      primaryChokePoint: 'None (Smooth Flow)',
      recommendedReroute: 'Maintain optimal speed 40 km/h',
      rerouteActive: false,
    },
  ],

  selectedStopId: 'STP-CHD-01',
  selectedCorridorId: 'CORR-01',
  activeToast: null,

  showToast: (msg: string) => {
    set({ activeToast: msg });
    setTimeout(() => {
      set({ activeToast: null });
    }, 4000);
  },

  clearToast: () => set({ activeToast: null }),

  injectSurgeTripper: (stopId) => {
    const stop = get().stops.find((s) => s.stopId === stopId);
    if (!stop) return;

    set((state) => ({
      stops: state.stops.map((s) => {
        if (s.stopId !== stopId) return s;
        const newDispatched = s.trippersDispatched + 1;
        const remainingCommuters = Math.max(0, s.waitingCommuters - 30);
        return {
          ...s,
          trippersDispatched: newDispatched,
          waitingCommuters: remainingCommuters,
          crowdLevel: remainingCommuters > 50 ? 'Overcrowded (>50)' : remainingCommuters > 20 ? 'Moderate (20-50)' : 'Normal (<20)',
        };
      }),
    }));
    get().showToast(`Surge Tripper ${stop.standbyTripperId} injected to ${stop.stopName}.`);
  },

  broadcastPassengerAdvisory: (stopId, customMessage) => {
    const stop = get().stops.find((s) => s.stopId === stopId);
    const msg = customMessage || `High commuter density detected. Standby tripper bus dispatched from ${stop?.nearestDepot || 'Depot'}.`;

    set((state) => ({
      stops: state.stops.map((s) => (s.stopId === stopId ? { ...s, activeAdvisory: msg } : s)),
    }));
    get().showToast(`Digital passenger advisory broadcasted to ${stop?.stopName || 'Stop'}.`);
  },

  transmitRerouteAdvisory: (corridorId) => {
    set((state) => ({
      corridors: state.corridors.map((c) => {
        if (c.corridorId !== corridorId) return c;
        const nextState = !c.rerouteActive;
        const newDelay = nextState ? Math.max(2, c.delayMinutes - 8) : c.delayMinutes;
        return {
          ...c,
          rerouteActive: nextState,
          delayMinutes: newDelay,
          congestionLevel: newDelay > 10 ? 'Severe Bottleneck' : 'Moderate Delay',
        };
      }),
    }));
    const corridor = get().corridors.find((c) => c.corridorId === corridorId);
    get().showToast(`Dynamic corridor reroute broadcasted for ${corridor?.corridorName || 'Route'}.`);
  },

  adjustFleetFrequency: (corridorId, additionalBuses) => {
    set((state) => ({
      corridors: state.corridors.map((c) => {
        if (c.corridorId !== corridorId) return c;
        return { ...c, activeFleetCount: c.activeFleetCount + additionalBuses };
      }),
    }));
    get().showToast(`Fleet frequency adjusted (+${additionalBuses} buses assigned).`);
  },

  setSelectedStopId: (id) => set({ selectedStopId: id }),
  setSelectedCorridorId: (id) => set({ selectedCorridorId: id }),
}));
