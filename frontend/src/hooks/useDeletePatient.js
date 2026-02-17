import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '../api/axios';

export const useDeletePatient = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (patientId) => api.delete(`/patients/${patientId}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['patients'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
            toast.success('Patient record deleted successfully');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to delete patient');
        },
    });
};
