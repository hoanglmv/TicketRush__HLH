import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../i18n';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/events');
    }
  }, [isAuthenticated, navigate]);

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
    <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-64px)] py-10 px-4">
      <div className="w-full max-w-[420px] bg-bg-card border border-border-color rounded-2xl p-8 shadow-xl animate-[fadeIn_0.5s_ease-out]">
        <h1 className="text-center text-2xl font-extrabold mb-6 text-text-primary">
          {t('login.welcomeBack')}
        </h1>
        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm font-medium">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-sm font-semibold text-text-secondary mb-2">{t('login.username')}</label>
            <input className="w-full bg-bg-input border border-border-color rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all" type="text" value={username}
              onChange={e => setUsername(e.target.value)} required placeholder={t('login.usernamePlaceholder')} />
          </div>
          <div className="mb-5">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-semibold text-text-secondary mb-2">{t('login.password')}</label>
            </div>
            <input className="w-full bg-bg-input border border-border-color rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all" type="password" value={password}
              onChange={e => setPassword(e.target.value)} required placeholder={t('login.passwordPlaceholder')} />
          </div>
          <button className="w-full mt-2 py-3 bg-accent-primary text-white font-bold rounded-lg hover:bg-accent-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_14px_0_rgba(0,177,79,0.39)]" type="submit" disabled={loading}>
            {loading ? t('login.signingIn') : t('login.signIn')}
          </button>
        </form>
        <p className="text-center mt-6 text-text-secondary text-sm">
          {t('login.noAccount')} <Link to="/register" className="text-accent-primary hover:underline font-medium">{t('login.createOne')}</Link>
        </p>
      </div>
    </div>
  );
}
