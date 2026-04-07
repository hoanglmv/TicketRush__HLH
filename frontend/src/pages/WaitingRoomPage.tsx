import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { queueApi } from '../api';
import { QueueStatusResponse } from '../types';

export default function WaitingRoomPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const [status, setStatus] = useState<QueueStatusResponse | null>(null);
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState('');
  const pollRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const navigate = useNavigate();

  const eid = Number(eventId);

  // Join queue on mount
  useEffect(() => {
    queueApi.join(eid).then(res => {
      setStatus(res.data.data);
      setJoined(true);
      if (res.data.data.hasAccess) {
        navigate(`/events/${eid}/seats`);
      }
    }).catch(err => setError(err.response?.data?.message || 'Failed to join queue'));
  }, [eid, navigate]);

  // Poll every 3 seconds
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

  return (
    <div className="page flex-center" style={{ minHeight: 'calc(100vh - 64px)' }}>
      <div className="glass-card waiting-room animate-fadeIn" style={{ maxWidth: 500, width: '100%' }}>
        <div style={{ fontSize: '3rem', marginBottom: 16 }}>⏳</div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 8 }}>Phòng chờ ảo</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
          Hệ thống đang xử lý lượng truy cập lớn. Vui lòng không tải lại trang.
        </p>

        {error && <div className="alert alert-error">{error}</div>}

        {status && !status.hasAccess && (
          <>
            <div className="queue-position">#{status.position || '—'}</div>
            <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>
              Bạn đang ở vị trí thứ <strong>{status.position}</strong> trong hàng đợi
              {status.totalInQueue && <> (Tổng: {status.totalInQueue} người)</>}
            </p>
            <div className="queue-progress-bar">
              <div className="queue-progress-fill" style={{
                width: `${Math.max(5, status.position && status.totalInQueue ? (1 - status.position / status.totalInQueue) * 100 : 5)}%`
              }} />
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 16 }}>
              Tự động cập nhật mỗi 3 giây...
            </p>
          </>
        )}

        {status?.hasAccess && (
          <div>
            <div className="alert alert-success">🎉 Đã đến lượt bạn! Đang chuyển hướng...</div>
          </div>
        )}

        <div className="spinner" style={{ margin: '20px auto' }} />
      </div>
    </div>
  );
}
