import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../stores/authStore';
import api from '../api/axios';
import { toast } from 'sonner';
import {
    Heart, LayoutDashboard, Users, Calendar, LogOut,
    ChevronLeft, ChevronRight, Activity,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard', desc: 'Overview & stats' },
    { to: '/patients', icon: Users, label: 'Patients', desc: 'Patient records' },
    { to: '/appointments', icon: Calendar, label: 'Appointments', desc: 'Schedule & manage' },
];

export default function AppLayout() {
    const { user, clearUser } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);

    const handleLogout = async () => {
        try { await api.post('/auth/logout'); } catch { }
        clearUser();
        toast.success('Logged out');
        navigate('/login');
    };

    const roleBadge = {
        ADMIN: 'bg-amber-500/15 border-amber-500/25 text-amber-300',
        DOCTOR: 'bg-emerald-500/15 border-emerald-500/25 text-emerald-300',
        PATIENT: 'bg-blue-500/15 border-blue-500/25 text-blue-300',
    };

    const sidebarW = collapsed ? 72 : 256;

    return (
        <div className="min-h-screen flex noise">
            {/* ── Sidebar ── */}
            <motion.aside
                className="fixed top-0 left-0 h-full z-30 flex flex-col border-r border-white/[0.04]"
                style={{ background: 'hsl(222.2 84% 3.5%)' }}
                animate={{ width: sidebarW }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            >
                {/* Logo */}
                <div className="flex items-center gap-3 px-5 h-16 border-b border-white/[0.04] shrink-0">
                    <motion.div
                        className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-400 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20"
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                    >
                        <Heart className="w-5 h-5 text-white" />
                    </motion.div>
                    <AnimatePresence>
                        {!collapsed && (
                            <motion.span
                                className="text-base font-bold gradient-text whitespace-nowrap"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                PulseCare Pro
                            </motion.span>
                        )}
                    </AnimatePresence>
                </div>

                {/* Nav */}
                <nav className="flex-1 py-4 px-2.5 space-y-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLink key={item.to} to={item.to} end={item.to === '/'}>
                            {({ isActive }) => (
                                <motion.div
                                    className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl group ${
                                        isActive ? 'text-white' : 'text-white/30 hover:text-white/60'
                                    }`}
                                    whileHover={{ x: 3 }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    {isActive && (
                                        <motion.div
                                            className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600/15 to-blue-600/5 border border-blue-500/20"
                                            layoutId="activeNav"
                                            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                                        />
                                    )}
                                    <item.icon className="w-5 h-5 shrink-0 relative z-10" />
                                    <AnimatePresence>
                                        {!collapsed && (
                                            <motion.div
                                                className="relative z-10 min-w-0"
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -10 }}
                                            >
                                                <span className="text-sm font-medium block truncate">{item.label}</span>
                                                {isActive && <span className="text-[10px] text-white/25 truncate block">{item.desc}</span>}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* User Card */}
                <div className="p-2.5 border-t border-white/[0.04] space-y-2 shrink-0">
                    <AnimatePresence>
                        {!collapsed && user && (
                            <motion.div
                                className="px-3 py-3 rounded-xl bg-white/[0.02]"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-white/10 shrink-0">
                                        <span className="text-xs font-bold text-blue-300">
                                            {user.profile?.firstName?.[0]}{user.profile?.lastName?.[0]}
                                        </span>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-white/80 truncate">
                                            {user.profile?.firstName} {user.profile?.lastName}
                                        </p>
                                        <span className={`inline-flex text-[9px] px-2 py-0.5 rounded-full border font-bold uppercase tracking-wider mt-0.5 ${roleBadge[user.role] || ''}`}>
                                            {user.role}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-white/20 hover:text-red-400 hover:bg-red-500/5 transition-all"
                        whileHover={{ x: 3 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        <LogOut className="w-5 h-5 shrink-0" />
                        <AnimatePresence>
                            {!collapsed && (
                                <motion.span className="text-sm font-medium"
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                >Logout</motion.span>
                            )}
                        </AnimatePresence>
                    </motion.button>
                </div>

                {/* Toggle */}
                <motion.button
                    onClick={() => setCollapsed(!collapsed)}
                    className="absolute -right-3.5 top-20 w-7 h-7 rounded-full bg-gray-800/90 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/20 transition-all z-50"
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <motion.div animate={{ rotate: collapsed ? 0 : 180 }} transition={{ duration: 0.3 }}>
                        <ChevronRight className="w-3.5 h-3.5" />
                    </motion.div>
                </motion.button>
            </motion.aside>

            {/* ── Main ── */}
            <motion.main
                className="flex-1 min-w-0 overflow-x-hidden"
                animate={{ marginLeft: sidebarW }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            >
                {/* Top Bar */}
                <div className="sticky top-0 z-20 h-14 border-b border-white/[0.04] glass flex items-center justify-between px-6">
                    <div className="flex items-center gap-2 text-white/30 text-sm">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                        </span>
                        <span className="text-emerald-400 font-medium">Live</span>
                        <span className="text-white/10">•</span>
                        <span>Neon DB Connected</span>
                    </div>
                    <div className="text-white/15 text-xs font-mono hidden md:block">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </div>

                <div className="p-5 md:p-7 lg:p-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </motion.main>
        </div>
    );
}
