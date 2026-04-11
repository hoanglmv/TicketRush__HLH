import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { queueApi } from '../api';
import { QueueStatusResponse } from '../types';
import { useLanguage } from '../i18n';

export default function WaitingRoomPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const [status, setStatus] = useState<QueueStatusResponse | null>(null);
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState('');
  const pollRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const eid = Number(eventId);

  useEffect(() => {
    queueApi.join(eid).then(res => {
      setStatus(res.data.data);
      setJoined(true);
      if (res.data.data.hasAccess) {
        navigate(`/events/${eid}/seats`);
      }
    }).catch(err => setError(err.response?.data?.message || 'Failed to join queue'));
  }, [eid, navigate]);

  useEffect(() => {
    if (!joined) return;

    pollRef.current = setInterval(async () => {
      try {
        const res = await queueApi.status(eid);
        setStatus(res.data.data);
        if (res.data.data.hasAccess) {
          clearInterval(pollRef.current);
          navigate(`/events/${eid}/seats`);
        }
      } catch { /* ignore */ }
    }, 3000);

    return () => { if (pollRef.current !== undefined) clearInterval(pollRef.current); };
  }, [joined, eid, navigate]);

  const progressPercent = Math.max(2, status?.position && status?.totalInQueue ? (1 - status.position / status.totalInQueue) * 100 : 2);

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '60px' }}>
      
      <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', maxWidth: '650px', width: '90%', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
        
        <div style={{ padding: '24px', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#111', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t('queue.title')}</h1>
          <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '8px' }}>{t('queue.subtitle')}</p>
        </div>

        <div style={{ padding: '40px 30px', textAlign: 'center' }}>
          {error && <div className="alert alert-error">{error}</div>}

          {status && !status.hasAccess && (
            <>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '24px' }}>{t('queue.inQueue')}</h2>
              
              <div style={{ position: 'relative', height: '40px', marginBottom: '8px' }}>
                <div style={{ 
                  position: 'absolute', 
                  bottom: '10px', 
                  left: `${progressPercent}%`, 
                  transform: 'translateX(-50%)',
                  transition: 'left 1s ease',
                  fontSize: '2rem'
                }}>🚶</div>
              </div>

              <div style={{ width: '100%', height: '8px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden', margin: '0 auto' }}>
                <div style={{
                  height: '100%',
                  background: '#026cdf',
                  width: `${progressPercent}%`,
                  transition: 'width 1s ease'
                }} />
              </div>

              <div style={{ fontSize: '1.1rem', fontWeight: 700, margin: '30px 0 10px' }}>
                {t('queue.peopleAhead')} <span style={{ color: '#026cdf', fontSize: '1.4rem' }}>{status.position}</span>
              </div>
              <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: 1.5, background: '#f0f9ff', padding: '16px', borderRadius: '4px', border: '1px solid #bae6fd' }}>
                {t('queue.doNotRefresh')}
              </p>
            </>
          )}

          {status?.hasAccess && (
            <div style={{ padding: '20px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🎉</div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#22c55e', marginBottom: '10px' }}>{t('queue.yourTurn')}</h2>
              <p style={{ color: '#666' }}>{t('queue.redirecting')}</p>
            </div>
          )}

        </div>
        
        <div style={{ background: '#f8f9fa', padding: '16px', textAlign: 'center', borderTop: '1px solid #e5e7eb', fontSize: '0.8rem', color: '#999' }}>
          {t('queue.smartQueue')}
        </div>
      </div>

    </div>
  );
}
