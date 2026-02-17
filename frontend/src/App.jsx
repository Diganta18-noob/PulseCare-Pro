import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster, toast } from 'sonner';
import { useEffect } from 'react';

import AppLayout from './components/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import PatientsPage from './pages/PatientsPage';
import AppointmentsPage from './pages/AppointmentsPage';
import { useAuthStore } from './stores/authStore';
import api from './api/axios';

// TanStack Query client with global error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30_000,
    },
    mutations: {
      onError: (error) => {
        const message = error.response?.data?.message || 'Something went wrong';
        toast.error(message);
      },
    },
  },
});

function AuthInitializer({ children }) {
  const { setUser, isAuthenticated } = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await api.get('/auth/me');
        setUser(data.user);
      } catch {
        // Not authenticated — that's fine
      }
    };

    if (!isAuthenticated) {
      checkAuth();
    }
  }, []);

  return children;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthInitializer>
          <Routes>
            {/* Public */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected */}
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<DashboardPage />} />
              <Route path="/patients" element={<PatientsPage />} />
              <Route path="/appointments" element={<AppointmentsPage />} />
            </Route>
          </Routes>
        </AuthInitializer>
      </BrowserRouter>
      <Toaster
        position="top-right"
        richColors
        toastOptions={{
          style: {
            background: 'hsl(222.2 84% 6.9%)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: 'white',
          },
        }}
      />
    </QueryClientProvider>
  );
}
