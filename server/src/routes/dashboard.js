import express from 'express';
import User from '../models/User.js';
import Patient from '../models/Patient.js';
import Appointment from '../models/Appointment.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/stats', authenticate, authorize('ADMIN', 'DOCTOR'), async (req, res, next) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const [totalPatients, totalDoctors, totalAppointments, appointmentsToday] = await Promise.all([
            Patient.countDocuments(),
            User.countDocuments({ role: 'DOCTOR' }),
            Appointment.countDocuments(),
            Appointment.countDocuments({ date: { $gte: today, $lt: tomorrow } }),
        ]);

        res.json({ stats: { totalPatients, totalDoctors, totalAppointments, appointmentsToday } });
    } catch (err) { next(err); }
});

export default router;
