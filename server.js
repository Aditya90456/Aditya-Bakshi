import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increased limit for file/git data

// --- DATABASE SETUP (Hybrid: File System + In-Memory Fallback) ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Use /tmp for Vercel serverless environment (ephemeral but writable)
const DB_FILE = process.env.VERCEL ? path.join('/tmp', 'users.json') : path.join(__dirname, 'users.json');

// In-Memory Fallback for Read-Only Environments
let usersMemory = [];

// Helper to Read DB
const readUsers = () => {
    try {
        if (fs.existsSync(DB_FILE)) {
            const data = fs.readFileSync(DB_FILE, 'utf8');
            usersMemory = JSON.parse(data);
            return usersMemory;
        }
    } catch (e) {
        console.warn("FS Read Failed, using in-memory DB:", e.message);
    }
    return usersMemory;
};

// Helper to Write DB
const writeUsers = (users) => {
    usersMemory = users; // Always update memory
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2));
    } catch (e) {
        // Expected behavior on Vercel (Read-only file system outside /tmp)
        console.warn("FS Write Failed (Read-Only System?), using in-memory only.");
    }
};

// Initialize DB
if (!fs.existsSync(DB_FILE)) {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2));
    } catch (e) {
        console.log("Running in ephemeral mode (In-Memory DB)");
    }
} else {
    readUsers(); // Load initial state into memory
}

// --- API ROUTES ---

// 1. Login
app.post('/api/auth/login', (req, res) => {
    const { email } = req.body;
    const users = readUsers();
    const user = users.find(u => u.email === email);

    if (user) {
        res.json({ user });
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

// 2. Signup
app.post('/api/auth/signup', (req, res) => {
    const { email, name } = req.body;
    const users = readUsers();

    if (users.find(u => u.email === email)) {
        return res.status(400).json({ error: 'User already exists' });
    }

    const newUser = {
        email,
        name,
        level: 'Novice',
        points: 0,
        completedTopics: [],
        files: [], // Cloud save: files
        gitState: null
    };

    users.push(newUser);
    writeUsers(users);

    res.json({ user: newUser });
});

// 3. Sync User Data (Files, Points, Topics, Git)
app.post('/api/user/sync', (req, res) => {
    const { email, files, completedTopics, points, gitState } = req.body;
    const users = readUsers();
    const index = users.findIndex(u => u.email === email);

    if (index === -1) return res.status(404).json({ error: 'User not found' });

    const user = users[index];
    
    // Update fields if provided
    if (files) user.files = files;
    if (completedTopics) user.completedTopics = completedTopics;
    if (points !== undefined) user.points = points;
    if (gitState) user.gitState = gitState;
    
    // Recalculate level based on points
    if (user.points >= 1500) user.level = 'Architect';
    else if (user.points >= 800) user.level = 'Engineer';
    else if (user.points >= 300) user.level = 'Coder';
    else if (user.points >= 100) user.level = 'Apprentice';

    users[index] = user;
    writeUsers(users);

    res.json({ user });
});

// Vercel health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', mode: process.env.VERCEL ? 'serverless' : 'server' });
});

// --- SERVER STARTUP ---
// Only listen if run directly (node server.js). 
// On Vercel, the app is exported and handled by the platform.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    // If running in production locally, serve static files
    if (process.env.NODE_ENV === 'production') {
        app.use(express.static(path.join(__dirname, 'dist')));
        app.get('*', (req, res) => {
            if (req.path.startsWith('/api')) return res.status(404).json({ error: 'API Not Found' });
            res.sendFile(path.join(__dirname, 'dist', 'index.html'));
        });
    }

    app.listen(PORT, () => {
      console.log(`Codex Backend running on port ${PORT}`);
    });
}

export default app;