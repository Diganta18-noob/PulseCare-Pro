import express from 'express';
import Patient from '../models/Patient.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

/* ── Get All Patients ── */
router.get('/', authenticate, authorize('ADMIN', 'DOCTOR'), async (req, res, next) => {
    try {
        const { sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
        const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
        const patients = await Patient.find().sort(sort).lean();
        res.json(patients);
    } catch (err) { next(err); }
});

/* ── Get Patient by ID ── */
router.get('/:id', authenticate, async (req, res, next) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) return res.status(404).json({ message: 'Patient not found' });
        res.json(patient);
    } catch (err) { next(err); }
});

/* ── Create Patient ── */
router.post('/', authenticate, authorize('ADMIN', 'DOCTOR'), async (req, res, next) => {
    try {
        const patient = await Patient.create(req.body);
        res.status(201).json(patient);
    } catch (err) { next(err); }
});

/* ── Update Patient ── */
router.put('/:id', authenticate, authorize('ADMIN', 'DOCTOR'), async (req, res, next) => {
    try {
        const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!patient) return res.status(404).json({ message: 'Patient not found' });
        res.json(patient);
    } catch (err) { next(err); }
});

/* ── Delete Patient ── */
router.delete('/:id', authenticate, authorize('ADMIN'), async (req, res, next) => {
    try {
        await Patient.findByIdAndDelete(req.params.id);
        res.json({ message: 'Patient deleted' });
    } catch (err) { next(err); }
});

export default router;
