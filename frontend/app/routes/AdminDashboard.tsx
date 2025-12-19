import React from 'react';
import AuthenticatedLayout from '../components/AuthenticatedLayout';
import { useTheme } from '../contexts/themeContext';

const AdminDashboard = () => {
  const { isDarkMode } = useTheme();

  return (
    <AuthenticatedLayout>
      <div 
        className="px-8 pb-8 min-h-screen" 
        style={{ backgroundColor: isDarkMode ? "#36332E" : "#F7F5EA" }}
      >
        <div className="mb-6 pt-8">
          <h1 
            className="text-3xl font-bold mb-1" 
            style={{ color: isDarkMode ? "#F5F3ED" : "#8B6F47" }}
          >
            Admin Dashboard
          </h1>
          <p style={{ color: isDarkMode ? "#F7F5EA" : "#6B5B4A" }}>
            Welcome to your admin panel
          </p>
        </div>

        <div 
          className="p-8 rounded-lg shadow-md text-center"
          style={{ backgroundColor: isDarkMode ? "#2A2724" : "#FFFFFF" }}
        >
          <h2 
            className="text-2xl font-semibold mb-4"
            style={{ color: isDarkMode ? "#F5F3ED" : "#8B6F47" }}
          >
            Hello there! 👋
          </h2>
          <p style={{ color: isDarkMode ? "#F7F5EA" : "#6B5B4A" }}>
            Your admin dashboard is working correctly!
          </p>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default AdminDashboard;