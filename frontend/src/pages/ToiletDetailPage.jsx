import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { request } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

const QUICK_OPTS = ['Toza', 'Arzon', 'Qulay', 'Navbat bor', 'Sovun bor'];
const STATUS_CFG = {
  OPEN:    { label: 'Ochiq',      color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
  CLOSED:  { label: 'Yopilgan',   color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
  LIMITED: { label: 'Cheklangan', color: '#eab308', bg: 'rgba(234,179,8,0.12)' },
};
const TYPE_LABELS = { PUBLIC: '🚻 Ommaviy', PREMIUM: '⭐ Premium', PAID: "💳 To'lovli", PRIVATE: '🔒 Xususiy' };

export default function ToiletDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { chatMessages, sendMessage } = useSocket();

  const [toilet, setToilet]     = useState(null);
  const [reviews, setReviews]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [pageError, setPageError] = useState('');
  const [activeImg, setActiveImg] = useState(0);
  const [reviewForm, setReviewForm] = useState({ rating: '5', comment: '', quick_feedback: [] });
  const [reviewLoading, setReviewLoading] = useState(false);
  const [chatText, setChatText] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => { loadData(); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  async function loadData() {
    try {
      setLoading(true);
      setPageError('');
      const [toiletRes, reviewsRes] = await Promise.all([
        request(`/toilets/${id}`),
        request(`/reviews/toilet/${id}`)
      ]);
      setToilet(toiletRes.data);
      setReviews(reviewsRes.data || []);
      setActiveImg(0);
    } catch (err) {
      setPageError(err.message || 'Yuklanishda xatolik');
    } finally {
      setLoading(false);
    }
  }

  const images = useMemo(() => {
    if (!toilet) return [];
    if (Array.isArray(toilet.images)) return toilet.images.filter(Boolean);
    try { return JSON.parse(toilet.images) || []; } catch { return []; }
  }, [toilet]);

  const statusCfg = STATUS_CFG[toilet?.status] || STATUS_CFG.OPEN;

  async function handleReviewSubmit(e) {
    e.preventDefault();
    setReviewLoading(true);
    try {
      await request('/reviews', {
        method: 'POST',
        body: JSON.stringify({
          toiletId: Number(id),
          rating: Number(reviewForm.rating),
          comment: reviewForm.comment,
          quick_feedback: reviewForm.quick_feedback
        })
      });
      setReviewForm({ rating: '5', comment: '', quick_feedback: [] });
      loadData();
    } catch (err) {
      setPageError(err.message);
    } finally {
      setReviewLoading(false);
    }
  }

  function toggleQuickFeedback(val) {
    setReviewForm(prev => ({
      ...prev,
      quick_feedback: prev.quick_feedback.includes(val)
        ? prev.quick_feedback.filter(i => i !== val)
        : [...prev.quick_feedback, val]
    }));
  }

  function handleSendChat(e) {
    e.preventDefault();
    if (!chatText.trim() || !toilet) return;
    sendMessage(toilet.ownerId, chatText.trim());
    setChatText('');
  }

  async function handleDelete() {
    try {
      await request(`/toilets/${id}`, { method: 'DELETE' });
      navigate('/');
    } catch (err) {
      setPageError(err.message);
      setDeleteConfirm(false);
    }
  }

  const googleNav = toilet ? `https://www.google.com/maps/dir/?api=1&destination=${toilet.lat},${toilet.lng}` : '#';
  const yandexNav = toilet ? `https://yandex.com/maps/?rtext=~${toilet.lat},${toilet.lng}&rtt=auto` : '#';

  /* ── Loading ── */
  if (loading) return (
    <div className="dp-loading">
      <div className="dp-spinner" />
      <p>Yuklanmoqda...</p>
    </div>
  );

  /* ── Not found ── */
  if (!toilet) return (
    <div className="dp-loading">
      <div style={{fontSize:'48px'}}>🚽</div>
      <p style={{color:'var(--text-secondary)',marginTop:'12px'}}>Joy topilmadi</p>
      <button className="dp-back-btn" onClick={() => navigate('/')}>← Orqaga</button>
    </div>
  );

  return (
    <div className="dp-page">
      {/* ── Back button ── */}
      <button className="dp-back-btn" onClick={() => navigate(-1)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        Orqaga
      </button>

      {pageError && (
        <div className="dp-error">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {pageError}
          <button onClick={() => setPageError('')} style={{marginLeft:'auto',background:'none',border:'none',cursor:'pointer',fontSize:'16px'}}>×</button>
        </div>
      )}

      <div className="dp-layout">
        {/* ══ LEFT ══ */}
        <div className="dp-main">

          {/* ── Image gallery ── */}
          <div className="dp-gallery">
            <div className="dp-gallery-main">
              {images.length > 0 ? (
                <img src={images[activeImg]} alt={toilet.name} className="dp-gallery-img" />
              ) : (
                <div className="dp-gallery-placeholder">
                  <span style={{fontSize:'56px'}}>�</span>
                  <span style={{fontSize:'13px',color:'rgba(255,255,255,0.7)',marginTop:'8px'}}>Rasm yo'q</span>
                </div>
              )}
              {/* Status badge */}
              <div className="dp-status-pill" style={{background: statusCfg.bg, color: statusCfg.color, borderColor: statusCfg.color}}>
                <span className="dp-status-dot" style={{background: statusCfg.color}} />
                {statusCfg.label}
              </div>
              {/* Nav buttons on image */}
              <div className="dp-nav-btns">
                <a href={googleNav} target="_blank" rel="noopener noreferrer" className="dp-nav-btn dp-nav-btn--g">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
                  Google
                </a>
                <a href={yandexNav} target="_blank" rel="noopener noreferrer" className="dp-nav-btn dp-nav-btn--y">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
                  Yandex
                </a>
              </div>
            </div>
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="dp-thumbs">
                {images.map((img, i) => (
                  <button key={i} className={`dp-thumb ${i === activeImg ? 'active' : ''}`} onClick={() => setActiveImg(i)}>
                    <img src={img} alt={`thumb-${i}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Info card ── */}
          <div className="dp-card">
            <div className="dp-info-header">
              <div>
                <h1 className="dp-title">{toilet.name}</h1>
                <p className="dp-coords">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  {toilet.lat.toFixed(4)}, {toilet.lng.toFixed(4)}
                </p>
              </div>
              <div className="dp-price-badge">
                {toilet.price > 0 ? `${toilet.price.toLocaleString()} UZS` : '🆓 Bepul'}
              </div>
            </div>

            {/* Stats row */}
            <div className="dp-stats">
              <div className="dp-stat">
                <span className="dp-stat-val">{(toilet.avg_rating || 0).toFixed(1)} ⭐</span>
                <span className="dp-stat-lbl">Reyting</span>
              </div>
              <div className="dp-stat-sep" />
              <div className="dp-stat">
                <span className="dp-stat-val">{TYPE_LABELS[toilet.type] || toilet.type}</span>
                <span className="dp-stat-lbl">Turi</span>
              </div>
              <div className="dp-stat-sep" />
              <div className="dp-stat">
                <span className="dp-stat-val">{reviews.length}</span>
                <span className="dp-stat-lbl">Fikrlar</span>
              </div>
              <div className="dp-stat-sep" />
              <div className="dp-stat">
                <span className="dp-stat-val">{toilet.owner?.name || '—'}</span>
                <span className="dp-stat-lbl">Egasi</span>
              </div>
            </div>

            {/* Owner actions */}
            {user?.id === toilet.ownerId && (
              <div className="dp-owner-actions">
                <button className="dp-btn dp-btn--edit" onClick={() => navigate(`/toilets/${id}/edit`)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  Tahrirlash
                </button>
                {!deleteConfirm ? (
                  <button className="dp-btn dp-btn--del" onClick={() => setDeleteConfirm(true)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                    </svg>
                    O'chirish
                  </button>
                ) : (
                  <div className="dp-confirm-row">
                    <span style={{fontSize:'13px',color:'var(--text-secondary)'}}>Ishonchingiz komilmi?</span>
                    <button className="dp-btn dp-btn--del" onClick={handleDelete}>Ha, o'chirish</button>
                    <button className="dp-btn dp-btn--edit" onClick={() => setDeleteConfirm(false)}>Bekor</button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Reviews ── */}
          <div className="dp-card">
            <h2 className="dp-section-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
              </svg>
              Fikrlar
              <span className="dp-count-pill">{reviews.length}</span>
            </h2>

            {/* Write review — only USER role */}
            {user?.role === 'USER' && (
              <form className="dp-review-form" onSubmit={handleReviewSubmit}>
                <p className="dp-review-form-label">Fikringizni qoldiring</p>
                <div className="dp-stars-row">
                  {[1,2,3,4,5].map(n => (
                    <button key={n} type="button"
                      className={`dp-star ${Number(reviewForm.rating) >= n ? 'active' : ''}`}
                      onClick={() => setReviewForm(f => ({...f, rating: String(n)}))}>
                      ★
                    </button>
                  ))}
                </div>
                <textarea className="dp-textarea"
                  placeholder="Sizga yoqdimi? Qanday xizmat ko'rsatildi?"
                  value={reviewForm.comment}
                  onChange={e => setReviewForm(f => ({...f, comment: e.target.value}))}
                  rows={3} />
                <div className="dp-quick-tags">
                  {QUICK_OPTS.map(opt => (
                    <button key={opt} type="button"
                      className={`dp-quick-tag ${reviewForm.quick_feedback.includes(opt) ? 'active' : ''}`}
                      onClick={() => toggleQuickFeedback(opt)}>
                      {opt}
                    </button>
                  ))}
                </div>
                <button className="dp-submit-btn" type="submit" disabled={reviewLoading}>
                  {reviewLoading ? 'Yuborilmoqda...' : 'Yuborish'}
                </button>
              </form>
            )}

            {/* Review list */}
            <div className="dp-review-list">
              {reviews.length === 0 && (
                <div className="dp-empty">
                  <span style={{fontSize:'32px'}}>💬</span>
                  <p>Hali fikrlar yo'q</p>
                </div>
              )}
              {reviews.map(r => (
                <div key={r.id} className="dp-review-item">
                  <div className="dp-review-avatar">{(r.user?.name || 'U')[0].toUpperCase()}</div>
                  <div className="dp-review-body">
                    <div className="dp-review-meta">
                      <span className="dp-review-author">{r.user?.name || "Noma'lum"}</span>
                      <span className="dp-review-stars">
                        {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                      </span>
                    </div>
                    {r.comment && <p className="dp-review-text">{r.comment}</p>}
                    {r.quick_feedback?.length > 0 && (
                      <div className="dp-quick-tags" style={{marginTop:'6px'}}>
                        {r.quick_feedback.map(f => <span key={f} className="dp-quick-tag active">{f}</span>)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══ RIGHT: Chat ══ */}
        <div className="dp-sidebar">
          {/* Sticky nav card */}
          <div className="dp-card dp-nav-card">
            <h3 className="dp-section-title" style={{marginBottom:'12px'}}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
              </svg>
              Yo'nalish
            </h3>
            <div style={{display:'flex',gap:'10px',flexWrap:'wrap'}}>
              <a href={googleNav} target="_blank" rel="noopener noreferrer" className="dp-btn dp-btn--edit" style={{flex:1,justifyContent:'center'}}>
                Google Maps
              </a>
              <a href={yandexNav} target="_blank" rel="noopener noreferrer" className="dp-btn" style={{flex:1,justifyContent:'center',background:'rgba(252,67,0,0.1)',color:'#fc4300',border:'none'}}>
                Yandex Maps
              </a>
            </div>
          </div>

          {/* Chat card */}
          <div className="dp-card dp-chat-card">
            <div className="dp-chat-header">
              <div className="dp-online-dot" />
              <span className="dp-section-title" style={{fontSize:'14px'}}>Ega bilan bog'lanish</span>
            </div>

            <div className="dp-chat-messages">
              {!user ? (
                <div className="dp-empty" style={{padding:'24px 16px'}}>
                  <span style={{fontSize:'32px'}}>🔒</span>
                  <p style={{marginBottom:'12px'}}>Chatlashish uchun kiring</p>
                  <button className="dp-submit-btn" onClick={() => navigate('/login')}>Kirish</button>
                </div>
              ) : (
                <>
                  {chatMessages.filter(m => m.senderId === toilet.ownerId || m.receiverId === toilet.ownerId).length === 0 && (
                    <p className="dp-chat-empty">Muloqotni boshlang...</p>
                  )}
                  {chatMessages
                    .filter(m => m.senderId === toilet.ownerId || m.receiverId === toilet.ownerId)
                    .map((m, i) => (
                      <div key={i} className={`dp-bubble-wrap ${m.senderId === user.id ? 'mine' : 'theirs'}`}>
                        <div className={`dp-bubble ${m.senderId === user.id ? 'mine' : 'theirs'}`}>{m.text}</div>
                        <div className="dp-bubble-time">
                          {new Date(m.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    ))}
                </>
              )}
            </div>

            <form className="dp-chat-input-row" onSubmit={handleSendChat}>
              <input className="dp-chat-input" placeholder="Xabar yozing..."
                value={chatText} onChange={e => setChatText(e.target.value)} disabled={!user} />
              <button className="dp-chat-send" type="submit" disabled={!user || !chatText.trim()}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
