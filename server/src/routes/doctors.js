import express from 'express';
import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

/* ── Get All Doctors ── */
router.get('/', authenticate, async (req, res, next) => {
    try {
        const doctors = await User.find({ role: 'DOCTOR' })
            .select('_id profile email')
            .lean();
        res.json(doctors);
    } catch (err) { next(err); }
});

export default router;
