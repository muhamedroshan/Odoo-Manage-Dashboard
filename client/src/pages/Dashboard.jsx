import React, { useState, useEffect, useRef, useContext } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

// Initialize socket outside
const socket = io('/', {
    transports: ['websocket', 'polling']
});

const Dashboard = () => {
  const [logs, setLogs] = useState([]);
  const [modal, setModal] = useState({ show: false, output: '' });
  const logsEndRef = useRef(null);
  const { token } = useContext(AuthContext);
  const isAtBottomRef = useRef(true);

  // Log Highlighting Helper
  const formatLog = (line) => {
    if (!line) return null;
    if (line.includes('ERROR') || line.includes('Traceback')) return <span className="text-red-400 font-bold">{line}</span>;
    if (line.includes('WARNING')) return <span className="text-amber-400">{line}</span>;
    if (line.includes('INFO')) return <span className="text-blue-300">{line}</span>;
    if (line.includes('DEBUG')) return <span className="text-orange-300">{line}</span>;
    return <span className="text-slate-400">{line}</span>;
  };

  useEffect(() => {
    socket.on('connect', () => {
        console.log("✅ Socket Connected:", socket.id);
        socket.emit('request_logs'); 
    });

    socket.on('connect_error', (err) => console.error("❌ Socket Error:", err));

    socket.on('log_update', (data) => {
        setLogs((prev) => {
            if (Array.isArray(data)) return [...prev, ...data].slice(-500);
            return [...prev, data].slice(-500);
        });
    });

    socket.emit('request_logs');

    return () => {
        socket.off('connect');
        socket.off('connect_error');
        socket.off('log_update');
    };
  }, []);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const isNearBottom = scrollHeight - (scrollTop + clientHeight) < 50;
    isAtBottomRef.current = isNearBottom;
  };

  useEffect(() => {
    if (isAtBottomRef.current) {
        logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  const executeScript = async (type) => {
    try {
      const res = await axios.post('/api/execute', 
        { type }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setModal({ show: true, output: res.data.output });
    } catch (err) {
      setModal({ show: true, output: "Failed to execute script." });
    }
  };

  return (
    <>
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
        <p className="text-slate-400 mt-2">Manage your Odoo server instance and monitor logs.</p>
      </header>
      
      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <button 
            onClick={() => executeScript('pull')} 
            className="flex flex-col items-start p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-800/50 transition-all group text-left shadow-lg hover:shadow-amber-900/10"
        >
            <div className="p-3 rounded-lg bg-amber-500/10 text-amber-500 mb-4 group-hover:scale-110 transition-transform">
                <span className="material-icons text-3xl">cloud_download</span>
            </div>
            <h3 className="text-lg font-semibold text-white group-hover:text-amber-400 transition-colors">Pull Changes</h3>
            <p className="text-sm text-slate-400 mt-1">Fetch latest updates from GitHub repository.</p>
        </button>

        <button 
            onClick={() => executeScript('restart')} 
            className="flex flex-col items-start p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-red-500/50 hover:bg-slate-800/50 transition-all group text-left shadow-lg hover:shadow-red-900/10"
        >
            <div className="p-3 rounded-lg bg-red-500/10 text-red-500 mb-4 group-hover:scale-110 transition-transform">
                <span className="material-icons text-3xl">restart_alt</span>
            </div>
            <h3 className="text-lg font-semibold text-white group-hover:text-red-400 transition-colors">Restart Service</h3>
            <p className="text-sm text-slate-400 mt-1">Reboot the Odoo service to apply changes.</p>
        </button>
      </div>

      {/* Terminal Window */}
      <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <span className="material-icons text-slate-400 text-lg">terminal</span>
                Live Server Logs
            </h2>
            <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-xs text-green-400 font-mono">LIVE</span>
            </div>
          </div>
          
          <div className="rounded-xl overflow-hidden shadow-2xl bg-[#0d1117] border border-slate-800">
             {/* Terminal Header */}
             <div className="bg-slate-900/80 px-4 py-2 flex items-center gap-2 border-b border-slate-800">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                <div className="ml-2 text-xs text-slate-500 font-mono">odoo-server — tail -f</div>
             </div>

             {/* Terminal Body */}
             <div 
                onScroll={handleScroll} 
                className="p-6 h-[500px] overflow-y-auto font-mono text-sm leading-relaxed"
             >
                  {logs.length === 0 && (
                      <div className="flex flex-col items-center justify-center h-full text-slate-600">
                          <span className="material-icons animate-spin text-3xl mb-2">sync</span>
                          <p>Connecting to log stream...</p>
                      </div>
                  )}
                  {logs.map((log, index) => (
                      <div key={index} className="break-all whitespace-pre-wrap mb-0.5 hover:bg-white/5 px-1 -mx-1 rounded">
                          {formatLog(log)}
                      </div>
                  ))}
                  <div ref={logsEndRef} />
             </div>
          </div>
      </div>

      {/* Modal */}
      {modal.show && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Execution Result</h3>
                <button onClick={() => setModal({ show: false, output: '' })} className="text-slate-400 hover:text-white">
                    <span className="material-icons">close</span>
                </button>
            </div>
            <div className="p-0 bg-black">
                <pre className="text-green-400 p-6 overflow-auto max-h-[60vh] text-sm font-mono scrollbar-thin">
                    {modal.output || "No output returned."}
                </pre>
            </div>
            <div className="p-4 bg-slate-900 flex justify-end">
                <button 
                    onClick={() => setModal({ show: false, output: '' })} 
                    className="px-6 py-2 bg-white text-slate-900 font-semibold rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Done
                </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;