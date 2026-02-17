import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../stores/authStore';
import { toast } from 'sonner';
import api from '../api/axios';
import {
    Heart, Mail, Lock, Loader2, Sparkles,
    Shield, Stethoscope, Zap, Star,
} from 'lucide-react';

function FloatingParticle({ delay, x, size, color }) {
    return (
        <motion.div
            className="absolute rounded-full"
            style={{
                width: size,
                height: size,
                left: x,
                background: color,
                filter: 'blur(1px)',
            }}
            animate={{
                y: [0, -100, 0],
                opacity: [0, 0.6, 0],
                scale: [0.5, 1.2, 0.5],
            }}
            transition={{
                duration: 8,
                repeat: Infinity,
                delay,
                ease: "easeInOut"
            }}
        />
    );
}

function GlowingOrb({ size, x, y, color, duration = 15 }) {
    return (
        <motion.div
            className="absolute rounded-full blur-[80px] pointer-events-none"
            style={{
                width: size,
                height: size,
                left: x,
                top: y,
                background: color,
            }}
            animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
                duration,
                repeat: Infinity,
                ease: "easeInOut"
            }}
        />
    );
}

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [focused, setFocused] = useState(null);
    const navigate = useNavigate();
    const setUser = useAuthStore(s => s.setUser);
    const isAuthenticated = useAuthStore(s => s.isAuthenticated);

    useEffect(() => { if (isAuthenticated) navigate('/'); }, [isAuthenticated, navigate]);



    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post('/auth/login', { email, password });
            setUser(data.user);
            toast.success(`Welcome back, ${data.user.profile?.firstName || 'User'}!`);
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const demos = [
        { role: 'Admin', email: 'admin@pulsecare.com', icon: Shield, grad: 'from-amber-400 to-orange-500', glow: 'shadow-amber-500/30', border: 'border-amber-500/30' },
        { role: 'Doctor', email: 'dr.smith@pulsecare.com', icon: Stethoscope, grad: 'from-emerald-400 to-cyan-500', glow: 'shadow-emerald-500/30', border: 'border-emerald-500/30' },
        { role: 'Patient', email: 'alice@example.com', icon: Heart, grad: 'from-blue-400 to-indigo-500', glow: 'shadow-blue-500/30', border: 'border-blue-500/30' },
    ];

    return (
        <div className="min-h-screen flex overflow-hidden relative">
            <div className="noise fixed inset-0 z-[100] pointer-events-none" />
            
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <GlowingOrb size={500} x="-10%" y="-20%" color="rgba(59,130,246,0.15)" />
                <GlowingOrb size={400} x="60%" y="50%" color="rgba(139,92,246,0.12)" />
                <GlowingOrb size={300} x="80%" y="10%" color="rgba(6,182,212,0.1)" />
                
                {/* Floating Particles */}
                <FloatingParticle delay={0} x="10%" size={6} color="rgba(59,130,246,0.5)" />
                <FloatingParticle delay={1} x="25%" size={4} color="rgba(139,92,246,0.5)" />
                <FloatingParticle delay={2} x="45%" size={5} color="rgba(6,182,212,0.5)" />
                <FloatingParticle delay={3} x="70%" size={3} color="rgba(236,72,153,0.5)" />
                <FloatingParticle delay={4} x="85%" size={6} color="rgba(251,191,36,0.5)" />
                <FloatingParticle delay={5} x="15%" size={4} color="rgba(16,185,129,0.5)" />
            </div>

            {/* Left Panel */}
            <motion.div
                className="hidden lg:flex lg:w-[45%] xl:w-[50%] relative overflow-hidden flex-col justify-between p-12"
                style={{ 
                    background: 'linear-gradient(135deg, #0c1222 0%, #0a1628 50%, #0d1117 100%)',
                }}
                initial={{ opacity: 0, x: -60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
            >
                {/* Decorative rings */}
                {[300, 200, 150].map((size, i) => (
                    <motion.div
                        key={size}
                        className="absolute rounded-full border opacity-[0.06]"
                        style={{ 
                            width: size, 
                            height: size, 
                            left: `${50 + i * 15}%`, 
                            top: `${20 + i * 20}%`,
                            borderColor: ['#3b82f6', '#8b5cf6', '#06b6d4'][i]
                        }}
                        animate={{ 
                            y: [0, -30, 0], 
                            rotate: [0, 180, 360], 
                            scale: [1, 1.1, 1] 
                        }}
                        transition={{ 
                            duration: 15 + i * 3, 
                            repeat: Infinity, 
                            delay: i * 1.5, 
                            ease: 'easeInOut' 
                        }}
                    />
                ))}

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-600/[0.06] blur-[150px] pointer-events-none" />

                <div className="relative z-10">
                    <motion.div 
                        className="flex items-center gap-3" 
                        initial={{ opacity: 0, y: -20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ delay: 0.3, duration: 0.6 }}
                    >
                        <motion.div 
                            className="w-12 h-12 rounded-2xl bg-linear-to-br from-blue-500 via-cyan-400 to-emerald-400 flex items-center justify-center shadow-lg shadow-blue-500/30"
                            whileHover={{ scale: 1.05, rotate: 5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <Heart className="w-6 h-6 text-white" />
                        </motion.div>
                        <span className="text-2xl font-bold gradient-text">PulseCare Pro</span>
                    </motion.div>
                </div>

                <div className="relative z-10 space-y-8">
                    <motion.h2 
                        className="text-5xl xl:text-6xl font-extrabold text-white leading-[1.15] tracking-tight"
                        initial={{ opacity: 0, y: 40 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
                    >
                        <span className="block">Transform Your</span>
                        <span className="gradient-text">Healthcare</span>
                        <span className="block">Experience</span>
                    </motion.h2>
                    
                    <motion.p 
                        className="text-white/40 text-lg max-w-lg leading-relaxed"
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ delay: 0.6 }}
                    >
                        Join thousands of healthcare professionals using PulseCare Pro to streamline operations and deliver exceptional patient care.
                    </motion.p>
                </div>

                <div className="relative z-10 pt-10 border-t border-white/[0.08] flex gap-12">
                    {[
                        { l: 'Active Users', v: '2,400+', icon: Zap },
                        { l: 'Medical Experts', v: '180+', icon: Star },
                        { l: 'Success Rate', v: '99.9%', icon: Shield },
                    ].map((s, i) => (
                        <motion.div 
                            key={s.l} 
                            className="flex items-center gap-3"
                            initial={{ opacity: 0, y: 20 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            transition={{ delay: 0.8 + i * 0.15 }}
                        >
                            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-white/5 to-white/10 flex items-center justify-center border border-white/10">
                                <s.icon className="w-4 h-4 text-blue-400" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white">{s.v}</div>
                                <div className="text-xs text-white/35 uppercase tracking-wider">{s.l}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Right Panel */}
            <div className="flex-1 flex items-center justify-center p-6 relative">
                <motion.div 
                    className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-linear-to-br from-blue-600/8 to-purple-600/5 blur-[120px] pointer-events-none" 
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.4, 0.6, 0.4],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

                <motion.div 
                    className="w-full max-w-[420px] relative z-10"
                    initial={{ opacity: 0, y: 40 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                >
                    {/* Mobile Header */}
                    <div className="lg:hidden text-center mb-12">
                        <motion.div 
                            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-blue-600 via-cyan-500 to-emerald-400 mb-5 shadow-xl shadow-blue-500/25"
                            whileHover={{ scale: 1.05, rotate: 3 }}
                        >
                            <Heart className="w-8 h-8 text-white" />
                        </motion.div>
                        <h1 className="text-3xl font-bold gradient-text">PulseCare Pro</h1>
                    </div>

                    {/* Form Header */}
                    <motion.div 
                        className="mb-10"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <h2 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h2>
                        <p className="text-white/35 text-base mt-2">Enter your credentials to continue to your dashboard</p>
                    </motion.div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-7">
                        {/* Email Field */}
                        <motion.div 
                            className="space-y-3"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <label className="block text-sm font-medium text-white/70 ml-1">Email Address</label>
                            <div className="relative group">
                                <motion.div
                                    className="absolute inset-0 rounded-xl bg-linear-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 blur"
                                />
                                <div className="relative">
                                    <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 z-20 transition-all duration-300 ${focused === 'email' ? 'text-blue-400 scale-110' : 'text-white/25'}`} />
                                    <input 
                                        type="email" 
                                        value={email} 
                                        onChange={e => setEmail(e.target.value)} 
                                        onFocus={() => setFocused('email')} 
                                        onBlur={() => setFocused(null)}
                                        placeholder="Enter your email" 
                                        required 
                                        className="input-premium w-full pl-16 pr-4 py-3.5 rounded-xl text-[15px]"
                                    />
                                </div>
                            </div>
                        </motion.div>

                        {/* Password Field */}
                        <motion.div 
                            className="space-y-3"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <div className="flex justify-between items-center ml-1">
                                <label className="block text-sm font-medium text-white/70">Password</label>
                                <button type="button" className="text-sm text-blue-400/70 hover:text-blue-400 font-medium transition-colors">Forgot password?</button>
                            </div>
                            <div className="relative group">
                                <motion.div
                                    className="absolute inset-0 rounded-xl bg-linear-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 blur"
                                />
                                <div className="relative">
                                    <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 z-20 transition-all duration-300 ${focused === 'password' ? 'text-blue-400 scale-110' : 'text-white/25'}`} />
                                    <input 
                                        type="password" 
                                        value={password} 
                                        onChange={e => setPassword(e.target.value)} 
                                        onFocus={() => setFocused('password')} 
                                        onBlur={() => setFocused(null)}
                                        placeholder="Enter your password" 
                                        required 
                                        className="input-premium w-full pl-16 pr-4 py-3.5 rounded-xl text-[15px]"
                                    />
                                </div>
                            </div>
                        </motion.div>

                        {/* Remember & Submit */}
                        <motion.div 
                            className="space-y-6 pt-2"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative">
                                        <input type="checkbox" className="sr-only peer" />
                                        <div className="w-5 h-5 rounded-md bg-white/5 border border-white/10 flex items-center justify-center transition-all peer-checked:bg-blue-500 peer-checked:border-blue-500 group-hover:border-white/30">
                                            <motion.svg 
                                                initial={{ scale: 0, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                className="w-3 h-3 text-white" 
                                                fill="none" 
                                                viewBox="0 0 24 24" 
                                                stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </motion.svg>
                                        </div>
                                    </div>
                                    <span className="text-sm text-white/50 group-hover:text-white/80 transition-colors">Remember me</span>
                                </label>
                            </div>
                            
                            <motion.button 
                                type="submit" 
                                disabled={loading} 
                                className="btn-premium w-full py-3.5 rounded-xl text-sm font-bold tracking-wide shadow-lg shadow-blue-500/20 disabled:opacity-50 cursor-pointer"
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Authenticating...</span>
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        <Sparkles className="w-4 h-4" />
                                        <span>Sign In</span>
                                    </span>
                                )}
                            </motion.button>
                        </motion.div>
                    </form>

                    {/* Divider */}
                    <motion.div 
                        className="flex items-center gap-5 my-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                    >
                        <div className="flex-1 h-px bg-linear-to-r from-transparent via-white/[0.1] to-transparent" />
                        <span className="text-[10px] text-white/25 uppercase tracking-[0.2em] font-semibold">Quick Demo Access</span>
                        <div className="flex-1 h-px bg-linear-to-r from-transparent via-white/[0.1] to-transparent" />
                    </motion.div>

                    {/* Demo Buttons */}
                    <div className="grid grid-cols-3 gap-4">
                        {demos.map((d, i) => (
                            <motion.button
                                key={d.role}
                                type="button"
                                onClick={() => { setEmail(d.email); setPassword('password123'); }}
                                className={`relative p-4 rounded-2xl border ${d.border} bg-white/[0.02] cursor-pointer transition-all duration-300 group overflow-hidden`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 + i * 0.1 }}
                                whileHover={{ y: -5, scale: 1.02 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <div className={`absolute inset-0 bg-linear-to-br ${d.grad} opacity-0 group-hover:opacity-[0.15] transition-opacity duration-500`} />
                                <div className="relative">
                                    <motion.div 
                                        className={`w-10 h-10 mx-auto mb-3 rounded-xl bg-linear-to-br ${d.grad} flex items-center justify-center shadow-lg ${d.glow}`}
                                        whileHover={{ rotate: 15, scale: 1.1 }}
                                        transition={{ type: "spring", stiffness: 400 }}
                                    >
                                        <d.icon className="w-5 h-5 text-white" />
                                    </motion.div>
                                    <p className="text-xs font-semibold text-white/40 group-hover:text-white transition-colors">{d.role}</p>
                                </div>
                            </motion.button>
                        ))}
                    </div>

                    {/* Register Link */}
                    <motion.p 
                        className="text-center text-sm text-white/30 mt-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.1 }}
                    >
                        Don't have an account?{' '}
                        <Link 
                            to="/register" 
                            className="text-blue-400 hover:text-blue-300 transition-all font-semibold relative group"
                        >
                            Create one
                            <motion.span 
                                className="absolute bottom-0 left-0 w-full h-px bg-blue-400/50"
                                initial={{ scaleX: 0 }}
                                whileHover={{ scaleX: 1 }}
                                transition={{ duration: 0.3 }}
                            />
                        </Link>
                    </motion.p>
                </motion.div>
            </div>
        </div>
    );
}
