import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';
import { useLanguage } from '../i18n';
import { Search } from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { settings } = useSettings();
  const { t, locale, toggleLocale } = useLanguage();

  return (
    <nav className="navbar-tb" style={{ width: '100%', position: 'sticky', top: 0, zIndex: 100 }}>
      {/* Top Tier: Green */}
      <div className="navbar-tb-top">
        <div className="navbar-inner">
          <div className="navbar-top-left">
            <Link to="/" className="navbar-tb-brand">ticketbox</Link>
            
            {/* Search Bar */}
            <div className="navbar-search">
               <Search size={18} color="#999" style={{ marginRight: '8px' }}/>
               <input 
                 type="text" 
                 placeholder={t('nav.searchPlaceholder')}
                 style={{ background: 'transparent', border: 'none', color: 'black', fontSize: '0.9rem', outline: 'none', width: '100%' }}
                 onKeyDown={(e) => {
                   if (e.key === 'Enter') {
                     navigate(`/events?search=${encodeURIComponent(e.currentTarget.value)}`);
                   }
                 }}
               />
               <div style={{ borderLeft: '1px solid #ddd', paddingLeft: '16px', marginLeft: '8px' }}>
                 <button style={{ background: 'transparent', border: 'none', color: '#00b14f', fontWeight: 600, cursor: 'pointer' }}>{t('nav.search')}</button>
               </div>
            </div>
          </div>

          <div className="navbar-top-right">
            {isAdmin && (
              <Link to="/admin/events/create" style={{ color: 'white', textDecoration: 'none', border: '1px solid white', borderRadius: '20px', padding: '6px 16px', fontSize: '0.85rem', fontWeight: 600 }}>{t('nav.createEvent')}</Link>
            )}
            
            {isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Link to="/tickets" style={{ color: 'white', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>
                   {t('nav.myTickets')}
                </Link>
                
                <div className="nav-item-dropdown" style={{ position: 'relative' }}>
                  <div className="flex-center gap-sm" style={{ cursor: 'pointer' }}>
                    <div className="navbar-avatar">
                      {user?.username?.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontSize: '0.9rem', color: 'white', fontWeight: 600 }}>
                      {user?.fullName || user?.username}
                    </span>
                  </div>
                  <div className="mega-menu" style={{ width: '200px', left: 'auto', right: '0', padding: '16px', background: '#2a2a2a', color: 'white' }}>
                    <Link to="/profile" style={{ display: 'block', padding: '8px 0', borderBottom: '1px solid #444', color: 'white', textDecoration: 'none' }}>{t('nav.myProfile')}</Link>
                    {isAdmin && <Link to="/admin" style={{ display: 'block', padding: '8px 0', borderBottom: '1px solid #444', color: 'white', textDecoration: 'none' }}>{t('nav.adminDashboard')}</Link>}
                    <button className="btn btn-secondary btn-sm" onClick={logout} style={{ width: '100%', marginTop: '16px', background: 'transparent', color: 'white', borderColor: 'white' }}>{t('nav.signOut')}</button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login" style={{ color: 'white', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>{t('nav.signInRegister')}</Link>
            )}

            <button
              onClick={toggleLocale}
              style={{
                background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px'
              }}
            >
              {locale === 'vi' ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', background: '#da251d', borderRadius: '50%' }}>
                  <span style={{ color: 'yellow', fontSize: '10px' }}>★</span>
                </div>
              ) : (
                <img src="https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg" style={{ width: '20px', height: '20px', borderRadius: '50%', objectFit: 'cover' }} alt="EN" />
              )}
              ▾
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Tier: Dark */}
      <div className="navbar-tb-bottom">
        <div className="navbar-inner">
          <ul className="navbar-tb-nav">
            <li><Link to="/events?category=CONCERTS">{t('nav.concerts')}</Link></li>
            <li><Link to="/events?category=THEATER">{t('nav.arts')}</Link></li>
            <li><Link to="/events?category=SPORTS">{t('nav.sports')}</Link></li>
            <li><Link to="/events?category=WORKSHOP">{t('nav.workshop')}</Link></li>
            <li><Link to="/events?category=EXPERIENCE">{t('nav.experience')}</Link></li>
            <li><Link to="/events?category=OTHER">{t('nav.other')}</Link></li>
            <li><Link to="/tickets">{t('nav.resale')}</Link></li>
            <li><Link to="/">{t('nav.blog')}</Link></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
