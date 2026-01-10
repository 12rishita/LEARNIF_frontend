import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Bell, User, Menu, ChevronDown, Sparkles } from "lucide-react";

const Header = ({ toggleSidebar }) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full h-20 bg-white/60 backdrop-blur-md">
      <div className="flex items-center justify-between h-full px-8">
        {/* Left Section: Mobile Menu & Breadcrumb placeholder */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="md:hidden inline-flex items-center justify-center w-12 h-12 text-slate-500 hover:text-indigo-600 hover:bg-violet-50 rounded-2xl transition-all duration-200 active:scale-90"
            aria-label="Toggle sidebar"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Right Section: Actions & Profile */}
        <div className="flex items-center gap-4">
          {/* Notifications Button */}
          <button className="relative inline-flex items-center justify-center w-12 h-12 text-slate-400 hover:text-indigo-600 hover:bg-violet-50 rounded-2xl transition-all duration-300 group active:scale-95">
            <Bell
              size={20}
              className="group-hover:rotate-12 transition-transform duration-200"
            />
            <span className="absolute top-3.5 right-3.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-4 ring-white" />
          </button>

          {/* User Profile Bento Widget */}
          <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
            <div className="group flex items-center gap-3 p-1.5 pr-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all duration-300 cursor-pointer">
              {/* Avatar Container */}
              <div className="relative">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-lg shadow-indigo-100 group-hover:shadow-indigo-200 transition-all">
                  <User size={20} strokeWidth={2.5} />
                </div>
                {/* Status Dot */}
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white" />
              </div>

              {/* User Identity */}
              <div className="hidden sm:flex flex-col text-left">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-black text-slate-900 tracking-tight">
                    {user?.username || "Admin User"}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {user?.email || "verified_pro"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
