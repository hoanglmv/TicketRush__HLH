import { useEffect, useState } from 'react';
import { resaleApi } from '../api';
import { TicketResponse } from '../types';
import { useLanguage } from '../i18n';
import { Ticket } from 'lucide-react';

export default function ResalePage() {
  const [tickets, setTickets] = useState<TicketResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  const loadTickets = () => {
    setLoading(true);
    resaleApi.list()
      .then(res => setTickets(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const handleBuy = (ticketId: number) => {
    if (!window.confirm("Are you sure you want to buy this resale ticket?")) return;
    
    resaleApi.buy(ticketId)
      .then(() => {
        alert("Ticket purchased successfully!");
        loadTickets();
      })
      .catch(err => {
        const msg = err.response?.data?.message || err.message;
        alert("Failed to buy ticket: " + msg);
      });
  };

  if (loading) return <div className="page"><div className="container"><div className="loading-container"><div className="spinner" /></div></div></div>;

  return (
    <div className="page" style={{ background: '#1f1f1f', minHeight: '100vh', color: 'white' }}>
      <div className="container animate-fadeIn">
        <div style={{ padding: '40px 0', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '16px' }}>
            <Ticket style={{ display: 'inline', marginRight: '12px', verticalAlign: 'middle' }} size={40} />
            Ticket Resale Marketplace
          </h1>
          <p style={{ color: '#aaa', fontSize: '1.1rem' }}>
            Safe and verified fan-to-fan ticket exchange
          </p>
        </div>

        {tickets.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', background: '#2a2a2a', borderRadius: '12px' }}>
            <h3 style={{ fontSize: '1.5rem', color: '#ccc' }}>No tickets currently available for resale.</h3>
          </div>
        ) : (
          <div className="grid-3">
            {tickets.map(ticket => (
              <div key={ticket.id} style={{ background: '#2a2a2a', borderRadius: '12px', overflow: 'hidden', border: '1px solid #444' }}>
                <div style={{ padding: '20px', borderBottom: '1px solid #444' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>{ticket.eventName}</h3>
                  <div style={{ color: '#00b14f', fontSize: '0.9rem', fontWeight: 600, marginBottom: '12px' }}>
                    {new Date(ticket.eventDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', color: '#aaa', fontSize: '0.85rem' }}>
                    <span style={{ background: '#333', padding: '4px 8px', borderRadius: '4px' }}>Sec {ticket.zoneName}</span>
                    <span style={{ background: '#333', padding: '4px 8px', borderRadius: '4px' }}>Row {ticket.seatLabel.replace(/[0-9]/g, '')}</span>
                    <span style={{ background: '#333', padding: '4px 8px', borderRadius: '4px' }}>Seat {ticket.seatLabel.replace(/[^0-9]/g, '')}</span>
                  </div>
                </div>
                <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: '#aaa', textTransform: 'uppercase' }}>Resale Price</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#00b14f' }}>
                      {ticket.resalePrice?.toLocaleString()} <span style={{ fontSize: '1rem' }}>VND</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleBuy(ticket.id)}
                    style={{ background: '#00b14f', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '6px', fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s' }}
                    onMouseOver={e => e.currentTarget.style.background = '#009944'}
                    onMouseOut={e => e.currentTarget.style.background = '#00b14f'}
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
