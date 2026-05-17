import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { eventApi } from '../api';
import { EventResponse } from '../types';
import { useSettings } from '../contexts/SettingsContext';
import { useLanguage } from '../i18n';

export default function EventListPage() {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || '';
  const searchParam = searchParams.get('search') || searchParams.get('q') || '';
  const cityParam = searchParams.get('city') || '';
  const [events, setEvents] = useState<EventResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [cityFilter, setCityFilter] = useState(cityParam || 'AllCities');
  const [dateFilter, setDateFilter] = useState('All Dates');
  const { t } = useLanguage();

  useEffect(() => {
    setSearchQuery(searchParam);
  }, [searchParam]);

  const { settings } = useSettings();
  const heroCategory = categoryParam ? categoryParam.replace('_', ' ').toUpperCase() : 'EVENTS';
  
  const getHeroBackground = (category: string) => {
    if (!category) return settings['hero_fallback'] || '';
    
    const key = `hero_${category.toUpperCase()}`;
    return settings[key] || settings['hero_fallback'] || '';
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

    const currentCity = cityFilter === 'AllCities' ? '' : cityFilter;
    eventApi.search(searchParam, categoryParam, currentCity, startDate, endDate)
      .then(res => setEvents(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [categoryParam, dateFilter, searchParam, cityFilter]);

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
    <div className="bg-bg-primary min-h-screen pb-[60px] text-white">
      
      <div 
        className="w-full h-[300px] bg-cover bg-center relative flex items-end p-10 text-white transition-all duration-700 bg-gray-900" 
        style={{ backgroundImage: heroBackground ? `url(${heroBackground})` : 'none' }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/20"></div>
        <div className="relative z-10">
          <h1 className="text-6xl font-extrabold uppercase m-0 tracking-tight">{heroCategory}</h1>
        </div>
      </div>

      <div className="flex gap-4 items-center flex-wrap bg-bg-card border-b border-border-color py-4 px-10">
        <select 
          className="w-[200px] cursor-pointer px-3 py-2 bg-bg-input border border-border-color rounded-md text-white focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20" 
          value={categoryParam || "AllCategories"}
          onChange={(e) => window.location.href = `/events?category=${e.target.value === 'AllCategories' ? '' : e.target.value}`}
        >
          <option value="AllCategories">{t('eventList.allCategories')}</option>
          <option value="LIVE_MUSIC">{t('nav.concerts')}</option>
          <option value="ARTS">{t('nav.arts')}</option>
          <option value="WORKSHOP">{t('nav.workshop')}</option>
          <option value="EXPERIENCE">{t('nav.experience')}</option>
          <option value="SPORTS">{t('nav.sports')}</option>
          <option value="OTHER">{t('nav.other')}</option>
        </select>
        
        <select 
          className="w-[200px] cursor-pointer px-3 py-2 bg-bg-input border border-border-color rounded-md text-white focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20" 
          value={cityFilter}
          onChange={(e) => {
            setCityFilter(e.target.value);
            const newUrl = new URL(window.location.href);
            if (e.target.value === 'AllCities') newUrl.searchParams.delete('city');
            else newUrl.searchParams.set('city', e.target.value);
            window.history.pushState({}, '', newUrl);
          }}
        >
          <option value="AllCities">{t('search.allLocations')}</option>
          <option value="Hà Nội">{t('cities.hn')}</option>
          <option value="Hồ Chí Minh">{t('cities.hcm')}</option>
          <option value="Đà Nẵng">{t('cities.dn')}</option>
          <option value="Hải Phòng">{t('cities.hp')}</option>
          <option value="Cần Thơ">{t('cities.ct')}</option>
        </select>

        <select 
          className="w-[200px] cursor-pointer px-3 py-2 bg-bg-input border border-border-color rounded-md text-white focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20" 
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        >
          <option value="All Dates">{t('eventList.allCategories') === 'All Categories' ? 'All Dates' : t('search.allDates')}</option>
          <option value="This Weekend">{t('eventList.thisWeekend')}</option>
          <option value="Next 7 Days">{t('eventList.next7Days')}</option>
          <option value="Next 30 Days">{t('eventList.next30Days')}</option>
        </select>
        
        <button 
          className={`px-4 py-2 font-semibold rounded-full border transition-colors ${dateFilter === 'This Weekend' ? 'bg-accent-primary text-white border-accent-primary' : 'bg-transparent text-gray-300 border-gray-600 hover:border-gray-400'}`}
          onClick={() => setDateFilter('This Weekend')}
        >
          {t('eventList.thisWeekend')}
        </button>

        <div className="flex-1"></div>

        <div className="relative w-[300px]">
          <input 
            type="text" 
            className="w-full pl-10 pr-4 py-2 bg-bg-input border border-border-color rounded-full text-white focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20" 
            placeholder={t('eventList.searchPlaceholder')} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50 text-white">🔍</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto my-10 px-5">
        <h2 className="text-xl font-extrabold uppercase border-b-2 border-accent-primary inline-block pb-1 mb-6 tracking-wide text-white">
          {heroCategory} {t('eventList.events')} <span className="font-normal text-gray-400 border-l border-gray-600 pl-2 ml-2">
            {events.filter(e => e.name.toLowerCase().includes(searchQuery.toLowerCase())).length} {t('eventList.results')}
          </span>
        </h2>

        {loading ? (
          <div className="flex justify-center p-10"><div className="w-10 h-10 border-4 border-border-color border-t-accent-primary rounded-full animate-spin" /></div>
        ) : events.length === 0 ? (
          <div className="bg-bg-card p-10 text-center border border-border-color rounded-lg">
            <p className="text-lg text-gray-300">{t('eventList.noEvents')} {heroCategory}. {t('eventList.tryAdjusting')}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {events.filter(e => e.name.toLowerCase().includes(searchQuery.toLowerCase())).map(event => {
              const dt = extractDateInfo(event.eventDate);
              const isPast = event.eventDate && new Date(event.eventDate).getTime() < Date.now();
              return (
                <div key={event.id} className={`flex items-center p-6 rounded-lg border transition-all ${isPast ? 'opacity-60 grayscale bg-[#222] border-gray-700' : 'bg-bg-card border-border-color hover:shadow-lg hover:-translate-y-0.5'}`}>
                  <div className="w-[150px] border-r border-border-color pr-6 text-white">
                    <div className="text-sm font-bold text-gray-400 uppercase">{dt.month}</div>
                    <div className="text-3xl font-extrabold leading-none my-1">{dt.day}</div>
                    <div className="text-xs text-gray-400">{dt.time}</div>
                  </div>
                  
                  <div className="flex-1 pl-6 text-white">
                    <h3 className="text-xl font-extrabold mb-2">{event.name}</h3>
                    <div className="text-sm text-gray-300">{event.venue || t('eventList.tbaVenue')} • {isPast ? t('eventList.ended') : (event.status === 'ON_SALE' ? t('eventList.ticketsAvailable') : t('eventList.registration'))}</div>
                  </div>
                  
                  <div className="self-center">
                    {isPast ? (
                      <button className="px-4 py-2 bg-gray-700 text-gray-400 rounded cursor-not-allowed font-bold" disabled>
                        {t('eventList.ended')}
                      </button>
                    ) : (
                      <Link to={`/events/${event.id}`} className="px-4 py-2 bg-accent-primary text-white rounded font-bold hover:bg-accent-secondary transition-colors inline-block">
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
