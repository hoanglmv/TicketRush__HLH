import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Ticket } from 'lucide-react';
import { eventApi } from '../api';
import { EventResponse } from '../types';
import SkeletonEventCard from '../components/SkeletonEventCard';

export default function HomePage() {
  const [events, setEvents] = useState<EventResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    eventApi.list().then(res => {
      setEvents(res.data.data || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  }) : '';

  // Featured event is just the first ON_SALE event with a banner, or the first event.
  const featuredEvent = useMemo(() => {
    return events.find(e => e.status === 'ON_SALE' && e.bannerUrl) || events[0] || null;
  }, [events]);

  return (
    <>
      <section className="hero" style={{ position: 'relative', overflow: 'hidden', padding: '120px 0 100px 0' }}>
        {/* Animated background glow */}
        <div style={{ position: 'absolute', top: '-20%', left: '10%', width: '50%', height: '50%', background: 'var(--accent-primary)', filter: 'blur(150px)', opacity: 0.15, zIndex: 0 }} />
        <div style={{ position: 'absolute', bottom: '-20%', right: '10%', width: '50%', height: '50%', background: 'var(--accent-secondary)', filter: 'blur(150px)', opacity: 0.15, zIndex: 0 }} />
        
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}
          >
            <h1 style={{ fontSize: '4.5rem', lineHeight: 1.1, marginBottom: '24px' }}>
              Trải nghiệm <span style={{ background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Đỉnh Cao</span>
            </h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '40px' }}>
              TicketRush mang đến cho bạn nền tảng săn vé sự kiện siêu tốc với sơ đồ 3D tương tác và hệ thống chống sập hàng đầu.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <Link to="/events" className="btn btn-primary btn-lg" style={{ padding: '16px 32px', fontSize: '1.1rem', borderRadius: '30px' }}>
                <Ticket className="w-5 h-5" /> Khám phá sự kiện
              </Link>
            </div>
          </motion.div>

          {/* Featured Event Glass Card */}
          {featuredEvent && (
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              style={{ marginTop: '60px' }}
            >
              <Link to={`/events/${featuredEvent.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="glass-panel" style={{ display: 'flex', gap: '24px', padding: '24px', alignItems: 'center', transition: 'transform 0.3s', cursor: 'pointer' }}
                     onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                     onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                  <div style={{ width: '40%', height: '240px', borderRadius: 'var(--radius-md)', background: featuredEvent.bannerUrl ? `url(${featuredEvent.bannerUrl}) center/cover` : 'var(--accent-gradient)' }} />
                  <div style={{ flex: 1 }}>
                    <span className="badge badge-primary" style={{ marginBottom: '12px' }}>🔥 Sự kiện nổi bật</span>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '16px' }}>{featuredEvent.name}</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '1.1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {featuredEvent.description || 'Tham gia ngay sự kiện giải trí hấp dẫn nhất năm cùng TicketRush!'}
                    </p>
                    <div className="flex gap-lg" style={{ color: 'var(--text-muted)' }}>
                      <div className="flex-center gap-sm"><Calendar size={18}/> {formatDate(featuredEvent.eventDate)}</div>
                      <div className="flex-center gap-sm"><MapPin size={18}/> {featuredEvent.venue || 'Đang cập nhật'}</div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      <section className="page">
        <div className="container">
          <div className="page-header flex-between">
            <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>Sự kiện sắp diễn ra</h2>
            <Link to="/events" style={{ fontWeight: 600 }}>Xem tất cả →</Link>
          </div>

          <div className="grid-3">
            <AnimatePresence mode="popLayout">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonEventCard key={`skeleton-${i}`} />
                ))
              ) : events.length === 0 ? (
                <div className="empty-state" style={{ gridColumn: 'span 3' }}>
                  <p>Chưa có sự kiện nào. Hãy quay lại sau!</p>
                </div>
              ) : (
                events.slice(0, 6).map((event, i) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link to={`/events/${event.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <div className="event-card">
                        <div className="event-card-banner" style={{
                          background: event.bannerUrl
                            ? `url(${event.bannerUrl}) center/cover`
                            : 'linear-gradient(135deg, #6366f1, #ec4899)'
                        }} />
                        <div className="event-card-body">
                          <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>{event.name}</h3>
                          <div className="event-card-meta">
                            <span className="flex gap-sm align-center"><Calendar size={14}/> {formatDate(event.eventDate)}</span>
                            <span className="flex gap-sm align-center"><MapPin size={14}/> {event.venue || 'TBA'}</span>
                          </div>
                          <div className="event-card-footer">
                            <span className={`badge ${event.status === 'ON_SALE' ? 'badge-success' : 'badge-info'}`}>
                              {event.status === 'ON_SALE' ? '🔥 Mở bán' : 'Sắp diễn ra'}
                            </span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                              {event.availableSeats}/{event.totalSeats} ghế
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </>
  );
}
