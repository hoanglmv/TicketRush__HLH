import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, MapPin } from 'lucide-react';
import { eventApi } from '../api';
import { EventResponse } from '../types';
import { useSettings } from '../contexts/SettingsContext';
import { useLanguage } from '../i18n';

export default function HomePage() {
  const [events, setEvents] = useState<EventResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Drag to scroll logic
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const navigate = useNavigate();
  const { settings } = useSettings();
  const { t, locale } = useLanguage();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === 0 ? 1 : 0));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    eventApi.list().then(res => {
      setEvents(res.data.data || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const formatDate = (d: string) => {
    if (!d) return '';
    const dt = new Date(d);
    const day = dt.getDate().toString().padStart(2, '0');
    const month = (dt.getMonth() + 1).toString().padStart(2, '0');
    const year = dt.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDown(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };
  const handleMouseLeave = () => setIsDown(false);
  const handleMouseUp = () => setIsDown(false);
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div style={{ background: '#1f1f1f', minHeight: '100vh', paddingBottom: '60px' }}>
      <div className="container">
        
        {/* Ticketbox Carousel */}
        <div className="tb-carousel-container" style={{ position: 'relative' }}>
          <div className="tb-carousel-inner" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
            <div className="tb-carousel-item" onClick={() => navigate(settings['tb_banner_1_link'] || '/events')}>
              <img src={settings['tb_banner_1_img'] || "https://picsum.photos/seed/tb1/800/400"} alt="Banner 1" />
              <div className="tb-carousel-content">
                <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px' }}>{settings['tb_banner_1_title'] || t('home.featuredEvents')}</h2>
                <button className="tb-btn-outline">{t('home.viewDetails')}</button>
              </div>
            </div>
            <div className="tb-carousel-item" onClick={() => navigate(settings['tb_banner_2_link'] || '/events')}>
              <img src={settings['tb_banner_2_img'] || "https://picsum.photos/seed/tb2/800/400"} alt="Banner 2" />
              <div className="tb-carousel-content">
                <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px' }}>{settings['tb_banner_2_title'] || 'VinhVerse Concert'}</h2>
                <button className="tb-btn-outline">{t('home.viewDetails')}</button>
              </div>
            </div>
          </div>
          
          {/* Dots Indicator */}
          <div style={{ position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px' }}>
            <div onClick={(e) => { e.stopPropagation(); setCurrentSlide(0); }} style={{ width: '12px', height: '12px', borderRadius: '50%', background: currentSlide === 0 ? 'white' : 'rgba(255,255,255,0.5)', cursor: 'pointer', transition: 'background 0.3s' }}></div>
            <div onClick={(e) => { e.stopPropagation(); setCurrentSlide(1); }} style={{ width: '12px', height: '12px', borderRadius: '50%', background: currentSlide === 1 ? 'white' : 'rgba(255,255,255,0.5)', cursor: 'pointer', transition: 'background 0.3s' }}></div>
          </div>
        </div>

        {/* Section: Trending Searches */}
        <div style={{ marginTop: '40px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {t('home.trendingSearches') || 'Trending Searches'}
          </h2>
          <div 
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '16px', cursor: isDown ? 'grabbing' : 'grab' }} 
            className="hide-scrollbar"
          >
            {[
              { id: 1, name: 'Sơn Tùng M-TP', genre: 'POP', img: '/images/artists/sontung.jpg' },
              { id: 2, name: 'Đen Vâu', genre: 'RAP', img: '/images/artists/denvau.jpg' },
              { id: 3, name: 'Vũ.', genre: 'INDIE', img: '/images/artists/vu.jpg' },
              { id: 4, name: 'Hà Anh Tuấn', genre: 'POP', img: '/images/artists/haanhtuan.jpg' },
              { id: 5, name: 'SpaceSpeakers', genre: 'HIP-HOP', img: '/images/artists/spacespeakers.jpg' },
              { id: 6, name: 'Ngọt', genre: 'INDIE', img: '/images/artists/ngot.jpg' },
            ].map(artist => (
              <div key={artist.id} className="tm-trending-item" onClick={() => navigate(`/artist/${artist.id}`)}>
                <img src={artist.img} alt={artist.name} className="tm-trending-img" draggable="false" />
                <div className="tm-trending-genre">{artist.genre}</div>
                <div className="tm-trending-name">{artist.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Section: Nhạc sống */}
        <div style={{ marginTop: '40px' }}>
          <div className="section-header">
            <div className="section-title">Nhạc sống</div>
            <Link to="/events?category=LIVE_MUSIC" className="section-link">Xem thêm &gt;</Link>
          </div>
          <div className="grid-4" style={{ gap: '20px' }}>
            {[
              { id: 5, title: '[NUNA NU NONG X BLUE AQUARIUM] XƯƠNG RỒNG LOVE YOU', price: '800.000đ', date: '06 tháng 06, 2026', img: 'https://picsum.photos/seed/ns1/400/250' },
              { id: 6, title: 'BADASS CITY 2026 - Saigon Hiphop Festival', price: '250.000đ', date: '16 tháng 05, 2026', img: 'https://picsum.photos/seed/ns2/400/250' },
              { id: 7, title: '2026 KIM SUNG KYU LIVE [LV4: LEAP to VECTOR] IN HO CHI MINH CITY', price: '2.500.000đ', date: '13 tháng 06, 2026', img: 'https://picsum.photos/seed/ns3/400/250' },
              { id: 8, title: '[BẾN THÀNH] Đêm nhạc Minh Tuyết - Hoàng Hải', price: '500.000đ', date: '28 tháng 04, 2026', img: 'https://picsum.photos/seed/ns4/400/250' },
            ].map(item => (
              <Link to={`/events/${item.id}`} key={item.id} className="tm-portrait-card">
                <div className="tm-portrait-img-wrapper">
                  <img src={item.img} alt={item.title} className="tm-portrait-img" />
                  <div className="tm-portrait-img-overlay">
                    <span className="btn btn-primary" style={{ background: '#00b14f', color: 'white', border: 'none', borderRadius: '4px' }}>{t('home.buyTicket') || 'Mua vé ngay'}</span>
                  </div>
                </div>
                <div className="tm-portrait-title">{item.title}</div>
                <div className="tm-portrait-price">Từ {item.price}</div>
                <div className="tm-portrait-date"><Calendar size={12} style={{ display: 'inline', marginRight: '4px' }}/> {item.date}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Section: Sân khấu & Nghệ thuật */}
        <div style={{ marginTop: '40px' }}>
          <div className="section-header">
            <div className="section-title">Sân khấu & Nghệ thuật</div>
            <Link to="/events?category=ARTS" className="section-link">Xem thêm &gt;</Link>
          </div>
          <div className="grid-4" style={{ gap: '20px' }}>
            {[
              { id: 9, title: 'ART WORKSHOP "SAKURA BLOSSOM WHITE CHOCOLATE MOUSSE CAKE"', price: '420.000đ', date: '29 tháng 04, 2026', img: 'https://picsum.photos/seed/sk1/400/250' },
              { id: 10, title: 'Thanh Gươm Và Bà Mẹ', price: '200.000đ', date: '27 tháng 04, 2026', img: 'https://picsum.photos/seed/sk2/400/250' },
              { id: 11, title: 'Chào Show', price: '1.040.000đ', date: '28 tháng 04, 2026', img: 'https://picsum.photos/seed/sk3/400/250' },
              { id: 12, title: 'ART WORKSHOP "UJI MATCHA CHEESECAKE TARTE"', price: '420.000đ', date: '29 tháng 04, 2026', img: 'https://picsum.photos/seed/sk4/400/250' },
            ].map(item => (
              <Link to={`/events/${item.id}`} key={item.id} className="tm-portrait-card">
                <div className="tm-portrait-img-wrapper">
                  <img src={item.img} alt={item.title} className="tm-portrait-img" />
                  <div className="tm-portrait-img-overlay">
                    <span className="btn btn-primary" style={{ background: '#00b14f', color: 'white', border: 'none', borderRadius: '4px' }}>{t('home.buyTicket') || 'Mua vé ngay'}</span>
                  </div>
                </div>
                <div className="tm-portrait-title">{item.title}</div>
                <div className="tm-portrait-price">Từ {item.price}</div>
                <div className="tm-portrait-date"><Calendar size={12} style={{ display: 'inline', marginRight: '4px' }}/> {item.date}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Section: Hội thảo & Workshop */}
        <div style={{ marginTop: '40px' }}>
          <div className="section-header">
            <div className="section-title">Hội thảo & Workshop</div>
            <Link to="/events?category=WORKSHOP" className="section-link">Xem thêm &gt;</Link>
          </div>
          <div className="grid-4" style={{ gap: '20px' }}>
            {[
              { id: 13, title: 'WORKSHOP NẤU ĂN ẤN ĐỘ - INDIAN COOKING EXPERIENCE', price: '500.000đ', date: '16 tháng 05, 2026', img: 'https://picsum.photos/seed/ht1/400/250' },
              { id: 14, title: 'ART WORKSHOP "BLUSH & BERRIES CHARLOTTE"', price: '420.000đ', date: '30 tháng 04, 2026', img: 'https://picsum.photos/seed/ht2/400/250' },
              { id: 15, title: 'ART WORKSHOP THÊU TÚI "HOA TRONG LÒNG"', price: '370.000đ', date: '02 tháng 05, 2026', img: 'https://picsum.photos/seed/ht3/400/250' },
              { id: 16, title: 'GSTAR SUMMIT: AI & HUMANITY 2026', price: '1.200.000đ', date: '29 tháng 05, 2026', img: 'https://picsum.photos/seed/ht4/400/250' },
            ].map(item => (
              <Link to={`/events/${item.id}`} key={item.id} className="tm-portrait-card">
                <div className="tm-portrait-img-wrapper">
                  <img src={item.img} alt={item.title} className="tm-portrait-img" />
                  <div className="tm-portrait-img-overlay">
                    <span className="btn btn-primary" style={{ background: '#00b14f', color: 'white', border: 'none', borderRadius: '4px' }}>{t('home.buyTicket') || 'Mua vé ngay'}</span>
                  </div>
                </div>
                <div className="tm-portrait-title">{item.title}</div>
                <div className="tm-portrait-price">Từ {item.price}</div>
                <div className="tm-portrait-date"><Calendar size={12} style={{ display: 'inline', marginRight: '4px' }}/> {item.date}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Section: Tham quan & Trải nghiệm */}
        <div style={{ marginTop: '40px' }}>
          <div className="section-header">
            <div className="section-title">Tham quan & Trải nghiệm</div>
            <Link to="/events?category=EXPERIENCE" className="section-link">Xem thêm &gt;</Link>
          </div>
          <div className="grid-4" style={{ gap: '20px' }}>
            {[
              { id: 17, title: 'VÉ CỔNG VÀ COMBO DU LỊCH VĂN HÓA SUỐI TIÊN', price: '150.000đ', date: '01 tháng 04, 2026', img: 'https://picsum.photos/seed/tq1/400/250' },
              { id: 18, title: 'Vé Trải Nghiệm Khu Vui Chơi Hướng Nghiệp KidZania Hà Nội', price: '250.000đ', date: '27 tháng 04, 2026', img: 'https://picsum.photos/seed/tq2/400/250' },
              { id: 19, title: 'Sự kiện trải nghiệm tiệc cưới Sensation of I DO tại White Palace HVT', price: '700.000đ', date: '23 tháng 05, 2026', img: 'https://picsum.photos/seed/tq3/400/250' },
              { id: 20, title: 'Sự kiện trải nghiệm tiệc cưới Sensation of I DO tại White Palace PVD', price: '700.000đ', date: '16 tháng 05, 2026', img: 'https://picsum.photos/seed/tq4/400/250' },
            ].map(item => (
              <Link to={`/events/${item.id}`} key={item.id} className="tm-portrait-card">
                <div className="tm-portrait-img-wrapper">
                  <img src={item.img} alt={item.title} className="tm-portrait-img" />
                  <div className="tm-portrait-img-overlay">
                    <span className="btn btn-primary" style={{ background: '#00b14f', color: 'white', border: 'none', borderRadius: '4px' }}>{t('home.buyTicket') || 'Mua vé ngay'}</span>
                  </div>
                </div>
                <div className="tm-portrait-title">{item.title}</div>
                <div className="tm-portrait-price">Từ {item.price}</div>
                <div className="tm-portrait-date"><Calendar size={12} style={{ display: 'inline', marginRight: '4px' }}/> {item.date}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Section: Thể thao & Thể loại khác */}
        <div style={{ marginTop: '40px' }}>
          <div className="section-header">
            <div className="section-title">Thể thao & Thể loại khác</div>
            <Link to="/events?category=SPORTS" className="section-link">Xem thêm &gt;</Link>
          </div>
          <div className="grid-4" style={{ gap: '20px' }}>
            {[
              { id: 21, title: 'Trải nghiệm bay dù lượn cùng phi công tại Sapa', price: '2.000.000đ', date: '28 tháng 01, 2026', img: 'https://picsum.photos/seed/tt1/400/250' },
              { id: 22, title: 'PHÂN TÍCH DỮ LIỆU VỚI POWER BI - TỐI ƯU HÓA HOẠT ĐỘNG KINH DOANH', price: '999.000đ', date: '06 tháng 04, 2026', img: 'https://picsum.photos/seed/tt2/400/250' },
              { id: 23, title: 'PPA ASIA 1000 - MB HANOI CUP 2026 OFFICIAL MERCHANDISE', price: '45.000đ', date: '08 tháng 04, 2026', img: 'https://picsum.photos/seed/tt3/400/250' },
              { id: 24, title: 'VCT Pacific Stage 1 Finals: Ho Chi Minh', price: '399.000đ', date: '15 tháng 05, 2026', img: 'https://picsum.photos/seed/tt4/400/250' },
            ].map(item => (
              <Link to={`/events/${item.id}`} key={item.id} className="tm-portrait-card">
                <div className="tm-portrait-img-wrapper">
                  <img src={item.img} alt={item.title} className="tm-portrait-img" />
                  <div className="tm-portrait-img-overlay">
                    <span className="btn btn-primary" style={{ background: '#00b14f', color: 'white', border: 'none', borderRadius: '4px' }}>{t('home.buyTicket') || 'Mua vé ngay'}</span>
                  </div>
                </div>
                <div className="tm-portrait-title">{item.title}</div>
                <div className="tm-portrait-price">Từ {item.price}</div>
                <div className="tm-portrait-date"><Calendar size={12} style={{ display: 'inline', marginRight: '4px' }}/> {item.date}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Section: Điểm đến thú vị */}
        <div style={{ marginTop: '40px' }}>
          <div className="section-header">
            <div className="section-title">Điểm đến thú vị</div>
          </div>
          <div className="grid-4" style={{ gap: '20px' }}>
            {[
              { id: 'ho-chi-minh', title: 'Tp. Hồ Chí Minh', img: 'https://picsum.photos/seed/hcm/400/400' },
              { id: 'ha-noi', title: 'Hà Nội', img: 'https://picsum.photos/seed/hn/400/400' },
              { id: 'da-lat', title: 'Đà Lạt', img: 'https://picsum.photos/seed/dl/400/400' },
              { id: 'da-nang', title: 'Đà Nẵng', img: 'https://picsum.photos/seed/dn/400/400' },
            ].map(item => (
              <Link to={`/city/${item.id}`} key={item.id} className="tm-dest-card">
                <img src={item.img} alt={item.title} className="tm-dest-img" />
                <div className="tm-dest-overlay">
                  {item.title}
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
