import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userApi, authApi, bookingApi, wishlistApi } from '../api';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../i18n';
import { User, Key, Ticket, LogOut, Heart, Send } from 'lucide-react';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState('profile');
  
  // Profile State
  const [profile, setProfile] = useState<any>(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('OTHER');
  const [profileMsg, setProfileMsg] = useState({ text: '', type: '' });

  // Password State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [pwdMsg, setPwdMsg] = useState({ text: '', type: '' });

  // Tickets State
  const [tickets, setTickets] = useState<any[]>([]);

  // Wishlist State
  const [wishlist, setWishlist] = useState<any[]>([]);

  // Transfer State
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferTicketId, setTransferTicketId] = useState<number | null>(null);
  const [transferEmail, setTransferEmail] = useState('');
  const [transferMsg, setTransferMsg] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchProfile();
    fetchTickets();
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await wishlistApi.getAll();
      setWishlist(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await userApi.getProfile();
      const p = res.data.data;
      setProfile(p);
      setFullName(p.fullName || '');
      setPhone(p.phone || '');
      setDateOfBirth(p.dateOfBirth || '');
      setGender(p.gender || 'OTHER');
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 401 || err.response?.status === 500) {
        logout();
        navigate('/login');
      } else {
        setProfileMsg({ text: 'Error loading profile', type: 'error' });
        // Set an empty profile to stop the spinner
        setProfile({});
      }
    }
  };

  const fetchTickets = async () => {
    try {
      const res = await bookingApi.myTickets();
      setTickets(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg({ text: '', type: '' });
    try {
      await userApi.updateProfile({ fullName, phone, dateOfBirth, gender });
      setProfileMsg({ text: 'Profile updated successfully', type: 'success' });
      setEditingProfile(false);
      fetchProfile();
    } catch (err: any) {
      setProfileMsg({ text: err.response?.data?.message || 'Failed to update', type: 'error' });
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdMsg({ text: '', type: '' });
    try {
      await authApi.changePassword({ oldPassword, newPassword });
      setPwdMsg({ text: 'Password changed successfully', type: 'success' });
      setOldPassword('');
      setNewPassword('');
    } catch (err: any) {
      setPwdMsg({ text: err.response?.data?.message || 'Failed to change password', type: 'error' });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleTransferTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferTicketId) return;
    setTransferMsg({ text: '', type: '' });
    try {
      await bookingApi.transfer(transferTicketId, transferEmail);
      setTransferMsg({ text: t('profile.transferSuccess') || 'Ticket transferred successfully!', type: 'success' });
      setTimeout(() => {
        setShowTransferModal(false);
        setTransferTicketId(null);
        setTransferEmail('');
        fetchTickets();
      }, 1500);
    } catch (err: any) {
      setTransferMsg({ text: err.response?.data?.message || 'Failed to transfer ticket', type: 'error' });
    }
  };

  if (!profile) return <div className="page" style={{ paddingTop: 100, textAlign: 'center' }}><div className="spinner"></div></div>;

  return (
    <div className="page" style={{ paddingTop: '80px', paddingBottom: '80px', background: '#f9fafb', minHeight: '100vh' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '32px' }}>
        
        {/* Sidebar */}
        <div className="glass-card" style={{ padding: '24px', height: 'fit-content' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 800, margin: '0 auto 16px' }}>
              {profile.fullName ? profile.fullName[0].toUpperCase() : profile.username[0].toUpperCase()}
            </div>
            <h3 style={{ fontWeight: 700, fontSize: '1.2rem' }}>{profile.fullName || profile.username}</h3>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{profile.email}</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button className={`btn ${activeTab === 'profile' ? 'btn-primary' : 'btn-outline'}`} style={{ justifyContent: 'flex-start' }} onClick={() => setActiveTab('profile')}>
              <User size={18} style={{ marginRight: 8 }} /> {t('profile.personalInfo') || 'Personal Info'}
            </button>
            <button className={`btn ${activeTab === 'tickets' ? 'btn-primary' : 'btn-outline'}`} style={{ justifyContent: 'flex-start' }} onClick={() => setActiveTab('tickets')}>
              <Ticket size={18} style={{ marginRight: 8 }} /> {t('profile.myTickets') || 'My Tickets'}
            </button>
            <button className={`btn ${activeTab === 'wishlist' ? 'btn-primary' : 'btn-outline'}`} style={{ justifyContent: 'flex-start' }} onClick={() => setActiveTab('wishlist')}>
              <Heart size={18} style={{ marginRight: 8 }} /> {t('profile.wishlist') || 'Sự kiện quan tâm'}
            </button>
            <button className={`btn ${activeTab === 'password' ? 'btn-primary' : 'btn-outline'}`} style={{ justifyContent: 'flex-start' }} onClick={() => setActiveTab('password')}>
              <Key size={18} style={{ marginRight: 8 }} /> {t('profile.changePassword') || 'Change Password'}
            </button>
            <button className="btn btn-outline" style={{ justifyContent: 'flex-start', color: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={handleLogout}>
              <LogOut size={18} style={{ marginRight: 8 }} /> {t('navbar.signOut') || 'Sign Out'}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="glass-card" style={{ padding: '32px' }}>
          
          {activeTab === 'profile' && (
            <div className="animate-fadeIn">
              <div className="flex-between" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{t('profile.personalInfo') || 'Personal Information'}</h2>
                <button className={editingProfile ? "btn btn-outline" : "btn btn-primary"} onClick={() => setEditingProfile(!editingProfile)}>
                  {editingProfile ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>

              {profileMsg.text && <div className={`alert alert-${profileMsg.type}`} style={{ marginBottom: 24 }}>{profileMsg.text}</div>}

              {editingProfile ? (
                <form onSubmit={handleUpdateProfile} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label className="form-label">Username (Locked)</label>
                    <input className="form-input" type="text" value={profile.username} disabled style={{ background: '#f0f0f0' }} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input className="form-input" type="text" value={fullName} onChange={e => setFullName(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input className="form-input" type="text" value={phone} onChange={e => setPhone(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Date of Birth</label>
                    <input className="form-input" type="date" value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Gender</label>
                    <select className="form-input" value={gender} onChange={e => setGender(e.target.value)}>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  <div style={{ gridColumn: 'span 2', marginTop: 16 }}>
                    <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>Save Changes</button>
                  </div>
                </form>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 4 }}>Full Name</div>
                    <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{profile.fullName || '-'}</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 4 }}>Phone</div>
                    <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{profile.phone || '-'}</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 4 }}>Date of Birth</div>
                    <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{profile.dateOfBirth || '-'}</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 4 }}>Gender</div>
                    <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{profile.gender || '-'}</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'password' && (
            <div className="animate-fadeIn">
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '24px' }}>
                {t('profile.changePassword') || 'Change Password'}
              </h2>
              {pwdMsg.text && <div className={`alert alert-${pwdMsg.type}`} style={{ marginBottom: 24 }}>{pwdMsg.text}</div>}

              <form onSubmit={handleChangePassword} style={{ maxWidth: 400 }}>
                <div className="form-group">
                  <label className="form-label">Current Password</label>
                  <input className="form-input" type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input className="form-input" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary" style={{ marginTop: 16 }}>Update Password</button>
              </form>
            </div>
          )}

          {activeTab === 'tickets' && (
            <div className="animate-fadeIn">
              <div className="flex-between" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{t('profile.myTickets') || 'My Tickets'}</h2>
                <button className="btn btn-primary" onClick={() => navigate('/tickets')}>View Dashboard</button>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {tickets.length === 0 ? (
                  <div style={{ padding: 40, textAlign: 'center', background: 'rgba(0,0,0,0.02)', borderRadius: 12 }}>
                    <p style={{ color: 'var(--text-muted)' }}>You don't have any tickets yet.</p>
                  </div>
                ) : (
                  tickets.slice(0, 5).map(ticket => (
                    <div key={ticket.id} style={{ display: 'flex', justifyContent: 'space-between', padding: 16, background: 'rgba(0,0,0,0.02)', borderRadius: 12, border: '1px solid var(--border-color)' }}>
                      <div>
                        <div style={{ fontWeight: 800 }}>{ticket.eventName}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{ticket.zoneName} - Row {ticket.seatLabel ? ticket.seatLabel[0] : ''} Seat {ticket.seatLabel}</div>
                      </div>
                      <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>{ticket.status}</div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{ticket.price.toLocaleString('vi-VN')}đ</div>
                        </div>
                        {ticket.status === 'PAID' && (
                          <button 
                            className="btn btn-secondary" 
                            style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                            onClick={() => {
                              setTransferTicketId(ticket.id);
                              setShowTransferModal(true);
                              setTransferMsg({ text: '', type: '' });
                            }}
                          >
                            <Send size={14} style={{ marginRight: 6 }} /> {t('profile.giftTicket') || 'Tặng vé'}
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'wishlist' && (
            <div className="animate-fadeIn">
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '24px' }}>
                {t('profile.wishlist') || 'Sự kiện quan tâm'}
              </h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                {wishlist.length === 0 ? (
                  <div style={{ gridColumn: '1 / -1', padding: 40, textAlign: 'center', background: 'rgba(0,0,0,0.02)', borderRadius: 12 }}>
                    <p style={{ color: 'var(--text-muted)' }}>{t('profile.emptyWishlist') || "You haven't saved any events yet."}</p>
                  </div>
                ) : (
                  wishlist.map(event => (
                    <div key={event.id} className="glass-card" style={{ padding: '16px', cursor: 'pointer' }} onClick={() => navigate(`/events/${event.id}`)}>
                      <div style={{ width: '100%', height: '140px', borderRadius: '8px', background: `url(${event.bannerUrl}) center/cover`, marginBottom: '12px' }} />
                      <h4 style={{ fontWeight: 700, marginBottom: '8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{event.name}</h4>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>{new Date(event.eventDate).toLocaleDateString()}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{event.venue}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Transfer Modal */}
      {showTransferModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
        }}>
          <div className="glass-panel" style={{ width: 400, padding: 32, borderRadius: 20 }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 16 }}>{t('profile.giftTicket') || 'Tặng vé cho bạn bè'}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 24 }}>
              {t('profile.transferDesc') || 'Please enter the registered email address of the person you want to send this ticket to.'}
            </p>

            {transferMsg.text && <div className={`alert alert-${transferMsg.type}`} style={{ marginBottom: 20 }}>{transferMsg.text}</div>}

            <form onSubmit={handleTransferTicket}>
              <div className="form-group">
                <label className="form-label">{t('auth.email') || 'Email Address'}</label>
                <input 
                  type="email" 
                  className="form-input" 
                  value={transferEmail} 
                  onChange={e => setTransferEmail(e.target.value)} 
                  required 
                  placeholder="friend@example.com"
                />
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowTransferModal(false)}>
                  {t('profile.cancel') || 'Cancel'}
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  {t('profile.send') || 'Send Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
