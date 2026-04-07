import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { eventApi } from '../api';
import { EventResponse } from '../types';

export default function EventListPage() {
  const [events, setEvents] = useState<EventResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    eventApi.list().then(res => setEvents(res.data.data || []))
      .catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (search.trim()) {
        const res = await eventApi.search(search);
        setEvents(res.data.data || []);
      } else {
        const res = await eventApi.list();
        setEvents(res.data.data || []);
      }
    } catch { } finally { setLoading(false); }
  };

  const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
  }) : '';

  return (
    <div className="page">
      <div className="container animate-fadeIn">
        <div className="page-header">
          <h1>Sự kiện</h1>
          <p>Khám phá và đặt vé cho sự kiện yêu thích</p>
        </div>

        <form onSubmit={handleSearch} style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <input className="form-input" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Tìm kiếm sự kiện..." style={{ flex: 1 }} />
            <button className="btn btn-primary" type="submit">🔍 Tìm</button>
          </div>
        </form>

        {loading ? (
          <div className="loading-container"><div className="spinner" /><p>Loading...</p></div>
        ) : events.length === 0 ? (
          <div className="empty-state">
            <p style={{ fontSize: '3rem', marginBottom: 12 }}>🎪</p>
            <p>Không tìm thấy sự kiện nào.</p>
          </div>
        ) : (
          <div className="grid-3">
            {events.map(event => (
              <Link to={`/events/${event.id}`} key={event.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="event-card">
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
                        {event.status === 'ON_SALE' ? '🔥 Đang bán' : event.status}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {event.availableSeats}/{event.totalSeats} ghế
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
