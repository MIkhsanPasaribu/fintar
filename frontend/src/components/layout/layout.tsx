"use client";

import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Sidebar */}
      <Sidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />

      {/* Main Content */}
      <main
        className={`transition-all duration-300 pt-4 ${
          typeof window !== "undefined" && window.innerWidth >= 1024
            ? isSidebarCollapsed
              ? "lg:ml-20"
              : "lg:ml-70"
            : ""
        }`}
        style={{
          marginLeft:
            typeof window !== "undefined" && window.innerWidth >= 1024
              ? isSidebarCollapsed
                ? "80px"
                : "280px"
              : "0",
        }}
      >
        <div className="px-4 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
