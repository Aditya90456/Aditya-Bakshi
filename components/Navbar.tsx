import React from 'react';
import { Map, Plus, Code2, Trophy, Terminal, Home } from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  activeView: 'home' | 'editor' | 'dsa';
  onNavigate: (view: 'home' | 'editor' | 'dsa') => void;
  user: UserProfile;
  onAddFile: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeView, onNavigate, user, onAddFile }) => {
  return (
    <div className="h-16 border-b border-zinc-900 bg-black flex items-center justify-between px-6 shrink-0 z-50">
      {/* Left: Brand & Nav */}
      <div className="flex items-center gap-8">
        <button onClick={() => onNavigate('home')} className="flex items-center gap-2.5 text-white font-bold text-lg tracking-tight hover:opacity-90 transition-opacity">
             <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                 <Code2 className="w-5 h-5 text-white" />
             </div>
             Codex
        </button>

        <div className="hidden md:flex items-center gap-1 bg-zinc-900/50 p-1 rounded-lg border border-zinc-800">
            <button
                onClick={() => onNavigate('home')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                    activeView === 'home' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                }`}
            >
                <Home className="w-4 h-4" />
                Home
            </button>
            <button
                onClick={() => onNavigate('dsa')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                    activeView === 'dsa' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                }`}
            >
                <Map className="w-4 h-4" />
                Roadmap
            </button>
            <button
                onClick={() => onNavigate('editor')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                    activeView === 'editor' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                }`}
            >
                <Terminal className="w-4 h-4" />
                Playground
            </button>
        </div>
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-4">
        {activeView === 'editor' && (
            <button
                onClick={onAddFile}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
            >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">New File</span>
            </button>
        )}

        <div className="h-6 w-px bg-zinc-800 mx-2"></div>

        <div className="flex items-center gap-3 pl-2">
            <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-white leading-none mb-1">{user.name}</div>
                <div className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider flex items-center justify-end gap-1.5">
                    <span className="text-indigo-400">{user.level}</span>
                    <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                    <span className="flex items-center gap-0.5 text-yellow-500">
                        <Trophy className="w-3 h-3" />
                        {user.points}
                    </span>
                </div>
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-inner border border-white/10 relative">
                {user.name.charAt(0)}
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></div>
            </div>
        </div>
      </div>
    </div>
  );
};