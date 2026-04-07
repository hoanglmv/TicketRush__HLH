import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../../api';

export default function AdminEventCreatePage() {
  const [form, setForm] = useState({
    name: '', description: '', venue: '', address: '', bannerUrl: '',
    eventDate: '', saleStartTime: '', saleEndTime: '',
    queueEnabled: false, queueBatchSize: 50
  });
  const [zones, setZones] = useState<any[]>([]);
  const [newZone, setNewZone] = useState({ name: '', color: '#6366f1', price: '', totalRows: '', seatsPerRow: '', sortOrder: 0 });
  const [eventId, setEventId] = useState<number | null>(null);
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target;
    setForm({
      ...form,
      [target.name]: target.type === 'checkbox' ? (target as HTMLInputElement).checked : target.value
    });
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await adminApi.createEvent({
        ...form,
        queueBatchSize: Number(form.queueBatchSize)
      });
      setEventId(res.data.data.id);
      setStep(2);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  const handleAddZone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventId) return;
    setLoading(true);
    try {
      const res = await adminApi.createZone(eventId, {
        ...newZone,
        price: Number(newZone.price),
        totalRows: Number(newZone.totalRows),
        seatsPerRow: Number(newZone.seatsPerRow),
        sortOrder: zones.length
      });
      setZones([...zones, res.data.data]);
      setNewZone({ name: '', color: '#6366f1', price: '', totalRows: '', seatsPerRow: '', sortOrder: zones.length + 1 });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create zone');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="container animate-fadeIn">
        <div className="page-header">
          <h1>Tạo sự kiện mới</h1>
          <p>Bước {step}/2: {step === 1 ? 'Thông tin sự kiện' : 'Cấu hình khu vực ghế'}</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {step === 1 && (
          <div className="glass-card" style={{ maxWidth: 640 }}>
            <form onSubmit={handleCreateEvent}>
              <div className="form-group">
                <label className="form-label">Tên sự kiện *</label>
                <input className="form-input" name="name" value={form.name} onChange={handleChange} required
                  placeholder="VD: Đại nhạc hội Summer 2026" />
              </div>
              <div className="form-group">
                <label className="form-label">Mô tả</label>
                <textarea className="form-textarea" name="description" value={form.description} onChange={handleChange}
                  placeholder="Mô tả chi tiết sự kiện..." />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Địa điểm</label>
                  <input className="form-input" name="venue" value={form.venue} onChange={handleChange}
                    placeholder="VD: SVĐ Mỹ Đình" />
                </div>
                <div className="form-group">
                  <label className="form-label">Địa chỉ</label>
                  <input className="form-input" name="address" value={form.address} onChange={handleChange}
                    placeholder="VD: Nam Từ Liêm, Hà Nội" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Ngày diễn ra *</label>
                <input className="form-input" name="eventDate" type="datetime-local" value={form.eventDate} onChange={handleChange} required />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Mở bán từ</label>
                  <input className="form-input" name="saleStartTime" type="datetime-local" value={form.saleStartTime} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Đóng bán</label>
                  <input className="form-input" name="saleEndTime" type="datetime-local" value={form.saleEndTime} onChange={handleChange} />
                </div>
              </div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <input type="checkbox" name="queueEnabled" checked={form.queueEnabled}
                  onChange={handleChange} id="queueEnabled" />
                <label htmlFor="queueEnabled" style={{ cursor: 'pointer' }}>
                  Bật hàng chờ ảo (Virtual Queue)
                </label>
              </div>
              {form.queueEnabled && (
                <div className="form-group">
                  <label className="form-label">Batch size (người/lượt)</label>
                  <input className="form-input" name="queueBatchSize" type="number" value={form.queueBatchSize}
                    onChange={handleChange} min="1" />
                </div>
              )}
              <button className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 8 }} type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Tiếp: Cấu hình khu vực →'}
              </button>
            </form>
          </div>
        )}

        {step === 2 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div className="glass-card">
              <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Thêm khu vực</h3>
              <form onSubmit={handleAddZone}>
                <div className="form-group">
                  <label className="form-label">Tên khu vực *</label>
                  <input className="form-input" value={newZone.name} required
                    onChange={e => setNewZone({ ...newZone, name: e.target.value })}
                    placeholder="VD: VIP, Standard, Economy" />
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Màu sắc</label>
                    <input className="form-input" type="color" value={newZone.color}
                      onChange={e => setNewZone({ ...newZone, color: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Giá vé (₫) *</label>
                    <input className="form-input" type="number" value={newZone.price} required
                      onChange={e => setNewZone({ ...newZone, price: e.target.value })}
                      placeholder="500000" />
                  </div>
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Số hàng *</label>
                    <input className="form-input" type="number" value={newZone.totalRows} required min="1"
                      onChange={e => setNewZone({ ...newZone, totalRows: e.target.value })}
                      placeholder="10" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Ghế/hàng *</label>
                    <input className="form-input" type="number" value={newZone.seatsPerRow} required min="1"
                      onChange={e => setNewZone({ ...newZone, seatsPerRow: e.target.value })}
                      placeholder="15" />
                  </div>
                </div>
                <button className="btn btn-primary" style={{ width: '100%' }} type="submit" disabled={loading}>
                  ➕ Thêm khu vực
                </button>
              </form>
            </div>

            <div>
              <h3 style={{ fontWeight: 700, marginBottom: 16 }}>
                Danh sách khu vực ({zones.length})
              </h3>
              {zones.length === 0 ? (
                <div className="empty-state" style={{ padding: 40 }}>
                  <p>Chưa có khu vực nào. Thêm khu vực bên trái.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {zones.map((z, i) => (
                    <div key={i} className="card" style={{ cursor: 'default' }}>
                      <div className="card-body flex-between">
                        <div className="flex gap-sm" style={{ alignItems: 'center' }}>
                          <div style={{ width: 16, height: 16, borderRadius: 4, background: z.color }} />
                          <strong>{z.name}</strong>
                        </div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                          {z.totalRows}×{z.seatsPerRow} = {z.totalSeats} ghế &nbsp;|&nbsp;
                          <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>
                            {z.price?.toLocaleString('vi-VN')}₫
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {zones.length > 0 && (
                <button className="btn btn-success btn-lg" style={{ width: '100%', marginTop: 20 }}
                  onClick={() => navigate('/admin/events')}>
                  ✅ Hoàn tất tạo sự kiện
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
