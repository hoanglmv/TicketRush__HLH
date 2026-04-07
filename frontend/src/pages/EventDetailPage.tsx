import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventApi } from '../api';
import { EventResponse } from '../types';
import { useAuth } from '../contexts/AuthContext';

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      eventApi.get(Number(id)).then(res => setEvent(res.data.data))
        .catch(() => {}).finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <div className="page"><div className="container"><div className="loading-container"><div className="spinner" /></div></div></div>;
  if (!event) return <div className="page"><div className="container"><div className="empty-state">Event not found</div></div></div>;

  const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('vi-VN', {
    weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
  }) : '';

  const handleBuyTicket = () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    if (event.queueEnabled && event.status === 'ON_SALE') {
      navigate(`/events/${event.id}/queue`);
    } else {
      navigate(`/events/${event.id}/seats`);
    }
  };

  return (
    <div className="page">
      <div className="container animate-fadeIn">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 30 }}>
          <div>
            <div style={{
              width: '100%', height: 320, borderRadius: 'var(--radius-lg)',
              background: event.bannerUrl ? `url(${event.bannerUrl}) center/cover` : 'linear-gradient(135deg, #6366f1, #ec4899)',
              marginBottom: 24
            }} />
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 16 }}>{event.name}</h1>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
              {event.description || 'No description available.'}
            </p>
          </div>

          <div>
            <div className="glass-card" style={{ position: 'sticky', top: 88 }}>
              <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Thông tin sự kiện</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                <div className="flex-between">
                  <span style={{ color: 'var(--text-muted)' }}>📅 Thời gian</span>
                  <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>{formatDate(event.eventDate)}</span>
                </div>
                <div className="flex-between">
                  <span style={{ color: 'var(--text-muted)' }}>📍 Địa điểm</span>
                  <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>{event.venue || 'TBA'}</span>
                </div>
                <div className="flex-between">
                  <span style={{ color: 'var(--text-muted)' }}>💺 Ghế trống</span>
                  <span style={{ fontWeight: 500 }}>{event.availableSeats} / {event.totalSeats}</span>
                </div>
                <div className="flex-between">
                  <span style={{ color: 'var(--text-muted)' }}>📊 Trạng thái</span>
                  <span className={`badge ${event.status === 'ON_SALE' ? 'badge-success' : event.status === 'PUBLISHED' ? 'badge-info' : 'badge-warning'}`}>
                    {event.status}
                  </span>
                </div>
              </div>

              <hr className="divider" />

              {event.zones && event.zones.length > 0 && (
                <>
                  <h4 style={{ fontWeight: 600, marginBottom: 12 }}>Khu vực & Giá vé</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                    {event.zones.map(z => (
                      <div key={z.id} className="flex-between" style={{
                        padding: '8px 12px', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)',
                        borderLeft: `3px solid ${z.color}`
                      }}>
                        <span style={{ fontWeight: 500 }}>{z.name}</span>
                        <span style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>
                          {z.price.toLocaleString('vi-VN')}₫
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {event.status === 'ON_SALE' ? (
                <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={handleBuyTicket}>
                  🎫 Mua vé ngay
                </button>
              ) : (
                <button className="btn btn-secondary btn-lg" style={{ width: '100%' }} disabled>
                  {event.status === 'PUBLISHED' ? 'Chưa mở bán' : event.status}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
