import { useEffect, useState } from 'react';
import { bookingApi } from '../api';
import { TicketResponse } from '../types';

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState<TicketResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingApi.myTickets()
      .then(res => setTickets(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statusBadge = (s: string) => {
    const map: Record<string, { cls: string; label: string }> = {
      PAID: { cls: 'badge-success', label: '✅ Đã thanh toán' },
      PENDING_PAYMENT: { cls: 'badge-warning', label: '⏳ Chờ thanh toán' },
      EXPIRED: { cls: 'badge-danger', label: '⛔ Hết hạn' },
      CANCELLED: { cls: 'badge-danger', label: '❌ Đã hủy' },
    };
    return map[s] || { cls: 'badge-info', label: s };
  };

  if (loading) return <div className="page"><div className="container"><div className="loading-container"><div className="spinner" /></div></div></div>;

  return (
    <div className="page">
      <div className="container animate-fadeIn">
        <div className="page-header">
          <h1>Vé của tôi</h1>
          <p>Quản lý tất cả vé đã mua</p>
        </div>

        {tickets.length === 0 ? (
          <div className="empty-state">
            <p style={{ fontSize: '3rem', marginBottom: 12 }}>🎫</p>
            <p>Bạn chưa có vé nào. Hãy mua vé cho sự kiện yêu thích!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {tickets.map(ticket => {
              const badge = statusBadge(ticket.status);
              return (
                <div key={ticket.id} className="ticket-card animate-slideIn">
                  <div className="ticket-card-header">
                    <h3 style={{ fontWeight: 700 }}>{ticket.eventName}</h3>
                    <p style={{ opacity: 0.8, fontSize: '0.85rem' }}>📍 {ticket.venue}</p>
                  </div>
                  <div className="ticket-card-body">
                    {ticket.qrCode && (
                      <div className="ticket-qr">
                        <img src={ticket.qrCode} alt="QR Code" />
                      </div>
                    )}
                    <div className="ticket-info">
                      <div className="ticket-info-row">
                        <span className="ticket-info-label">Khu vực</span>
                        <span className="ticket-info-value" style={{ color: ticket.zoneColor }}>
                          {ticket.zoneName}
                        </span>
                      </div>
                      <div className="ticket-info-row">
                        <span className="ticket-info-label">Ghế</span>
                        <span className="ticket-info-value">{ticket.seatLabel}</span>
                      </div>
                      <div className="ticket-info-row">
                        <span className="ticket-info-label">Giá</span>
                        <span className="ticket-info-value">{ticket.price.toLocaleString('vi-VN')}₫</span>
                      </div>
                      <div className="ticket-info-row">
                        <span className="ticket-info-label">Ngày mua</span>
                        <span className="ticket-info-value">
                          {ticket.paidAt ? new Date(ticket.paidAt).toLocaleString('vi-VN') : '—'}
                        </span>
                      </div>
                      <div className="ticket-info-row">
                        <span className="ticket-info-label">Trạng thái</span>
                        <span className={`badge ${badge.cls}`}>{badge.label}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
