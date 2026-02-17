import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '../api/axios';

export const useBookAppointment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (newAppointment) => api.post('/appointments', newAppointment),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['appointments'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
            toast.success('Appointment booked successfully!');
        },
        onError: (error) => {
            if (error.response?.status === 409) {
                toast.error('This doctor is already booked at the selected time. Please choose a different slot.');
            } else {
                toast.error(error.response?.data?.message || 'Failed to book appointment');
            }
        },
    });
};
