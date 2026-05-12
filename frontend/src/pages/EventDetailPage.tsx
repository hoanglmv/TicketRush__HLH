import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Info, ChevronRight, Share2, Armchair } from 'lucide-react';
import { eventApi } from '../api';
import { EventResponse } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../i18n';

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { t, locale } = useLanguage();

  // Social Proof Simulation
  const liveViewers = useMemo(() => Math.floor(Math.random() * (150 - 30 + 1) + 30), []);

  const [timeUntilSale, setTimeUntilSale] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      eventApi.get(Number(id)).then(res => setEvent(res.data.data))
        .catch(() => {}).finally(() => setLoading(false));
    }
  }, [id]);


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
    <div className="flex-1 pt-[100px]">
       <div className="container mx-auto px-6 max-w-7xl flex justify-center">
          <div className="w-10 h-10 border-4 border-border-color border-t-accent-primary rounded-full animate-spin" />
       </div>
    </div>
  );
  
  if (!event) return <div className="flex-1"><div className="container mx-auto px-6 max-w-7xl"><div className="text-center py-20 text-text-muted text-xl">{t('eventDetail.eventNotFound')}</div></div></div>;

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


  const isNearingSoldOut = event.totalSeats > 0 && ((event.availableSeats / event.totalSeats) < 0.1);
  const isPast = event.eventDate && new Date(event.eventDate).getTime() < Date.now();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-bg-primary min-h-screen pt-[80px] pb-[100px]"
    >
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Breadcrumb like header */}
        <div className="mb-6 flex items-center gap-2 text-text-muted text-sm">
          <span className="cursor-pointer hover:text-accent-primary transition-colors font-medium" onClick={() => navigate('/events')}>{t('eventDetail.events')}</span>
          <ChevronRight size={14} />
          <span className="text-text-primary/70">{event.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Main Banner & Carousel */}
            <div className="mb-8">
              <div className="w-full h-[400px] rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.4)] relative bg-cover bg-center transition-all duration-300" 
                style={{ backgroundImage: (event.images && event.images.length > 0) ? `url(${event.images[currentImageIndex]})` : (event.bannerUrl ? `url(${event.bannerUrl})` : 'linear-gradient(135deg, #6366f1, #ec4899)') }}>
                {event.hot ? (
                  <div className="absolute top-5 left-5 bg-red-600/90 backdrop-blur-md px-4 py-1.5 rounded-full font-bold text-sm text-white flex items-center gap-1 shadow-lg">
                    <span>🔥</span> Sự kiện Hot
                  </div>
                ) : (
                  <div className="absolute top-5 left-5 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full font-semibold text-sm text-white">
                    {t('eventDetail.featured')}
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {event.images && event.images.length > 1 && (
                <div className="flex gap-3 mt-4 overflow-x-auto pb-2 custom-scrollbar">
                  {event.images.map((img, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`w-24 h-16 rounded-lg overflow-hidden cursor-pointer flex-shrink-0 border-2 transition-all duration-200 ${currentImageIndex === idx ? 'border-accent-primary opacity-100 scale-105 shadow-lg' : 'border-transparent opacity-50 hover:opacity-100'}`}
                    >
                      <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-between items-start mb-6">
              <h1 className="text-4xl lg:text-5xl font-black leading-tight flex-1 text-text-primary tracking-tight">{event.name}</h1>
              <div className="flex gap-3 ml-4">
                 <button className="p-3 bg-bg-card text-text-primary border border-border-color rounded-full hover:bg-bg-card-hover hover:border-accent-primary transition-all shadow-md active:scale-95"><Share2 size={20} /></button>
              </div>
            </div>

            {/* Social Proof Banner */}
            {event.status === 'ON_SALE' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="bg-red-500/10 border border-red-500/30 px-5 py-4 rounded-2xl flex items-center gap-4 mb-8 text-red-400"
              >
                <Users size={20} className="animate-pulse" />
                <span className="font-semibold text-sm lg:text-base">{t('eventDetail.currentlyViewing')} <b className="text-white font-black">{liveViewers}</b> {t('eventDetail.viewingNow')}</span>
              </motion.div>
            )}

            <div className="p-8 bg-bg-card rounded-2xl border border-border-color shadow-xl">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-text-primary">
                <div className="w-10 h-10 rounded-xl bg-accent-primary/10 flex items-center justify-center">
                  <Info size={24} className="text-accent-primary" />
                </div>
                {t('eventDetail.aboutEvent')}
              </h3>
              <p className="text-text-secondary leading-relaxed text-lg whitespace-pre-wrap">
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
            <div className="bg-bg-card border border-border-color rounded-2xl sticky top-[100px] p-8 shadow-2xl">
              <h3 className="font-black text-2xl mb-8 text-text-primary uppercase tracking-tighter">{t('eventDetail.bookingInfo')}</h3>

              <div className="flex flex-col gap-5 mb-8">
                <div className="flex gap-4">
                  <div className="w-11 h-11 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
                    <Calendar size={22} />
                  </div>
                  <div>
                    <div className="text-text-muted text-xs font-bold uppercase tracking-wider mb-1">{t('eventDetail.dateTime')}</div>
                    <div className="font-bold text-lg text-text-primary">{formatDate(event.eventDate)}</div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-11 h-11 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-400 shrink-0">
                    <MapPin size={22} />
                  </div>
                  <div>
                    <div className="text-text-muted text-xs font-bold uppercase tracking-wider mb-1">{t('eventDetail.venue')}</div>
                    <div className="font-bold text-lg text-text-primary">{event.venue || t('eventDetail.venueUpdating')}</div>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-11 h-11 rounded-full bg-green-500/10 flex items-center justify-center text-green-400 shrink-0">
                    <Armchair size={22} />
                  </div>
                  <div className="flex-1">
                    <div className="text-text-muted text-xs font-bold uppercase tracking-wider mb-1 flex justify-between">
                      <span>{t('eventDetail.availableSeats')}</span>
                      {isNearingSoldOut && <span className="text-danger animate-pulse">{t('eventDetail.nearingSoldOut')}</span>}
                    </div>
                    <div className="font-bold text-lg text-text-primary">{event.availableSeats} <span className="text-text-muted font-medium text-sm">/ {event.totalSeats}</span></div>
                  </div>
                </div>
              </div>

              <hr className="border-white/5 my-6" />

              {event.zones && event.zones.length > 0 && (
                <div className="mb-8">
                  <div className="font-bold text-text-muted text-[10px] mb-4 uppercase tracking-[0.2em] opacity-80">{t('eventDetail.zonePricing')}</div>
                  <div className="flex flex-col gap-3">
                    {event.zones.map(z => (
                      <div key={z.id} className="flex justify-between items-center px-4 py-4 bg-bg-primary/50 rounded-xl border-l-[6px] transition-transform hover:scale-[1.02]" style={{ borderColor: z.color }}>
                        <span className="font-bold text-text-primary text-sm">{z.name}</span>
                        <span className="font-black text-accent-primary text-lg">
                          {z.price.toLocaleString('vi-VN')}₫
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {isPast ? (
                <button className="w-full py-4 text-lg font-bold rounded-xl opacity-70 bg-gray-600 text-white cursor-not-allowed" disabled>
                  {t('eventDetail.ended') || 'Event has ended'}
                </button>
              ) : timeUntilSale ? (
                <button className="w-full py-4 text-lg font-bold rounded-xl opacity-90 bg-gradient-to-br from-slate-800 to-slate-700 text-white cursor-not-allowed" disabled>
                  {t('eventDetail.saleStartsIn') || 'Sale starts in'}: <strong className="text-amber-400 ml-2">{timeUntilSale}</strong>
                </button>
              ) : event.status === 'ON_SALE' ? (
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 text-lg font-bold rounded-xl bg-gradient-to-br from-accent-primary to-accent-secondary text-white shadow-[0_4px_20px_rgba(0,177,79,0.4)] hover:shadow-[0_6px_25px_rgba(0,177,79,0.6)] transition-all" 
                  onClick={handleBuyTicket}
                >
                  {t('eventDetail.buyNow')}
                </motion.button>
              ) : (
                <button className="w-full py-4 text-lg font-bold rounded-xl opacity-70 bg-bg-card border border-border-color text-white cursor-not-allowed" disabled>
                  {event.status === 'PUBLISHED' ? t('eventDetail.notOnSale') : event.status}
                </button>
              )}
              
              <p className="text-center text-sm text-text-muted mt-4">
                {t('eventDetail.securePayment')}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
