import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api';
import { DashboardStats } from '../../types';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.dashboard()
      .then(res => setStats(res.data.data as any))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page"><div className="container"><div className="loading-container"><div className="spinner" /></div></div></div>;

  return (
    <div className="page">
      <div className="container animate-fadeIn">
        <div className="page-header">
          <h1>Admin Dashboard</h1>
          <p>Tổng quan hệ thống TicketRush</p>
        </div>

        <div className="grid-3" style={{ marginBottom: 30 }}>
          <div className="stat-card">
            <div className="stat-value">{stats?.totalEvents || 0}</div>
            <div className="stat-label">Sự kiện</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {(stats?.totalRevenue || 0).toLocaleString('vi-VN')}₫
            </div>
            <div className="stat-label">Tổng doanh thu</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats?.totalUsers || 0}</div>
            <div className="stat-label">Người dùng</div>
          </div>
        </div>

        <div className="flex gap-md">
          <Link to="/admin/events" className="btn btn-primary">📋 Quản lý sự kiện</Link>
          <Link to="/admin/events/create" className="btn btn-secondary">➕ Tạo sự kiện mới</Link>
        </div>
      </div>
    </div>
  );
}
