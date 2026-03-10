import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
    patient:  { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctor:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date:     { type: Date, required: true },
    time:     { type: String, required: true },
    reason:   { type: String },
    notes:    { type: String },
    status:   { type: String, enum: ['SCHEDULED', 'COMPLETED', 'CANCELLED'], default: 'SCHEDULED' },
}, { timestamps: true });

export default mongoose.model('Appointment', appointmentSchema);
