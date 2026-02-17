import { useState, useMemo } from 'react';
import {
    useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel,
    getPaginationRowModel, flexRender,
} from '@tanstack/react-table';
import { usePatients } from '../hooks/usePatients';
import { useDeletePatient } from '../hooks/useDeletePatient';
import {
    Search, Trash2, ChevronLeft, ChevronRight, UserPlus,
    MoreHorizontal, ArrowUpDown, Droplet, Calendar, Shield, Users
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import {
    ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, Tooltip
} from 'recharts';

/* ── Badge ── */
const BloodBadge = ({ type }) => {
    const colors = {
        'A+': 'bg-rose-500/10 text-rose-400 border-rose-500/20',
        'A-': 'bg-rose-500/10 text-rose-400 border-rose-500/20',
        'B+': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        'B-': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        'AB+': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
        'AB-': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
        'O+': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        'O-': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    };
    return (
        <span className={`px-2 py-0.5 rounded-md border text-[10px] font-bold ${colors[type] || 'bg-gray-500/10 text-gray-400'}`}>
            {type}
        </span>
    );
};

/* ── Chart Tooltip ── */
const Tip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="px-2.5 py-1.5 bg-gray-900/95 border border-white/10 rounded-lg text-xs font-bold text-white shadow-xl">
            {payload[0].name}: {payload[0].value}
        </div>
    );
};

export default function PatientsPage() {
    const [sorting, setSorting] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const { data: patients = [], isLoading } = usePatients(sorting); // Pass sorting state to hook
    const { mutate: deletePatient } = useDeletePatient();

    /* ── Stats ── */
    const stats = useMemo(() => {
        if (!patients.length) return { total: 0, blood: [], age: [] };
        const blood = Object.entries(patients.reduce((acc, p) => {
            acc[p.bloodGroup] = (acc[p.bloodGroup] || 0) + 1;
            return acc;
        }, {})).map(([name, value]) => ({ name, value }));

        const now = new Date();
        const age = patients.reduce((acc, p) => {
            const y = now.getFullYear() - new Date(p.dateOfBirth).getFullYear();
            const g = y < 18 ? '<18' : y < 30 ? '18-29' : y < 50 ? '30-49' : y < 70 ? '50-69' : '70+';
            acc[g] = (acc[g] || 0) + 1;
            return acc;
        }, {});
        const ageData = ['<18', '18-29', '30-49', '50-69', '70+'].map(name => ({ name, value: age[name] || 0 }));

        return { total: patients.length, blood, age: ageData };
    }, [patients]);

    /* ── Columns ── */
    const columns = useMemo(() => [
        {
            accessorFn: row => `${row.user.profile.firstName} ${row.user.profile.lastName}`,
            id: 'name',
            header: 'Patient',
            cell: info => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-white/10 text-[10px] font-bold text-white/70">
                        {info.row.original.user.profile.firstName[0]}{info.row.original.user.profile.lastName[0]}
                    </div>
                    <div>
                        <div className="font-medium text-white/90 text-[13px]">{info.getValue()}</div>
                        <div className="text-[10px] text-white/30">{info.row.original.user.email}</div>
                    </div>
                </div>
            ),
        },
        {
            accessorKey: 'bloodGroup',
            header: 'Blood',
            cell: info => <BloodBadge type={info.getValue()} />,
        },
        {
            accessorKey: 'dateOfBirth',
            header: 'Age',
            cell: info => {
                const age = new Date().getFullYear() - new Date(info.getValue()).getFullYear();
                return <span className="text-white/50 text-[13px]">{age} yrs</span>;
            },
        },
        {
            accessorKey: 'createdAt',
            header: 'Joined',
            cell: info => <span className="text-white/40 text-[11px]">{format(new Date(info.getValue()), 'MMM d, yyyy')}</span>,
        },
        {
            id: 'actions',
            cell: info => (
                <button
                    onClick={() => {
                        if (confirm('Delete this patient?')) {
                            toast.promise(new Promise((resolve, reject) => deletePatient(info.row.original.id, { onSuccess: resolve, onError: reject })), {
                                loading: 'Deleting...', success: 'Patient deleted', error: 'Failed to delete'
                            });
                        }
                    }}
                    className="p-1.5 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            ),
        },
    ], [deletePatient]);

    const table = useReactTable({
        data: patients, columns, state: { sorting, globalFilter },
        onSortingChange: setSorting, onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(), getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(), getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Patients</h2>
                    <p className="text-white/30 text-xs mt-1">Manage patient records & history</p>
                </div>
                <button className="btn-premium px-4 py-2 rounded-lg text-xs flex items-center gap-2">
                    <UserPlus className="w-4 h-4" /> Add Patient
                </button>
            </motion.div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div className="glass-card p-4 relative overflow-hidden group" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
                        <Users className="w-24 h-24" />
                    </div>
                    <h3 className="text-white/40 text-xs font-medium uppercase tracking-wider mb-1">Total Patients</h3>
                    <div className="text-3xl font-bold text-white">{stats.total}</div>
                    <div className="mt-2 text-[10px] text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                        <ArrowUpDown className="w-3 h-3" /> +12% this month
                    </div>
                </motion.div>

                <motion.div className="glass-card p-4 flex items-center justify-between" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <div>
                        <h3 className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2">Blood Groups</h3>
                        <div className="flex gap-2">
                             {stats.blood.slice(0, 3).map((b, i) => (
                                 <div key={i} className="text-[10px] text-white/50 flex items-center gap-1">
                                     <div className="w-1.5 h-1.5 rounded-full" style={{ background: ['#f43f5e', '#3b82f6', '#8b5cf6'][i] }} />
                                     {b.name}
                                 </div>
                             ))}
                        </div>
                    </div>
                    <div className="h-16 w-16">
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie data={stats.blood} dataKey="value" innerRadius={20} outerRadius={30} paddingAngle={2} stroke="none">
                                    {stats.blood.map((_, i) => <Cell key={i} fill={['#f43f5e', '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'][i % 5]} />)}
                                </Pie>
                                <Tooltip content={<Tip />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div className="glass-card p-4 flex items-center justify-between" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <div>
                        <h3 className="text-white/40 text-xs font-medium uppercase tracking-wider mb-1">Age Demographics</h3>
                        <p className="text-[10px] text-white/30">Majority in 30-49 range</p>
                    </div>
                    <div className="h-16 w-24">
                        <ResponsiveContainer>
                            <BarChart data={stats.age}>
                                <Bar dataKey="value" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                                <Tooltip content={<Tip />} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            {/* Table */}
            <motion.div className="glass-card overflow-hidden" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <div className="p-4 border-b border-white/[0.06] flex items-center gap-3">
                    <Search className="w-4 h-4 text-white/30" />
                    <input
                        value={globalFilter ?? ''}
                        onChange={e => setGlobalFilter(e.target.value)}
                        placeholder="Search patients..."
                        className="bg-transparent border-none outline-none text-sm text-white placeholder-white/30 w-full"
                    />
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
                                                {{ asc: <ChevronLeft className="w-3 h-3 rotate-90" />, desc: <ChevronLeft className="w-3 h-3 -rotate-90" /> }[header.column.getIsSorted()] ?? null}
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
                                <tr><td colSpan={columns.length} className="px-5 py-8 text-center text-white/30 text-sm">No patients found</td></tr>
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
