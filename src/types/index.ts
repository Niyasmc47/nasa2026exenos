export interface LunarCoordinates {
  latitude: number; // -90 to +90
  longitude: number; // -180 to +180
  name?: string;
  elevationMeters?: number;
  region?: string;
}

export interface TerrainDetails {
  elevationM: number;
  slopeDegrees: number;
  roughnessM: number;
  sourceDataset: string;
  nominalResolutionM: number;
  qualityFlag: 'OPTIMAL' | 'DEGRADED' | 'INTERPOLATED' | 'RESEARCH';
  uncertaintyM: number;
}

export interface CelestialVisibility {
  sunAzimuthDeg: number;
  sunElevationDeg: number;
  sunVisible: boolean;
  earthAzimuthDeg: number;
  earthElevationDeg: number;
  earthVisible: boolean;
  horizonObstructionDeg: number;
}

export interface MissionConfig {
  id: string;
  title: string;
  location: LunarCoordinates;
  landingDate: string;
  landingTime: string;
  durationDays: number;
  observerHeightM: number;
  roverMobilityRadiusKm?: number;
}

export interface TimelineInterval {
  hourOffset: number;
  timestamp: string;
  sunElevation: number;
  earthElevation: number;
  horizonHeight: number;
  state: 'SUN_AND_EARTH' | 'SUN_ONLY' | 'EARTH_ONLY' | 'NEITHER';
  powerGenerationWatts: number;
  commsBandwidthKbps: number;
}

export interface MissionMetrics {
  sunlightAvailabilityPct: number;
  earthVisibilityPct: number;
  longestDarknessHours: number;
  longestCommBlackoutHours: number;
  maxContinuousSunHours: number;
  maxContinuousEarthHours: number;
  terrainResolutionM: number;
  confidenceScore: number;
}

export interface ScenarioComparisonItem {
  id: string;
  name: string;
  coords: LunarCoordinates;
  date: string;
  durationDays: number;
  observerHeightM: number;
  metrics: MissionMetrics;
  highlights: string[];
}
