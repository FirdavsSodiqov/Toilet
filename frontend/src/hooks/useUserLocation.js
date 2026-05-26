import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Fallback coordinates: Tashkent, Uzbekistan center
 */
const FALLBACK_LOCATION = { lat: 41.3111, lng: 69.2797 };

const GEO_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 60000, // Cache for 1 minute
};

/**
 * Custom hook for managing browser Geolocation API state.
 *
 * @returns {{
 *   location: { lat: number, lng: number } | null,
 *   error: string | null,
 *   loading: boolean,
 *   permissionStatus: 'prompt' | 'granted' | 'denied' | 'unsupported' | 'timeout',
 *   requestLocation: () => void,
 *   fallbackLocation: { lat: number, lng: number }
 * }}
 */
export default function useUserLocation() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState("prompt");
  const watchIdRef = useRef(null);

  // Check if geolocation is supported
  const isSupported = typeof navigator !== "undefined" && "geolocation" in navigator;

  // Listen for permission changes
  useEffect(() => {
    if (!isSupported) {
      setPermissionStatus("unsupported");
      setError("Geolocation is not supported by your browser.");
      return;
    }

    let permissionQuery;

    async function checkPermission() {
      try {
        if (navigator.permissions) {
          permissionQuery = await navigator.permissions.query({ name: "geolocation" });
          setPermissionStatus(permissionQuery.state);

          permissionQuery.addEventListener("change", () => {
            setPermissionStatus(permissionQuery.state);
            if (permissionQuery.state === "granted") {
              requestLocation();
            }
            if (permissionQuery.state === "denied") {
              setError("Joylashuvga ruxsat berilmadi. Sozlamalardan ruxsat bering.");
              setLocation(null);
            }
          });

          // Auto-request if already granted
          if (permissionQuery.state === "granted") {
            requestLocation();
          }
        }
      } catch {
        // Permissions API not available, try directly
        requestLocation();
      }
    }

    checkPermission();

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const requestLocation = useCallback(() => {
    if (!isSupported) {
      setPermissionStatus("unsupported");
      setError("Geolocation is not supported.");
      return;
    }

    setLoading(true);
    setError(null);

    // Clear previous watch
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }

    // Get current position first
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        setPermissionStatus("granted");
        setLoading(false);
        setError(null);
      },
      (err) => {
        setLoading(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setPermissionStatus("denied");
            setError("Joylashuvga ruxsat berilmadi. Brauzer sozlamalaridan ruxsat bering.");
            break;
          case err.POSITION_UNAVAILABLE:
            setError("Joylashuv ma'lumotlari mavjud emas.");
            break;
          case err.TIMEOUT:
            setPermissionStatus("timeout");
            setError("Joylashuvni aniqlash vaqti tugadi. Qayta urinib ko'ring.");
            break;
          default:
            setError("Noma'lum xatolik yuz berdi.");
        }
      },
      GEO_OPTIONS
    );

    // Then start watching for updates
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        setPermissionStatus("granted");
      },
      () => {
        // Silently fail on watch errors — we already have initial position
      },
      { ...GEO_OPTIONS, maximumAge: 30000 }
    );
  }, [isSupported]);

  return {
    location,
    error,
    loading,
    permissionStatus,
    requestLocation,
    fallbackLocation: FALLBACK_LOCATION,
  };
}
