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

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', phone: '', password: '', role: 'USER' });
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
      const response = await request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(form)
      });
      login(response.token);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Ro\'yxatdan o\'tishda xatolik');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth2-page">
      <FloatingCube style={{'--d':'0.3s','--x':'8%','--y':'20%','--s':'60px','--r':'15deg'}} />
      <FloatingCube style={{'--d':'1.5s','--x':'85%','--y':'8%','--s':'42px','--r':'-10deg'}} />
      <FloatingCube style={{'--d':'2.4s','--x':'75%','--y':'80%','--s':'70px','--r':'25deg'}} />
      <FloatingCube style={{'--d':'0.9s','--x':'3%','--y':'65%','--s':'48px','--r':'-18deg'}} />
      <FloatingCube style={{'--d':'2s','--x':'92%','--y':'55%','--s':'34px','--r':'8deg'}} />
      <FloatingCube style={{'--d':'3.2s','--x':'45%','--y':'90%','--s':'56px','--r':'-22deg'}} />

      <div className="auth2-layout">
        {/* Left panel */}
        <div className="auth2-brand-panel">
          <div className="auth2-brand-icon">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
          <h1 className="auth2-brand-title">Luxury Rest</h1>
          <p className="auth2-brand-sub">Bizga qo'shiling va afzalliklardan foydalaning</p>

          <div className="auth2-features">
            <div className="auth2-feature">
              <div className="auth2-feature-icon">🏆</div>
              <div>
                <div className="auth2-feature-title">Premium xizmat</div>
                <div className="auth2-feature-desc">Eng yaxshi joylarga kirish</div>
              </div>
            </div>
            <div className="auth2-feature">
              <div className="auth2-feature-icon">🗺️</div>
              <div>
                <div className="auth2-feature-title">Interaktiv xarita</div>
                <div className="auth2-feature-desc">Barcha joylarni xaritada ko'ring</div>
              </div>
            </div>
            <div className="auth2-feature">
              <div className="auth2-feature-icon">💬</div>
              <div>
                <div className="auth2-feature-title">Ega bilan chat</div>
                <div className="auth2-feature-desc">Real vaqtda muloqot</div>
              </div>
            </div>
          </div>

          {/* Role selector cards */}
          <div className="auth2-role-cards">
            <div
              className={`auth2-role-card ${form.role === 'USER' ? 'active' : ''}`}
              onClick={() => setForm({ ...form, role: 'USER' })}
            >
              <span className="auth2-role-icon">👤</span>
              <span className="auth2-role-label">Foydalanuvchi</span>
              <span className="auth2-role-desc">Joylarni qidiring</span>
            </div>
            <div
              className={`auth2-role-card ${form.role === 'OWNER' ? 'active' : ''}`}
              onClick={() => setForm({ ...form, role: 'OWNER' })}
            >
              <span className="auth2-role-icon">🏢</span>
              <span className="auth2-role-label">Egasi (OWNER)</span>
              <span className="auth2-role-desc">Joy qo'shing</span>
            </div>
          </div>
        </div>

        {/* Right panel — form */}
        <div className="auth2-form-panel">
          <div className="auth2-card">
            <div className="auth2-card-top">
              <h2 className="auth2-card-title">Hisob yaratish ✨</h2>
              <p className="auth2-card-sub">Bir daqiqada ro'yxatdan o'ting</p>
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
                <label className="auth2-label">Ism familiya</label>
                <div className="auth2-input-wrap">
                  <svg className="auth2-input-icon" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                  <input className="auth2-input" placeholder="Ism Familiya"
                    value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required autoComplete="name" />
                </div>
              </div>

              <div className="auth2-field">
                <label className="auth2-label">Telefon raqam</label>
                <div className="auth2-input-wrap">
                  <svg className="auth2-input-icon" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.63 19.79 19.79 0 01.08 2.18 2 2 0 012.07 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.18 7.82a16 16 0 006 6l1.18-1.18a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92z"/>
                  </svg>
                  <input className="auth2-input" placeholder="+998 90 123 45 67"
                    value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    required autoComplete="tel" />
                </div>
              </div>

              <div className="auth2-field">
                <label className="auth2-label">Parol</label>
                <div className="auth2-input-wrap">
                  <svg className="auth2-input-icon" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                  </svg>
                  <input className="auth2-input" placeholder="Kamida 6 ta belgi"
                    type={showPass ? 'text' : 'password'}
                    value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required autoComplete="new-password" minLength={6} />
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

              {/* Role hidden input — controlled from brand panel */}
              <input type="hidden" value={form.role} readOnly />
              <div className="auth2-role-hint">
                Tanlangan rol: <strong>{form.role === 'OWNER' ? '🏢 Egasi' : '👤 Foydalanuvchi'}</strong>
                <span className="auth2-role-change" onClick={() => setForm({ ...form, role: form.role === 'USER' ? 'OWNER' : 'USER' })}>
                  — O'zgartirish
                </span>
              </div>

              <button className="auth2-submit-btn" type="submit" disabled={loading}>
                {loading ? (
                  <><span className="auth2-spinner"/>Ro'yxatdan o'tilmoqda...</>
                ) : (
                  <><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
                  </svg>Ro'yxatdan o'tish</>
                )}
              </button>
            </form>

            <p className="auth2-footer">
              Akkauntingiz bormi?{' '}
              <Link to="/login" className="auth2-link">Kirish →</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
