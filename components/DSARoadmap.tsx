import React, { useState, useMemo, useEffect } from 'react';
import { 
  ArrowLeft, BookOpen, Code2, Cpu, GitFork, Layers, 
  Hash, MoveHorizontal, Minimize2, 
  CheckCircle2, MonitorPlay, FileCheck, Star, Grid, Type, Search,
  ChevronRight, List, Clock, AlignLeft, Terminal, Layout, Repeat,
  ArrowRightLeft, GitMerge, RotateCcw, Network, Boxes, Loader2
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { DSATopic, Language } from '../types';
import { db } from '../services/db';

interface DSARoadmapProps {
  onSolveProblem: (topic: DSATopic) => void;
  completedTopicIds: string[];
  onCompleteTopic: (topicId: string, points: number) => void;
}

// Icon mapper helper
const getCategoryIcon = (category: string) => {
    if (category.includes('Sliding Window')) return <Minimize2 className="w-5 h-5 text-blue-400" />;
    if (category.includes('Two Pointers')) return <MoveHorizontal className="w-5 h-5 text-cyan-400" />;
    if (category.includes('Fast & Slow')) return <Repeat className="w-5 h-5 text-purple-400" />;
    if (category.includes('Merge Intervals')) return <GitMerge className="w-5 h-5 text-green-400" />;
    if (category.includes('Cyclic Sort')) return <RotateCcw className="w-5 h-5 text-orange-400" />;
    if (category.includes('Reversal')) return <ArrowRightLeft className="w-5 h-5 text-pink-400" />;
    if (category.includes('Tree')) return <Network className="w-5 h-5 text-teal-400" />;
    if (category.includes('Heaps')) return <Boxes className="w-5 h-5 text-red-400" />;
    if (category.includes('Subsets')) return <Layers className="w-5 h-5 text-indigo-400" />;
    if (category.includes('Search')) return <Search className="w-5 h-5 text-blue-500" />;
    if (category.includes('XOR')) return <Cpu className="w-5 h-5 text-yellow-500" />;
    if (category.includes('Top K')) return <Boxes className="w-5 h-5 text-red-400" />;
    if (category.includes('Knapsack')) return <Layers className="w-5 h-5 text-green-500" />;
    if (category.includes('Graph')) return <GitFork className="w-5 h-5 text-indigo-400" />;
    return <Code2 className="w-5 h-5 text-zinc-400" />;
};

export const DSARoadmap: React.FC<DSARoadmapProps> = ({ onSolveProblem, completedTopicIds, onCompleteTopic }) => {
  const [topics, setTopics] = useState<DSATopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch topics from DB on mount
  useEffect(() => {
    const fetchQuestions = async () => {
        try {
            const data = await db.getQuestions();
            setTopics(data);
        } catch (e) {
            console.error("Failed to load questions", e);
        } finally {
            setLoading(false);
        }
    };
    fetchQuestions();
  }, []);

  const activeTopic = activeTopicId ? topics.find(t => t.id === activeTopicId) : null;
  const isCompleted = activeTopic ? completedTopicIds.includes(activeTopic.id) : false;

  // Filter and Group topics by category
  const filteredTopics = useMemo(() => {
    if (!searchTerm) return topics;
    return topics.filter(t => 
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      t.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, topics]);

  const topicsByCategory = useMemo<Record<string, DSATopic[]>>(() => {
    const groups: Record<string, DSATopic[]> = {};
    filteredTopics.forEach(topic => {
      if (!groups[topic.category]) groups[topic.category] = [];
      groups[topic.category].push(topic);
    });
    return groups;
  }, [filteredTopics]);

  if (loading) {
      return (
          <div className="flex items-center justify-center h-full bg-codex-bg text-zinc-500">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                <p>Loading Roadmap Database...</p>
              </div>
          </div>
      )
  }

  return (
    <div className="flex h-full bg-codex-bg overflow-hidden font-sans">
      
      {/* 1. Sidebar Course Index (GFG Style) */}
      <div className="w-80 border-r border-zinc-900 bg-black flex flex-col shrink-0">
        <div className="p-4 border-b border-zinc-900 bg-zinc-950/50 backdrop-blur-sm sticky top-0 z-10 space-y-3">
          <h2 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
            <List className="w-4 h-4 text-indigo-500" />
            DSA Patterns
          </h2>
          <div className="relative">
             <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
             <input 
                type="text" 
                placeholder="Search 350+ Questions..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-indigo-500"
             />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-6">
          {Object.entries(topicsByCategory).map(([category, catTopics]: [string, DSATopic[]]) => (
            <div key={category}>
              <h3 className="text-xs font-bold text-zinc-500 uppercase mb-3 px-2 flex items-center gap-2">
                <AlignLeft className="w-3 h-3" /> {category.replace('Pattern: ', '')}
              </h3>
              <div className="space-y-1">
                {catTopics.map(topic => {
                   const isDone = completedTopicIds.includes(topic.id);
                   const isActive = activeTopicId === topic.id;
                   
                   return (
                     <button
                        key={topic.id}
                        onClick={() => setActiveTopicId(topic.id)}
                        className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group ${
                          isActive 
                            ? 'bg-zinc-900 text-white shadow-sm ring-1 ring-zinc-800' 
                            : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200'
                        }`}
                     >
                        <div className={`shrink-0 ${isDone ? 'text-emerald-500' : (isActive ? 'text-indigo-500' : 'text-zinc-600')}`}>
                          {isDone ? <CheckCircle2 className="w-4 h-4" /> : getCategoryIcon(topic.category)}
                        </div>
                        <span className="flex-1 truncate font-medium">{topic.title}</span>
                        {isActive && <ChevronRight className="w-3 h-3 text-indigo-500" />}
                     </button>
                   );
                })}
              </div>
            </div>
          ))}
          {Object.keys(topicsByCategory).length === 0 && (
             <div className="text-center text-zinc-500 text-sm mt-10">No topics found.</div>
          )}
        </div>
      </div>

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#09090b]">
        
        {/* Top Breadcrumb Header */}
        <div className="h-14 border-b border-zinc-900 flex items-center px-8 shrink-0 bg-black/40 backdrop-blur-md sticky top-0 z-20 justify-between">
           <div className="flex items-center gap-2 text-sm text-zinc-500">
              <span className="hover:text-zinc-300 cursor-pointer" onClick={() => setActiveTopicId(null)}>Patterns</span>
              <ChevronRight className="w-3.5 h-3.5" />
              {activeTopic ? (
                 <>
                  <span className="text-zinc-300">{activeTopic.category.replace('Pattern: ', '')}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                  <span className="text-white font-medium">{activeTopic.title}</span>
                 </>
              ) : (
                <span className="text-white font-medium">Dashboard</span>
              )}
           </div>
           
           {/* Mobile-like Solve Button for Header */}
           {activeTopic && (
              <button 
                onClick={() => onSolveProblem(activeTopic)}
                className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-xs font-bold uppercase tracking-wide transition-all shadow-lg shadow-indigo-500/20"
              >
                <Code2 className="w-3.5 h-3.5" />
                Solve
              </button>
           )}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          
          {activeTopic ? (
            /* ARTICLE VIEW */
            <div className="max-w-6xl mx-auto w-full p-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
               
               {/* Left Column: Article (8 Cols) */}
               <div className="lg:col-span-8 space-y-8 pb-20">
                  
                  {/* Article Title Block */}
                  <div className="space-y-4 border-b border-zinc-800 pb-8">
                      <h1 className="text-4xl font-black text-white leading-tight tracking-tight">
                        {activeTopic.title}
                      </h1>
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                         <span className="flex items-center gap-1.5 text-zinc-400 bg-zinc-900 px-2 py-1 rounded-md border border-zinc-800">
                            <Clock className="w-3.5 h-3.5" /> {activeTopic.readTime} Read
                         </span>
                         <span className={`px-2 py-1 rounded-md border font-bold text-xs uppercase tracking-wide ${
                            activeTopic.difficulty === 'Easy' ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/10' :
                            activeTopic.difficulty === 'Medium' ? 'border-yellow-500/20 text-yellow-400 bg-yellow-500/10' :
                            'border-red-500/20 text-red-400 bg-red-500/10'
                         }`}>
                           {activeTopic.difficulty}
                         </span>
                         <span className="flex items-center gap-1 text-indigo-400 font-medium">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            {activeTopic.source}
                         </span>
                      </div>
                  </div>

                  {/* Article Body */}
                  <div className="prose prose-invert prose-lg max-w-none 
                        prose-headings:font-bold prose-headings:text-zinc-100 prose-headings:tracking-tight
                        prose-h1:text-3xl prose-h1:mb-6 prose-h1:border-b prose-h1:border-zinc-800 prose-h1:pb-4
                        prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:text-indigo-200
                        prose-p:text-zinc-300 prose-p:leading-relaxed
                        prose-strong:text-white prose-strong:font-bold
                        prose-code:text-indigo-300 prose-code:bg-indigo-950/30 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:font-mono prose-code:text-sm
                        prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-zinc-800 prose-pre:rounded-xl prose-pre:shadow-lg
                        prose-ul:marker:text-zinc-500 prose-li:text-zinc-300
                        prose-blockquote:border-l-4 prose-blockquote:border-indigo-500 prose-blockquote:bg-zinc-900/50 prose-blockquote:px-6 prose-blockquote:py-2 prose-blockquote:not-italic prose-blockquote:text-zinc-400 prose-blockquote:rounded-r-lg"
                  >
                      <ReactMarkdown>{activeTopic.content}</ReactMarkdown>
                  </div>
               </div>

               {/* Right Column: Sticky Widget (4 Cols) */}
               <div className="lg:col-span-4 relative">
                  <div className="sticky top-8 space-y-6">
                      
                      {/* Solve Widget */}
                      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-xl relative overflow-hidden">
                         <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                         
                         <h3 className="text-lg font-bold text-white mb-2 relative z-10 flex items-center gap-2">
                             <Terminal className="w-5 h-5 text-indigo-500" />
                             Practice Problem
                         </h3>
                         <p className="text-zinc-400 text-sm mb-6 leading-relaxed relative z-10">
                             Apply the concepts from this article. Write code, run test cases, and submit.
                         </p>

                         <button
                                onClick={() => onSolveProblem(activeTopic)}
                                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-indigo-500/20 mb-3"
                            >
                                <Code2 className="w-4 h-4" />
                                Solve Challenge
                        </button>

                        {!isCompleted ? (
                            <button
                                onClick={() => onCompleteTopic(activeTopic.id, activeTopic.points)}
                                className="w-full flex items-center justify-center gap-2 bg-zinc-950 text-emerald-500 border border-zinc-800 hover:bg-zinc-800 font-medium py-2.5 rounded-lg transition-all text-sm"
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                Mark as Completed
                            </button>
                        ) : (
                            <div className="w-full flex items-center justify-center gap-2 bg-emerald-900/10 text-emerald-500 border border-emerald-900/20 font-medium py-2.5 rounded-lg text-sm cursor-default">
                                <CheckCircle2 className="w-4 h-4" />
                                Completed
                            </div>
                        )}
                      </div>

                      {/* Test Cases Preview */}
                      {activeTopic.testCases.length > 0 && (
                          <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-5">
                              <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-4">Sample Test Cases</h4>
                              <div className="space-y-3">
                                  {activeTopic.testCases.map((tc, i) => (
                                      <div key={i} className="bg-zinc-900/50 border border-zinc-800 rounded p-2.5 text-xs font-mono">
                                          <div className="text-zinc-500 mb-1">In: <span className="text-zinc-300">{tc.input}</span></div>
                                          <div className="text-zinc-500">Out: <span className="text-indigo-400 font-semibold">{tc.expected}</span></div>
                                      </div>
                                  ))}
                              </div>
                          </div>
                      )}

                  </div>
               </div>

            </div>
          ) : (
            /* DASHBOARD GRID VIEW */
            <div className="p-8 max-w-7xl mx-auto animate-fade-in">
              <div className="text-center space-y-4 mb-12 py-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium uppercase tracking-wider mb-4">
                     <Layers className="w-3.5 h-3.5" />
                     Comprehensive Curriculum
                </div>
                <h2 className="text-4xl font-black text-white tracking-tight">Pattern-Wise DSA Roadmap</h2>
                <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
                   Master 350+ questions categorized by their underlying patterns (Sliding Window, Two Pointers, etc.) to crack coding interviews.
                </p>
                <div className="flex justify-center pt-4">
                   <div className="relative w-full max-w-lg">
                      <Search className="absolute left-4 top-3.5 w-5 h-5 text-zinc-500" />
                      <input 
                         type="text" 
                         placeholder="Search topics (e.g., 'Sliding Window', 'Hard')..." 
                         value={searchTerm}
                         onChange={(e) => setSearchTerm(e.target.value)}
                         className="w-full bg-zinc-900 border border-zinc-800 rounded-full pl-12 pr-6 py-3 text-zinc-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      />
                   </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {filteredTopics.map((topic) => {
                    const isDone = completedTopicIds.includes(topic.id);
                    return (
                        <div 
                            key={topic.id}
                            onClick={() => setActiveTopicId(topic.id)}
                            className={`group relative bg-zinc-900/40 border rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:bg-zinc-900 hover:translate-y-[-2px] ${
                                isDone 
                                ? 'border-emerald-500/30 shadow-[0_0_20px_-10px_rgba(16,185,129,0.2)]' 
                                : 'border-zinc-800 hover:border-indigo-500/50 hover:shadow-[0_0_20px_-10px_rgba(99,102,241,0.2)]'
                            }`}
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className={`p-3.5 rounded-2xl transition-colors ${isDone ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-800 text-zinc-400 group-hover:text-indigo-400 group-hover:bg-indigo-500/10'}`}>
                                    {getCategoryIcon(topic.category)}
                                </div>
                                {isDone && (
                                    <div className="bg-emerald-500/20 text-emerald-400 p-1 rounded-full">
                                        <CheckCircle2 className="w-4 h-4" />
                                    </div>
                                )}
                            </div>
                            
                            <h3 className="text-xl font-bold text-zinc-100 mb-2 group-hover:text-indigo-400 transition-colors">{topic.title}</h3>
                            
                            <div className="flex items-center gap-2 mb-4 text-xs font-medium">
                                <span className={`px-2 py-0.5 rounded border ${
                                    topic.difficulty === 'Easy' ? 'border-emerald-900 bg-emerald-900/20 text-emerald-400' :
                                    topic.difficulty === 'Medium' ? 'border-yellow-900 bg-yellow-900/20 text-yellow-400' :
                                    'border-red-900 bg-red-900/20 text-red-400'
                                }`}>
                                    {topic.difficulty}
                                </span>
                                <span className="text-zinc-500 flex items-center gap-1">
                                    <Layout className="w-3 h-3" /> {topic.category.replace('Pattern: ', '')}
                                </span>
                            </div>

                            <p className="text-zinc-500 text-sm mb-6 line-clamp-2 leading-relaxed">
                              {topic.description}
                            </p>

                            <div className="pt-4 border-t border-zinc-800 flex items-center justify-between text-xs font-medium text-zinc-400 group-hover:text-zinc-300">
                                <span>{topic.readTime}</span>
                                <span className="flex items-center gap-1 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                    View Problem <ArrowLeft className="w-3 h-3 rotate-180" />
                                </span>
                            </div>
                        </div>
                    );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};