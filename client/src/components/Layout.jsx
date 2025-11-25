import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Layout = ({ children }) => {
  const location = useLocation();
  const { logout } = useContext(AuthContext);

  const isActive = (path) => location.pathname === path 
    ? "bg-primary text-white" 
    : "text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800";

  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark font-display">
      <aside className="w-64 flex-shrink-0 bg-slate-100 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col p-6">
        <div className="mb-8">
           <h1 className="text-xl font-bold text-slate-800 dark:text-white">Wedo Tech</h1>
        </div>
        <nav className="flex flex-col space-y-2">
          <Link to="/dashboard" className={`flex items-center space-x-3 px-4 py-2 rounded-lg font-medium transition-colors ${isActive('/dashboard')}`}>
            <span className="material-icons">dashboard</span>
            <span>Dashboard</span>
          </Link>
          <Link to="/backups" className={`flex items-center space-x-3 px-4 py-2 rounded-lg font-medium transition-colors ${isActive('/backups')}`}>
            <span className="material-icons">backup</span>
            <span>Backups</span>
          </Link>
          <button onClick={logout} className="flex items-center space-x-3 px-4 py-2 rounded-lg font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-left w-full">
            <span className="material-icons">logout</span>
            <span>Logout</span>
          </button>
        </nav>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto text-slate-900 dark:text-slate-100">
        {children}
      </main>
    </div>
  );
};

export default Layout;