import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api';
import { useLanguage } from '../i18n';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authApi.forgotPassword({ email });
      // Redirect to Reset Password page, passing the email via state
      navigate('/reset-password', { state: { email } });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page flex-center" style={{ minHeight: 'calc(100vh - 64px)' }}>
      <div className="glass-card animate-fadeIn" style={{ width: '100%', maxWidth: 420 }}>
        <h1 style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 800, marginBottom: 12 }}>
          {t('login.forgotPassword') || 'Forgot Password?'}
        </h1>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: 24, fontSize: '0.9rem' }}>
          {t('login.forgotPasswordDesc') || 'Enter your email address and we will send you an OTP to reset your password.'}
        </p>
        
        {error && <div className="alert alert-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">{t('login.email') || 'Email Address'}</label>
            <input 
              className="form-input" 
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)} 
              required 
              placeholder="name@example.com" 
            />
          </div>
          <button className="btn btn-primary btn-lg" type="submit" disabled={loading} style={{ width: '100%', marginTop: 8 }}>
            {loading ? (t('login.sendingOtp') || 'Sending OTP...') : (t('login.sendOtp') || 'Send OTP')}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 20, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          <Link to="/login">&larr; {t('login.backToLogin') || 'Back to Login'}</Link>
        </p>
      </div>
    </div>
  );
}
