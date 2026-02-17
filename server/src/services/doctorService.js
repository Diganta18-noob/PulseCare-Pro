const prisma = require('../lib/prisma');

const getAllDoctors = async () => {
    return await prisma.doctor.findMany({
        include: {
            user: { include: { profile: true } },
        },
    });
};

const getDoctorById = async (id) => {
    return await prisma.doctor.findUnique({
        where: { id },
        include: {
            user: { include: { profile: true } },
            appointments: {
                include: {
                    patient: { include: { user: { include: { profile: true } } } },
                },
                orderBy: { appointmentTime: 'desc' },
            },
        },
    });
};

module.exports = {
    getAllDoctors,
    getDoctorById,
};
