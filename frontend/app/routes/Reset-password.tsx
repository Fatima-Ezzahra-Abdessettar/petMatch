import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { authService } from '~/api/authService';
import { useTheme } from '~/contexts/themeContext';

export const meta = () => {
  return [
    { title: "Reset Password - PetMatch" },
    { name: "description", content: "Reset your PetMatch password" },
  ];
};

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  
  const [formData, setFormData] = useState({
    email: '',
    token: '',
    password: '',
    password_confirmation: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    try {
      // Extract token and email from URL
      const token = searchParams.get('token');
      const email = searchParams.get('email');

      console.log('Token:', token);
      console.log('Email:', email);

      if (token && email) {
        setFormData((prev) => ({
          ...prev,
          token: token,
          email: decodeURIComponent(email),
        }));
      } else {
        setMessage({
          type: 'error',
          text: 'Invalid reset link. Please request a new password reset.',
        });
      }
    } catch (error) {
      console.error('Error extracting URL params:', error);
      setMessage({
        type: 'error',
        text: 'Error loading reset page. Please try again.',
      });
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Validate passwords match
    if (formData.password !== formData.password_confirmation) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      setLoading(false);
      return;
    }

    // Validate password length
    if (formData.password.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters' });
      setLoading(false);
      return;
    }

    try {
      console.log('Submitting reset password request...');
      const result = await authService.resetPassword(formData);
      console.log('Reset successful:', result);
      
      setMessage({
        type: 'success',
        text: result.message || 'Password reset successfully!',
      });

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('Reset password error:', error);
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to reset password',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start lg:justify-center p-4 sm:p-8 pt-6 lg:pt-0 lg:-mt-10">
      <div
        className="w-full max-w-md rounded-3xl overflow-hidden shadow-2xl p-8"
        style={{ backgroundColor: isDarkMode ? "rgb(115,101,91,0.31)" : "rgb(255,255,255,0.3)" }}
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
            style={{ backgroundColor: isDarkMode ? "rgba(217, 119, 6, 0.2)" : "rgba(217, 119, 6, 0.1)" }}
          >
            <svg className="w-8 h-8" style={{ color: "#d97706" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold" style={{ color: isDarkMode ? "#f3f4f6" : "#1f2937" }}>
            Reset Password
          </h2>
          <p className="mt-2" style={{ color: isDarkMode ? "#d1d5db" : "#6b7280" }}>
            Enter your new password below
          </p>
        </div>

        {message && (
          <div
            className="mb-6 p-4 rounded-lg"
            style={{
              backgroundColor: message.type === 'success' ? '#f0fdf4' : '#fef2f2',
              border: message.type === 'success' ? '1px solid #86efac' : '1px solid #fecaca',
              color: message.type === 'success' ? '#166534' : '#b91c1c',
            }}
          >
            <div className="flex items-center">
              {message.type === 'success' ? (
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              <span className="text-sm font-medium">{message.text}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label 
              htmlFor="email" 
              className="block mb-2"
              style={{ color: isDarkMode ? "#f3f4f6" : "#1f2937" }}
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              readOnly
              className="w-full px-4 py-3 rounded-lg cursor-not-allowed"
              style={{
                backgroundColor: isDarkMode ? "rgba(55, 65, 81, 0.5)" : "rgba(243, 244, 246, 0.8)",
                color: isDarkMode ? "#d1d5db" : "#6b7280",
                border: "1px solid",
                borderColor: isDarkMode ? "#4b5563" : "#d1d5db",
              }}
            />
          </div>

          <div>
            <label 
              htmlFor="password" 
              className="block mb-2"
              style={{ color: isDarkMode ? "#f3f4f6" : "#1f2937" }}
            >
              New Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
              placeholder="Enter new password"
              className="w-full px-4 py-3 outline-none bg-transparent transition-colors border-b-2 border-gray-300 focus:border-amber-600"
              style={{ color: isDarkMode ? "#f3f4f6" : "#1f2937" }}
            />
            <p className="text-xs mt-1" style={{ color: isDarkMode ? "#9ca3af" : "#6b7280" }}>
              Minimum 8 characters
            </p>
          </div>

          <div>
            <label 
              htmlFor="password_confirmation" 
              className="block mb-2"
              style={{ color: isDarkMode ? "#f3f4f6" : "#1f2937" }}
            >
              Confirm New Password
            </label>
            <input
              id="password_confirmation"
              type="password"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              required
              minLength={8}
              placeholder="Confirm new password"
              className="w-full px-4 py-3 outline-none bg-transparent transition-colors border-b-2 border-gray-300 focus:border-amber-600"
              style={{ color: isDarkMode ? "#f3f4f6" : "#1f2937" }}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !formData.token}
            className="w-full font-semibold py-3 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-white"
            style={{ backgroundColor: "#d97706" }}
            onMouseEnter={(e) => {
              if (!loading && formData.token) {
                (e.target as HTMLButtonElement).style.backgroundColor = "#b45309";
              }
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = "#d97706";
            }}
          >
            {loading ? 'RESETTING PASSWORD...' : 'RESET PASSWORD'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link 
            to="/login" 
            className="text-sm font-medium hover:underline"
            style={{ color: "#d97706" }}
          >
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}