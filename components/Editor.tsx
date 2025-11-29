import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { FileData } from '../types';
import { Loader2, AlertCircle, Check, Terminal } from 'lucide-react';

interface EditorProps {
  file: FileData;
  onChange: (newContent: string) => void;
  onAIAction: (action: 'debug' | 'explain' | 'test', code: string) => void;
}

export interface EditorHandle {
  insertText: (text: string) => void;
  layout: () => void;
}

declare global {
  interface Window {
    require: any;
    monaco: any;
    monacoConfigured: boolean;
  }
}

export const Editor = forwardRef<EditorHandle, EditorProps>(({ file, onChange, onAIAction }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cursorPosition, setCursorPosition] = useState({ lineNumber: 1, column: 1 });
  
  // Fix for closure trap: keep a ref to the latest onAIAction
  const onAIActionRef = useRef(onAIAction);

  useEffect(() => {
    onAIActionRef.current = onAIAction;
  }, [onAIAction]);

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    insertText: (text: string) => {
      if (editorRef.current) {
        const selection = editorRef.current.getSelection();
        const op = {
          range: selection,
          text: text,
          forceMoveMarkers: true
        };
        editorRef.current.executeEdits("my-source", [op]);
        editorRef.current.focus();
      }
    },
    layout: () => {
        if (editorRef.current) {
            editorRef.current.layout();
        }
    }
  }));

  // Helper to configure languages (IntelliSense)
  const configureMonacoLanguages = (monaco: any) => {
    if (window.monacoConfigured) return;
    window.monacoConfigured = true;

    // TS/JS Config: Enhance IntelliSense
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: false,
        noSyntaxValidation: false,
    });
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.ES2016,
        allowNonTsExtensions: true,
        moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
        module: monaco.languages.typescript.ModuleKind.CommonJS,
        noEmit: true,
        esModuleInterop: true,
    });

    // Helper to register providers
    const createProvider = (lang: string, keywords: string[], snippets: any[]) => {
        monaco.languages.registerCompletionItemProvider(lang, {
            provideCompletionItems: (model: any, position: any) => {
                const word = model.getWordUntilPosition(position);
                const range = {
                    startLineNumber: position.lineNumber,
                    endLineNumber: position.lineNumber,
                    startColumn: word.startColumn,
                    endColumn: word.endColumn
                };
                
                const keywordSuggestions = keywords.map(k => ({
                    label: k,
                    kind: monaco.languages.CompletionItemKind.Keyword,
                    insertText: k,
                    range: range
                }));

                const snippetSuggestions = snippets.map((s: any) => ({
                    label: s.label,
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: s.insertText,
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: s.documentation,
                    range: range
                }));

                return { suggestions: [...keywordSuggestions, ...snippetSuggestions] };
            }
        });
    };

    // Python IntelliSense
    createProvider('python', 
        ['def', 'class', 'if', 'else', 'elif', 'for', 'while', 'try', 'except', 'return', 'import', 'from', 'print', 'True', 'False', 'None', 'len', 'range', 'break', 'continue'], 
        [
            { label: 'print', insertText: 'print(${1:value})', documentation: 'Print to stdout' },
            { label: 'def', insertText: 'def ${1:function_name}(${2:args}):\n\t${0}', documentation: 'Define function' },
            { label: 'ifmain', insertText: 'if __name__ == "__main__":\n\t${0}', documentation: 'Main execution block' },
            { label: 'for', insertText: 'for ${1:item} in ${2:iterable}:\n\t${0}', documentation: 'For loop' },
            { label: 'class', insertText: 'class ${1:ClassName}:\n\tdef __init__(self, ${2:args}):\n\t\t${0}', documentation: 'Class definition' }
        ]
    );

    // Java IntelliSense
    createProvider('java',
        ['public', 'private', 'protected', 'class', 'interface', 'static', 'final', 'void', 'int', 'double', 'boolean', 'String', 'new', 'return', 'if', 'else', 'for', 'while', 'try', 'catch', 'throw', 'package', 'import'],
        [
            { label: 'sout', insertText: 'System.out.println(${1});', documentation: 'Print to console' },
            { label: 'psvm', insertText: 'public static void main(String[] args) {\n\t${0}\n}', documentation: 'Main method' },
            { label: 'class', insertText: 'public class ${1:Name} {\n\t${0}\n}', documentation: 'Class definition' },
            { label: 'for', insertText: 'for (int ${1:i} = 0; ${1:i} < ${2:limit}; ${1:i}++) {\n\t${0}\n}', documentation: 'For loop' }
        ]
    );
    
    // C++ IntelliSense
    createProvider('cpp',
        ['include', 'using', 'namespace', 'int', 'void', 'float', 'double', 'char', 'bool', 'class', 'struct', 'public', 'private', 'protected', 'if', 'else', 'for', 'while', 'do', 'return', 'std', 'vector', 'string'],
        [
             { label: 'include', insertText: '#include <${1:iostream}>', documentation: 'Include header' },
             { label: 'cout', insertText: 'std::cout << ${1} << std::endl;', documentation: 'Print to stdout' },
             { label: 'main', insertText: 'int main() {\n\t${0}\n\treturn 0;\n}', documentation: 'Main function' },
             { label: 'vector', insertText: 'std::vector<${1:Type}> ${2:name};', documentation: 'Std Vector' }
        ]
    );
  };

  // Load Monaco Editor
  useEffect(() => {
    let isMounted = true;

    if (window.require) {
      // Config paths for Monaco
      window.require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' }});

      window.require(['vs/editor/editor.main'], (monaco: any) => {
        // Prevent initialization if component unmounted or editor already exists
        if (!isMounted || editorRef.current) return;

        // Configure IntelliSense (Run only once)
        configureMonacoLanguages(monaco);

        setIsLoading(false);

        // Define custom theme to match app design
        monaco.editor.defineTheme('codex-dark', {
          base: 'vs-dark',
          inherit: true,
          rules: [
            { token: '', background: '09090b' },
            { token: 'comment', foreground: '6b7280', fontStyle: 'italic' },
            { token: 'keyword', foreground: 'c678dd', fontStyle: 'bold' },
            { token: 'string', foreground: '98c379' },
            { token: 'number', foreground: 'd19a66' },
            { token: 'type', foreground: 'e5c07b' },
            { token: 'operator', foreground: '56b6c2' },
          ],
          colors: {
            'editor.background': '#09090b',
            'editor.foreground': '#e4e4e7',
            'editor.lineHighlightBackground': '#18181b',
            'editorCursor.foreground': '#818cf8',
            'editorIndentGuide.background': '#27272a',
            'editorIndentGuide.activeBackground': '#3f3f46',
            'editorLineNumber.foreground': '#52525b',
            'editorLineNumber.activeForeground': '#e4e4e7',
            'editor.selectionBackground': '#2e303d',
            'editor.inactiveSelectionBackground': '#22232a',
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
            fontLigatures: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            padding: { top: 16, bottom: 16 },
            folding: true,
            foldingStrategy: 'indentation',
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            renderLineHighlight: 'all',
            // Enhance IntelliSense behavior
            quickSuggestions: true,
            suggestOnTriggerCharacters: true,
            parameterHints: { enabled: true },
            bracketPairColorization: { enabled: true },
            guides: {
                indentation: true,
                bracketPairs: true,
            }
          });

          // Handle Content Change
          editorRef.current.onDidChangeModelContent(() => {
            const val = editorRef.current.getValue();
            onChange(val);
          });

          // Handle Cursor Change
          editorRef.current.onDidChangeCursorPosition((e: any) => {
              setCursorPosition({
                  lineNumber: e.position.lineNumber,
                  column: e.position.column
              });
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
                // Use the ref to ensure we call the latest handler with current state
                onAIActionRef.current(actionName, text || ed.getModel().getValue());
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

  // Sync content when file changes externally
  useEffect(() => {
    if (editorRef.current) {
      const model = editorRef.current.getModel();
      if (model && model.getValue() !== file.content) {
        const position = editorRef.current.getPosition();
        editorRef.current.setValue(file.content);
        editorRef.current.setPosition(position);
      }
      
      const monaco = window.monaco;
      if (monaco) {
        monaco.editor.setModelLanguage(model, file.language);
      }
    }
  }, [file.id, file.content, file.language]);

  return (
    <div className="relative w-full h-full bg-codex-bg flex flex-col overflow-hidden border-t border-zinc-900">
      
      <div className="flex-1 relative min-h-0 group">
        {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-500 gap-3 bg-codex-bg z-10">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            <span className="text-xs font-medium tracking-wider uppercase opacity-70">Initializing Codex Engine...</span>
            </div>
        )}
        <div ref={containerRef} className="w-full h-full" />
      </div>

      {/* Editor Status Bar */}
      <div className="h-7 bg-zinc-950 border-t border-zinc-900 flex items-center justify-between px-4 text-[10px] font-medium text-zinc-500 select-none shrink-0">
         <div className="flex items-center gap-4">
             <div className="flex items-center gap-1.5 hover:text-zinc-300 transition-colors cursor-pointer">
                <Terminal className="w-3 h-3" />
                <span>Ready</span>
             </div>
         </div>

         <div className="flex items-center gap-6">
             <div className="flex items-center gap-1 hover:text-zinc-300 transition-colors cursor-pointer">
                 <span>Ln {cursorPosition.lineNumber}, Col {cursorPosition.column}</span>
             </div>
             <div className="flex items-center gap-1 hover:text-zinc-300 transition-colors cursor-pointer">
                 <span>UTF-8</span>
             </div>
             <div className="flex items-center gap-1 hover:text-indigo-400 transition-colors cursor-pointer uppercase">
                 <Check className="w-3 h-3" />
                 <span>{file.language}</span>
             </div>
             <div className="flex items-center gap-1 hover:text-zinc-300 transition-colors cursor-pointer">
                 <span>Prettier</span>
             </div>
         </div>
      </div>
    </div>
  );
});

Editor.displayName = 'Editor';