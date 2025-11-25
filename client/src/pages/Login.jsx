import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/login', { username, password });
      login(res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950 font-display relative overflow-hidden">
      {/* Decorative Gradients */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950"></div>
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-600/10 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-600/10 rounded-full blur-[100px]"></div>

      <div className="w-full max-w-md p-10 bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl relative z-10 animate-in fade-in zoom-in duration-300">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-6 h-16 w-16 rounded-2xl bg-gradient-to-br from-red-500 to-orange-600 shadow-lg shadow-red-500/20">
            <span className="material-symbols-outlined text-white text-3xl">dns</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">WeDo Technologies</h1>
          <p className="mt-2 text-slate-400">Sign in to Wedo Technologies Server</p>
        </div>

        {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center flex items-center justify-center gap-2">
                <span className="material-icons text-sm">error</span> {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
             <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Username</label>
             <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-white transition-colors">person</span>
                <input 
                    className="w-full pl-12 pr-4 py-4 bg-slate-950/50 border border-slate-700/50 rounded-xl focus:ring-2 focus:ring-red-500/50 focus:border-red-500 text-white placeholder-slate-600 transition-all" 
                    placeholder="Enter username" type="text" value={username} onChange={e => setUsername(e.target.value)} 
                />
             </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Password</label>
            <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-white transition-colors">lock</span>
                <input 
                    className="w-full pl-12 pr-4 py-4 bg-slate-950/50 border border-slate-700/50 rounded-xl focus:ring-2 focus:ring-red-500/50 focus:border-red-500 text-white placeholder-slate-600 transition-all" 
                    placeholder="Enter password" type="password" value={password} onChange={e => setPassword(e.target.value)}
                />
            </div>
          </div>
          
          <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-red-500/25 hover:scale-[1.02] active:scale-95 transition-all duration-200 mt-2" type="submit">
            <span className="material-symbols-outlined">login</span> 
            Access Server
          </button>
        </form>
      </div>
      
      <div className="absolute bottom-6 text-slate-600 text-xs">
        © 2025 Wedo Technologies. Secure System.
      </div>
    </div>
  );
};

export default Login;