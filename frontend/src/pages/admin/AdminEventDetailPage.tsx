import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { adminApi, eventApi } from '../../api';
import { EventResponse, EventStats, Demographics } from '../../types';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useLanguage } from '../../i18n';

const COLORS = ['#6366f1', '#ec4899', '#22c55e', '#f59e0b', '#3b82f6'];

export default function AdminEventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventResponse | null>(null);
  const [stats, setStats] = useState<EventStats | null>(null);
  const [demographics, setDemographics] = useState<Demographics | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    if (!id) return;
    const eid = Number(id);
    Promise.all([
      eventApi.get(eid),
      adminApi.eventStats(eid),
      adminApi.demographics(eid),
    ]).then(([eventRes, statsRes, demoRes]) => {
      setEvent(eventRes.data.data);
      setStats(statsRes.data.data as any);
      setDemographics(demoRes.data.data as any);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex-1 pt-20 text-center flex justify-center"><div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div></div>;
  if (!event) return <div className="flex-1 pt-20 text-center"><div className="container mx-auto"><div className="bg-gray-50 p-10 text-center rounded-xl border border-gray-200 text-gray-500 font-medium">{t('eventDetail.eventNotFound')}</div></div></div>;

  const genderData = demographics?.gender ? Object.entries(demographics.gender).map(([name, value]) => ({ name, value })) : [];
  const ageData = demographics?.ageGroups ? Object.entries(demographics.ageGroups).map(([name, value]) => ({ name, value })) : [];

  return (
    <div className="flex-1 py-10 bg-gray-50 min-h-screen text-gray-900">
      <div className="container mx-auto px-6 max-w-6xl animate-[fadeIn_0.5s_ease-out]">
        <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-4">
          <div>
            <h1 className="text-3xl font-extrabold">{event.name}</h1>
            <p className="text-gray-500 mt-2">{t('admin.eventStats')}</p>
          </div>
          <Link to="/admin/events" className="px-6 py-2 bg-gray-100 text-gray-700 font-bold rounded-lg border border-gray-200 hover:bg-gray-200 transition-colors">{t('admin.goBack')}</Link>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center justify-center">
            <div className="text-3xl font-black text-gray-800 mb-2">{stats?.totalSeats || 0}</div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t('admin.totalSeats')}</div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center justify-center">
            <div className="text-3xl font-black text-green-500 mb-2">{stats?.soldSeats || 0}</div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t('admin.soldSeats')}</div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center justify-center">
            <div className="text-3xl font-black text-yellow-500 mb-2">{stats?.lockedSeats || 0}</div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t('admin.holding')}</div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center justify-center">
            <div className="text-3xl font-black text-blue-600 mb-2">
              {((stats?.revenue || 0) as number).toLocaleString('vi-VN')}₫
            </div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t('admin.revenue')}</div>
          </div>
        </div>

        {/* Occupancy */}
        {stats && (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mb-8">
            <h3 className="text-xl font-extrabold mb-4">{t('admin.occupancyRate')}</h3>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
              <div className="h-full rounded-full transition-all duration-1000 ease-in-out" style={{
                width: `${stats.occupancyRate}%`,
                background: stats.occupancyRate > 80 ? '#ef4444' : stats.occupancyRate > 50 ? '#f59e0b' : '#22c55e',
              }} />
            </div>
            <p className="mt-3 text-gray-500 text-sm font-medium">
              {stats.occupancyRate?.toFixed(1)}% {t('admin.soldOf')} ({stats.soldSeats}/{stats.totalSeats} {t('admin.seats')})
            </p>
          </div>
        )}

        {/* Zone Breakdown */}
        {event.zones && event.zones.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mb-8">
            <h3 className="text-xl font-extrabold mb-4">{t('admin.byZone')}</h3>
            <div className="flex flex-col gap-3">
              {event.zones.map(zone => {
                const sold = zone.totalSeats - zone.availableSeats;
                const pct = zone.totalSeats > 0 ? (sold / zone.totalSeats) * 100 : 0;
                return (
                  <div key={zone.id} className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded bg-blue-500 flex-shrink-0" style={{ background: zone.color }} />
                    <span className="w-24 font-bold text-gray-700 truncate">{zone.name}</span>
                    <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: zone.color }} />
                    </div>
                    <span className="w-20 text-right text-sm font-medium text-gray-500">
                      {sold}/{zone.totalSeats}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Demographics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
            <h3 className="text-xl font-extrabold mb-6 text-center">{t('admin.genderDemographics')}</h3>
            {genderData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={genderData} dataKey="value" nameKey="name" cx="50%" cy="50%"
                    innerRadius={70} outerRadius={100} paddingAngle={4}>
                    {genderData.map((_, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : <div className="bg-gray-50 p-10 text-center rounded-xl border border-gray-200 text-gray-500 font-medium"><p>{t('admin.noData')}</p></div>}
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
            <h3 className="text-xl font-extrabold mb-6 text-center">{t('admin.ageDemographics')}</h3>
            {ageData.some(d => d.value > 0) ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={ageData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <div className="bg-gray-50 p-10 text-center rounded-xl border border-gray-200 text-gray-500 font-medium"><p>{t('admin.noData')}</p></div>}
          </div>
        </div>
      </div>
    </div>
  );
}
