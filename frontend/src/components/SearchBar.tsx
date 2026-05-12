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
    <form onSubmit={handleSearch} className="bg-white rounded-3xl md:rounded-full p-3 shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex flex-col md:flex-row items-center max-w-5xl mx-auto border border-gray-100 relative z-10 w-full gap-2 md:gap-0">
      
      <div className="flex-[0.8] px-5 py-2 w-full md:w-auto md:border-r border-gray-200 relative">
        <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{t('search.location')}</div>
        <div className="flex items-center gap-3">
          <MapPin size={18} className="text-[#026cdf] flex-shrink-0" />
          <input 
            type="text" 
            className="w-full bg-transparent border-none outline-none text-gray-900 font-bold placeholder-gray-400" 
            placeholder={t('search.locationPlaceholder')} 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-[0.8] px-5 py-2 w-full md:w-auto md:border-r border-gray-200 relative">
        <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{t('search.dates')}</div>
        <div className="flex items-center gap-3">
          <Calendar size={18} className="text-[#026cdf] flex-shrink-0" />
          <input 
            type={dates ? "date" : "text"}
            onFocus={(e) => e.target.type = 'date'}
            onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }}
            className="w-full bg-transparent border-none outline-none text-gray-900 font-bold placeholder-gray-400" 
            placeholder={t('search.allDates')} 
            value={dates}
            onChange={(e) => setDates(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-[1.2] px-5 py-2 w-full md:w-auto relative" ref={searchRef}>
        <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{t('search.search')}</div>
        <div className="flex items-center gap-3">
          <Search size={18} className="text-[#026cdf] flex-shrink-0" />
          <input 
            type="text" 
            className="w-full bg-transparent border-none outline-none text-gray-900 font-bold placeholder-gray-400" 
            placeholder={t('search.searchPlaceholder')} 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
          />
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 md:left-auto right-0 md:right-4 w-full md:w-[400px] bg-white rounded-b-2xl md:rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.15)] border border-gray-100 z-50 max-h-[350px] overflow-y-auto mt-4 md:mt-6 overflow-hidden">
            <div className="px-5 py-3 text-xs font-extrabold text-gray-500 uppercase tracking-wider border-b border-gray-100 bg-gray-50">{t('search.suggestedEvents')} ({suggestions.length})</div>
            {suggestions.map(event => (
              <div 
                key={event.id}
                className="flex px-5 py-3 border-b border-gray-50 cursor-pointer items-center hover:bg-blue-50 transition-colors"
                onClick={() => {
                  setShowSuggestions(false);
                  navigate(`/events/${event.id}`);
                }}
              >
                <div className="w-12 h-12 rounded-lg bg-cover bg-center mr-4 flex-shrink-0 shadow-sm" style={{ backgroundImage: `url(${event.bannerUrl})` }} />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-gray-900 truncate">{event.name}</div>
                  <div className="text-xs text-gray-500 font-medium truncate mt-0.5">{event.city} • {event.venue}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button type="submit" className="w-full md:w-auto bg-[#026cdf] hover:bg-blue-700 text-white px-8 py-4 rounded-xl md:rounded-full font-bold ml-0 md:ml-2 mt-2 md:mt-0 transition-colors shadow-md hover:shadow-lg text-lg md:text-base">
        {t('search.search')}
      </button>

    </form>
  );
}
