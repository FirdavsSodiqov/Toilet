import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { request } from "../lib/api";
import useUserLocation from "../hooks/useUserLocation";
import MapContainer from "../components/map/MapContainer";
import ResultCard from "../components/home/ResultCard";
import FilterShell from "../components/home/FilterShell";
import MOCK_TOILETS from "../data/mockToilets";

/* ── Animated counter ── */
function AnimCount({ to, duration = 1200 }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!to) return;
    let start = 0;
    const step = Math.ceil(to / (duration / 16));
    const t = setInterval(() => {
      start += step;
      if (start >= to) { setVal(to); clearInterval(t); }
      else setVal(start);
    }, 16);
    return () => clearInterval(t);
  }, [to, duration]);
  return <>{val}</>;
}

/**
 * DashboardPage — Master orchestrator combining Map + Home layout.
 * Emergency-friendly: 2-3 taps to find and navigate to nearest toilet.
 */
export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();

  // ── Geolocation ──────────────────────────
  const {
    location: userLocation,
    error: locationError,
    loading: locationLoading,
    permissionStatus,
    requestLocation,
    fallbackLocation,
  } = useUserLocation();

  // ── Data State ──────────────────────────
  const [toilets, setToilets] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  // ── UI State ────────────────────────────
  const [selectedToilet, setSelectedToilet] = useState(null);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [viewMode, setViewMode] = useState(() => {
    // Default to 'map' on mobile, 'split' on desktop
    return window.innerWidth <= 768 ? "map" : "split";
  });
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768);
  const [filters, setFilters] = useState({
    status: "all",
    price: "all",
    type: "all",
  });

  // Bottom sheet refs for mobile gesture
  const sheetRef = useRef(null);
  const dragStartRef = useRef(null);
  const dragOffsetRef = useRef(0);

  async function loadToilets() {
    try {
      setDataLoading(true);
      const response = await request("/toilets");
      const data = response.data || [];
      setToilets(data.length > 0 ? data : MOCK_TOILETS);
    } catch {
      setToilets(MOCK_TOILETS);
    } finally {
      setDataLoading(false);
    }
  }

  // ── Load Data ───────────────────────────
  useEffect(() => {
    loadToilets();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Responsive listener ─────────────────
  useEffect(() => {
    function handleResize() {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile && viewMode === "map") {
        setViewMode("split");
      }
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [viewMode]);

  async function loadNearbyToilets() {
    const loc = userLocation || fallbackLocation;
    try {
      setDataLoading(true);
      const response = await request(
        `/toilets/nearby?lat=${loc.lat}&lng=${loc.lng}`
      );
      const data = response.data || [];
      setToilets(data.length > 0 ? data : MOCK_TOILETS);
    } catch {
      setToilets(MOCK_TOILETS);
    } finally {
      setDataLoading(false);
    }
  }

  // ── Filter Logic ────────────────────────
  const filteredToilets = useMemo(() => {
    return toilets.filter((t) => {
      if (filters.status !== "all" && t.status !== filters.status) return false;
      if (filters.price === "free" && t.price > 0) return false;
      if (filters.price === "paid" && t.price === 0) return false;
      if (filters.type !== "all" && t.type !== filters.type) return false;
      return true;
    });
  }, [toilets, filters]);

  // ── Sort by distance ────────────────────
  const sortedToilets = useMemo(() => {
    return [...filteredToilets].sort((a, b) => (a.distance || 999) - (b.distance || 999));
  }, [filteredToilets]);

  // ── Primary CTA: Find nearest ───────────
  const handleFindNearest = useCallback(() => {
    if (permissionStatus === "granted" || userLocation) {
      loadNearbyToilets();
    } else {
      requestLocation();
      setTimeout(() => loadNearbyToilets(), 1500);
    }
  }, [permissionStatus, userLocation, requestLocation]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Marker click → Bottom Sheet ─────────
  const handleMarkerClick = useCallback((toilet) => {
    setSelectedToilet(toilet);
    setBottomSheetOpen(true);
  }, []);

  const handleCardSelect = useCallback((toilet) => {
    setSelectedToilet(toilet);
    setBottomSheetOpen(true);
  }, []);

  const closeBottomSheet = useCallback(() => {
    setBottomSheetOpen(false);
    setTimeout(() => setSelectedToilet(null), 300);
  }, []);

  // ── Bottom sheet touch gestures ─────────
  function handleTouchStart(e) {
    dragStartRef.current = e.touches[0].clientY;
    dragOffsetRef.current = 0;
  }

  function handleTouchMove(e) {
    if (dragStartRef.current === null) return;
    const diff = e.touches[0].clientY - dragStartRef.current;
    if (diff > 0) {
      dragOffsetRef.current = diff;
      if (sheetRef.current) {
        sheetRef.current.style.transform = `translateY(${diff}px)`;
      }
    }
  }

  function handleTouchEnd() {
    if (dragOffsetRef.current > 100) {
      closeBottomSheet();
    }
    if (sheetRef.current) {
      sheetRef.current.style.transform = "";
    }
    dragStartRef.current = null;
    dragOffsetRef.current = 0;
  }

  // ── Permission Banner ──────────────────
  const showPermissionBanner =
    permissionStatus === "denied" || permissionStatus === "unsupported";

  const openCount  = toilets.filter(t => t.status === "OPEN"  || t.status === "open").length;
  const freeCount  = toilets.filter(t => t.price === 0).length;

  return (
    <div className="tg-page">

      {/* ══════════ HERO ══════════ */}
      <section className="tg-hero">
        {/* animated blobs */}
        <div className="tg-hero-blob tg-hero-blob--1" />
        <div className="tg-hero-blob tg-hero-blob--2" />
        <div className="tg-hero-blob tg-hero-blob--3" />

        <div className="tg-hero-inner">
          {/* Left column */}
          <div className="tg-hero-left">
            <div className="tg-hero-tag">
              <span className="tg-hero-tag-dot" />
              {userLocation ? "📍 Joylashuv topildi" : "🌍 ToiletGo — Toshkent"}
            </div>

            <h1 className="tg-hero-title">
              Eng yaqin<br />
              <span className="tg-hero-title-accent">hojatxonani</span><br />
              toping
            </h1>

            <p className="tg-hero-desc">
              GPS orqali atrofingizni skanerlang, ochiq va bepul joylarni toping, yo'nalish oling.
            </p>

            <div className="tg-hero-btns">
              <button
                className="tg-btn-primary"
                onClick={handleFindNearest}
                disabled={locationLoading}
              >
                {locationLoading ? (
                  <><span className="tg-spinner" />Izlanmoqda...</>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/>
                      <line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/>
                      <line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/>
                    </svg>
                    Yaqinimni topish
                  </>
                )}
              </button>

              <button
                className="tg-btn-secondary"
                onClick={() => setViewMode("map")}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
                  <line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>
                </svg>
                Xaritada ko'rish
              </button>
            </div>

            {/* Stats row */}
            <div className="tg-hero-stats">
              <div className="tg-hero-stat">
                <span className="tg-hero-stat-num">
                  <AnimCount to={toilets.length} />
                </span>
                <span className="tg-hero-stat-lbl">Joylar</span>
              </div>
              <div className="tg-hero-stat-sep" />
              <div className="tg-hero-stat">
                <span className="tg-hero-stat-num tg-stat-green">
                  <AnimCount to={openCount} />
                </span>
                <span className="tg-hero-stat-lbl">Ochiq</span>
              </div>
              <div className="tg-hero-stat-sep" />
              <div className="tg-hero-stat">
                <span className="tg-hero-stat-num tg-stat-blue">
                  <AnimCount to={freeCount} />
                </span>
                <span className="tg-hero-stat-lbl">Bepul</span>
              </div>
            </div>
          </div>

          {/* Right column — mini map preview card */}
          <div className="tg-hero-right">
            <div className="tg-hero-map-card">
              <div className="tg-hero-map-header">
                <div className="tg-hero-map-title">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
                  </svg>
                  Xarita ko'rinishi
                </div>
                <div className="tg-hero-map-live">
                  <span className="tg-live-dot"/>LIVE
                </div>
              </div>
              <div className="tg-hero-map-preview">
                <MapContainer
                  toilets={sortedToilets.slice(0, 10)}
                  userLocation={userLocation}
                  onMarkerClick={handleMarkerClick}
                  selectedToilet={selectedToilet}
                />
              </div>
              <div className="tg-hero-map-footer">
                <span>{sortedToilets.length} ta joy ko'rsatilmoqda</span>
                <button className="tg-hero-map-expand" onClick={() => setViewMode("map")}>
                  Kattalashtirish →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ PERMISSION BANNER ══════════ */}
      {showPermissionBanner && (
        <div className="tg-banner-warn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <div>
            <strong>{locationError || t("perm_denied")}</strong>
            <p style={{margin:0, fontSize:"12px", opacity:.8}}>{t("perm_hint")}</p>
          </div>
          <button className="tg-banner-btn" onClick={requestLocation}>{t("perm_retry")}</button>
        </div>
      )}

      {/* ══════════ VIEW TOGGLE BAR ══════════ */}
      <div className="tg-view-bar">
        <div className="tg-view-bar-left">
          <h2 className="tg-section-title">
            {t("results_title")}
            <span className="tg-count-pill">{sortedToilets.length}</span>
          </h2>
        </div>
        <div className="tg-view-bar-right">
          {user?.role === "OWNER" && (
            <button className="tg-add-btn" onClick={() => navigate("/create-toilet")}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              {t("results_add")}
            </button>
          )}
          <div className="tg-toggle-group">
            {[
              { mode: "split", icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="3" x2="12" y2="21"/></svg> },
              { mode: "map",   icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/></svg> },
              { mode: "list",  icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg> },
            ].map(({ mode, icon }) => (
              <button
                key={mode}
                className={`tg-toggle-btn ${viewMode === mode ? "active" : ""}`}
                onClick={() => setViewMode(mode)}
                title={mode}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════ MAIN CONTENT ══════════ */}
      <div className={`tg-main tg-main--${viewMode}`}>

        {/* Map panel */}
        {viewMode !== "list" && (
          <div className="tg-map-panel">
            <MapContainer
              toilets={sortedToilets}
              userLocation={userLocation}
              onMarkerClick={handleMarkerClick}
              selectedToilet={selectedToilet}
            />
          </div>
        )}

        {/* Results panel */}
        {viewMode !== "map" && (
          <div className="tg-results-panel">
            <FilterShell
              filters={filters}
              onFilterChange={setFilters}
              resultCount={sortedToilets.length}
            />

            {dataLoading && (
              <div className="tg-skeleton-wrap">
                {[1,2,3].map(i => (
                  <div key={i} className="tg-skeleton-card">
                    <div className="tg-sk tg-sk--title"/>
                    <div className="tg-sk tg-sk--sub"/>
                    <div style={{display:"flex",gap:"8px"}}>
                      <div className="tg-sk tg-sk--sm"/><div className="tg-sk tg-sk--sm"/>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!dataLoading && sortedToilets.length === 0 && (
              <div className="tg-empty">
                <div className="tg-empty-icon">🚽</div>
                <h3 className="tg-empty-title">{t("results_empty_title")}</h3>
                <p className="tg-empty-text">{t("results_empty_text")}</p>
                <button className="tg-btn-primary" style={{marginTop:"12px"}}
                  onClick={() => setFilters({ status:"all", price:"all", type:"all" })}>
                  Filterni tozalash
                </button>
              </div>
            )}

            {!dataLoading && (
              <div className="tg-cards-grid">
                {sortedToilets.map((toilet) => (
                  <ResultCard
                    key={toilet.id}
                    toilet={toilet}
                    userLocation={userLocation}
                    isSelected={selectedToilet?.id === toilet.id}
                    onSelect={handleCardSelect}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ══════════ BOTTOM SHEET ══════════ */}
      {bottomSheetOpen && selectedToilet && (
        <>
          <div className="tg-sheet-overlay" onClick={closeBottomSheet} />
          <div
            ref={sheetRef}
            className={`tg-bottom-sheet ${bottomSheetOpen ? "open" : ""}`}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="tg-sheet-handle"><div className="tg-sheet-bar"/></div>
            <div className="tg-sheet-body">
              <ResultCard
                toilet={selectedToilet}
                userLocation={userLocation}
                isSelected
                onSelect={() => navigate(`/toilets/${selectedToilet.id}`)}
              />
              <button
                className="tg-sheet-detail-btn"
                onClick={() => navigate(`/toilets/${selectedToilet.id}`)}
              >
                Batafsil ko'rish
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
            </div>
          </div>
        </>
      )}

      {/* ══════════ MOBILE BOTTOM NAV ══════════ */}
      {isMobile && (
        <nav className="tg-mobile-nav">
          {[
            { mode:"map",   label:"Xarita", icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg> },
            { mode:"split", label:"Split",  icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="3" x2="12" y2="21"/></svg> },
            { mode:"list",  label:"Ro'yxat",icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg> },
          ].map(({ mode, label, icon }) => (
            <button
              key={mode}
              className={`tg-mobile-nav-item ${viewMode === mode ? "active" : ""}`}
              onClick={() => setViewMode(mode)}
            >
              <span className="tg-mobile-nav-icon">{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}
