import { useState, useEffect, useCallback } from "react";
import { Coordinates } from "@/utils/cityCoordinates";

interface LocationState {
  coordinates: Coordinates | null;
  loading: boolean;
  error: string | null;
  retry: () => void;
}

export function useUserLocation(): LocationState {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const requestLocation = useCallback(() => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  }, []);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  return { coordinates, loading, error, retry: requestLocation };
}
