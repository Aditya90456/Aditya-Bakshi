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

// GIT TYPES
export type GitChangeType = 'modified' | 'created' | 'deleted';

export interface Commit {
  id: string;
  message: string;
  author: string;
  timestamp: number;
  changesCount: number;
}

export interface GitState {
  isInitialized: boolean;
  remoteUrl: string | null;
  currentBranch: string;
  commits: Commit[];
  stagedFiles: string[]; // IDs of files currently staged
  lastCommittedContent: Record<string, string>; // Snapshot of file content at last commit: { fileId: content }
}

export interface UserProfile {
  name: string;
  email?: string; // Added for DB
  level: string;
  points: number;
  completedTopics: string[]; // List of Topic IDs
  files?: FileData[]; // Cloud Save: User's files
  gitState?: GitState; // Cloud Save: User's git history
}

export interface TestCase {
  input: string;
  expected: string;
}

export interface DSATopic {
  id: string;
  title: string;
  source: 'Striver' | 'Love Babbar' | 'GFG 250' | 'LeetCode';
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  points: number;
  readTime: string;
  icon?: React.ReactNode;
  description: string;
  content: string; // Markdown content
  testCases: TestCase[];
  starterCode: {
    language: Language;
    code: string;
  };
}