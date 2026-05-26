import { useEffect, useRef, useState, useCallback } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

/**
 * Status → marker color mapping
 */
const STATUS_COLORS = {
  open: "#22c55e",     // Green: Open & Recommended
  limited: "#eab308",  // Yellow: Limited or Paid
  closed: "#ef4444",   // Red: Closed / Maintenance
};

const STATUS_GLOW = {
  open: "rgba(34, 197, 94, 0.3)",
  limited: "rgba(234, 179, 8, 0.3)",
  closed: "rgba(239, 68, 68, 0.3)",
};

/**
 * Creates a custom HTML marker element for a toilet location.
 */
function createMarkerElement(toilet) {
  const color = STATUS_COLORS[toilet.status] || STATUS_COLORS.open;
  const glow = STATUS_GLOW[toilet.status] || STATUS_GLOW.open;

  const el = document.createElement("div");
  el.className = "toilet-marker";
  el.setAttribute("data-toilet-id", toilet.id);
  el.setAttribute("data-status", toilet.status);
  el.innerHTML = `
    <div class="marker-container" style="
      position: relative;
      cursor: pointer;
      transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
    ">
      <div class="marker-pulse" style="
        position: absolute;
        width: 40px;
        height: 40px;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        border-radius: 50%;
        background: ${glow};
        animation: markerPulse 2s ease-out infinite;
      "></div>
      <div class="marker-pin" style="
        position: relative;
        width: 36px;
        height: 44px;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        filter: drop-shadow(0 3px 6px rgba(0,0,0,0.25));
      ">
        <svg viewBox="0 0 36 44" width="36" height="44" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 0C8.06 0 0 8.06 0 18c0 12.6 16.2 24.84 16.88 25.36a1.8 1.8 0 002.24 0C19.8 42.84 36 30.6 36 18 36 8.06 27.94 0 18 0z" fill="${color}"/>
          <circle cx="18" cy="17" r="10" fill="white" fill-opacity="0.95"/>
          <text x="18" y="21" text-anchor="middle" font-size="13" font-weight="700" fill="${color}">🚻</text>
        </svg>
      </div>
      <div class="marker-label" style="
        position: absolute;
        top: -8px;
        left: 50%;
        transform: translateX(-50%);
        white-space: nowrap;
        font-size: 10px;
        font-weight: 700;
        color: #fff;
        background: ${color};
        padding: 2px 8px;
        border-radius: 8px;
        opacity: 0;
        transition: opacity 0.2s, transform 0.2s;
        pointer-events: none;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      ">${toilet.name}</div>
    </div>
  `;

  // Hover effects
  el.addEventListener("mouseenter", () => {
    el.querySelector(".marker-container").style.transform = "scale(1.2)";
    el.querySelector(".marker-label").style.opacity = "1";
    el.querySelector(".marker-label").style.transform = "translateX(-50%) translateY(-4px)";
  });
  el.addEventListener("mouseleave", () => {
    el.querySelector(".marker-container").style.transform = "scale(1)";
    el.querySelector(".marker-label").style.opacity = "0";
    el.querySelector(".marker-label").style.transform = "translateX(-50%)";
  });

  return el;
}

/**
 * MapContainer component using MapLibre GL (free, no token needed).
 *
 * @param {{
 *   toilets: Array<Object>,
 *   userLocation: { lat: number, lng: number } | null,
 *   onMarkerClick: (toilet: Object) => void,
 *   selectedToilet: Object | null,
 *   className: string
 * }} props
 */
export default function MapContainer({
  toilets = [],
  userLocation = null,
  onMarkerClick,
  selectedToilet = null,
  className = "",
}) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const userMarkerRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Free tile sources
  const TILE_URL = "https://tiles.openfreemap.org/styles/liberty";

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const center = userLocation
      ? [userLocation.lng, userLocation.lat]
      : [69.2797, 41.3111]; // Tashkent fallback

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: TILE_URL,
      center,
      zoom: 14,
      pitch: 0,
      attributionControl: false,
    });

    // Add controls
    map.addControl(
      new maplibregl.NavigationControl({ showCompass: true }),
      "bottom-right"
    );

    map.addControl(
      new maplibregl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
      }),
      "bottom-right"
    );

    map.addControl(
      new maplibregl.AttributionControl({ compact: true }),
      "bottom-left"
    );

    map.on("load", () => {
      setMapLoaded(true);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Update user location marker
  useEffect(() => {
    if (!mapRef.current || !mapLoaded || !userLocation) return;

    // Remove old user marker
    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
    }

    // Create pulsing user dot
    const userEl = document.createElement("div");
    userEl.innerHTML = `
      <div style="position: relative; width: 24px; height: 24px;">
        <div style="
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: rgba(59, 130, 246, 0.3);
          animation: userPulse 2s ease-out infinite;
        "></div>
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #3b82f6;
          border: 3px solid #fff;
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
        "></div>
      </div>
    `;

    userMarkerRef.current = new maplibregl.Marker({ element: userEl })
      .setLngLat([userLocation.lng, userLocation.lat])
      .addTo(mapRef.current);

    // Fly to user location
    mapRef.current.flyTo({
      center: [userLocation.lng, userLocation.lat],
      zoom: 15,
      duration: 1500,
    });
  }, [userLocation, mapLoaded]);

  // Update toilet markers
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;

    // Remove old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    toilets.forEach((toilet) => {
      const el = createMarkerElement(toilet);

      el.addEventListener("click", (e) => {
        e.stopPropagation();
        onMarkerClick?.(toilet);
        mapRef.current.flyTo({
          center: [toilet.lng, toilet.lat],
          zoom: 16,
          duration: 800,
        });
      });

      const marker = new maplibregl.Marker({ element: el, anchor: "bottom" })
        .setLngLat([toilet.lng, toilet.lat])
        .addTo(mapRef.current);

      markersRef.current.push(marker);
    });
  }, [toilets, mapLoaded, onMarkerClick]);

  // Fly to selected toilet
  useEffect(() => {
    if (!mapRef.current || !selectedToilet || !mapLoaded) return;

    mapRef.current.flyTo({
      center: [selectedToilet.lng, selectedToilet.lat],
      zoom: 16,
      duration: 800,
    });
  }, [selectedToilet, mapLoaded]);

  // Fit bounds to show all toilets
  const fitToAllMarkers = useCallback(() => {
    if (!mapRef.current || !mapLoaded || toilets.length === 0) return;

    const bounds = new maplibregl.LngLatBounds();
    toilets.forEach((t) => bounds.extend([t.lng, t.lat]));
    if (userLocation) bounds.extend([userLocation.lng, userLocation.lat]);

    mapRef.current.fitBounds(bounds, { padding: 60, maxZoom: 16, duration: 1000 });
  }, [toilets, userLocation, mapLoaded]);

  // Fit bounds on initial load
  useEffect(() => {
    if (mapLoaded && toilets.length > 0) {
      const timer = setTimeout(fitToAllMarkers, 500);
      return () => clearTimeout(timer);
    }
  }, [mapLoaded]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`map-container-wrapper ${className}`}>
      <div
        ref={mapContainerRef}
        className="map-canvas"
        style={{ width: "100%", height: "100%", minHeight: "400px" }}
      />

      {/* Map legend */}
      <div className="map-legend">
        <div className="legend-item">
          <span className="legend-dot" style={{ background: STATUS_COLORS.open }} />
          <span>Ochiq</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ background: STATUS_COLORS.limited }} />
          <span>Cheklangan</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ background: STATUS_COLORS.closed }} />
          <span>Yopiq</span>
        </div>
      </div>

      {/* Fit all button */}
      <button
        className="map-fit-btn"
        onClick={fitToAllMarkers}
        title="Hammasini ko'rish"
        aria-label="Fit all markers"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
        </svg>
      </button>
    </div>
  );
}
