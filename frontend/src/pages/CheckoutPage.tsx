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
  const [insuranceSelected, setInsuranceSelected] = useState<boolean | null>(null);
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
    if (insuranceSelected === null) {
      setError('Vui lòng chọn hoặc từ chối Bảo hiểm Vé (Ticket Protection) trước khi thanh toán.');
      return;
    }
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

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  if (loading) return <div className="page"><div className="container"><div className="loading-container"><div className="spinner" /></div></div></div>;
  if (!ticket) return <div className="page"><div className="container"><div className="empty-state">Ticket not found</div></div></div>;

  const expired = timeLeft <= 0 || ticket.status !== 'PENDING_PAYMENT';
  const serviceFee = ticket.price * 0.15; // 15% TM fee mock
  const insurancePrice = insuranceSelected ? 190000 : 0;
  const orderTotal = ticket.price + serviceFee + insurancePrice;

  return (
    <div className="page" style={{ background: '#f8f9fa', padding: '40px 0' }}>
      <div className="container" style={{ maxWidth: '1100px' }}>
        
        {expired && <div className="alert alert-error">Thời gian giữ chỗ đã hết hoặc vé đã xử lý.</div>}
        {error && <div className="alert alert-error">{error}</div>}

        <div className="grid-2" style={{ gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1.2fr)', gap: '30px' }}>
          
          {/* LEFT COLUMN: Configuration */}
          <div className="flex flex-col gap-lg">
            
            {/* Delivery Section */}
            <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
              <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Delivery</h2>
              </div>
              <div style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px' }}>Mobile Ticket</h3>
                <p style={{ color: '#444', fontSize: '0.9rem' }}>
                  Vé biểu diễn sẽ khả dụng trên thiết bị di động của bạn qua mã vạch an toàn cực điểm SafeTix. Hãy tận hưởng việc check-in nhanh nhất mà không cần in vé.
                </p>
                <div style={{ marginTop: '16px', background: '#e0f2fe', color: '#0369a1', padding: '12px', borderRadius: '4px', fontSize: '0.85rem' }}>
                  <strong>Ghi chú:</strong> Mã vạch QR sẽ chỉ hiển thị ở định dạng chuẩn. Ảnh chụp màn hình sẽ K0NG được chấp nhận.
                </div>
              </div>
            </div>

            {/* Ticket Protection Section */}
            <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
              <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, display: 'flex', justifyContent: 'space-between' }}>
                  Event Ticket Protector 
                  <span style={{ fontSize: '0.9rem', color: '#666', fontWeight: 400 }}>Tùy chọn</span>
                </h2>
              </div>
              <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                  <div style={{ width: '60px', height: '60px', background: '#22c55e', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>☔</div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '4px' }}>Bảo vệ giao dịch của bạn</h3>
                    <p style={{ color: '#444', fontSize: '0.9rem', lineHeight: 1.5 }}>
                      Nhận lại 100% tiền vé nếu bạn không thể tham dự vì một lý do bất khả kháng (ốm đau, sự cố di chuyển, v.v.). Bằng không, vé này sẽ **KHÔNG ĐƯỢC HOÀN TIỀN**.
                    </p>
                  </div>
                </div>
                
                <div style={{ border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', cursor: 'pointer', borderBottom: '1px solid #ccc', background: insuranceSelected === true ? '#f0f9ff' : 'white' }}>
                    <input type="radio" name="insurance" checked={insuranceSelected === true} onChange={() => setInsuranceSelected(true)} style={{ width: '20px', height: '20px' }} />
                    <span style={{ fontWeight: 600 }}>Yes, protect my ticket purchase for 190.000₫</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', cursor: 'pointer', background: insuranceSelected === false ? '#f0f9ff' : 'white' }}>
                    <input type="radio" name="insurance" checked={insuranceSelected === false} onChange={() => setInsuranceSelected(false)} style={{ width: '20px', height: '20px' }} />
                    <span style={{ fontWeight: 600 }}>No, I am willing to take the risk of losing my money.</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Payment Info Mock */}
            <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
              <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Payment</h2>
              </div>
              <div style={{ padding: '24px' }}>
                <div style={{ padding: '16px', border: '1px solid #026cdf', borderRadius: '4px', background: '#f0f9ff', color: '#026cdf', fontWeight: 600, display: 'flex', justifyContent: 'center' }}>
                  Thanh toán Sandbox (Mock System) - Số tiền sẽ được xác nhận tự động.
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Order Summary & Timer */}
          <div>
            <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', position: 'sticky', top: '90px' }}>
              
              {/* TM Timer */}
              <div style={{ padding: '16px 24px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 800, fontSize: '1rem' }}>Time Left</span>
                <span style={{ fontSize: '1.5rem', fontWeight: 900, color: timeLeft < 60 ? '#ef4444' : '#026cdf' }}>
                  {formatTime(timeLeft)}
                </span>
              </div>

              <div style={{ padding: '24px' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '20px' }}>Order Summary</h2>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 600 }}>{ticket.eventName}</span>
                </div>
                <div style={{ color: '#666', fontSize: '0.85rem', marginBottom: '20px' }}>
                  {ticket.zoneName} - Hàng ghế {ticket.seatLabel.replace(/[0-9]/g, '')} - Ghế {ticket.seatLabel}
                </div>

                <div style={{ borderTop: '1px dashed #ccc', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ color: '#444' }}>Giá vé Standard</span>
                  <span>{ticket.price.toLocaleString('vi-VN')}₫</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ color: '#444' }}>Service Fee (15%)</span>
                  <span>{serviceFee.toLocaleString('vi-VN')}₫</span>
                </div>
                {insuranceSelected && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: '#22c55e', fontWeight: 600 }}>
                    <span>Ticket Protector</span>
                    <span>190.000₫</span>
                  </div>
                )}
                
                <div style={{ borderTop: '1px solid #ccc', paddingTop: '16px', marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>Total</span>
                  <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#111' }}>{orderTotal.toLocaleString('vi-VN')}₫</span>
                </div>

                <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '24px', lineHeight: 1.5 }}>
                  Bằng cách nhấn vào nút bên dưới, bạn đồng ý với Điều khoản Sử dụng và Chính sách Bảo mật của hệ thống TicketRush. Tất cả vé sau khi Place Order đều là Final.
                </p>

                <button 
                  className="btn" 
                  style={{ width: '100%', marginTop: '20px', padding: '16px', background: '#026cdf', color: 'white', fontSize: '1.1rem', fontWeight: 800, borderRadius: '4px' }}
                  onClick={handleConfirm}
                  disabled={confirming || expired}
                >
                  {confirming ? 'CẤP VÉ...' : 'PLACE ORDER'}
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
