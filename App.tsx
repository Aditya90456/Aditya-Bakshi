
import React, { useState, useRef, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { Editor, EditorHandle } from './components/Editor';
import { AIChat } from './components/AIChat';
import { OutputPanel } from './components/OutputPanel';
import { DSARoadmap } from './components/DSARoadmap';
import { ProblemPanel } from './components/ProblemPanel';
import { FileCreationDialog } from './components/FileCreationDialog';
import { SnippetModal } from './components/SnippetModal';
import { Home } from './components/Home';
import { AuthModal } from './components/AuthModal';
import { ToastContainer, ToastMessage } from './components/Toast';
import { FileData, Language, LogEntry, UserProfile, DSATopic, GitState, Commit } from './types';
import { simulateCodeExecution, analyzeCodeDryRun, generateUnitTests } from './services/geminiService';
import { db } from './services/db';
import { Play, Bug, Sparkles, FileText, FlaskConical, ChevronDown, Zap, BrainCircuit, Cloud } from 'lucide-react';

const INITIAL_FILES: FileData[] = [
  {
    id: '1',
    name: 'script.js',
    language: 'javascript',
    content: `console.log("Welcome to Codex Playground!");\n\n// Select a problem from the Roadmap to start coding.`
  }
];

const INITIAL_GIT_STATE: GitState = {
  isInitialized: false,
  remoteUrl: null,
  currentBranch: 'main',
  commits: [],
  stagedFiles: [],
  lastCommittedContent: {}
};

const getStarterCode = (lang: Language): string => {
  switch (lang) {
    case 'javascript': return `// JavaScript Solution\n\nconsole.log("Hello Codex!");`;
    case 'typescript': return `// TypeScript Solution\n\nconst greeting: string = "Hello Codex!";\nconsole.log(greeting);`;
    case 'python': return `# Python Solution\n\nprint("Hello Codex!")`;
    case 'java': return `// Java Solution\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello Codex!");\n    }\n}`;
    case 'cpp': return `// C++ Solution\n#include <iostream>\n\nint main() {\n    std::cout << "Hello Codex!" << std::endl;\n    return 0;\n}`;
    case 'html': return `<!-- HTML Preview -->\n<!DOCTYPE html>\n<html lang="en">\n<head>\n    <style>body { font-family: sans-serif; padding: 20px; }</style>\n</head>\n<body>\n    <h1>Hello World</h1>\n</body>\n</html>`;
    case 'css': return `/* CSS Styles */\nbody {\n    background: #000;\n    color: #fff;\n}`;
    case 'json': return `{\n  "name": "codex-project"\n}`;
    case 'markdown': return `# Project Title\n\nDescription...`;
    default: return '';
  }
};

const getExtension = (lang: Language): string => {
    switch(lang) {
        case 'javascript': return 'js';
        case 'typescript': return 'ts';
        case 'python': return 'py';
        case 'java': return 'java';
        case 'cpp': return 'cpp';
        case 'html': return 'html';
        case 'css': return 'css';
        case 'json': return 'json';
        case 'markdown': return 'md';
        default: return 'txt';
    }
}

const App: React.FC = () => {
  const [files, setFiles] = useState<FileData[]>(INITIAL_FILES);
  const [activeFileId, setActiveFileId] = useState<string | null>(INITIAL_FILES[0].id);
  
  const [viewMode, setViewMode] = useState<'home' | 'editor' | 'dsa'>('home');
  const [activeProblem, setActiveProblem] = useState<DSATopic | null>(null);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSnippetModalOpen, setIsSnippetModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [preSelectedLanguage, setPreSelectedLanguage] = useState<Language | undefined>(undefined);

  const [user, setUser] = useState<UserProfile | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const [gitState, setGitState] = useState<GitState>(INITIAL_GIT_STATE);

  // Load User & Cloud Files
  useEffect(() => {
    const loadUser = async () => {
        try {
            const currentUser = await db.getCurrentUser();
            if (currentUser) {
                setUser(currentUser);
                if (currentUser.files && currentUser.files.length > 0) {
                    setFiles(currentUser.files);
                    setActiveFileId(currentUser.files[0].id);
                }
                if (currentUser.gitState) {
                    setGitState(currentUser.gitState);
                }
            }
        } catch (e) {
            console.error("Failed to load user session");
        }
    };
    loadUser();
  }, []);

  // Auto-Save to Cloud
  useEffect(() => {
      if (!user) return;
      
      const timeoutId = setTimeout(async () => {
          setIsSaving(true);
          try {
              const updatedUser = { ...user, files: files, gitState: gitState };
              const savedUser = await db.syncUser(updatedUser);
              setUser(savedUser);
          } catch (e) {
              console.error("Auto-save failed");
          } finally {
              setIsSaving(false);
          }
      }, 3000); // 3-second debounce

      return () => clearTimeout(timeoutId);
  }, [files, user?.email, gitState]); // Auto-save when files or git state changes

  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiTrigger, setAiTrigger] = useState<{ action: 'debug' | 'explain' | 'test', code: string } | null>(null);
  const [aiPanelWidth, setAiPanelWidth] = useState(400);
  const [isDraggingAi, setIsDraggingAi] = useState(false);
  
  const [isOutputOpen, setIsOutputOpen] = useState(false);
  const [outputLogs, setOutputLogs] = useState<LogEntry[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [outputMode, setOutputMode] = useState<'run' | 'dry-run' | 'preview'>('run');
  const [previewContent, setPreviewContent] = useState<string>('');

  const editorRef = useRef<EditorHandle>(null);
  const activeFile = activeFileId ? files.find(f => f.id === activeFileId) : null;

  const startResizingAi = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDraggingAi(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingAi) return;
      const newWidth = window.innerWidth - e.clientX;
      if (newWidth > 300 && newWidth < 800) {
        setAiPanelWidth(newWidth);
      }
    };
    const handleMouseUp = () => setIsDraggingAi(false);
    if (isDraggingAi) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDraggingAi]);

  // --- TOAST HELPER ---
  const showToast = (message: string, type: ToastMessage['type'] = 'info') => {
      const id = Date.now().toString() + Math.random();
      setToasts(prev => [...prev, { id, message, type }]);
  };

  const dismissToast = (id: string) => {
      setToasts(prev => prev.filter(t => t.id !== id));
  };

  // --- HANDLERS ---
  const handleLogin = async (userData: UserProfile) => {
      setUser(userData);
      showToast(`Welcome back, ${userData.name}!`, 'success');
      // Sync Cloud Files if available
      if (userData.files && userData.files.length > 0) {
          setFiles(userData.files);
          setActiveFileId(userData.files[0].id);
      }
      if (userData.gitState) {
          setGitState(userData.gitState);
          showToast('Git state restored', 'info');
      }
  };

  const handleLogout = async () => {
      await db.logout();
      setUser(null);
      setViewMode('home');
      setFiles(INITIAL_FILES);
      setGitState(INITIAL_GIT_STATE);
      setActiveFileId(INITIAL_FILES[0].id);
      showToast('Signed out successfully', 'info');
  };

  const handleCompleteTopic = async (topicId: string, points: number) => {
      if (!user) {
          setIsAuthModalOpen(true);
          showToast('Please sign in to track progress', 'loading');
          return;
      }
      if (!user.email) return;

      try {
        const updatedUser = { ...user };
        updatedUser.points += points;
        if (!updatedUser.completedTopics.includes(topicId)) {
            updatedUser.completedTopics.push(topicId);
        }
        
        const saved = await db.syncUser(updatedUser);
        setUser(saved);
        showToast(`Topic Completed! +${points} XP`, 'success');
      } catch (e) {
        showToast('Failed to save progress', 'error');
      }
  };

  const handleFileChange = (newContent: string) => {
    if (!activeFileId) return;
    setFiles(files.map(f => f.id === activeFileId ? { ...f, content: newContent } : f));
  };

  const handleOpenCreateModal = (lang?: Language) => {
      setPreSelectedLanguage(lang);
      setIsCreateModalOpen(true);
  };

  const handleConfirmCreateFile = (name: string, language: Language) => {
      const newId = Date.now().toString();
      const ext = getExtension(language);
      const fullFileName = name.endsWith(`.${ext}`) ? name : `${name}.${ext}`;
      
      const newFile: FileData = {
          id: newId,
          name: fullFileName,
          language: language,
          content: getStarterCode(language)
      };

      setFiles([...files, newFile]);
      setActiveFileId(newId);
      setViewMode('editor');
      setActiveProblem(null);
      showToast(`Created ${fullFileName}`, 'success');
  };

  const handleSolveProblem = (topic: DSATopic) => {
    const newId = Date.now().toString();
    const ext = getExtension(topic.starterCode.language);
    const fileName = (topic.starterCode.language === 'java') ? 'Main.java' : `solution.${ext}`;

    const newFile: FileData = {
        id: newId,
        name: fileName,
        language: topic.starterCode.language,
        content: topic.starterCode.code
    };
    setFiles([...files, newFile]);
    setActiveFileId(newId);
    setActiveProblem(topic);
    setViewMode('editor'); 
  };

  const handleCloseProblem = () => setActiveProblem(null);

  const handleDeleteFile = (id: string) => {
    const newFiles = files.filter(f => f.id !== id);
    setFiles(newFiles);
    if (activeFileId === id) {
       setActiveFileId(newFiles.length > 0 ? newFiles[0].id : null);
    }
  };

  const handleLanguageSwitch = (newLang: Language) => {
      if (!activeFile) return;
      const ext = getExtension(newLang);
      const baseName = activeFile.name.includes('.') ? activeFile.name.split('.')[0] : activeFile.name;
      const newName = (newLang === 'java') ? 'Main.java' : `${baseName}.${ext}`;
      const newContent = getStarterCode(newLang);

      setFiles(files.map(f => f.id === activeFile.id ? {
          ...f,
          language: newLang,
          name: newName,
          content: newContent
      } : f));
      showToast(`Switched to ${newLang}`, 'info');
  };

  const addLog = (type: LogEntry['type'], message: string) => {
    // If it's a success or error log, show a toast as well
    if (type === 'success') showToast(message, 'success');
    if (type === 'error') showToast(message, 'error');

    setOutputLogs(prev => [...prev, {
      id: Date.now().toString() + Math.random(),
      type,
      message,
      timestamp: Date.now()
    }]);
  };

  const handleGitInit = () => {
    setGitState(prev => ({ ...prev, isInitialized: true, lastCommittedContent: {} }));
    addLog('system', 'Git repository initialized.');
    showToast('Repository initialized', 'success');
  };

  const handleGitStage = (fileId: string) => {
    setGitState(prev => {
        if (prev.stagedFiles.includes(fileId)) return prev;
        return { ...prev, stagedFiles: [...prev.stagedFiles, fileId] };
    });
  };

  const handleGitUnstage = (fileId: string) => {
    setGitState(prev => ({ ...prev, stagedFiles: prev.stagedFiles.filter(id => id !== fileId) }));
  };

  const handleGitCommit = (message: string) => {
    if (gitState.stagedFiles.length === 0) return;
    if (!user) {
        setIsAuthModalOpen(true);
        showToast('Sign in to commit', 'loading');
        return;
    }

    const newCommittedContent = { ...gitState.lastCommittedContent };
    gitState.stagedFiles.forEach(stagedId => {
        const file = files.find(f => f.id === stagedId);
        if (file) newCommittedContent[stagedId] = file.content;
    });

    const newCommit: Commit = {
        id: Math.random().toString(16).slice(2, 9),
        message,
        author: user.name,
        timestamp: Date.now(),
        changesCount: gitState.stagedFiles.length
    };

    setGitState(prev => ({
        ...prev,
        commits: [...prev.commits, newCommit],
        stagedFiles: [],
        lastCommittedContent: newCommittedContent
    }));
    addLog('success', `Committed: ${message}`);
  };

  const handleGitPush = async () => {
    if (!user) { setIsAuthModalOpen(true); return; }
    
    // Check remote configuration strictly
    if (!gitState.remoteUrl) { 
        showToast('Push Failed: No remote configured', 'error'); 
        addLog('error', 'Please add a Remote Origin (e.g., user/repo) in the Git Panel before pushing.');
        return; 
    }
    
    setIsSaving(true);
    showToast('Pushing to remote...', 'loading');
    
    try {
        const updatedUser = { 
            ...user, 
            files: files,
            gitState: gitState
        };
        const savedUser = await db.syncUser(updatedUser);
        setUser(savedUser);
        
        // Sim delay for effect
        await new Promise(resolve => setTimeout(resolve, 1000));
        addLog('success', `Pushed to ${gitState.currentBranch} at ${gitState.remoteUrl}`);
    } catch (e: any) {
        const msg = e.message || 'Push failed. Check connection.';
        showToast(msg, 'error');
        addLog('error', `Push failed: ${msg}`);
    } finally {
        setIsSaving(false);
    }
  };

  const handleGitPull = async () => {
      if (!user) { setIsAuthModalOpen(true); return; }
      if (!gitState.remoteUrl) { 
          showToast('Pull Failed: No remote configured', 'error'); 
          addLog('error', 'Please add a Remote Origin first.');
          return; 
      }
      
      setIsSaving(true);
      showToast('Pulling from remote...', 'loading');
      
      try {
          // Re-fetch user to get latest state
          const latestUser = await db.login(user.email!);
          if (latestUser && latestUser.gitState) {
              setGitState(latestUser.gitState);
              if (latestUser.files) setFiles(latestUser.files);
              
              addLog('info', 'Successfully pulled latest changes.');
              showToast('Pull successful', 'success');
          } else {
              addLog('info', 'Already up to date.');
          }
      } catch (e) {
          showToast('Pull failed', 'error');
      } finally {
          setIsSaving(false);
      }
  };

  const handleGitRemoteAdd = (url: string) => {
      setGitState(prev => ({ ...prev, remoteUrl: url }));
      addLog('system', `Remote origin set to ${url}`);
      showToast('Remote origin updated', 'success');
  };

  const handleRun = async () => {
    if (!activeFile) return;
    setIsOutputOpen(true);
    setOutputLogs([]);
    setIsRunning(true);
    
    if (activeFile.language === 'html') {
      setOutputMode('preview');
      setPreviewContent(activeFile.content);
      setIsRunning(false);
      return;
    }
    setOutputMode('run');
    if (activeFile.language === 'javascript') {
      addLog('system', 'Starting execution...');
      const originalLog = console.log;
      const originalError = console.error;
      const originalWarn = console.warn;
      
      try {
        console.log = (...args) => addLog('info', args.join(' '));
        console.error = (...args) => addLog('error', args.join(' '));
        console.warn = (...args) => addLog('warn', args.join(' '));
        // eslint-disable-next-line no-new-func
        new Function(activeFile.content)();
        addLog('success', 'Execution finished.');
      } catch (err: any) {
        addLog('error', `Runtime Error: ${err.message}`);
      } finally {
        console.log = originalLog;
        console.error = originalError;
        console.warn = originalWarn;
        setIsRunning(false);
      }
    } else {
      addLog('system', `Compiling and executing ${activeFile.language} via Codex Engine...`);
      try {
        const output = await simulateCodeExecution(activeFile.content, activeFile.language);
        addLog('info', output);
        addLog('success', 'Process finished.');
      } catch (e) {
        addLog('error', 'Failed to execute code.');
      } finally {
        setIsRunning(false);
      }
    }
  };

  const handleDryRun = async () => {
    if (!activeFile) return;
    setIsOutputOpen(true);
    setOutputLogs([]);
    setOutputMode('dry-run');
    setIsRunning(true);
    try {
      const analysis = await analyzeCodeDryRun(activeFile.content, activeFile.language);
      addLog('info', analysis);
    } catch (error) {
       addLog('error', 'Dry run failed.');
    } finally {
      setIsRunning(false);
    }
  };

  const handleGenerateTests = async () => {
    if (!activeFile) return;
    setIsRunning(true);
    showToast('Generating tests...', 'loading');
    addLog('system', `Generating unit tests...`);
    
    try {
        const testCode = await generateUnitTests(activeFile.content, activeFile.language, activeFile.name);
        let testFilename = activeFile.name.replace(/\.[^/.]+$/, "");
        if (activeFile.language === 'python') testFilename = `test_${testFilename}.py`;
        else if (activeFile.language === 'java') testFilename = `${testFilename}Test.java`;
        else testFilename = `${testFilename}.test.${getExtension(activeFile.language)}`;
        const newId = Date.now().toString();
        const newFile: FileData = { id: newId, name: testFilename, language: activeFile.language, content: testCode };
        setFiles([...files, newFile]);
        setActiveFileId(newId);
        addLog('success', `Test file created: ${testFilename}`);
    } catch (error) {
        addLog('error', 'Failed to generate tests.');
    } finally {
        setIsRunning(false);
    }
  };

  const handleEditorAIAction = (action: 'debug' | 'explain' | 'test', code: string) => {
    if (action === 'test' && activeFile && code === activeFile.content) {
      handleGenerateTests();
      return;
    }
    setAiTrigger({ action, code });
    setIsAiOpen(true);
  };

  const handleSnippetInsert = (code: string) => {
    if (editorRef.current) {
      editorRef.current.insertText(code);
      showToast('Snippet inserted', 'success');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-codex-bg text-zinc-100 overflow-hidden font-sans">
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      <FileCreationDialog 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleConfirmCreateFile}
        initialLanguage={preSelectedLanguage}
      />

      <SnippetModal 
        isOpen={isSnippetModalOpen}
        onClose={() => setIsSnippetModalOpen(false)}
        language={activeFile?.language || 'javascript'}
        onInsert={handleSnippetInsert}
      />

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
      />

      <Navbar 
        activeView={viewMode}
        onNavigate={(mode) => { setViewMode(mode); setActiveProblem(null); }}
        user={user}
        onAddFile={() => handleOpenCreateModal()}
        onLogin={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex overflow-hidden">
        
        {viewMode === 'editor' && !activeProblem && (
             <Sidebar
                files={files}
                activeFileId={activeFileId}
                onSelectFile={(id) => setActiveFileId(id)}
                onAddFile={() => handleOpenCreateModal()}
                onDeleteFile={handleDeleteFile}
                gitState={gitState}
                onGitInit={handleGitInit}
                onGitStage={handleGitStage}
                onGitUnstage={handleGitUnstage}
                onGitCommit={handleGitCommit}
                onGitPush={handleGitPush}
                onGitPull={handleGitPull}
                onGitRemoteAdd={handleGitRemoteAdd}
            />
        )}

        <div className="flex-1 flex flex-col relative min-w-0 bg-codex-bg">

            {viewMode === 'home' && (
              <Home 
                onNavigate={(mode) => setViewMode(mode)} 
                onOpenCreate={handleOpenCreateModal}
                user={user}
                files={files}
                onSelectFile={(id) => { setActiveFileId(id); setViewMode('editor'); }}
              />
            )}

            {viewMode === 'dsa' && (
                <DSARoadmap 
                    onSolveProblem={handleSolveProblem} 
                    completedTopicIds={user?.completedTopics || []}
                    onCompleteTopic={handleCompleteTopic}
                />
            )}

            {viewMode === 'editor' && (
                activeFile ? (
                    <div className="flex flex-1 overflow-hidden">
                        {activeProblem && (
                            <ProblemPanel 
                                problem={activeProblem} 
                                onClose={handleCloseProblem}
                                isCompleted={user?.completedTopics.includes(activeProblem.id) || false}
                                onComplete={() => handleCompleteTopic(activeProblem.id, activeProblem.points)}
                            />
                        )}

                        <div className="flex-1 flex flex-col min-w-0 relative border-l border-zinc-800/50">
                            <div className="h-14 bg-codex-bg border-b border-zinc-800 flex items-center justify-between px-6 shrink-0 z-20">
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="relative group">
                                        <select 
                                            value={activeFile.language}
                                            onChange={(e) => handleLanguageSwitch(e.target.value as Language)}
                                            className="appearance-none bg-zinc-900 border border-zinc-800 text-zinc-200 pl-3 pr-8 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide cursor-pointer hover:border-zinc-700 focus:outline-none focus:border-indigo-500 transition-colors"
                                        >
                                            <option value="javascript">JavaScript</option>
                                            <option value="python">Python</option>
                                            <option value="java">Java</option>
                                            <option value="cpp">C++</option>
                                            <option value="typescript">TypeScript</option>
                                            <option value="html">HTML</option>
                                        </select>
                                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 pointer-events-none" />
                                    </div>
                                    <span className="text-zinc-600">|</span>
                                    <span className="text-zinc-400 font-mono text-xs">{activeFile.name}</span>
                                    {isSaving && <span className="text-xs text-zinc-500 flex items-center gap-1 animate-pulse"><Cloud className="w-3 h-3" /> Saving...</span>}
                                </div>
                            
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleRun}
                                        disabled={isRunning}
                                        className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-all text-xs font-bold uppercase tracking-wide shadow-lg shadow-emerald-900/20 disabled:opacity-50"
                                    >
                                        <Play className="w-3.5 h-3.5 fill-current" />
                                        Run
                                    </button>
                                    
                                    <button onClick={handleDryRun} disabled={isRunning} className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-purple-400 transition-all group" title="Dry Run Analysis">
                                        <BrainCircuit className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                    </button>

                                    <button onClick={handleGenerateTests} disabled={isRunning} className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white transition-all" title="Generate Tests">
                                        <FlaskConical className="w-4 h-4" />
                                    </button>

                                    <button onClick={() => setIsSnippetModalOpen(true)} className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-yellow-400 transition-all" title="Insert Snippet">
                                        <Zap className="w-4 h-4" />
                                    </button>

                                    <div className="w-px h-5 bg-zinc-800 mx-1"></div>

                                    <button
                                        onClick={() => setIsAiOpen(!isAiOpen)}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all border ${
                                        isAiOpen ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                                        }`}
                                    >
                                        <Sparkles className="w-3.5 h-3.5" />
                                        AI
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 relative flex flex-col min-h-0 bg-codex-bg">
                                <div className="flex-1 relative flex flex-row min-h-0">
                                    <div className="flex-1 min-w-0 relative h-full">
                                        <Editor
                                            ref={editorRef}
                                            file={activeFile}
                                            onChange={handleFileChange}
                                            onAIAction={handleEditorAIAction}
                                        />
                                    </div>
                                    {isAiOpen && (
                                        <>
                                            <div 
                                                className="w-1 bg-zinc-800 hover:bg-indigo-600 cursor-col-resize transition-colors z-50 shrink-0"
                                                onMouseDown={startResizingAi}
                                            />
                                            <div style={{ width: aiPanelWidth }} className="h-full shrink-0 relative z-20">
                                                <AIChat 
                                                    isOpen={isAiOpen} 
                                                    onClose={() => setIsAiOpen(false)}
                                                    activeFile={activeFile}
                                                    aiTrigger={aiTrigger}
                                                    onActionHandled={() => setAiTrigger(null)}
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>
                                <OutputPanel 
                                    isOpen={isOutputOpen}
                                    onClose={() => setIsOutputOpen(false)}
                                    logs={outputLogs}
                                    isRunning={isRunning}
                                    mode={outputMode}
                                    previewContent={previewContent}
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 gap-4">
                        <FileText className="w-16 h-16 opacity-20" />
                        <p>No file selected</p>
                        <button onClick={() => handleOpenCreateModal()} className="text-indigo-400 hover:underline">Create File</button>
                    </div>
                )
            )}
        </div>
      </div>
    </div>
  );
};

export default App;
