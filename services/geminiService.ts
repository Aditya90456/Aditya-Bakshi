import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { ChatMessage, FileData } from "../types";

const SYSTEM_INSTRUCTION = `You are Codex, an expert AI coding assistant integrated into "Codex Playground", a web-based code editor.
Your goal is to help users write, debug, refactor, and understand code in various languages including JavaScript, TypeScript, Python, Java, and C++.

Guidelines:
1.  **Concise & Accurate**: Provide code snippets that are ready to run. Avoid fluff.
2.  **Context Aware**: You will be provided with the currently active file's content and language. Use this to give relevant answers.
3.  **Modern Standards**: Prefer modern ES6+ for JS/TS, Python 3.10+, Java 17+, C++17+, etc.
4.  **Formatting**: Use Markdown for code blocks.
5.  **Tone**: Professional, encouraging, and technically precise.

If asked to "fix" or "refactor", provide the full corrected code block so the user can copy it easily.`;

let chatSession: Chat | null = null;
let currentModel: string = 'gemini-2.5-flash';

// Initialize the API client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const initChat = () => {
  chatSession = ai.chats.create({
    model: currentModel,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7,
      maxOutputTokens: 2000,
    },
  });
};

export const sendMessageStream = async (
  message: string,
  activeFile: FileData,
  onChunk: (text: string) => void
): Promise<string> => {
  if (!chatSession) {
    initChat();
  }

  // Inject context about the current file without overloading the history visually
  // We send it as part of the user message but format it clearly for the model
  const contextAwareMessage = `
[CONTEXT: Active File - ${activeFile.name} (${activeFile.language})]
\`\`\`${activeFile.language}
${activeFile.content}
\`\`\`

USER REQUEST:
${message}
`;

  try {
    const resultStream = await chatSession!.sendMessageStream({
        message: contextAwareMessage
    });

    let fullResponse = "";
    for await (const chunk of resultStream) {
        const chunkText = (chunk as GenerateContentResponse).text || "";
        fullResponse += chunkText;
        onChunk(fullResponse);
    }
    return fullResponse;

  } catch (error) {
    console.error("Gemini API Error:", error);
    const errorMessage = "\n\n(Error: Failed to connect to AI service. Please check your connection or API key.)";
    onChunk(errorMessage);
    return errorMessage;
  }
};

// Simulate execution for non-browser languages
export const simulateCodeExecution = async (code: string, language: string): Promise<string> => {
  const prompt = `
You are a code execution engine for Codex Playground. 
Task: Simulate the execution of the following ${language} code and return ONLY the console output (stdout) or runtime errors. 
Do not explain the code. Do not wrap in markdown blocks unless strictly necessary for formatting the output itself.
If the code has no output, return "No output."

Code:
${code}
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "No output generated.";
  } catch (error) {
    console.error("Simulation Error:", error);
    return "Error: Could not simulate execution via AI.";
  }
};

// Dry Run Analysis
export const analyzeCodeDryRun = async (code: string, language: string): Promise<string> => {
  const prompt = `
Task: Perform a "Dry Run" static analysis of the following ${language} code.
1. Check for syntax errors.
2. Check for logical flaws or infinite loops.
3. Predict the behavior.

Format the output as a concise Markdown summary with bullet points. 
Start with "✅ No critical issues found" if it looks good, or "⚠️ Issues found" if there are problems.

Code:
${code}
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "No analysis generated.";
  } catch (error) {
    console.error("Dry Run Error:", error);
    return "Error: Could not perform dry run analysis.";
  }
};

// Generate Unit Tests
export const generateUnitTests = async (code: string, language: string, filename: string): Promise<string> => {
  const prompt = `
Task: Generate a complete unit test file for the following code.
Context:
- Language: ${language}
- Filename: ${filename}

Requirements:
- Use standard testing frameworks:
  - JavaScript/TypeScript: Jest or Vitest
  - Python: unittest or pytest
  - Java: JUnit
  - C++: Google Test or Catch2
- Include necessary imports (assume the file is in the same directory).
- Cover edge cases and happy paths.
- Return ONLY the raw code for the test file. Do not wrap in markdown code blocks (\`\`\`) if possible, or I will have to strip them. Just the code.

Code:
${code}
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    let text = response.text || "";
    // Basic cleanup if the model wraps it in markdown despite instructions
    text = text.replace(/^```[a-z]*\n/i, '').replace(/\n```$/, '');
    return text;
  } catch (error) {
    console.error("Test Generation Error:", error);
    return "// Error: Failed to generate unit tests.";
  }
};