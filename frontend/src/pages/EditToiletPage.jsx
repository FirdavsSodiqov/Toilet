import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { request } from '../lib/api';

export default function EditToiletPage() {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function loadData() {
    try {
      const response = await request(`/toilets/${id}`);
      const data = response.data;
      setForm({
        name: data.name,
        lat: String(data.lat),
        lng: String(data.lng),
        price: String(data.price),
        status: data.status,
        type: data.type,
        images: (data.images || []).join(', ')
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      ...form,
      images: form.images
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    };

    try {
      await request(`/toilets/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      });
      navigate(`/toilets/${id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading && !form) return (
    <div className="form-page">
      <div className="form-page-card" style={{alignItems:'center',gap:'16px',padding:'60px 24px'}}>
        <div className="cta-spinner" style={{width:'36px',height:'36px',borderWidth:'3px',borderColor:'var(--border-subtle)',borderTopColor:'var(--brand-primary)'}} />
        <p style={{fontSize:'13px',color:'var(--text-tertiary)',fontWeight:600}}>Ma'lumotlar yuklanmoqda...</p>
      </div>
    </div>
  );

  return (
    <div className="form-page">
      <div className="form-page-card">
        <div className="form-page-header">
          <div className="form-page-icon" style={{background:'linear-gradient(135deg,#f59e0b,#d97706)'}}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </div>
          <div>
            <h1 className="form-page-title">Joyni tahrirlash</h1>
            <p className="form-page-subtitle">Ma'lumotlarni yangilang</p>
          </div>
        </div>

        {error && (
          <div className="auth-error" style={{marginBottom:'16px'}}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </div>
        )}

        {form && (
          <form className="profile-form" onSubmit={handleSubmit}>
            <div className="profile-form-group">
              <label className="profile-form-label">Nomi</label>
              <input className="profile-form-input" placeholder="Masalan: Markaziy Park Hojatxonasi"
                value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>

            <div className="form-grid-2">
              <div className="profile-form-group">
                <label className="profile-form-label">Kenglik (Latitude)</label>
                <input className="profile-form-input" placeholder="41.3111"
                  value={form.lat} onChange={(e) => setForm({ ...form, lat: e.target.value })} required />
              </div>
              <div className="profile-form-group">
                <label className="profile-form-label">Uzunlik (Longitude)</label>
                <input className="profile-form-input" placeholder="69.2797"
                  value={form.lng} onChange={(e) => setForm({ ...form, lng: e.target.value })} required />
              </div>
            </div>

            <div className="profile-form-group">
              <label className="profile-form-label">Narxi (UZS)</label>
              <input className="profile-form-input" placeholder="2000"
                value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            </div>

            <div className="form-grid-2">
              <div className="profile-form-group">
                <label className="profile-form-label">Holati</label>
                <select className="profile-form-input" value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option value="OPEN">Ochiq</option>
                  <option value="CLOSED">Yopilgan</option>
                </select>
              </div>
              <div className="profile-form-group">
                <label className="profile-form-label">Turi</label>
                <select className="profile-form-input" value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  <option value="PUBLIC">Ommaviy</option>
                  <option value="PRIVATE">Xususiy</option>
                  <option value="PAID">To'lovli</option>
                  <option value="FREE">Bepul</option>
                </select>
              </div>
            </div>

            <div className="profile-form-group">
              <label className="profile-form-label">Rasmlar (URL, vergul bilan)</label>
              <textarea className="profile-form-input profile-form-textarea"
                placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
                value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} rows={3} />
            </div>

            <div className="profile-form-actions" style={{justifyContent:'space-between'}}>
              <button className="profile-cancel-btn" type="button" onClick={() => navigate(`/toilets/${id}`)}>Bekor qilish</button>
              <button className="profile-save-btn" type="submit" disabled={loading}>
                {loading ? <><span className="cta-spinner" style={{borderColor:'rgba(255,255,255,0.3)',borderTopColor:'white'}}/>Saqlanmoqda...</> : "O'zgarishlarni saqlash"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
