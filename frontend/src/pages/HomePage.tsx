import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { eventApi } from '../api';
import { EventResponse } from '../types';

export default function HomePage() {
  const [events, setEvents] = useState<EventResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    eventApi.list().then(res => {
      setEvents(res.data.data || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
  }) : '';

  return (
    <>
      <section className="hero">
        <div className="container animate-fadeIn">
          <h1>TicketRush</h1>
          <p>Nền tảng đặt vé trực tuyến hàng đầu cho các sự kiện âm nhạc và giải trí. Trải nghiệm chọn ghế real-time, thanh toán nhanh chóng.</p>
          <Link to="/events" className="btn btn-primary btn-lg">Khám phá sự kiện →</Link>
        </div>
      </section>

      <section className="page">
        <div className="container">
          <div className="page-header">
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Sự kiện nổi bật</h2>
          </div>
          {loading ? (
            <div className="loading-container"><div className="spinner" /><p>Loading events...</p></div>
          ) : events.length === 0 ? (
            <div className="empty-state">
              <p>Chưa có sự kiện nào. Hãy quay lại sau!</p>
            </div>
          ) : (
            <div className="grid-3">
              {events.slice(0, 6).map(event => (
                <Link to={`/events/${event.id}`} key={event.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="event-card animate-fadeIn">
                    <div className="event-card-banner" style={{
                      background: event.bannerUrl
                        ? `url(${event.bannerUrl}) center/cover`
                        : 'linear-gradient(135deg, #6366f1, #ec4899)'
                    }} />
                    <div className="event-card-body">
                      <h3>{event.name}</h3>
                      <div className="event-card-meta">
                        <span>📅 {formatDate(event.eventDate)}</span>
                        <span>📍 {event.venue || 'TBA'}</span>
                      </div>
                      <div className="event-card-footer">
                        <span className={`badge ${event.status === 'ON_SALE' ? 'badge-success' : 'badge-info'}`}>
                          {event.status === 'ON_SALE' ? '🔥 Đang mở bán' : 'Sắp diễn ra'}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {event.availableSeats}/{event.totalSeats} ghế trống
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
