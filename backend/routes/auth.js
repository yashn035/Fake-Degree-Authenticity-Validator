import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        if (!fullName || !email || !password || password.length < 6) {
            return res.status(400).json({ error: 'Invalid input data' });
        }
        
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        const user = await User.create({ fullName, email, password });
        res.json({ success: true, user });
    } catch (err) {
        res.status(500).json({ error: 'Registration failed' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findByEmail(email);
        
        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const payload = { id: user.id, email: user.email, fullName: user.full_name, role: user.role };
        const secret = process.env.JWT_SECRET || 'super_secret_jwt_key_change_this_in_production';
        const token = jwt.sign(payload, secret, { expiresIn: '7d' });

        res.json({ success: true, token, user: payload });
    } catch (err) {
        res.status(500).json({ error: 'Login failed' });
    }
});

router.get('/me', authenticate, (req, res) => {
    res.json({ user: req.user });
});

export default router;
