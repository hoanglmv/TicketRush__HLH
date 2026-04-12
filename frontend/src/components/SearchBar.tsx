import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Search } from 'lucide-react';
import { eventApi } from '../api';
import { EventResponse } from '../types';
import { useLanguage } from '../i18n';

export default function SearchBar() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [location, setLocation] = useState('');
  const [dates, setDates] = useState('');
  const [query, setQuery] = useState('');
  
  const [suggestions, setSuggestions] = useState<EventResponse[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim().length >= 2) {
      const delayFn = setTimeout(() => {
        eventApi.search(query).then(res => {
          setSuggestions(res.data.data || []);
          setShowSuggestions(true);
        }).catch(() => {});
      }, 300);
      return () => clearTimeout(delayFn);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query]);

  // Handle clicking outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (location) params.append('city', location);
    // Real implementation would parse dates better
    
    navigate(`/events?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="tm-search-container" style={{ position: 'relative', zIndex: 10 }}>
      
      <div className="tm-search-field" style={{ flex: '0.8' }}>
        <div className="tm-search-label">{t('search.location')}</div>
        <div className="flex align-center gap-sm">
          <MapPin size={16} color="#026cdf" />
          <input 
            type="text" 
            className="tm-search-input" 
            placeholder={t('search.locationPlaceholder')} 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
      </div>

      <div className="tm-search-field" style={{ flex: '0.8' }}>
        <div className="tm-search-label">{t('search.dates')}</div>
        <div className="flex align-center gap-sm">
          <Calendar size={16} color="#026cdf" />
          <input 
            type={dates ? "date" : "text"}
            onFocus={(e) => e.target.type = 'date'}
            onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }}
            className="tm-search-input" 
            placeholder={t('search.allDates')} 
            value={dates}
            onChange={(e) => setDates(e.target.value)}
          />
        </div>
      </div>

      <div className="tm-search-field" style={{ flex: '1.2' }} ref={searchRef}>
        <div className="tm-search-label">{t('search.search')}</div>
        <div className="flex align-center gap-sm">
          <Search size={16} color="#026cdf" />
          <input 
            type="text" 
            className="tm-search-input" 
            placeholder={t('search.searchPlaceholder')} 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
          />
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 'auto', // aligns with the search container
            right: '110px', // avoid overlapping the search button
            width: '400px',
            background: 'white',
            borderRadius: '0 0 8px 8px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            borderTop: '1px solid #eee',
            zIndex: 100,
            maxHeight: '350px',
            overflowY: 'auto'
          }}>
            <div style={{ padding: '8px 16px', fontSize: '0.8rem', fontWeight: 700, color: '#666', borderBottom: '1px solid #eee' }}>{t('search.suggestedEvents')} ({suggestions.length})</div>
            {suggestions.map(event => (
              <div 
                key={event.id}
                style={{ display: 'flex', padding: '12px 16px', borderBottom: '1px solid #eee', cursor: 'pointer', alignItems: 'center' }}
                onClick={() => {
                  setShowSuggestions(false);
                  navigate(`/events/${event.id}`);
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#f2f8fc')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <div style={{
                  width: '40px', height: '40px', borderRadius: '4px',
                  background: `url(${event.bannerUrl}) center/cover`,
                  marginRight: '12px', flexShrink: 0
                }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#111' }}>{event.name}</div>
                  <div style={{ fontSize: '0.8rem', color: '#666' }}>{event.city} • {event.venue}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button type="submit" className="tm-search-btn">
        {t('search.search')}
      </button>

    </form>
  );
}
