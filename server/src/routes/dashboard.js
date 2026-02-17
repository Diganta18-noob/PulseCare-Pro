const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const prisma = require('../lib/prisma');

const router = express.Router();

// GET /api/dashboard/stats
router.get('/stats', authenticate, authorize('ADMIN', 'DOCTOR'), async (req, res, next) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const [totalPatients, totalDoctors, totalAppointments, appointmentsToday] = await Promise.all([
            prisma.patient.count(),
            prisma.doctor.count(),
            prisma.appointment.count(),
            prisma.appointment.count({
                where: {
                    appointmentTime: { gte: today, lt: tomorrow },
                },
            }),
        ]);

        res.json({
            stats: {
                totalPatients,
                totalDoctors,
                totalAppointments,
                appointmentsToday,
            },
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
