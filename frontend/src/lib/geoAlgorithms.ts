import { type GeoCoordinate, type SeverityLevel, type DefectType } from '@/types';

/**
 * Fast Haversine formula to compute great-circle distance between two coordinates in meters.
 */
export function calculateHaversineDistanceMeters(
  coord1: GeoCoordinate,
  coord2: GeoCoordinate
): number {
  const EARTH_RADIUS_METERS = 6371000;
  const lat1Rad = (coord1.lat * Math.PI) / 180;
  const lat2Rad = (coord2.lat * Math.PI) / 180;
  const deltaLatRad = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const deltaLngRad = ((coord2.lng - coord1.lng) * Math.PI) / 180;

  const a =
    Math.sin(deltaLatRad / 2) * Math.sin(deltaLatRad / 2) +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(deltaLngRad / 2) * Math.sin(deltaLngRad / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_METERS * c;
}

/**
 * Spatial Grid Hash Key for O(1) spatial bucket clustering.
 * Quantizes lat/lng to grid cells of approx 15m x 15m.
 */
export function getSpatialGridKey(coord: GeoCoordinate, cellSizeDegrees = 0.00015): string {
  const gridX = Math.floor(coord.lat / cellSizeDegrees);
  const gridY = Math.floor(coord.lng / cellSizeDegrees);
  return `${gridX}:${gridY}`;
}

/**
 * Pavement Condition Index (PCI) Deduct Value Calculator (ASTM D6433 inspired).
 * Scales from 0 (impassable) to 100 (flawless newly paved).
 */
export function calculatePavementConditionIndex(
  defectsCount: number,
  criticalDefectsCount: number,
  trafficVolumePerHour: number,
  avgVibrationZ: number
): number {
  const baseScore = 100;
  const defectDeduct = Math.min(45, defectsCount * 3.5);
  const criticalDeduct = Math.min(35, criticalDefectsCount * 9.0);
  const vibrationDeduct = avgVibrationZ > 2.0 ? Math.min(20, (avgVibrationZ - 1.0) * 12.0) : 0;
  const trafficLoadFactor = Math.min(1.2, 0.8 + trafficVolumePerHour / 5000);

  const totalDeduct = (defectDeduct + criticalDeduct + vibrationDeduct) * trafficLoadFactor;
  return Math.max(10, Math.round(baseScore - totalDeduct));
}

/**
 * Calculates required asphalt tonnage and estimated repair cost in INR.
 * Assumes compacted asphalt density = 2.4 tons / m³.
 */
export function calculateAsphaltRequirement(
  areaSqM: number,
  depthMeters = 0.06,
  ratePerTonInr = 4200
): { asphaltTons: number; estimatedCostInr: number } {
  const ASPHALT_DENSITY = 2.4; // metric tons per cubic meter
  const volumeCubicMeters = areaSqM * depthMeters;
  const asphaltTons = Number((volumeCubicMeters * ASPHALT_DENSITY).toFixed(2));
  const estimatedCostInr = Math.round(asphaltTons * ratePerTonInr + 1500); // 1500 base labor overhead
  return { asphaltTons, estimatedCostInr };
}

/**
 * Levenshtein distance for fuzzy Indian number plate matching against watchlists.
 */
export function calculateLevenshteinDistance(a: string, b: string): number {
  const cleanA = a.replace(/[\s-]/g, '').toUpperCase();
  const cleanB = b.replace(/[\s-]/g, '').toUpperCase();
  const matrix: number[][] = [];

  for (let i = 0; i <= cleanB.length; i++) matrix[i] = [i];
  for (let j = 0; j <= cleanA.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= cleanB.length; i++) {
    for (let j = 1; j <= cleanA.length; j++) {
      if (cleanB.charAt(i - 1) === cleanA.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[cleanB.length][cleanA.length];
}
