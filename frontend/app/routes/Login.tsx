// app/routes/login.tsx
import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '~/contexts/auth';
import { useTheme } from '~/contexts/themeContext';

export const meta = () => {
  return [
    { title: "Login - PetMatch" },
    { name: "description", content: "Login to your PetMatch account" },
  ];
};


export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { isDarkMode } = useTheme();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: isDarkMode ? '#36332E' : '#F7F5EA' }}>
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-amber-100 to-orange-100 items-center justify-center p-12">
        <div className="max-w-md">
          <img
            src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800&auto=format&fit=crop"
            alt="Cute pets"
            className="w-full rounded-3xl shadow-2xl object-cover"
          />
        </div>
      </div>

      {/* Right side - Form */}
      <div
        className="w-full lg:w-1/2 flex items-center justify-center p-8"
        style={{ backgroundColor: isDarkMode ? '#36332E' : '#F7F5EA' }}
      >
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold" style={{ color: isDarkMode ? '#F5F3ED' : '#36332E' }}>
              PET<span className="inline-flex items-center">
                M<span className="text-amber-600">🐾</span>TCH
              </span>
            </h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div
                className="px-4 py-3 rounded-lg"
                style={{
                  backgroundColor: isDarkMode ? 'rgba(239, 68, 68, 0.1)' : '#fef2f2',
                  border: `1px solid ${isDarkMode ? 'rgba(239, 68, 68, 0.3)' : '#fecaca'}`,
                  color: isDarkMode ? '#fca5a5' : '#b91c1c'
                }}
              >
                {error}
              </div>
            )}

            <div>
              <label
                className="block mb-2"
                style={{ color: isDarkMode ? '#F7F5EA' : '#36332E' }}
              >
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 outline-none bg-transparent transition-colors"
                style={{
                  borderBottom: `2px solid ${isDarkMode ? '#928e85' : '#d1d5db'}`,
                  color: isDarkMode ? '#F7F5EA' : '#36332E'
                }}
                placeholder="example@gmail.com"
                required
                onFocus={(e) => (e.target as HTMLInputElement).style.borderBottomColor = '#d97706'}
                onBlur={(e) => (e.target as HTMLInputElement).style.borderBottomColor = isDarkMode ? '#928e85' : '#d1d5db'}
              />
            </div>

            <div>
              <label
                className="block mb-2"
                style={{ color: isDarkMode ? '#F7F5EA' : '#36332E' }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 outline-none bg-transparent transition-colors"
                  style={{
                    borderBottom: `2px solid ${isDarkMode ? '#928e85' : '#d1d5db'}`,
                    color: isDarkMode ? '#F7F5EA' : '#36332E'
                  }}
                  placeholder="••••••••••••••"
                  required
                  onFocus={(e) => (e.target as HTMLInputElement).style.borderBottomColor = '#d97706'}
                  onBlur={(e) => (e.target as HTMLInputElement).style.borderBottomColor = isDarkMode ? '#928e85' : '#d1d5db'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 hover:opacity-75 transition-opacity"
                  style={{ color: isDarkMode ? '#F7F5EA' : '#6b7280' }}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-5 h-5 rounded focus:ring-amber-500"
                style={{
                  accentColor: '#d97706',
                  border: `1px solid ${isDarkMode ? '#928e85' : '#d1d5db'}`
                }}
              />
              <label
                htmlFor="remember"
                className="text-sm"
                style={{ color: isDarkMode ? '#F7F5EA' : '#36332E' }}
              >
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full font-semibold py-3 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: '#d97706',
                color: '#F7F5EA'
              }}
              onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#b45309'}
              onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#d97706'}
            >
              {loading ? 'LOGGING IN...' : 'LOG IN'}
            </button>

            <div className="text-center text-sm" style={{ color: isDarkMode ? '#F7F5EA' : '#36332E' }}>
              new to petMatch?{' '}
              <Link
                to="/register"
                className="font-semibold hover:underline"
                style={{ color: '#d97706' }}
              >
                sign up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}