import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookingApi } from '../api';
import { TicketResponse } from '../types';
import { useLanguage } from '../i18n';

export default function CheckoutPage() {
  const { ticketId } = useParams<{ ticketId: string }>();
  const [ticket, setTicket] = useState<TicketResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(600);
  const [insuranceSelected, setInsuranceSelected] = useState<boolean | null>(null);
  const [showQR, setShowQR] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    bookingApi.getTicket(Number(ticketId)).then(res => {
      setTicket(res.data.data);
      if (res.data.data.expiredAt) {
        let expStr = res.data.data.expiredAt;
        if (typeof expStr === 'string' && !expStr.endsWith('Z') && !expStr.includes('+')) {
          expStr += 'Z'; // Force UTC parsing since backend docker runs in UTC
        }
        const exp = new Date(expStr).getTime();
        const now = Date.now();
        setTimeLeft(Math.max(0, Math.floor((exp - now) / 1000)));
      }
    }).catch(() => setError(t('checkout.ticketNotFound'))).finally(() => setLoading(false));
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

  const handleShowQR = () => {
    if (insuranceSelected === null) {
      setError(t('checkout.selectInsurance') || 'Vui lòng chọn hoặc bỏ qua Bảo hiểm vé');
      return;
    }
    setShowQR(true);
  };

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

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  if (loading) return <div className="page"><div className="container"><div className="loading-container"><div className="spinner" /></div></div></div>;
  if (!ticket) return <div className="page"><div className="container"><div className="empty-state">{t('checkout.ticketNotFound')}</div></div></div>;

  const expired = timeLeft <= 0 || ticket.status !== 'PENDING_PAYMENT';
  const serviceFee = ticket.price * 0.15; // 15% TM fee mock
  const insurancePrice = insuranceSelected ? 190000 : 0;
  const orderTotal = ticket.price + serviceFee + insurancePrice;

  return (
    <div className="flex-1 bg-[#f8f9fa] py-10 text-gray-900">
      <div className="container mx-auto px-6 max-w-[1100px]">
        
        {expired && <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-6 font-bold">{t('checkout.expired')}</div>}
        {error && <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-6 font-bold">{error}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1.2fr] gap-8">
          
          {/* LEFT COLUMN: Configuration */}
          <div className="flex flex-col gap-6">
            
            {/* Delivery Section */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-extrabold">{t('checkout.delivery')}</h2>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold mb-2">{t('checkout.mobileTicket')}</h3>
                <p className="text-gray-600 text-sm">
                  {t('checkout.mobileDesc')}
                </p>
                <div className="mt-4 bg-sky-50 text-sky-700 p-4 rounded-lg text-sm border border-sky-100">
                  <strong className="font-bold">{t('checkout.note')}</strong> {t('checkout.qrNote')}
                </div>
              </div>
            </div>

            {/* Ticket Protection Section */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-extrabold flex justify-between items-center">
                  {t('checkout.ticketProtector')} 
                  <span className="text-sm text-gray-500 font-normal">{t('checkout.optional')}</span>
                </h2>
              </div>
              <div className="p-6">
                <div className="flex gap-4 mb-6">
                  <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center text-3xl shrink-0">☔</div>
                  <div>
                    <h3 className="text-lg font-bold mb-1">{t('checkout.protectPurchase')}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {t('checkout.protectDesc')}
                    </p>
                  </div>
                </div>
                
                <div className="border border-gray-300 rounded-xl overflow-hidden">
                  <label className={`flex items-center gap-3 p-4 cursor-pointer border-b border-gray-300 transition-colors ${insuranceSelected === true ? 'bg-sky-50' : 'bg-white hover:bg-gray-50'}`}>
                    <input type="radio" name="insurance" checked={insuranceSelected === true} onChange={() => setInsuranceSelected(true)} className="w-5 h-5 text-sky-600 focus:ring-sky-500" />
                    <span className="font-bold">{t('checkout.yesProtect')}</span>
                  </label>
                  <label className={`flex items-center gap-3 p-4 cursor-pointer transition-colors ${insuranceSelected === false ? 'bg-sky-50' : 'bg-white hover:bg-gray-50'}`}>
                    <input type="radio" name="insurance" checked={insuranceSelected === false} onChange={() => setInsuranceSelected(false)} className="w-5 h-5 text-sky-600 focus:ring-sky-500" />
                    <span className="font-bold">{t('checkout.noProtect')}</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Payment Info Mock */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-extrabold">{t('checkout.payment')}</h2>
              </div>
              <div className="p-6">
                <div className="p-4 border border-blue-500 rounded-lg bg-blue-50 text-blue-700 font-bold flex justify-center text-center">
                  {t('checkout.sandboxPayment') || 'Hệ thống Thanh toán an toàn qua VNPay / ZaloPay'}
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Order Summary & Timer */}
          <div>
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm sticky top-24">
              
              {/* TM Timer */}
              <div className="p-4 px-6 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-xl">
                <span className="font-extrabold text-gray-700">{t('checkout.timeLeft')}</span>
                <span className={`text-3xl font-black ${timeLeft < 60 ? 'text-red-500' : 'text-blue-600'}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>

              <div className="p-6">
                <h2 className="text-2xl font-extrabold mb-6">{t('checkout.orderSummary')}</h2>
                
                <div className="flex justify-between mb-2">
                  <span className="font-bold text-lg">{ticket.eventName}</span>
                </div>
                <div className="text-gray-500 text-sm mb-6 pb-6 border-b border-dashed border-gray-300">
                  {ticket.zoneName} - {t('checkout.seatRow')} {ticket.seatLabel.replace(/[0-9]/g, '')} - {t('checkout.seat')} {ticket.seatLabel}
                </div>

                <div className="flex justify-between mb-4 font-medium">
                  <span className="text-gray-600">{t('checkout.standardPrice')}</span>
                  <span>{ticket.price.toLocaleString('vi-VN')}₫</span>
                </div>
                <div className="flex justify-between mb-4 font-medium">
                  <span className="text-gray-600">{t('checkout.serviceFee')}</span>
                  <span>{serviceFee.toLocaleString('vi-VN')}₫</span>
                </div>
                {insuranceSelected && (
                  <div className="flex justify-between mb-4 text-green-600 font-bold">
                    <span>{t('checkout.ticketProtectorFee')}</span>
                    <span>190.000₫</span>
                  </div>
                )}
                
                <div className="border-t border-gray-200 pt-6 mt-2 flex justify-between items-center">
                  <span className="text-xl font-extrabold">{t('checkout.total')}</span>
                  <span className="text-3xl font-black text-black">{orderTotal.toLocaleString('vi-VN')}₫</span>
                </div>

                <p className="text-xs text-gray-500 mt-6 leading-relaxed">
                  {t('checkout.termsNotice')}
                </p>

                <button 
                  className="w-full mt-6 py-4 bg-blue-600 text-white text-lg font-extrabold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleShowQR}
                  disabled={confirming || expired}
                >
                  {confirming ? t('checkout.processing') : (t('checkout.placeOrder') || 'Xác nhận thanh toán')}
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-[400px] p-10 rounded-3xl text-center bg-white text-black shadow-2xl">
            <h3 className="text-2xl font-extrabold mb-2 text-blue-600">Quét mã QR để thanh toán</h3>
            <p className="text-gray-500 text-sm mb-6">
              Mở ứng dụng ngân hàng hoặc Momo/ZaloPay để quét mã QR này.
            </p>

            <div className="w-[250px] h-[250px] mx-auto mb-6 bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=TicketRushPaymentMock')] bg-center bg-cover border border-gray-200 rounded-xl p-2" />
            
            <div className="font-black text-3xl text-black mb-8">
              {orderTotal.toLocaleString('vi-VN')}₫
            </div>

            <div className="flex flex-col gap-3">
              <button 
                className="w-full py-4 text-lg font-bold rounded-xl bg-green-500 hover:bg-green-600 text-white transition-colors disabled:opacity-50"
                onClick={handleConfirm}
                disabled={confirming}
              >
                {confirming ? 'Đang xử lý...' : 'Giả lập: Đã quét & Thanh toán thành công'}
              </button>
              <button 
                className="w-full py-3 font-bold rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors disabled:opacity-50" 
                onClick={() => setShowQR(false)}
                disabled={confirming}
              >
                Hủy thanh toán
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
