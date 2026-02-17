import { useState, useMemo } from 'react';
import { useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel, getPaginationRowModel, flexRender } from '@tanstack/react-table';
import { useAppointments } from '../hooks/useAppointments';
import { useDoctors } from '../hooks/useDashboard';
import { usePatients } from '../hooks/usePatients';
import { useBookAppointment } from '../hooks/useBookAppointment';
import { format } from 'date-fns';
import {
    Calendar, Clock, User, Stethoscope, ChevronDown, ChevronLeft, ChevronRight,
    Search, Plus, CheckCircle2, XCircle, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';

/* ── Status Badge ── */
const StatusBadge = ({ status }) => {
    const config = {
        SCHEDULED: { color: 'text-blue-400 bg-blue-500/10 border-blue-500/20', icon: Clock },
        COMPLETED: { color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', icon: CheckCircle2 },
        CANCELLED: { color: 'text-rose-400 bg-rose-500/10 border-rose-500/20', icon: XCircle },
    };
    const { color, icon: Icon } = config[status] || config.SCHEDULED;
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[10px] font-bold tracking-wide uppercase ${color}`}>
            <Icon className="w-3 h-3" /> {status}
        </span>
    );
};

export default function AppointmentsPage() {
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [sorting, setSorting] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');

    const { data: appointments = [], isLoading } = useAppointments(sorting);
    const { data: doctors = [] } = useDoctors();
    const { data: patients = [] } = usePatients();
    const { mutate: bookAppointment, isPending: isBooking } = useBookAppointment();

    /* ── Form State ── */
    const [formData, setFormData] = useState({ patientId: '', doctorId: '', date: '', time: '', notes: '' });

    /* ── Stats ── */
    const stats = useMemo(() => {
        if (!appointments.length) return { total: 0, scheduled: 0, statusData: [], loadData: [] };
        const statusCounts = appointments.reduce((acc, a) => { acc[a.status] = (acc[a.status] || 0) + 1; return acc; }, {});
        const statusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
        
        const doctorCounts = appointments.reduce((acc, a) => {
            const name = `Dr. ${a.doctor.user.profile.lastName}`;
            acc[name] = (acc[name] || 0) + 1;
            return acc;
        }, {});
        const loadData = Object.entries(doctorCounts).map(([name, count]) => ({ name, count })).slice(0, 5);

        return {
            total: appointments.length,
            scheduled: statusCounts.SCHEDULED || 0,
            statusData, loadData
        };
    }, [appointments]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const appointmentTime = new Date(`${formData.date}T${formData.time}`).toISOString();
        bookAppointment({
            patientId: parseInt(formData.patientId), doctorId: parseInt(formData.doctorId),
            appointmentTime, notes: formData.notes
        }, {
            onSuccess: () => {
                setIsBookingOpen(false);
                setFormData({ patientId: '', doctorId: '', date: '', time: '', notes: '' });
                toast.success('Appointment booked successfully');
            },
            onError: (err) => toast.error(err.response?.data?.message || 'Booking failed')
        });
    };

    /* ── Columns ── */
    const columns = useMemo(() => [
        {
            accessorKey: 'appointmentTime',
            header: 'Date & Time',
            cell: info => (
                <div>
                    <div className="text-[13px] font-medium text-white/90">{format(new Date(info.getValue()), 'MMM d, yyyy')}</div>
                    <div className="text-[11px] text-white/40">{format(new Date(info.getValue()), 'h:mm a')}</div>
                </div>
            ),
        },
        {
            accessorFn: row => `${row.patient.user.profile.firstName} ${row.patient.user.profile.lastName}`,
            header: 'Patient',
            cell: info => <div className="text-[13px] font-medium text-white/80">{info.getValue()}</div>,
        },
        {
            accessorFn: row => `Dr. ${row.doctor.user.profile.lastName}`,
            header: 'Doctor',
            cell: info => (
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-[10px] text-white/50 border border-white/10">
                        {info.getValue().split(' ')[1][0]}
                    </div>
                    <span className="text-[12px] text-white/70">{info.getValue()}</span>
                </div>
            ),
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: info => <StatusBadge status={info.getValue()} />,
        },
        {
            accessorKey: 'notes',
            header: 'Notes',
            cell: info => <div className="max-w-[150px] truncate text-[11px] text-white/30 italic">{info.getValue() || '-'}</div>,
        },
    ], []);

    const table = useReactTable({
        data: appointments, columns, state: { sorting, globalFilter },
        onSortingChange: setSorting, onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(), getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(), getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Appointments</h2>
                    <p className="text-white/30 text-xs mt-1">Schedule & manage bookings</p>
                </div>
                <button
                    onClick={() => setIsBookingOpen(!isBookingOpen)}
                    className="btn-premium px-4 py-2 rounded-lg text-xs flex items-center gap-2"
                >
                    {isBookingOpen ? <XCircle className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    {isBookingOpen ? 'Cancel Booking' : 'New Appointment'}
                </button>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <motion.div className="glass-card p-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <h3 className="text-white/40 text-[10px] items-center gap-1 flex uppercase tracking-wider mb-2"><Calendar className="w-3 h-3" /> Total</h3>
                    <div className="text-3xl font-bold text-white">{stats.total}</div>
                </motion.div>
                <motion.div className="glass-card p-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <h3 className="text-white/40 text-[10px] items-center gap-1 flex uppercase tracking-wider mb-2"><Clock className="w-3 h-3 text-blue-400" /> Scheduled</h3>
                    <div className="text-3xl font-bold text-blue-400">{stats.scheduled}</div>
                </motion.div>
                <motion.div className="glass-card p-4 md:col-span-2 flex items-center justify-between" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                     <div className="h-16 w-full">
                        <ResponsiveContainer>
                            <BarChart data={stats.loadData} layout="vertical" barSize={8}>
                                <XAxis type="number" hide />
                                <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.4)' }} width={70} />
                                <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', fontSize: '11px'}} />
                                <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                     </div>
                </motion.div>
            </div>

            {/* Booking Form */}
            <AnimatePresence>
                {isBookingOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <form onSubmit={handleSubmit} className="glass-card p-6 mb-6 border-blue-500/20">
                            <h3 className="text-lg font-bold text-white mb-4">Book New Appointment</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">Patient</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 w-4 h-4 text-white/20" />
                                        <select required className="input-premium w-full pl-9 pr-4 py-2.5 rounded-lg text-sm appearance-none"
                                            value={formData.patientId} onChange={e => setFormData({ ...formData, patientId: e.target.value })}>
                                            <option value="" className="bg-slate-900 text-white/50">Select Patient</option>
                                            {patients.map(p => (
                                                <option key={p.id} value={p.id} className="bg-slate-900">{p.user.profile.firstName} {p.user.profile.lastName}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">Doctor</label>
                                    <div className="relative">
                                        <Stethoscope className="absolute left-3 top-3 w-4 h-4 text-white/20" />
                                        <select required className="input-premium w-full pl-9 pr-4 py-2.5 rounded-lg text-sm appearance-none"
                                            value={formData.doctorId} onChange={e => setFormData({ ...formData, doctorId: e.target.value })}>
                                            <option value="" className="bg-slate-900 text-white/50">Select Doctor</option>
                                            {doctors.map(d => (
                                                <option key={d.id} value={d.id} className="bg-slate-900">Dr. {d.user.profile.lastName} ({d.specialization})</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">Date</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-3 w-4 h-4 text-white/20" />
                                        <input type="date" required className="input-premium w-full pl-9 pr-4 py-2.5 rounded-lg text-sm [color-scheme:dark]"
                                            value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">Time</label>
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-3 w-4 h-4 text-white/20" />
                                        <input type="time" required className="input-premium w-full pl-9 pr-4 py-2.5 rounded-lg text-sm [color-scheme:dark]"
                                            value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} />
                                    </div>
                                </div>
                                <div className="md:col-span-2 space-y-1.5">
                                    <label className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">Notes</label>
                                    <textarea className="input-premium w-full px-4 py-3 rounded-lg text-sm min-h-[80px]" placeholder="Reason for visit..."
                                        value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} />
                                </div>
                            </div>
                            <div className="mt-5 flex justify-end">
                                <button type="submit" disabled={isBooking} className="btn-premium px-6 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2">
                                    {isBooking ? 'Booking...' : (
                                        <>Confirm Booking <CheckCircle2 className="w-4 h-4" /></>
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Table */}
            <motion.div className="glass-card overflow-hidden" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                 <div className="p-4 border-b border-white/[0.06] flex items-center gap-3">
                    <Search className="w-4 h-4 text-white/30" />
                    <input value={globalFilter ?? ''} onChange={e => setGlobalFilter(e.target.value)} placeholder="Search appointments..." className="bg-transparent border-none outline-none text-sm text-white placeholder-white/30 w-full" />
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-white/[0.02] border-b border-white/[0.06]">
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <th key={header.id} className="text-left px-5 py-3 text-[11px] font-semibold text-white/40 uppercase tracking-wider cursor-pointer hover:bg-white/[0.02] transition-colors"
                                            onClick={header.column.getToggleSortingHandler()}>
                                            <div className="flex items-center gap-2">
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                {{ asc: <ChevronDown className="w-3 h-3 rotate-180" />, desc: <ChevronDown className="w-3 h-3" /> }[header.column.getIsSorted()] ?? null}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="divide-y divide-white/[0.04]">
                            {isLoading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i}><td colSpan={columns.length} className="px-5 py-4"><div className="skeleton h-6 w-full rounded" /></td></tr>
                                ))
                            ) : table.getRowModel().rows.length ? (
                                table.getRowModel().rows.map(row => (
                                    <tr key={row.id} className="table-row-hover group">
                                        {row.getVisibleCells().map(cell => (
                                            <td key={cell.id} className="px-5 py-3.5 align-middle">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan={columns.length} className="px-5 py-8 text-center text-white/30 text-sm">No appointments found</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
                 {/* Pagination */}
                <div className="flex items-center justify-between px-5 py-3 border-t border-white/[0.06]">
                    <span className="text-[11px] text-white/30">
                        Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </span>
                    <div className="flex gap-2">
                         <button disabled={!table.getCanPreviousPage()} onClick={() => table.previousPage()} className="p-1 rounded hover:bg-white/10 disabled:opacity-30 transition-colors"><ChevronLeft className="w-4 h-4" /></button>
                         <button disabled={!table.getCanNextPage()} onClick={() => table.nextPage()} className="p-1 rounded hover:bg-white/10 disabled:opacity-30 transition-colors"><ChevronRight className="w-4 h-4" /></button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
