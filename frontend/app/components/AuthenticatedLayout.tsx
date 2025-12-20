import React, { useState } from "react";
import SideBar from "./SideBar";
import TopNavBar from "./TopNavBar";

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300
          ${isSidebarOpen ? "lg:ml-52" : "lg:ml-20"}
        `}
      >
        {/* Fixed top bar */}
        <TopNavBar onMenuClick={toggleSidebar} />

        {/* Page content – NO overflow here */}
        <main className="flex-1 pt-16 px-4 md:px-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AuthenticatedLayout;
