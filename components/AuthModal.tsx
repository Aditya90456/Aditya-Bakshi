import React, { useState } from 'react';
import { X, Mail, User, ArrowRight, Loader2, Github, Code2, Cloud } from 'lucide-react';
import { UserProfile } from '../types';
import { db } from '../services/db';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  if (!isOpen) return null;

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.email) {
        setError('Email is required');
        return;
    }
    if (mode === 'signup' && !formData.name) {
        setError('Name is required');
        return;
    }

    setIsLoading(true);
    try {
        let user;
        if (mode === 'signup') {
            user = await db.signup(formData.name, formData.email);
        } else {
            user = await db.login(formData.email);
            if (!user) {
                throw new Error('User not found. Please sign up first.');
            }
        }
        
        if (user) {
            onLogin(user);
            onClose();
            // Reset
            setFormData({ name: '', email: '' });
        }
    } catch (err: any) {
        setError(err.message || 'Authentication failed');
    } finally {
        setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
      setError('');
      setIsLoading(true);
      try {
          const user = await db.loginWithGoogle();
          onLogin(user);
          onClose();
      } catch (e) {
          setError('Google sign-in failed');
      } finally {
          setIsLoading(false);
      }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in duration-200">
      <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden scale-100 animate-slide-up duration-200 relative">
        
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

        {/* Close Button */}
        <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors z-20"
        >
            <X className="w-5 h-5" />
        </button>

        <div className="p-8 relative z-10">
            
            {/* Header */}
            <div className="text-center mb-8">
                <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/20">
                    <Cloud className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                    {mode === 'login' ? 'Cloud Sync Login' : 'Create Cloud Account'}
                </h2>
                <p className="text-zinc-400 text-sm mt-2">
                    {mode === 'login' ? 'Enter your email to sync your projects.' : 'Sign up to save your work to the cloud.'}
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleAuth} className="space-y-4">
                {mode === 'signup' && (
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider ml-1">Full Name</label>
                        <div className="relative group">
                            <User className="absolute left-3 top-3 w-5 h-5 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
                            <input 
                                type="text"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                            />
                        </div>
                    </div>
                )}

                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider ml-1">Email Address</label>
                    <div className="relative group">
                        <Mail className="absolute left-3 top-3 w-5 h-5 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
                        <input 
                            type="email"
                            placeholder="name@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                        />
                    </div>
                </div>

                {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs text-center">
                        {error}
                    </div>
                )}

                <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            {mode === 'login' ? 'Sync & Login' : 'Create Account'}
                            <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-zinc-500 text-sm">
                    {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                    <button 
                        onClick={() => {
                            setMode(mode === 'login' ? 'signup' : 'login');
                            setError('');
                        }}
                        className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
                    >
                        {mode === 'login' ? 'Sign up' : 'Log in'}
                    </button>
                </p>
            </div>

            {/* Social Auth Divider */}
            <div className="mt-8 relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-zinc-800"></div>
                </div>
                <span className="relative bg-zinc-950 px-4 text-xs text-zinc-600 font-medium uppercase tracking-wider">
                    Or continue with
                </span>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 py-2.5 rounded-lg text-sm font-medium transition-colors">
                    <Github className="w-4 h-4" /> Github
                </button>
                <button 
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    className="flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><span className="font-bold">G</span> Google</>}
                </button>
            </div>

        </div>
      </div>
    </div>
  );
};