const express = require('express');
const { authenticate } = require('../middleware/auth');
const doctorService = require('../services/doctorService');

const router = express.Router();

// GET /api/doctors
router.get('/', authenticate, async (req, res, next) => {
    try {
        const doctors = await doctorService.getAllDoctors();
        res.json({ doctors });
    } catch (error) {
        next(error);
    }
});

// GET /api/doctors/:id
router.get('/:id', authenticate, async (req, res, next) => {
    try {
        const doctor = await doctorService.getDoctorById(req.params.id);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        res.json({ doctor });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
