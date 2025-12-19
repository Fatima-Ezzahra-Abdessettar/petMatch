//frontend/app/components/SideBar.tsx
import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  HeartIcon,
  Bars3Icon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  ClipboardDocumentListIcon as ClipboardDocumentListIconSolid,
  UserCircleIcon as UserCircleIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid,
  HeartIcon as HeartIconSolid
} from '@heroicons/react/24/solid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDog } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../contexts/auth';
import { UserContext } from '../contexts/UserContext';

interface SideBarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const SideBar: React.FC<SideBarProps> = ({ isOpen, toggleSidebar }) => {
  const { logout } = useAuth();
  const userContext = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Get user info from UserContext (with fallback)
  const contextUser = userContext?.user;
  const userName = contextUser?.name || 'User';
  const userEmail = contextUser?.email || 'user@email.com';
  const userAvatar = contextUser?.avatar;

  // Check if user is admin
  const isAdmin = contextUser?.role === 'admin';

  const userMenuItems = [
    {
      path: '/welcome-user',
      label: 'home',
      icon: HomeIcon,
      activeIcon: HomeIconSolid,
      type: 'heroicon'
    },
    {
      path: '/requests',
      label: 'Requests',
      icon: ClipboardDocumentListIcon,
      activeIcon: ClipboardDocumentListIconSolid,
      type: 'heroicon'
    },
    {
      path: '/pets-list',
      label: 'Pets',
      icon: faDog,
      activeIcon: faDog,
      type: 'fontawesome'
    },
    {
      path: '/profile',
      label: 'profile',
      icon: UserCircleIcon,
      activeIcon: UserCircleIconSolid,
      type: 'heroicon'
    },
    {
      path: '/favorites',
      label: 'Favorites',
      icon: HeartIcon,
      activeIcon: HeartIconSolid,
      type: 'heroicon'
    },
  ];

  const adminMenuItems = [
    {
    path: '/adminDashboard', // Add this
    label: 'Dashboard',
    icon: HomeIcon,
    activeIcon: HomeIconSolid,
    type: 'heroicon'
  },
    {
      path: '/admin/requests',
      label: 'Requests',
      icon: ClipboardDocumentListIcon,
      activeIcon: ClipboardDocumentListIconSolid,
      type: 'heroicon'
    },
    {
      path: '/admin/pets',
      label: 'Pets',
      icon: faDog,
      activeIcon: faDog,
      type: 'fontawesome'
    },
    {
      path: '/admin/profile',
      label: 'profile',
      icon: UserCircleIcon,
      activeIcon: UserCircleIconSolid,
      type: 'heroicon'
    },
  ];

  const menuItems = isAdmin ? adminMenuItems : userMenuItems;

  return (
    <>
      {/* Menu burger button when sidebar is closed */}
      {!isOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed top-5 left-5 z-[1100] flex items-center justify-center w-10 h-10 bg-[#F3F0E8]/95 rounded-lg shadow-lg hover:scale-105 transition-transform"
          aria-label="Ouvrir le menu"
        >
          <Bars3Icon className="w-6 h-6 text-[#36332E]" />
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-[#D29059] flex flex-col transition-all duration-300 ease-in-out z-40 overflow-hidden
          ${isOpen 
            ? 'w-52 lg:w-52' 
            : 'w-52 lg:w-20 -translate-x-full lg:translate-x-0'
          }`}
      >
        {/* Header */}
        <div className="px-4 pt-6 pb-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleSidebar} 
              className="text-[#FEF3DD] hover:bg-white/10 p-2 rounded-lg transition"
              aria-label="Toggle menu"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
            {isOpen && (
              <span className="text-[#FEF3DD] text-xs font-semibold tracking-widest uppercase">
                Menu
              </span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }: { isActive: boolean }) =>
                    `flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-[#F3F0E8]/95 text-[#D29059] font-medium'
                        : 'text-[#FEF3DD] hover:bg-white/10'
                    } ${!isOpen && 'justify-center'}`
                  }
                  title={!isOpen ? item.label : ''}
                >
                  {({ isActive }: { isActive: boolean })  => {
                    if (item.type === 'fontawesome') {
                      return (
                        <>
                          <FontAwesomeIcon
                            icon={item.icon as any}
                            className={`w-5 h-5 ${isActive ? 'text-[#D29059]' : 'text-[#FEF3DD]'}`}
                          />
                          {isOpen && (
                            <span className="text-sm font-medium capitalize">
                              {item.label}
                            </span>
                          )}
                        </>
                      );
                    } else {
                      const Icon = (isActive ? item.activeIcon : item.icon) as React.ComponentType<{ className?: string }>;
                      return (
                        <>
                          <Icon className={`w-5 h-5 ${isActive ? 'text-[#D29059]' : 'text-[#FEF3DD]'}`} />
                          {isOpen && (
                            <span className="text-sm font-medium capitalize">
                              {item.label}
                            </span>
                          )}
                        </>
                      );
                    }
                  }}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* User footer */}
        <div className="p-4 border-t border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#F3F0E8]/95 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
              {userAvatar ? (
                <img 
                  src={userAvatar} 
                  alt="User avatar" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserCircleIcon className="w-8 h-8 text-[#D29059]" />
              )}
            </div>
            {isOpen && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-[#FEF3DD] font-semibold text-sm truncate">
                    {userName}
                  </p>
                  <p className="text-[#FEF3DD]/80 text-xs truncate">
                    {userEmail}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-red-500 hover:scale-110 transition-transform p-2"
                  aria-label="Déconnexion"
                  title="Logout"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default SideBar;