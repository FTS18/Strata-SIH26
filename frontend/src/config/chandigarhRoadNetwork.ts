export interface ChandigarhRoadSegment {
  id: string;
  roadName: string;
  pciScore: number;
  color: string;
  status: 'Smooth' | 'Moderate Wear' | 'Severe Distress';
  coordinates: Array<[number, number]>; // [lng, lat]
}

// Generate smooth multi-node coordinates along straight avenue segments
function interpolatePoints(
  p1: [number, number],
  p2: [number, number],
  steps: number
): Array<[number, number]> {
  const pts: Array<[number, number]> = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const lng = p1[0] + (p2[0] - p1[0]) * t;
    const lat = p1[1] + (p2[1] - p1[1]) * t;
    pts.push([Number(lng.toFixed(6)), Number(lat.toFixed(6))]);
  }
  return pts;
}

// 1. Madhya Marg Segments (PGI -> Sec 11/15 -> Matka -> Press -> Grain Market -> Transport -> Housing Board)
const mm_pgi_press = [
  ...interpolatePoints([76.7725, 30.7630], [76.7865, 30.7558], 25),
  ...interpolatePoints([76.7865, 30.7558], [76.7978, 30.7475], 25),
  ...interpolatePoints([76.7978, 30.7475], [76.8095, 30.7390], 25),
];

const mm_grain_distress = [
  ...interpolatePoints([76.8095, 30.7390], [76.8210, 30.7305], 25),
  ...interpolatePoints([76.8210, 30.7305], [76.8325, 30.7220], 25),
];

const mm_housing_board = interpolatePoints([76.8325, 30.7220], [76.8440, 30.7135], 25);

// 2. Jan Marg Segments (Capitol -> Matka -> Rose Garden -> Aroma -> ISBT 43 -> Vikas Marg)
const jm_capitol_rose = [
  ...interpolatePoints([76.8060, 30.7580], [76.7978, 30.7475], 25),
  ...interpolatePoints([76.7978, 30.7475], [76.7890, 30.7385], 25),
];

const jm_aroma_isbt = [
  ...interpolatePoints([76.7890, 30.7385], [76.7795, 30.7295], 25),
  ...interpolatePoints([76.7795, 30.7295], [76.7695, 30.7205], 25),
  ...interpolatePoints([76.7695, 30.7205], [76.7600, 30.7115], 25),
];

// 3. Dakshin Marg Segments (Sec 38 -> Sec 37 -> ISBT 43 -> Kisan Bhawan -> GMCH 32 -> Tribune -> Industrial)
const dm_sec38_kisan = [
  ...interpolatePoints([76.7460, 30.7430], [76.7578, 30.7345], 25),
  ...interpolatePoints([76.7578, 30.7345], [76.7695, 30.7260], 25),
  ...interpolatePoints([76.7695, 30.7260], [76.7810, 30.7175], 25),
];

const dm_tribune_distress = [
  ...interpolatePoints([76.7810, 30.7175], [76.7925, 30.7090], 25),
  ...interpolatePoints([76.7925, 30.7090], [76.8040, 30.7005], 25),
  ...interpolatePoints([76.8040, 30.7005], [76.8155, 30.6920], 25),
];

// 4. Himalaya Marg Segments (Sukhna -> Press -> Sec 17 -> Sec 22 -> Kisan Bhawan -> Sec 44)
const hm_sukhna_sec44 = [
  ...interpolatePoints([76.8210, 30.7505], [76.8095, 30.7390], 25),
  ...interpolatePoints([76.8095, 30.7390], [76.7995, 30.7300], 25),
  ...interpolatePoints([76.7995, 30.7300], [76.7895, 30.7208], 25),
  ...interpolatePoints([76.7895, 30.7208], [76.7810, 30.7175], 20),
  ...interpolatePoints([76.7810, 30.7175], [76.7715, 30.7085], 25),
  ...interpolatePoints([76.7715, 30.7085], [76.7620, 30.6995], 25),
];

// 5. Purv Marg (Tribune -> Elante -> Transport -> Housing Board)
const pm_tribune_housing = [
  ...interpolatePoints([76.8040, 30.7005], [76.8180, 30.7110], 30),
  ...interpolatePoints([76.8180, 30.7110], [76.8325, 30.7220], 30),
  ...interpolatePoints([76.8325, 30.7220], [76.8440, 30.7135], 25),
];

export const CHANDIGARH_ROAD_NETWORK: ChandigarhRoadSegment[] = [
  // Madhya Marg (Smooth PGI - Press Chowk)
  {
    id: 'seg_mm_smooth',
    roadName: 'Madhya Marg V2 (PGI ↔ Press Chowk)',
    pciScore: 88,
    color: '#10B981',
    status: 'Smooth',
    coordinates: mm_pgi_press,
  },
  // Madhya Marg (Distress Grain Market Zone)
  {
    id: 'seg_mm_distress',
    roadName: 'Madhya Marg (Sec 26 Grain Market Choke)',
    pciScore: 42,
    color: '#EF4444',
    status: 'Severe Distress',
    coordinates: mm_grain_distress,
  },
  // Madhya Marg (Housing Board Gateway)
  {
    id: 'seg_mm_housing',
    roadName: 'Madhya Marg (Transport Chowk ↔ Housing Board)',
    pciScore: 72,
    color: '#F59E0B',
    status: 'Moderate Wear',
    coordinates: mm_housing_board,
  },

  // Jan Marg (VIP Heritage)
  {
    id: 'seg_jm_vip',
    roadName: 'Jan Marg Heritage Corridor (Capitol ↔ Rose Garden)',
    pciScore: 96,
    color: '#10B981',
    status: 'Smooth',
    coordinates: jm_capitol_rose,
  },
  // Jan Marg (Transit South)
  {
    id: 'seg_jm_south',
    roadName: 'Jan Marg (Aroma Sec 22 ↔ ISBT Sector 43 Hub)',
    pciScore: 68,
    color: '#F59E0B',
    status: 'Moderate Wear',
    coordinates: jm_aroma_isbt,
  },

  // Dakshin Marg (West & Central)
  {
    id: 'seg_dm_smooth',
    roadName: 'Dakshin Marg (Sec 38 ↔ Kisan Bhawan)',
    pciScore: 84,
    color: '#10B981',
    status: 'Smooth',
    coordinates: dm_sec38_kisan,
  },
  // Dakshin Marg (Tribune Flyover Distress)
  {
    id: 'seg_dm_distress',
    roadName: 'Dakshin Marg (Tribune Chowk Flyover Approach)',
    pciScore: 36,
    color: '#EF4444',
    status: 'Severe Distress',
    coordinates: dm_tribune_distress,
  },

  // Himalaya Marg
  {
    id: 'seg_hm_smooth',
    roadName: 'Himalaya Marg (Sukhna Lake ↔ Sec 44)',
    pciScore: 82,
    color: '#10B981',
    status: 'Smooth',
    coordinates: hm_sukhna_sec44,
  },

  // Purv Marg
  {
    id: 'seg_pm_smooth',
    roadName: 'Purv Marg (Tribune Chowk ↔ Housing Board)',
    pciScore: 85,
    color: '#10B981',
    status: 'Smooth',
    coordinates: pm_tribune_housing,
  },
];
