import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
    user:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, sparse: true },
    firstName:     { type: String, required: true },
    lastName:      { type: String, required: true },
    email:         { type: String },
    phone:         { type: String },
    dateOfBirth:   { type: Date },
    gender:        { type: String, enum: ['MALE', 'FEMALE', 'OTHER'], default: 'MALE' },
    bloodGroup:    { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], default: 'O+' },
    address:       { type: String },
    medicalHistory:{ type: String },
}, { timestamps: true });

export default mongoose.model('Patient', patientSchema);
