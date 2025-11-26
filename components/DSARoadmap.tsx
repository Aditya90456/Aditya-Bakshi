
import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, BookOpen, Code2, Cpu, GitFork, Layers, 
  Hash, MoveHorizontal, Minimize2, 
  CheckCircle2, MonitorPlay, FileCheck, Star, Youtube, Grid, Type, Search,
  ChevronRight, List, Clock, AlignLeft, PlayCircle, Terminal
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { DSATopic, Language } from '../types';

// Helper to get embed URL
const getEmbedUrl = (videoId: string) => `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;

const DSA_TOPICS: DSATopic[] = [
  {
    id: 'arrays-hashing',
    title: 'Arrays & Hashing',
    source: 'Love Babbar',
    category: 'Linear Data Structures',
    difficulty: 'Easy',
    points: 10,
    readTime: '45 min',
    icon: <Hash className="w-6 h-6 text-yellow-400" />,
    description: 'Lecture 09: Introduction to Arrays in C++. Memory mapping, initialization, and basic operations.',
    videoUrl: getEmbedUrl('oVa8DfUDKTw'),
    videoId: 'oVa8DfUDKTw',
    testCases: [
        { input: '[1, 2, 3, 1]', expected: 'true' },
        { input: '[1, 2, 3, 4]', expected: 'false' },
        { input: '[1, 1, 1, 3, 3, 4, 3, 2, 4, 2]', expected: 'true' }
    ],
    content: `
# Introduction to Arrays

Arrays are the foundation of Data Structures and Algorithms. In this module, we follow Love Babbar's approach to understanding contiguous memory allocation.

## Core Concepts

1.  **Memory Allocation**: Arrays are stored in contiguous memory locations.
2.  **Access Time**: Accessing an element by index \`arr[i]\` is **O(1)**.
3.  **Insertion/Deletion**: inserting or deleting elements from the middle is **O(n)** because subsequent elements must be shifted.

> **Note:** In C++, the size of an array is fixed at compile time (unless dynamic allocation is used). Vectors provide dynamic sizing.

## Problem Statement: Contains Duplicate

Given an integer array \`nums\`, return \`true\` if any value appears at least twice in the array, and return \`false\` if every element is distinct.

### Approach 1: Brute Force
Compare every element with every other element. 
*   **Time:** O(n²)
*   **Space:** O(1)

### Approach 2: Sorting
Sort the array and check adjacent elements.
*   **Time:** O(n log n)
*   **Space:** O(1) or O(n) depending on sort.

### Approach 3: Hash Set (Optimal)
Use a Hash Set to store elements we have seen so far.
*   **Time:** O(n)
*   **Space:** O(n)
    `,
    starterCode: {
      language: 'cpp',
      code: `#include <iostream>
#include <vector>
#include <algorithm>
#include <unordered_set>

using namespace std;

bool containsDuplicate(vector<int>& nums) {
    // TODO: Solve using Sorting or Hash Set
    return false;
}

int main() {
    vector<int> nums = {1, 2, 3, 1};
    cout << (containsDuplicate(nums) ? "True" : "False") << endl;
    return 0;
}`
    }
  },
  {
    id: 'two-pointers',
    title: 'Two Pointers',
    source: 'Striver',
    category: 'Algorithms',
    difficulty: 'Easy',
    points: 10,
    readTime: '30 min',
    icon: <MoveHorizontal className="w-6 h-6 text-cyan-400" />,
    description: 'Optimal approach for searching pairs in sorted arrays. Reduces time complexity from O(N²) to O(N).',
    videoUrl: getEmbedUrl('UXDSeD9mN-k'),
    videoId: 'UXDSeD9mN-k',
    testCases: [
        { input: '"A man, a plan, a canal: Panama"', expected: 'true' },
        { input: '"race a car"', expected: 'false' }
    ],
    content: `
# Two Pointers Technique

The Two Pointers pattern is a must-know optimization technique, often used for **Sorted Arrays** or Lists.

## The Strategy

Instead of using nested loops to find a pair or a subarray, we initialize two pointers (indices) and move them based on conditions.

### Scenario: Pair Sum
1.  Initialize \`left = 0\` and \`right = n-1\`.
2.  Calculate \`sum = arr[left] + arr[right]\`.
3.  If \`sum < target\`, we need a larger value: increment \`left\`.
4.  If \`sum > target\`, we need a smaller value: decrement \`right\`.

> **Tip:** This technique reduces complexity from **O(n²)** to **O(n)**.

## Problem: Valid Palindrome
A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.
    `,
    starterCode: {
      language: 'javascript',
      code: `/**
 * @param {string} s
 * @return {boolean}
 */
var isPalindrome = function(s) {
    // TODO: Use Two Pointers (Start and End)
    return false;
};

console.log(isPalindrome("A man, a plan, a canal: Panama"));`
    }
  },
  {
    id: 'matrix-grid',
    title: 'Matrix & Grid',
    source: 'GFG 250',
    category: '2D Arrays',
    difficulty: 'Medium',
    points: 30,
    readTime: '40 min',
    icon: <Grid className="w-6 h-6 text-orange-400" />,
    description: 'Master 2D Array traversals. Spiral traversal, Rotation, and Search in 2D Matrix.',
    videoUrl: getEmbedUrl('3YDBTpqTOOE'), // Striver: Spiral Matrix
    videoId: '3YDBTpqTOOE',
    testCases: [
        { input: 'matrix = [[1,2,3],[4,5,6],[7,8,9]]', expected: '[1,2,3,6,9,8,7,4,5]' },
        { input: 'matrix = [[1,2],[3,4]]', expected: '[1,2,4,3]' }
    ],
    content: `
# Matrix Spiral Traversal

Traversing a 2D matrix in a spiral order is a classic interview problem found in GFG and LeetCode. It tests your ability to manage boundaries and loops carefully.

## The Algorithm

1.  Define boundaries: \`top\`, \`bottom\`, \`left\`, \`right\`.
2.  Traverse **Right** (top row), then increment \`top\`.
3.  Traverse **Down** (right col), then decrement \`right\`.
4.  Traverse **Left** (bottom row), then decrement \`bottom\`.
5.  Traverse **Up** (left col), then increment \`left\`.
6.  Repeat while boundaries don't cross.

## Problem: Spiral Matrix
Given an \`m x n\` matrix, return all elements of the matrix in spiral order.
    `,
    starterCode: {
      language: 'java',
      code: `import java.util.ArrayList;
import java.util.List;

class Solution {
    public List<Integer> spiralOrder(int[][] matrix) {
        List<Integer> result = new ArrayList<>();
        // TODO: Implement Spiral Logic
        return result;
    }
    
    public static void main(String[] args) {
        int[][] matrix = {{1,2,3},{4,5,6},{7,8,9}};
        Solution sol = new Solution();
        System.out.println(sol.spiralOrder(matrix));
    }
}`
    }
  },
  {
    id: 'string-manipulation',
    title: 'Strings Pattern',
    source: 'GFG 250',
    category: 'Strings',
    difficulty: 'Medium',
    points: 30,
    readTime: '35 min',
    icon: <Type className="w-6 h-6 text-pink-400" />,
    description: 'String searching, Anagrams, and Parenthesis matching problems.',
    videoUrl: getEmbedUrl('3IETreEYbaA'), // Striver: Longest Substring without repeating chars
    videoId: '3IETreEYbaA',
    testCases: [
        { input: '"abcabcbb"', expected: '3' },
        { input: '"bbbbb"', expected: '1' }
    ],
    content: `
# Longest Substring Without Repeating Characters

A fundamental problem in String manipulation that often uses the **Sliding Window** technique or a **Hash Set**.

## Approach

1.  Use a set to store characters in the current window.
2.  Use two pointers: \`l\` and \`r\`.
3.  Move \`r\` forward. If \`s[r]\` is in the set, remove \`s[l]\` and move \`l\` forward until \`s[r]\` can be added.
4.  Track the maximum size of the set.

## Problem
Given a string \`s\`, find the length of the longest substring without repeating characters.
    `,
    starterCode: {
        language: 'python',
        code: `def length_of_longest_substring(s: str) -> int:
    # TODO: Implement Sliding Window
    return 0

print(length_of_longest_substring("abcabcbb"))`
    }
  },
  {
    id: 'searching-sorting',
    title: 'Binary Search',
    source: 'GFG 250',
    category: 'Searching',
    difficulty: 'Easy',
    points: 10,
    readTime: '25 min',
    icon: <Search className="w-6 h-6 text-blue-500" />,
    description: 'Understand Binary Search on Arrays. O(log n) complexity.',
    videoUrl: getEmbedUrl('MHf6awe89MY'), // Striver: Binary Search
    videoId: 'MHf6awe89MY',
    testCases: [
        { input: 'nums=[-1,0,3,5,9,12], target=9', expected: '4' },
        { input: 'nums=[-1,0,3,5,9,12], target=2', expected: '-1' }
    ],
    content: `
# Binary Search Algorithm

Binary Search is the most efficient way to search in a **Sorted Array**.

## Logic flow
1.  Find \`mid = (low + high) / 2\`.
2.  If \`target == arr[mid]\`, return \`mid\`.
3.  If \`target > arr[mid]\`, search right half (\`low = mid + 1\`).
4.  If \`target < arr[mid]\`, search left half (\`high = mid - 1\`).

> **Complexity:** Time: O(log n) | Space: O(1)

## Problem: Binary Search
Given an array of integers \`nums\` which is sorted in ascending order, and an integer \`target\`, write a function to search \`target\` in \`nums\`. If \`target\` exists, then return its index. Otherwise, return \`-1\`.
    `,
    starterCode: {
        language: 'cpp',
        code: `#include <vector>
#include <iostream>
using namespace std;

int search(vector<int>& nums, int target) {
    int low = 0;
    int high = nums.size() - 1;
    // TODO: Implement Binary Search
    return -1;
}

int main() {
    vector<int> nums = {-1, 0, 3, 5, 9, 12};
    cout << search(nums, 9) << endl;
    return 0;
}`
    }
  },
  {
    id: 'sliding-window',
    title: 'Sliding Window',
    source: 'Striver',
    category: 'Algorithms',
    difficulty: 'Medium',
    points: 30,
    readTime: '40 min',
    icon: <Minimize2 className="w-6 h-6 text-blue-400" />,
    description: 'Master Fixed and Variable size sliding windows. Essential for subarray and substring problems.',
    videoUrl: getEmbedUrl('9kdHxplyl5I'),
    videoId: '9kdHxplyl5I',
    testCases: [
        { input: '[7,1,5,3,6,4]', expected: '5' },
        { input: '[7,6,4,3,1]', expected: '0' }
    ],
    content: `
# Sliding Window Technique

The Sliding Window pattern is used to perform a required operation on a specific window size of a given array or string.

## Variable Window Strategy
1.  **Expand**: Move the \`right\` pointer to include new elements.
2.  **Validate**: Check if the current window satisfies the condition.
3.  **Shrink**: If invalid, move the \`left\` pointer until valid again.
4.  **Update**: Calculate the global maximum/minimum.

## Problem: Best Time to Buy and Sell Stock
You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.
    `,
    starterCode: {
      language: 'java',
      code: `class Solution {
    public int maxProfit(int[] prices) {
        // TODO: Implement Logic
        return 0;
    }
    
    public static void main(String[] args) {
        Solution sol = new Solution();
        int[] prices = {7, 1, 5, 3, 6, 4};
        System.out.println(sol.maxProfit(prices));
    }
}`
    }
  },
  {
    id: 'stack',
    title: 'Stack & Queues',
    source: 'Love Babbar',
    category: 'Linear Data Structures',
    difficulty: 'Easy',
    points: 10,
    readTime: '55 min',
    icon: <Layers className="w-6 h-6 text-purple-400" />,
    description: 'Lecture 54: Introduction to Stacks. Theory, Implementation using Arrays/LL, and STL.',
    videoUrl: getEmbedUrl('bmjOl92DAX8'),
    videoId: 'bmjOl92DAX8',
    testCases: [
        { input: '"()[]{}"', expected: 'true' },
        { input: '"(]"', expected: 'false' }
    ],
    content: `
# Stacks & Queues

A Stack is a linear data structure that follows the **LIFO (Last In, First Out)** principle. Think of a stack of plates.

## Key Operations
*   **push()**: Insert element at top.
*   **pop()**: Remove element from top.
*   **top()**: Access the top element.
*   **empty()**: Check if stack is empty.

## Problem: Valid Parentheses
Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.
    `,
    starterCode: {
      language: 'cpp',
      code: `#include <iostream>
#include <stack>
#include <string>

using namespace std;

bool isValid(string s) {
    stack<char> st;
    // TODO: Iterate through string
    return true;
}

int main() {
    cout << isValid("()[]{}") << endl;
    return 0;
}`
    }
  },
  {
    id: 'graphs',
    title: 'Graph Series',
    source: 'Striver',
    category: 'Non-Linear Data Structures',
    difficulty: 'Hard',
    points: 80,
    readTime: '1 hr',
    icon: <GitFork className="w-6 h-6 text-indigo-400" />,
    description: 'Striver\'s legendary Graph series. From BFS/DFS to Dijkstra and Topology Sort.',
    videoUrl: getEmbedUrl('M43pKoCZYCk'),
    videoId: 'M43pKoCZYCk',
    testCases: [],
    content: `
# Graphs and Traversals

A Graph is a set of vertices (nodes) and edges that connect these vertices. Striver's series covers this from absolute basics to advanced algorithms.

## Types of Traversals
*   **BFS (Breadth-First Search)**: Level-wise traversal. Uses a Queue.
*   **DFS (Depth-First Search)**: Recursion/Stack based traversal.

## Real World Use
*   Social Networks (Facebook friends)
*   Maps (Shortest path)
*   Web Crawlers

## Problem: BFS of Graph
Given a directed graph. The task is to do Breadth First Traversal of this graph starting from 0.
    `,
    starterCode: {
      language: 'cpp',
      code: `#include <iostream>
#include <vector>
#include <queue>

using namespace std;

// Function to return Breadth First Traversal of given graph.
vector<int> bfsOfGraph(int V, vector<int> adj[]) {
    vector<int> bfs;
    // TODO: Implement BFS
    return bfs;
}

int main() {
    return 0;
}`
    }
  },
  {
    id: 'dp',
    title: 'Dynamic Programming',
    source: 'Striver',
    category: 'Algorithms',
    difficulty: 'Hard',
    points: 80,
    readTime: '1.5 hr',
    icon: <Cpu className="w-6 h-6 text-teal-400" />,
    description: 'The ultimate DP playlist. 1D, 2D DP, DP on Grids, and DP on Strings.',
    videoUrl: getEmbedUrl('tyB0ztf0DNY'),
    videoId: 'tyB0ztf0DNY',
    testCases: [
        { input: 'n=5', expected: '8' },
        { input: 'n=2', expected: '2' }
    ],
    content: `
# Dynamic Programming

Dynamic Programming is just **Recursion + Memoization**.

## The Flow
1.  **Recursion**: Try all possible ways (Brute Force).
2.  **Memoization**: Store the result of subproblems to avoid re-computation.
3.  **Tabulation**: Bottom-up approach to save stack space.
4.  **Space Optimization**: Reduce space complexity if possible.

## Problem: Climbing Stairs
You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?
    `,
    starterCode: {
      language: 'java',
      code: `public class Main {
    public static int climbStairs(int n) {
        // TODO: Use DP array
        return 0;
    }

    public static void main(String[] args) {
        int n = 5;
        System.out.println("Ways: " + climbStairs(n));
    }
}`
    }
  }
];

interface DSARoadmapProps {
  onSolveProblem: (topic: DSATopic) => void;
  completedTopicIds: string[];
  onCompleteTopic: (topicId: string, points: number) => void;
}

export const DSARoadmap: React.FC<DSARoadmapProps> = ({ onSolveProblem, completedTopicIds, onCompleteTopic }) => {
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);

  const activeTopic = activeTopicId ? DSA_TOPICS.find(t => t.id === activeTopicId) : null;
  const isCompleted = activeTopic ? completedTopicIds.includes(activeTopic.id) : false;

  // Group topics by category
  const topicsByCategory = useMemo<Record<string, DSATopic[]>>(() => {
    const groups: Record<string, DSATopic[]> = {};
    DSA_TOPICS.forEach(topic => {
      if (!groups[topic.category]) groups[topic.category] = [];
      groups[topic.category].push(topic);
    });
    return groups;
  }, []);

  return (
    <div className="flex h-full bg-codex-bg overflow-hidden font-sans">
      
      {/* 1. Sidebar Course Index (GFG Style) */}
      <div className="w-80 border-r border-zinc-900 bg-black flex flex-col shrink-0">
        <div className="p-4 border-b border-zinc-900 bg-zinc-950/50 backdrop-blur-sm sticky top-0 z-10">
          <h2 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
            <List className="w-4 h-4 text-indigo-500" />
            Course Index
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-6">
          {Object.entries(topicsByCategory).map(([category, topics]: [string, DSATopic[]]) => (
            <div key={category}>
              <h3 className="text-xs font-bold text-zinc-500 uppercase mb-3 px-2 flex items-center gap-2">
                <AlignLeft className="w-3 h-3" /> {category}
              </h3>
              <div className="space-y-1">
                {topics.map(topic => {
                   const isDone = completedTopicIds.includes(topic.id);
                   const isActive = activeTopicId === topic.id;
                   
                   return (
                     <button
                        key={topic.id}
                        onClick={() => setActiveTopicId(topic.id)}
                        className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group ${
                          isActive 
                            ? 'bg-zinc-900 text-white shadow-sm ring-1 ring-zinc-800' 
                            : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200'
                        }`}
                     >
                        <div className={`shrink-0 ${isDone ? 'text-emerald-500' : (isActive ? 'text-indigo-500' : 'text-zinc-600')}`}>
                          {isDone ? <CheckCircle2 className="w-4 h-4" /> : topic.icon}
                        </div>
                        <span className="flex-1 truncate font-medium">{topic.title}</span>
                        {isActive && <ChevronRight className="w-3 h-3 text-indigo-500" />}
                     </button>
                   );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#09090b]">
        
        {/* Top Breadcrumb Header */}
        <div className="h-14 border-b border-zinc-900 flex items-center px-8 shrink-0 bg-black/40 backdrop-blur-md sticky top-0 z-20 justify-between">
           <div className="flex items-center gap-2 text-sm text-zinc-500">
              <span className="hover:text-zinc-300 cursor-pointer" onClick={() => setActiveTopicId(null)}>DSA Roadmap</span>
              <ChevronRight className="w-3.5 h-3.5" />
              {activeTopic ? (
                 <>
                  <span className="text-zinc-300">{activeTopic.category}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                  <span className="text-white font-medium">{activeTopic.title}</span>
                 </>
              ) : (
                <span className="text-white font-medium">Dashboard</span>
              )}
           </div>
           
           {/* Mobile-like Solve Button for Header */}
           {activeTopic && (
              <button 
                onClick={() => onSolveProblem(activeTopic)}
                className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-xs font-bold uppercase tracking-wide transition-all shadow-lg shadow-indigo-500/20"
              >
                <Code2 className="w-3.5 h-3.5" />
                Solve
              </button>
           )}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          
          {activeTopic ? (
            /* ARTICLE VIEW (GFG Style) */
            <div className="max-w-6xl mx-auto w-full p-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
               
               {/* Left Column: Article (8 Cols) */}
               <div className="lg:col-span-8 space-y-8 pb-20">
                  
                  {/* Article Title Block */}
                  <div className="space-y-4 border-b border-zinc-800 pb-8">
                      <h1 className="text-4xl font-black text-white leading-tight tracking-tight">
                        {activeTopic.title}
                      </h1>
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                         <span className="flex items-center gap-1.5 text-zinc-400 bg-zinc-900 px-2 py-1 rounded-md border border-zinc-800">
                            <Clock className="w-3.5 h-3.5" /> {activeTopic.readTime} Read
                         </span>
                         <span className={`px-2 py-1 rounded-md border font-bold text-xs uppercase tracking-wide ${
                            activeTopic.difficulty === 'Easy' ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/10' :
                            activeTopic.difficulty === 'Medium' ? 'border-yellow-500/20 text-yellow-400 bg-yellow-500/10' :
                            'border-red-500/20 text-red-400 bg-red-500/10'
                         }`}>
                           {activeTopic.difficulty}
                         </span>
                         <span className="flex items-center gap-1 text-indigo-400 font-medium">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            {activeTopic.source}
                         </span>
                      </div>
                  </div>

                  {/* Video Embed */}
                  {activeTopic.videoUrl && (
                    <div className="rounded-xl overflow-hidden border border-zinc-800 shadow-2xl bg-black">
                         <div className="aspect-video relative">
                            <iframe 
                                src={activeTopic.videoUrl} 
                                title={activeTopic.title}
                                className="w-full h-full absolute inset-0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                            ></iframe>
                        </div>
                        <div className="bg-zinc-900/50 px-4 py-3 flex justify-between items-center border-t border-zinc-800">
                            <span className="text-xs font-medium text-zinc-400 flex items-center gap-2">
                                <PlayCircle className="w-4 h-4" /> Video Lecture
                            </span>
                            {activeTopic.videoId && (
                                <a 
                                    href={`https://www.youtube.com/watch?v=${activeTopic.videoId}`} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="text-xs text-indigo-400 hover:text-white flex items-center gap-1 font-medium"
                                >
                                    Open on YouTube <Youtube className="w-3.5 h-3.5" />
                                </a>
                            )}
                        </div>
                    </div>
                  )}

                  {/* Article Body */}
                  <div className="prose prose-invert prose-lg max-w-none 
                        prose-headings:font-bold prose-headings:text-zinc-100 prose-headings:tracking-tight
                        prose-h1:text-3xl prose-h1:mb-6 prose-h1:border-b prose-h1:border-zinc-800 prose-h1:pb-4
                        prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:text-indigo-200
                        prose-p:text-zinc-300 prose-p:leading-relaxed
                        prose-strong:text-white prose-strong:font-bold
                        prose-code:text-indigo-300 prose-code:bg-indigo-950/30 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:font-mono prose-code:text-sm
                        prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-zinc-800 prose-pre:rounded-xl prose-pre:shadow-lg
                        prose-ul:marker:text-zinc-500 prose-li:text-zinc-300
                        prose-blockquote:border-l-4 prose-blockquote:border-indigo-500 prose-blockquote:bg-zinc-900/50 prose-blockquote:px-6 prose-blockquote:py-2 prose-blockquote:not-italic prose-blockquote:text-zinc-400 prose-blockquote:rounded-r-lg"
                  >
                      <ReactMarkdown>{activeTopic.content}</ReactMarkdown>
                  </div>
               </div>

               {/* Right Column: Sticky Widget (4 Cols) */}
               <div className="lg:col-span-4 relative">
                  <div className="sticky top-8 space-y-6">
                      
                      {/* Solve Widget */}
                      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-xl relative overflow-hidden">
                         <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                         
                         <h3 className="text-lg font-bold text-white mb-2 relative z-10 flex items-center gap-2">
                             <Terminal className="w-5 h-5 text-indigo-500" />
                             Practice Problem
                         </h3>
                         <p className="text-zinc-400 text-sm mb-6 leading-relaxed relative z-10">
                             Apply the concepts from this article. Write code, run test cases, and submit.
                         </p>

                         <button
                                onClick={() => onSolveProblem(activeTopic)}
                                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-indigo-500/20 mb-3"
                            >
                                <Code2 className="w-4 h-4" />
                                Solve Challenge
                        </button>

                        {!isCompleted ? (
                            <button
                                onClick={() => onCompleteTopic(activeTopic.id, activeTopic.points)}
                                className="w-full flex items-center justify-center gap-2 bg-zinc-950 text-emerald-500 border border-zinc-800 hover:bg-zinc-800 font-medium py-2.5 rounded-lg transition-all text-sm"
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                Mark as Completed
                            </button>
                        ) : (
                            <div className="w-full flex items-center justify-center gap-2 bg-emerald-900/10 text-emerald-500 border border-emerald-900/20 font-medium py-2.5 rounded-lg text-sm cursor-default">
                                <CheckCircle2 className="w-4 h-4" />
                                Completed
                            </div>
                        )}
                      </div>

                      {/* Test Cases Preview */}
                      {activeTopic.testCases.length > 0 && (
                          <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-5">
                              <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-4">Sample Test Cases</h4>
                              <div className="space-y-3">
                                  {activeTopic.testCases.map((tc, i) => (
                                      <div key={i} className="bg-zinc-900/50 border border-zinc-800 rounded p-2.5 text-xs font-mono">
                                          <div className="text-zinc-500 mb-1">In: <span className="text-zinc-300">{tc.input}</span></div>
                                          <div className="text-zinc-500">Out: <span className="text-indigo-400 font-semibold">{tc.expected}</span></div>
                                      </div>
                                  ))}
                              </div>
                          </div>
                      )}

                  </div>
               </div>

            </div>
          ) : (
            /* DASHBOARD GRID VIEW */
            <div className="p-8 max-w-7xl mx-auto animate-fade-in">
              <div className="text-center space-y-4 mb-12 py-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium uppercase tracking-wider mb-4">
                     <Layers className="w-3.5 h-3.5" />
                     Comprehensive Curriculum
                </div>
                <h2 className="text-4xl font-black text-white tracking-tight">Structured Learning Path</h2>
                <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
                   Master Data Structures and Algorithms with curated patterns from the industry's best sources.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {DSA_TOPICS.map((topic) => {
                    const isDone = completedTopicIds.includes(topic.id);
                    return (
                        <div 
                            key={topic.id}
                            onClick={() => setActiveTopicId(topic.id)}
                            className={`group relative bg-zinc-900/40 border rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:bg-zinc-900 hover:translate-y-[-2px] ${
                                isDone 
                                ? 'border-emerald-500/30 shadow-[0_0_20px_-10px_rgba(16,185,129,0.2)]' 
                                : 'border-zinc-800 hover:border-indigo-500/50 hover:shadow-[0_0_20px_-10px_rgba(99,102,241,0.2)]'
                            }`}
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className={`p-3.5 rounded-2xl transition-colors ${isDone ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-800 text-zinc-400 group-hover:text-indigo-400 group-hover:bg-indigo-500/10'}`}>
                                    {topic.icon}
                                </div>
                                {isDone && (
                                    <div className="bg-emerald-500/20 text-emerald-400 p-1 rounded-full">
                                        <CheckCircle2 className="w-4 h-4" />
                                    </div>
                                )}
                            </div>
                            
                            <h3 className="text-xl font-bold text-zinc-100 mb-2 group-hover:text-indigo-400 transition-colors">{topic.title}</h3>
                            
                            <div className="flex items-center gap-2 mb-4 text-xs font-medium">
                                <span className={`px-2 py-0.5 rounded border ${
                                    topic.difficulty === 'Easy' ? 'border-emerald-900 bg-emerald-900/20 text-emerald-400' :
                                    topic.difficulty === 'Medium' ? 'border-yellow-900 bg-yellow-900/20 text-yellow-400' :
                                    'border-red-900 bg-red-900/20 text-red-400'
                                }`}>
                                    {topic.difficulty}
                                </span>
                                <span className="text-zinc-500 flex items-center gap-1">
                                    <Star className="w-3 h-3" /> {topic.source}
                                </span>
                            </div>

                            <p className="text-zinc-500 text-sm mb-6 line-clamp-2 leading-relaxed">
                              {topic.description}
                            </p>

                            <div className="pt-4 border-t border-zinc-800 flex items-center justify-between text-xs font-medium text-zinc-400 group-hover:text-zinc-300">
                                <span>{topic.category}</span>
                                <span className="flex items-center gap-1 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                    Start Learning <ArrowLeft className="w-3 h-3 rotate-180" />
                                </span>
                            </div>
                        </div>
                    );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
