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
    <div className="flex min-h-screen" style={{ backgroundColor: '#F7F5EA' }}>
      <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div 
        className="flex-1 transition-all duration-300 overflow-y-auto relative"
        style={{ 
          marginLeft: isSidebarOpen ? '210px' : '70px',
          backgroundColor: '#F7F5EA',
          minHeight: '100vh'
        }}
      >
        <TopNavBar onMenuClick={toggleSidebar} />
        <div className="pt-16">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthenticatedLayout;

