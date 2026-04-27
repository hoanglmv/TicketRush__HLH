import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Info, ChevronRight, Share2, Heart, Armchair } from 'lucide-react';
import { eventApi, wishlistApi } from '../api';
import { EventResponse } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../i18n';

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { t, locale } = useLanguage();

  // Social Proof Simulation
  const liveViewers = useMemo(() => Math.floor(Math.random() * (150 - 30 + 1) + 30), []);

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [timeUntilSale, setTimeUntilSale] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      eventApi.get(Number(id)).then(res => setEvent(res.data.data))
        .catch(() => {}).finally(() => setLoading(false));
    }
  }, [id]);

  useEffect(() => {
    if (isAuthenticated && event) {
      wishlistApi.checkStatus(event.id)
        .then(res => setIsWishlisted(res.data.data))
        .catch(() => {});
    }
  }, [isAuthenticated, event]);

  useEffect(() => {
    if (!event || !event.saleStartTime) return;
    const saleStart = new Date(event.saleStartTime).getTime();
    
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = saleStart - now;
      if (distance <= 0) {
        setTimeUntilSale(null);
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeUntilSale(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [event]);

  if (loading) return (
    <div className="page" style={{ paddingTop: '100px' }}>
       <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
          <div className="spinner" style={{ width: 40, height: 40, animation: 'spin 1s linear infinite' }} />
       </div>
    </div>
  );
  
  if (!event) return <div className="page"><div className="container"><div className="empty-state">{t('eventDetail.eventNotFound')}</div></div></div>;

  const formatDate = (d: string) => d ? new Date(d).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US', {
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

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    if (!event || wishlistLoading) return;
    setWishlistLoading(true);
    try {
      if (isWishlisted) {
        await wishlistApi.remove(event.id);
        setIsWishlisted(false);
      } else {
        await wishlistApi.add(event.id);
        setIsWishlisted(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setWishlistLoading(false);
    }
  };

  const isNearingSoldOut = event.totalSeats > 0 && ((event.availableSeats / event.totalSeats) < 0.1);
  const isPast = event.eventDate && new Date(event.eventDate).getTime() < Date.now();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="page"
      style={{ paddingTop: '80px', paddingBottom: '100px' }}
    >
      <div className="container">
        {/* Breadcrumb like header */}
        <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          <span style={{ cursor: 'pointer' }} onClick={() => navigate('/events')}>{t('eventDetail.events')}</span>
          <ChevronRight size={14} />
          <span style={{ color: 'var(--text-primary)' }}>{event.name}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '40px' }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Main Banner */}
            <div style={{
              width: '100%', height: 400, borderRadius: 'var(--radius-lg)',
              background: event.bannerUrl ? `url(${event.bannerUrl}) center/cover` : 'linear-gradient(135deg, #6366f1, #ec4899)',
              marginBottom: 32,
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
              position: 'relative'
            }}>
              {/* Category Tag Overlay */}
              <div style={{ position: 'absolute', top: 20, left: 20, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', padding: '6px 16px', borderRadius: '20px', fontWeight: 600, fontSize: '0.85rem' }}>
                {t('eventDetail.featured')}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.2, flex: 1 }}>{event.name}</h1>
              <div style={{ display: 'flex', gap: '12px' }}>
                 <button className="btn btn-secondary" style={{ padding: '10px', borderRadius: '50%' }}><Share2 size={20} /></button>
                 <button 
                   className="btn btn-secondary" 
                   style={{ padding: '10px', borderRadius: '50%', color: isWishlisted ? '#ef4444' : 'inherit' }}
                   onClick={handleToggleWishlist}
                   disabled={wishlistLoading}
                 >
                   <Heart size={20} fill={isWishlisted ? '#ef4444' : 'none'} />
                 </button>
              </div>
            </div>

            {/* Social Proof Banner */}
            {event.status === 'ON_SALE' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '12px 16px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px', color: '#fca5a5' }}
              >
                <Users size={20} className="animate-pulse" />
                <span style={{ fontWeight: 500 }}>{t('eventDetail.currentlyViewing')} <b style={{ color: 'white' }}>{liveViewers}</b> {t('eventDetail.viewingNow')}</span>
              </motion.div>
            )}

            <div style={{ padding: '32px', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}><Info size={24} color="var(--accent-primary)" /> {t('eventDetail.aboutEvent')}</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1.05rem', whiteSpace: 'pre-wrap' }}>
                {event.description || t('eventDetail.noDescription')}
              </p>
            </div>
          </motion.div>

          {/* Right Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="glass-panel" style={{ position: 'sticky', top: 100, padding: '32px' }}>
              <h3 style={{ fontWeight: 800, fontSize: '1.5rem', marginBottom: 24 }}>{t('eventDetail.bookingInfo')}</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 32 }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8' }}>
                    <Calendar size={22} />
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '4px' }}>{t('eventDetail.dateTime')}</div>
                    <div style={{ fontWeight: 600, fontSize: '1.05rem' }}>{formatDate(event.eventDate)}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(236, 72, 153, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f472b6' }}>
                    <MapPin size={22} />
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '4px' }}>{t('eventDetail.venue')}</div>
                    <div style={{ fontWeight: 600, fontSize: '1.05rem' }}>{event.venue || t('eventDetail.venueUpdating')}</div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(34, 197, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4ade80' }}>
                    <Armchair size={22} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
                      <span>{t('eventDetail.availableSeats')}</span>
                      {isNearingSoldOut && <span style={{ color: 'var(--danger)', fontWeight: 600 }}>{t('eventDetail.nearingSoldOut')}</span>}
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '1.05rem' }}>{event.availableSeats} / {event.totalSeats}</div>
                  </div>
                </div>
              </div>

              <hr className="divider" style={{ borderColor: 'rgba(255,255,255,0.05)' }} />

              {event.zones && event.zones.length > 0 && (
                <div style={{ marginBottom: 32 }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '1px' }}>{t('eventDetail.zonePricing')}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {event.zones.map(z => (
                      <div key={z.id} className="flex-between" style={{
                        padding: '12px 16px', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)',
                        borderLeft: `4px solid ${z.color}`
                      }}>
                        <span style={{ fontWeight: 500 }}>{z.name}</span>
                        <span style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '1.1rem' }}>
                          {z.price.toLocaleString('vi-VN')}₫
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {isPast ? (
                <button className="btn btn-secondary btn-lg" style={{ width: '100%', opacity: 0.7, background: '#555', color: 'white' }} disabled>
                  {t('eventDetail.ended') || 'Event has ended'}
                </button>
              ) : timeUntilSale ? (
                <button className="btn btn-secondary btn-lg" style={{ width: '100%', opacity: 0.9, background: 'linear-gradient(135deg, #1e293b, #334155)', color: 'white' }} disabled>
                  {t('eventDetail.saleStartsIn') || 'Sale starts in'}: <strong style={{ color: '#fbbf24', marginLeft: '8px' }}>{timeUntilSale}</strong>
                </button>
              ) : event.status === 'ON_SALE' ? (
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn btn-primary btn-lg" 
                  style={{ width: '100%', padding: '18px', fontSize: '1.15rem', borderRadius: '12px' }} 
                  onClick={handleBuyTicket}
                >
                  {t('eventDetail.buyNow')}
                </motion.button>
              ) : (
                <button className="btn btn-secondary btn-lg" style={{ width: '100%', opacity: 0.7 }} disabled>
                  {event.status === 'PUBLISHED' ? t('eventDetail.notOnSale') : event.status}
                </button>
              )}
              
              <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '16px' }}>
                {t('eventDetail.securePayment')}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
