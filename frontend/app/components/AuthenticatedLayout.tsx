import React, { useState } from 'react';
import SideBar from './SideBar';
import TopNavBar from './TopNavBar';

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: '#F5F5F5' }}>
      <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div 
        className="flex-1 flex flex-col transition-all duration-300 overflow-hidden relative"
        style={{ 
          marginLeft: isSidebarOpen ? '210px' : '70px',
          backgroundColor: '#F5F5F5',
        }}
      >
        <TopNavBar onMenuClick={toggleSidebar} />
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthenticatedLayout;