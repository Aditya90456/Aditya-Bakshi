import React, { useEffect, useRef } from 'react';
import { Terminal, X, AlertCircle, CheckCircle2, Info, Loader2, Play } from 'lucide-react';
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
  }, [logs, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="h-64 bg-slate-950 border-t border-slate-800 flex flex-col shrink-0 animate-in slide-in-from-bottom-10 duration-300 relative z-40">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2">
          {mode === 'preview' ? (
             <Play className="w-4 h-4 text-green-400" />
          ) : mode === 'dry-run' ? (
             <CheckCircle2 className="w-4 h-4 text-purple-400" />
          ) : (
             <Terminal className="w-4 h-4 text-blue-400" />
          )}
          <span className="text-sm font-semibold text-slate-200 uppercase tracking-wide">
            {mode === 'preview' ? 'Live Preview' : mode === 'dry-run' ? 'Dry Run Analysis' : 'Console Output'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isRunning && (
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
      <div className="flex-1 overflow-hidden relative">
        {mode === 'preview' && previewContent ? (
           <iframe 
             title="Preview"
             srcDoc={previewContent}
             className="w-full h-full bg-white"
             sandbox="allow-scripts"
           />
        ) : (
          <div ref={scrollRef} className="h-full overflow-y-auto p-4 space-y-2 font-mono text-sm">
            {logs.length === 0 && !isRunning && (
              <div className="text-slate-600 italic">No output to display. Run code to see results.</div>
            )}
            
            {logs.map((log) => (
              <div key={log.id} className="flex gap-2 items-start animate-in fade-in duration-200">
                <span className="shrink-0 mt-0.5">
                  {log.type === 'error' && <AlertCircle className="w-3.5 h-3.5 text-red-500" />}
                  {log.type === 'success' && <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />}
                  {log.type === 'info' && <Info className="w-3.5 h-3.5 text-blue-400" />}
                  {log.type === 'system' && <Terminal className="w-3.5 h-3.5 text-slate-500" />}
                  {log.type === 'warn' && <AlertCircle className="w-3.5 h-3.5 text-yellow-500" />}
                </span>
                <div className={`whitespace-pre-wrap break-all ${
                  log.type === 'error' ? 'text-red-400' :
                  log.type === 'success' ? 'text-green-400' :
                  log.type === 'system' ? 'text-slate-500' :
                  log.type === 'warn' ? 'text-yellow-400' :
                  'text-slate-300'
                }`}>
                    {mode === 'dry-run' ? (
                        <div className="markdown-body prose prose-invert prose-sm max-w-none">
                             <ReactMarkdown>{log.message}</ReactMarkdown>
                        </div>
                    ) : log.message}
                </div>
              </div>
            ))}
            {isRunning && (
               <div className="h-4 w-2 bg-blue-500 animate-pulse ml-6"></div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
