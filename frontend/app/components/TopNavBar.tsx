//frontend/app/components/TopNavBar.tsx
import React, { useState, useContext } from "react";
import {
  UserCircleIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/solid";
import { useAuth } from "../contexts/auth";
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { useTheme } from "~/contexts/themeContext";
import { motion } from "framer-motion";

interface TopNavBarProps {
  onProfileClick?: () => void;
  onMenuClick?: () => void;
}

const TopNavBar: React.FC<TopNavBarProps> = ({
  onProfileClick,
  onMenuClick,
}) => {
  const { logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const userContext = useContext(UserContext);
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const user = userContext?.user;
  const userName = user?.name || "";
  const userAvatar = user?.avatar;

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="fixed top-0 right-0 z-[80] px-6 py-3 flex items-center gap-3">
      {/* Dark Mode Toggle Button */}
      <motion.button
        onClick={toggleTheme}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="rounded-full hover:cursor-pointer w-10 h-10 flex items-center justify-center transition-all duration-300"
        style={{
          backgroundColor: isDarkMode ? "#D9915B" : "#CCBFB1",
        }}
      >
        {isDarkMode ? (
          <i className="ri-sun-line text-lg" style={{ color: "#F7F5EA" }}></i>
        ) : (
          <i
            className="ri-moon-clear-line text-lg"
            style={{ color: "#6B5B4A" }}
          ></i>
        )}
      </motion.button>

      {/* User Avatar & Dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-300"
          style={{
            backgroundColor: showProfileMenu 
              ? (isDarkMode ? "rgba(115, 101, 91, 0.3)" : "#e5e7eb")
              : "transparent"
          }}
          onMouseEnter={(e) => {
            if (!showProfileMenu) {
              e.currentTarget.style.backgroundColor = isDarkMode 
                ? "rgba(115, 101, 91, 0.2)" 
                : "#e5e7eb";
            }
          }}
          onMouseLeave={(e) => {
            if (!showProfileMenu) {
              e.currentTarget.style.backgroundColor = "transparent";
            }
          }}
        >
          <div 
            className="w-9 h-9 rounded-full flex items-center justify-center overflow-hidden transition-colors duration-300"
            style={{ backgroundColor: isDarkMode ? "rgba(115, 101, 91, 0.4)" : "#e5e7eb" }}
          >
            {userAvatar ? (
              <img
                src={userAvatar}
                alt="User avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <UserCircleIcon 
                className="w-9 h-9 transition-colors duration-300"
                style={{ color: isDarkMode ? "#73655B" : "#6b7280" }}
              />
            )}
          </div>
          <span
            className="text-sm font-medium transition-colors duration-300"
            style={{ color: isDarkMode ? "#F7F5EA" : "#374151" }}
          >
            {userName}
          </span>
          <ChevronDownIcon
            className="w-4 h-4 transition-colors duration-300"
            style={{ color: isDarkMode ? "#D9915B" : "#6b7280" }}
          />
        </button>

        {showProfileMenu && (
          <div 
            className="absolute right-0 mt-2 w-56 rounded-lg shadow-xl py-2 z-50 border transition-colors duration-300"
            style={{
              backgroundColor: isDarkMode ? "rgba(54, 51, 46, 0.98)" : "white",
              borderColor: isDarkMode ? "#73655B" : "#f3f4f6"
            }}
          >
            <div 
              className="px-4 py-3 border-b transition-colors duration-300"
              style={{ borderColor: isDarkMode ? "#73655B" : "#f3f4f6" }}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden transition-colors duration-300"
                  style={{ backgroundColor: isDarkMode ? "rgba(115, 101, 91, 0.4)" : "#e5e7eb" }}
                >
                  {userAvatar ? (
                    <img
                      src={userAvatar}
                      alt="User avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserCircleIcon 
                      className="w-10 h-10 transition-colors duration-300"
                      style={{ color: isDarkMode ? "#73655B" : "#6b7280" }}
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p 
                    className="font-semibold text-sm truncate transition-colors duration-300"
                    style={{ color: isDarkMode ? "#F5F3ED" : "#1f2937" }}
                  >
                    {userName}
                  </p>
                  <p 
                    className="text-xs truncate transition-colors duration-300"
                    style={{ color: isDarkMode ? "#D9915B" : "#6b7280" }}
                  >
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                navigate("/profile");
                setShowProfileMenu(false);
              }}
              className="w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 transition-all duration-300"
              style={{ color: isDarkMode ? "#F7F5EA" : "#374151" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = isDarkMode 
                  ? "rgba(115, 101, 91, 0.3)" 
                  : "#f9fafb";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <UserCircleIcon 
                className="w-5 h-5 transition-colors duration-300"
                style={{ color: isDarkMode ? "#D9915B" : "#6b7280" }}
              />
              <span>My Profile</span>
            </button>
            <div 
              className="border-t my-1 transition-colors duration-300"
              style={{ borderColor: isDarkMode ? "#73655B" : "#f3f4f6" }}
            ></div>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 transition-all duration-300"
              style={{ color: isDarkMode ? "#fca5a5" : "#dc2626" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = isDarkMode 
                  ? "rgba(220, 38, 38, 0.15)" 
                  : "#fef2f2";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <ArrowRightOnRectangleIcon 
                className="w-5 h-5 transition-colors duration-300"
                style={{ color: isDarkMode ? "#fca5a5" : "#dc2626" }}
              />
              <span>Sign out</span>
            </button>
          </div>
        )}
      </div>

      {/* Click outside to close dropdowns */}
      {showProfileMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowProfileMenu(false);
          }}
        />
      )}
    </div>
  );
};

export default TopNavBar;