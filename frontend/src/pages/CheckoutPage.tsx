import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookingApi } from '../api';
import { TicketResponse } from '../types';

export default function CheckoutPage() {
  const { ticketId } = useParams<{ ticketId: string }>();
  const [ticket, setTicket] = useState<TicketResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(600);
  const navigate = useNavigate();

  useEffect(() => {
    bookingApi.getTicket(Number(ticketId)).then(res => {
      setTicket(res.data.data);
      if (res.data.data.expiredAt) {
        const exp = new Date(res.data.data.expiredAt).getTime();
        const now = Date.now();
        setTimeLeft(Math.max(0, Math.floor((exp - now) / 1000)));
      }
    }).catch(() => setError('Ticket not found')).finally(() => setLoading(false));
  }, [ticketId]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timer); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleConfirm = async () => {
    setConfirming(true);
    setError('');
    try {
      await bookingApi.confirmPayment(Number(ticketId));
      navigate(`/tickets`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Payment failed');
    } finally {
      setConfirming(false);
    }
  };

  const handleCancel = async () => {
    try {
      await bookingApi.cancelTicket(Number(ticketId));
      navigate('/events');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Cancel failed');
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  if (loading) return <div className="page"><div className="container"><div className="loading-container"><div className="spinner" /></div></div></div>;
  if (!ticket) return <div className="page"><div className="container"><div className="empty-state">Ticket not found</div></div></div>;

  const expired = timeLeft <= 0 || ticket.status !== 'PENDING_PAYMENT';

  return (
    <div className="page">
      <div className="container">
        <div className="checkout-container animate-fadeIn">
          <div className="glass-card">
            <h2 style={{ textAlign: 'center', fontWeight: 800, marginBottom: 8 }}>Xác nhận thanh toán</h2>

            <div className={`checkout-timer ${timeLeft < 60 ? 'urgent' : ''}`}>
              {expired ? 'Hết hạn' : formatTime(timeLeft)}
            </div>

            <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 24 }}>
              {expired ? 'Thời gian giữ chỗ đã hết.' : 'Hoàn tất thanh toán trước khi hết thời gian.'}
            </p>

            {error && <div className="alert alert-error">{error}</div>}

            <hr className="divider" />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
              <div className="flex-between">
                <span style={{ color: 'var(--text-muted)' }}>Sự kiện</span>
                <span style={{ fontWeight: 600 }}>{ticket.eventName}</span>
              </div>
              <div className="flex-between">
                <span style={{ color: 'var(--text-muted)' }}>Khu vực</span>
                <span style={{ fontWeight: 600 }}>{ticket.zoneName}</span>
              </div>
              <div className="flex-between">
                <span style={{ color: 'var(--text-muted)' }}>Ghế</span>
                <span style={{ fontWeight: 600 }}>{ticket.seatLabel}</span>
              </div>
              <div className="flex-between">
                <span style={{ color: 'var(--text-muted)' }}>Giá vé</span>
                <span style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--accent-primary)' }}>
                  {ticket.price.toLocaleString('vi-VN')}₫
                </span>
              </div>
            </div>

            <hr className="divider" />

            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={handleCancel} disabled={expired}>
                Hủy
              </button>
              <button className="btn btn-primary btn-lg" style={{ flex: 2 }}
                onClick={handleConfirm} disabled={confirming || expired}>
                {confirming ? 'Đang xử lý...' : '✅ XÁC NHẬN THANH TOÁN'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
