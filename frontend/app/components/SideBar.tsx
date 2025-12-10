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

  const menuItems = [
    { path: '/welcome-user', label: 'home', icon: HomeIcon, activeIcon: HomeIconSolid, type: 'heroicon' },
    { path: '/mes-demandes', label: 'Mes demandes', icon: ClipboardDocumentListIcon, activeIcon: ClipboardDocumentListIconSolid, type: 'heroicon' },
    { path: '/pets-list', label: 'Pets', icon: faDog, activeIcon: faDog, type: 'fontawesome' },
    { path: '/profile', label: 'profile', icon: UserCircleIcon, activeIcon: UserCircleIconSolid, type: 'heroicon' },
    { path: '/settings', label: 'Settings', icon: Cog6ToothIcon, activeIcon: Cog6ToothIconSolid, type: 'heroicon' },
    { path: '/favorites', label: 'Favorites', icon: HeartIcon, activeIcon: HeartIconSolid, type: 'heroicon' },
  ];

  // Get user info from UserContext
  const user = userContext?.user;
  const userName = user?.name || 'User';
  const userEmail = user?.email || 'user@email.com';
  const userAvatar = user?.avatar;

  return (
    <>
      {/* Bouton burger quand sidebar fermée */}
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
        className={`fixed left-0 top-0 h-screen bg-[#D29059] flex flex-col transition-all duration-300 ease-in-out z-[100] overflow-hidden
          ${isOpen 
            ? 'w-52 lg:w-52' 
            : 'w-52 lg:w-20 -translate-x-full lg:translate-x-0'
          }`}
      >
        {/* Header */}
        <div className="px-4 pt-6 pb-4">
          <div className="flex items-center gap-3">
            <button onClick={toggleSidebar} className="text-[#FEF3DD] hover:bg-white/10 p-2 rounded-lg transition">
              <Bars3Icon className="w-6 h-6" />
            </button>
            {isOpen && <span className="text-[#FEF3DD] text-xs font-semibold tracking-widest uppercase">Menu</span>}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-[#F3F0E8]/95 text-[#D29059] font-medium'
                        : 'text-[#FEF3DD] hover:bg-white/10'
                    } ${!isOpen && 'justify-center'}`
                  }
                  title={!isOpen ? item.label : ''}
                >
                  {({ isActive }) => (
                    <>
                      {item.type === 'fontawesome' ? (
                        <FontAwesomeIcon
                          icon={item.icon as any}
                          className={`w-5 h-5 ${isActive ? 'text-[#D29059]' : 'text-[#FEF3DD]'}`}
                        />
                      ) : (
                        <>
                          {isActive ? (
                            <item.activeIcon className="w-5 h-5 text-[#D29059]" />
                          ) : (
                            <item.icon className="w-5 h-5 text-[#FEF3DD]" />
                          )}
                        </>
                      )}
                      {isOpen && <span className="text-sm font-medium capitalize">{item.label}</span>}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer utilisateur */}
        <div className="p-4 border-t border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#F3F0E8]/95 rounded-full flex items-center justify-center flex-shrink-0">
              <UserCircleIcon className="w-8 h-8 text-[#D29059]" />
            </div>
            {isOpen && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-[#FEF3DD] font-semibold text-sm truncate">{userName}</p>
                  <p className="text-[#FEF3DD]/80 text-xs truncate">{userEmail}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-red-500 hover:scale-110 transition-transform p-2"
                  aria-label="Déconnexion"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Styles CSS */}
      <style>{`
        /* Variables CSS */
        :root {
          --sidebar-bg: #D29059;
          --sidebar-width-open: 210px;
          --sidebar-width-closed: 70px;
          --text-normal: #FEF3DD;
          --text-hover: #D29059;
          --hover-bg: rgba(243, 240, 232, 0.95);
          --transition-speed: 0.3s;
        }

        .menu-toggle-btn {
          position: fixed;
          top: 20px;
          left: 20px;
          z-index: 1100;
          background: var(--hover-bg);
          border: none;
          border-radius: 8px;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          transition: transform var(--transition-speed);
        }

        .menu-toggle-btn:hover {
          transform: scale(1.05);
        }

        .sidebar {
          position: fixed;
          left: 0;
          top: 0;
          height: 100vh;
          background-color: var(--sidebar-bg);
          display: flex;
          flex-direction: column;
          padding: 20px 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          z-index: 100;
          overflow-x: hidden;
          transition: width var(--transition-speed) ease;
        }

        .sidebar-open {
          width: var(--sidebar-width-open);
        }

        .sidebar-closed {
          width: var(--sidebar-width-closed);
        }

        .sidebar-header {
          padding: 0 15px 20px;
          margin-bottom: 20px;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
        }

        .logo-icon {
          font-size: 24px;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .logo-title {
          font-size: 1.5rem;
          margin: 0;
          color: var(--text-normal);
          font-weight: 500;
          white-space: nowrap;
        }

        .close-btn {
          background: none;
          border: none;
          margin-left: auto;
          cursor: pointer;
          color: var(--text-normal);
          padding: 5px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.2s;
        }

        .close-btn:hover {
          background-color: rgba(0, 0, 0, 0.05);
        }

        .menu-title {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-normal);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .sidebar-nav {
          flex: 1;
          padding: 0 10px;
          overflow-y: auto;
        }

        .nav-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .nav-list li {
          margin-bottom: 5px;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 15px;
          border-radius: 8px;
          text-decoration: none;
          color: var(--text-normal);
          transition: all 0.2s ease;
          font-weight: 500;
          white-space: nowrap;
        }

        .nav-link-centered {
          justify-content: center;
          padding: 12px 0;
        }

        .nav-link:hover,
        .nav-link.active {
          background-color: var(--hover-bg);
          color: var(--text-hover);
        }

        .nav-icon {
          width: 20px;
          height: 20px;
          flex-shrink: 0;
        }

        .nav-label {
          font-size: 0.95rem;
        }

        .sidebar-footer {
          padding: 15px;
          margin-top: auto;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: rgba(243, 240, 232, 0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          overflow: hidden;
        }

        .avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .user-details {
          flex: 1;
          min-width: 0;
        }

        .user-name {
          font-weight: 600;
          color: var(--text-normal);
          font-size: 0.9rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-email {
          font-size: 0.8rem;
          color: var(--text-normal);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .icon-20 {
          width: 20px;
          height: 20px;
        }

        .icon-24 {
          width: 24px;
          height: 24px;
        }

        .logout-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s;
        }

        .logout-btn:hover {
          transform: scale(1.1);
        }
      `}</style>
    </>
  );
};

export default SideBar;