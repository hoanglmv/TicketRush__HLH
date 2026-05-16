import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api';
import { EventResponse } from '../../types';
import { useLanguage } from '../../i18n';

export default function AdminEventListPage() {
  const [events, setEvents] = useState<EventResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const { t } = useLanguage();

  useEffect(() => {
    adminApi.events()
      .then(res => {
        const sortedEvents = (res.data.data || []).sort((a, b) => b.id - a.id);
        setEvents(sortedEvents);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statusColor: Record<string, string> = {
    DRAFT: 'badge-warning', PUBLISHED: 'badge-info', ON_SALE: 'badge-success',
    COMPLETED: 'badge-primary', CANCELLED: 'badge-danger'
  };

  const handleStatusChange = async (eventId: number, status: string) => {
    try {
      await adminApi.updateStatus(eventId, status);
      const res = await adminApi.events();
      setEvents((res.data.data || []).sort((a, b) => b.id - a.id));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDeleteEvent = async (eventId: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sự kiện này không? Mọi dữ liệu (bao gồm cả vé đã đặt nếu có) sẽ bị xóa sạch!')) return;
    try {
      await adminApi.deleteEvent(eventId);
      setEvents(events.filter(e => e.id !== eventId));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Không thể xóa sự kiện');
    }
  };

  const filteredEvents = events.filter(event => {
    const matchSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        (event.venue || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter ? event.status === statusFilter : true;
    return matchSearch && matchStatus;
  });

  if (loading) return <div className="flex-1 pt-20 text-center flex justify-center"><div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div></div>;

  return (
    <div className="flex-1 py-10 bg-[#0a0a0a] min-h-screen text-white">
      <div className="container mx-auto px-6 max-w-6xl animate-[fadeIn_0.5s_ease-out]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-white/10 pb-4 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white">{t('admin.eventManagement')}</h1>
            <p className="text-white/40 mt-2">{t('admin.createAndManage')}</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <input 
              type="text" 
              placeholder="Tìm kiếm sự kiện, địa điểm..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 bg-[#1a1a1a] border border-white/10 text-white rounded-lg px-4 py-2.5 outline-none focus:border-[#00b14f] transition-colors"
            />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-40 bg-[#1a1a1a] border border-white/10 text-white rounded-lg px-4 py-2.5 outline-none focus:border-[#00b14f] transition-colors appearance-none"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="DRAFT">DRAFT</option>
              <option value="PUBLISHED">PUBLISHED</option>
              <option value="ON_SALE">ON_SALE</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
            <Link to="/admin/events/create" className="w-full sm:w-auto text-center px-8 py-3 bg-[#00b14f] text-white font-black uppercase tracking-widest text-xs rounded-lg hover:bg-[#008a3d] transition-all shadow-lg shadow-[#00b14f]/20 whitespace-nowrap">{t('admin.createEvent')}</Link>
          </div>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="bg-[#111111] p-20 text-center rounded-3xl border border-white/5 shadow-2xl text-white/20 font-medium">
            <p className="text-lg uppercase tracking-[0.2em]">{events.length === 0 ? t('admin.noEvents') : 'Không tìm thấy sự kiện phù hợp'}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {filteredEvents.map(event => (
              <div key={event.id} className="bg-[#111111] rounded-2xl border border-white/5 shadow-xl hover:border-white/10 transition-all group overflow-hidden">
                <div className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <h3 className="text-xl font-black text-white group-hover:text-[#00b14f] transition-colors">{event.name}</h3>
                      <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        statusColor[event.status] === 'badge-success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                        statusColor[event.status] === 'badge-warning' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                        statusColor[event.status] === 'badge-info' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                        statusColor[event.status] === 'badge-primary' ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20' :
                        statusColor[event.status] === 'badge-danger' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                        'bg-white/5 text-white/40 border border-white/10'
                      }`}>
                        {event.status}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-white/30 flex flex-wrap gap-6 uppercase tracking-wider">
                      <span className="flex items-center gap-2"><span className="text-[#00b14f]">📍</span> {event.venue || 'TBA'}</span>
                      <span className="flex items-center gap-2"><span className="text-[#00b14f]">📅</span> {event.eventDate ? new Date(event.eventDate).toLocaleDateString('vi-VN') : '—'}</span>
                      <span className="flex items-center gap-2"><span className="text-[#00b14f]">💺</span> {event.soldSeats}/{event.totalSeats} {t('admin.sold')}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Link to={`/admin/events/${event.id}`} className="px-5 py-2.5 bg-white/5 text-white/70 font-black uppercase tracking-widest text-[10px] rounded-lg border border-white/10 hover:bg-white/10 transition-all">
                      {t('admin.details')}
                    </Link>
                    <Link to={`/admin/events/${event.id}/edit`} className="px-5 py-2.5 bg-white/5 text-white/70 font-black uppercase tracking-widest text-[10px] rounded-lg border border-white/10 hover:bg-white/10 transition-all">
                      Sửa
                    </Link>
                    {event.status === 'DRAFT' && (
                      <button className="px-5 py-2.5 bg-blue-600 text-white font-black uppercase tracking-widest text-[10px] rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20" onClick={() => handleStatusChange(event.id, 'PUBLISHED')}>
                        {t('admin.publish')}
                      </button>
                    )}
                    {event.status === 'PUBLISHED' && (
                      <button className="px-5 py-2.5 bg-[#00b14f] text-white font-black uppercase tracking-widest text-[10px] rounded-lg hover:bg-[#008a3d] transition-all shadow-lg shadow-[#00b14f]/20" onClick={() => handleStatusChange(event.id, 'ON_SALE')}>
                        {t('admin.openSale')}
                      </button>
                    )}
                    {event.status === 'ON_SALE' && (
                      <button className="px-5 py-2.5 bg-white/10 text-white font-black uppercase tracking-widest text-[10px] rounded-lg hover:bg-white/20 transition-all" onClick={() => handleStatusChange(event.id, 'COMPLETED')}>
                        {t('admin.complete')}
                      </button>
                    )}
                    <button className="px-5 py-2.5 bg-red-600/10 text-red-500 font-black uppercase tracking-widest text-[10px] rounded-lg border border-red-500/20 hover:bg-red-500 hover:text-white transition-all" onClick={() => handleDeleteEvent(event.id)}>
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
