import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { lang, t, switchLanguage, languages } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [langOpen, setLangOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const langRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    function handler(e) {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 10); }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);



  const currentLang = languages.find((l) => l.code === lang);
  const initials = user
    ? user.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "";

  return (
    <div className="app-shell">
      {/* ── Animated Background ── */}
      <div className="animated-bg" aria-hidden="true">
        <div className="bg-gradient-1" />
        <div className="bg-gradient-2" />
        <div className="bg-gradient-3" />
        <div className="bg-mesh" />
        <div className="bg-shape bg-shape--1" />
        <div className="bg-shape bg-shape--2" />
        <div className="bg-shape bg-shape--3" />
        <div className="bg-shape bg-shape--4" />
        <div className="bg-shape bg-shape--5" />
        <div className="bg-shape bg-shape--6" />
        <div className="bg-grid" />
      </div>

      {/* ── Navbar ── */}
      <nav className={`app-navbar ${scrolled ? "app-navbar--scrolled" : ""}`}>
        <div className="navbar-inner">
          {/* Brand */}
          <div className="navbar-brand" onClick={() => navigate("/")}>
            <div className="brand-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <div className="brand-text">
              <span className="brand-top">{t("nav_brand_top")}</span>
              <span className="brand-bottom">{t("nav_brand_bottom")}</span>
            </div>
          </div>

          {/* Hamburger — mobile only */}
          <button
            className="navbar-hamburger"
            onClick={() => setMobileMenuOpen(o => !o)}
            aria-label="Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            )}
          </button>

          {/* Nav Links (desktop) */}
          <div className="navbar-links">
            <Link to="/" className={`navbar-link ${location.pathname === "/" ? "active" : ""}`}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
                <line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>
              </svg>
              {t("nav_home") || "Bosh sahifa"}
            </Link>
            {user?.role === "OWNER" && (
              <Link to="/create-toilet" className={`navbar-link ${location.pathname === "/create-toilet" ? "active" : ""}`}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                {t("results_add") || "Yangi joy"}
              </Link>
            )}
          </div>

          {/* Controls */}
          <div className="navbar-controls">
            {/* Language Switcher */}
            <div className="lang-switcher" ref={langRef}>
              <button
                className="lang-toggle"
                onClick={() => setLangOpen(!langOpen)}
                aria-label="Change language"
                aria-expanded={langOpen}
              >
                <span className="lang-flag">{currentLang?.flag}</span>
                <span className="lang-code">{lang.toUpperCase()}</span>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                  className={`lang-chevron ${langOpen ? "open" : ""}`}>
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {langOpen && (
                <div className="lang-dropdown">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      className={`lang-option ${lang === l.code ? "active" : ""}`}
                      onClick={() => { switchLanguage(l.code); setLangOpen(false); }}
                    >
                      <span className="lang-option-flag">{l.flag}</span>
                      <span className="lang-option-label">{l.label}</span>
                      {lang === l.code && (
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button className="theme-toggle" onClick={toggleTheme}
              aria-label={isDark ? t("theme_light") : t("theme_dark")}
              title={isDark ? t("theme_light") : t("theme_dark")}>
              <div className="theme-toggle-track">
                <div className={`theme-toggle-thumb ${isDark ? "dark" : "light"}`}>
                  {isDark ? (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                      <path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                    </svg>
                  ) : (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                      <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                    </svg>
                  )}
                </div>
              </div>
            </button>

            {/* Auth / User Menu */}
            {user ? (
              <div className="user-menu-wrap" ref={userMenuRef}>
                <button
                  className={`user-avatar-btn ${userMenuOpen ? "active" : ""}`}
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  aria-label="User menu"
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="user-avatar-photo" />
                  ) : (
                    <span className="user-avatar-initials">{initials}</span>
                  )}
                  <span className="user-avatar-name">{user.name.split(" ")[0]}</span>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                    className={`lang-chevron ${userMenuOpen ? "open" : ""}`} style={{marginLeft:"2px"}}>
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>
                {userMenuOpen && (
                  <div className="user-dropdown">
                    <div className="user-dropdown-header">
                      <div className="user-dropdown-avatar">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} className="user-avatar-photo" />
                        ) : (
                          <span>{initials}</span>
                        )}
                      </div>
                      <div>
                        <div className="user-dropdown-name">{user.name}</div>
                        <div className="user-dropdown-role">{user.role}</div>
                      </div>
                    </div>
                    <div className="user-dropdown-divider" />
                    <button className="user-dropdown-item" onClick={() => { navigate("/profile"); setUserMenuOpen(false); }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                      {t("nav_profile") || "Profil"}
                    </button>
                    {user.role === "OWNER" && (
                      <button className="user-dropdown-item" onClick={() => { navigate("/create-toilet"); setUserMenuOpen(false); }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                        {t("results_add") || "Yangi joy"}
                      </button>
                    )}
                    <div className="user-dropdown-divider" />
                    <button className="user-dropdown-item user-dropdown-item--danger" onClick={() => { logout(); setUserMenuOpen(false); }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                        <polyline points="16 17 21 12 16 7"/>
                        <line x1="21" y1="12" x2="9" y2="12"/>
                      </svg>
                      {t("nav_logout")}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="auth-btn auth-btn--ghost">{t("nav_login")}</Link>
                <Link to="/register" className="auth-btn auth-btn--primary">{t("nav_register")}</Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ── Mobile Drawer ── */}
      {mobileMenuOpen && (
        <>
          <div className="mobile-drawer-overlay" onClick={() => setMobileMenuOpen(false)} />
          <div className="mobile-drawer">
            <div className="mobile-drawer-user">
              {user ? (
                <>
                  <div className="mobile-drawer-avatar">{initials}</div>
                  <div>
                    <div className="mobile-drawer-name">{user.name}</div>
                    <div className="mobile-drawer-role">{user.role}</div>
                  </div>
                </>
              ) : (
                <div className="mobile-drawer-anon">Mehmon</div>
              )}
            </div>
            <nav className="mobile-drawer-links">
              <Link to="/" className={`mobile-drawer-link ${location.pathname === "/" ? "active" : ""}`} onClick={() => setMobileMenuOpen(false)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/></svg>
                Bosh sahifa
              </Link>
              {user && (
                <Link to="/profile" className={`mobile-drawer-link ${location.pathname === "/profile" ? "active" : ""}`} onClick={() => setMobileMenuOpen(false)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  Profil
                </Link>
              )}
              {user?.role === "OWNER" && (
                <Link to="/create-toilet" className={`mobile-drawer-link ${location.pathname === "/create-toilet" ? "active" : ""}`} onClick={() => setMobileMenuOpen(false)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Yangi joy
                </Link>
              )}
            </nav>
            <div className="mobile-drawer-footer">
              {user ? (
                <button className="mobile-drawer-logout" onClick={() => { logout(); setMobileMenuOpen(false); }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                  Chiqish
                </button>
              ) : (
                <div style={{display:'flex',gap:'8px'}}>
                  <Link to="/login" className="mobile-drawer-auth-btn" onClick={() => setMobileMenuOpen(false)}>Kirish</Link>
                  <Link to="/register" className="mobile-drawer-auth-btn active" onClick={() => setMobileMenuOpen(false)}>Ro'yxat</Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* ── Main Content ── */}
      <main className="app-main">
        {children}
      </main>

      {/* ── Footer ── */}
      <footer className="app-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="brand-icon" style={{width:"32px",height:"32px"}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <span className="footer-brand-text">Luxury Rest</span>
          </div>
          <p className="footer-copy">{t("footer_text")}</p>
          <div className="footer-links">
            <Link to="/" className="footer-link">{t("nav_home") || "Home"}</Link>
            {user && <Link to="/profile" className="footer-link">{t("nav_profile") || "Profile"}</Link>}
          </div>
        </div>
      </footer>
    </div>
  );
}
