import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDashboardStats } from '../hooks/useDashboard';
import {
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
    Users, Stethoscope, Calendar, CalendarCheck, TrendingUp,
    Activity, Heart, Zap, Clock, ArrowUpRight,
} from 'lucide-react';

/* ── Counter ── */
function Counter({ value, duration = 1200 }) {
    const [n, setN] = useState(0);
    useEffect(() => {
        if (!value) return;
        let s = 0;
        const step = value / (duration / 16);
        const id = setInterval(() => {
            s += step;
            if (s >= value) { setN(value); clearInterval(id); }
            else setN(Math.floor(s));
        }, 16);
        return () => clearInterval(id);
    }, [value, duration]);
    return <>{n}</>;
}

/* ── Tooltip ── */
const Tip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="px-3 py-2 text-xs space-y-0.5 rounded-lg border border-white/10" style={{ background: 'rgba(10,15,30,0.95)' }}>
            <p className="text-white/50 font-medium">{label}</p>
            {payload.map((p, i) => (
                <p key={i} style={{ color: p.color || p.fill }} className="font-bold">{p.name}: {p.value}</p>
            ))}
        </div>
    );
};

const weekly = [
    { day: 'Mon', patients: 12, appts: 8 }, { day: 'Tue', patients: 19, appts: 14 },
    { day: 'Wed', patients: 15, appts: 11 }, { day: 'Thu', patients: 22, appts: 18 },
    { day: 'Fri', patients: 28, appts: 24 }, { day: 'Sat', patients: 16, appts: 9 },
    { day: 'Sun', patients: 8, appts: 4 },
];
const depts = [
    { name: 'Cardiology', value: 35, color: '#3b82f6' }, { name: 'Neurology', value: 25, color: '#8b5cf6' },
    { name: 'Orthopedics', value: 20, color: '#06b6d4' }, { name: 'Pediatrics', value: 15, color: '#10b981' },
    { name: 'General', value: 5, color: '#f59e0b' },
];
const hourly = [
    { h: '8', c: 3 }, { h: '9', c: 7 }, { h: '10', c: 9 }, { h: '11', c: 6 },
    { h: '12', c: 4 }, { h: '1', c: 5 }, { h: '2', c: 8 }, { h: '3', c: 7 },
    { h: '4', c: 6 }, { h: '5', c: 4 }, { h: '6', c: 2 },
];

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const up = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } } };

export default function DashboardPage() {
    const { data: stats, isLoading } = useDashboardStats();

    const cards = [
        { label: 'Total Patients', value: stats?.totalPatients ?? 0, icon: Users, grad: 'from-blue-600/20 to-blue-500/5', iconBg: 'from-blue-600 to-blue-400', border: 'border-blue-500/15', glow: 'glow-blue', tag: '+12%', up: true },
        { label: 'Active Doctors', value: stats?.totalDoctors ?? 0, icon: Stethoscope, grad: 'from-emerald-600/20 to-emerald-500/5', iconBg: 'from-emerald-600 to-emerald-400', border: 'border-emerald-500/15', glow: 'glow-emerald', tag: '+3', up: true },
        { label: 'Appointments', value: stats?.totalAppointments ?? 0, icon: Calendar, grad: 'from-purple-600/20 to-purple-500/5', iconBg: 'from-purple-600 to-purple-400', border: 'border-purple-500/15', glow: 'glow-purple', tag: '+28%', up: true },
        { label: "Today's", value: stats?.appointmentsToday ?? 0, icon: CalendarCheck, grad: 'from-amber-600/20 to-amber-500/5', iconBg: 'from-amber-600 to-amber-400', border: 'border-amber-500/15', glow: 'glow-amber', tag: 'Live', up: null },
    ];

    return (
        <div className="space-y-6 min-w-0">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Dashboard</h2>
                <p className="text-white/25 text-sm mt-1 flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative rounded-full h-2 w-2 bg-emerald-400" />
                    </span>
                    Real-time hospital analytics
                </p>
            </motion.div>

            {/* Stats */}
            <motion.div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4" variants={stagger} initial="hidden" animate="show">
                {cards.map((c, i) => (
                    <motion.div key={i} variants={up}
                        className={`glass-card p-4 bg-gradient-to-br ${c.grad} border ${c.border} ${c.glow} hover-lift cursor-default overflow-hidden`}
                    >
                        {isLoading ? (
                            <div className="space-y-3"><div className="skeleton w-10 h-10 rounded-xl" /><div className="skeleton h-7 w-14 rounded" /><div className="skeleton h-3 w-20 rounded" /></div>
                        ) : (<>
                            <div className="flex items-center justify-between mb-2">
                                <motion.div className={`w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-br ${c.iconBg} flex items-center justify-center shadow-lg`}
                                    whileHover={{ rotate: 12, scale: 1.15 }} transition={{ type: 'spring', stiffness: 300 }}>
                                    <c.icon className="w-4 h-4 md:w-5 md:h-5 text-white" />
                                </motion.div>
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border flex items-center gap-0.5 ${
                                    c.tag === 'Live' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-white/[0.03] border-white/10 text-white/40'
                                }`}>
                                    {c.up !== null && <ArrowUpRight className="w-2.5 h-2.5" />}
                                    {c.tag === 'Live' && <Activity className="w-2.5 h-2.5" />}
                                    {c.tag}
                                </span>
                            </div>
                            <p className="text-2xl md:text-3xl font-extrabold text-white"><Counter value={c.value} /></p>
                            <p className="text-[10px] md:text-xs text-white/25 mt-0.5 font-medium truncate">{c.label}</p>
                        </>)}
                    </motion.div>
                ))}
            </motion.div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-5 min-w-0">
                {/* Area */}
                <motion.div className="lg:col-span-3 glass-card p-4 md:p-5 min-w-0" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                        <div>
                            <h3 className="text-sm font-bold text-white flex items-center gap-2"><TrendingUp className="w-4 h-4 text-blue-400" /> Weekly</h3>
                            <p className="text-[10px] text-white/15 mt-0.5">Patient visits & appointments</p>
                        </div>
                        <div className="flex gap-3 text-[10px] text-white/25">
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> Patients</span>
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500" /> Appts</span>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={weekly}>
                            <defs>
                                <linearGradient id="gB" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} /><stop offset="95%" stopColor="#3b82f6" stopOpacity={0} /></linearGradient>
                                <linearGradient id="gP" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} /><stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} /></linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                            <XAxis dataKey="day" tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: 'rgba(255,255,255,0.15)', fontSize: 10 }} axisLine={false} tickLine={false} width={25} />
                            <Tooltip content={<Tip />} />
                            <Area type="monotone" dataKey="patients" name="Patients" stroke="#3b82f6" strokeWidth={2} fill="url(#gB)" dot={false} activeDot={{ r: 4, fill: '#3b82f6' }} />
                            <Area type="monotone" dataKey="appts" name="Appointments" stroke="#8b5cf6" strokeWidth={2} fill="url(#gP)" dot={false} activeDot={{ r: 4, fill: '#8b5cf6' }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Departments */}
                <motion.div className="lg:col-span-2 glass-card p-4 md:p-5 min-w-0" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                    <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2"><Heart className="w-4 h-4 text-red-400" /> Departments</h3>
                    <ResponsiveContainer width="100%" height={140}>
                        <PieChart>
                            <Pie data={depts} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={3} dataKey="value" stroke="none">
                                {depts.map((e, i) => <Cell key={i} fill={e.color} />)}
                            </Pie>
                            <Tooltip content={<Tip />} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-1 mt-1">
                        {depts.map((d, i) => (
                            <motion.div key={d.name} className="flex items-center justify-between text-xs"
                                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.05 }}>
                                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} /><span className="text-white/35">{d.name}</span></span>
                                <span className="text-white/55 font-bold">{d.value}%</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5 min-w-0">
                {/* Hourly */}
                <motion.div className="glass-card p-4 md:p-5 min-w-0" initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                    <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2"><Clock className="w-4 h-4 text-cyan-400" /> Hourly Flow</h3>
                    <ResponsiveContainer width="100%" height={170}>
                        <BarChart data={hourly} barSize={14}>
                            <defs>
                                <linearGradient id="bG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#06b6d4" stopOpacity={0.8} /><stop offset="100%" stopColor="#06b6d4" stopOpacity={0.15} /></linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                            <XAxis dataKey="h" tick={{ fill: 'rgba(255,255,255,0.18)', fontSize: 10 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: 'rgba(255,255,255,0.15)', fontSize: 10 }} axisLine={false} tickLine={false} width={20} />
                            <Tooltip content={<Tip />} />
                            <Bar dataKey="c" name="Appointments" fill="url(#bG)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* System Health */}
                <motion.div className="glass-card p-4 md:p-5 min-w-0" initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
                    <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><Zap className="w-4 h-4 text-amber-400" /> System Health</h3>
                    <div className="space-y-2.5">
                        {[
                            { label: 'Database', pct: 98, color: '#10b981' },
                            { label: 'API Server', pct: 100, color: '#3b82f6' },
                            { label: 'Auth Service', pct: 100, color: '#8b5cf6' },
                            { label: 'Query Engine', pct: 95, color: '#06b6d4' },
                        ].map((item, i) => (
                            <motion.div key={item.label} className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]"
                                initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 + i * 0.08 }}>
                                <div className="flex items-center gap-2.5">
                                    <div className="relative w-2 h-2 shrink-0">
                                        <div className="absolute inset-0 rounded-full" style={{ backgroundColor: item.color }} />
                                        <div className="absolute inset-0 rounded-full animate-ping opacity-40" style={{ backgroundColor: item.color }} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-white/45 font-medium">{item.label}</span>
                                            <span className="text-[10px] font-bold" style={{ color: item.color }}>{item.pct}%</span>
                                        </div>
                                        <div className="w-full h-1 bg-white/[0.04] rounded-full mt-1.5 overflow-hidden">
                                            <motion.div className="h-full rounded-full" style={{ backgroundColor: item.color }}
                                                initial={{ width: 0 }} animate={{ width: `${item.pct}%` }}
                                                transition={{ delay: 0.8 + i * 0.1, duration: 0.8, ease: 'easeOut' }} />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
