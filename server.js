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

// --- DATABASE SETUP (Simple JSON File) ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'users.json');

// Ensure DB file exists
if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2));
}

// Helper to Read/Write DB
const readUsers = () => {
    try {
        const data = fs.readFileSync(DB_FILE, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
};

const writeUsers = (users) => {
    fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2));
};

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

// --- PRODUCTION SERVING ---
// If running in production, serve the React build
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    
    app.get('*', (req, res) => {
        // Exclude API routes from wildcard
        if (req.path.startsWith('/api')) return res.status(404).json({ error: 'API Not Found' });
        res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
}

app.listen(PORT, () => {
  console.log(`Codex Backend running on port ${PORT}`);
  console.log(`Database file: ${DB_FILE}`);
});