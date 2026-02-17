const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res, next) => {
    try {
        const { email, password, role, firstName, lastName, phone, specialization, licenseNo, dateOfBirth, bloodGroup } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already in use' });
        }

        const passwordHash = await bcrypt.hash(password, 12);
        const userRole = ['ADMIN', 'DOCTOR', 'PATIENT'].includes(role) ? role : 'PATIENT';

        const user = await prisma.user.create({
            data: {
                email,
                passwordHash,
                role: userRole,
                profile: {
                    create: {
                        firstName: firstName || '',
                        lastName: lastName || '',
                        phone: phone || null,
                    },
                },
                ...(userRole === 'DOCTOR' && {
                    doctor: {
                        create: {
                            specialization: specialization || 'General',
                            licenseNo: licenseNo || `LIC-${Date.now()}`,
                        },
                    },
                }),
                ...(userRole === 'PATIENT' && {
                    patient: {
                        create: {
                            dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
                            bloodGroup: bloodGroup || null,
                        },
                    },
                }),
            },
            include: { profile: true, doctor: true, patient: true },
        });

        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        const { passwordHash: _, ...userWithoutPassword } = user;
        res.status(201).json({ user: userWithoutPassword });
    } catch (error) {
        next(error);
    }
});

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: { email },
            include: { profile: true, doctor: true, patient: true },
        });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, user.passwordHash);
        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        const { passwordHash: _, ...userWithoutPassword } = user;
        res.json({ user: userWithoutPassword });
    } catch (error) {
        next(error);
    }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
});

// GET /api/auth/me
router.get('/me', authenticate, async (req, res, next) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
            include: { profile: true, doctor: true, patient: true },
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { passwordHash: _, ...userWithoutPassword } = user;
        res.json({ user: userWithoutPassword });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
