import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { eventApi, bookingApi } from '../api';
import { SeatResponse, SeatStatusUpdate, ZoneResponse } from '../types';

export default function SeatSelectionPage() {
  const { id } = useParams<{ id: string }>();
  const [seats, setSeats] = useState<SeatResponse[]>([]);
  const [zones, setZones] = useState<ZoneResponse[]>([]);
  const [selectedSeat, setSelectedSeat] = useState<SeatResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const clientRef = useRef<Client | null>(null);
  const navigate = useNavigate();

  const eventId = Number(id);

  // Load seats and zones
  useEffect(() => {
    Promise.all([
      eventApi.seats(eventId),
      eventApi.zones(eventId)
    ]).then(([seatsRes, zonesRes]) => {
      setSeats(seatsRes.data.data || []);
      setZones(zonesRes.data.data || []);
    }).catch(() => setError('Failed to load seats'))
      .finally(() => setLoading(false));
  }, [eventId]);

  // WebSocket connection for real-time updates
  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS('/ws'),
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe(`/topic/event/${eventId}/seats`, (message) => {
          const update: SeatStatusUpdate = JSON.parse(message.body);
          setSeats(prev => prev.map(s =>
            s.id === update.seatId ? { ...s, status: update.status } : s
          ));
          // Deselect if someone else locked our selected seat
          setSelectedSeat(prev =>
            prev && prev.id === update.seatId && update.status !== 'AVAILABLE' ? null : prev
          );
        });
      },
    });

    client.activate();
    clientRef.current = client;

    return () => { client.deactivate(); };
  }, [eventId]);

  // Handle seat click
  const handleSeatClick = useCallback((seat: SeatResponse) => {
    if (seat.status !== 'AVAILABLE') return;
    setSelectedSeat(prev => prev?.id === seat.id ? null : seat);
    setError('');
    setSuccess('');
  }, []);

  // Handle booking
  const handleLockSeat = async () => {
    if (!selectedSeat) return;
    setBooking(true);
    setError('');
    try {
      const res = await bookingApi.lockSeat(selectedSeat.id);
      setSuccess('Ghế đã được giữ! Bạn có 10 phút để thanh toán.');
      const ticketId = res.data.data.id;
      setTimeout(() => navigate(`/checkout/${ticketId}`), 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to lock seat');
      setSelectedSeat(null);
    } finally {
      setBooking(false);
    }
  };

  // Group seats by zone and row
  const seatsByZone = zones.map(zone => ({
    zone,
    rows: Array.from(
      new Set(seats.filter(s => s.zoneId === zone.id).map(s => s.rowNumber))
    ).sort((a, b) => a - b).map(rowNum => ({
      rowNum,
      rowLabel: String.fromCharCode(64 + rowNum),
      seats: seats.filter(s => s.zoneId === zone.id && s.rowNumber === rowNum)
        .sort((a, b) => a.colNumber - b.colNumber),
    }))
  }));

  if (loading) return <div className="page"><div className="container"><div className="loading-container"><div className="spinner" /><p>Loading seat map...</p></div></div></div>;

  return (
    <div className="page">
      <div className="container animate-fadeIn">
        <div className="page-header flex-between">
          <div>
            <h1>Chọn ghế</h1>
            <p>Click vào ghế xanh để chọn. Ghế cập nhật tự động.</p>
          </div>
          {selectedSeat && (
            <div className="flex gap-md" style={{ alignItems: 'center' }}>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Đã chọn: </span>
                <strong>{selectedSeat.zoneName} — {selectedSeat.label}</strong>
                <span style={{ marginLeft: 8, color: 'var(--accent-primary)', fontWeight: 700 }}>
                  {selectedSeat.price.toLocaleString('vi-VN')}₫
                </span>
              </div>
              <button className="btn btn-primary" onClick={handleLockSeat} disabled={booking}>
                {booking ? 'Đang giữ chỗ...' : '🎫 Giữ chỗ & Thanh toán'}
              </button>
            </div>
          )}
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="glass-card seat-map-container">
          <div className="stage">🎤 SÂN KHẤU</div>

          {seatsByZone.map(({ zone, rows }) => (
            <div key={zone.id} className="zone-section">
              <div className="zone-header">
                <div className="zone-color-dot" style={{ background: zone.color }} />
                <span className="zone-name">{zone.name}</span>
                <span className="zone-price">{zone.price.toLocaleString('vi-VN')}₫</span>
              </div>
              {rows.map(({ rowNum, rowLabel, seats: rowSeats }) => (
                <div className="seat-row" key={rowNum}>
                  <span className="seat-row-label">{rowLabel}</span>
                  {rowSeats.map(seat => (
                    <button
                      key={seat.id}
                      className={`seat ${
                        selectedSeat?.id === seat.id ? 'seat-selected' :
                        seat.status === 'AVAILABLE' ? 'seat-available' :
                        seat.status === 'LOCKED' ? 'seat-locked' : 'seat-sold'
                      }`}
                      onClick={() => handleSeatClick(seat)}
                      disabled={seat.status !== 'AVAILABLE'}
                      title={`${seat.label} — ${seat.status}`}
                    >
                      {seat.colNumber}
                    </button>
                  ))}
                  <span className="seat-row-label">{rowLabel}</span>
                </div>
              ))}
            </div>
          ))}

          <div className="seat-legend">
            <div className="seat-legend-item">
              <div className="seat-legend-dot" style={{ background: 'var(--seat-available)' }} />
              <span>Trống</span>
            </div>
            <div className="seat-legend-item">
              <div className="seat-legend-dot" style={{ background: 'var(--seat-selected)' }} />
              <span>Đang chọn</span>
            </div>
            <div className="seat-legend-item">
              <div className="seat-legend-dot" style={{ background: 'var(--seat-locked)' }} />
              <span>Đang giữ</span>
            </div>
            <div className="seat-legend-item">
              <div className="seat-legend-dot" style={{ background: 'var(--seat-sold)' }} />
              <span>Đã bán</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
