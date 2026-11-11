import { LunarCoordinates, TerrainDetails, ScenarioComparisonItem, TimelineInterval } from '../types';

export const PRESET_LANDING_SITES: LunarCoordinates[] = [
  {
    name: 'Shackleton Crater Rim',
    latitude: -89.78,
    longitude: 129.78,
    elevationMeters: 1240,
    region: 'South Pole - Artemis Candidate'
  },
  {
    name: 'Malapert Mountain (Peak B)',
    latitude: -85.99,
    longitude: 2.93,
    elevationMeters: 5020,
    region: 'South Pole Highlands'
  },
  {
    name: 'Connecting Ridge',
    latitude: -89.44,
    longitude: -137.31,
    elevationMeters: -140,
    region: 'South Pole Ridge'
  },
  {
    name: 'de Gerlache Rim 1',
    latitude: -88.71,
    longitude: -68.70,
    elevationMeters: 780,
    region: 'South Pole PSR Vicinity'
  },
  {
    name: 'Haworth Crater Edge',
    latitude: -87.87,
    longitude: -5.12,
    elevationMeters: -1820,
    region: 'Permanently Shadowed Region'
  },
  {
    name: 'Aristarchus Plateau',
    latitude: 23.73,
    longitude: -47.49,
    elevationMeters: -1100,
    region: 'Nearside Volcanic Region'
  },
  {
    name: 'Mare Tranquillitatis (Apollo 11 Base)',
    latitude: 0.674,
    longitude: 23.472,
    elevationMeters: -2500,
    region: 'Equatorial Mare'
  }
];

export function getSimulatedTerrain(lat: number, lon: number): TerrainDetails {
  // Deterministic pseudo-random generation based on coordinates for realistic repeatability
  const seed = Math.sin(lat * 12.9898 + lon * 78.233) * 43758.5453;
  const pseudo = Math.abs(seed - Math.floor(seed));

  const isSouthPole = lat <= -80;
  const baseElev = isSouthPole ? 800 + Math.sin(lat * 5) * 3200 : -1500 + Math.cos(lon * 3) * 2000;
  const slope = 3.2 + pseudo * 16.5;
  const roughness = 0.4 + pseudo * 2.8;

  return {
    elevationM: Math.round(baseElev + (pseudo - 0.5) * 600),
    slopeDegrees: Math.round(slope * 10) / 10,
    roughnessM: Math.round(roughness * 100) / 100,
    sourceDataset: isSouthPole ? 'LOLA Goddard South Pole Polar DEM (5m/px)' : 'LOLA Global Elevation Model (30m/px)',
    nominalResolutionM: isSouthPole ? 5 : 30,
    qualityFlag: isSouthPole ? 'OPTIMAL' : 'INTERPOLATED',
    uncertaintyM: Math.round((0.8 + pseudo * 2.4) * 10) / 10
  };
}

export function generateTimelineData(days: number = 7, lat: number = -89.78): TimelineInterval[] {
  const totalHours = Math.min(days * 24, 336); // max 14 days for UI smoothness
  const intervals: TimelineInterval[] = [];
  const baseDate = new Date('2026-10-15T00:00:00Z');

  // South pole has low sun grazing elevation (-1.5° to +2.5°) with long shadows
  const isPolar = Math.abs(lat) >= 75;

  for (let h = 0; h < totalHours; h += 2) {
    const time = new Date(baseDate.getTime() + h * 3600 * 1000);
    
    // Solar cycle on Moon ~708 hours (29.5 Earth days)
    const solarPhase = (h / 708) * 2 * Math.PI;
    const sunElev = isPolar 
      ? 1.8 * Math.sin(solarPhase + 0.8) + (lat < 0 ? 0.3 : -0.3)
      : 45 * Math.sin(solarPhase);
    
    // Earth apparent motion (libration cycle ~27.3 days)
    const earthPhase = (h / 655) * 2 * Math.PI;
    const earthElev = isPolar ? 4.5 + 2.2 * Math.cos(earthPhase) : 55 + 5 * Math.sin(earthPhase);

    // Horizon masking profile (simulated ridge obstruction)
    const ridgeProfile = 1.1 + 0.6 * Math.sin((h % 48) / 48 * 2 * Math.PI);

    const sunVis = sunElev > ridgeProfile;
    const earthVis = earthElev > 0.8;

    let state: 'SUN_AND_EARTH' | 'SUN_ONLY' | 'EARTH_ONLY' | 'NEITHER' = 'NEITHER';
    if (sunVis && earthVis) state = 'SUN_AND_EARTH';
    else if (sunVis) state = 'SUN_ONLY';
    else if (earthVis) state = 'EARTH_ONLY';

    intervals.push({
      hourOffset: h,
      timestamp: time.toISOString().replace('.000Z', '').replace('T', ' '),
      sunElevation: Math.round(sunElev * 100) / 100,
      earthElevation: Math.round(earthElev * 100) / 100,
      horizonHeight: Math.round(ridgeProfile * 100) / 100,
      state,
      powerGenerationWatts: sunVis ? Math.round(480 + sunElev * 40) : 0,
      commsBandwidthKbps: earthVis ? 2048 : 0
    });
  }

  return intervals;
}

export const INITIAL_SCENARIOS: ScenarioComparisonItem[] = [
  {
    id: 'sc-1',
    name: 'Scenario A: Shackleton Rim Alpha',
    coords: {
      name: 'Shackleton Rim Alpha',
      latitude: -89.78,
      longitude: 129.78,
      elevationMeters: 1240,
      region: 'South Pole'
    },
    date: '2026-10-15',
    durationDays: 7,
    observerHeightM: 2.5,
    metrics: {
      sunlightAvailabilityPct: 86.4,
      earthVisibilityPct: 91.2,
      longestDarknessHours: 8.5,
      longestCommBlackoutHours: 4.0,
      maxContinuousSunHours: 64.0,
      maxContinuousEarthHours: 96.0,
      terrainResolutionM: 5.0,
      confidenceScore: 94
    },
    highlights: [
      'Near-constant solar power on elevated ridge',
      'Continuous direct line of sight to Earth for DSN telemetry',
      'Mild 7.2° slope safe for lander leg deployment'
    ]
  },
  {
    id: 'sc-2',
    name: 'Scenario B: Malapert Peak Mountain',
    coords: {
      name: 'Malapert Mountain',
      latitude: -85.99,
      longitude: 2.93,
      elevationMeters: 5020,
      region: 'South Pole Massif'
    },
    date: '2026-10-15',
    durationDays: 7,
    observerHeightM: 4.0,
    metrics: {
      sunlightAvailabilityPct: 78.1,
      earthVisibilityPct: 98.6,
      longestDarknessHours: 19.0,
      longestCommBlackoutHours: 1.5,
      maxContinuousSunHours: 42.0,
      maxContinuousEarthHours: 140.0,
      terrainResolutionM: 5.0,
      confidenceScore: 91
    },
    highlights: [
      'Exceptional high Earth elevation (~8° above peak horizon)',
      'Substantially reduced communications blackout risk',
      'Moderate shadowing from northern ridge at lunar midnight'
    ]
  },
  {
    id: 'sc-3',
    name: 'Scenario C: Haworth PSR Basin Flank',
    coords: {
      name: 'Haworth Flank',
      latitude: -87.87,
      longitude: -5.12,
      elevationMeters: -1820,
      region: 'Permanently Shadowed Region'
    },
    date: '2026-10-15',
    durationDays: 7,
    observerHeightM: 2.0,
    metrics: {
      sunlightAvailabilityPct: 41.5,
      earthVisibilityPct: 62.0,
      longestDarknessHours: 58.0,
      longestCommBlackoutHours: 32.0,
      maxContinuousSunHours: 24.0,
      maxContinuousEarthHours: 48.0,
      terrainResolutionM: 10.0,
      confidenceScore: 78
    },
    highlights: [
      'Immediate access to volatile-rich cold traps & water ice',
      'High power storage capacity required during terrain occlusion',
      'Periodic relay satellite needed for continuous Earth comms'
    ]
  }
];

export const PLANNED_DATA_SOURCES = [
  {
    name: 'NASA LOLA (Lunar Orbiter Laser Altimeter)',
    instrument: 'LRO LOLA GDR / PDS Geosciences Node',
    purpose: 'Global topographic grid and elevation profiling',
    plannedUse: 'Calculates high-precision digital elevation models (DEM) to determine horizon masking profiles around arbitrary lunar coordinates.',
    resolution: 'Up to 5m/px (polar), 30m/px (global)',
    status: 'Planned Integration'
  },
  {
    name: 'NASA Goddard South Pole High-Res Products',
    instrument: 'LOLA / LROC Co-registered Polar Tiles',
    purpose: 'Polar terrain slope, roughness, and micro-crater navigation',
    plannedUse: 'Evaluates candidate landing stability, hazard identification, and meter-scale line-of-sight clearing for Artemis exploration zones.',
    resolution: '5m - 10m grid with co-registered optical orthoimages',
    status: 'Research / Architecture'
  },
  {
    name: 'NASA NAIF SPICE System',
    instrument: 'JPL / NAIF Ephemerides Kernels (SPK, PCK, FK)',
    purpose: 'Solar and Earth ephemeris geometry & topocentric frames',
    plannedUse: 'Computes exact azimuth and elevation of the Sun and Earth from observer coordinates on the Moon over selected mission timelines.',
    resolution: 'Millisecond time step, sub-arcsecond celestial pointing',
    status: 'Planned Integration'
  },
  {
    name: 'JPL Horizons Ephemeris System',
    instrument: 'JPL Solar System Dynamics Group',
    purpose: 'Independent verification ephemeris and lunar libration curves',
    plannedUse: 'Validates lunar physical librations, topocentric sub-Earth points, and sub-solar latitudes during candidate mission windows.',
    resolution: 'High-precision solar system ephemerides (DE440/441)',
    status: 'Research Stage'
  },
  {
    name: 'Ray-Tracing Horizon Silhouette Engine',
    instrument: 'LUNAVISTA Analytical Engine',
    purpose: '360° terrain azimuth skyline clipping against celestial vectors',
    plannedUse: 'Traces 360 azimuthal rays across the DEM to determine if local mountains, crater rims, or boulders occult the solar disc or Earth RF line-of-sight.',
    resolution: '0.1° azimuth binning up to 100km horizon distance',
    status: 'Architecture Formulated'
  },
  {
    name: 'DEM Monte Carlo Uncertainty Estimator',
    instrument: 'Stochastic Terrain Error Propagation',
    purpose: 'Ensemble confidence analysis for safe landing bounds',
    plannedUse: 'Propagates orbital measurement noise and interpolation uncertainty to produce P10, P50, and P90 percentile confidence envelopes for solar/RF windows.',
    resolution: 'Multi-run stochastic ensemble',
    status: 'Methodology Formulated'
  }
];
