import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { Editor } from './components/Editor';
import { AIChat } from './components/AIChat';
import { OutputPanel } from './components/OutputPanel';
import { DSARoadmap } from './components/DSARoadmap';
import { ProblemPanel } from './components/ProblemPanel';
import { FileCreationDialog } from './components/FileCreationDialog';
import { Home } from './components/Home';
import { FileData, Language, LogEntry, UserProfile, DSATopic } from './types';
import { simulateCodeExecution, analyzeCodeDryRun, generateUnitTests } from './services/geminiService';
import { Play, Bug, Sparkles, FileText, FlaskConical, ChevronDown } from 'lucide-react';

const INITIAL_FILES: FileData[] = [
  {
    id: '1',
    name: 'script.js',
    language: 'javascript',
    content: `console.log("Welcome to Codex Playground!");\n\n// Select a problem from the Roadmap to start coding.`
  }
];

const INITIAL_USER: UserProfile = {
    name: 'Dev User',
    level: 'Novice',
    points: 0,
    completedTopics: []
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
  
  // Default view is 'home' now
  const [viewMode, setViewMode] = useState<'home' | 'editor' | 'dsa'>('home');
  const [activeProblem, setActiveProblem] = useState<DSATopic | null>(null);
  
  // Dialog State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [preSelectedLanguage, setPreSelectedLanguage] = useState<Language | undefined>(undefined);

  // User & Gamification State
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);

  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiTrigger, setAiTrigger] = useState<{ action: 'debug' | 'explain' | 'test', code: string } | null>(null);
  
  // Output Panel State
  const [isOutputOpen, setIsOutputOpen] = useState(false);
  const [outputLogs, setOutputLogs] = useState<LogEntry[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [outputMode, setOutputMode] = useState<'run' | 'dry-run' | 'preview'>('run');
  const [previewContent, setPreviewContent] = useState<string>('');

  const activeFile = activeFileId ? files.find(f => f.id === activeFileId) : null;

  const calculateLevel = (points: number): string => {
      if (points < 100) return 'Novice';
      if (points < 300) return 'Apprentice';
      if (points < 800) return 'Coder';
      if (points < 1500) return 'Engineer';
      return 'Architect';
  }

  const handleCompleteTopic = (topicId: string, points: number) => {
      if (user.completedTopics.includes(topicId)) return;
      
      const newPoints = user.points + points;
      setUser({
          ...user,
          points: newPoints,
          completedTopics: [...user.completedTopics, topicId],
          level: calculateLevel(newPoints)
      });
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
  };

  const handleSolveProblem = (topic: DSATopic) => {
    const newId = Date.now().toString();
    const ext = getExtension(topic.starterCode.language);
    const sanitizedTitle = topic.title.replace(/\s+/g, '-').toLowerCase().replace(/[^a-z0-9-]/g, '');
    const fileName = (topic.starterCode.language === 'java') ? 'Main.java' : `${sanitizedTitle}.${ext}`;

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

  const handleCloseProblem = () => {
      setActiveProblem(null);
  }

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
  };

  const addLog = (type: LogEntry['type'], message: string) => {
    setOutputLogs(prev => [...prev, {
      id: Date.now().toString() + Math.random(),
      type,
      message,
      timestamp: Date.now()
    }]);
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
    addLog('system', 'Performing static analysis...');

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
    addLog('system', `Generating unit tests...`);
    setIsOutputOpen(true);

    try {
        const testCode = await generateUnitTests(activeFile.content, activeFile.language, activeFile.name);
        let testFilename = activeFile.name.replace(/\.[^/.]+$/, "");
        if (activeFile.language === 'python') testFilename = `test_${testFilename}.py`;
        else if (activeFile.language === 'java') testFilename = `${testFilename}Test.java`;
        else testFilename = `${testFilename}.test.${getExtension(activeFile.language)}`;

        const newId = Date.now().toString();
        const newFile: FileData = {
            id: newId,
            name: testFilename,
            language: activeFile.language,
            content: testCode
        };

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

  return (
    <div className="flex flex-col h-screen bg-codex-bg text-zinc-100 overflow-hidden font-sans">
      <FileCreationDialog 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleConfirmCreateFile}
        initialLanguage={preSelectedLanguage}
      />

      <Navbar 
        activeView={viewMode}
        onNavigate={(mode) => { setViewMode(mode); setActiveProblem(null); }}
        user={user}
        onAddFile={() => handleOpenCreateModal()}
      />

      <div className="flex-1 flex overflow-hidden">
        
        {viewMode === 'editor' && !activeProblem && (
             <Sidebar
                files={files}
                activeFileId={activeFileId}
                onSelectFile={(id) => setActiveFileId(id)}
                onAddFile={() => handleOpenCreateModal()}
                onDeleteFile={handleDeleteFile}
            />
        )}

        <div className="flex-1 flex flex-col relative min-w-0 bg-codex-bg">

            {viewMode === 'home' && (
              <Home 
                onNavigate={(mode) => setViewMode(mode)} 
                onOpenCreate={handleOpenCreateModal}
              />
            )}

            {viewMode === 'dsa' && (
                <DSARoadmap 
                    onSolveProblem={handleSolveProblem} 
                    completedTopicIds={user.completedTopics}
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
                                isCompleted={user.completedTopics.includes(activeProblem.id)}
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
                                    
                                    <button
                                        onClick={handleDryRun}
                                        disabled={isRunning}
                                        className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white transition-all"
                                        title="Dry Run Analysis"
                                    >
                                        <Bug className="w-4 h-4" />
                                    </button>

                                    <button
                                        onClick={handleGenerateTests}
                                        disabled={isRunning}
                                        className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white transition-all"
                                        title="Generate Tests"
                                    >
                                        <FlaskConical className="w-4 h-4" />
                                    </button>

                                    <div className="w-px h-5 bg-zinc-800 mx-1"></div>

                                    <button
                                        onClick={() => setIsAiOpen(!isAiOpen)}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all border ${
                                        isAiOpen 
                                            ? 'bg-indigo-600 text-white border-indigo-500' 
                                            : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                                        }`}
                                    >
                                        <Sparkles className="w-3.5 h-3.5" />
                                        AI
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 relative flex flex-col min-h-0 bg-codex-bg">
                                <div className="flex-1 relative min-h-0">
                                    <Editor
                                        file={activeFile}
                                        onChange={handleFileChange}
                                        onAIAction={handleEditorAIAction}
                                    />
                                    <AIChat 
                                        isOpen={isAiOpen} 
                                        onClose={() => setIsAiOpen(false)}
                                        activeFile={activeFile}
                                        aiTrigger={aiTrigger}
                                        onActionHandled={() => setAiTrigger(null)}
                                    />
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