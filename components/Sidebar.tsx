import React, { useState } from 'react';
import { FileCode2, FileJson, FileType, Plus, Trash2, Code2, Globe, Files, GitGraph } from 'lucide-react';
import { FileData, Language, GitState } from '../types';
import { GitPanel } from './GitPanel';

interface SidebarProps {
  files: FileData[];
  activeFileId: string | null;
  onSelectFile: (id: string) => void;
  onAddFile: () => void;
  onDeleteFile: (id: string) => void;
  
  // Git Props
  gitState: GitState;
  onGitInit: () => void;
  onGitStage: (fileId: string) => void;
  onGitUnstage: (fileId: string) => void;
  onGitCommit: (msg: string) => void;
  onGitPush: () => Promise<void>;
  onGitPull: () => Promise<void>;
  onGitRemoteAdd: (url: string) => void;
}

const getIconForLanguage = (lang: Language) => {
  switch (lang) {
    case 'javascript': return <FileCode2 className="w-4 h-4 text-yellow-400" />;
    case 'typescript': return <FileCode2 className="w-4 h-4 text-blue-400" />;
    case 'python': return <FileType className="w-4 h-4 text-green-400" />;
    case 'java': return <Code2 className="w-4 h-4 text-red-400" />;
    case 'cpp': return <Code2 className="w-4 h-4 text-indigo-400" />;
    case 'css': return <Globe className="w-4 h-4 text-cyan-400" />;
    case 'html': return <Code2 className="w-4 h-4 text-orange-400" />;
    case 'json': return <FileJson className="w-4 h-4 text-yellow-200" />;
    default: return <FileCode2 className="w-4 h-4 text-gray-400" />;
  }
};

export const Sidebar: React.FC<SidebarProps> = ({ 
  files, 
  activeFileId, 
  onSelectFile, 
  onAddFile, 
  onDeleteFile,
  gitState,
  onGitInit,
  onGitStage,
  onGitUnstage,
  onGitCommit,
  onGitPush,
  onGitPull,
  onGitRemoteAdd
}) => {
  const [activeTab, setActiveTab] = useState<'files' | 'git'>('files');

  return (
    <div className="flex h-full border-r border-zinc-900 bg-black shrink-0">
      
      {/* Activity Bar (Icon Strip) */}
      <div className="w-12 flex flex-col items-center py-4 gap-4 border-r border-zinc-900 bg-zinc-950">
         <button 
           onClick={() => setActiveTab('files')}
           className={`p-2.5 rounded-lg transition-all ${
             activeTab === 'files' ? 'text-white bg-indigo-600' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'
           }`}
           title="File Explorer"
         >
           <Files className="w-5 h-5" />
         </button>
         <button 
           onClick={() => setActiveTab('git')}
           className={`p-2.5 rounded-lg transition-all relative ${
             activeTab === 'git' ? 'text-white bg-indigo-600' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'
           }`}
           title="Source Control"
         >
           <GitGraph className="w-5 h-5" />
           {gitState.isInitialized && gitState.stagedFiles.length > 0 && (
             <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-blue-400 rounded-full border-2 border-zinc-950"></span>
           )}
         </button>
      </div>

      {/* Panel Content */}
      <div className="w-64 flex flex-col h-full bg-black">
        
        {activeTab === 'files' ? (
          <>
            <div className="px-4 py-3 border-b border-zinc-900/50 flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Workspace</span>
              <button onClick={onAddFile} className="p-1 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded transition-colors" title="Add File">
                  <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-0.5">
                {files.map((file) => (
                  <div
                    key={file.id}
                    onClick={() => onSelectFile(file.id)}
                    className={`group flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition-all duration-200 border-l-2 ${
                      file.id === activeFileId
                        ? 'bg-zinc-800/50 text-white border-indigo-500'
                        : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      {getIconForLanguage(file.language)}
                      <span className="text-xs truncate font-medium font-mono">{file.name}</span>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); onDeleteFile(file.id); }}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/10 hover:text-red-400 rounded transition-all"
                      title="Delete File"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {files.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-8 text-zinc-600 gap-2 border border-dashed border-zinc-900 rounded-lg mx-2 bg-zinc-900/20">
                      <FileCode2 className="w-6 h-6 opacity-20" />
                      <span className="text-xs italic">No open files</span>
                  </div>
                )}
            </div>
          </>
        ) : (
          <GitPanel 
             files={files}
             gitState={gitState}
             onInit={onGitInit}
             onStage={onGitStage}
             onUnstage={onGitUnstage}
             onCommit={onGitCommit}
             onPush={onGitPush}
             onPull={onGitPull}
             onRemoteAdd={onGitRemoteAdd}
          />
        )}
      </div>
    </div>
  );
};
