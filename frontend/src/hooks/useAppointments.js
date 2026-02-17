import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

export const useAppointments = (sorting = []) => {
    const sortBy = sorting?.[0]?.id || 'appointmentTime';
    const order = sorting?.[0]?.desc ? 'desc' : 'asc';

    return useQuery({
        queryKey: ['appointments', sortBy, order],
        queryFn: async () => {
            const { data } = await api.get('/appointments', {
                params: { sortBy, order },
            });
            return data.appointments;
        },
    });
};
