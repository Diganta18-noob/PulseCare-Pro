import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

export const usePatients = (sorting = []) => {
    // Extract sortBy and order from TanStack Table sorting state
    const sortBy = sorting?.[0]?.id || 'createdAt';
    const order = sorting?.[0]?.desc ? 'desc' : 'asc';

    return useQuery({
        queryKey: ['patients', sortBy, order],
        queryFn: async () => {
            const { data } = await api.get('/patients', {
                params: { sortBy, order },
            });
            return data.patients;
        },
    });
};
