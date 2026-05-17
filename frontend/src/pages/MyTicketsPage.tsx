import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingApi } from '../api';
import { TicketResponse } from '../types';
import { useLanguage } from '../i18n';

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState<TicketResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<TicketResponse | null>(null);
  const { t } = useLanguage();
  const navigate = useNavigate();

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



  const statusBadge = (s: string) => {
    const map: Record<string, { cls: string; label: string }> = {
      PAID: { cls: 'badge-success', label: t('myTickets.paid') },
      PENDING_PAYMENT: { cls: 'badge-warning', label: t('myTickets.pendingPayment') },
      EXPIRED: { cls: 'badge-danger', label: t('myTickets.expired') },
      CANCELLED: { cls: 'badge-danger', label: t('myTickets.cancelled') },
    };
    return map[s] || { cls: 'badge-info', label: s };
  };

  if (loading) return <div className="flex-1 pt-20 text-center flex justify-center"><div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div></div>;

  return (
    <div className="flex-1 bg-[#f8f9fa] py-10 min-h-screen text-gray-900">
      <div className="container mx-auto px-6 max-w-[1000px] animate-[fadeIn_0.5s_ease-out]">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold">{t('myTickets.title')}</h1>
          <p className="text-gray-500 mt-2">{t('myTickets.poweredBy')}</p>
        </div>

        {tickets.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-16 text-center shadow-sm">
            <p className="text-5xl mb-4">🎫</p>
            <p className="text-gray-600 font-medium">{t('myTickets.noEvents')}</p>
            <button className="mt-6 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-md" onClick={() => window.location.href = '/events'}>
              {t('myTickets.browseEvents')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tickets.map(ticket => {
              const badge = statusBadge(ticket.status);
              return (
                <div 
                  key={ticket.id} 
                  className={`bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200 animate-[slideIn_0.3s_ease-out] flex flex-col hover:-translate-y-1 transition-transform ${ticket.status === 'PAID' ? 'cursor-pointer ring-2 ring-transparent hover:ring-blue-400' : ''}`}
                  onClick={() => ticket.status === 'PAID' && setSelectedTicket(ticket)}
                >
                  
                  <div className="p-5 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
                    <h3 className="font-extrabold text-xl mb-1 line-clamp-1">{ticket.eventName}</h3>
                    <p className="text-blue-100 text-sm font-medium">{new Date(ticket.eventDate).toLocaleDateString('vi-VN', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                  </div>

                  <div className="text-white px-4 py-2 flex justify-between text-sm font-bold" style={{ background: ticket.zoneColor || '#9ca3af' }}>
                    <span>Sec {ticket.zoneName}</span>
                    <span>Row {ticket.seatLabel.replace(/[0-9]/g, '')}</span>
                    <span>Seat {ticket.seatLabel.replace(/[^0-9]/g, '')}</span>
                  </div>

                  <div className="p-6 flex flex-col items-center justify-center bg-gray-50 border-b border-gray-200 min-h-[160px] flex-1 relative overflow-hidden">
                    {/* Add a subtle moving line background to make it look like a scanner area */}
                    <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(0deg,transparent_24%,#000_25%,#000_26%,transparent_27%,transparent_74%,#000_75%,#000_76%,transparent_77%,transparent)] bg-[length:100%_50px]"></div>

                    {ticket.status === 'PAID' ? (
                      <>
                        <div className="w-[200px] h-[60px] bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/e9/UPC-A-036000291452.svg')] bg-center bg-[length:100%_100%] bg-no-repeat relative overflow-hidden mb-3 opacity-90">
                          <div className="w-full h-0.5 bg-red-500 absolute left-0 animate-[scan_2.5s_linear_infinite] shadow-[0_0_8px_2px_rgba(239,68,68,0.8)]" />
                        </div>
                        <div className="text-[11px] text-blue-600 font-extrabold uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                          {t('myTickets.screenshotWarning')}
                        </div>
                      </>
                    ) : (
                      <div className="py-6 text-center z-10">
                        <div className="text-4xl mb-3">{ticket.status === 'PENDING_PAYMENT' ? '💳' : '🚫'}</div>
                        <div className="mb-2">
                          <span className={`px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider inline-block ${
                              badge.cls === 'badge-success' ? 'bg-green-100 text-green-700 border border-green-200' :
                              badge.cls === 'badge-warning' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                              badge.cls === 'badge-danger' ? 'bg-red-100 text-red-700 border border-red-200' :
                              'bg-gray-100 text-gray-700 border border-gray-200'
                          }`}>{badge.label}</span>
                        </div>
                        {ticket.status === 'PENDING_PAYMENT' && (
                          <button
                            onClick={() => navigate(`/checkout/${ticket.id}`)}
                            className="mt-3 px-6 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-md text-sm"
                          >
                            {t('myTickets.payNow') || 'Thanh toán ngay'}
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="p-4 bg-white text-sm text-gray-500">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">{t('myTickets.ticketType')}</span>
                      <strong className="text-gray-900 font-bold">{t('myTickets.standardTicket')}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">{t('myTickets.orderNumber')}</span>
                      <strong className="text-gray-900 font-mono bg-gray-100 px-2 py-0.5 rounded">{ticket.id.toString().padStart(6, '0')}</strong>
                    </div>
                  </div>


                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Ticket Details Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedTicket(null)}>
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-[fadeIn_0.2s_ease-out]" onClick={e => e.stopPropagation()}>
            <div className="p-6 bg-gradient-to-br from-blue-600 to-purple-700 text-white flex justify-between items-start">
              <div>
                <h2 className="text-xl font-black mb-1 leading-tight">{selectedTicket.eventName}</h2>
                <p className="text-blue-100 text-sm font-medium">{new Date(selectedTicket.eventDate).toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                <p className="text-blue-100 text-sm mt-1.5 flex items-center gap-1.5 font-medium">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path></svg>
                  {selectedTicket.venue}
                </p>
              </div>
              <button onClick={() => setSelectedTicket(null)} className="text-white hover:text-red-200 bg-white/20 hover:bg-white/30 rounded-full w-8 h-8 flex items-center justify-center transition-colors shadow-sm ml-4 shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-200 mb-6 shadow-inner">
                <div className="text-center flex-1 border-r border-gray-200">
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-wider mb-1">Khu vực</p>
                  <p className="font-black text-xl" style={{ color: selectedTicket.zoneColor }}>{selectedTicket.zoneName}</p>
                </div>
                <div className="text-center flex-1 border-r border-gray-200">
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-wider mb-1">Hàng</p>
                  <p className="font-black text-xl">{selectedTicket.seatLabel.replace(/[0-9]/g, '')}</p>
                </div>
                <div className="text-center flex-1">
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-wider mb-1">Ghế</p>
                  <p className="font-black text-xl">{selectedTicket.seatLabel.replace(/[^0-9]/g, '')}</p>
                </div>
              </div>

              <div className="text-center mb-6">
                <p className="text-xs text-gray-500 mb-2 font-black uppercase tracking-widest">Mã vạch vé (SafeTix™)</p>
                <div className="bg-white p-4 rounded-xl flex flex-col justify-center items-center border-2 border-dashed border-gray-300">
                  <div className="w-[200px] h-[60px] bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/e9/UPC-A-036000291452.svg')] bg-center bg-[length:100%_100%] bg-no-repeat relative overflow-hidden opacity-90 mb-2">
                    <div className="w-full h-0.5 bg-red-500 absolute left-0 animate-[scan_2.5s_linear_infinite] shadow-[0_0_8px_2px_rgba(239,68,68,0.8)]" />
                  </div>
                  <p className="text-sm text-gray-600 font-mono tracking-[0.2em] font-bold">{selectedTicket.id.toString().padStart(8, '0')}-{selectedTicket.seatId}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-500 font-medium">Giá vé</span>
                  <span className="font-black text-lg">{selectedTicket.price.toLocaleString('vi-VN')}₫</span>
                </div>
                <div className="flex justify-between items-center py-2 border-t border-gray-100">
                  <span className="text-gray-500 font-medium">Tình trạng</span>
                  <span className="text-green-600 font-black flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                    Đã thanh toán
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-t border-gray-100">
                  <span className="text-gray-500 font-medium">Ngày mua</span>
                  <span className="font-bold text-gray-700">{new Date(selectedTicket.paidAt || selectedTicket.createdAt).toLocaleDateString('vi-VN')}</span>
                </div>
              </div>
              
              <button onClick={() => setSelectedTicket(null)} className="w-full mt-6 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-black rounded-xl transition-colors text-lg">
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
