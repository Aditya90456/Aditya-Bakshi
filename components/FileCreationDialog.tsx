import React, { useState, useEffect } from 'react';
import { X, FileCode2, FileType, Code2, Globe, FileJson, Coffee, Braces, Terminal, Check } from 'lucide-react';
import { Language } from '../types';

interface FileCreationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, language: Language) => void;
  initialLanguage?: Language;
}

const languages: { id: Language; name: string; icon: React.ReactNode; color: string }[] = [
  { id: 'javascript', name: 'JavaScript', icon: <FileCode2 className="w-5 h-5" />, color: 'text-yellow-400' },
  { id: 'typescript', name: 'TypeScript', icon: <FileCode2 className="w-5 h-5" />, color: 'text-blue-400' },
  { id: 'python', name: 'Python', icon: <FileType className="w-5 h-5" />, color: 'text-green-400' },
  { id: 'java', name: 'Java', icon: <Coffee className="w-5 h-5" />, color: 'text-red-400' },
  { id: 'cpp', name: 'C++', icon: <Braces className="w-5 h-5" />, color: 'text-indigo-400' },
  { id: 'html', name: 'HTML', icon: <Code2 className="w-5 h-5" />, color: 'text-orange-400' },
  { id: 'css', name: 'CSS', icon: <Globe className="w-5 h-5" />, color: 'text-cyan-400' },
  { id: 'json', name: 'JSON', icon: <FileJson className="w-5 h-5" />, color: 'text-purple-400' },
];

export const FileCreationDialog: React.FC<FileCreationDialogProps> = ({ isOpen, onClose, onCreate, initialLanguage }) => {
  const [fileName, setFileName] = useState('');
  const [selectedLang, setSelectedLang] = useState<Language>('javascript');
  const [error, setError] = useState('');

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setFileName('');
      setSelectedLang(initialLanguage || 'javascript');
      setError('');
    }
  }, [isOpen, initialLanguage]);

  const handleCreate = () => {
    if (!fileName.trim()) {
      setError('Filename cannot be empty');
      return;
    }
    // Basic validation
    if (!/^[a-zA-Z0-9_.-]+$/.test(fileName)) {
        setError('Invalid characters in filename');
        return;
    }

    onCreate(fileName, selectedLang);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden scale-100 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-900 bg-zinc-900/50">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Terminal className="w-5 h-5 text-indigo-500" />
            Create New File
          </h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Filename Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">Filename (without extension)</label>
            <input
              type="text"
              value={fileName}
              onChange={(e) => {
                  setFileName(e.target.value);
                  setError('');
              }}
              placeholder="e.g., main, script, algorithm"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            />
            {error && <p className="text-xs text-red-400">{error}</p>}
          </div>

          {/* Language Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">Select Language</label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
              {languages.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => setSelectedLang(lang.id)}
                  className={`flex items-center gap-3 p-3 rounded-lg border text-sm font-medium transition-all ${
                    selectedLang === lang.id
                      ? 'bg-indigo-600/10 border-indigo-500 text-white shadow-sm'
                      : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                  }`}
                >
                  <div className={lang.color}>{lang.icon}</div>
                  <span>{lang.name}</span>
                  {selectedLang === lang.id && <Check className="w-4 h-4 text-indigo-400 ml-auto" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-zinc-900/50 border-t border-zinc-900 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-lg shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
          >
            Create File
          </button>
        </div>
      </div>
    </div>
  );
};