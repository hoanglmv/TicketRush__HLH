import { useEffect, useState } from 'react';
import { bookingApi } from '../api';
import { TicketResponse } from '../types';
import { useLanguage } from '../i18n';

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState<TicketResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  const loadTickets = () => {
    setLoading(true);
    bookingApi.myTickets()
      .then(res => setTickets(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const handleTransfer = (ticketId: number) => {
    const email = window.prompt(t('myTickets.transferPrompt'));
    if (!email) return;

    bookingApi.transfer(ticketId, email)
      .then(() => {
        alert(t('myTickets.transferSuccess'));
        loadTickets();
      })
      .catch(err => {
        const msg = err.response?.data?.message || err.message;
        alert(t('myTickets.transferFailed') + msg);
      });
  };

  const handleSell = (ticketId: number) => {
    const priceStr = window.prompt(t('myTickets.sellPrompt'));
    if (!priceStr) return;
    const price = parseFloat(priceStr);
    if (isNaN(price) || price <= 0) {
      alert(t('myTickets.invalidPrice'));
      return;
    }

    bookingApi.sell(ticketId, price)
      .then(() => {
        alert(t('myTickets.sellSuccess'));
        loadTickets();
      })
      .catch(err => {
        const msg = err.response?.data?.message || err.message;
        alert(t('myTickets.sellFailed') + msg);
      });
  };

  const statusBadge = (s: string) => {
    const map: Record<string, { cls: string; label: string }> = {
      PAID: { cls: 'badge-success', label: t('myTickets.paid') },
      PENDING_PAYMENT: { cls: 'badge-warning', label: t('myTickets.pendingPayment') },
      EXPIRED: { cls: 'badge-danger', label: t('myTickets.expired') },
      CANCELLED: { cls: 'badge-danger', label: t('myTickets.cancelled') },
    };
    return map[s] || { cls: 'badge-info', label: s };
  };

  if (loading) return <div className="page"><div className="container"><div className="loading-container"><div className="spinner" /></div></div></div>;

  return (
    <div className="page" style={{ background: '#f8f9fa' }}>
      <div className="container animate-fadeIn" style={{ maxWidth: '1000px' }}>
        <div className="page-header" style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>{t('myTickets.title')}</h1>
          <p style={{ color: '#666' }}>{t('myTickets.poweredBy')}</p>
        </div>

        {tickets.length === 0 ? (
          <div className="empty-state" style={{ background: 'white', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <p style={{ fontSize: '3rem', marginBottom: 12 }}>🎫</p>
            <p>{t('myTickets.noEvents')}</p>
            <button className="btn" style={{ background: '#026cdf', color: 'white', marginTop: '16px' }} onClick={() => window.location.href = '/events'}>
              {t('myTickets.browseEvents')}
            </button>
          </div>
        ) : (
          <div className="grid-3">
            {tickets.map(ticket => {
              const badge = statusBadge(ticket.status);
              return (
                <div key={ticket.id} className="safetix-container animate-slideIn">
                  
                  <div className="safetix-header">
                    <h3>{ticket.eventName}</h3>
                    <p>{new Date(ticket.eventDate).toLocaleDateString('vi-VN', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                  </div>

                  <div style={{ background: ticket.zoneColor || '#ccc', color: 'white', padding: '8px 16px', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700 }}>
                    <span>Sec {ticket.zoneName}</span>
                    <span>Row {ticket.seatLabel.replace(/[0-9]/g, '')}</span>
                    <span>Seat {ticket.seatLabel.replace(/[^0-9]/g, '')}</span>
                  </div>

                  <div className="safetix-barcode-area">
                    {ticket.status === 'PAID' ? (
                      ticket.isResale ? (
                        <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🏷️</div>
                          <span className="badge badge-warning">{t('myTickets.listedForResale') || 'Listed for Resale'}</span>
                          <div style={{ marginTop: '10px', fontWeight: 'bold' }}>{ticket.resalePrice?.toLocaleString()} VND</div>
                        </div>
                      ) : (
                        <>
                          <div className="safetix-barcode-img">
                            <div className="safetix-scanner-line" />
                          </div>
                          <div className="safetix-warning">
                            {t('myTickets.screenshotWarning')}
                          </div>
                        </>
                      )
                    ) : (
                      <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '10px' }}>{ticket.status === 'PENDING_PAYMENT' ? '💳' : '🚫'}</div>
                        <span className={`badge ${badge.cls}`}>{badge.label}</span>
                      </div>
                    )}
                  </div>

                  <div style={{ padding: '16px', background: '#f8f9fa', fontSize: '0.85rem', color: '#666', borderTop: '1px dashed #ccc', borderBottom: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span>{t('myTickets.ticketType')}</span>
                      <strong style={{ color: '#111' }}>{t('myTickets.standardTicket')}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>{t('myTickets.orderNumber')}</span>
                      <strong style={{ color: '#111' }}>{ticket.id.toString().padStart(6, '0')}</strong>
                    </div>
                  </div>

                  {ticket.status === 'PAID' && !ticket.isResale && (
                    <div className="safetix-footer">
                      <button className="safetix-btn" onClick={() => handleTransfer(ticket.id)}>{t('myTickets.transfer')}</button>
                      <button className="safetix-btn" onClick={() => handleSell(ticket.id)}>{t('myTickets.sell')}</button>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
