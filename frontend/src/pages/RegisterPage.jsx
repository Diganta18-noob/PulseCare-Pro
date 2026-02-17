import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../stores/authStore';
import { toast } from 'sonner';
import api from '../api/axios';
import {
    Heart, Mail, Lock, User, Phone, Loader2, ArrowRight,
    Sparkles, Shield, Stethoscope, Briefcase
} from 'lucide-react';

/* ── Floating Ring ── */
function Ring({ size, delay, x, y, color }) {
    return (
        <motion.div
            className="absolute rounded-full border opacity-[0.08]"
            style={{ width: size, height: size, left: x, top: y, borderColor: color }}
            animate={{ y: [0, -20, 0], rotate: [0, 180, 360], scale: [1, 1.05, 1] }}
            transition={{ duration: 12, repeat: Infinity, delay, ease: 'easeInOut' }}
        />
    );
}

export default function RegisterPage() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const setUser = useAuthStore(s => s.setUser);
    const isAuthenticated = useAuthStore(s => s.isAuthenticated);

    const [formData, setFormData] = useState({
        email: '', password: '', role: 'PATIENT',
        firstName: '', lastName: '', phone: '',
        specialization: '', licenseNo: ''
    });

    useEffect(() => { if (isAuthenticated) navigate('/'); }, [isAuthenticated, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post('/auth/register', formData);
            setUser(data.user);
            toast.success('Account created successfully!');
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex noise overflow-hidden">
            {/* ── Left Panel ── */}
            <motion.div
                className="hidden lg:flex lg:w-[45%] xl:w-[50%] relative overflow-hidden flex-col justify-between p-12"
                style={{ background: 'linear-gradient(135deg, #0c1222 0%, #0a1628 50%, #0d1117 100%)' }}
                initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}
            >
                <Ring size={300} delay={0} x="60%" y="10%" color="#3b82f6" />
                <Ring size={200} delay={2} x="20%" y="60%" color="#8b5cf6" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-blue-600/[0.07] blur-[120px] pointer-events-none" />

                <div className="relative z-10">
                    <motion.div className="flex items-center gap-3" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                         <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/25">
                            <Heart className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold gradient-text">PulseCare Pro</span>
                    </motion.div>
                </div>

                <div className="relative z-10 space-y-6">
                    <motion.h2 className="text-5xl xl:text-6xl font-extrabold text-white leading-[1.1] tracking-tight"
                        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.7 }}>
                        Join the <br /><span className="gradient-text">Future</span> of <br />Healthcare
                    </motion.h2>
                </div>

                <div className="relative z-10 text-white/30 text-sm">
                    © 2026 PulseCare Inc. All rights reserved.
                </div>
            </motion.div>

            {/* ── Right Panel ── */}
            <div className="flex-1 flex items-center justify-center p-6 relative overflow-y-auto">
                 <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-blue-600/[0.04] blur-[100px] pointer-events-none" />

                 <motion.div className="w-full max-w-[420px] relative z-10 py-10"
                    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                    
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-white tracking-tight">Create Account</h2>
                        <p className="text-white/30 text-sm mt-1">Get started with your free account today</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name Fields */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-white/40 uppercase tracking-wider ml-1">First Name</label>
                                <input required className="input-premium w-full px-4 py-2.5 rounded-xl text-sm" placeholder="John"
                                    value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-white/40 uppercase tracking-wider ml-1">Last Name</label>
                                <input required className="input-premium w-full px-4 py-2.5 rounded-xl text-sm" placeholder="Doe"
                                    value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} />
                            </div>
                        </div>

                        {/* Contact */}
                        <div className="space-y-1.5">
                             <label className="text-[11px] font-bold text-white/40 uppercase tracking-wider ml-1">Email</label>
                             <div className="relative">
                                <Mail className="absolute left-3.5 top-2.5 w-4 h-4 text-white/20" />
                                <input type="email" required className="input-premium w-full pl-10 pr-4 py-2.5 rounded-xl text-sm" placeholder="john@example.com"
                                    value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                             </div>
                        </div>
                        
                        <div className="space-y-1.5">
                             <label className="text-[11px] font-bold text-white/40 uppercase tracking-wider ml-1">Phone</label>
                             <div className="relative">
                                <Phone className="absolute left-3.5 top-2.5 w-4 h-4 text-white/20" />
                                <input required className="input-premium w-full pl-10 pr-4 py-2.5 rounded-xl text-sm" placeholder="+1 (555) 000-0000"
                                    value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                             </div>
                        </div>

                        <div className="space-y-1.5">
                             <label className="text-[11px] font-bold text-white/40 uppercase tracking-wider ml-1">Password</label>
                             <div className="relative">
                                <Lock className="absolute left-3.5 top-2.5 w-4 h-4 text-white/20" />
                                <input type="password" required className="input-premium w-full pl-10 pr-4 py-2.5 rounded-xl text-sm" placeholder="••••••••"
                                    value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                             </div>
                        </div>

                        {/* Role Selection */}
                        <div className="space-y-2 pt-2">
                            <label className="text-[11px] font-bold text-white/40 uppercase tracking-wider ml-1">Account Type</label>
                            <div className="grid grid-cols-3 gap-2">
                                {['PATIENT', 'DOCTOR', 'ADMIN'].map(r => (
                                    <button
                                        key={r}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, role: r })}
                                        className={`p-2 rounded-lg border text-xs font-bold transition-all ${
                                            formData.role === r 
                                            ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20 scale-105' 
                                            : 'bg-white/[0.03] border-white/5 text-white/40 hover:bg-white/[0.06]'
                                        }`}
                                    >
                                        {r}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Doctor Fields */}
                        <AnimatePresence>
                            {formData.role === 'DOCTOR' && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden space-y-4 pt-1"
                                >
                                    <div className="space-y-1.5">
                                         <label className="text-[11px] font-bold text-white/40 uppercase tracking-wider ml-1">Specialization</label>
                                         <div className="relative">
                                            <Stethoscope className="absolute left-3.5 top-2.5 w-4 h-4 text-white/20" />
                                            <input required={formData.role === 'DOCTOR'} className="input-premium w-full pl-10 pr-4 py-2.5 rounded-xl text-sm" placeholder="e.g. Cardiology"
                                                value={formData.specialization} onChange={e => setFormData({ ...formData, specialization: e.target.value })} />
                                         </div>
                                    </div>
                                    <div className="space-y-1.5">
                                         <label className="text-[11px] font-bold text-white/40 uppercase tracking-wider ml-1">License No</label>
                                         <div className="relative">
                                            <Briefcase className="absolute left-3.5 top-2.5 w-4 h-4 text-white/20" />
                                            <input required={formData.role === 'DOCTOR'} className="input-premium w-full pl-10 pr-4 py-2.5 rounded-xl text-sm" placeholder="LIC-123456"
                                                value={formData.licenseNo} onChange={e => setFormData({ ...formData, licenseNo: e.target.value })} />
                                         </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button type="submit" disabled={loading} className="btn-premium w-full py-3.5 rounded-xl flex items-center justify-center gap-2 text-[15px] disabled:opacity-50 mt-4">
                             {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating Account...</> : <><Sparkles className="w-4 h-4 text-white/70" /> Sign Up</>}
                        </button>
                    </form>

                    <p className="text-center text-sm text-white/25 mt-8">
                        Already have an account? <Link to="/login" className="text-blue-400 hover:text-blue-300 transition-colors font-semibold">Sign In</Link>
                    </p>
                 </motion.div>
            </div>
        </div>
    );
}
