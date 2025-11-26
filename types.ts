import React from 'react';

export type Language = 'javascript' | 'typescript' | 'python' | 'java' | 'cpp' | 'html' | 'css' | 'json' | 'markdown';

export interface FileData {
  id: string;
  name: string;
  language: Language;
  content: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isStreaming?: boolean;
}

export interface AIState {
  isOpen: boolean;
  messages: ChatMessage[];
  isLoading: boolean;
}

export interface AppState {
  files: FileData[];
  activeFileId: string;
}

export interface LogEntry {
  id: string;
  type: 'info' | 'error' | 'success' | 'warn' | 'system';
  message: string;
  timestamp: number;
}

export interface UserProfile {
  name: string;
  level: string;
  points: number;
  completedTopics: string[]; // List of Topic IDs
}

export interface TestCase {
  input: string;
  expected: string;
}

export interface DSATopic {
  id: string;
  title: string;
  source: 'Striver' | 'Love Babbar' | 'GFG 250';
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  points: number;
  readTime: string;
  icon?: React.ReactNode;
  description: string;
  content: string; // Markdown content
  videoUrl?: string; // YouTube Embed URL
  videoId?: string; // Store ID separately for linking
  testCases: TestCase[];
  starterCode: {
    language: Language;
    code: string;
  };
}