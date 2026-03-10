import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';

import authRoutes        from './routes/auth.js';
import dashboardRoutes   from './routes/dashboard.js';
import patientsRoutes    from './routes/patients.js';
import appointmentsRoutes from './routes/appointments.js';
import doctorsRoutes     from './routes/doctors.js';

const app = express();
const PORT = process.env.PORT || 5000;

/* ── Middleware ── */
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

/* ── Routes ── */
app.use('/api/auth',         authRoutes);
app.use('/api/dashboard',    dashboardRoutes);
app.use('/api/patients',     patientsRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/doctors',      doctorsRoutes);

/* ── Global Error Handler ── */
app.use((err, req, res, next) => {
    console.error('[Server Error]', err.message);
    res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

/* ── MongoDB Connect & Start ── */
const MONGO_URI = process.env.MONGODB_URI || process.env.DATABASE_URL;
if (!MONGO_URI || MONGO_URI.startsWith('postgresql')) {
    console.error('❌ MONGODB_URI is not set or is still the PostgreSQL placeholder. Please update server/.env');
    process.exit(1);
}

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('✅ MongoDB connected');
        app.listen(PORT, () => console.log(`🏥 PulseCare Pro server running on port ${PORT}`));
    })
    .catch(err => {
        console.error('❌ MongoDB connection error:', err.message);
        process.exit(1);
    });
