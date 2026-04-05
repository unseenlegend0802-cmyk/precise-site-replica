import { Hospital } from "@/data/hospitals";
import { Coordinates, getCityCoordinates, haversineDistance } from "./cityCoordinates";

export interface HospitalWithDistance extends Hospital {
  distance?: number; // in km
}

/**
 * Sort hospitals by distance from user location.
 * Hospitals without coordinates fall to the end.
 */
export function sortByDistance(
  hospitals: Hospital[],
  userLocation: Coordinates
): HospitalWithDistance[] {
  return hospitals
    .map((h) => {
      const coords = getCityCoordinates(h.city);
      const distance = coords ? haversineDistance(userLocation, coords) : undefined;
      return { ...h, distance };
    })
    .sort((a, b) => {
      if (a.distance === undefined && b.distance === undefined) return 0;
      if (a.distance === undefined) return 1;
      if (b.distance === undefined) return -1;
      return a.distance - b.distance;
    });
}

/**
 * Format distance for display
 */
export function formatDistance(km: number): string {
  if (km < 1) return "< 1 km";
  if (km > 1000) return `${Math.round(km / 100) * 100} km`;
  return `${km} km`;
}
