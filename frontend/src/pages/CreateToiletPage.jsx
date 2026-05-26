import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { request } from '../lib/api';

const emptyForm = {
  name: '',
  lat: '41.3111',
  lng: '69.2797',
  price: '',
  status: 'OPEN',
  type: 'PUBLIC',
  images: ''
};

export default function CreateToiletPage() {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
      const response = await request('/toilets', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      navigate(`/toilets/${response.data.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="form-page">
      <div className="form-page-card">
        <div className="form-page-header">
          <div className="form-page-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </div>
          <div>
            <h1 className="form-page-title">Yangi joy qo'shish</h1>
            <p className="form-page-subtitle">Hojatxona ma'lumotlarini kiriting</p>
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
            <input className="profile-form-input" placeholder="2000 (0 = bepul)"
              value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
          </div>

          <div className="form-grid-2">
            <div className="profile-form-group">
              <label className="profile-form-label">Holati</label>
              <select className="profile-form-input" value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="OPEN">Ochiq (OPEN)</option>
                <option value="CLOSED">Yopilgan (CLOSED)</option>
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
            <button className="profile-cancel-btn" type="button" onClick={() => navigate('/')}>Bekor qilish</button>
            <button className="profile-save-btn" type="submit" disabled={loading}>
              {loading ? <><span className="cta-spinner" style={{borderColor:'rgba(255,255,255,0.3)',borderTopColor:'white'}}/>Saqlanmoqda...</> : 'Saqlash'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
