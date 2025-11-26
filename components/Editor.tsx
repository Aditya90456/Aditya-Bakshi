import React, { useEffect, useRef, useState } from 'react';
import { FileData } from '../types';
import { Loader2 } from 'lucide-react';

interface EditorProps {
  file: FileData;
  onChange: (newContent: string) => void;
  onAIAction: (action: 'debug' | 'explain' | 'test', code: string) => void;
}

declare global {
  interface Window {
    require: any;
    monaco: any;
  }
}

export const Editor: React.FC<EditorProps> = ({ file, onChange, onAIAction }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load Monaco Editor
  useEffect(() => {
    let isMounted = true;

    if (window.require) {
      // Config paths for Monaco
      window.require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' }});

      window.require(['vs/editor/editor.main'], (monaco: any) => {
        // Prevent initialization if component unmounted or editor already exists
        if (!isMounted || editorRef.current) return;

        setIsLoading(false);

        // Define custom theme to match app design
        monaco.editor.defineTheme('codex-dark', {
          base: 'vs-dark',
          inherit: true,
          rules: [
            { token: '', background: '09090b' },
            { token: 'comment', foreground: '6b7280', fontStyle: 'italic' },
            { token: 'keyword', foreground: 'c678dd' },
            { token: 'string', foreground: '98c379' },
            { token: 'number', foreground: 'd19a66' },
            { token: 'type', foreground: 'e5c07b' },
          ],
          colors: {
            'editor.background': '#09090b',
            'editor.foreground': '#e4e4e7',
            'editor.lineHighlightBackground': '#18181b',
            'editorCursor.foreground': '#6366f1',
            'editorIndentGuide.background': '#27272a',
            'editorLineNumber.foreground': '#52525b',
          }
        });

        if (containerRef.current) {
          // Initialize Editor
          editorRef.current = monaco.editor.create(containerRef.current, {
            value: file.content,
            language: file.language,
            theme: 'codex-dark',
            automaticLayout: true,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            fontSize: 14,
            lineHeight: 24,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            padding: { top: 16, bottom: 16 },
            folding: true,
            foldingStrategy: 'indentation',
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            renderLineHighlight: 'all',
          });

          // Handle Content Change
          editorRef.current.onDidChangeModelContent(() => {
            const val = editorRef.current.getValue();
            onChange(val);
          });

          // Add AI Actions to Context Menu
          const addAction = (id: string, label: string, actionName: 'debug' | 'explain' | 'test') => {
            editorRef.current.addAction({
              id: id,
              label: label,
              contextMenuGroupId: 'navigation',
              run: (ed: any) => {
                const selection = ed.getSelection();
                const text = ed.getModel().getValueInRange(selection);
                onAIAction(actionName, text || ed.getModel().getValue());
              }
            });
          };

          addAction('ai-debug', 'Ask AI: Debug Selection', 'debug');
          addAction('ai-explain', 'Ask AI: Explain Selection', 'explain');
          addAction('ai-test', 'Ask AI: Generate Tests', 'test');
        }
      });
    }

    return () => {
      isMounted = false;
      if (editorRef.current) {
        editorRef.current.dispose();
        editorRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync content when file changes externally (e.g., from template or AI)
  useEffect(() => {
    if (editorRef.current) {
      const model = editorRef.current.getModel();
      if (model && model.getValue() !== file.content) {
        // Save cursor state
        const position = editorRef.current.getPosition();
        editorRef.current.setValue(file.content);
        editorRef.current.setPosition(position);
      }
      
      // Update Language if changed
      const monaco = window.monaco;
      if (monaco) {
        monaco.editor.setModelLanguage(model, file.language);
      }
    }
  }, [file.id, file.content, file.language]);

  return (
    <div className="relative w-full h-full bg-codex-bg overflow-hidden group">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center text-zinc-500 gap-2 bg-codex-bg z-10">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Initializing Editor...</span>
        </div>
      )}
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
};