import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { format } from 'date-fns'; // You might need to install this: npm install date-fns

const Backups = () => {
  const [backups, setBackups] = useState([]);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchBackups = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/backups', {
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
            url: `http://localhost:5000/api/backups/download/${filename}`,
            method: 'GET',
            responseType: 'blob', // Important for files
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

  // Helper for timeline colors to match mockup variety
  const getDotColor = (index) => {
    const colors = ['bg-primary', 'bg-amber-500', 'bg-slate-400', 'bg-slate-400'];
    return colors[index % colors.length];
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-slate-900 dark:text-white">Server Backups</h2>
      <div className="relative">
        {/* Vertical Timeline Line */}
        <div className="absolute left-4 top-0 h-full w-0.5 bg-slate-300 dark:bg-slate-700"></div>
        
        <div className="space-y-8">
          {backups.length === 0 ? <p className="pl-12 text-slate-400">No backups found.</p> : 
           backups.map((file, index) => (
            <div key={index} className="relative pl-12 group">
              {/* Dot */}
              <div className={`absolute left-0 top-1.5 w-8 h-8 rounded-full ${getDotColor(index)} flex items-center justify-center ring-8 ring-background-light dark:ring-background-dark z-10`}>
                <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
              </div>
              
              {/* Card */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-slate-100 dark:bg-slate-800 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col">
                  <span className="font-medium text-slate-800 dark:text-slate-100">
                    {format(new Date(file.date), 'MMM dd EEE, yyyy HH:mm')}
                  </span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {file.name} ({Math.round(file.size / 1024)} KB)
                  </span>
                </div>
                <button onClick={() => handleDownload(file.name)} className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                  <span className="material-symbols-outlined">download</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Backups;