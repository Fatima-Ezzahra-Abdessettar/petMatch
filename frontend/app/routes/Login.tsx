// app/routes/login.tsx
import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "~/contexts/auth";
import { useTheme } from "~/contexts/themeContext";

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
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
<div className="min-h-screen flex flex-col items-center justify-start lg:justify-center p-4 sm:p-8 pt-6 lg:pt-0 lg:-mt-10">
      {/* Rounded Container */}
      <div
        className="w-full max-w-4xl sm:max-w-full min-h-[500px] sm:h-[700px] rounded-3xl overflow-hidden shadow-2xl"
        style={{ backgroundColor: isDarkMode ? "rgb(115,101,91,0.31)" : "#F7F5EA" }}
      >
        <div className="flex flex-col lg:flex-row h-full">
          {/* Left side - Image */}
          <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br items-center justify-center">
            <img
              src="authimg.jpg"
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
                      backgroundColor: "#fef2f2",
                      border: "1px solid #fecaca",
                      color: "#b91c1c",
                    }}
                  >
                    {error}
                  </div>
                )}

                <div>
  <label
    className="block mb-2"
    style={{ color: isDarkMode ? "#f3f4f6" : "#1f2937" }}
  >
    Email
  </label>
  <input
    type="email"
    value={formData.email}
    onChange={(e) =>
      setFormData({ ...formData, email: e.target.value })
    }
    className={`w-full px-4 py-3 outline-none bg-transparent transition-colors border-b-2 border-gray-300 focus:border-amber-600 ${isDarkMode ? 'text-gray-100 placeholder:text-gray-400' : 'text-gray-900 placeholder:text-gray-600'}`}
    placeholder="example@gmail.com"
    required
  />
</div>

<div>
  <label 
    className="block mb-2"
    style={{ color: isDarkMode ? "#f3f4f6" : "#1f2937" }}
  >
    Password
  </label>
  <div className="relative">
    <input
      type={showPassword ? "text" : "password"}
      value={formData.password}
      onChange={(e) =>
        setFormData({ ...formData, password: e.target.value })
      }
      className="w-full px-4 py-3 outline-none bg-transparent transition-colors border-b-2 border-gray-300 focus:border-amber-600"
      style={{
        color: isDarkMode ? "#f3f4f6" : "#1f2937"
      }}
      placeholder="••••••••••••••"
      required
    />
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-2 top-1/2 -translate-y-1/2 hover:opacity-75 transition-opacity"
      style={{ color: "#6b7280" }}
    >
      {showPassword ? "👁️" : "👁️‍🗨️"}
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
                      accentColor: "#d97706",
                      border: "1px solid #d1d5db",
                    }}
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm"
                  >
                    Remember me
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full font-semibold py-3 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-BgLight cursor-pointer"
                  style={{
                    backgroundColor: "#d97706"
                  }}
                  onMouseEnter={(e) =>
                    ((e.target as HTMLButtonElement).style.backgroundColor =
                      "#b45309")
                  }
                  onMouseLeave={(e) =>
                    ((e.target as HTMLButtonElement).style.backgroundColor =
                      "#d97706")
                  }
                >
                  {loading ? "LOGGING IN..." : "LOG IN"}
                </button>

                <div
                  className="text-center text-sm"
                >
                  new to petMatch?{" "}
                  <Link
                    to="/register"
                    className="font-semibold hover:underline"
                    style={{ color: "#d97706" }}
                  >
                    sign up
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
