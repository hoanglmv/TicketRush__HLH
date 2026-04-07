import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api';
import { EventResponse } from '../../types';

export default function AdminEventListPage() {
  const [events, setEvents] = useState<EventResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.events()
      .then(res => setEvents(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statusColor: Record<string, string> = {
    DRAFT: 'badge-warning', PUBLISHED: 'badge-info', ON_SALE: 'badge-success',
    COMPLETED: 'badge-primary', CANCELLED: 'badge-danger'
  };

  const handleStatusChange = async (eventId: number, status: string) => {
    try {
      await adminApi.updateStatus(eventId, status);
      const res = await adminApi.events();
      setEvents(res.data.data || []);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  if (loading) return <div className="page"><div className="container"><div className="loading-container"><div className="spinner" /></div></div></div>;

  return (
    <div className="page">
      <div className="container animate-fadeIn">
        <div className="page-header flex-between">
          <div>
            <h1>Quản lý sự kiện</h1>
            <p>Tạo và quản lý tất cả sự kiện</p>
          </div>
          <Link to="/admin/events/create" className="btn btn-primary">➕ Tạo sự kiện mới</Link>
        </div>

        {events.length === 0 ? (
          <div className="empty-state"><p>Chưa có sự kiện nào.</p></div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {events.map(event => (
              <div key={event.id} className="card" style={{ cursor: 'default' }}>
                <div className="card-body flex-between">
                  <div style={{ flex: 1 }}>
                    <div className="flex gap-sm" style={{ alignItems: 'center', marginBottom: 6 }}>
                      <h3 style={{ fontWeight: 700 }}>{event.name}</h3>
                      <span className={`badge ${statusColor[event.status] || 'badge-info'}`}>
                        {event.status}
                      </span>
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      📍 {event.venue || 'TBA'} &nbsp;|&nbsp; 📅 {event.eventDate ? new Date(event.eventDate).toLocaleDateString('vi-VN') : '—'}
                      &nbsp;|&nbsp; 💺 {event.soldSeats}/{event.totalSeats} sold
                    </div>
                  </div>
                  <div className="flex gap-sm">
                    <Link to={`/admin/events/${event.id}`} className="btn btn-secondary btn-sm">
                      📊 Chi tiết
                    </Link>
                    {event.status === 'DRAFT' && (
                      <button className="btn btn-primary btn-sm" onClick={() => handleStatusChange(event.id, 'PUBLISHED')}>
                        Publish
                      </button>
                    )}
                    {event.status === 'PUBLISHED' && (
                      <button className="btn btn-success btn-sm" onClick={() => handleStatusChange(event.id, 'ON_SALE')}>
                        Open Sale
                      </button>
                    )}
                    {event.status === 'ON_SALE' && (
                      <button className="btn btn-secondary btn-sm" onClick={() => handleStatusChange(event.id, 'COMPLETED')}>
                        Complete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
