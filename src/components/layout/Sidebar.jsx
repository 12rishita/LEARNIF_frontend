import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  FileText,
  User,
  LogOut,
  BrainCircuit,
  BookOpen,
  X,
  Sparkles,
} from "lucide-react";

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = [
    { to: "/dashboard", icon: LayoutDashboard, text: "Dashboard" },
    { to: "/documents", icon: FileText, text: "Documents" },
    { to: "/flashcards", icon: BookOpen, text: "Flashcards" },
    { to: "/profile", icon: User, text: "Profile" },
  ];

  return (
    <>
      {/* Overlay (Mobile) */}
      <div
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleSidebar}
      />

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-white z-50 border-r-2 border-indigo-50 transform transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between px-8 h-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100">
              <BrainCircuit size={22} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <h1 className="text-sm font-black text-slate-900 tracking-tight leading-none uppercase italic">
                MindForge
                <span className="text-indigo-600"> AI</span>
              </h1>
              <span className="text-[9px] font-bold text-slate-400 tracking-widest uppercase">
                Learning Lab
              </span>
            </div>
          </div>

          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 text-slate-400 hover:text-slate-900 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Content */}
        <div className="flex flex-col h-[calc(100%-80px)] justify-between p-6">
          <nav className="space-y-2">
            <p className="px-4 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4">
              Main Menu
            </p>
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => window.innerWidth < 768 && toggleSidebar()}
                className={({ isActive }) =>
                  `group flex items-center gap-4 px-4 py-3.5 text-sm font-black rounded-2xl transition-all duration-300 ${
                    isActive
                      ? "bg-slate-900 text-white shadow-xl shadow-slate-200"
                      : "text-slate-500 hover:text-violet-600 hover:bg-violet-50"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <link.icon
                      size={20}
                      className={`transition-all duration-300 ${
                        isActive ? "text-indigo-400" : "group-hover:scale-110"
                      }`}
                      strokeWidth={isActive ? 2.5 : 2}
                    />
                    <span className="tracking-tight">{link.text}</span>
                    {isActive && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Sidebar Footer Card */}
          <div className="space-y-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-4 py-4 text-sm font-black rounded-2xl text-rose-500 hover:bg-rose-50 transition-all duration-300 active:scale-95 group"
            >
              <LogOut
                size={20}
                className="group-hover:-translate-x-1 transition-transform"
              />
              <span className="tracking-tight uppercase text-xs">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
