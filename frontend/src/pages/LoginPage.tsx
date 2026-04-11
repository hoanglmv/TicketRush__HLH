import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../i18n';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authApi.login({ username, password });
      login(res.data.data);
      navigate(res.data.data.role === 'ROLE_ADMIN' ? '/admin' : '/events');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page flex-center" style={{ minHeight: 'calc(100vh - 64px)' }}>
      <div className="glass-card animate-fadeIn" style={{ width: '100%', maxWidth: 420 }}>
        <h1 style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 800, marginBottom: 24 }}>
          {t('login.welcomeBack')}
        </h1>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">{t('login.username')}</label>
            <input className="form-input" type="text" value={username}
              onChange={e => setUsername(e.target.value)} required placeholder={t('login.usernamePlaceholder')} />
          </div>
          <div className="form-group">
            <label className="form-label">{t('login.password')}</label>
            <input className="form-input" type="password" value={password}
              onChange={e => setPassword(e.target.value)} required placeholder={t('login.passwordPlaceholder')} />
          </div>
          <button className="btn btn-primary btn-lg" type="submit" disabled={loading}
            style={{ width: '100%', marginTop: 8 }}>
            {loading ? t('login.signingIn') : t('login.signIn')}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 20, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          {t('login.noAccount')} <Link to="/register">{t('login.createOne')}</Link>
        </p>
      </div>
    </div>
  );
}
