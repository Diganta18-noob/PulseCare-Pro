import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    flexRender,
} from '@tanstack/react-table';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePatients } from '../hooks/usePatients';
import { useDeletePatient } from '../hooks/useDeletePatient';
import { useAuthStore } from '../stores/authStore';
import { ArrowUpDown, ArrowUp, ArrowDown, Trash2, Search, Users, AlertTriangle } from 'lucide-react';

export default function PatientTable() {
    const [sorting, setSorting] = useState([]);
    const [search, setSearch] = useState('');
    const { data: patients = [], isLoading } = usePatients(sorting);
    const { mutate: deletePatient, isPending: isDeleting } = useDeletePatient();
    const userRole = useAuthStore((s) => s.user?.role);

    const filtered = useMemo(() => {
        if (!search) return patients;
        const lower = search.toLowerCase();
        return patients.filter(p =>
            `${p.user?.profile?.firstName} ${p.user?.profile?.lastName}`.toLowerCase().includes(lower) ||
            p.user?.email?.toLowerCase().includes(lower)
        );
    }, [patients, search]);

    const columns = useMemo(() => [
        {
            accessorFn: (row) => `${row.user?.profile?.firstName || ''} ${row.user?.profile?.lastName || ''}`,
            id: 'name',
            header: 'Name',
            cell: ({ getValue }) => (
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-white/10">
                        <span className="text-xs font-bold text-blue-300">{getValue().split(' ').map(n => n[0]).join('')}</span>
                    </div>
                    <span className="font-medium text-white/80">{getValue()}</span>
                </div>
            ),
        },
        {
            accessorFn: (row) => row.user?.email,
            id: 'email',
            header: 'Email',
            cell: ({ getValue }) => <span className="text-white/40 text-sm font-mono">{getValue()}</span>,
        },
        {
            accessorKey: 'dateOfBirth',
            header: 'Date of Birth',
            cell: ({ getValue }) => <span className="text-white/40 text-sm">{getValue() ? new Date(getValue()).toLocaleDateString() : '—'}</span>,
        },
        {
            accessorKey: 'bloodGroup',
            header: 'Blood Group',
            cell: ({ getValue }) => getValue() ? (
                <span className="px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/15 text-red-300 text-xs font-bold">
                    {getValue()}
                </span>
            ) : <span className="text-white/20">—</span>,
        },
        ...(userRole === 'ADMIN' ? [{
            id: 'actions',
            header: '',
            cell: ({ row }) => (
                <motion.button
                    onClick={() => { if (confirm('Delete this patient?')) deletePatient(row.original.id); }}
                    disabled={isDeleting}
                    className="p-2 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-30"
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <Trash2 className="w-4 h-4" />
                </motion.button>
            ),
        }] : []),
    ], [userRole, isDeleting, deletePatient]);

    const table = useReactTable({
        data: filtered,
        columns,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <div className="space-y-6">
            {/* Search Bar */}
            <div className="relative max-w-sm">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input
                    type="text"
                    placeholder="Search patients..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl input-premium text-sm"
                />
            </div>

            {/* Table */}
            <motion.div
                className="glass-card overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <table className="w-full">
                    <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id} className="border-b border-white/[0.04]">
                                {headerGroup.headers.map(header => (
                                    <th
                                        key={header.id}
                                        className="px-5 py-4 text-left text-[11px] font-bold text-white/30 uppercase tracking-wider cursor-pointer select-none hover:text-white/50 transition-colors"
                                        onClick={header.column.getToggleSortingHandler()}
                                    >
                                        <div className="flex items-center gap-2">
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                            {header.column.getCanSort() && (
                                                header.column.getIsSorted() === 'asc' ? <ArrowUp className="w-3 h-3 text-blue-400" /> :
                                                    header.column.getIsSorted() === 'desc' ? <ArrowDown className="w-3 h-3 text-blue-400" /> :
                                                        <ArrowUpDown className="w-3 h-3 opacity-30" />
                                            )}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {isLoading ? (
                            [...Array(5)].map((_, i) => (
                                <tr key={i} className="border-b border-white/[0.02]">
                                    {columns.map((_, j) => (
                                        <td key={j} className="px-5 py-4">
                                            <div className="skeleton h-5 rounded" style={{ width: `${50 + Math.random() * 40}%` }} />
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <AnimatePresence>
                                {table.getRowModel().rows.map((row, i) => (
                                    <motion.tr
                                        key={row.id}
                                        className="border-b border-white/[0.02] table-row-hover"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 10 }}
                                        transition={{ delay: i * 0.03 }}
                                    >
                                        {row.getVisibleCells().map(cell => (
                                            <td key={cell.id} className="px-5 py-4">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        )}
                    </tbody>
                </table>

                {/* Empty State */}
                {!isLoading && filtered.length === 0 && (
                    <motion.div
                        className="text-center py-16"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <Users className="w-12 h-12 text-white/10 mx-auto mb-3" />
                        <p className="text-white/25 text-sm">No patients found</p>
                    </motion.div>
                )}

                {/* Footer */}
                {!isLoading && filtered.length > 0 && (
                    <div className="px-5 py-3 border-t border-white/[0.04] flex items-center justify-between">
                        <span className="text-xs text-white/20">{filtered.length} patient{filtered.length !== 1 ? 's' : ''}</span>
                        <span className="text-xs text-white/15">Powered by TanStack Table v8</span>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
