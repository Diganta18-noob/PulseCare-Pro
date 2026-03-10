import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
    user:           { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    specialization: { type: String, required: true },
    license:        { type: String },
}, { timestamps: true });

export default mongoose.model('Doctor', doctorSchema);
