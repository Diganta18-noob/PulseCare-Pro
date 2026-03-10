import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../src/models/User.js';
import Doctor from '../src/models/Doctor.js';
import Patient from '../src/models/Patient.js';
import Appointment from '../src/models/Appointment.js';

const MONGO_URI = process.env.MONGODB_URI;
if (!MONGO_URI) { console.error('❌ MONGODB_URI not set in .env'); process.exit(1); }

async function seed() {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB...');

    await Promise.all([User.deleteMany(), Doctor.deleteMany(), Patient.deleteMany(), Appointment.deleteMany()]);
    console.log('🗑️  Cleared existing data');

    const admin = await User.create({
        email: 'admin@pulsecare.com', password: 'Admin1234', role: 'ADMIN',
        profile: { firstName: 'Sarah', lastName: 'Admin', phone: '+1-555-0100' },
    });

    const doctorUser = await User.create({
        email: 'doctor@pulsecare.com', password: 'Doctor1234', role: 'DOCTOR',
        profile: { firstName: 'Dr. James', lastName: 'Wilson', phone: '+1-555-0101' },
    });

    const patientUser = await User.create({
        email: 'patient@pulsecare.com', password: 'Patient1234', role: 'PATIENT',
        profile: { firstName: 'Emily', lastName: 'Johnson', phone: '+1-555-0102' },
    });

    const doc2 = await User.create({
        email: 'patel@pulsecare.com', password: 'Doctor1234', role: 'DOCTOR',
        profile: { firstName: 'Dr. Priya', lastName: 'Patel', phone: '+1-555-0103' },
    });
    const doc3 = await User.create({
        email: 'chen@pulsecare.com', password: 'Doctor1234', role: 'DOCTOR',
        profile: { firstName: 'Dr. Michael', lastName: 'Chen', phone: '+1-555-0104' },
    });

    await Doctor.create({ user: doctorUser._id, specialization: 'Cardiology', license: 'MD-1001' });
    await Doctor.create({ user: doc2._id, specialization: 'Neurology', license: 'MD-1002' });
    await Doctor.create({ user: doc3._id, specialization: 'Pediatrics', license: 'MD-1003' });

    const patients = await Patient.insertMany([
        { firstName: 'Alice', lastName: 'Johnson', email: 'alice@example.com', phone: '+1-555-2001', dateOfBirth: new Date('1985-04-12'), gender: 'FEMALE', bloodGroup: 'A+', address: '123 Oak St', medicalHistory: 'Hypertension' },
        { firstName: 'Bob', lastName: 'Smith', email: 'bob@example.com', phone: '+1-555-2002', dateOfBirth: new Date('1978-08-23'), gender: 'MALE', bloodGroup: 'O+', address: '456 Elm St', medicalHistory: 'Diabetes Type 2' },
        { firstName: 'Carol', lastName: 'Williams', email: 'carol@example.com', phone: '+1-555-2003', dateOfBirth: new Date('1990-11-05'), gender: 'FEMALE', bloodGroup: 'B+', address: '789 Pine Ave', medicalHistory: 'Asthma' },
        { firstName: 'David', lastName: 'Brown', email: 'david@example.com', phone: '+1-555-2004', dateOfBirth: new Date('1963-07-15'), gender: 'MALE', bloodGroup: 'AB+', address: '321 Maple Rd', medicalHistory: 'Arthritis' },
        { firstName: 'Eva', lastName: 'Davis', email: 'eva@example.com', phone: '+1-555-2005', dateOfBirth: new Date('2001-02-28'), gender: 'FEMALE', bloodGroup: 'O-', address: '654 Cedar Ln', medicalHistory: 'None' },
        { firstName: 'Frank', lastName: 'Miller', email: 'frank@example.com', phone: '+1-555-2006', dateOfBirth: new Date('1955-09-10'), gender: 'MALE', bloodGroup: 'A-', address: '987 Birch Blvd', medicalHistory: 'Chronic back pain' },
        { firstName: 'Grace', lastName: 'Wilson', email: 'grace@example.com', phone: '+1-555-2007', dateOfBirth: new Date('1998-06-18'), gender: 'FEMALE', bloodGroup: 'B-', address: '135 Willow Way', medicalHistory: 'Migraine' },
        { firstName: 'Henry', lastName: 'Moore', email: 'henry@example.com', phone: '+1-555-2008', dateOfBirth: new Date('1972-12-30'), gender: 'MALE', bloodGroup: 'AB-', address: '246 Spruce St', medicalHistory: 'Thyroid disorder' },
    ]);

    const today = new Date();
    await Appointment.insertMany([
        { patient: patients[0]._id, doctor: doctorUser._id, date: today, time: '09:00', reason: 'Annual checkup', status: 'SCHEDULED' },
        { patient: patients[1]._id, doctor: doc2._id, date: today, time: '10:30', reason: 'Follow-up on diabetes', status: 'SCHEDULED' },
        { patient: patients[2]._id, doctor: doc3._id, date: today, time: '14:00', reason: 'Asthma management', status: 'COMPLETED' },
        { patient: patients[3]._id, doctor: doctorUser._id, date: new Date(today.getTime() - 86400000), time: '11:00', reason: 'Arthritis pain', status: 'COMPLETED' },
        { patient: patients[4]._id, doctor: doc2._id, date: new Date(today.getTime() + 86400000), time: '13:30', reason: 'Headache evaluation', status: 'SCHEDULED' },
        { patient: patients[5]._id, doctor: doc3._id, date: new Date(today.getTime() - 2 * 86400000), time: '08:00', reason: 'Back pain', status: 'CANCELLED' },
        { patient: patients[6]._id, doctor: doctorUser._id, date: new Date(today.getTime() + 2 * 86400000), time: '15:00', reason: 'Migraine follow-up', status: 'SCHEDULED' },
    ]);

    console.log('🌱 Seeded: 5 users, 3 doctor profiles, 8 patients, 7 appointments');
    console.log('\n🔐 Demo credentials:');
    console.log('   Admin  → admin@pulsecare.com / Admin1234');
    console.log('   Doctor → doctor@pulsecare.com / Doctor1234');
    console.log('   Patient→ patient@pulsecare.com / Patient1234');
    await mongoose.disconnect();
    console.log('✅ Done!');
}

seed().catch(e => { console.error(e); process.exit(1); });
