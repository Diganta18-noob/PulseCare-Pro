const prisma = require('../lib/prisma');

const createAppointment = async (data) => {
    return await prisma.$transaction(async (tx) => {
        // 1. Check if doctor is already booked at that specific time
        const existing = await tx.appointment.findFirst({
            where: {
                doctorId: data.doctorId,
                appointmentTime: data.appointmentTime,
            },
        });

        if (existing) {
            throw new Error('DOCTOR_BUSY');
        }

        // 2. If free, create the appointment
        return await tx.appointment.create({
            data: {
                doctorId: data.doctorId,
                patientId: data.patientId,
                appointmentTime: data.appointmentTime,
                notes: data.notes || null,
            },
            include: {
                doctor: { include: { user: { include: { profile: true } } } },
                patient: { include: { user: { include: { profile: true } } } },
            },
        });
    });
};

const getAllAppointments = async (sortBy = 'appointmentTime', order = 'asc') => {
    const validSortFields = ['appointmentTime', 'status', 'createdAt'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'appointmentTime';
    const sortOrder = order === 'desc' ? 'desc' : 'asc';

    return await prisma.appointment.findMany({
        orderBy: { [sortField]: sortOrder },
        include: {
            doctor: { include: { user: { include: { profile: true } } } },
            patient: { include: { user: { include: { profile: true } } } },
        },
    });
};

const getAppointmentById = async (id) => {
    return await prisma.appointment.findUnique({
        where: { id },
        include: {
            doctor: { include: { user: { include: { profile: true } } } },
            patient: { include: { user: { include: { profile: true } } } },
        },
    });
};

const deleteAppointment = async (id) => {
    return await prisma.appointment.delete({ where: { id } });
};

module.exports = {
    createAppointment,
    getAllAppointments,
    getAppointmentById,
    deleteAppointment,
};
