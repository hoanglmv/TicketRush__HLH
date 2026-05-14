import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userApi, authApi, bookingApi } from '../api';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../i18n';
import { User, Key, Ticket, LogOut } from 'lucide-react';

export default function ProfilePage() {
  const { logout } = useAuth();
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



  useEffect(() => {
    fetchProfile();
    fetchTickets();
  }, []);

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



  if (!profile) return <div className="flex-1 pt-20 text-center flex justify-center"><div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div></div>;

  return (
    <div className="flex-1 pt-20 pb-20 bg-gray-50 min-h-[calc(100vh-64px)] text-gray-900">
      <div className="container mx-auto px-6 max-w-6xl grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
        
        {/* Sidebar */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 h-fit">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white flex items-center justify-center text-3xl font-extrabold mx-auto mb-4 shadow-md">
              {profile.fullName ? profile.fullName[0].toUpperCase() : profile.username[0].toUpperCase()}
            </div>
            <h3 className="font-bold text-lg text-gray-900">{profile.fullName || profile.username}</h3>
            <div className="text-gray-500 text-sm mt-1">{profile.email}</div>
          </div>

          <div className="flex flex-col gap-2">
            <button className={`w-full flex items-center px-4 py-3 rounded-lg font-bold transition-colors ${activeTab === 'profile' ? 'bg-blue-600 text-white shadow-md' : 'bg-transparent text-gray-700 hover:bg-gray-100 border border-transparent'}`} onClick={() => setActiveTab('profile')}>
              <User size={18} className="mr-3" /> {t('profile.personalInfo') || 'Personal Info'}
            </button>
            <button className={`w-full flex items-center px-4 py-3 rounded-lg font-bold transition-colors ${activeTab === 'tickets' ? 'bg-blue-600 text-white shadow-md' : 'bg-transparent text-gray-700 hover:bg-gray-100 border border-transparent'}`} onClick={() => setActiveTab('tickets')}>
              <Ticket size={18} className="mr-3" /> {t('profile.myTickets') || 'My Tickets'}
            </button>

            <button className={`w-full flex items-center px-4 py-3 rounded-lg font-bold transition-colors ${activeTab === 'password' ? 'bg-blue-600 text-white shadow-md' : 'bg-transparent text-gray-700 hover:bg-gray-100 border border-transparent'}`} onClick={() => setActiveTab('password')}>
              <Key size={18} className="mr-3" /> {t('profile.changePassword') || 'Change Password'}
            </button>
            <button className="w-full flex items-center px-4 py-3 rounded-lg font-bold transition-colors bg-transparent text-red-600 hover:bg-red-50 border border-red-200 mt-4" onClick={handleLogout}>
              <LogOut size={18} className="mr-3" /> {t('nav.signOut') || 'Sign Out'}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
          
          {activeTab === 'profile' && (
            <div className="animate-[fadeIn_0.3s_ease-out]">
              <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-6">
                <h2 className="text-2xl font-extrabold">{t('profile.personalInfo') || 'Personal Information'}</h2>
                <button className={`px-4 py-2 font-bold rounded-lg transition-colors border ${editingProfile ? "bg-white text-gray-700 border-gray-300 hover:bg-gray-50" : "bg-blue-600 text-white border-transparent hover:bg-blue-700 shadow-md"}`} onClick={() => setEditingProfile(!editingProfile)}>
                  {editingProfile ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>

              {profileMsg.text && <div className={`p-4 rounded-lg mb-6 font-medium ${profileMsg.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>{profileMsg.text}</div>}

              {editingProfile ? (
                <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="col-span-1 md:col-span-2 mb-2">
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Username (Locked)</label>
                    <input className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-300 text-gray-500 cursor-not-allowed" type="text" value={profile.username} disabled />
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Full Name</label>
                    <input className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors" type="text" value={fullName} onChange={e => setFullName(e.target.value)} required />
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Phone Number</label>
                    <input className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors" type="text" value={phone} onChange={e => setPhone(e.target.value)} />
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Date of Birth</label>
                    <input className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors" type="date" value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)} />
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Gender</label>
                    <select className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors" value={gender} onChange={e => setGender(e.target.value)}>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  <div className="col-span-1 md:col-span-2 mt-4">
                    <button type="submit" className="w-full py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-md text-lg">Save Changes</button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div className="text-gray-500 text-sm font-medium mb-1">Full Name</div>
                    <div className="font-bold text-lg text-gray-900">{profile.fullName || '-'}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div className="text-gray-500 text-sm font-medium mb-1">Phone</div>
                    <div className="font-bold text-lg text-gray-900">{profile.phone || '-'}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div className="text-gray-500 text-sm font-medium mb-1">Date of Birth</div>
                    <div className="font-bold text-lg text-gray-900">{profile.dateOfBirth || '-'}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div className="text-gray-500 text-sm font-medium mb-1">Gender</div>
                    <div className="font-bold text-lg text-gray-900">{profile.gender || '-'}</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'password' && (
            <div className="animate-[fadeIn_0.3s_ease-out]">
              <h2 className="text-2xl font-extrabold border-b border-gray-200 pb-4 mb-6">
                {t('profile.changePassword') || 'Change Password'}
              </h2>
              {pwdMsg.text && <div className={`p-4 rounded-lg mb-6 font-medium ${pwdMsg.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>{pwdMsg.text}</div>}

              <form onSubmit={handleChangePassword} className="max-w-[400px]">
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Current Password</label>
                  <input className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors" type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} required />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-600 mb-2">New Password</label>
                  <input className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
                </div>
                <button type="submit" className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-md">Update Password</button>
              </form>
            </div>
          )}

          {activeTab === 'tickets' && (
            <div className="animate-[fadeIn_0.3s_ease-out]">
              <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-6">
                <h2 className="text-2xl font-extrabold">{t('profile.myTickets') || 'My Tickets'}</h2>
                <button className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-md" onClick={() => navigate('/tickets')}>View Dashboard</button>
              </div>
              
              <div className="flex flex-col gap-4">
                {tickets.length === 0 ? (
                  <div className="p-10 text-center bg-gray-50 border border-gray-200 rounded-xl">
                    <p className="text-gray-500 font-medium">You don't have any tickets yet.</p>
                  </div>
                ) : (
                  tickets.slice(0, 5).map(ticket => (
                    <div key={ticket.id} className="flex justify-between p-4 bg-white hover:bg-gray-50 transition-colors rounded-xl border border-gray-200 shadow-sm">
                      <div>
                        <div className="font-extrabold text-lg text-gray-900 mb-1">{ticket.eventName}</div>
                        <div className="text-gray-500 text-sm font-medium">{ticket.zoneName} - Row {ticket.seatLabel ? ticket.seatLabel[0] : ''} Seat {ticket.seatLabel}</div>
                      </div>
                      <div className="text-right flex flex-col items-end gap-1">
                        <div>
                          <div className="font-bold text-blue-600">{ticket.status}</div>
                          <div className="text-gray-500 text-sm font-bold mt-1">{ticket.price.toLocaleString('vi-VN')}đ</div>
                        </div>

                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
