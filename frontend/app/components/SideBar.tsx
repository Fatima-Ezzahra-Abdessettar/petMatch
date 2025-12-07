import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  HomeIcon,
  ClipboardDocumentListIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  HeartIcon,
  Bars3Icon,
  XMarkIcon
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

interface SideBarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const SideBar: React.FC<SideBarProps> = ({ isOpen, toggleSidebar }) => {
  // Configuration des liens de navigation (incluant Favorites)
  const menuItems = [
    { 
      path: '/', 
      label: 'Home', 
      icon: HomeIcon,
      activeIcon: HomeIconSolid,
      type: 'heroicon'
    },
    { 
      path: '/mes-demandes', 
      label: 'Mes demandes', 
      icon: ClipboardDocumentListIcon,
      activeIcon: ClipboardDocumentListIconSolid,
      type: 'heroicon'
    },
    { 
      path: '/pets', 
      label: 'Pets', 
      icon: faDog,
      activeIcon: faDog,
      type: 'fontawesome'
    },
    { 
      path: '/profile', 
      label: 'Profile', 
      icon: UserCircleIcon,
      activeIcon: UserCircleIconSolid,
      type: 'heroicon'
    },
    { 
      path: '/settings', 
      label: 'Settings', 
      icon: Cog6ToothIcon,
      activeIcon: Cog6ToothIconSolid,
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

  // Informations utilisateur
  const user = {
    name: 'Sara Alali',
    email: 'demo@email.com',
  };

  return (
    <>
      {/* Bouton menu burger */}
      {!isOpen && (
        <button 
          onClick={toggleSidebar}
          className="menu-toggle-btn"
          aria-label="Ouvrir le menu"
        >
          <Bars3Icon className="icon-24" />
        </button>
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        {/* En-tête */}
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">🐾</div>
            {isOpen && (
              <>
                <h1 className="logo-title">PetMatch</h1>
                <button 
                  onClick={toggleSidebar}
                  className="close-btn"
                  aria-label="Fermer le menu"
                >
                  <XMarkIcon className="icon-20" />
                </button>
              </>
            )}
          </div>
          {isOpen && <div className="menu-title">MENU</div>}
        </div>

        {/* Navigation principale */}
        <nav className="sidebar-nav">
          <ul className="nav-list">
            {menuItems.map((item) => {
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => 
                      `nav-link ${!isOpen ? 'nav-link-centered' : ''}`
                    }
                    title={!isOpen ? item.label : ''}
                  >
                    {({ isActive }) => {
                      if (item.type === 'fontawesome') {
                        return (
                          <>
                            <FontAwesomeIcon 
                              icon={isActive ? item.activeIcon : item.icon} 
                              className="nav-icon" 
                            />
                            {isOpen && <span className="nav-label">{item.label}</span>}
                          </>
                        );
                      } else {
                        const Icon = isActive ? item.activeIcon : item.icon;
                        return (
                          <>
                            <Icon className="nav-icon" />
                            {isOpen && <span className="nav-label">{item.label}</span>}
                          </>
                        );
                      }
                    }}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Pied de page utilisateur */}
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              <UserCircleIcon className="icon-24" />
            </div>
            {isOpen && (
              <div className="user-details">
                <div className="user-name">{user.name}</div>
                <div className="user-email">{user.email}</div>
              </div>
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
      `}</style>
    </>
  );
};

export default SideBar;