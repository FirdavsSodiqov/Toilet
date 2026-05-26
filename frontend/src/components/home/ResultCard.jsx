import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

/* ── helpers ── */
function fmtDistance(d) {
  if (!d) return null;
  return d < 1 ? `${Math.round(d * 1000)} m` : `${d.toFixed(1)} km`;
}
function fmtPrice(price, cur) {
  if (!price || price === 0) return null;
  return `${price.toLocaleString()} ${cur}`;
}

/* ── 5-star row ── */
function Stars({ rating }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <div className="rc-stars">
      {[...Array(5)].map((_, i) => (
        <svg key={i} width="13" height="13" viewBox="0 0 24 24"
          fill={i < full ? "#fbbf24" : "none"}
          stroke={i < full || (i === full && half) ? "#fbbf24" : "#cbd5e1"}
          strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
      <span className="rc-stars-val">{rating.toFixed(1)}</span>
    </div>
  );
}

/* ── placeholder when no image ── */
function ImagePlaceholder({ type, status }) {
  const COLORS = {
    premium: ["#6366f1","#818cf8"],
    paid:    ["#f59e0b","#fbbf24"],
    public:  ["#06b6d4","#67e8f9"],
    free:    ["#22c55e","#86efac"],
  };
  const [c1, c2] = COLORS[type?.toLowerCase()] || COLORS.public;
  const emoji = type === "premium" ? "🏨" : type === "paid" ? "💳" : "🚻";
  return (
    <div className="rc-img-placeholder" style={{background:`linear-gradient(135deg,${c1},${c2})`}}>
      <span className="rc-img-placeholder-icon">{emoji}</span>
      <span className="rc-img-placeholder-label">
        {status === "OPEN" || status === "open" ? "Ochiq" : status === "closed" || status === "CLOSED" ? "Yopiq" : "Cheklangan"}
      </span>
    </div>
  );
}

/* ══════════════════════════════════════
   ResultCard — Figma image-first design
   ══════════════════════════════════════ */
export default function ResultCard({
  toilet,
  isSelected = false,
  onSelect,
  compact = false,
}) {
  const { t } = useLanguage();
  const navigate = useNavigate();

  /* status config — handle both lowercase and uppercase */
  const STATUS_CFG = {
    open:    { label: t("status_open")    || "Ochiq",      bg:"rgba(34,197,94,0.12)",  color:"#22c55e" },
    OPEN:    { label: t("status_open")    || "Ochiq",      bg:"rgba(34,197,94,0.12)",  color:"#22c55e" },
    limited: { label: t("status_limited") || "Cheklangan", bg:"rgba(234,179,8,0.12)",  color:"#eab308" },
    closed:  { label: t("status_closed")  || "Yopiq",      bg:"rgba(239,68,68,0.12)",  color:"#ef4444" },
    CLOSED:  { label: t("status_closed")  || "Yopiq",      bg:"rgba(239,68,68,0.12)",  color:"#ef4444" },
  };
  const status  = STATUS_CFG[toilet.status] || STATUS_CFG.open;
  const dist    = fmtDistance(toilet.distance);
  const price   = fmtPrice(toilet.price, t("price_currency") || "so'm");

  /* image — can be Array or JSON string from backend */
  const coverImg = useMemo(() => {
    if (!toilet.images) return null;
    if (Array.isArray(toilet.images)) return toilet.images[0] || null;
    try {
      const parsed = JSON.parse(toilet.images);
      return Array.isArray(parsed) ? parsed[0] : parsed;
    } catch {
      return typeof toilet.images === "string" ? toilet.images : null;
    }
  }, [toilet.images]);

  /* nav deep-links */
  const { lat, lng } = toilet;
  const googleUrl  = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  const yandexUrl  = `https://yandex.com/maps/?rtext=~${lat},${lng}&rtt=auto`;
  const yandexApp  = `yandexmaps://maps.yandex.ru/?rtext=~${lat},${lng}&rtt=auto`;

  function onGoogle(e) {
    e.stopPropagation();
    window.open(googleUrl, "_blank", "noopener");
  }
  function onYandex(e) {
    e.stopPropagation();
    const t2 = setTimeout(() => window.open(yandexUrl, "_blank", "noopener"), 800);
    window.location.href = yandexApp;
    window.addEventListener("blur", () => clearTimeout(t2), { once: true });
  }
  function onDetail(e) {
    e.stopPropagation();
    navigate(`/toilets/${toilet.id}`);
  }

  return (
    <article
      className={`rc ${isSelected ? "rc--selected" : ""} ${compact ? "rc--compact" : ""}`}
      onClick={() => onSelect?.(toilet)}
      role="button"
      tabIndex={0}
      aria-label={`${toilet.name}, ${status.label}`}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelect?.(toilet); } }}
    >
      {/* ── Cover image ── */}
      <div className="rc-img-wrap">
        {coverImg ? (
          <img
            src={coverImg}
            alt={toilet.name}
            className="rc-img"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              const ph = e.currentTarget.parentNode.querySelector(".rc-img-placeholder");
              if (ph) ph.style.display = "flex";
            }}
          />
        ) : (
          <ImagePlaceholder type={toilet.type} status={toilet.status} />
        )}

        {/* Status badge over image */}
        <div className="rc-status-badge" style={{ background: status.bg, color: status.color, borderColor: status.color }}>
          <span className="rc-status-dot" style={{ background: status.color }} />
          {status.label}
        </div>

        {/* Distance chip */}
        {dist && (
          <div className="rc-dist-chip">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            {dist}
          </div>
        )}
      </div>

      {/* ── Info body ── */}
      <div className="rc-body">
        {/* Title row */}
        <div className="rc-title-row">
          <h3 className="rc-title">{toilet.name}</h3>
          <span className={`rc-price ${toilet.price === 0 ? "rc-price--free" : ""}`}>
            {price || (t("price_free") || "Bepul")}
          </span>
        </div>

        {/* Type + stars row */}
        <div className="rc-meta-row">
          <span className="rc-type">
            {toilet.type === "premium" ? "⭐ Premium" :
             toilet.type === "paid" || toilet.type === "PAID" ? "💳 To'lovli" :
             toilet.type === "PUBLIC" || toilet.type === "public" ? "🚻 Ommaviy" : toilet.type}
          </span>
          <Stars rating={toilet.rating || toilet.avg_rating || 0} />
        </div>

        {/* Action buttons */}
        <div className="rc-actions">
          <button className="rc-btn rc-btn--detail" onClick={onDetail}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            Batafsil
          </button>
          <button className="rc-btn rc-btn--google" onClick={onGoogle}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="3 11 22 2 13 21 11 13 3 11"/>
            </svg>
            Google
          </button>
          <button className="rc-btn rc-btn--yandex" onClick={onYandex}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="3 11 22 2 13 21 11 13 3 11"/>
            </svg>
            Yandex
          </button>
        </div>
      </div>
    </article>
  );
}
