import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { request } from '../lib/api';
import { useAuth } from '../context/AuthContext';

function FloatingCube({ style }) {
  return (
    <div className="auth-3d-cube" style={style}>
      <div className="cube-face cube-front" />
      <div className="cube-face cube-back" />
      <div className="cube-face cube-left" />
      <div className="cube-face cube-right" />
      <div className="cube-face cube-top" />
      <div className="cube-face cube-bottom" />
    </div>
  );
}

export default function LoginPage() {
  const [form, setForm] = useState({ phone: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(form)
      });
      login(response.token);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Telefon yoki parol noto\'g\'ri');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth2-page">
      {/* 3D floating cubes */}
      <FloatingCube style={{'--d':'0s','--x':'10%','--y':'15%','--s':'54px','--r':'12deg'}} />
      <FloatingCube style={{'--d':'1.2s','--x':'80%','--y':'10%','--s':'38px','--r':'-8deg'}} />
      <FloatingCube style={{'--d':'2.1s','--x':'70%','--y':'75%','--s':'66px','--r':'20deg'}} />
      <FloatingCube style={{'--d':'0.6s','--x':'5%','--y':'70%','--s':'44px','--r':'-15deg'}} />
      <FloatingCube style={{'--d':'1.8s','--x':'90%','--y':'50%','--s':'30px','--r':'5deg'}} />
      <FloatingCube style={{'--d':'3s','--x':'50%','--y':'85%','--s':'52px','--r':'-20deg'}} />

      <div className="auth2-layout">
        {/* Left panel — brand */}
        <div className="auth2-brand-panel">
          <div className="auth2-brand-icon">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
          <h1 className="auth2-brand-title">Luxury Rest</h1>
          <p className="auth2-brand-sub">Toshkentdagi eng yaxshi hojatxonalarni toping</p>

          <div className="auth2-features">
            <div className="auth2-feature">
              <div className="auth2-feature-icon">📍</div>
              <div>
                <div className="auth2-feature-title">Real vaqt joylashuv</div>
                <div className="auth2-feature-desc">GPS orqali yaqin joylarni toping</div>
              </div>
            </div>
            <div className="auth2-feature">
              <div className="auth2-feature-icon">⭐</div>
              <div>
                <div className="auth2-feature-title">Reytinglar va sharhlar</div>
                <div className="auth2-feature-desc">Foydalanuvchilar fikrlari</div>
              </div>
            </div>
            <div className="auth2-feature">
              <div className="auth2-feature-icon">🔒</div>
              <div>
                <div className="auth2-feature-title">Xavfsiz va tez</div>
                <div className="auth2-feature-desc">JWT himoyalangan tizim</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel — form */}
        <div className="auth2-form-panel">
          <div className="auth2-card">
            <div className="auth2-card-top">
              <h2 className="auth2-card-title">Xush kelibsiz 👋</h2>
              <p className="auth2-card-sub">Hisobingizga kiring</p>
            </div>

            {error && (
              <div className="auth2-error">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            <form className="auth2-form" onSubmit={handleSubmit}>
              <div className="auth2-field">
                <label className="auth2-label">Telefon raqam</label>
                <div className="auth2-input-wrap">
                  <svg className="auth2-input-icon" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.63 19.79 19.79 0 01.08 2.18 2 2 0 012.07 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.18 7.82a16 16 0 006 6l1.18-1.18a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92z"/>
                  </svg>
                  <input
                    className="auth2-input"
                    placeholder="+998 90 123 45 67"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    required
                    autoComplete="tel"
                  />
                </div>
              </div>

              <div className="auth2-field">
                <label className="auth2-label">Parol</label>
                <div className="auth2-input-wrap">
                  <svg className="auth2-input-icon" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                  </svg>
                  <input
                    className="auth2-input"
                    placeholder="••••••••"
                    type={showPass ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                    autoComplete="current-password"
                  />
                  <button type="button" className="auth2-eye-btn" onClick={() => setShowPass(!showPass)}>
                    {showPass ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button className="auth2-submit-btn" type="submit" disabled={loading}>
                {loading ? (
                  <><span className="auth2-spinner"/>Kirish...</>
                ) : (
                  <><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>
                  </svg>Kirish</>
                )}
              </button>
            </form>

            <p className="auth2-footer">
              Akkauntingiz yo'qmi?{' '}
              <Link to="/register" className="auth2-link">Ro'yxatdan o'ting →</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
