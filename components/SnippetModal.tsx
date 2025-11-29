import React, { useState, useEffect, useMemo } from 'react';
import { X, Search, Code2, Copy, Check } from 'lucide-react';
import { Language } from '../types';

interface Snippet {
  label: string;
  description: string;
  code: string;
}

const SNIPPETS: Record<string, Snippet[]> = {
  javascript: [
    { label: 'Console Log', description: 'Print to console', code: 'console.log($1);' },
    { label: 'For Loop', description: 'Standard for loop', code: 'for (let i = 0; i < length; i++) {\n  \n}' },
    { label: 'Arrow Function', description: 'ES6 Arrow Function', code: 'const name = (params) => {\n  \n};' },
    { label: 'Fetch API', description: 'Make a network request', code: 'fetch("url")\n  .then(res => res.json())\n  .then(data => console.log(data));' },
    { label: 'setTimeout', description: 'Delay execution', code: 'setTimeout(() => {\n  \n}, 1000);' },
    { label: 'Promise', description: 'Create a new Promise', code: 'new Promise((resolve, reject) => {\n  \n});' },
  ],
  typescript: [
    { label: 'Interface', description: 'Define an interface', code: 'interface Name {\n  key: type;\n}' },
    { label: 'Type Alias', description: 'Define a type', code: 'type Name = {\n  key: type;\n};' },
    { label: 'Generics Function', description: 'Function with generics', code: 'function identity<T>(arg: T): T {\n  return arg;\n}' },
    { label: 'Enum', description: 'Define an enum', code: 'enum Color {\n  Red,\n  Green,\n  Blue\n}' },
  ],
  python: [
    { label: 'Print', description: 'Print to standard output', code: 'print("Hello World")' },
    { label: 'Function', description: 'Define a function', code: 'def function_name(args):\n    pass' },
    { label: 'List Comprehension', description: 'Create list concisely', code: '[x for x in iterable if condition]' },
    { label: 'Class', description: 'Define a class', code: 'class ClassName:\n    def __init__(self, arg):\n        self.arg = arg' },
    { label: 'If Name == Main', description: 'Script execution check', code: 'if __name__ == "__main__":\n    main()' },
  ],
  java: [
    { label: 'Main Method', description: 'Public static void main', code: 'public static void main(String[] args) {\n    \n}' },
    { label: 'System.out.println', description: 'Print to console', code: 'System.out.println();' },
    { label: 'Class', description: 'Define a class', code: 'public class ClassName {\n    \n}' },
    { label: 'For Loop', description: 'Standard for loop', code: 'for (int i = 0; i < limit; i++) {\n    \n}' },
  ],
  cpp: [
    { label: 'Main Function', description: 'Entry point', code: 'int main() {\n    return 0;\n}' },
    { label: 'Cout', description: 'Print to console', code: 'std::cout << "Hello" << std::endl;' },
    { label: 'Include Vector', description: 'Include vector library', code: '#include <vector>' },
    { label: 'Class', description: 'Define a class', code: 'class ClassName {\npublic:\n    ClassName();\n};' },
  ],
  html: [
    { label: 'Boilerplate', description: 'HTML5 Boilerplate', code: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>Document</title>\n</head>\n<body>\n  \n</body>\n</html>' },
    { label: 'Div with Class', description: 'Div element', code: '<div class="classname">\n  \n</div>' },
    { label: 'Script Tag', description: 'Import JS', code: '<script src="script.js"></script>' },
    { label: 'Link CSS', description: 'Import CSS', code: '<link rel="stylesheet" href="style.css">' },
  ],
  css: [
    { label: 'Flexbox Center', description: 'Center content', code: 'display: flex;\njustify-content: center;\nalign-items: center;' },
    { label: 'Media Query', description: 'Responsive design', code: '@media (max-width: 768px) {\n  \n}' },
    { label: 'Grid', description: 'CSS Grid', code: 'display: grid;\ngrid-template-columns: repeat(3, 1fr);\ngap: 10px;' },
  ]
};

interface SnippetModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onInsert: (code: string) => void;
}

export const SnippetModal: React.FC<SnippetModalProps> = ({ isOpen, onClose, language, onInsert }) => {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const snippets = useMemo(() => {
    // Fallback to JS if specific language snippets missing, or empty array
    const langSnippets = SNIPPETS[language] || [];
    if (!search.trim()) return langSnippets;
    return langSnippets.filter(s => 
      s.label.toLowerCase().includes(search.toLowerCase()) || 
      s.description.toLowerCase().includes(search.toLowerCase())
    );
  }, [language, search]);

  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      setSelectedIndex(prev => (prev + 1) % snippets.length);
    } else if (e.key === 'ArrowUp') {
      setSelectedIndex(prev => (prev - 1 + snippets.length) % snippets.length);
    } else if (e.key === 'Enter') {
      if (snippets[selectedIndex]) {
        onInsert(snippets[selectedIndex].code);
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-32 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl overflow-hidden flex flex-col"
        onKeyDown={handleKeyDown}
      >
        {/* Search Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
          <Search className="w-5 h-5 text-zinc-500" />
          <input 
            autoFocus
            type="text" 
            placeholder={`Search ${language} snippets...`}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setSelectedIndex(0); }}
            className="flex-1 bg-transparent text-white placeholder-zinc-500 focus:outline-none text-sm font-medium h-full"
          />
          <div className="flex gap-2">
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded bg-zinc-800 border border-zinc-700 text-[10px] font-mono text-zinc-400">
              ↑↓
            </kbd>
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded bg-zinc-800 border border-zinc-700 text-[10px] font-mono text-zinc-400">
              ↵
            </kbd>
            <button onClick={onClose} className="text-zinc-500 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Snippet List */}
        <div className="max-h-[400px] overflow-y-auto custom-scrollbar p-2 space-y-1">
          {snippets.length === 0 ? (
            <div className="p-8 text-center text-zinc-500 text-sm">
              No snippets found for "{search}"
            </div>
          ) : (
            snippets.map((snippet, index) => (
              <button
                key={index}
                onClick={() => { onInsert(snippet.code); onClose(); }}
                className={`w-full flex items-start text-left gap-3 p-3 rounded-lg transition-all ${
                  index === selectedIndex 
                    ? 'bg-indigo-600/10 border border-indigo-500/50' 
                    : 'hover:bg-zinc-800 border border-transparent'
                }`}
              >
                <div className={`p-2 rounded-md ${index === selectedIndex ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
                  <Code2 className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className={`text-sm font-bold ${index === selectedIndex ? 'text-indigo-400' : 'text-zinc-200'}`}>
                      {snippet.label}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 truncate mb-2">{snippet.description}</p>
                  <pre className="font-mono text-[10px] bg-black/30 p-2 rounded text-zinc-400 overflow-hidden text-ellipsis whitespace-nowrap opacity-70">
                    {snippet.code}
                  </pre>
                </div>
                {index === selectedIndex && <Check className="w-4 h-4 text-indigo-400 mt-1" />}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
