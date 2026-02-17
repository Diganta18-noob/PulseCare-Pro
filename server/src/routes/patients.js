const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const patientService = require('../services/patientService');

const router = express.Router();

// GET /api/patients — ADMIN and DOCTOR only (PATIENT gets 403)
router.get('/', authenticate, authorize('ADMIN', 'DOCTOR'), async (req, res, next) => {
    try {
        const { sortBy, order } = req.query;
        const patients = await patientService.getAllPatients(sortBy, order);
        res.json({ patients });
    } catch (error) {
        next(error);
    }
});

// GET /api/patients/:id
router.get('/:id', authenticate, authorize('ADMIN', 'DOCTOR'), async (req, res, next) => {
    try {
        const patient = await patientService.getPatientById(req.params.id);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.json({ patient });
    } catch (error) {
        next(error);
    }
});

// DELETE /api/patients/:id
router.delete('/:id', authenticate, authorize('ADMIN'), async (req, res, next) => {
    try {
        const result = await patientService.deletePatient(req.params.id);
        res.json(result);
    } catch (error) {
        if (error.message === 'PATIENT_NOT_FOUND') {
            return res.status(404).json({ message: 'Patient not found' });
        }
        next(error);
    }
});

module.exports = router;
