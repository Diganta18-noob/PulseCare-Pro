import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

export const useDashboardStats = () => {
    return useQuery({
        queryKey: ['dashboard', 'stats'],
        queryFn: async () => {
            const { data } = await api.get('/dashboard/stats');
            return data.stats;
        },
        refetchInterval: 30000, // Refresh every 30 seconds
    });
};

export const useDoctors = () => {
    return useQuery({
        queryKey: ['doctors'],
        queryFn: async () => {
            const { data } = await api.get('/doctors');
            return data.doctors;
        },
    });
};
