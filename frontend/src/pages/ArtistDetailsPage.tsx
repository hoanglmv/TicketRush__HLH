import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { eventApi } from '../api';
import { EventResponse } from '../types';
import { useLanguage } from '../i18n';
import { Calendar, MapPin } from 'lucide-react';

const ARTIST_DATA: Record<string, any> = {
  '1': { 
    name: 'Sơn Tùng M-TP', 
    genre: 'POP / R&B', 
    img: '/images/artists/sontung.jpg', 
    desc_en: 'Nguyễn Thanh Tùng, better known by his stage name Sơn Tùng M-TP, is a premier Vietnamese singer, songwriter, and actor. With a massive fandom known as Sky, his record-breaking hits and unique fusion of V-pop, R&B, and electronic music have established him as the "Prince of V-pop". He consistently sets the trend for modern Vietnamese music.',
    desc_vi: 'Nguyễn Thanh Tùng, được biết đến với nghệ danh Sơn Tùng M-TP, là ca sĩ, nhạc sĩ và diễn viên hàng đầu Việt Nam. Với cộng đồng fan khổng lồ (Sky), những bản hit kỷ lục và sự kết hợp độc đáo giữa V-pop, R&B và nhạc điện tử, anh được mệnh danh là "Hoàng tử V-pop". Sơn Tùng luôn là người dẫn đầu xu hướng âm nhạc hiện đại tại Việt Nam.',
    mockEvents: [
      { id: 25, name: 'Sky Tour 2026: The Return', bannerUrl: 'https://picsum.photos/seed/skytour/800/400', eventDate: new Date(Date.now() + 86400000*30).toISOString(), venue: 'Sân vận động Quân khu 7, TP.HCM' },
      { id: 26, name: 'Super Show Countdown', bannerUrl: 'https://picsum.photos/seed/countdown/800/400', eventDate: new Date(Date.now() + 86400000*60).toISOString(), venue: 'Phố đi bộ Nguyễn Huệ' }
    ]
  },
  '2': { 
    name: 'Đen Vâu', 
    genre: 'RAP / HIP-HOP', 
    img: '/images/artists/denvau.jpg', 
    desc_en: 'Nguyễn Đức Cường, known professionally as Đen Vâu or simply Đen, is a Vietnamese rapper and musician. He is highly praised for his poetic lyrics, down-to-earth persona, and meaningful storytelling that deeply resonates with the youth. He is arguably the most commercially successful rap artist in Vietnam.',
    desc_vi: 'Nguyễn Đức Cường, hay còn gọi là Đen Vâu, là nam rapper và nhạc sĩ nổi tiếng người Việt Nam. Đen được công chúng yêu mến bởi những ca từ mộc mạc, đậm chất thơ, và sự gần gũi trong phong cách. Âm nhạc của Đen là những câu chuyện đời thường nhưng sâu sắc, truyền cảm hứng mạnh mẽ cho giới trẻ.',
    mockEvents: [
      { id: 27, name: 'Show của Đen - Hà Nội', bannerUrl: 'https://picsum.photos/seed/showdenhn/800/400', eventDate: new Date(Date.now() + 86400000*45).toISOString(), venue: 'Cung thể thao Quần Ngựa, HN' },
      { id: 28, name: 'Đồng Âm Music Festival', bannerUrl: 'https://picsum.photos/seed/dongam/800/400', eventDate: new Date(Date.now() + 86400000*90).toISOString(), venue: 'Khu du lịch Bửu Long' }
    ]
  },
  '3': { 
    name: 'Vũ.', 
    genre: 'INDIE / POP', 
    img: '/images/artists/vu.jpg', 
    desc_en: 'Thái Vũ, known as Vũ., is a prominent Vietnamese indie pop singer and songwriter. Dubbed the "Indie Prince", he is famous for his melancholic, romantic acoustic ballads and his distinctively warm, soothing voice that captures the hearts of many listeners.',
    desc_vi: 'Thái Vũ, thường được biết đến với nghệ danh Vũ., là một ca sĩ và nhạc sĩ indie pop nổi tiếng. Được mệnh danh là "Hoàng tử Indie", Vũ. nổi tiếng với những bản tình ca buồn, lãng mạn cùng chất giọng ấm áp, đầy tự sự đã chạm đến trái tim của hàng vạn khán giả.',
    mockEvents: [
      { id: 29, name: 'Một Vạn Năm - Live Concert', bannerUrl: 'https://picsum.photos/seed/motvannam/800/400', eventDate: new Date(Date.now() + 86400000*20).toISOString(), venue: 'Nhà hát Hòa Bình, TP.HCM' },
      { id: 30, name: 'Bảo tàng Của Nuối Tiếc', bannerUrl: 'https://picsum.photos/seed/baotang/800/400', eventDate: new Date(Date.now() + 86400000*50).toISOString(), venue: 'Trung tâm Hội nghị Quốc gia, HN' }
    ]
  },
  '4': { 
    name: 'Hà Anh Tuấn', 
    genre: 'POP / R&B', 
    img: '/images/artists/haanhtuan.jpg', 
    desc_en: 'Hà Anh Tuấn is a critically acclaimed Vietnamese singer known for his emotional vocal delivery and highly successful acoustic live concert series like "See Sing Share". His elegant aesthetic and profound music make him an enduring favorite.',
    desc_vi: 'Hà Anh Tuấn là một ca sĩ với giọng hát đầy cảm xúc và tư duy âm nhạc văn minh. Anh đặc biệt thành công với chuỗi dự án live acoustic "See Sing Share" và các liveshow bán sạch vé trong kỷ lục. Âm nhạc của anh mang nét lãng mạn, sâu sắc và đầy chất thơ.',
    mockEvents: [
      { id: 31, name: 'Chân Trời Rực Rỡ - The Glorious Horizon', bannerUrl: 'https://picsum.photos/seed/chantroi/800/400', eventDate: new Date(Date.now() + 86400000*120).toISOString(), venue: 'Sân vận động Ninh Bình' }
    ]
  },
  '5': { 
    name: 'SpaceSpeakers', 
    genre: 'HIP-HOP / EDM', 
    img: '/images/artists/spacespeakers.jpg', 
    desc_en: 'SpaceSpeakers is the most influential hip-hop empire in Vietnam, featuring a powerhouse of producers, rappers, and singers like Touliver, Binz, Rhymastic, JustaTee, and SOOBIN. They shape the modern urban music landscape of the country.',
    desc_vi: 'SpaceSpeakers là "đế chế" Hip-hop và nhạc điện tử có sức ảnh hưởng lớn nhất Việt Nam. Tập hợp những nhà sản xuất, rapper và ca sĩ hàng đầu như Hoàng Touliver, Binz, Rhymastic, JustaTee và SOOBIN, họ là những người định hình sân chơi âm nhạc đương đại.',
    mockEvents: [
      { id: 32, name: 'KOSMIK - Live Concert', bannerUrl: 'https://picsum.photos/seed/kosmik/800/400', eventDate: new Date(Date.now() + 86400000*75).toISOString(), venue: 'Nhà thi đấu Quân khu 7' },
      { id: 33, name: 'Rap Việt All-Star', bannerUrl: 'https://picsum.photos/seed/rapviet/800/400', eventDate: new Date(Date.now() + 86400000*110).toISOString(), venue: 'SECC Quận 7' }
    ]
  },
  '6': { 
    name: 'Ngọt', 
    genre: 'INDIE ROCK', 
    img: '/images/artists/ngot.jpg', 
    desc_en: 'Ngọt is a Vietnamese indie pop/rock band from Hanoi. Formed in 2013, they are widely considered one of the pioneers of the modern Vietnamese indie music scene, known for their catchy melodies and quirky, insightful lyrics.',
    desc_vi: 'Ngọt là ban nhạc indie pop/rock đến từ Hà Nội. Được thành lập năm 2013, Ngọt được xem là một trong những ban nhạc tiên phong của làn sóng nhạc Indie hiện đại tại Việt Nam. Âm nhạc của Ngọt đặc trưng bởi giai điệu bắt tai và ca từ mang tính chiêm nghiệm cao.',
    mockEvents: [
      { id: 34, name: 'Gieo - Album Tour', bannerUrl: 'https://picsum.photos/seed/gieo/800/400', eventDate: new Date(Date.now() + 86400000*15).toISOString(), venue: 'Capital Studio, TP.HCM' }
    ]
  },
};

export default function ArtistDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const artist = id ? ARTIST_DATA[id] : null;
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, locale } = useLanguage();

  useEffect(() => {
    if (artist) {
      setTimeout(() => {
        setEvents(artist.mockEvents || []);
        setLoading(false);
      }, 500);
    } else {
      setLoading(false);
    }
  }, [artist]);

  const formatDate = (d: string) => {
    if (!d) return '';
    const dt = new Date(d);
    const day = dt.getDate().toString().padStart(2, '0');
    const month = (dt.getMonth() + 1).toString().padStart(2, '0');
    const year = dt.getFullYear();
    return `${day}/${month}/${year}`;
  };

  if (!artist) {
    return <div className="page" style={{ padding: '100px', textAlign: 'center', color: 'white' }}><h2>Artist not found</h2></div>;
  }

  const isVi = locale === 'vi';

  return (
    <div style={{ background: '#1f1f1f', minHeight: '100vh', color: 'white' }}>
      {/* Artist Banner */}
      <div style={{ position: 'relative', height: '400px' }}>
        <img src={artist.img} alt={artist.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, #1f1f1f, transparent)', padding: '40px 0 20px 0' }}>
          <div className="container">
            <span style={{ background: '#00b14f', padding: '4px 12px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>{artist.genre}</span>
            <h1 style={{ fontSize: '4rem', fontWeight: 800, margin: '10px 0' }}>{artist.name}</h1>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 0' }}>
        {/* About Section */}
        <div style={{ marginBottom: '60px', maxWidth: '800px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px', borderBottom: '2px solid #333', paddingBottom: '8px' }}>
            {isVi ? `Về ${artist.name}` : `About ${artist.name}`}
          </h2>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#ccc' }}>
            {isVi ? artist.desc_vi : artist.desc_en}
          </p>
        </div>

        {/* Concerts Section */}
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '20px', borderBottom: '2px solid #333', paddingBottom: '8px' }}>
            {isVi ? 'Các Sự Kiện Sắp Tới' : 'Upcoming Concerts'}
          </h2>
          
          {loading ? (
            <div className="loading-container"><div className="spinner" /></div>
          ) : events.length === 0 ? (
            <div style={{ background: '#2a2a2a', padding: '40px', borderRadius: '8px', textAlign: 'center', color: '#888' }}>
              {isVi ? 'Hiện không có sự kiện nào sắp diễn ra của nghệ sĩ này.' : 'No upcoming events found for this artist.'}
            </div>
          ) : (
            <div className="grid-3">
              {events.map(event => (
                <div key={event.id} className="event-card animate-fadeIn">
                  <div className="event-img-container">
                    <img src={event.bannerUrl || 'https://picsum.photos/400/200'} alt={event.name} />
                    <div className="event-date-badge">
                      <div className="month">{new Date(event.eventDate).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}</div>
                      <div className="day">{new Date(event.eventDate).getDate()}</div>
                    </div>
                  </div>
                  <div className="event-content">
                    <h3 className="event-title">{event.name}</h3>
                    <div className="event-details" style={{ color: '#aaa', marginTop: '8px' }}>
                      <p><Calendar size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }}/> {formatDate(event.eventDate)}</p>
                      <p style={{ marginTop: '4px' }}><MapPin size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }}/> {event.venue}</p>
                    </div>
                    <Link to={`/events/${event.id}`} className="btn btn-primary" style={{ display: 'block', textAlign: 'center', marginTop: '16px' }}>
                      {isVi ? 'Xem Chi Tiết' : 'View Details'}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
