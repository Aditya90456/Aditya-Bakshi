
import { UserProfile, DSATopic, FileData } from '../types';
import { isFirebaseReady, signInWithGoogle, logoutFirebase } from './firebase';

// --- INITIAL QUESTION DATA ---
const createContent = (title: string, pattern: string, difficulty: string, logic: string, problemStatement: string) => `
# ${title}

**Pattern**: ${pattern}
**Difficulty**: ${difficulty}

## Problem Statement
${problemStatement}

## Pattern Logic: ${pattern}
${logic}

### Algorithm
1.  Initialize necessary pointers or data structures.
2.  Iterate through the input data.
3.  Apply the pattern logic (e.g., expand/shrink window, move pointers).
4.  Update the result.
5.  Return final answer.

> **Time Complexity**: Typically O(N) or O(N log N) for this pattern.
`;

const FULL_QUESTIONS: DSATopic[] = [
    {
    id: 'sw-max-sum-subarray',
    title: 'Max Sum Subarray of Size K',
    source: 'GFG 250',
    category: 'Pattern: Sliding Window',
    difficulty: 'Easy',
    points: 10,
    readTime: '20 min',
    description: 'Find the maximum sum of any contiguous subarray of size k.',
    testCases: [{ input: '[2, 1, 5, 1, 3, 2], k=3', expected: '9' }],
    content: createContent('Max Sum Subarray', 'Sliding Window', 'Easy', 'Sliding Window Logic.', 'Find max sum of subarray size K.'),
    starterCode: { language: 'javascript', code: `function maxSum(k, arr) {\n  // Your code here\n  return 0;\n}` }
  },
  {
      id: 'tp-pair-target-sum',
      title: 'Pair with Target Sum',
      source: 'GFG 250',
      category: 'Pattern: Two Pointers',
      difficulty: 'Easy',
      points: 10,
      readTime: '15 min',
      description: 'Find a pair with target sum in sorted array.',
      testCases: [{ input: '[1, 2, 3, 4, 6], target=6', expected: '[1, 3]' }],
      content: createContent('Pair Target Sum', 'Two Pointers', 'Easy', 'Two pointers from ends.', 'Find pair summing to target.'),
      starterCode: { language: 'cpp', code: `// Code here` }
  },
  {
      id: 'fs-linked-list-cycle',
      title: 'Linked List Cycle',
      source: 'LeetCode',
      category: 'Pattern: Fast & Slow',
      difficulty: 'Medium',
      points: 30,
      readTime: '25 min',
      description: 'Determine if a linked list has a cycle.',
      testCases: [],
      content: createContent('Linked List Cycle', 'Fast & Slow Pointers', 'Medium', 'Floyds Cycle Detection.', 'Return true if cycle exists.'),
      starterCode: { language: 'java', code: `public boolean hasCycle(ListNode head) {\n    return false;\n}` }
  }
];

class DatabaseService {
    private usersKey = 'codex_users_db';
    private currentUserKey = 'codex_current_user';
    private questionsKey = 'codex_questions_db';
    
    // Use relative path to leverage Vite proxy
    private baseUrl = '/api';
    private isBackendAvailable = false;

    constructor() {
        this.initializeQuestions();
    }

    private initializeQuestions() {
        try {
            const existing = localStorage.getItem(this.questionsKey);
            if (!existing) {
                localStorage.setItem(this.questionsKey, JSON.stringify(FULL_QUESTIONS)); 
            }
        } catch (e) {
            console.error("Failed to initialize DB (Storage Full?)", e);
        }
    }

    // --- USERS & CLOUD SAVE ---

    async getCurrentUser(): Promise<UserProfile | null> {
        const data = localStorage.getItem(this.currentUserKey);
        return data ? JSON.parse(data) : null;
    }

    async login(email: string): Promise<UserProfile | null> {
        // Try Backend
        try {
            const res = await fetch(`${this.baseUrl}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            if (res.ok) {
                const data = await res.json();
                this.saveCurrentUser(data.user);
                this.isBackendAvailable = true;
                return data.user;
            }
        } catch (e) { /* Fallback */ }
        
        // Fallback Local
        await new Promise(resolve => setTimeout(resolve, 600));
        const users = this.getLocalUsers();
        const user = users.find(u => u.email === email);
        if (user) {
            this.saveCurrentUser(user);
            return user;
        }
        return null;
    }

    async signup(name: string, email: string): Promise<UserProfile> {
        // Try Backend
        try {
            const res = await fetch(`${this.baseUrl}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email })
            });
            if (res.ok) {
                const data = await res.json();
                this.saveCurrentUser(data.user);
                this.isBackendAvailable = true;
                return data.user;
            } else if (res.status === 400) {
                 throw new Error('User already exists');
            }
        } catch (e: any) {
            if (e.message === 'User already exists') throw e;
        }

        // Fallback Local
        await new Promise(resolve => setTimeout(resolve, 600));
        const users = this.getLocalUsers();
        if (users.find(u => u.email === email)) {
            throw new Error('User already exists');
        }
        const newUser: UserProfile = {
            name, email, level: 'Novice', points: 0, completedTopics: [], files: []
        };
        users.push(newUser);
        this.saveLocalUsers(users);
        this.saveCurrentUser(newUser);
        return newUser;
    }

    // Sync whole user state (files, progress, gitState) to Cloud
    async syncUser(user: UserProfile): Promise<UserProfile> {
        if (!user.email) return user;

        // Backend Sync
        try {
            const res = await fetch(`${this.baseUrl}/user/sync`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    email: user.email, 
                    files: user.files, 
                    completedTopics: user.completedTopics,
                    points: user.points,
                    gitState: user.gitState
                })
            });
            if (res.ok) {
                const data = await res.json();
                this.saveCurrentUser(data.user);
                this.isBackendAvailable = true;
                return data.user;
            }
        } catch (e) { /* silent fail */ }

        // Local Sync
        try {
            const users = this.getLocalUsers();
            const idx = users.findIndex(u => u.email === user.email);
            if (idx !== -1) {
                users[idx] = user;
                this.saveLocalUsers(users);
                this.saveCurrentUser(user);
            }
        } catch (e) {
            console.error("Local sync failed (Storage likely full)", e);
            throw new Error("Storage Full: Cannot save offline. Check connection.");
        }
        return user;
    }

    async loginWithGoogle(): Promise<UserProfile> {
        if (!isFirebaseReady) {
             // Sim
             await new Promise(resolve => setTimeout(resolve, 1000)); 
             const mockUser: UserProfile = { 
                 name: 'Google User', 
                 email: 'dev@google.com', 
                 level: 'Novice', 
                 points: 0, 
                 completedTopics: [],
                 files: []
             };
             // Try to find if exists locally
             const existing = await this.login(mockUser.email!);
             if (existing) return existing;
             
             // Else signup logic
             return this.signup(mockUser.name, mockUser.email!);
        }

        try {
            const googleUser = await signInWithGoogle();
            let user = await this.login(googleUser.email);
            if (!user) {
                user = await this.signup(googleUser.name, googleUser.email);
            }
            return user!;
        } catch (error: any) {
             throw error;
        }
    }

    async logout() {
        if (isFirebaseReady) await logoutFirebase();
        localStorage.removeItem(this.currentUserKey);
    }

    async getQuestions(): Promise<DSATopic[]> {
        await new Promise(resolve => setTimeout(resolve, 300));
        try {
            const data = localStorage.getItem(this.questionsKey);
            return data ? JSON.parse(data) : FULL_QUESTIONS; 
        } catch (e) {
            return FULL_QUESTIONS;
        }
    }

    private getLocalUsers(): UserProfile[] {
        try {
            const data = localStorage.getItem(this.usersKey);
            return data ? JSON.parse(data) : [];
        } catch (e) { return []; }
    }

    private saveLocalUsers(users: UserProfile[]) {
        try {
            localStorage.setItem(this.usersKey, JSON.stringify(users));
        } catch (e) {
            console.error("LocalStorage Limit Reached", e);
            throw new Error("Local Storage Full");
        }
    }

    private saveCurrentUser(user: UserProfile) {
        try {
            localStorage.setItem(this.currentUserKey, JSON.stringify(user));
        } catch (e) { console.error("Session Save Fail", e); }
    }
}

export const db = new DatabaseService();