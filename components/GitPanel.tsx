import React, { useState, useMemo } from 'react';
import { 
  GitGraph, GitCommit, Play, Plus, Minus, History, 
  ArrowUpCircle, ArrowDownCircle, Check, Loader2,
  GitBranch, RefreshCw, Cloud, Github
} from 'lucide-react';
import { FileData, GitState, GitChangeType } from '../types';

interface GitPanelProps {
  files: FileData[];
  gitState: GitState;
  onInit: () => void;
  onStage: (fileId: string) => void;
  onUnstage: (fileId: string) => void;
  onCommit: (message: string) => void;
  onPush: () => Promise<void>;
  onPull: () => Promise<void>;
  onRemoteAdd: (url: string) => void;
}

interface FileChange {
  file: FileData;
  type: GitChangeType;
}

export const GitPanel: React.FC<GitPanelProps> = ({
  files,
  gitState,
  onInit,
  onStage,
  onUnstage,
  onCommit,
  onPush,
  onPull,
  onRemoteAdd
}) => {
  const [commitMessage, setCommitMessage] = useState('');
  const [isPushing, setIsPushing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const [activeTab, setActiveTab] = useState<'changes' | 'history'>('changes');
  const [remoteInput, setRemoteInput] = useState('');

  // Calculate changes derived from current files vs last committed state
  const changes = useMemo(() => {
    const changedFiles: FileChange[] = [];
    
    files.forEach(file => {
      const lastContent = gitState.lastCommittedContent[file.id];
      // If file didn't exist in last commit, it's created
      if (lastContent === undefined) {
        changedFiles.push({ file, type: 'created' });
      } 
      // If content is different, it's modified
      else if (lastContent !== file.content) {
        changedFiles.push({ file, type: 'modified' });
      }
    });

    return changedFiles;
  }, [files, gitState.lastCommittedContent]);

  const stagedChanges = useMemo(() => {
    return changes.filter(c => gitState.stagedFiles.includes(c.file.id));
  }, [changes, gitState.stagedFiles]);

  const unstagedChanges = useMemo(() => {
    return changes.filter(c => !gitState.stagedFiles.includes(c.file.id));
  }, [changes, gitState.stagedFiles]);

  const handlePush = async () => {
    setIsPushing(true);
    await onPush();
    setIsPushing(false);
  };

  const handlePull = async () => {
    setIsPulling(true);
    await onPull();
    setIsPulling(false);
  };

  const handleCommit = () => {
    if (!commitMessage.trim()) return;
    onCommit(commitMessage);
    setCommitMessage('');
  };

  const handleRemoteAdd = () => {
    let url = remoteInput.trim();
    if (!url) return;

    // Support for user/repo shorthand
    if (!url.startsWith('http') && !url.startsWith('git@') && url.split('/').length === 2) {
        url = `https://github.com/${url}.git`;
    }

    onRemoteAdd(url);
    setRemoteInput('');
  };

  // Extract Repo Name from URL for display
  const repoName = useMemo(() => {
      if (!gitState.remoteUrl) return null;
      try {
          // handles https://github.com/user/repo.git
          const parts = gitState.remoteUrl.split('/');
          const last = parts[parts.length - 1];
          const user = parts[parts.length - 2];
          const repo = last.replace('.git', '');
          if (user && repo) return `${user}/${repo}`;
          return repo;
      } catch (e) {
          return gitState.remoteUrl;
      }
  }, [gitState.remoteUrl]);

  if (!gitState.isInitialized) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center space-y-6">
        <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800">
          <GitGraph className="w-8 h-8 text-zinc-500" />
        </div>
        <div className="space-y-2">
          <h3 className="text-white font-bold">No Repository Found</h3>
          <p className="text-zinc-500 text-sm">Initialize a Git repository to start tracking changes and version controlling your work.</p>
        </div>
        <button
          onClick={onInit}
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-lg transition-all shadow-lg shadow-indigo-500/20"
        >
          Initialize Repository
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-black text-zinc-300">
      
      {/* Git Header / Actions */}
      <div className="p-4 border-b border-zinc-900 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <GitBranch className="w-4 h-4 text-indigo-400" />
            {gitState.currentBranch}
          </div>
          <div className="flex items-center gap-2">
             <button 
               onClick={handlePull} 
               disabled={isPulling}
               className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 rounded-md text-xs font-medium text-zinc-300 hover:text-white transition-all disabled:opacity-50"
               title="Pull from Remote"
             >
               {isPulling ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ArrowDownCircle className="w-3.5 h-3.5" />}
               Pull
             </button>
             <button 
               onClick={handlePush} 
               disabled={isPushing}
               className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 rounded-md text-xs font-medium text-zinc-300 hover:text-white transition-all disabled:opacity-50"
               title="Push to Remote"
             >
               {isPushing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ArrowUpCircle className="w-3.5 h-3.5" />}
               Push
             </button>
          </div>
        </div>

        {/* Remote Config */}
        {!gitState.remoteUrl ? (
           <div className="space-y-1">
              <label className="text-[10px] uppercase text-zinc-500 font-bold tracking-wider">Remote Origin</label>
              <div className="flex gap-2">
                  <input 
                    value={remoteInput} 
                    onChange={(e) => setRemoteInput(e.target.value)}
                    placeholder="user/repo"
                    className="flex-1 bg-zinc-900 border border-zinc-800 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-indigo-500 placeholder-zinc-600"
                  />
                  <button 
                    onClick={handleRemoteAdd}
                    className="px-2 bg-zinc-800 hover:bg-zinc-700 rounded border border-zinc-700"
                    title="Add Remote"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
              </div>
           </div>
        ) : (
          <div className="flex items-center justify-between bg-zinc-900/50 p-2 rounded border border-zinc-800">
              <div className="flex items-center gap-2 text-xs text-zinc-300 truncate">
                <Github className="w-3.5 h-3.5" />
                <span className="font-mono">{repoName || gitState.remoteUrl}</span>
              </div>
              <Cloud className="w-3 h-3 text-indigo-400" />
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-900">
        <button
          onClick={() => setActiveTab('changes')}
          className={`flex-1 py-2 text-xs font-medium border-b-2 transition-colors ${
            activeTab === 'changes' 
              ? 'border-indigo-500 text-white' 
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          Changes
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2 text-xs font-medium border-b-2 transition-colors ${
            activeTab === 'history' 
              ? 'border-indigo-500 text-white' 
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          History
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
        
        {activeTab === 'changes' && (
          <div className="space-y-6">
            
            {/* Staged Changes */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-zinc-500 uppercase px-2 flex items-center justify-between">
                <span>Staged Changes</span>
                <span className="bg-zinc-800 text-zinc-400 px-1.5 rounded-full">{stagedChanges.length}</span>
              </h4>
              {stagedChanges.length === 0 ? (
                <div className="px-2 text-xs text-zinc-600 italic">No staged changes</div>
              ) : (
                stagedChanges.map((change) => (
                  <div key={change.file.id} className="group flex items-center justify-between p-2 rounded hover:bg-zinc-900">
                    <div className="flex items-center gap-2 overflow-hidden">
                       <span className={`text-[10px] font-bold uppercase w-4 ${
                          change.type === 'created' ? 'text-green-500' : 'text-yellow-500'
                       }`}>
                          {change.type === 'created' ? 'U' : 'M'}
                       </span>
                       <span className="text-sm truncate text-zinc-300">{change.file.name}</span>
                    </div>
                    <button 
                      onClick={() => onUnstage(change.file.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-white"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Unstaged Changes */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-zinc-500 uppercase px-2 flex items-center justify-between">
                <span>Changes</span>
                <span className="bg-zinc-800 text-zinc-400 px-1.5 rounded-full">{unstagedChanges.length}</span>
              </h4>
              {unstagedChanges.length === 0 ? (
                 <div className="px-2 text-xs text-zinc-600 italic">Working tree clean</div>
              ) : (
                unstagedChanges.map((change) => (
                  <div key={change.file.id} className="group flex items-center justify-between p-2 rounded hover:bg-zinc-900">
                     <div className="flex items-center gap-2 overflow-hidden">
                       <span className={`text-[10px] font-bold uppercase w-4 ${
                          change.type === 'created' ? 'text-green-500' : 'text-yellow-500'
                       }`}>
                          {change.type === 'created' ? 'U' : 'M'}
                       </span>
                       <span className="text-sm truncate text-zinc-300">{change.file.name}</span>
                    </div>
                    <button 
                      onClick={() => onStage(change.file.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-white"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Commit Box */}
            <div className="pt-4 border-t border-zinc-900 mt-4 px-2 space-y-3">
               <textarea
                 value={commitMessage}
                 onChange={(e) => setCommitMessage(e.target.value)}
                 placeholder="Message (e.g., 'feat: add login')"
                 className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-sm focus:outline-none focus:border-indigo-500 min-h-[80px] resize-none"
               />
               <button
                 onClick={handleCommit}
                 disabled={stagedChanges.length === 0 || !commitMessage.trim()}
                 className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white py-2 rounded-lg font-bold text-sm transition-all"
               >
                 <GitCommit className="w-4 h-4" />
                 Commit
               </button>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
           <div className="space-y-4">
              {gitState.commits.length === 0 ? (
                 <div className="text-center py-8 text-zinc-600 text-xs">No commits yet</div>
              ) : (
                [...gitState.commits].reverse().map((commit) => (
                   <div key={commit.id} className="p-3 border-l-2 border-zinc-800 ml-2 relative">
                      <div className="absolute -left-[5px] top-4 w-2 h-2 rounded-full bg-indigo-500"></div>
                      <div className="text-xs text-zinc-500 font-mono mb-1">{commit.id.substring(0, 7)}</div>
                      <div className="font-medium text-zinc-200 text-sm mb-1">{commit.message}</div>
                      <div className="flex items-center justify-between text-[10px] text-zinc-500">
                         <span>{commit.author}</span>
                         <span>{new Date(commit.timestamp).toLocaleTimeString()}</span>
                      </div>
                   </div>
                ))
              )}
           </div>
        )}

      </div>
    </div>
  );
};