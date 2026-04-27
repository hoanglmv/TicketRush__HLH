import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { eventApi } from '../api';
import { EventResponse } from '../types';
import { useSettings } from '../contexts/SettingsContext';
import { useLanguage } from '../i18n';

export default function EventListPage() {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || '';
  const [events, setEvents] = useState<EventResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('All Dates');
  const { t } = useLanguage();

  const { settings } = useSettings();
  const heroCategory = categoryParam.toUpperCase() || 'EVENTS';
  
  const getHeroBackground = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('rock')) return settings['hero_rock'] || 'https://picsum.photos/seed/rockbg/1600/800';
    if (cat.includes('hip-hop') || cat.includes('rap')) return settings['hero_hiphop'] || 'https://picsum.photos/seed/hiphopbg/1600/800';
    if (cat.includes('country')) return settings['hero_country'] || 'https://picsum.photos/seed/countrybg/1600/800';
    if (cat.includes('alternative')) return settings['hero_alternative'] || 'https://picsum.photos/seed/altbg/1600/800';
    if (cat.includes('concert')) return settings['hero_fallback'] || 'https://picsum.photos/seed/concertbg/1600/800';
    if (cat.includes('sport') || cat.includes('football') || cat.includes('basketball')) return settings['hero_sports'] || 'https://picsum.photos/seed/sportsbg/1600/800';
    if (cat.includes('art') || cat.includes('theater') || cat.includes('comedy') || cat.includes('broadway')) return settings['hero_arts'] || 'https://picsum.photos/seed/artsbg/1600/800';
    if (cat.includes('family') || cat.includes('disney') || cat.includes('circus')) return settings['hero_family'] || 'https://picsum.photos/seed/familybg/1600/800';
    if (cat.includes('city') || cat.includes('cities')) return settings['hero_cities'] || 'https://picsum.photos/seed/citybg/1600/800';
    // Deep fallback
    return settings['hero_fallback'] || 'https://picsum.photos/seed/fallback/1600/800';
  };
  
  const heroBackground = getHeroBackground(categoryParam);

  useEffect(() => {
    setLoading(true);
    let startDate = '';
    let endDate = '';
    
    const now = new Date();
    if (dateFilter === 'This Weekend') {
      const friday = new Date(now);
      friday.setDate(now.getDate() + (5 - now.getDay())); // Move to this Friday
      friday.setHours(0,0,0,0);
      const sunday = new Date(friday);
      sunday.setDate(friday.getDate() + 2);
      sunday.setHours(23,59,59,999);
      startDate = friday.toISOString();
      endDate = sunday.toISOString();
    } else if (dateFilter === 'Next 7 Days') {
      const nextWeek = new Date(now);
      nextWeek.setDate(now.getDate() + 7);
      startDate = now.toISOString();
      endDate = nextWeek.toISOString();
    } else if (dateFilter === 'Next 30 Days') {
      const nextMonth = new Date(now);
      nextMonth.setDate(now.getDate() + 30);
      startDate = now.toISOString();
      endDate = nextMonth.toISOString();
    }

    eventApi.search('', categoryParam, startDate, endDate)
      .then(res => setEvents(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [categoryParam, dateFilter]);

  const extractDateInfo = (dStr: string) => {
    if (!dStr) return { month: '', day: '', time: '' };
    const d = new Date(dStr);
    return {
      month: d.toLocaleDateString('en-US', { month: 'short' }),
      day: d.toLocaleDateString('en-US', { day: '2-digit' }),
      time: d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    };
  };

  return (
    <div style={{ background: '#1f1f1f', minHeight: '100vh', paddingBottom: '60px', color: 'white' }}>
      
      <div className="tm-hero-banner" style={{ backgroundImage: `url(${heroBackground})` }}>
        <div className="tm-hero-content">
          <div className="tm-hero-breadcrumb">{t('eventList.home')} / {categoryParam || t('eventList.all')} / {heroCategory} {t('eventList.tickets')}</div>
          <h1 className="tm-hero-title">{heroCategory}</h1>
        </div>
      </div>

      <div className="tm-filter-bar" style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', background: '#2a2a2a', borderBottom: '1px solid #444' }}>
        <select 
          className="form-input" 
          style={{ width: '200px', cursor: 'pointer' }} 
          value={categoryParam || "AllCategories"}
          onChange={(e) => window.location.href = `/events?category=${e.target.value === 'AllCategories' ? '' : e.target.value}`}
        >
          <option value="AllCategories">{t('eventList.allCategories')}</option>
          <option value="LIVE_MUSIC">{t('nav.concerts')}</option>
          <option value="ARTS">{t('nav.arts')}</option>
          <option value="WORKSHOP">{t('nav.workshop')}</option>
          <option value="EXPERIENCE">{t('nav.experience')}</option>
          <option value="SPORTS">{t('nav.sports')}</option>
        </select>
        
        <select 
          className="form-input" 
          style={{ width: '200px', cursor: 'pointer' }}
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        >
          <option value="All Dates">{t('eventList.allCategories') === 'All Categories' ? 'All Dates' : t('search.allDates')}</option>
          <option value="This Weekend">{t('eventList.thisWeekend')}</option>
          <option value="Next 7 Days">{t('eventList.next7Days')}</option>
          <option value="Next 30 Days">{t('eventList.next30Days')}</option>
        </select>
        
        <button 
          style={{ 
            background: dateFilter === 'This Weekend' ? '#00b14f' : 'transparent', 
            color: dateFilter === 'This Weekend' ? 'white' : '#ccc',
            border: dateFilter === 'This Weekend' ? '1px solid #00b14f' : '1px solid #444', 
            borderRadius: '20px', 
            padding: '8px 16px', 
            fontWeight: 600, cursor: 'pointer' 
          }}
          onClick={() => setDateFilter('This Weekend')}
        >
          {t('eventList.thisWeekend')}
        </button>

        <div style={{ flex: 1 }}></div>

        <div style={{ position: 'relative', width: '300px' }}>
          <input 
            type="text" 
            className="form-input" 
            placeholder={t('eventList.searchPlaceholder')} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', paddingLeft: '36px', borderRadius: '20px' }}
          />
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5, color: 'white' }}>🔍</span>
        </div>
      </div>

      <div className="tm-event-list-container animate-slideIn">
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, textTransform: 'uppercase', borderBottom: '2px solid #00b14f', display: 'inline-block', paddingBottom: '4px', marginBottom: '24px', letterSpacing: '0.5px', color: 'white' }}>
          {heroCategory} {t('eventList.events')} <span style={{ fontWeight: 400, color: '#aaa', borderLeft: '1px solid #444', paddingLeft: '8px', marginLeft: '8px' }}>
            {events.filter(e => e.name.toLowerCase().includes(searchQuery.toLowerCase())).length} {t('eventList.results')}
          </span>
        </h2>

        {loading ? (
          <div className="loading-container"><div className="spinner" /></div>
        ) : events.length === 0 ? (
          <div style={{ background: '#2a2a2a', padding: '40px', textAlign: 'center', border: '1px solid #444' }}>
            <p style={{ fontSize: '1.2rem', color: '#ccc' }}>{t('eventList.noEvents')} {heroCategory}. {t('eventList.tryAdjusting')}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {events.filter(e => e.name.toLowerCase().includes(searchQuery.toLowerCase())).map(event => {
              const dt = extractDateInfo(event.eventDate);
              const isPast = event.eventDate && new Date(event.eventDate).getTime() < Date.now();
              return (
                <div key={event.id} className="tm-event-row" style={{ opacity: isPast ? 0.6 : 1, filter: isPast ? 'grayscale(100%)' : 'none', background: isPast ? '#222' : '#2a2a2a', border: '1px solid #444', marginBottom: '16px', borderRadius: '8px', padding: '16px', display: 'flex' }}>
                  <div className="tm-event-date" style={{ color: 'white', marginRight: '24px', borderRight: '1px solid #444', paddingRight: '24px' }}>
                    <div className="tm-event-date-month">{dt.month}</div>
                    <div className="tm-event-date-day">{dt.day}</div>
                    <div className="tm-event-date-time">{dt.time}</div>
                  </div>
                  
                  <div className="tm-event-details" style={{ flex: 1, color: 'white' }}>
                    <h3 className="tm-event-title" style={{ color: 'white', margin: '0 0 8px 0' }}>{event.name}</h3>
                    <div className="tm-event-venue" style={{ color: '#ccc' }}>{event.venue || t('eventList.tbaVenue')} • {isPast ? (t('eventList.ended') || 'Ended') : (event.status === 'ON_SALE' ? t('eventList.ticketsAvailable') : t('eventList.registration'))}</div>
                  </div>
                  
                  <div className="tm-event-action" style={{ alignSelf: 'center' }}>
                    {isPast ? (
                      <button className="tm-event-btn" disabled style={{ background: '#444', color: '#888', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'not-allowed' }}>
                        {t('eventList.ended') || 'Ended'}
                      </button>
                    ) : (
                      <Link to={`/events/${event.id}`} className="tm-event-btn" style={{ background: '#00b14f', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' }}>
                        {t('eventList.findTickets')}
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
