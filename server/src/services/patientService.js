const prisma = require('../lib/prisma');

const getAllPatients = async (sortBy = 'createdAt', order = 'desc') => {
    const validSortFields = ['createdAt', 'dateOfBirth'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const sortOrder = order === 'desc' ? 'desc' : 'asc';

    return await prisma.patient.findMany({
        orderBy: { [sortField]: sortOrder },
        include: {
            user: {
                include: { profile: true },
            },
        },
    });
};

const getPatientById = async (id) => {
    return await prisma.patient.findUnique({
        where: { id },
        include: {
            user: { include: { profile: true } },
            appointments: {
                include: {
                    doctor: { include: { user: { include: { profile: true } } } },
                },
                orderBy: { appointmentTime: 'desc' },
            },
        },
    });
};

const deletePatient = async (id) => {
    const patient = await prisma.patient.findUnique({ where: { id } });
    if (!patient) throw new Error('PATIENT_NOT_FOUND');

    // Delete the user (cascades to profile + patient)
    await prisma.user.delete({ where: { id: patient.userId } });
    return { message: 'Patient deleted successfully' };
};

module.exports = {
    getAllPatients,
    getPatientById,
    deletePatient,
};
