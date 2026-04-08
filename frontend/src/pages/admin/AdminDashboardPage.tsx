import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api';
import { DashboardStats } from '../../types';
import { useSettings } from '../../contexts/SettingsContext';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  
  const { settings, updateSettingsPayload, loading: settingsLoading } = useSettings();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminApi.dashboard()
      .then(res => setStats(res.data.data as any))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!settingsLoading && Object.keys(formData).length === 0) {
      setFormData(settings);
    }
  }, [settings, settingsLoading, formData]);

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      await updateSettingsPayload(formData);
      alert('Visual settings updated successfully!');
    } catch (e) {
      alert('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSettingChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  if (loading || settingsLoading) return <div className="page"><div className="container"><div className="loading-container"><div className="spinner" /></div></div></div>;

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

        <div className="flex gap-md" style={{ marginBottom: 40 }}>
          <Link to="/admin/events" className="btn btn-primary">📋 Quản lý sự kiện</Link>
          <Link to="/admin/events/create" className="btn btn-secondary">➕ Tạo sự kiện mới</Link>
        </div>

        <div className="card" style={{ padding: '24px', background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
          <h2 style={{ marginBottom: '20px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>🖼️ Visual Settings Management</h2>
          <p style={{ color: '#666', marginBottom: '20px', fontSize: '0.9rem' }}>
            Update the image URLs for various sections across the platform. You can paste Unsplash URLs, AWS S3 Links, or any high-quality image paths here.
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {Object.keys(formData).map(key => (
              <div key={key} style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '4px' }}>{key}</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={formData[key] || ''} 
                  onChange={(e) => handleSettingChange(key, e.target.value)}
                  placeholder={`Enter URL for ${key}`}
                />
              </div>
            ))}
          </div>
          
          <div style={{ marginTop: '24px' }}>
            <button 
              className="btn btn-primary" 
              onClick={handleSaveSettings}
              disabled={saving}
            >
              {saving ? 'Saving...' : '💾 Save Settings'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
