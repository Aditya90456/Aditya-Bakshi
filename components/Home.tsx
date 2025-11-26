import React, { useEffect, useState } from 'react';
import { 
  FileCode2, FileType, Code2, Globe, FileJson, 
  Sparkles, Coffee, Braces, Terminal, Zap, ArrowRight,
  Cpu, Layers, GitBranch, Rocket
} from 'lucide-react';
import { Language } from '../types';

interface HomeProps {
  onNavigate: (view: 'editor' | 'dsa') => void;
  onOpenCreate: (lang?: Language) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate, onOpenCreate }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const languages: { id: Language; name: string; icon: React.ReactNode; color: string; gradient: string; description: string }[] = [
    { id: 'javascript', name: 'JavaScript', icon: <FileCode2 className="w-6 h-6" />, color: 'text-yellow-400', gradient: 'from-yellow-400/20 to-orange-500/20', description: 'Web logic & interaction' },
    { id: 'typescript', name: 'TypeScript', icon: <FileCode2 className="w-6 h-6" />, color: 'text-blue-400', gradient: 'from-blue-400/20 to-cyan-500/20', description: 'Type-safe development' },
    { id: 'python', name: 'Python', icon: <FileType className="w-6 h-6" />, color: 'text-green-400', gradient: 'from-green-400/20 to-emerald-500/20', description: 'Data & automation' },
    { id: 'java', name: 'Java', icon: <Coffee className="w-6 h-6" />, color: 'text-red-400', gradient: 'from-red-400/20 to-rose-500/20', description: 'Enterprise & Android' },
    { id: 'cpp', name: 'C++', icon: <Braces className="w-6 h-6" />, color: 'text-indigo-400', gradient: 'from-indigo-400/20 to-violet-500/20', description: 'Systems programming' },
    { id: 'html', name: 'HTML', icon: <Code2 className="w-6 h-6" />, color: 'text-orange-400', gradient: 'from-orange-400/20 to-red-500/20', description: 'Page structure' },
  ];

  return (
    <div className="relative h-full w-full overflow-y-auto custom-scrollbar bg-codex-bg selection:bg-indigo-500/30">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/20 blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/20 blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[30%] h-[30%] rounded-full bg-cyan-900/10 blur-[100px] animate-pulse-slow" style={{ animationDelay: '4s' }}></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 flex flex-col gap-20">
        
        {/* Hero Section */}
        <div className={`flex flex-col items-center text-center space-y-8 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium uppercase tracking-wider shadow-[0_0_20px_-5px_rgba(99,102,241,0.4)]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Next Gen Code Editor</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tight leading-none">
            Code <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Beyond</span> <br />
            Limits.
          </h1>

          <p className="max-w-2xl text-lg md:text-xl text-zinc-400 leading-relaxed">
            A powerful, browser-based development environment. 
            Write, compile, and debug in real-time with 
            <span className="text-zinc-200 font-semibold"> AI assistance </span> 
            and <span className="text-zinc-200 font-semibold">instant preview</span>.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <button 
              onClick={() => onNavigate('editor')}
              className="group relative px-8 py-4 bg-white text-black rounded-xl font-bold text-lg hover:scale-105 transition-all duration-300 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity rounded-xl"></div>
              <span className="flex items-center gap-2">
                Start Coding <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            <button 
              onClick={() => onNavigate('dsa')}
              className="px-8 py-4 bg-zinc-900 text-zinc-300 border border-zinc-800 rounded-xl font-medium text-lg hover:bg-zinc-800 hover:text-white transition-all hover:border-zinc-700"
            >
              DSA Roadmap
            </button>
          </div>
        </div>

        {/* Feature Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {[
            { icon: <Cpu className="w-6 h-6 text-indigo-400" />, title: 'Browser Compiler', desc: 'Run C++, Java, Python, and JS instantly in your browser.' },
            { icon: <Zap className="w-6 h-6 text-yellow-400" />, title: 'AI Assistant', desc: 'Debug, refactor, and generate unit tests with Gemini 2.5.' },
            { icon: <GitBranch className="w-6 h-6 text-cyan-400" />, title: 'DSA Roadmap', desc: 'Structured learning paths with GFG 250 & Striver patterns.' }
          ].map((feature, i) => (
            <div key={i} className="p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800/50 backdrop-blur-sm hover:bg-zinc-800/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Templates Section */}
        <div className={`space-y-8 pb-20 transition-all duration-1000 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex items-center gap-4">
             <h2 className="text-2xl font-bold text-white flex items-center gap-3">
               <Layers className="w-6 h-6 text-indigo-500" />
               Quick Start Templates
             </h2>
             <div className="h-px flex-1 bg-gradient-to-r from-zinc-800 to-transparent"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {languages.map((lang) => (
              <button
                key={lang.id}
                onClick={() => onOpenCreate(lang.id)}
                className="group relative flex items-center gap-5 p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800 hover:border-zinc-600 transition-all duration-300 hover:bg-zinc-800/60 hover:-translate-y-1 text-left overflow-hidden"
              >
                {/* Hover Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${lang.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                <div className={`relative z-10 w-14 h-14 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <div className={lang.color}>{lang.icon}</div>
                </div>
                
                <div className="relative z-10">
                  <h3 className="text-lg font-bold text-zinc-200 group-hover:text-white transition-colors">
                    {lang.name}
                  </h3>
                  <p className="text-xs text-zinc-500 font-medium group-hover:text-zinc-400">
                    {lang.description}
                  </p>
                </div>

                <div className="absolute right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                   <Rocket className={`w-5 h-5 ${lang.color}`} />
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};