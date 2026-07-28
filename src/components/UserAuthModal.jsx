import React, { useState } from 'react';
import { Mail, Lock, User, Phone, MapPin, X, ShieldCheck, ArrowRight } from 'lucide-react';
import api from '../services/api';

export default function UserAuthModal({ isOpen, onClose, initialMode = 'login', onAuthSuccess, isDarkMode }) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please fill in email and password.');
      return;
    }

    if (mode === 'register' && !email.includes('@')) {
      setError('Please enter a valid Gmail / email address.');
      return;
    }

    if (mode === 'register') {
      if (!fullName.trim()) {
        setError('Full Name is required for registration.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        const res = await api.userLogin(email.trim(), password.trim());
        if (res.success && res.token && res.user) {
          onAuthSuccess(res.token, res.user);
          onClose();
        }
      } else {
        const res = await api.userRegister({
          email: email.trim(),
          password: password.trim(),
          fullName: fullName.trim(),
          phone: phone.trim(),
          address: address.trim()
        });
        if (res.success && res.token && res.user) {
          onAuthSuccess(res.token, res.user);
          onClose();
        }
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check details and try again.');
    } finally {
      setLoading(false);
    }
  };

  const modalBg = isDarkMode
    ? 'bg-slate-950/95 border-slate-800 text-slate-100 shadow-2xl shadow-emerald-500/10'
    : 'bg-white border-slate-200 text-slate-800 shadow-2xl shadow-slate-900/20';

  const inputClass = isDarkMode
    ? 'bg-slate-900/90 border-slate-800 text-slate-100 placeholder-slate-500 focus:border-emerald-500'
    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-emerald-600';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className={`relative w-full max-w-md p-6 sm:p-8 rounded-3xl border transition-all transform scale-100 ${modalBg}`}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-lg shadow-emerald-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            {mode === 'login' ? 'Welcome Back!' : 'Create User Account'}
          </h2>
          <p className="text-xs text-slate-400">
            {mode === 'login'
              ? 'Sign in to manage your registered pets and adoption applications'
              : 'Join PawPath to register pets for adoption and find your companion'}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex bg-slate-900/60 p-1 rounded-2xl border border-slate-800/80 mb-6 text-xs font-bold">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); }}
            className={`flex-1 py-2.5 rounded-xl transition ${
              mode === 'login'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(''); }}
            className={`flex-1 py-2.5 rounded-xl transition ${
              mode === 'register'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Register Account
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5">Full Name *</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. Sarah Jenkins"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={`w-full rounded-2xl pl-10 pr-4 py-2.5 text-xs font-medium border focus:outline-none transition ${inputClass}`}
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5">Gmail / Email Address *</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                placeholder="user@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full rounded-2xl pl-10 pr-4 py-2.5 text-xs font-medium border focus:outline-none transition ${inputClass}`}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5">Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full rounded-2xl pl-10 pr-4 py-2.5 text-xs font-medium border focus:outline-none transition ${inputClass}`}
                required
              />
            </div>
          </div>

          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`w-full rounded-2xl pl-10 pr-4 py-2.5 text-xs font-medium border focus:outline-none transition ${inputClass}`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">Residence Address</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="City, State, Zip Code"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className={`w-full rounded-2xl pl-10 pr-4 py-2.5 text-xs font-medium border focus:outline-none transition ${inputClass}`}
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-extrabold shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-400 transition active:scale-98 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Connecting...</span>
            ) : (
              <>
                <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-slate-400">
            {mode === 'login' ? "Don't have an account yet?" : "Already registered?"}{' '}
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                setError('');
              }}
              className="font-bold text-emerald-400 hover:underline ml-1"
            >
              {mode === 'login' ? 'Register Now' : 'Log In Here'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
