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
      const res = await axios.post('https://crispy-goldfish-gwqwvv6p577cvqx7-5000.app.github.dev/api/login', { username, password });
      login(res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-800 dark:text-slate-200">
      <div className="w-full max-w-sm p-8 space-y-8 bg-white dark:bg-slate-900 rounded-lg shadow-lg">
        <div className="text-center">
          <div className="flex items-center justify-center mx-auto mb-4 h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/50">
            <span className="material-symbols-outlined text-red-600 dark:text-red-400">dns</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Wedo Technologies</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Please log in to manage your server</p>
        </div>
        {error && <p className="text-red-500 text-center text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
             <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">person</span>
            <input 
                className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-md focus:ring-yellow-500 focus:border-yellow-500 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400" 
                placeholder="User" type="text" value={username} onChange={e => setUsername(e.target.value)} 
            />
          </div>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">lock</span>
            <input 
                className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-md focus:ring-yellow-500 focus:border-yellow-500 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400" 
                placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)}
            />
          </div>
          <button className="w-full flex items-center justify-center gap-2 bg-yellow-500 text-slate-900 font-semibold py-3 rounded-md hover:bg-yellow-400 transition-colors" type="submit">
            <span className="material-symbols-outlined">login</span> Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;