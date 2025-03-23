import express from 'express';
import fs from 'fs/promises';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// ===== ЛОГИН =====
app.post('/api/login', (req, res) => {
    const { password } = req.body;

    if (password !== process.env.ADMIN_PASSWORD) {
        return res.status(401).json({ error: 'Неверный пароль' });
    }

    const token = jwt.sign({ user: 'admin' }, process.env.JWT_SECRET, { expiresIn: '2h' });
    res.json({ token });
});

// ===== ЧТЕНИЕ ПОСТОВ =====
app.get('/api/posts', authenticateToken, async (req, res) => {
    try {
        const data = await fs.readFile('./data/posts.json', 'utf-8');
        res.json(JSON.parse(data));
    } catch (e) {
        res.status(500).json({ error: 'Ошибка чтения постов' });
    }
});

// ===== СОХРАНЕНИЕ ПОСТОВ =====
app.post('/api/posts', authenticateToken, async (req, res) => {
    try {
        const postData = req.body;
        await fs.writeFile('./data/posts.json', JSON.stringify(postData, null, 2), 'utf-8');
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: 'Ошибка сохранения постов' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
});
