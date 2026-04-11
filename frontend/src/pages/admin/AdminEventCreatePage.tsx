import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../../api';
import { useLanguage } from '../../i18n';

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
  const { t } = useLanguage();

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
          <h1>{t('admin.createNewEvent')}</h1>
          <p>{t('admin.step')} {step}/2: {step === 1 ? t('admin.eventInfo') : t('admin.seatConfig')}</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {step === 1 && (
          <div className="glass-card" style={{ maxWidth: 640 }}>
            <form onSubmit={handleCreateEvent}>
              <div className="form-group">
                <label className="form-label">{t('admin.eventName')}</label>
                <input className="form-input" name="name" value={form.name} onChange={handleChange} required
                  placeholder={t('admin.eventNamePlaceholder')} />
              </div>
              <div className="form-group">
                <label className="form-label">{t('admin.description')}</label>
                <textarea className="form-textarea" name="description" value={form.description} onChange={handleChange}
                  placeholder={t('admin.descriptionPlaceholder')} />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">{t('admin.venue')}</label>
                  <input className="form-input" name="venue" value={form.venue} onChange={handleChange}
                    placeholder={t('admin.venuePlaceholder')} />
                </div>
                <div className="form-group">
                  <label className="form-label">{t('admin.address')}</label>
                  <input className="form-input" name="address" value={form.address} onChange={handleChange}
                    placeholder={t('admin.addressPlaceholder')} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">{t('admin.eventDate')}</label>
                <input className="form-input" name="eventDate" type="datetime-local" value={form.eventDate} onChange={handleChange} required />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">{t('admin.saleStart')}</label>
                  <input className="form-input" name="saleStartTime" type="datetime-local" value={form.saleStartTime} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">{t('admin.saleEnd')}</label>
                  <input className="form-input" name="saleEndTime" type="datetime-local" value={form.saleEndTime} onChange={handleChange} />
                </div>
              </div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <input type="checkbox" name="queueEnabled" checked={form.queueEnabled}
                  onChange={handleChange} id="queueEnabled" />
                <label htmlFor="queueEnabled" style={{ cursor: 'pointer' }}>
                  {t('admin.enableQueue')}
                </label>
              </div>
              {form.queueEnabled && (
                <div className="form-group">
                  <label className="form-label">{t('admin.batchSize')}</label>
                  <input className="form-input" name="queueBatchSize" type="number" value={form.queueBatchSize}
                    onChange={handleChange} min="1" />
                </div>
              )}
              <button className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 8 }} type="submit" disabled={loading}>
                {loading ? t('admin.creating') : t('admin.nextStep')}
              </button>
            </form>
          </div>
        )}

        {step === 2 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div className="glass-card">
              <h3 style={{ fontWeight: 700, marginBottom: 16 }}>{t('admin.addZone')}</h3>
              <form onSubmit={handleAddZone}>
                <div className="form-group">
                  <label className="form-label">{t('admin.zoneName')}</label>
                  <input className="form-input" value={newZone.name} required
                    onChange={e => setNewZone({ ...newZone, name: e.target.value })}
                    placeholder={t('admin.zoneNamePlaceholder')} />
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">{t('admin.color')}</label>
                    <input className="form-input" type="color" value={newZone.color}
                      onChange={e => setNewZone({ ...newZone, color: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t('admin.ticketPrice')}</label>
                    <input className="form-input" type="number" value={newZone.price} required
                      onChange={e => setNewZone({ ...newZone, price: e.target.value })}
                      placeholder="500000" />
                  </div>
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">{t('admin.totalRows')}</label>
                    <input className="form-input" type="number" value={newZone.totalRows} required min="1"
                      onChange={e => setNewZone({ ...newZone, totalRows: e.target.value })}
                      placeholder="10" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t('admin.seatsPerRow')}</label>
                    <input className="form-input" type="number" value={newZone.seatsPerRow} required min="1"
                      onChange={e => setNewZone({ ...newZone, seatsPerRow: e.target.value })}
                      placeholder="15" />
                  </div>
                </div>
                <button className="btn btn-primary" style={{ width: '100%' }} type="submit" disabled={loading}>
                  {t('admin.addZoneBtn')}
                </button>
              </form>
            </div>

            <div>
              <h3 style={{ fontWeight: 700, marginBottom: 16 }}>
                {t('admin.zoneList')} ({zones.length})
              </h3>
              {zones.length === 0 ? (
                <div className="empty-state" style={{ padding: 40 }}>
                  <p>{t('admin.noZones')}</p>
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
                          {z.totalRows}×{z.seatsPerRow} = {z.totalSeats} {t('admin.seats')} &nbsp;|&nbsp;
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
                  {t('admin.finishCreate')}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
