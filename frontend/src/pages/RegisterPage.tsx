import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api';

import { useLanguage } from '../i18n';

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: '', password: '', confirmPassword: '', email: '', fullName: '', phone: '',
    dateOfBirth: '', gender: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!/^[a-zA-Z0-9._]+$/.test(form.username)) {
      setError('Username can only contain letters, numbers, dots, and underscores');
      return;
    }

    if (form.password.length < 8) {
      setError(t('register.minChars'));
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError(t('register.passwordMismatch') || 'Passwords do not match');
      return;
    }

    if (!form.dateOfBirth) {
      setError(t('register.dobRequired') || 'Vui lòng nhập ngày sinh');
      return;
    }
    
    const dob = new Date(form.dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    
    if (age < 16) {
      setError(t('register.minAge') || 'Bạn phải từ 16 tuổi trở lên mới được đăng ký');
      return;
    }

    setLoading(true);
    try {
      const payload: any = { ...form };
      delete payload.confirmPassword;
      if (!payload.gender) delete payload.gender;
      
      await authApi.register(payload);
      alert('Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-64px)] py-10 px-4">
      <div className="w-full max-w-[480px] bg-bg-card border border-border-color rounded-2xl p-8 shadow-xl animate-[fadeIn_0.5s_ease-out]">
            <h1 className="text-center text-2xl font-extrabold mb-6 text-text-primary">
              {t('register.createAccount')}
            </h1>
            {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm font-medium">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-text-secondary mb-2">{t('register.username')}</label>
                  <input className="w-full bg-bg-input border border-border-color rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all" name="username" value={form.username}
                    onChange={handleChange} required placeholder="johndoe" />
                </div>
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-text-secondary mb-2">{t('register.email')}</label>
                  <input className="w-full bg-bg-input border border-border-color rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all" name="email" type="email" value={form.email}
                    onChange={handleChange} required placeholder="john@email.com" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-text-secondary mb-2">{t('register.password')}</label>
                  <input className="w-full bg-bg-input border border-border-color rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all" name="password" type="password" value={form.password}
                    onChange={handleChange} required minLength={8} placeholder={t('register.minChars')} />
                </div>
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-text-secondary mb-2">{t('register.confirmPassword') || 'Confirm Password *'}</label>
                  <input className="w-full bg-bg-input border border-border-color rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all" name="confirmPassword" type="password" value={form.confirmPassword}
                    onChange={handleChange} required minLength={8} placeholder={t('register.confirmPasswordPlaceholder') || 'Re-enter password'} />
                </div>
              </div>
              <div className="mb-5">
                <label className="block text-sm font-semibold text-text-secondary mb-2">{t('register.fullName')}</label>
                <input className="w-full bg-bg-input border border-border-color rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all" name="fullName" value={form.fullName}
                  onChange={handleChange} placeholder="John Doe" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-text-secondary mb-2">{t('register.dateOfBirth')}</label>
                  <input className="w-full bg-bg-input border border-border-color rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all" name="dateOfBirth" type="date" value={form.dateOfBirth}
                    onChange={handleChange} required />
                </div>
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-text-secondary mb-2">{t('register.gender')}</label>
                  <select className="w-full bg-bg-input border border-border-color rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all" name="gender" value={form.gender} onChange={handleChange}>
                    <option value="">{t('register.selectGender')}</option>
                    <option value="MALE">{t('register.male')}</option>
                    <option value="FEMALE">{t('register.female')}</option>
                    <option value="OTHER">{t('register.other')}</option>
                  </select>
                </div>
              </div>
              <div className="mb-5">
                <label className="block text-sm font-semibold text-text-secondary mb-2">{t('register.phone')}</label>
                <input className="w-full bg-bg-input border border-border-color rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all" name="phone" value={form.phone}
                  onChange={handleChange} placeholder="+84 123 456 789" />
              </div>
              <button className="w-full mt-2 py-3 bg-accent-primary text-white font-bold rounded-lg hover:bg-accent-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_14px_0_rgba(0,177,79,0.39)]" type="submit" disabled={loading}>
                {loading ? t('register.creating') : t('register.create')}
              </button>
            </form>
            <p className="text-center mt-6 text-text-secondary text-sm">
              {t('register.hasAccount')} <Link to="/login" className="text-accent-primary hover:underline font-medium">{t('register.signIn')}</Link>
            </p>

      </div>
    </div>
  );
}
