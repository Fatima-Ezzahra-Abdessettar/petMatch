import React, { useState, useContext } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import { UserCircleIcon, ChevronDownIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../contexts/auth';
import { UserContext } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

interface TopNavBarProps {
  onProfileClick?: () => void;
  onMenuClick?: () => void;
}

const TopNavBar: React.FC<TopNavBarProps> = ({ onProfileClick, onMenuClick }) => {
  const { logout } = useAuth();
  const userContext = useContext(UserContext);
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const user = userContext?.user;
  const userName = user?.name || '';
  const userAvatar = user?.avatar;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div 
      className="fixed top-0 right-0 z-30 flex items-center gap-3 px-6 py-3"
      style={{
        backgroundColor: 'rgba(245, 245, 245, 0.95)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      }}
    >
      
      {/* Notifications */}
      <div className="relative">
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative p-2 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <BellIcon className="w-6 h-6 text-gray-700" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        {showNotifications && (
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-100">
            <div className="px-4 py-3 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800 text-sm">Notifications</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              <div className="px-4 py-3 flex items-start gap-3 hover:bg-gray-50 cursor-pointer transition-colors">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-semibold">H</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800 font-medium">New message</p>
                  <p className="text-xs text-gray-500 mt-1">Hello! How can we help you today?</p>
                  <p className="text-xs text-gray-400 mt-1">2 minutes ago</p>
                </div>
              </div>
              <div className="px-4 py-3 flex items-start gap-3 hover:bg-gray-50 cursor-pointer transition-colors">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-semibold">P</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800 font-medium">Profile updated</p>
                  <p className="text-xs text-gray-500 mt-1">Your profile has been successfully updated</p>
                  <p className="text-xs text-gray-400 mt-1">1 hour ago</p>
                </div>
              </div>
            </div>
            <div className="px-4 py-2 border-t border-gray-100">
              <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                View all notifications
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User Avatar & Dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {userAvatar ? (
              <img 
                src={userAvatar} 
                alt="User avatar" 
                className="w-full h-full object-cover"
              />
            ) : (
              <UserCircleIcon className="w-9 h-9 text-gray-600" />
            )}
          </div>
          <span className="text-sm font-medium text-gray-700">{userName}</span>
          <ChevronDownIcon className="w-4 h-4 text-gray-600" />
        </button>

        {showProfileMenu && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-100">
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {userAvatar ? (
                    <img 
                      src={userAvatar} 
                      alt="User avatar" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserCircleIcon className="w-10 h-10 text-gray-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm truncate">{userName}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                navigate('/profile');
                setShowProfileMenu(false);
              }}
              className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
            >
              <UserCircleIcon className="w-5 h-5 text-gray-600" />
              <span>My Profile</span>
            </button>
            <button
              onClick={() => {
                navigate('/settings');
                setShowProfileMenu(false);
              }}
              className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
            >
              <Cog6ToothIcon className="w-5 h-5 text-gray-600" />
              <span>Settings</span>
            </button>
            <div className="border-t border-gray-100 my-1"></div>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5 text-red-600" />
              <span>Sign out</span>
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