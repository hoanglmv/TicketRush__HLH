import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { adminApi, eventApi } from '../../api';
import { EventResponse, EventStats, Demographics } from '../../types';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#6366f1', '#ec4899', '#22c55e', '#f59e0b', '#3b82f6'];

export default function AdminEventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventResponse | null>(null);
  const [stats, setStats] = useState<EventStats | null>(null);
  const [demographics, setDemographics] = useState<Demographics | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="page"><div className="container"><div className="loading-container"><div className="spinner" /></div></div></div>;
  if (!event) return <div className="page"><div className="container"><div className="empty-state">Event not found</div></div></div>;

  const genderData = demographics?.gender ? Object.entries(demographics.gender).map(([name, value]) => ({ name, value })) : [];
  const ageData = demographics?.ageGroups ? Object.entries(demographics.ageGroups).map(([name, value]) => ({ name, value })) : [];

  return (
    <div className="page">
      <div className="container animate-fadeIn">
        <div className="page-header flex-between">
          <div>
            <h1>{event.name}</h1>
            <p>Thống kê chi tiết sự kiện</p>
          </div>
          <Link to="/admin/events" className="btn btn-secondary">← Quay lại</Link>
        </div>

        {/* Stat Cards */}
        <div className="grid-4" style={{ marginBottom: 30 }}>
          <div className="stat-card">
            <div className="stat-value">{stats?.totalSeats || 0}</div>
            <div className="stat-label">Tổng ghế</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: 'var(--success)' }}>{stats?.soldSeats || 0}</div>
            <div className="stat-label">Đã bán</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: 'var(--warning)' }}>{stats?.lockedSeats || 0}</div>
            <div className="stat-label">Đang giữ</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {((stats?.revenue || 0) as number).toLocaleString('vi-VN')}₫
            </div>
            <div className="stat-label">Doanh thu</div>
          </div>
        </div>

        {/* Occupancy */}
        {stats && (
          <div className="glass-card" style={{ marginBottom: 24 }}>
            <h3 style={{ fontWeight: 700, marginBottom: 12 }}>Tỉ lệ lấp đầy</h3>
            <div style={{ height: 8, background: 'var(--bg-input)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 4,
                width: `${stats.occupancyRate}%`,
                background: stats.occupancyRate > 80 ? 'var(--danger)' : stats.occupancyRate > 50 ? 'var(--warning)' : 'var(--success)',
                transition: 'width 1s ease'
              }} />
            </div>
            <p style={{ marginTop: 8, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              {stats.occupancyRate?.toFixed(1)}% đã bán ({stats.soldSeats}/{stats.totalSeats} ghế)
            </p>
          </div>
        )}

        {/* Zone Breakdown */}
        {event.zones && event.zones.length > 0 && (
          <div className="glass-card" style={{ marginBottom: 24 }}>
            <h3 style={{ fontWeight: 700, marginBottom: 12 }}>Theo khu vực</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {event.zones.map(zone => {
                const sold = zone.totalSeats - zone.availableSeats;
                const pct = zone.totalSeats > 0 ? (sold / zone.totalSeats) * 100 : 0;
                return (
                  <div key={zone.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 12, height: 12, borderRadius: 3, background: zone.color, flexShrink: 0 }} />
                    <span style={{ width: 100, fontWeight: 500 }}>{zone.name}</span>
                    <div style={{ flex: 1, height: 6, background: 'var(--bg-input)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: zone.color, borderRadius: 3 }} />
                    </div>
                    <span style={{ width: 80, textAlign: 'right', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {sold}/{zone.totalSeats}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Demographics */}
        <div className="grid-2" style={{ marginBottom: 24 }}>
          <div className="glass-card">
            <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Giới tính khán giả</h3>
            {genderData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={genderData} dataKey="value" nameKey="name" cx="50%" cy="50%"
                    innerRadius={60} outerRadius={90} paddingAngle={4}>
                    {genderData.map((_, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 8 }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : <div className="empty-state" style={{ padding: 30 }}><p>Chưa có dữ liệu</p></div>}
          </div>

          <div className="glass-card">
            <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Độ tuổi khán giả</h3>
            {ageData.some(d => d.value > 0) ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={ageData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} />
                  <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 8 }} />
                  <Bar dataKey="value" fill="var(--accent-primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <div className="empty-state" style={{ padding: 30 }}><p>Chưa có dữ liệu</p></div>}
          </div>
        </div>
      </div>
    </div>
  );
}
