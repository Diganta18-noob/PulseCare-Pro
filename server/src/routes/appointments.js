import express from 'express';
import Appointment from '../models/Appointment.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

/* ── Get All Appointments ── */
router.get('/', authenticate, async (req, res, next) => {
    try {
        const { sortBy = 'date', sortOrder = 'desc' } = req.query;
        const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

        let filter = {};
        // Doctors only see their own appointments
        if (req.user.role === 'DOCTOR') filter.doctor = req.user._id;
        // Patients see their linked appointments only (if patient record has user ref)
        // For simplicity, patients see all SCHEDULED appointments
        
        const appointments = await Appointment.find(filter)
            .sort(sort)
            .populate('patient', 'firstName lastName bloodGroup')
            .populate('doctor', 'profile')
            .lean();

        res.json(appointments);
    } catch (err) { next(err); }
});

/* ── Book Appointment ── */
router.post('/', authenticate, authorize('ADMIN', 'DOCTOR'), async (req, res, next) => {
    try {
        const { patientId, doctorId, date, time, reason, notes } = req.body;
        if (!patientId || !doctorId || !date || !time) {
            return res.status(400).json({ message: 'patientId, doctorId, date and time are required' });
        }
        const appointment = await Appointment.create({
            patient: patientId,
            doctor: doctorId,
            date: new Date(date),
            time,
            reason,
            notes,
            status: 'SCHEDULED',
        });
        const populated = await appointment.populate([
            { path: 'patient', select: 'firstName lastName' },
            { path: 'doctor', select: 'profile' },
        ]);
        res.status(201).json(populated);
    } catch (err) { next(err); }
});

/* ── Update Appointment Status ── */
router.patch('/:id/status', authenticate, authorize('ADMIN', 'DOCTOR'), async (req, res, next) => {
    try {
        const { status } = req.body;
        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
        res.json(appointment);
    } catch (err) { next(err); }
});

/* ── Delete Appointment ── */
router.delete('/:id', authenticate, authorize('ADMIN'), async (req, res, next) => {
    try {
        await Appointment.findByIdAndDelete(req.params.id);
        res.json({ message: 'Appointment deleted' });
    } catch (err) { next(err); }
});

export default router;
