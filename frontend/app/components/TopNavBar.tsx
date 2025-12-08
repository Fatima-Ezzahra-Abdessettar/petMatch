import React, { useState } from 'react';
import { EnvelopeIcon, BellIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { UserCircleIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../contexts/auth';
import { useNavigate } from 'react-router-dom';

interface TopNavBarProps {
  onProfileClick?: () => void;
  onMenuClick?: () => void;
}

const TopNavBar: React.FC<TopNavBarProps> = ({ onProfileClick, onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div 
      className="fixed top-0 right-0 z-30 flex items-center gap-4 p-4"
      style={{
        backgroundColor: 'rgba(128, 128, 128, 0.3)',
        backdropFilter: 'blur(4px)',
      }}
    >
      
      {/* Notifications */}
      <div className="relative">
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative p-2 rounded-full hover:bg-gray-800 transition-colors"
        >
          <BellIcon className="w-6 h-6 text-white" />
          <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-gray-900"></span>
        </button>
        
        {showNotifications && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-2 z-50">
            <div className="px-4 py-2 border-b border-gray-200">
              <h3 className="font-semibold text-gray-800">Notifications</h3>
            </div>
            <div className="px-4 py-3 flex items-center gap-3 hover:bg-gray-50 cursor-pointer">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">H</span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-800">Hello</p>
              </div>
              <button className="px-3 py-1 bg-orange-500 text-white text-xs rounded hover:bg-orange-600">
                view
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User Avatar & Dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-800 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
            <UserCircleIcon className="w-10 h-10 text-gray-600" />
          </div>
          <ChevronDownIcon className="w-4 h-4 text-white" />
        </button>

        {showProfileMenu && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50">
            <div className="px-4 py-2 border-b border-gray-200">
              <p className="font-semibold text-gray-800">{user?.name || 'User'}</p>
            </div>
            <button
              onClick={() => {
                navigate('/profile');
                setShowProfileMenu(false);
              }}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <UserCircleIcon className="w-5 h-5" />
              Profile
            </button>
            <button
              onClick={() => {
                navigate('/settings');
                setShowProfileMenu(false);
              }}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </button>
            <div className="border-t border-gray-200 my-1"></div>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign out
            </button>
          </div>
        )}
      </div>

      {/* Click outside to close dropdowns */}
      {(showNotifications || showProfileMenu) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowNotifications(false);
            setShowProfileMenu(false);
          }}
        />
      )}
    </div>
  );
};

export default TopNavBar;

