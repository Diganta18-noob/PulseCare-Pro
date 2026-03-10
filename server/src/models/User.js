import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const profileSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName:  { type: String, required: true },
    phone:     { type: String },
    avatarUrl: { type: String },
});

const userSchema = new mongoose.Schema({
    email:    { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role:     { type: String, enum: ['ADMIN', 'DOCTOR', 'PATIENT'], default: 'PATIENT' },
    profile:  profileSchema,
}, { timestamps: true });

// Hash password before save
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = function (plain) {
    return bcrypt.compare(plain, this.password);
};

// Never return password
userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

export default mongoose.model('User', userSchema);
