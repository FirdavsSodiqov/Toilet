import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { request } from "../lib/api";

/* ─── Stat Card ─── */
function StatCard({ icon, value, label, color }) {
  return (
    <div className="profile-stat-card">
      <div className="profile-stat-icon" style={{ background: color }}>
        {icon}
      </div>
      <div className="profile-stat-value">{value}</div>
      <div className="profile-stat-label">{label}</div>
    </div>
  );
}

/* ─── Toilet Row ─── */
function ToiletRow({ toilet, onEdit, onDelete, t }) {
  const STATUS_COLOR = { open: "#22c55e", limited: "#eab308", closed: "#ef4444", OPEN: "#22c55e", CLOSED: "#ef4444" };
  const color = STATUS_COLOR[toilet.status] || "#94a3b8";
  return (
    <div className="profile-toilet-row">
      <div className="profile-toilet-dot" style={{ background: color }} />
      <div className="profile-toilet-info">
        <span className="profile-toilet-name">{toilet.name}</span>
        <span className="profile-toilet-meta">
          {toilet.type?.toLowerCase()} &middot; {toilet.price === 0 ? t("price_free") : `${toilet.price?.toLocaleString()} ${t("price_currency")}`}
        </span>
      </div>
      <div className="profile-toilet-rating">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="#fbbf24" stroke="none">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
        <span>{(toilet.avg_rating || 0).toFixed(1)}</span>
      </div>
      <div className="profile-toilet-actions">
        <button className="profile-toilet-btn profile-toilet-btn--edit" onClick={() => onEdit(toilet.id)} title="Edit">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
        <button className="profile-toilet-btn profile-toilet-btn--delete" onClick={() => onDelete(toilet.id)} title="Delete">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function OwnerProfilePage() {
  const { user, setUser } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [myToilets, setMyToilets] = useState([]);
  const [loadingToilets, setLoadingToilets] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
    avatar: user?.avatar || "",
  });

  async function loadMyToilets(uid) {
    try {
      setLoadingToilets(true);
      const res = await request(`/toilets?ownerId=${uid}`);
      setMyToilets(res.data || []);
    } catch (e) { // eslint-disable-line no-unused-vars
      setMyToilets([]);
    } finally {
      setLoadingToilets(false);
    }
  }

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    loadMyToilets(user.id); // eslint-disable-line
  }, [user?.id]); // eslint-disable-line

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setSaveMsg("");
    try {
      const res = await request("/auth/profile", {
        method: "PUT",
        body: JSON.stringify(form),
      });
      setUser(res.data);
      setSaveMsg(t("profile_saved") || "Saved!");
      setEditMode(false);
    } catch (err) {
      setSaveMsg(err.message);
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMsg(""), 3000);
    }
  }

  async function handleDeleteToilet(id) {
    try {
      await request(`/toilets/${id}`, { method: "DELETE" });
      setMyToilets((prev) => prev.filter((t) => t.id !== id));
      setDeleteConfirm(null);
    } catch (e) { // eslint-disable-line no-unused-vars
      setDeleteConfirm(null);
    }
  }

  if (!user) return null;

  const totalRating =
    myToilets.length > 0
      ? (myToilets.reduce((s, t) => s + (t.avg_rating || 0), 0) / myToilets.length).toFixed(1)
      : "—";
  const openCount = myToilets.filter((t) => t.status === "OPEN" || t.status === "open").length;
  const initials = user.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="profile-page">
      {/* ── Hero Banner ── */}
      <div className="profile-hero">
        <div className="profile-hero-orbs">
          <div className="profile-orb profile-orb--1" />
          <div className="profile-orb profile-orb--2" />
          <div className="profile-orb profile-orb--3" />
        </div>
        <div className="profile-hero-content">
          <div className="profile-avatar-wrap">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="profile-avatar-img" />
            ) : (
              <div className="profile-avatar-initials">{initials}</div>
            )}
            <div className="profile-avatar-ring" />
            {user.role === "OWNER" && (
              <div className="profile-owner-badge">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1L15.5 8 23 9.3l-5.5 5.4 1.3 7.6L12 18.8l-6.8 3.5 1.3-7.6L1 9.3 8.5 8z" />
                </svg>
                OWNER
              </div>
            )}
          </div>
          <div className="profile-hero-text">
            <h1 className="profile-name">{user.name}</h1>
            <p className="profile-phone">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 01-2.18 2A19.79 19.79 0 013.09 5.18 2 2 0 015.07 3h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L9.09 10.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 17.92z" />
              </svg>
              {user.phone}
            </p>
            {user.bio && <p className="profile-bio">{user.bio}</p>}
            <div className="profile-role-chip">{user.role}</div>
          </div>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className="profile-stats-row">
        <StatCard
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>}
          value={myToilets.length}
          label={t("profile_stat_toilets") || "Joylar"}
          color="linear-gradient(135deg,#6366f1,#4f46e5)"
        />
        <StatCard
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>}
          value={openCount}
          label={t("profile_stat_open") || "Ochiq"}
          color="linear-gradient(135deg,#22c55e,#16a34a)"
        />
        <StatCard
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="#fbbf24" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>}
          value={totalRating}
          label={t("profile_stat_rating") || "O'rtacha reyting"}
          color="linear-gradient(135deg,#f59e0b,#d97706)"
        />
        <StatCard
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>}
          value={user.role}
          label={t("profile_stat_role") || "Rol"}
          color="linear-gradient(135deg,#06b6d4,#0891b2)"
        />
      </div>

      {/* ── Tabs ── */}
      <div className="profile-tabs">
        {["overview", "toilets", "settings"].map((tab) => (
          <button
            key={tab}
            className={`profile-tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "overview" && (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
              </svg>
            )}
            {tab === "toilets" && (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
              </svg>
            )}
            {tab === "settings" && (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
              </svg>
            )}
            {tab === "overview" && (t("profile_tab_overview") || "Umumiy")}
            {tab === "toilets" && (t("profile_tab_toilets") || "Joylarim")}
            {tab === "settings" && (t("profile_tab_settings") || "Sozlamalar")}
          </button>
        ))}
      </div>

      {/* ── Tab Content ── */}
      <div className="profile-body">

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="profile-overview animate-fade-in">
            <div className="profile-card">
              <h3 className="profile-card-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
                </svg>
                {t("profile_about") || "Ma'lumot"}
              </h3>
              <div className="profile-info-grid">
                <div className="profile-info-item">
                  <span className="profile-info-label">{t("profile_name") || "Ism"}</span>
                  <span className="profile-info-value">{user.name}</span>
                </div>
                <div className="profile-info-item">
                  <span className="profile-info-label">{t("profile_phone") || "Telefon"}</span>
                  <span className="profile-info-value">{user.phone}</span>
                </div>
                <div className="profile-info-item">
                  <span className="profile-info-label">{t("profile_role_label") || "Rol"}</span>
                  <span className="profile-info-value profile-role-chip">{user.role}</span>
                </div>
                <div className="profile-info-item">
                  <span className="profile-info-label">{t("profile_joined") || "A'zo bo'lgan"}</span>
                  <span className="profile-info-value">
                    {new Date(user.createdAt).toLocaleDateString("uz-UZ", { year: "numeric", month: "long", day: "numeric" })}
                  </span>
                </div>
              </div>
              {user.bio && (
                <div className="profile-bio-block">
                  <span className="profile-info-label">{t("profile_bio") || "Bio"}</span>
                  <p className="profile-bio-text">{user.bio}</p>
                </div>
              )}
            </div>

            {/* Recent toilets preview */}
            {myToilets.length > 0 && (
              <div className="profile-card">
                <h3 className="profile-card-title">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  {t("profile_recent_toilets") || "So'nggi joylar"}
                </h3>
                {myToilets.slice(0, 3).map((toilet) => (
                  <ToiletRow
                    key={toilet.id}
                    toilet={toilet}
                    onEdit={(id) => navigate(`/toilets/${id}/edit`)}
                    onDelete={(id) => setDeleteConfirm(id)}
                    t={t}
                  />
                ))}
                {myToilets.length > 3 && (
                  <button className="profile-see-all-btn" onClick={() => setActiveTab("toilets")}>
                    {t("profile_see_all") || "Hammasini ko'rish"} →
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* TOILETS TAB */}
        {activeTab === "toilets" && (
          <div className="profile-toilets-tab animate-fade-in">
            <div className="profile-card">
              <div className="profile-card-header-row">
                <h3 className="profile-card-title">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  {t("profile_my_toilets") || "Mening joylarim"}
                  <span className="profile-count-chip">{myToilets.length}</span>
                </h3>
                <button className="profile-add-btn" onClick={() => navigate("/create-toilet")}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  {t("results_add") || "Yangi"}
                </button>
              </div>

              {loadingToilets ? (
                <div className="profile-loading">
                  {[1,2,3].map(i => <div key={i} className="skeleton-card"><div className="skeleton-line skeleton-line--title"/></div>)}
                </div>
              ) : myToilets.length === 0 ? (
                <div className="profile-empty">
                  <div className="empty-icon">🚽</div>
                  <p>{t("profile_no_toilets") || "Hali joy qo'shilmagan"}</p>
                  <button className="hero-cta" style={{marginTop:"12px"}} onClick={() => navigate("/create-toilet")}>
                    {t("results_add") || "Yangi joy qo'shish"}
                  </button>
                </div>
              ) : (
                myToilets.map((toilet) => (
                  <ToiletRow
                    key={toilet.id}
                    toilet={toilet}
                    onEdit={(id) => navigate(`/toilets/${id}/edit`)}
                    onDelete={(id) => setDeleteConfirm(id)}
                    t={t}
                  />
                ))
              )}
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === "settings" && (
          <div className="profile-settings-tab animate-fade-in">
            <div className="profile-card">
              <div className="profile-card-header-row">
                <h3 className="profile-card-title">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                  {t("profile_edit_title") || "Profilni tahrirlash"}
                </h3>
                {!editMode && (
                  <button className="profile-edit-toggle" onClick={() => setEditMode(true)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    {t("profile_edit_btn") || "Tahrirlash"}
                  </button>
                )}
              </div>

              <form onSubmit={handleSave} className="profile-form">
                <div className="profile-form-group">
                  <label className="profile-form-label">{t("profile_name") || "Ism"}</label>
                  <input
                    type="text"
                    className="profile-form-input"
                    value={form.name}
                    disabled={!editMode}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Ism familiya"
                  />
                </div>
                <div className="profile-form-group">
                  <label className="profile-form-label">{t("profile_phone") || "Telefon"}</label>
                  <input
                    type="text"
                    className="profile-form-input"
                    value={form.phone}
                    disabled={!editMode}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+998901234567"
                  />
                </div>
                <div className="profile-form-group">
                  <label className="profile-form-label">{t("profile_bio") || "Bio"}</label>
                  <textarea
                    className="profile-form-input profile-form-textarea"
                    value={form.bio}
                    disabled={!editMode}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    placeholder={t("profile_bio_placeholder") || "O'zingiz haqida qisqacha..."}
                    rows={3}
                  />
                </div>
                <div className="profile-form-group">
                  <label className="profile-form-label">{t("profile_avatar") || "Avatar URL"}</label>
                  <input
                    type="url"
                    className="profile-form-input"
                    value={form.avatar}
                    disabled={!editMode}
                    onChange={(e) => setForm({ ...form, avatar: e.target.value })}
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>

                {editMode && (
                  <div className="profile-form-actions">
                    <button type="submit" className="profile-save-btn" disabled={saving}>
                      {saving ? (
                        <><span className="cta-spinner" />{t("saving") || "Saqlanmoqda..."}</>
                      ) : (
                        <>{t("profile_save") || "Saqlash"}</>
                      )}
                    </button>
                    <button type="button" className="profile-cancel-btn" onClick={() => {
                      setEditMode(false);
                      setForm({ name: user.name, phone: user.phone, bio: user.bio || "", avatar: user.avatar || "" });
                    }}>
                      {t("cancel") || "Bekor qilish"}
                    </button>
                  </div>
                )}

                {saveMsg && (
                  <div className={`profile-save-msg ${saveMsg.includes("aved") || saveMsg.includes("aqlan") ? "profile-save-msg--ok" : "profile-save-msg--err"}`}>
                    {saveMsg}
                  </div>
                )}
              </form>
            </div>
          </div>
        )}
      </div>

      {/* ── Delete Confirm Modal ── */}
      {deleteConfirm !== null && (
        <>
          <div className="bottom-sheet-overlay" onClick={() => setDeleteConfirm(null)} />
          <div className="profile-confirm-modal">
            <div className="profile-confirm-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <h3>{t("profile_delete_title") || "O'chirishni tasdiqlang"}</h3>
            <p>{t("profile_delete_text") || "Bu amalni qaytarib bo'lmaydi."}</p>
            <div className="profile-confirm-actions">
              <button className="profile-confirm-yes" onClick={() => handleDeleteToilet(deleteConfirm)}>
                {t("profile_delete_yes") || "Ha, o'chirish"}
              </button>
              <button className="profile-confirm-no" onClick={() => setDeleteConfirm(null)}>
                {t("cancel") || "Bekor qilish"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
