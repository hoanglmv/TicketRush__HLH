import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { eventApi, bookingApi } from '../api';
import { SeatResponse, SeatStatusUpdate, ZoneResponse } from '../types';
import { useLanguage } from '../i18n';

export default function SeatSelectionPage() {
  const { id } = useParams<{ id: string }>();
  const [seats, setSeats] = useState<SeatResponse[]>([]);
  const [zones, setZones] = useState<ZoneResponse[]>([]);
  const [selectedSeat, setSelectedSeat] = useState<SeatResponse | null>(null);
  const [hoverSeat, setHoverSeat] = useState<{seat: SeatResponse, x: number, y: number} | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const clientRef = useRef<Client | null>(null);
  const navigate = useNavigate();
  const { t } = useLanguage();

  // ISM states
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const mapRef = useRef<HTMLDivElement>(null);

  const eventId = Number(id);

  useEffect(() => {
    Promise.all([
      eventApi.seats(eventId),
      eventApi.zones(eventId)
    ]).then(([seatsRes, zonesRes]) => {
      setSeats(seatsRes.data.data || []);
      setZones(zonesRes.data.data || []);
      
      // Compute initial centering based on window width
      if (typeof window !== 'undefined') {
        setPosition({ x: 0, y: 50 });
      }
    }).catch(() => setError('Failed to load seats'))
      .finally(() => setLoading(false));
  }, [eventId]);

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

  const handleSeatClick = useCallback((seat: SeatResponse, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (seat.status !== 'AVAILABLE') return;
    setSelectedSeat(prev => prev?.id === seat.id ? null : seat);
    setError('');
    setSuccess('');
  }, []);

  const handleLockSeat = async () => {
    if (!selectedSeat) return;
    setBooking(true);
    setError('');
    try {
      const res = await bookingApi.lockSeat(selectedSeat.id);
      setSuccess(t('seats.seatHeld'));
      const ticketId = res.data.data.id;
      setTimeout(() => navigate(`/checkout/${ticketId}`), 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to lock seat');
      setSelectedSeat(null);
    } finally {
      setBooking(false);
    }
  };

  // Drag and Zoom handlers
  const handleZoomIn = () => setScale(s => Math.min(s + 0.2, 3));
  const handleZoomOut = () => setScale(s => Math.max(s - 0.2, 0.4));
  const handleResetZoom = () => { setScale(1); setPosition({ x: 0, y: 50 }); };
  
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) handleZoomIn();
    else handleZoomOut();
  };
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };
  const handleMouseUp = () => setIsDragging(false);

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

  if (loading) return <div className="page"><div className="container"><div className="loading-container"><div className="spinner" /></div></div></div>;

  return (
    <div className="page" style={{ paddingTop: '10px' }}>
      <div className="container" style={{ maxWidth: '1400px' }}>
        
        {/* Top Header */}
        <div className="flex-between" style={{ marginBottom: '16px', background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{t('seats.title')}</h1>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>{t('seats.subtitle')}</p>
          </div>
          {selectedSeat && (
            <div className="flex align-center gap-md" style={{ background: '#f8f9fa', padding: '10px 20px', borderRadius: '8px', border: '1px solid #ccc' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#666' }}>{t('seats.selected')}</div>
                <div style={{ fontWeight: 800, color: '#111' }}>{selectedSeat.zoneName} - Sec {selectedSeat.label}</div>
              </div>
              <div style={{ fontWeight: 800, fontSize: '1.4rem', color: '#026cdf', minWidth: '100px', textAlign: 'right' }}>
                {selectedSeat.price.toLocaleString('vi-VN')}₫
              </div>
              <button onClick={handleLockSeat} disabled={booking} className="btn" style={{ background: '#026cdf', color: 'white', padding: '12px 24px', fontSize: '1rem', fontWeight: 700 }}>
                {booking ? t('seats.holding') : t('seats.buyNow')}
              </button>
            </div>
          )}
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {/* ISM (Interactive Seat Map) Container */}
        <div className="grid-2" style={{ gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '20px' }}>
          
          <div 
            className="ism-container"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            ref={mapRef}
          >
            <div 
              className="ism-map"
              style={{ 
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`
              }}
            >
              <div className="ism-stage">{t('seats.mainStage')}</div>

              {seatsByZone.map(({ zone, rows }) => (
                <div key={zone.id} className="zone-section" style={{ position: 'relative' }}>
                  {/* Floating Zone Name */}
                  <div style={{ position: 'absolute', top: '-15px', right: '-40px', fontSize: '0.9rem', fontWeight: 800, color: zone.color, opacity: 0.8, textTransform: 'uppercase' }}>
                    {zone.name}
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
                          style={{
                            background: seat.status === 'AVAILABLE' ? zone.color : undefined
                          }}
                          onClick={(e) => handleSeatClick(seat, e)}
                          onMouseEnter={(e) => {
                            if (seat.status === 'AVAILABLE') {
                              setHoverSeat({ seat, x: e.clientX, y: e.clientY });
                            }
                          }}
                          onMouseLeave={() => setHoverSeat(null)}
                          disabled={seat.status !== 'AVAILABLE'}
                        >
                          {seat.colNumber}
                        </button>
                      ))}
                      <span className="seat-row-label">{rowLabel}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="ism-controls">
              <button className="ism-zoom-btn" onClick={handleZoomIn}>+</button>
              <button className="ism-zoom-btn" onClick={handleZoomOut}>−</button>
              <button className="ism-zoom-btn" onClick={handleResetZoom} style={{ fontSize: '0.9rem' }}>↺</button>
            </div>
          </div>

          {/* Sidebar Legend */}
          <div>
            <div style={{ background: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '16px' }}>{t('seats.filterByPrice')}</h3>
              <div className="flex flex-col gap-sm">
                {zones.sort((a, b) => b.price - a.price).map(z => (
                  <div key={z.id} className="flex-between" style={{ padding: '8px', borderBottom: '1px solid #f0f0f0' }}>
                    <div className="flex align-center gap-sm">
                      <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: z.color }}></div>
                      <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{z.name}</span>
                    </div>
                    <span style={{ fontSize: '0.95rem', fontWeight: 700 }}>{z.price.toLocaleString('vi-VN')}₫</span>
                  </div>
                ))}
              </div>

              <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: '24px 0 16px' }}>{t('seats.statusColors')}</h3>
              <div className="flex flex-col gap-sm">
                <div className="seat-legend-item">
                  <div className="seat-legend-dot" style={{ background: '#22c55e' }} />
                  <span>{t('seats.selectedStatus')}</span>
                </div>
                <div className="seat-legend-item">
                  <div className="seat-legend-dot" style={{ background: '#999' }} />
                  <span>{t('seats.lockedStatus')}</span>
                </div>
                <div className="seat-legend-item">
                  <div className="seat-legend-dot" style={{ background: '#ddd' }} />
                  <span>{t('seats.soldOut')}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Ticketmaster Style Hover Tooltip */}
      {hoverSeat && (
        <div className="ism-tooltip" style={{ left: hoverSeat.x + 15, top: hoverSeat.y - 15 }}>
          <div className="flex-between align-center" style={{ marginBottom: '8px' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#666', textTransform: 'uppercase' }}>{t('seats.standardTicket')}</span>
          </div>
          <div className="ism-tooltip-title">Sec {hoverSeat.seat.zoneName}, Row {hoverSeat.seat.label.replace(/[0-9]/g, '')}, Seat {hoverSeat.seat.colNumber}</div>
          <div className="ism-tooltip-price">{hoverSeat.seat.price.toLocaleString('vi-VN')}₫</div>
          <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '4px' }}>{t('seats.feesTaxes')}</div>
        </div>
      )}
    </div>
  );
}
