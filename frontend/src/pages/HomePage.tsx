import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { eventApi } from '../api';
import { EventResponse } from '../types';
import SearchBar from '../components/SearchBar';
import { useSettings } from '../contexts/SettingsContext';

export default function HomePage() {
  const [events, setEvents] = useState<EventResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    eventApi.list().then(res => {
      setEvents(res.data.data || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  }) : '';

  const { settings } = useSettings();
  
  const slides = [
    {
      title: 'Los Tigres del Norte',
      subtitle: 'World',
      bg: settings['hero_homepage'] || 'https://picsum.photos/seed/concert1/1600/800',
    },
    {
      title: 'The Weeknd',
      subtitle: 'Pop / R&B',
      bg: 'https://picsum.photos/seed/concert2/1600/800',
    },
    {
      title: 'Cirque du Soleil',
      subtitle: 'Family',
      bg: 'https://picsum.photos/seed/circus3/1600/800',
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handlePrev = () => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  const handleNext = () => setCurrentSlide((prev) => (prev + 1) % slides.length);

  return (
    <div style={{ background: 'var(--bg-primary)' }}>
      {/* Search Bar section mimicking TM */}
      <div style={{ background: '#026cdf', padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <SearchBar />
      </div>

      {/* Hero Banner Area (Slider) */}
      <div style={{ 
        width: '100%', 
        height: '400px', 
        position: 'relative',
        overflow: 'hidden'
      }}>
        {slides.map((slide, index) => (
          <div 
            key={index}
            style={{
              position: 'absolute',
              top: 0, left: 0, width: '100%', height: '100%',
              background: `linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.2)), url(${slide.bg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex', 
              alignItems: 'flex-end', 
              padding: '60px 5%',
              opacity: currentSlide === index ? 1 : 0,
              transition: 'opacity 0.8s ease-in-out',
              zIndex: currentSlide === index ? 1 : 0
            }}
          >
            <div style={{ color: 'white', transform: currentSlide === index ? 'translateY(0)' : 'translateY(20px)', transition: 'transform 0.8s ease-out' }}>
              <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '8px', letterSpacing: '-1px', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>{slide.title}</h1>
              <p style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '24px', textShadow: '0 1px 5px rgba(0,0,0,0.5)' }}>{slide.subtitle}</p>
              <button className="tm-search-btn" style={{ padding: '12px 32px', fontSize: '1rem' }}>Find Tickets</button>
            </div>
          </div>
        ))}
        
        {/* Slider Controls */}
        <button 
          onClick={handlePrev}
          style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', border: 'none', color: 'white', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 2 }}
        ><ChevronLeft/></button>
        <button 
          onClick={handleNext}
          style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', border: 'none', color: 'white', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 2 }}
        ><ChevronRight/></button>
        
        {/* Indicators */}
        <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px', zIndex: 2 }}>
          {slides.map((_, idx) => (
            <div 
              key={idx} 
              onClick={() => setCurrentSlide(idx)}
              style={{ width: '10px', height: '10px', borderRadius: '50%', background: currentSlide === idx ? 'white' : 'rgba(255,255,255,0.4)', cursor: 'pointer', transition: 'background 0.3s' }} 
            />
          ))}
        </div>
      </div>

      {/* Section 1: Trending Searches */}
      <section className="tm-section">
        <div className="tm-section-header">
          <div className="tm-section-title">Trending Searches</div>
          <div className="flex gap-sm">
            <button style={{ background: 'white', border: '1px solid #ccc', padding: '4px 12px', cursor: 'pointer' }}>&larr;</button>
            <button style={{ background: 'white', border: '1px solid #ccc', padding: '4px 12px', cursor: 'pointer' }}>&rarr;</button>
          </div>
        </div>
        <div className="tm-scroll-wrapper">
          <div className="tm-trending-card">
            <div className="tm-trending-img" style={{ backgroundImage: 'url(https://picsum.photos/seed/latin1/400/300)' }}></div>
            <div className="tm-trending-genre">LATIN</div>
            <div className="tm-trending-title">Young Miko</div>
          </div>
          <div className="tm-trending-card">
            <div className="tm-trending-img" style={{ backgroundImage: 'url(https://picsum.photos/seed/pop2/400/300)' }}></div>
            <div className="tm-trending-genre">POP</div>
            <div className="tm-trending-title">Bruno Mars</div>
          </div>
          <div className="tm-trending-card">
            <div className="tm-trending-img" style={{ backgroundImage: 'url(https://picsum.photos/seed/metal3/400/300)' }}></div>
            <div className="tm-trending-genre">METAL</div>
            <div className="tm-trending-title">Metallica</div>
          </div>
          <div className="tm-trending-card">
            <div className="tm-trending-img" style={{ backgroundImage: 'url(https://picsum.photos/seed/racing4/400/300)' }}></div>
            <div className="tm-trending-genre">MOTORSPORTS/RACING</div>
            <div className="tm-trending-title">Monster Jam</div>
          </div>
          <div className="tm-trending-card">
            <div className="tm-trending-img" style={{ backgroundImage: 'url(https://picsum.photos/seed/pop5/400/300)' }}></div>
            <div className="tm-trending-genre">POP</div>
            <div className="tm-trending-title">Shakira</div>
          </div>
        </div>
      </section>

      {/* Section 2: Sponsored Presales and Offers */}
      <section className="tm-section" style={{ paddingTop: 0 }}>
        <div className="tm-section-header">
          <div className="tm-section-title">Sponsored Presales and Offers</div>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#026cdf', cursor: 'pointer' }}>Near Select your location ∨</div>
        </div>
        <div className="grid-3" style={{ gap: '24px' }}>
          
          <div className="tm-presale-card">
            <div className="tm-presale-img" style={{ backgroundImage: 'url(https://picsum.photos/seed/presale1/600/340)' }}>
              <span className="tm-badge-presale">Presale</span>
            </div>
            <div className="tm-presale-body">
              <div className="tm-presale-date">THU • NOV 05 • 8:00 PM</div>
              <div className="tm-presale-title">Young Miko - Late Checkout Tour</div>
              <div className="tm-presale-venue">Brooklyn, NY • Barclays Center</div>
            </div>
          </div>

          <div className="tm-presale-card">
            <div className="tm-presale-img" style={{ backgroundImage: 'url(https://picsum.photos/seed/presale2/600/340)' }}>
              <span className="tm-badge-presale">Presale</span>
            </div>
            <div className="tm-presale-body">
              <div className="tm-presale-date">WED • SEP 02 • 7:30 PM</div>
              <div className="tm-presale-title">BABYMETAL WORLD TOUR 2026</div>
              <div className="tm-presale-venue">Denver, CO • Ball Arena</div>
            </div>
          </div>

          <div className="tm-presale-card">
            <div className="tm-presale-img" style={{ backgroundImage: 'url(https://picsum.photos/seed/presale3/600/340)' }}>
              <span className="tm-badge-presale">Presale</span>
            </div>
            <div className="tm-presale-body">
              <div className="tm-presale-date">THU • AUG 13 • 7:00 PM</div>
              <div className="tm-presale-title">Santana & The Doobie Brothers - Oneness Tour</div>
              <div className="tm-presale-venue">Hollywood, CA • Hollywood Bowl</div>
            </div>
          </div>

        </div>
      </section>

      {/* Section 3: Popular Near You */}
      <section className="tm-section" style={{ paddingTop: 0 }}>
        <div className="tm-section-header">
          <div className="tm-section-title" style={{ borderBottom: 'none' }}>Popular Near You</div>
        </div>

        {/* Sub-section: Concerts */}
        <div style={{ marginBottom: '40px' }}>
          <div className="flex-between" style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>CONCERTS</h3>
            <div className="flex align-center gap-sm">
              <button style={{ background: 'white', border: '1px solid #ccc', padding: '4px 12px', fontSize: '0.8rem', fontWeight: 600 }}>See All</button>
              <button style={{ background: 'white', border: '1px solid #ccc', padding: '4px 12px', cursor: 'pointer' }}>&larr;</button>
              <button style={{ background: 'white', border: '1px solid #ccc', padding: '4px 12px', cursor: 'pointer' }}>&rarr;</button>
            </div>
          </div>
          <div className="tm-scroll-wrapper">
            {events.filter(e => !e.category || ['CONCERTS', 'POP', 'WORLD', 'ROCK'].includes(e.category.toUpperCase())).slice(0, 5).map(event => (
              <Link to={`/events/${event.id}`} key={event.id}>
                <div className="tm-presale-card" style={{ minWidth: '350px' }}>
                  <div className="tm-presale-img" style={{ backgroundImage: `url(${event.bannerUrl || 'https://picsum.photos/seed/event' + event.id + '/600/340'})` }}></div>
                  <div className="tm-presale-body">
                    <div className="tm-trending-genre">POP / ROCK</div>
                    <div className="tm-trending-title">{event.name}</div>
                    <div className="tm-presale-venue" style={{ marginTop: '4px' }}>
                      <Calendar size={12} style={{display:'inline', marginRight: '4px'}}/>{formatDate(event.eventDate)}<br/>
                      <MapPin size={12} style={{display:'inline', marginRight: '4px'}}/>{event.venue || event.city || 'TBA'}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
            {loading && <div className="tm-trending-title">Loading events...</div>}
            {!loading && events.filter(e => !e.category || ['CONCERTS', 'POP', 'WORLD', 'ROCK'].includes(e.category.toUpperCase())).length === 0 && <div className="tm-trending-title" style={{ padding: '20px' }}>No concerts happening soon.</div>}
          </div>
        </div>

        {/* Sub-section: Sports */}
        <div style={{ marginBottom: '40px' }}>
          <div className="flex-between" style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>SPORTS</h3>
            <div className="flex align-center gap-sm">
              <button style={{ background: 'white', border: '1px solid #ccc', padding: '4px 12px', fontSize: '0.8rem', fontWeight: 600 }}>See All</button>
              <button style={{ background: 'white', border: '1px solid #ccc', padding: '4px 12px', cursor: 'pointer' }}>&larr;</button>
              <button style={{ background: 'white', border: '1px solid #ccc', padding: '4px 12px', cursor: 'pointer' }}>&rarr;</button>
            </div>
          </div>
          <div className="tm-scroll-wrapper">
            {/* Hardcoded mocks to match the 4th screenshot exactly since DB might not have them */}
            <div className="tm-presale-card" style={{ minWidth: '350px' }}>
              <div className="tm-presale-img" style={{ backgroundImage: 'url(https://picsum.photos/seed/soccer1/600/340)' }}></div>
              <div className="tm-presale-body">
                <div className="tm-trending-genre">SOCCER</div>
                <div className="tm-trending-title">2026 Soccer World Cup</div>
              </div>
            </div>
            <div className="tm-presale-card" style={{ minWidth: '350px' }}>
              <div className="tm-presale-img" style={{ backgroundImage: 'url(https://picsum.photos/seed/nba2/600/340)' }}></div>
              <div className="tm-presale-body">
                <div className="tm-trending-genre">NBA</div>
                <div className="tm-trending-title">Oklahoma City Thunder</div>
              </div>
            </div>
            <div className="tm-presale-card" style={{ minWidth: '350px' }}>
              <div className="tm-presale-img" style={{ backgroundImage: 'url(https://picsum.photos/seed/nba3/600/340)' }}></div>
              <div className="tm-presale-body">
                <div className="tm-trending-genre">NBA</div>
                <div className="tm-trending-title">New York Knicks</div>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-section: Arts, Theater & Comedy */}
        <div style={{ marginBottom: '40px' }}>
          <div className="flex-between" style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>ARTS, THEATER & COMEDY</h3>
            <div className="flex align-center gap-sm">
              <button style={{ background: 'white', border: '1px solid #ccc', padding: '4px 12px', fontSize: '0.8rem', fontWeight: 600 }}>See All</button>
              <button style={{ background: 'white', border: '1px solid #ccc', padding: '4px 12px', cursor: 'pointer' }}>&larr;</button>
              <button style={{ background: 'white', border: '1px solid #ccc', padding: '4px 12px', cursor: 'pointer' }}>&rarr;</button>
            </div>
          </div>
          <div className="tm-scroll-wrapper">
            <div className="tm-presale-card" style={{ minWidth: '350px' }}>
              <div className="tm-presale-img" style={{ backgroundImage: 'url(https://picsum.photos/seed/hamilton1/600/340)' }}></div>
              <div className="tm-presale-body">
                <div className="tm-trending-genre">MUSICAL</div>
                <div className="tm-trending-title">Hamilton (Touring)</div>
              </div>
            </div>
            <div className="tm-presale-card" style={{ minWidth: '350px' }}>
              <div className="tm-presale-img" style={{ backgroundImage: 'url(https://picsum.photos/seed/hamilton2/600/340)' }}></div>
              <div className="tm-presale-body">
                <div className="tm-trending-genre">MUSICAL</div>
                <div className="tm-trending-title">Hamilton (NY)</div>
              </div>
            </div>
            <div className="tm-presale-card" style={{ minWidth: '350px' }}>
              <div className="tm-presale-img" style={{ backgroundImage: 'url(https://picsum.photos/seed/hamilton3/600/340)' }}></div>
              <div className="tm-presale-body">
                <div className="tm-trending-genre">MUSICAL</div>
                <div className="tm-trending-title">Hamilton (Chicago)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-section: Family */}
        <div style={{ marginBottom: '40px' }}>
          <div className="flex-between" style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>FAMILY</h3>
            <div className="flex align-center gap-sm">
              <button style={{ background: 'white', border: '1px solid #ccc', padding: '4px 12px', fontSize: '0.8rem', fontWeight: 600 }}>See All</button>
              <button style={{ background: 'white', border: '1px solid #ccc', padding: '4px 12px', cursor: 'pointer' }}>&larr;</button>
              <button style={{ background: 'white', border: '1px solid #ccc', padding: '4px 12px', cursor: 'pointer' }}>&rarr;</button>
            </div>
          </div>
          <div className="tm-scroll-wrapper">
            <div className="tm-presale-card" style={{ minWidth: '350px' }}>
              <div className="tm-presale-img" style={{ backgroundImage: 'url(https://picsum.photos/seed/coachella/600/340)' }}></div>
              <div className="tm-presale-body">
                <div className="tm-trending-genre">ALTERNATIVE ROCK</div>
                <div className="tm-trending-title">Coachella Valley Music and Arts...</div>
              </div>
            </div>
            <div className="tm-presale-card" style={{ minWidth: '350px' }}>
              <div className="tm-presale-img" style={{ backgroundImage: 'url(https://picsum.photos/seed/dogshow/600/340)' }}></div>
              <div className="tm-presale-body">
                <div className="tm-trending-genre">OTHER</div>
                <div className="tm-trending-title">Westminster Kennel Club Dog Show</div>
              </div>
            </div>
            <div className="tm-presale-card" style={{ minWidth: '350px' }}>
              <div className="tm-presale-img" style={{ backgroundImage: 'url(https://picsum.photos/seed/circusss/600/340)' }}></div>
              <div className="tm-presale-body">
                <div className="tm-trending-genre">CIRCUS</div>
                <div className="tm-trending-title">Ringling Bros. and Barnum & Bailey...</div>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-section: Entertainment Guides */}
        <div style={{ marginBottom: '40px', borderTop: '2px solid #111', paddingTop: '24px' }}>
          <div className="flex-between" style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>ENTERTAINMENT GUIDES</h3>
            <div className="flex align-center gap-sm">
              <button style={{ background: 'white', border: '1px solid #ccc', padding: '4px 12px', cursor: 'pointer' }}>&larr;</button>
              <button style={{ background: 'white', border: '1px solid #ccc', padding: '4px 12px', cursor: 'pointer' }}>&rarr;</button>
            </div>
          </div>
          <div className="tm-scroll-wrapper">
             <div className="tm-presale-card" style={{ minWidth: '150px' }}>
              <div style={{ width: '100%', height: '80px', background: 'url(https://picsum.photos/seed/nbalogo/200/100) center/cover', borderRadius: '4px' }}></div>
              <div style={{ marginTop: '8px', fontWeight: 700 }}>NBA</div>
            </div>
             <div className="tm-presale-card" style={{ minWidth: '150px' }}>
              <div style={{ width: '100%', height: '80px', background: 'url(https://picsum.photos/seed/nhllogo/200/100) center/cover', borderRadius: '4px' }}></div>
              <div style={{ marginTop: '8px', fontWeight: 700 }}>NHL</div>
            </div>
             <div className="tm-presale-card" style={{ minWidth: '150px' }}>
              <div style={{ width: '100%', height: '80px', background: 'url(https://picsum.photos/seed/mlslogo/200/100) center/cover', borderRadius: '4px' }}></div>
              <div style={{ marginTop: '8px', fontWeight: 700 }}>MLS</div>
            </div>
             <div className="tm-presale-card" style={{ minWidth: '150px' }}>
              <div style={{ width: '100%', height: '80px', background: 'url(https://picsum.photos/seed/mlblogo/200/100) center/cover', borderRadius: '4px' }}></div>
              <div style={{ marginTop: '8px', fontWeight: 700 }}>MLB</div>
            </div>
             <div className="tm-presale-card" style={{ minWidth: '150px' }}>
              <div style={{ width: '100%', height: '80px', background: 'url(https://picsum.photos/seed/worldcuplogo/200/100) center/cover', borderRadius: '4px' }}></div>
              <div style={{ marginTop: '8px', fontWeight: 700 }}>World Cup</div>
            </div>
          </div>
        </div>

      </section>

      {/* Section 4: Discover More */}
      <section className="tm-section" style={{ paddingTop: 0, paddingBottom: '60px' }}>
        <div className="tm-section-header">
          <div className="tm-section-title">DISCOVER MORE</div>
        </div>
        <div className="grid-3" style={{ gap: '24px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ width: '100%', height: '180px', background: 'url(https://picsum.photos/seed/discover1/600/300) center/cover', borderRadius: '4px', marginBottom: '12px' }}></div>
            <div style={{ fontSize: '0.8rem', color: '#666', fontWeight: 700, marginBottom: '8px' }}>SPORTS</div>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '8px' }}>A Look at the 2026 MLB Schedule and...</h4>
            <p style={{ color: '#555', fontSize: '1rem', lineHeight: 1.5, marginBottom: '16px' }}>MLB's 2026 season is bringing big schedule changes and new rules. Here...</p>
            <a href="#" style={{ color: '#026cdf', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none' }}>DISCOVER MORE</a>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ width: '100%', height: '180px', background: 'url(https://picsum.photos/seed/discover2/600/300) center/cover', borderRadius: '4px', marginBottom: '12px' }}></div>
            <div style={{ fontSize: '0.8rem', color: '#666', fontWeight: 700, marginBottom: '8px' }}>TICKET TIPS</div>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '8px' }}>You Got the Tickets! How To Safely Share...</h4>
            <p style={{ color: '#555', fontSize: '1rem', lineHeight: 1.5, marginBottom: '16px' }}>Snagged your tickets? Here's how to share the excitement online without...</p>
            <a href="#" style={{ color: '#026cdf', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none' }}>DISCOVER MORE</a>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ width: '100%', height: '180px', background: 'url(https://picsum.photos/seed/discover3/600/300) center/cover', borderRadius: '4px', marginBottom: '12px' }}></div>
            <div style={{ fontSize: '0.8rem', color: '#666', fontWeight: 700, marginBottom: '8px' }}>TICKET TIPS</div>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '8px' }}>Find the Seats You Want</h4>
            <p style={{ color: '#555', fontSize: '1rem', lineHeight: 1.5, marginBottom: '16px' }}>Find the right view, compare prices, and shop seats with confidence using...</p>
            <a href="#" style={{ color: '#026cdf', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none' }}>DISCOVER MORE</a>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ width: '100%', height: '180px', background: 'url(https://picsum.photos/seed/discover4/600/300) center/cover', borderRadius: '4px', marginBottom: '12px' }}></div>
            <div style={{ fontSize: '0.8rem', color: '#666', fontWeight: 700, marginBottom: '8px' }}>ARTS & THEATER</div>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '8px' }}>7 Broadway Shows to See This Spring...</h4>
            <p style={{ color: '#555', fontSize: '1rem', lineHeight: 1.5, marginBottom: '16px' }}>Need ideas for family activities in NYC this spring? Here are the best...</p>
            <a href="#" style={{ color: '#026cdf', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none' }}>DISCOVER MORE</a>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ width: '100%', height: '180px', background: 'url(https://picsum.photos/seed/discover5/600/300) center/cover', borderRadius: '4px', marginBottom: '12px' }}></div>
            <div style={{ fontSize: '0.8rem', color: '#666', fontWeight: 700, marginBottom: '8px' }}>SPORTS</div>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '8px' }}>2026 Soccer World Cup: Everything You...</h4>
            <p style={{ color: '#555', fontSize: '1rem', lineHeight: 1.5, marginBottom: '16px' }}>Find tips on how to buy World Cup tickets and catch a piece of the on-pit...</p>
            <a href="#" style={{ color: '#026cdf', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none' }}>DISCOVER MORE</a>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', background: '#f5f5f5',  borderRadius: '4px', padding: '24px' }}>
             <h4 style={{ fontSize: '3rem', fontWeight: 900, color: '#026cdf', marginBottom: '8px', fontStyle: 'italic', lineHeight: 1 }}>WHAT<br/>TO SEE</h4>
             <div style={{ fontSize: '0.8rem', color: '#666', fontWeight: 700, marginBottom: '8px', marginTop: 'auto' }}>MUSIC</div>
             <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '8px' }}>Sign Up For What To See</h4>
             <p style={{ color: '#555', fontSize: '1rem', lineHeight: 1.5, marginBottom: '16px' }}>Get the Ticketmaster newsletter that covers what's happening live...</p>
             <a href="#" style={{ color: '#026cdf', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none' }}>DISCOVER MORE</a>
          </div>

        </div>
      </section>
    </div>
  );
}
