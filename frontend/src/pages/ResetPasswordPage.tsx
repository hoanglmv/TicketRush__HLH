import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { authApi } from '../api';
import { useLanguage } from '../i18n';

export default function ResetPasswordPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      // If accessed directly without an email, redirect back
      navigate('/forgot-password');
    }
  }, [location, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await authApi.resetPassword({ email, otp, newPassword });
      setSuccess('Password has been reset successfully! You can now log in.');
      setTimeout(() => navigate('/login'), 2500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page flex-center" style={{ minHeight: 'calc(100vh - 64px)' }}>
      <div className="glass-card animate-fadeIn" style={{ width: '100%', maxWidth: 420 }}>
        <h1 style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 800, marginBottom: 12 }}>
          {t('login.resetPassword') || 'Reset Password'}
        </h1>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: 24, fontSize: '0.9rem' }}>
          {t('login.enterOtpDesc') || `We sent an OTP to ${email}` }
        </p>
        
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">{t('login.otp') || '6-digit OTP'}</label>
            <input 
              className="form-input" 
              type="text" 
              maxLength={6}
              value={otp}
              onChange={e => setOtp(e.target.value)} 
              required 
              placeholder="123456" 
            />
          </div>
          <div className="form-group">
            <label className="form-label">{t('login.newPassword') || 'New Password'}</label>
            <input 
              className="form-input" 
              type="password" 
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)} 
              required 
              placeholder="••••••••" 
            />
          </div>
          <button className="btn btn-primary btn-lg" type="submit" disabled={loading || !!success} style={{ width: '100%', marginTop: 8 }}>
            {loading ? (t('login.updating') || 'Updating...') : (t('login.resetPasswordBtn') || 'Reset Password')}
          </button>
        </form>
      </div>
    </div>
  );
}
