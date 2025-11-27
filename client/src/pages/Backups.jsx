import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { format } from 'date-fns';
const serverURL = import.meta.env.VITE_SERVER_URI;

const Backups = () => {
  const [backups, setBackups] = useState([]);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchBackups = async () => {
      try {
        const res = await axios.get(`${serverURL}/api/backups`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBackups(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBackups();
  }, [token]);

  const handleDownload = async (filename) => {
     try {
        const response = await axios({
            url: `${serverURL}/api/backups/download/${filename}`,
            method: 'GET',
            responseType: 'blob',
            headers: { Authorization: `Bearer ${token}` }
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        console.error("Download failed", error);
    }
  };

  const getDotColor = (index) => {
    const colors = ['bg-red-500 shadow-red-500/50', 'bg-amber-500 shadow-amber-500/50', 'bg-blue-500 shadow-blue-500/50'];
    return colors[index % colors.length];
  };

  return (
    <div className="max-w-3xl mx-auto">
      <header className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-2">Backups</h2>
        <p className="text-slate-400">Download snapshots of your server data.</p>
      </header>

      <div className="relative">
        {/* Vertical Timeline Line */}
        <div className="absolute left-3.5 top-2 bottom-4 w-0.5 bg-gradient-to-b from-slate-700 to-transparent"></div>
        
        <div className="space-y-6">
          {backups.length === 0 ? (
             <div className="p-8 text-center bg-slate-900/50 rounded-2xl border border-white/5 border-dashed">
                 <p className="text-slate-400">No backups found.</p>
             </div>
          ) : (
           backups.map((file, index) => (
            <div key={index} className="relative pl-12 group">
              {/* Dot */}
              <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full ${getDotColor(index)} flex items-center justify-center ring-4 ring-slate-950 shadow-lg z-10 transition-transform group-hover:scale-110`}>
                <span className="material-icons text-white text-[14px] font-bold">save</span>
              </div>
              
              {/* Card */}
              <div className="flex items-center justify-between p-5 rounded-2xl bg-slate-900/50 border border-white/5 hover:border-slate-700 hover:bg-slate-900 transition-all shadow-sm hover:shadow-xl backdrop-blur-sm">
                <div className="flex flex-col">
                  <span className="font-semibold text-white text-lg tracking-tight">
                    {format(new Date(file.date), 'MMMM dd, yyyy')}
                  </span>
                  <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs font-mono text-slate-500 bg-slate-950 px-2 py-0.5 rounded">
                        {format(new Date(file.date), 'HH:mm')}
                      </span>
                      <span className="text-sm text-slate-400">
                        {file.name}
                      </span>
                      <span className="text-xs text-slate-500 border-l border-slate-700 pl-3">
                        {Math.round(file.size / 1024)} KB
                      </span>
                  </div>
                </div>
                <button 
                    onClick={() => handleDownload(file.name)} 
                    className="p-3 rounded-xl bg-slate-800 text-slate-300 hover:bg-white hover:text-slate-900 hover:shadow-lg transition-all active:scale-95"
                    title="Download Backup"
                >
                  <span className="material-icons">download</span>
                </button>
              </div>
            </div>
          )))}
        </div>
      </div>
    </div>
  );
};

export default Backups;