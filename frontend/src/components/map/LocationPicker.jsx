import { useEffect, useRef, useState, useCallback } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

/**
 * Reusable LocationPicker component for add/edit forms.
 * Allows user to click on the map to pick/adjust coordinates.
 *
 * @param {{
 *   value: { lat: number, lng: number } | null,
 *   onChange: (coords: { lat: number, lng: number }) => void,
 *   className: string,
 *   placeholder: string
 * }} props
 */
export default function LocationPicker({
  value = null,
  onChange,
  className = "",
  placeholder = "Xaritadan joyni tanlang",
}) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [coords, setCoords] = useState(value);
  const [isExpanded, setIsExpanded] = useState(false);

  const TILE_URL = "https://tiles.openfreemap.org/styles/liberty";

  const defaultCenter = value
    ? [value.lng, value.lat]
    : [69.2797, 41.3111]; // Tashkent default

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current || !isExpanded) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: TILE_URL,
      center: defaultCenter,
      zoom: value ? 16 : 13,
      attributionControl: false,
    });

    map.addControl(new maplibregl.NavigationControl(), "top-right");

    // Click to place marker
    map.on("click", (e) => {
      const { lng, lat } = e.lngLat;
      const newCoords = { lat: parseFloat(lat.toFixed(6)), lng: parseFloat(lng.toFixed(6)) };
      setCoords(newCoords);
      onChange?.(newCoords);
      updateMarker(map, newCoords);
    });

    map.on("load", () => {
      if (value) {
        updateMarker(map, value);
      }
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [isExpanded]); // eslint-disable-line react-hooks/exhaustive-deps

  // Update marker position
  const updateMarker = useCallback((map, position) => {
    if (markerRef.current) {
      markerRef.current.setLngLat([position.lng, position.lat]);
    } else {
      const el = document.createElement("div");
      el.innerHTML = `
        <div style="
          width: 32px;
          height: 32px;
          background: var(--color-primary, #6366f1);
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 12px rgba(0,0,0,0.3);
          cursor: grab;
        "></div>
      `;

      markerRef.current = new maplibregl.Marker({
        element: el,
        draggable: true,
      })
        .setLngLat([position.lng, position.lat])
        .addTo(map);

      markerRef.current.on("dragend", () => {
        const { lng, lat } = markerRef.current.getLngLat();
        const newCoords = {
          lat: parseFloat(lat.toFixed(6)),
          lng: parseFloat(lng.toFixed(6)),
        };
        setCoords(newCoords);
        onChange?.(newCoords);
      });
    }
  }, [onChange]);

  // Sync external value changes
  useEffect(() => {
    if (value && mapRef.current) {
      setCoords(value);
      updateMarker(mapRef.current, value);
      mapRef.current.flyTo({
        center: [value.lng, value.lat],
        zoom: 16,
      });
    }
  }, [value, updateMarker]);

  return (
    <div className={`location-picker ${className}`}>
      {/* Coordinate display */}
      <div
        className="picker-header"
        onClick={() => setIsExpanded(!isExpanded)}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        aria-label="Toggle location picker"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsExpanded(!isExpanded);
          }
        }}
      >
        <div className="picker-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </div>
        <div className="picker-text">
          {coords ? (
            <span className="picker-coords">
              {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
            </span>
          ) : (
            <span className="picker-placeholder">{placeholder}</span>
          )}
        </div>
        <div className={`picker-chevron ${isExpanded ? "expanded" : ""}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {/* Map container */}
      {isExpanded && (
        <div className="picker-map-wrapper">
          <div
            ref={mapContainerRef}
            className="picker-map"
            style={{ width: "100%", height: "250px" }}
          />
          <p className="picker-hint">
            Xaritani bosib joy tanlang yoki markerni suring
          </p>
        </div>
      )}
    </div>
  );
}
