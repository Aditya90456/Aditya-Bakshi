import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, X, Loader2, Code2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ChatMessage, FileData } from '../types';
import { sendMessageStream } from '../services/geminiService';

interface AIChatProps {
  isOpen: boolean;
  onClose: () => void;
  activeFile: FileData;
  aiTrigger: { action: 'debug' | 'explain' | 'test', code: string } | null;
  onActionHandled: () => void;
}

export const AIChat: React.FC<AIChatProps> = ({ isOpen, onClose, activeFile, aiTrigger, onActionHandled }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', text: 'Hello! I am Codex. Ready to help you build something amazing?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Handle external triggers from Context Menu
  useEffect(() => {
    if (aiTrigger) {
      const codeBlock = `\n\`\`\`${activeFile.language}\n${aiTrigger.code}\n\`\`\``;
      let prompt = "";
      
      switch (aiTrigger.action) {
        case 'debug':
          prompt = `I'm stuck with this code. Can you find any bugs or issues and suggest fixes?${codeBlock}`;
          break;
        case 'explain':
          prompt = `Can you explain how this code works in detail?${codeBlock}`;
          break;
        case 'test':
          prompt = `Please write a unit test suite for this code snippet using a standard testing framework suitable for ${activeFile.language}.${codeBlock}`;
          break;
      }

      sendMessage(prompt);
      onActionHandled();
    }
  }, [aiTrigger]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: text,
    };

    const tempAiMsgId = (Date.now() + 1).toString();
    const tempAiMsg: ChatMessage = {
        id: tempAiMsgId,
        role: 'model',
        text: '',
        isStreaming: true
    };

    setMessages(prev => [...prev, userMsg, tempAiMsg]);
    setInput('');
    setIsLoading(true);

    try {
      await sendMessageStream(userMsg.text, activeFile, (chunkText) => {
        setMessages(prev => prev.map(msg => 
            msg.id === tempAiMsgId ? { ...msg, text: chunkText } : msg
        ));
      });
    } finally {
        setMessages(prev => prev.map(msg => 
            msg.id === tempAiMsgId ? { ...msg, isStreaming: false } : msg
        ));
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="flex flex-col h-full bg-zinc-950 border-l border-zinc-800 w-96 shadow-2xl absolute right-0 top-0 bottom-0 z-50 animate-in slide-in-from-right duration-300 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-2.5 text-indigo-400">
          <div className="p-1.5 bg-indigo-500/10 rounded-md">
             <Code2 className="w-5 h-5" />
          </div>
          <h2 className="font-bold text-white tracking-wide">Codex AI</h2>
        </div>
        <button onClick={onClose} className="p-1 rounded-md text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md ${
              msg.role === 'user' ? 'bg-indigo-600' : 'bg-zinc-800 border border-zinc-700'
            }`}>
              {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-indigo-400" />}
            </div>
            
            <div className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div
                className={`p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-sm'
                    : 'bg-zinc-900 text-zinc-300 border border-zinc-800 rounded-tl-sm'
                }`}
              >
                {msg.role === 'model' ? (
                   <div className="markdown-body prose prose-invert prose-sm max-w-none">
                     <ReactMarkdown>{msg.text}</ReactMarkdown>
                     {msg.isStreaming && <span className="inline-block w-2 h-4 ml-1 align-middle bg-indigo-400 animate-pulse"></span>}
                   </div>
                ) : (
                  msg.text
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-zinc-950 border-t border-zinc-900">
        <div className="relative group">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage(input);
              }
            }}
            placeholder="Ask AI to write or debug code..."
            className="w-full bg-zinc-900 text-zinc-200 rounded-xl pl-4 pr-12 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 border border-zinc-800 resize-none h-14 transition-all group-hover:border-zinc-700"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-2 p-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white rounded-lg transition-colors shadow-lg shadow-indigo-500/20"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
        <div className="mt-2 text-[10px] text-zinc-600 text-center font-medium uppercase tracking-wider">
            Context: {activeFile.name}
        </div>
      </div>
    </div>
  );
};