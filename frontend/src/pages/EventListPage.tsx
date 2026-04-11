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
    <div style={{ background: '#f8f9fa', minHeight: '100vh', paddingBottom: '60px' }}>
      
      <div className="tm-hero-banner" style={{ backgroundImage: `url(${heroBackground})` }}>
        <div className="tm-hero-content">
          <div className="tm-hero-breadcrumb">{t('eventList.home')} / {categoryParam || t('eventList.all')} / {heroCategory} {t('eventList.tickets')}</div>
          <h1 className="tm-hero-title">{heroCategory}</h1>
        </div>
      </div>

      <div className="tm-filter-bar" style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
        <select 
          className="form-input" 
          style={{ width: '200px', cursor: 'pointer' }} 
          value={categoryParam || "AllCategories"}
          onChange={(e) => window.location.href = `/events?category=${e.target.value === 'AllCategories' ? '' : e.target.value}`}
        >
          <option value="AllCategories">{t('eventList.allCategories')}</option>
          <option value="ROCK">Rock</option>
          <option value="HIP-HOP/RAP">Hip-Hop / Rap</option>
          <option value="COUNTRY">Country</option>
          <option value="SPORTS">Sports</option>
          <option value="BROADWAY">Broadway</option>
          <option value="FAMILY">Family</option>
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
            background: dateFilter === 'This Weekend' ? '#111' : 'transparent', 
            color: dateFilter === 'This Weekend' ? 'white' : '#111',
            border: '1px solid #111', 
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
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>🔍</span>
        </div>
      </div>

      <div className="tm-event-list-container animate-slideIn">
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, textTransform: 'uppercase', borderBottom: '2px solid #111', display: 'inline-block', paddingBottom: '4px', marginBottom: '24px', letterSpacing: '0.5px' }}>
          {heroCategory} {t('eventList.events')} <span style={{ fontWeight: 400, color: '#666', borderLeft: '1px solid #ccc', paddingLeft: '8px', marginLeft: '8px' }}>
            {events.filter(e => e.name.toLowerCase().includes(searchQuery.toLowerCase())).length} {t('eventList.results')}
          </span>
        </h2>

        {loading ? (
          <div className="loading-container"><div className="spinner" /></div>
        ) : events.length === 0 ? (
          <div style={{ background: 'white', padding: '40px', textAlign: 'center', border: '1px solid #e5e7eb' }}>
            <p style={{ fontSize: '1.2rem', color: '#666' }}>{t('eventList.noEvents')} {heroCategory}. {t('eventList.tryAdjusting')}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {events.filter(e => e.name.toLowerCase().includes(searchQuery.toLowerCase())).map(event => {
              const dt = extractDateInfo(event.eventDate);
              return (
                <div key={event.id} className="tm-event-row">
                  <div className="tm-event-date">
                    <div className="tm-event-date-month">{dt.month}</div>
                    <div className="tm-event-date-day">{dt.day}</div>
                    <div className="tm-event-date-time">{dt.time}</div>
                  </div>
                  
                  <div className="tm-event-details">
                    <h3 className="tm-event-title">{event.name}</h3>
                    <div className="tm-event-venue">{event.venue || t('eventList.tbaVenue')} • {event.status === 'ON_SALE' ? t('eventList.ticketsAvailable') : t('eventList.registration')}</div>
                  </div>
                  
                  <div className="tm-event-action">
                    <Link to={`/events/${event.id}`} className="tm-event-btn">
                      {t('eventList.findTickets')}
                    </Link>
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
