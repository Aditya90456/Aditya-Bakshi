
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { DSATopic } from '../types';
import { CheckCircle2, Clock, Star, ExternalLink, ArrowLeft } from 'lucide-react';

interface ProblemPanelProps {
  problem: DSATopic;
  onClose: () => void;
  isCompleted: boolean;
  onComplete: () => void;
}

export const ProblemPanel: React.FC<ProblemPanelProps> = ({ problem, onClose, isCompleted, onComplete }) => {
  return (
    <div className="flex flex-col h-full bg-zinc-950 border-r border-zinc-800 w-[40%] min-w-[350px] max-w-[50%] overflow-hidden shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-900 bg-zinc-950/50 backdrop-blur-sm">
        <div className="flex items-center gap-3 overflow-hidden">
            <button 
                onClick={onClose}
                className="p-1.5 -ml-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                title="Exit Problem Mode"
            >
                <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold text-white truncate">{problem.title}</h2>
        </div>
        
        {!isCompleted ? (
            <button
                onClick={onComplete}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all text-xs font-bold uppercase tracking-wide whitespace-nowrap"
            >
                <CheckCircle2 className="w-4 h-4" />
                Mark Done
            </button>
        ) : (
             <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 text-zinc-500 border border-zinc-800 cursor-not-allowed text-xs font-bold uppercase tracking-wide whitespace-nowrap">
                <CheckCircle2 className="w-4 h-4" />
                Solved
            </div>
        )}
      </div>

      {/* Content Scrollable Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        
        {/* Meta Badges */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${
                problem.difficulty === 'Easy' ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/10' :
                problem.difficulty === 'Medium' ? 'border-yellow-500/20 text-yellow-400 bg-yellow-500/10' :
                'border-red-500/20 text-red-400 bg-red-500/10'
            }`}>
                {problem.difficulty}
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-indigo-300 bg-indigo-500/10 border border-indigo-500/20">
                <Star className="w-3.5 h-3.5 fill-indigo-300/20" />
                {problem.source}
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-zinc-400 bg-zinc-900 border border-zinc-800">
                <Clock className="w-3.5 h-3.5" />
                {problem.readTime}
            </span>
        </div>

        {/* Video Player (If available) */}
        {problem.videoUrl && (
            <div className="mb-8 rounded-xl overflow-hidden border border-zinc-800 bg-black shadow-lg">
                <div className="aspect-video relative group">
                    <iframe 
                        src={problem.videoUrl} 
                        title={problem.title}
                        className="w-full h-full absolute inset-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                    ></iframe>
                </div>
                {problem.videoId && (
                     <div className="px-4 py-2 bg-zinc-900/50 flex justify-end border-t border-zinc-800">
                         <a 
                            href={`https://www.youtube.com/watch?v=${problem.videoId}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs flex items-center gap-1 text-zinc-500 hover:text-white transition-colors"
                         >
                            Open in YouTube <ExternalLink className="w-3 h-3" />
                         </a>
                     </div>
                )}
            </div>
        )}

        {/* Markdown Content */}
        <div className="prose prose-invert prose-sm max-w-none prose-headings:text-zinc-100 prose-p:text-zinc-400 prose-strong:text-zinc-200 prose-code:text-indigo-300 prose-code:bg-indigo-500/10 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800">
            <ReactMarkdown>{problem.content}</ReactMarkdown>
        </div>

        {/* Examples / Test Cases Display */}
        {problem.testCases.length > 0 && (
             <div className="mt-8 pt-8 border-t border-zinc-800">
                <h3 className="text-sm font-bold text-white mb-4">Example Test Cases</h3>
                <div className="space-y-3">
                    {problem.testCases.map((tc, i) => (
                        <div key={i} className="p-3 rounded-lg bg-zinc-900/50 border border-zinc-800 font-mono text-xs">
                            <div className="flex gap-2 mb-1">
                                <span className="text-zinc-500 w-16 shrink-0">Input:</span>
                                <span className="text-zinc-300 select-all">{tc.input}</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="text-zinc-500 w-16 shrink-0">Output:</span>
                                <span className="text-indigo-400 font-semibold select-all">{tc.expected}</span>
                            </div>
                        </div>
                    ))}
                </div>
             </div>
        )}
      </div>
    </div>
  );
};
