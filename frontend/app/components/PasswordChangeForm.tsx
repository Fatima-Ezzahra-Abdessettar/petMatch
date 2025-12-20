import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "~/api/client";
import { useTheme } from "~/contexts/themeContext";

interface PasswordFormData {
  password: string;
  password_confirmation: string;
}

const PasswordChangeForm: React.FC = () => {
  const { isDarkMode } = useTheme();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<PasswordFormData>();
  const password = watch("password");

  const onSubmit = async (data: PasswordFormData) => {
    if (data.password !== data.password_confirmation) {
      toast.error("Passwords do not match", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      await api.put("/api/me", {
        password: data.password,
        password_confirmation: data.password_confirmation,
      });
      reset();
      toast.success("Password changed successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Error changing password";
      const errors = error.response?.data?.errors;

      if (errors) {
        // Display validation errors
        Object.values(errors)
          .flat()
          .forEach((err: any) => {
            toast.error(err, {
              position: "top-right",
              autoClose: 5000,
            });
          });
      } else {
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 5000,
        });
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-6 rounded-lg shadow-md transition-colors duration-300"
      style={{
        backgroundColor: isDarkMode ? "rgba(115, 101, 91, 0.3)" : "white",
      }}
    >
      <h2
        className="text-xl font-semibold mb-6 transition-colors duration-300"
        style={{ color: isDarkMode ? "#F5F3ED" : "#1f2937" }}
      >
        Password
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            className="block text-sm font-medium mb-1 transition-colors duration-300"
            style={{ color: isDarkMode ? "#F7F5EA" : "#374151" }}
          >
            New Password
          </label>
          <input
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            className="border p-2 w-full rounded-md focus:ring-2 focus:border-transparent transition-colors duration-300"
            style={{
              backgroundColor: isDarkMode ? "rgba(115, 101, 91, 0.2)" : "white",
              borderColor: errors.password
                ? isDarkMode
                  ? "#f87171"
                  : "#ef4444"
                : isDarkMode
                  ? "#73655B"
                  : "#d1d5db",
              color: isDarkMode ? "#F7F5EA" : "#1f2937",
            }}
          />
          {errors.password && (
            <p
              className="text-xs mt-1 transition-colors duration-300"
              style={{ color: isDarkMode ? "#fca5a5" : "#dc2626" }}
            >
              {errors.password.message}
            </p>
          )}
        </div>
        <div>
          <label
            className="block text-sm font-medium mb-1 transition-colors duration-300"
            style={{ color: isDarkMode ? "#F7F5EA" : "#374151" }}
          >
            Confirm Password
          </label>
          <input
            type="password"
            {...register("password_confirmation", {
              required: "Please confirm your password",
              validate: (value) =>
                value === password || "Passwords do not match",
            })}
            className="border p-2 w-full rounded-md focus:ring-2 focus:border-transparent transition-colors duration-300"
            style={{
              backgroundColor: isDarkMode ? "rgba(115, 101, 91, 0.2)" : "white",
              borderColor: errors.password_confirmation
                ? isDarkMode
                  ? "#f87171"
                  : "#ef4444"
                : isDarkMode
                  ? "#73655B"
                  : "#d1d5db",
              color: isDarkMode ? "#F7F5EA" : "#1f2937",
            }}
          />
          {errors.password_confirmation && (
            <p
              className="text-xs mt-1 transition-colors duration-300"
              style={{ color: isDarkMode ? "#fca5a5" : "#dc2626" }}
            >
              {errors.password_confirmation.message}
            </p>
          )}
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <button
          type="submit"
          className="px-6 py-2 text-white rounded-md transition-all duration-300 font-medium flex items-center gap-2"
          style={{
            backgroundColor: isDarkMode ? "#8B5CF6" : "#9333ea",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = isDarkMode
              ? "#7C3AED"
              : "#7e22ce";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = isDarkMode
              ? "#8B5CF6"
              : "#9333ea";
          }}
        >
          <span>+</span> Save new password
        </button>
      </div>
    </form>
  );
};

export default PasswordChangeForm;
