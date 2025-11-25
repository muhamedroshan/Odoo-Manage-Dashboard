import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Layout = ({ children }) => {
  const location = useLocation();
  const { logout } = useContext(AuthContext);

  const isActive = (path) => location.pathname === path 
    ? "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-900/20" 
    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50";

  return (
    <div className="flex h-screen bg-slate-950 font-display overflow-hidden selection:bg-red-500/30">
      {/* Sidebar */}
      <aside className="w-72 flex-shrink-0 bg-slate-900/50 backdrop-blur-xl border-r border-white/5 flex flex-col p-6 relative">
        {/* Brand */}
        <div className="mb-10 flex items-center space-x-3 px-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-red-500/20 shadow-lg">
                <span className="material-icons text-white text-sm">dns</span>
            </div>
            <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight">
                Wedo Technologies
            </h1>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col space-y-2 flex-1">
          <Link to="/dashboard" className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 group ${isActive('/dashboard')}`}>
            <span className="material-icons text-[20px] group-hover:scale-110 transition-transform">dashboard</span>
            <span>Dashboard</span>
          </Link>
          <Link to="/backups" className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 group ${isActive('/backups')}`}>
            <span className="material-icons text-[20px] group-hover:scale-110 transition-transform">backup</span>
            <span>Backups</span>
          </Link>
        </nav>

        {/* User / Logout */}
        <div className="pt-6 border-t border-white/5">
            <button onClick={logout} className="flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all w-full group">
                <span className="material-icons text-[20px] group-hover:-translate-x-1 transition-transform">logout</span>
                <span>Sign Out</span>
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto overflow-x-hidden relative">
        {/* Decorative background glow */}
        <div className="fixed top-0 left-1/4 w-full h-96 bg-red-500/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10 pb-20">
            {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;