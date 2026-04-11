import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';
import { useLanguage } from '../i18n';

export default function Navbar() {
  const { user, logout, isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { settings } = useSettings();
  const { t, toggleLocale } = useLanguage();

  const navCategories = [
    {
      title: t('nav.concerts'),
      titleKey: 'Concerts',
      popular: [
        { label: 'ROCK', bg: settings['nav_rock'] || 'https://picsum.photos/seed/rock1/400/300' },
        { label: 'HIP-HOP/RAP', bg: settings['nav_hiphop'] || 'https://picsum.photos/seed/hiphop2/400/300' },
        { label: 'COUNTRY', bg: settings['nav_country'] || 'https://picsum.photos/seed/country3/400/300' },
        { label: 'ALTERNATIVE', bg: settings['nav_alternative'] || 'https://picsum.photos/seed/alt4/400/300' }
      ],
      links: ['Alternative', 'Dance/Electronic', 'Medieval', 'Reggae', 'Ballads', 'Folk', 'Metal', 'Religious', 'Blues', 'Pop', 'Rock', 'World']
    },
    {
      title: t('nav.sports'),
      titleKey: 'Sports',
      popular: [
        { label: 'BASKETBALL', bg: settings['nav_basketball'] || 'https://picsum.photos/seed/nba1/400/300' },
        { label: 'SOCCER', bg: settings['nav_soccer'] || 'https://picsum.photos/seed/soccer2/400/300' },
        { label: 'FOOTBALL', bg: settings['nav_football'] || 'https://picsum.photos/seed/nfl3/400/300' },
        { label: 'BASEBALL', bg: settings['nav_baseball'] || 'https://picsum.photos/seed/mlb4/400/300' }
      ],
      links: ['Basketball', 'Soccer', 'Football', 'Baseball', 'Tennis', 'Golf', 'Motorsports', 'Boxing', 'MMA', 'Wrestling', 'Hockey']
    },
    {
      title: t('nav.arts'),
      titleKey: 'Arts, Theater & Comedy',
      popular: [
        { label: 'COMEDY', bg: settings['nav_comedy'] || 'https://picsum.photos/seed/comedy1/400/300' },
        { label: 'BROADWAY', bg: settings['nav_broadway'] || 'https://picsum.photos/seed/broadway2/400/300' },
        { label: 'OPERA', bg: settings['nav_opera'] || 'https://picsum.photos/seed/opera3/400/300' },
        { label: 'MAGIC', bg: settings['nav_magic'] || 'https://picsum.photos/seed/magic4/400/300' }
      ],
      links: ['Comedy', 'Broadway', 'Opera', 'Magic', 'Musicals', 'Ballet', 'Classical', 'Plays', 'Symphony', 'Family Shows']
    },
    {
      title: t('nav.family'),
      titleKey: 'Family',
      popular: [
        { label: 'DISNEY', bg: settings['nav_disney'] || 'https://picsum.photos/seed/disney1/400/300' },
        { label: 'CIRCUS', bg: settings['nav_circus'] || 'https://picsum.photos/seed/circus2/400/300' },
        { label: 'MAGIC SHOWS', bg: settings['nav_magicshows'] || 'https://picsum.photos/seed/magic3/400/300' },
        { label: 'ICE SHOWS', bg: settings['nav_iceshows'] || 'https://picsum.photos/seed/ice4/400/300' }
      ],
      links: ['Disney', 'Circus', 'Magic Shows', 'Ice Shows', 'Museums', 'Zoos', 'Fairs', 'Festivals', 'Puppet Shows']
    },
    {
      title: t('nav.cities'),
      titleKey: 'Cities',
      popular: [
        { label: 'NEW YORK', bg: settings['nav_newyork'] || 'https://picsum.photos/seed/ny1/400/300' },
        { label: 'LOS ANGELES', bg: settings['nav_la'] || 'https://picsum.photos/seed/la2/400/300' },
        { label: 'CHICAGO', bg: settings['nav_chicago'] || 'https://picsum.photos/seed/chi3/400/300' },
        { label: 'LAS VEGAS', bg: settings['nav_vegas'] || 'https://picsum.photos/seed/lv4/400/300' }
      ],
      links: ['New York', 'Los Angeles', 'Chicago', 'Las Vegas', 'Austin', 'Nashville', 'London', 'Toronto', 'Sydney']
    }
  ];

  const handleSearchNav = (category: string) => {
    navigate(`/events?category=${encodeURIComponent(category)}`);
  };

  return (
    <nav className="navbar navbar-tm">
      <div className="navbar-inner">
        <div className="flex align-center gap-md">
          <Link to="/" className="navbar-brand">ticketrush</Link>
          <ul className="navbar-nav" style={{ height: '72px' }}>
            {navCategories.map(cat => (
              <li key={cat.titleKey} className="nav-item-dropdown">
                <Link to={`/events?category=${encodeURIComponent(cat.titleKey)}`}>{cat.title}</Link>
                <div className="mega-menu">
                  <div className="mega-section-title flex-between">
                    {t('nav.popular')} <span style={{ fontSize: '0.9rem', color: '#026cdf', cursor: 'pointer', fontWeight: 600 }}>{t('nav.seeAll')} {cat.title} &gt;</span>
                  </div>
                  <div className="mega-popular">
                    {cat.popular.map(pop => (
                      <div 
                        key={pop.label}
                        className="mega-popular-card" 
                        onClick={() => handleSearchNav(pop.label)} 
                        style={{ background: `linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.8)), url(${pop.bg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                      >
                        {pop.label}
                      </div>
                    ))}
                  </div>
                  <div className="mega-section-title" style={{ marginTop: '20px' }}>{t('nav.discoverMore')}</div>
                  <div className="mega-links">
                    {cat.links.map(link => (
                      <a key={link} href="#">{link}</a>
                    ))}
                    <a href="#" style={{ color: '#026cdf !important', fontWeight: 600 }}>{t('nav.seeAll')} {cat.title} →</a>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.15)', borderRadius: '4px', padding: '6px 12px', width: '250px' }}>
             <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
               <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.8)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t('nav.search')}</span>
               <input 
                 type="text" 
                 placeholder={t('nav.searchPlaceholder')} 
                 style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '0.9rem', outline: 'none', width: '100%', padding: '2px 0' }}
                 onKeyDown={(e) => {
                   if (e.key === 'Enter') {
                     navigate(`/events?category=${encodeURIComponent(e.currentTarget.value)}`);
                   }
                 }}
               />
             </div>
             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" style={{ cursor: 'pointer' }}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>

          {/* Language Switcher */}
          <button
            onClick={toggleLocale}
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: 'white',
              padding: '6px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.3)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
          >
            {t('lang.switch')}
          </button>

          <div className="navbar-user">
          {isAuthenticated ? (
             <div className="nav-item-dropdown">
              <div className="flex-center gap-sm" style={{ cursor: 'pointer', height: '100%' }}>
                <div className="navbar-avatar" style={{ background: 'white', color: '#026cdf' }}>
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize: '0.9rem', color: 'white', fontWeight: 600 }}>
                  {user?.fullName || user?.username}
                </span>
              </div>
              <div className="mega-menu" style={{ width: '250px', left: 'auto', right: '0', padding: '16px' }}>
                {!isAdmin && <Link to="/tickets" style={{ display: 'block', padding: '10px 0', borderBottom: '1px solid #333' }}>{t('nav.myTickets')}</Link>}
                {isAdmin && <Link to="/admin" style={{ display: 'block', padding: '10px 0', borderBottom: '1px solid #333' }}>{t('nav.adminDashboard')}</Link>}
                <button className="btn btn-secondary btn-sm" onClick={logout} style={{ width: '100%', marginTop: '16px' }}>{t('nav.signOut')}</button>
              </div>
            </div>
          ) : (
            <>
              <Link to="/login" style={{ color: 'white', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                {t('nav.signInRegister')}
              </Link>
            </>
          )}
        </div>
        </div>
      </div>
    </nav>
  );
}
