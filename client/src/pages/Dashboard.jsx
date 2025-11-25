import React, { useState, useEffect, useRef, useContext } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

// Initialize socket outside
const socket = io('http://localhost:5000', {
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
    if (line.includes('ERROR') || line.includes('Traceback')) return <span className="text-red-500">{line}</span>;
    if (line.includes('WARNING')) return <span className="text-yellow-400">{line}</span>;
    return <span className="text-slate-300">{line}</span>;
  };

  // --- SINGLE CLEAN USE EFFECT ---
  // ... inside Dashboard.jsx ...

  useEffect(() => {
    // 1. Debug Connection
    socket.on('connect', () => {
        console.log("✅ Socket Connected:", socket.id);
        // Optional: Request logs again if we reconnect
        socket.emit('request_logs'); 
    });

    socket.on('connect_error', (err) => {
        console.error("❌ Socket Error:", err);
    });

    // 2. Receive Logs
    socket.on('log_update', (data) => {
        console.log("Log received:", data); 

        setLogs((prev) => {
            if (Array.isArray(data)) {
                return [...prev, ...data].slice(-500);
            }
            return [...prev, data].slice(-500);
        });
    });

    // --- THE FIX IS HERE ---
    // 3. Explicitly ask for logs when this component mounts
    socket.emit('request_logs');

    return () => {
        socket.off('connect');
        socket.off('connect_error');
        socket.off('log_update');
    };
  }, []);
  
  // 2. NEW: Handle user scrolling manually
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    // Check if user is within 50px of the bottom
    const isNearBottom = scrollHeight - (scrollTop + clientHeight) < 50;
    isAtBottomRef.current = isNearBottom;
  };

  // 3. UPDATED: Scroll effect only runs if user was already at bottom
  useEffect(() => {
    if (isAtBottomRef.current) {
        logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  const executeScript = async (type) => {
    try {
      const res = await axios.post('http://localhost:5000/api/execute', 
        { type }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setModal({ show: true, output: res.data.output });
    } catch (err) {
      setModal({ show: true, output: "Failed to execute script." });
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-slate-800 dark:text-slate-200">Server Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <button onClick={() => executeScript('pull')} className="flex items-center justify-center space-x-3 px-6 py-4 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-yellow-950 font-bold text-lg transition-colors shadow-md hover:shadow-lg">
          <span className="material-icons">cloud_download</span>
          <span>GitHub Pull Changes</span>
        </button>
        <button onClick={() => executeScript('restart')} className="flex items-center justify-center space-x-3 px-6 py-4 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-lg transition-colors shadow-md hover:shadow-lg">
          <span className="material-icons">restart_alt</span>
          <span>Restart Service</span>
        </button>
      </div>

      <div>
          <h2 className="text-2xl font-semibold mb-4 text-slate-700 dark:text-slate-300">Live Server Logs</h2>
          <div 
            onScroll={handleScroll} 
            className="bg-black text-white font-mono text-sm rounded-lg p-6 h-96 overflow-y-auto whitespace-pre-wrap shadow-inner border border-slate-800"
          >
              {logs.length === 0 && <p className="text-gray-500">Waiting for logs...</p>}
              {logs.map((log, index) => (
                  <div key={index} className="break-all block mb-1">
                      {formatLog(log)}
                  </div>
              ))}
              <div ref={logsEndRef} />
          </div>
      </div>

      {modal.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg max-w-2xl w-full mx-4 shadow-xl">
            <h3 className="text-xl font-bold mb-4 text-white">Script Output</h3>
            <pre className="bg-black text-green-400 p-4 rounded overflow-auto max-h-60 text-sm font-mono">
              {modal.output}
            </pre>
            <button onClick={() => setModal({ show: false, output: '' })} className="mt-4 px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-500">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;