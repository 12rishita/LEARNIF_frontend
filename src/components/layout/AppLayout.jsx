import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

const AppLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-700">
      {/* SIDEBAR */}
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* MAIN WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-64 transition-all duration-300 ease-in-out">
        {/* HEADER - Glassmorphism effect */}
        <div className="sticky top-0 z-30 w-full bg-[#F8FAFC]/80 backdrop-blur-md">
          <Header toggleSidebar={toggleSidebar} />
        </div>

        {/* MAIN CONTENT CANVAS */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto px-4 pb-8 md:px-8">
          <div className="max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-2 duration-700">
            {children}
          </div>
        </main>

        {/* Optional: Subtle footer or status bar */}
        <footer className="px-8 py-4 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
            Powered by Gemini AI • 2026
          </p>
        </footer>
      </div>

      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm md:hidden transition-opacity"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default AppLayout;
