import React, { useEffect, useState } from 'react';
import { 
  FileCode2, FileType, Code2, Globe, FileJson, 
  Sparkles, Coffee, Braces, Terminal, Zap, ArrowRight,
  Cpu, Layers, GitBranch, Rocket, Clock, Star, Trophy,
  Activity, Calendar, Plus, ChevronRight, Play
} from 'lucide-react';
import { Language, UserProfile, FileData } from '../types';

interface HomeProps {
  onNavigate: (view: 'editor' | 'dsa') => void;
  onOpenCreate: (lang?: Language) => void;
  user: UserProfile | null;
  files: FileData[];
  onSelectFile: (id: string) => void;
}

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

const getIconForLanguage = (lang: Language) => {
    switch (lang) {
      case 'javascript': return <FileCode2 className="w-5 h-5 text-yellow-400" />;
      case 'typescript': return <FileCode2 className="w-5 h-5 text-blue-400" />;
      case 'python': return <FileType className="w-5 h-5 text-green-400" />;
      case 'java': return <Code2 className="w-5 h-5 text-red-400" />;
      case 'cpp': return <Code2 className="w-5 h-5 text-indigo-400" />;
      case 'css': return <Globe className="w-5 h-5 text-cyan-400" />;
      case 'html': return <Code2 className="w-5 h-5 text-orange-400" />;
      case 'json': return <FileJson className="w-5 h-5 text-yellow-200" />;
      default: return <FileCode2 className="w-5 h-5 text-gray-400" />;
    }
};

export const Home: React.FC<HomeProps> = ({ onNavigate, onOpenCreate, user, files, onSelectFile }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const templates: { id: Language; name: string; icon: React.ReactNode; color: string; gradient: string }[] = [
    { id: 'javascript', name: 'JS', icon: <FileCode2 className="w-5 h-5" />, color: 'text-yellow-400', gradient: 'from-yellow-500/20 to-orange-500/20' },
    { id: 'python', name: 'Python', icon: <FileType className="w-5 h-5" />, color: 'text-green-400', gradient: 'from-green-500/20 to-emerald-500/20' },
    { id: 'java', name: 'Java', icon: <Coffee className="w-5 h-5" />, color: 'text-red-400', gradient: 'from-red-500/20 to-rose-500/20' },
    { id: 'cpp', name: 'C++', icon: <Braces className="w-5 h-5" />, color: 'text-indigo-400', gradient: 'from-indigo-500/20 to-violet-500/20' },
  ];

  const recentFiles = files.slice(-4).reverse();

  return (
    <div className="relative h-full w-full overflow-y-auto custom-scrollbar bg-codex-bg selection:bg-indigo-500/30">
      
      {/* Dynamic Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-900/20 blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-900/20 blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[60%] h-[60%] rounded-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.05),transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 flex flex-col gap-10">
        
        {/* Header Section */}
        <div className={`flex flex-col md:flex-row justify-between items-end gap-6 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-indigo-400 font-medium text-sm uppercase tracking-wider">
               <Sparkles className="w-4 h-4" />
               <span>Codex Workspace</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
              {getGreeting()}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">{user?.name || 'Developer'}</span>
            </h1>
            <p className="text-zinc-400 max-w-lg text-lg">
              Ready to build something extraordinary today?
            </p>
          </div>

          <div className="flex items-center gap-3">
             <button 
               onClick={() => onNavigate('dsa')}
               className="flex items-center gap-2 px-5 py-3 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 rounded-xl font-medium transition-all"
             >
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span>Roadmap</span>
             </button>
             <button 
               onClick={() => onOpenCreate()}
               className="flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95"
             >
                <Plus className="w-5 h-5" />
                <span>New Project</span>
             </button>
          </div>
        </div>

        {/* Stats Grid */}
        {user && (
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-sm flex items-center gap-4 group hover:bg-zinc-900/60 transition-colors">
                    <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                        <Activity className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-white">{user.level}</div>
                        <div className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Current Rank</div>
                    </div>
                </div>
                <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-sm flex items-center gap-4 group hover:bg-zinc-900/60 transition-colors">
                    <div className="p-3 rounded-xl bg-yellow-500/10 text-yellow-400 group-hover:bg-yellow-500 group-hover:text-white transition-all">
                        <Star className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-white">{user.points} XP</div>
                        <div className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Total Score</div>
                    </div>
                </div>
                <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-sm flex items-center gap-4 group hover:bg-zinc-900/60 transition-colors">
                    <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                        <CheckCircle2Icon className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-white">{user.completedTopics.length}</div>
                        <div className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Solved Problems</div>
                    </div>
                </div>
                <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-sm flex items-center gap-4 group hover:bg-zinc-900/60 transition-colors">
                    <div className="p-3 rounded-xl bg-pink-500/10 text-pink-400 group-hover:bg-pink-500 group-hover:text-white transition-all">
                        <Rocket className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-white">{files.length}</div>
                        <div className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Active Projects</div>
                    </div>
                </div>
            </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Recent Projects & Templates */}
            <div className="lg:col-span-2 space-y-8">
                
                {/* Templates Row */}
                <div className={`space-y-4 transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Zap className="w-5 h-5 text-indigo-500" />
                        Quick Start
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {templates.map((template) => (
                            <button
                                key={template.id}
                                onClick={() => onOpenCreate(template.id)}
                                className="group relative p-4 rounded-2xl bg-zinc-900/30 border border-zinc-800 hover:border-zinc-700 overflow-hidden text-left transition-all hover:translate-y-[-2px]"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${template.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                                <div className="relative z-10 flex flex-col items-center gap-3">
                                    <div className={`p-3 rounded-xl bg-zinc-950 border border-zinc-800 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                        {template.icon}
                                    </div>
                                    <span className="text-sm font-semibold text-zinc-300 group-hover:text-white">{template.name}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Recent Projects */}
                <div className={`space-y-4 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <div className="flex items-center justify-between">
                         <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <Clock className="w-5 h-5 text-zinc-500" />
                            Recent Projects
                        </h3>
                        {files.length > 0 && (
                            <button onClick={() => onNavigate('editor')} className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                                View All <ChevronRight className="w-3 h-3" />
                            </button>
                        )}
                    </div>
                    
                    {files.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {recentFiles.map((file) => (
                                <div 
                                    key={file.id}
                                    onClick={() => onSelectFile(file.id)}
                                    className="group cursor-pointer p-4 rounded-2xl bg-zinc-900/30 border border-zinc-800 hover:border-indigo-500/30 hover:bg-zinc-900/50 transition-all flex items-start gap-4"
                                >
                                    <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 group-hover:border-indigo-500/30 transition-colors">
                                        {getIconForLanguage(file.language)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-zinc-200 group-hover:text-white truncate transition-colors">{file.name}</h4>
                                        <p className="text-xs text-zinc-500 mt-1 flex items-center gap-2">
                                            <span className="capitalize">{file.language}</span>
                                            <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                                            <span>Edited just now</span>
                                        </p>
                                    </div>
                                    <div className="self-center opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                                        <div className="p-2 rounded-full bg-indigo-500/10 text-indigo-400">
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/20 text-center space-y-3">
                            <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center mx-auto text-zinc-600">
                                <FileCode2 className="w-6 h-6" />
                            </div>
                            <p className="text-zinc-500 text-sm">No projects yet. Start building something!</p>
                            <button onClick={() => onOpenCreate()} className="text-indigo-400 text-sm font-medium hover:underline">Create a file</button>
                        </div>
                    )}
                </div>

            </div>

            {/* Right Column: Daily Challenge & Info */}
            <div className={`space-y-6 transition-all duration-700 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                
                {/* Daily Challenge Card */}
                <div className="relative p-6 rounded-3xl bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border border-indigo-500/20 overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                    
                    <div className="relative z-10 space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="px-2 py-1 rounded-md bg-white/10 text-white text-[10px] font-bold uppercase tracking-wider border border-white/5">
                                Daily Challenge
                            </span>
                            <Calendar className="w-4 h-4 text-indigo-200" />
                        </div>
                        
                        <div>
                            <h3 className="text-xl font-bold text-white mb-1">Invert Binary Tree</h3>
                            <p className="text-indigo-200 text-sm line-clamp-2">
                                Given the root of a binary tree, invert the tree, and return its root.
                            </p>
                        </div>

                        <div className="flex items-center gap-2 text-xs font-medium text-indigo-200">
                            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/20">Easy</span>
                            <span>•</span>
                            <span>15 mins</span>
                        </div>

                        <button 
                            onClick={() => onNavigate('dsa')}
                            className="w-full py-3 rounded-xl bg-white text-indigo-900 font-bold text-sm shadow-xl hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
                        >
                            <Play className="w-4 h-4 fill-current" />
                            Solve Now
                        </button>
                    </div>
                </div>

                {/* Pro Tip */}
                <div className="p-5 rounded-2xl bg-zinc-900/30 border border-zinc-800">
                    <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-purple-400" />
                        Pro Tip
                    </h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                        Use <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300 font-mono">Right Click</kbd> in the editor to access AI features like "Explain Code" or "Generate Tests".
                    </p>
                </div>

            </div>
        </div>
      </div>
    </div>
  );
};

// Helper Icon for Stats
const CheckCircle2Icon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10"/>
        <path d="m9 12 2 2 4-4"/>
    </svg>
);