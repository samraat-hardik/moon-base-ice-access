/**
 * Ice access scoring for lunar base siting.
 * PSRs hold water ice; proximity = easier ISRU for Starship propellant and life support.
 */

import type { PSRRecord } from "@/data/psr-south-pole";
import { PSR_SOUTH_POLE } from "@/data/psr-south-pole";

const MOON_RADIUS_KM = 1737.4;

/** Haversine-style distance in km between (lat1, lon1) and (lat2, lon2) on a sphere */
export function surfaceDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δλ = toRad(((lon2 - lon1 + 540) % 360) - 180);
  const d =
    Math.acos(
      Math.sin(φ1) * Math.sin(φ2) + Math.cos(φ1) * Math.cos(φ2) * Math.cos(Δλ)
    ) * MOON_RADIUS_KM;
  return d;
}

export interface IceAccessResult {
  /** Distance in km to nearest PSR */
  distanceToNearestPsrKm: number;
  /** Nearest PSR record */
  nearestPsr: PSRRecord | null;
  /** Total PSR area (km²) within radiusKm */
  psrAreaWithinRadiusKm2: number;
  /** Number of PSRs within radiusKm */
  psrCountWithinRadius: number;
  /** Ice access score 0–100 (higher = better for ISRU) */
  iceAccessScore: number;
  /** High-priority ice PSRs within 50 km */
  nearbyIcePriorityPsrs: PSRRecord[];
}

const RADIUS_KM = 30;
const MAX_DISTANCE_FOR_SCORE_KM = 100;
const ICE_PRIORITY_RADIUS_KM = 50;

/**
 * Compute ice access metrics for a candidate base site (lat, lon).
 * @param psrList - If provided, use this list (e.g. live from API); otherwise use static PSR_SOUTH_POLE.
 */
export function computeIceAccess(
  lat: number,
  lon: number,
  radiusKm: number = RADIUS_KM,
  psrList?: PSRRecord[]
): IceAccessResult {
  const list = psrList && psrList.length > 0 ? psrList : PSR_SOUTH_POLE;
  let nearestPsr: PSRRecord | null = null;
  let minDistKm = Infinity;
  let psrAreaWithinRadiusKm2 = 0;
  let psrCountWithinRadius = 0;
  const nearbyIcePriorityPsrs: PSRRecord[] = [];

  for (const psr of list) {
    const d = surfaceDistanceKm(lat, lon, psr.lat, psr.lon);
    if (d < minDistKm) {
      minDistKm = d;
      nearestPsr = psr;
    }
    if (d <= radiusKm) {
      psrAreaWithinRadiusKm2 += psr.areaKm2;
      psrCountWithinRadius += 1;
    }
    if (psr.icePriority && d <= ICE_PRIORITY_RADIUS_KM) {
      nearbyIcePriorityPsrs.push(psr);
    }
  }

  // Score: 0–100. Closer to PSRs + more area nearby = higher.
  const distanceScore = Math.max(
    0,
    100 - (minDistKm / MAX_DISTANCE_FOR_SCORE_KM) * 70
  );
  const areaScore = Math.min(30, (psrAreaWithinRadiusKm2 / 500) * 30);
  const iceAccessScore = Math.round(Math.min(100, distanceScore + areaScore));

  return {
    distanceToNearestPsrKm: nearestPsr ? Math.round(minDistKm * 10) / 10 : 0,
    nearestPsr,
    psrAreaWithinRadiusKm2: Math.round(psrAreaWithinRadiusKm2 * 10) / 10,
    psrCountWithinRadius,
    iceAccessScore,
    nearbyIcePriorityPsrs,
  };
}
