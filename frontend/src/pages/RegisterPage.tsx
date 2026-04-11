import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../i18n';

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: '', password: '', email: '', fullName: '', phone: '',
    dateOfBirth: '', gender: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authApi.register(form);
      login(res.data.data);
      navigate('/events');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page flex-center" style={{ minHeight: 'calc(100vh - 64px)' }}>
      <div className="glass-card animate-fadeIn" style={{ width: '100%', maxWidth: 480 }}>
        <h1 style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 800, marginBottom: 24 }}>
          {t('register.createAccount')}
        </h1>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">{t('register.username')}</label>
              <input className="form-input" name="username" value={form.username}
                onChange={handleChange} required placeholder="johndoe" />
            </div>
            <div className="form-group">
              <label className="form-label">{t('register.email')}</label>
              <input className="form-input" name="email" type="email" value={form.email}
                onChange={handleChange} required placeholder="john@email.com" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">{t('register.password')}</label>
            <input className="form-input" name="password" type="password" value={form.password}
              onChange={handleChange} required placeholder={t('register.minChars')} />
          </div>
          <div className="form-group">
            <label className="form-label">{t('register.fullName')}</label>
            <input className="form-input" name="fullName" value={form.fullName}
              onChange={handleChange} placeholder="John Doe" />
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">{t('register.dateOfBirth')}</label>
              <input className="form-input" name="dateOfBirth" type="date" value={form.dateOfBirth}
                onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">{t('register.gender')}</label>
              <select className="form-select" name="gender" value={form.gender} onChange={handleChange}>
                <option value="">{t('register.selectGender')}</option>
                <option value="MALE">{t('register.male')}</option>
                <option value="FEMALE">{t('register.female')}</option>
                <option value="OTHER">{t('register.other')}</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">{t('register.phone')}</label>
            <input className="form-input" name="phone" value={form.phone}
              onChange={handleChange} placeholder="+84 123 456 789" />
          </div>
          <button className="btn btn-primary btn-lg" type="submit" disabled={loading}
            style={{ width: '100%', marginTop: 8 }}>
            {loading ? t('register.creating') : t('register.create')}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 20, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          {t('register.hasAccount')} <Link to="/login">{t('register.signIn')}</Link>
        </p>
      </div>
    </div>
  );
}
