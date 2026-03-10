import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

const setCookie = (res, token) => res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
});

/* ── Register ── */
router.post('/register', async (req, res, next) => {
    try {
        const { email, password, firstName, lastName, phone, role, specialization } = req.body;
        if (!email || !password || !firstName || !lastName) {
            return res.status(400).json({ message: 'Required fields missing' });
        }

        const existing = await User.findOne({ email });
        if (existing) return res.status(409).json({ message: 'Email already in use' });

        const user = await User.create({
            email,
            password,
            role: role?.toUpperCase() || 'PATIENT',
            profile: { firstName, lastName, phone },
        });

        // If doctor role, create doctor profile
        if (user.role === 'DOCTOR') {
            await Doctor.create({
                user: user._id,
                specialization: specialization || 'General',
            });
        }

        const token = signToken(user._id);
        setCookie(res, token);
        res.status(201).json({ message: 'Account created', user });
    } catch (err) { next(err); }
});

/* ── Login ── */
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = signToken(user._id);
        setCookie(res, token);
        res.json({ message: 'Login successful', user });
    } catch (err) { next(err); }
});

/* ── Logout ── */
router.post('/logout', (req, res) => {
    res.clearCookie('token').json({ message: 'Logged out' });
});

/* ── Me ── */
router.get('/me', authenticate, (req, res) => {
    res.json({ user: req.user });
});

export default router;
