const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
    // Clean existing data
    await prisma.appointment.deleteMany();
    await prisma.patient.deleteMany();
    await prisma.doctor.deleteMany();
    await prisma.profile.deleteMany();
    await prisma.user.deleteMany();

    const hash = await bcrypt.hash('password123', 10);

    // ── Admin ──
    await prisma.user.create({
        data: {
            email: 'admin@pulsecare.com', passwordHash: hash, role: 'ADMIN',
            profile: { create: { firstName: 'System', lastName: 'Admin', phone: '555-000-0000' } },
        },
    });

    // ── Doctors ──
    const doctorsData = [
        { email: 'dr.smith@pulsecare.com', first: 'James', last: 'Smith', spec: 'Cardiology', lic: 'LIC-001' },
        { email: 'dr.johnson@pulsecare.com', first: 'Emily', last: 'Johnson', spec: 'Neurology', lic: 'LIC-002' },
        { email: 'dr.williams@pulsecare.com', first: 'Michael', last: 'Williams', spec: 'Orthopedics', lic: 'LIC-003' },
        { email: 'dr.brown@pulsecare.com', first: 'Sarah', last: 'Brown', spec: 'Pediatrics', lic: 'LIC-004' },
        { email: 'dr.davis@pulsecare.com', first: 'David', last: 'Davis', spec: 'Dermatology', lic: 'LIC-005' },
        { email: 'dr.garcia@pulsecare.com', first: 'Maria', last: 'Garcia', spec: 'General Medicine', lic: 'LIC-006' },
        { email: 'dr.martinez@pulsecare.com', first: 'Carlos', last: 'Martinez', spec: 'Ophthalmology', lic: 'LIC-007' },
    ];

    const doctors = [];
    for (const d of doctorsData) {
        const doc = await prisma.user.create({
            data: {
                email: d.email, passwordHash: hash, role: 'DOCTOR',
                profile: { create: { firstName: d.first, lastName: d.last, phone: `555-${String(doctors.length + 1).padStart(3, '0')}-1000` } },
                doctor: { create: { specialization: d.spec, licenseNo: d.lic } },
            },
            include: { doctor: true },
        });
        doctors.push(doc.doctor);
    }

    // ── Patients ──
    const patientsData = [
        { email: 'alice@example.com', first: 'Alice', last: 'Cooper', dob: '1990-03-15', blood: 'A+' },
        { email: 'bob@example.com', first: 'Bob', last: 'Miller', dob: '1985-07-22', blood: 'B+' },
        { email: 'carol@example.com', first: 'Carol', last: 'Wilson', dob: '1995-11-08', blood: 'O-' },
        { email: 'david@example.com', first: 'David', last: 'Taylor', dob: '1988-01-30', blood: 'AB+' },
        { email: 'emma@example.com', first: 'Emma', last: 'Thomas', dob: '1992-06-12', blood: 'A-' },
        { email: 'frank@example.com', first: 'Frank', last: 'Jackson', dob: '1978-09-25', blood: 'B-' },
        { email: 'grace@example.com', first: 'Grace', last: 'Harris', dob: '2000-02-14', blood: 'O+' },
        { email: 'henry@example.com', first: 'Henry', last: 'Clark', dob: '1982-12-03', blood: 'A+' },
        { email: 'isabel@example.com', first: 'Isabel', last: 'Lewis', dob: '1998-04-19', blood: 'B+' },
        { email: 'jack@example.com', first: 'Jack', last: 'Robinson', dob: '1975-08-07', blood: 'AB-' },
        { email: 'kate@example.com', first: 'Kate', last: 'Walker', dob: '1993-10-21', blood: 'O+' },
        { email: 'leo@example.com', first: 'Leo', last: 'Hall', dob: '1986-05-16', blood: 'A+' },
        { email: 'mia@example.com', first: 'Mia', last: 'Allen', dob: '2001-01-28', blood: 'B-' },
        { email: 'noah@example.com', first: 'Noah', last: 'Young', dob: '1991-07-09', blood: 'O-' },
        { email: 'olivia@example.com', first: 'Olivia', last: 'King', dob: '1997-03-11', blood: 'AB+' },
        { email: 'peter@example.com', first: 'Peter', last: 'Wright', dob: '1980-11-30', blood: 'A-' },
        { email: 'quinn@example.com', first: 'Quinn', last: 'Scott', dob: '1994-09-05', blood: 'B+' },
        { email: 'rachel@example.com', first: 'Rachel', last: 'Adams', dob: '1987-06-18', blood: 'O+' },
        { email: 'sam@example.com', first: 'Sam', last: 'Baker', dob: '1999-12-25', blood: 'A+' },
        { email: 'tina@example.com', first: 'Tina', last: 'Nelson', dob: '1983-04-02', blood: 'AB-' },
    ];

    const patients = [];
    for (const p of patientsData) {
        const pat = await prisma.user.create({
            data: {
                email: p.email, passwordHash: hash, role: 'PATIENT',
                profile: { create: { firstName: p.first, lastName: p.last, phone: `555-${String(patients.length + 1).padStart(3, '0')}-2000` } },
                patient: { create: { dateOfBirth: new Date(p.dob), bloodGroup: p.blood } },
            },
            include: { patient: true },
        });
        patients.push(pat.patient);
    }

    // ── Appointments ──
    const reasons = [
        'Annual checkup', 'Follow-up consultation', 'Blood pressure monitoring',
        'Skin examination', 'Vision test', 'Joint pain assessment', 'Headache evaluation',
        'Routine physical', 'Vaccination', 'Lab results review',
        'Chest pain evaluation', 'Allergy testing', 'Post-surgery follow-up',
        'Mental health screening', 'Diabetes management',
        'Prenatal visit', 'Back pain', 'Ear infection', 'Sleep disorder', 'Diet consultation',
    ];

    const now = new Date();
    let created = 0;
    for (let i = 0; i < 25; i++) {
        const daysOffset = Math.floor(Math.random() * 30) - 10;
        const hour = 8 + Math.floor(Math.random() * 10);
        const date = new Date(now);
        date.setDate(date.getDate() + daysOffset);
        date.setHours(hour, i % 2 === 0 ? 0 : 30, 0, 0);

        const status = daysOffset < -1 ? (Math.random() > 0.2 ? 'COMPLETED' : 'CANCELLED') : 'SCHEDULED';

        try {
            await prisma.appointment.create({
                data: {
                    patientId: patients[i % patients.length].id,
                    doctorId: doctors[i % doctors.length].id,
                    appointmentTime: date,
                    notes: reasons[i % reasons.length],
                    status,
                },
            });
            created++;
        } catch (e) {
            // skip duplicate doctorId + time conflicts
        }
    }

    console.log(`✅ Seed complete: 1 admin, ${doctors.length} doctors, ${patients.length} patients, ${created} appointments`);
}

main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());
