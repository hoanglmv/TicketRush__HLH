import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { eventApi } from '../api';
import { EventResponse } from '../types';
import { useLanguage } from '../i18n';

const CITY_DATA: Record<string, { name: string; description: string; banner: string }> = {
  'ho-chi-minh': {
    name: 'TP. Hồ Chí Minh',
    description: 'Thành phố sôi động bậc nhất Việt Nam với hàng loạt sự kiện giải trí và âm nhạc diễn ra mỗi ngày. Hãy cùng khám phá những trải nghiệm không thể bỏ lỡ tại Sài Gòn!',
    banner: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&q=80&w=1920&h=600'
  },
  'ha-noi': {
    name: 'Hà Nội',
    description: 'Thủ đô ngàn năm văn hiến, nơi giao thoa giữa nét đẹp cổ kính và hiện đại. Tận hưởng những đêm nhạc lãng mạn và các sự kiện văn hóa nghệ thuật đặc sắc.',
    banner: 'https://images.unsplash.com/photo-1599708153386-62bf3f035f58?auto=format&fit=crop&q=80&w=1920&h=600'
  },
  'da-lat': {
    name: 'Đà Lạt',
    description: 'Thành phố sương mù lãng mạn - điểm đến lý tưởng cho những show diễn âm nhạc acoustic giữa rừng thông bạt ngàn và thời tiết se lạnh.',
    banner: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&q=80&w=1920&h=600'
  },
  'da-nang': {
    name: 'Đà Nẵng',
    description: 'Thành phố đáng sống nhất Việt Nam với những lễ hội ven biển sôi động, các sự kiện âm nhạc điện tử và pháo hoa quốc tế hoành tráng.',
    banner: 'https://images.unsplash.com/photo-1555931317-a068cd670731?auto=format&fit=crop&q=80&w=1920&h=600'
  }
};

export default function CityPage() {
  const { cityId } = useParams<{ cityId: string }>();
  const [events, setEvents] = useState<EventResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  const cityInfo = cityId ? CITY_DATA[cityId] : null;

  useEffect(() => {
    if (cityInfo) {
      setLoading(true);
      // Fetch events with city filter
      eventApi.search({ city: cityInfo.name })
        .then(res => {
          setEvents(res.data.data || []);
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [cityInfo]);

  if (!cityInfo) {
    return (
      <div className="page container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <h2>Không tìm thấy thành phố!</h2>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '20px' }}>Quay về Trang chủ</Link>
      </div>
    );
  }

  const formatDate = (d: string) => {
    if (!d) return '';
    const dt = new Date(d);
    const day = dt.getDate().toString().padStart(2, '0');
    const month = (dt.getMonth() + 1).toString().padStart(2, '0');
    const year = dt.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh', paddingBottom: '60px' }}>
      
      {/* City Banner */}
      <div style={{ 
        position: 'relative', 
        height: '400px', 
        backgroundImage: `url(${cityInfo.banner})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        textAlign: 'center'
      }}>
        {/* Dark overlay for better text readability */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)'
        }}></div>
        
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', padding: '0 20px' }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '16px', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
            {cityInfo.name}
          </h1>
          <p style={{ fontSize: '1.2rem', lineHeight: 1.6, textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
            {cityInfo.description}
          </p>
        </div>
      </div>

      <div className="container" style={{ marginTop: '40px' }}>
        <div className="section-header">
          <h2 className="section-title">Các Sự kiện sắp diễn ra tại {cityInfo.name}</h2>
        </div>

        {loading ? (
          <div className="loading-container" style={{ minHeight: '200px' }}><div className="spinner" /></div>
        ) : events.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', background: 'white', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <img src="/images/empty-events.svg" alt="No events" style={{ width: '150px', marginBottom: '20px', opacity: 0.5 }} onError={(e) => e.currentTarget.style.display = 'none'} />
            <h3 style={{ fontSize: '1.2rem', color: '#666' }}>Hiện tại chưa có sự kiện nào sắp diễn ra tại {cityInfo.name}.</h3>
            <p style={{ color: '#888', marginTop: '8px' }}>Hãy quay lại sau để cập nhật những sự kiện mới nhất nhé!</p>
          </div>
        ) : (
          <div className="grid-4" style={{ gap: '20px' }}>
            {events.map((event) => (
              <Link to={`/events/${event.id}`} key={event.id} className="tm-portrait-card">
                <div className="tm-portrait-img-wrapper">
                  <img src={event.bannerUrl || 'https://picsum.photos/400/250'} alt={event.name} className="tm-portrait-img" />
                  <div className="tm-portrait-img-overlay">
                    <span className="btn btn-primary" style={{ background: '#00b14f', color: 'white', border: 'none', borderRadius: '4px' }}>
                      {t('home.buyTicket') || 'Mua vé ngay'}
                    </span>
                  </div>
                </div>
                <div className="tm-portrait-title" style={{ marginTop: '12px', fontSize: '1rem', fontWeight: 700, color: '#111' }}>
                  {event.name}
                </div>
                <div className="tm-portrait-date" style={{ color: '#666', fontSize: '0.85rem', marginTop: '8px' }}>
                  <Calendar size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }}/> 
                  {formatDate(event.eventDate)}
                </div>
                <div style={{ color: '#00b14f', fontWeight: 700, marginTop: '8px', fontSize: '0.9rem' }}>
                  {event.category || 'EVENT'}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
