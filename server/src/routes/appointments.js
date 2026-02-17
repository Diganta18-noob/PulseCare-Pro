const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const appointmentService = require('../services/appointmentService');

const router = express.Router();

// GET /api/appointments
router.get('/', authenticate, async (req, res, next) => {
    try {
        const { sortBy, order } = req.query;
        const appointments = await appointmentService.getAllAppointments(sortBy, order);
        res.json({ appointments });
    } catch (error) {
        next(error);
    }
});

// GET /api/appointments/:id
router.get('/:id', authenticate, async (req, res, next) => {
    try {
        const appointment = await appointmentService.getAppointmentById(req.params.id);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        res.json({ appointment });
    } catch (error) {
        next(error);
    }
});

// POST /api/appointments — Atomic booking with transaction
router.post('/', authenticate, authorize('ADMIN', 'DOCTOR', 'PATIENT'), async (req, res, next) => {
    try {
        const appointment = await appointmentService.createAppointment(req.body);
        res.status(201).json({ appointment });
    } catch (error) {
        if (error.message === 'DOCTOR_BUSY') {
            return res.status(409).json({
                message: 'This doctor is already booked at the selected time. Please choose a different time slot.',
            });
        }
        next(error);
    }
});

// DELETE /api/appointments/:id
router.delete('/:id', authenticate, authorize('ADMIN', 'DOCTOR'), async (req, res, next) => {
    try {
        await appointmentService.deleteAppointment(req.params.id);
        res.json({ message: 'Appointment deleted successfully' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
