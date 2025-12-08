// app/routes/register.tsx
import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '~/contexts/auth';
import { useTheme } from '~/contexts/themeContext';

export const meta = () => {
  return [
    { title: "Register - PetMatch" },
    { name: "description", content: "Create your PetMatch account" },
  ];
};

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { isDarkMode } = useTheme();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!acceptTerms) {
      setError('Please accept the terms & conditions');
      return;
    }

    if (formData.password !== formData.password_confirmation) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await register(formData);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8" style={{ backgroundColor: isDarkMode ? '#36332E' : '#F7F5EA' }}>
      {/* Rounded Container */}
      <div
        className="w-full max-w-4xl sm:max-w-full min-h-[600px] sm:h-[800px] rounded-3xl overflow-hidden shadow-2xl"
        style={{ backgroundColor: isDarkMode ? "rgb(115,101,91,0.31)" : "#F7F5EA" }}
      >
        <div className="flex flex-col lg:flex-row h-full">
          {/* Left side - Image */}
          <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br items-center justify-center">
            <img
              src="register.jpg"
              alt="Cute pets"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right side - Form */}
          <div className="lg:w-1/2 h-full flex justify-center p-8 pt-12 lg:pt-0">
            <div className="w-full max-w-md lg:my-auto">
              {/* Logo */}
              <div className="flex-col justify-center items-center mb-12">
                <img
                  src={
                    isDarkMode
                      ? "public/pet-MattchWhite.PNG"
                      : "public/pet-MattchBlack.PNG"
                  }
                  alt="pet"
                  className="w-40 sm:w-30 lg:w-50 mx-auto mb-4"
                />
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
                username
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 outline-none bg-transparent transition-colors"
                style={{
                  borderBottom: `2px solid ${isDarkMode ? '#928e85' : '#d1d5db'}`,
                  color: isDarkMode ? '#F7F5EA' : '#36332E'
                }}
                placeholder="johndadey"
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
                placeholder="johndoe@email.com"
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
                  minLength={8}
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

            <div>
              <label
                className="block mb-2"
                style={{ color: isDarkMode ? '#F7F5EA' : '#36332E' }}
              >
                Confirm password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.password_confirmation}
                  onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                  className="w-full px-4 py-3 outline-none bg-transparent transition-colors"
                  style={{
                    borderBottom: `2px solid ${isDarkMode ? '#928e85' : '#d1d5db'}`,
                    color: isDarkMode ? '#F7F5EA' : '#36332E'
                  }}
                  placeholder="••••••••••••••"
                  required
                  minLength={8}
                  onFocus={(e) => (e.target as HTMLInputElement).style.borderBottomColor = '#d97706'}
                  onBlur={(e) => (e.target as HTMLInputElement).style.borderBottomColor = isDarkMode ? '#928e85' : '#d1d5db'}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 hover:opacity-75 transition-opacity"
                  style={{ color: isDarkMode ? '#F7F5EA' : '#6b7280' }}
                >
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="terms"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="w-5 h-5 rounded focus:ring-amber-500"
                style={{
                  accentColor: '#d97706',
                  border: `1px solid ${isDarkMode ? '#928e85' : '#d1d5db'}`
                }}
              />
              <label
                htmlFor="terms"
                className="text-sm"
                style={{ color: isDarkMode ? '#F7F5EA' : '#36332E' }}
              >
                I accept the terms & Condition
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full font-semibold py-3 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              style={{
                backgroundColor: '#d97706',
                color: '#F7F5EA'
              }}
              onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#b45309'}
              onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#d97706'}
            >
              {loading ? 'SIGNING UP...' : 'SIGN UP'}
            </button>

            <div className="text-center text-sm" style={{ color: isDarkMode ? '#F7F5EA' : '#36332E' }}>
              already have an account?{' '}
              <Link
                to="/login"
                className="font-semibold hover:underline"
                style={{ color: '#d97706' }}
              >
                sign in
              </Link>
            </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
