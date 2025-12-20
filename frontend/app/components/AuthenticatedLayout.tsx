import React, { useState } from "react";
import SideBar from "./SideBar";
import TopNavBar from "./TopNavBar";

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({
  children,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div
        className={`flex-1 flex flex-col transition-all duration-300 overflow-hidden relative 
          ${isSidebarOpen ? "lg:ml-52" : "lg:ml-20"}
        `}
      >
        <TopNavBar onMenuClick={toggleSidebar} />
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export default AuthenticatedLayout;
