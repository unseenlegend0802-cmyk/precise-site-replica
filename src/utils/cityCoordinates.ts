// Predefined coordinates for Indian cities used in distance calculations
export interface Coordinates {
  lat: number;
  lng: number;
}

export const cityCoordinates: Record<string, Coordinates> = {
  "Hyderabad": { lat: 17.385, lng: 78.4867 },
  "Bangalore": { lat: 12.9716, lng: 77.5946 },
  "Chennai": { lat: 13.0827, lng: 80.2707 },
  "Delhi": { lat: 28.7041, lng: 77.1025 },
  "Mumbai": { lat: 19.076, lng: 72.8777 },
  "Pune": { lat: 18.5204, lng: 73.8567 },
  "Kolkata": { lat: 22.5726, lng: 88.3639 },
  "Ahmedabad": { lat: 23.0225, lng: 72.5714 },
  "Jaipur": { lat: 26.9124, lng: 75.7873 },
  "Surat": { lat: 21.1702, lng: 72.8311 },
  "Vijayawada": { lat: 16.5062, lng: 80.648 },
  "Visakhapatnam": { lat: 17.6868, lng: 83.2185 },
  "Coimbatore": { lat: 11.0168, lng: 76.9558 },
  "Madurai": { lat: 9.9252, lng: 78.1198 },
  "Salem": { lat: 11.6643, lng: 78.146 },
  "Trivandrum": { lat: 8.5241, lng: 76.9366 },
  "Calicut": { lat: 11.2588, lng: 75.7804 },
  "Mangalore": { lat: 12.9141, lng: 74.856 },
  "Goa": { lat: 15.2993, lng: 74.124 },
  "Bhubaneswar": { lat: 20.2961, lng: 85.8245 },
  "Perinthalmanna": { lat: 10.9764, lng: 76.2284 },
  // Fallback for "India" or unknown cities
  "India": { lat: 20.5937, lng: 78.9629 },
};

/**
 * Haversine formula to calculate distance between two coordinates in km
 */
export function haversineDistance(
  point1: Coordinates,
  point2: Coordinates
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((point2.lat - point1.lat) * Math.PI) / 180;
  const dLng = ((point2.lng - point1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((point1.lat * Math.PI) / 180) *
      Math.cos((point2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Get coordinates for a city name, with fuzzy matching
 */
export function getCityCoordinates(city: string): Coordinates | null {
  // Direct match
  if (cityCoordinates[city]) return cityCoordinates[city];

  // Case-insensitive match
  const lower = city.toLowerCase();
  for (const [key, coords] of Object.entries(cityCoordinates)) {
    if (key.toLowerCase() === lower) return coords;
  }

  // Partial match
  for (const [key, coords] of Object.entries(cityCoordinates)) {
    if (lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) {
      return coords;
    }
  }

  return null;
}
