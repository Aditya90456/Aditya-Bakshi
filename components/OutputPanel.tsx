import React, { useEffect, useRef, useState } from 'react';
import { Terminal, X, AlertCircle, CheckCircle2, Info, Loader2, Play, ScanLine, Bot, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { LogEntry } from '../types';

interface OutputPanelProps {
  isOpen: boolean;
  onClose: () => void;
  logs: LogEntry[];
  isRunning: boolean;
  mode: 'run' | 'dry-run' | 'preview';
  previewContent?: string;
}

const ScanningUI = () => {
  const [step, setStep] = useState(0);
  const steps = [
    "Parsing Abstract Syntax Tree...",
    "Analyzing Control Flow...",
    "Checking Type Safety...",
    "Detecting Logical Anomalies...",
    "Optimizing Performance Patterns...",
    "Generating Insights..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep(s => (s < steps.length - 1 ? s + 1 : s));
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-6 text-zinc-400 bg-black/20">
       {/* Visual Scanner */}
       <div className="relative w-20 h-20 flex items-center justify-center">
          <div className="absolute inset-0 border-2 border-indigo-500/20 rounded-full animate-[ping_3s_linear_infinite]"></div>
          <div className="absolute inset-0 border border-indigo-500/40 rounded-full animate-[spin_4s_linear_infinite]"></div>
          <div className="absolute inset-2 border border-purple-500/40 rounded-full animate-[spin_3s_linear_infinite_reverse]"></div>
          <Bot className="w-8 h-8 text-indigo-400 relative z-10" />
          
          {/* Scan Line */}
          <div className="absolute w-full h-0.5 bg-indigo-400/80 shadow-[0_0_10px_rgba(99,102,241,0.8)] animate-[scan_2s_ease-in-out_infinite] top-0 opacity-50"></div>
       </div>
       
       <div className="space-y-2 text-center">
          <h3 className="text-indigo-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2 justify-center">
             <Sparkles className="w-3 h-3 animate-pulse" />
             AI Analysis In Progress
          </h3>
          <p className="text-xs font-mono text-zinc-500 min-h-[20px] w-64 text-center">{steps[step]}</p>
       </div>
       
       {/* Progress Bar */}
       <div className="w-64 h-1 bg-zinc-800 rounded-full overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent w-1/2 h-full animate-progress"></div>
       </div>
    </div>
  )
}

export const OutputPanel: React.FC<OutputPanelProps> = ({ 
  isOpen, 
  onClose, 
  logs, 
  isRunning, 
  mode,
  previewContent
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, isOpen, isRunning]);

  if (!isOpen) return null;

  return (
    <div className="h-72 bg-slate-950 border-t border-slate-800 flex flex-col shrink-0 animate-in slide-in-from-bottom-10 duration-300 relative z-40 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2">
          {mode === 'preview' ? (
             <Play className="w-4 h-4 text-green-400" />
          ) : mode === 'dry-run' ? (
             <ScanLine className="w-4 h-4 text-purple-400" />
          ) : (
             <Terminal className="w-4 h-4 text-blue-400" />
          )}
          <span className="text-sm font-semibold text-slate-200 uppercase tracking-wide">
            {mode === 'preview' ? 'Live Preview' : mode === 'dry-run' ? 'Dry Run Analysis' : 'Console Output'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isRunning && mode !== 'dry-run' && (
            <div className="flex items-center gap-2 text-xs text-blue-400 mr-2">
              <Loader2 className="w-3 h-3 animate-spin" />
              Processing...
            </div>
          )}
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden relative bg-[#0c0c0e]">
        
        {/* Render Scanning UI for Dry Run */}
        {mode === 'dry-run' && isRunning ? (
            <ScanningUI />
        ) : mode === 'preview' && previewContent ? (
           <iframe 
             title="Preview"
             srcDoc={previewContent}
             className="w-full h-full bg-white border-0"
             sandbox="allow-scripts"
           />
        ) : (
          <div ref={scrollRef} className="h-full overflow-y-auto p-4 space-y-2 font-mono text-sm custom-scrollbar">
            {logs.length === 0 && !isRunning && (
              <div className="flex flex-col items-center justify-center h-full text-zinc-600 gap-2">
                 <Terminal className="w-8 h-8 opacity-20" />
                 <span className="text-xs italic">Output is empty</span>
              </div>
            )}
            
            {logs.map((log) => (
              <div key={log.id} className="flex gap-3 items-start animate-in fade-in duration-300">
                <span className="shrink-0 mt-0.5 opacity-80">
                  {log.type === 'error' && <AlertCircle className="w-3.5 h-3.5 text-red-500" />}
                  {log.type === 'success' && <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />}
                  {log.type === 'info' && <Info className="w-3.5 h-3.5 text-blue-400" />}
                  {log.type === 'system' && <Terminal className="w-3.5 h-3.5 text-slate-500" />}
                  {log.type === 'warn' && <AlertCircle className="w-3.5 h-3.5 text-yellow-500" />}
                </span>
                <div className={`whitespace-pre-wrap break-all flex-1 ${
                  log.type === 'error' ? 'text-red-400' :
                  log.type === 'success' ? 'text-green-400' :
                  log.type === 'system' ? 'text-slate-500' :
                  log.type === 'warn' ? 'text-yellow-400' :
                  'text-slate-300'
                }`}>
                    {mode === 'dry-run' ? (
                        <div className="markdown-body prose prose-invert prose-sm max-w-none prose-p:my-1 prose-headings:my-2 prose-code:text-indigo-300">
                             <ReactMarkdown>{log.message}</ReactMarkdown>
                        </div>
                    ) : log.message}
                </div>
              </div>
            ))}
            {isRunning && mode === 'run' && (
               <div className="flex items-center gap-2 text-zinc-500 animate-pulse">
                  <span className="w-1.5 h-4 bg-zinc-500 block"></span>
               </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};