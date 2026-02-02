"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { AddUserModal } from "@/components/AddUserModal";
import {
    Search, Filter, Home, ChevronRight,
    Trash2, Edit, MoreHorizontal, User,
    Download, Loader2
} from "lucide-react";

export default function UserManagementPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");

    const supabase = createClient();

    const fetchUsers = async () => {
        setLoading(true);
        let query = supabase.from('users').select('*, prodi:prodi_id(name)').order('created_at', { ascending: false });

        if (roleFilter !== 'all') {
            query = query.eq('role', roleFilter);
        }

        if (search) {
            // Simple search by name or nim
            // Note: 'or' syntax in Supabase client is a bit tricky with multiple columns
            // For simplicity in this iteration, let's search by full_name
            query = query.ilike('full_name', `%${search}%`);
        }

        const { data, error } = await query;
        if (data) setUsers(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, [roleFilter]); // Search usually needs debounce or manual trigger, but for now filtering triggers refetch

    // Debounced search could be here, or just on Enter
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchUsers();
    };

    return (
        <div className="space-y-6">
            {/* Breadcrumb & Header */}
            <div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <Home className="h-4 w-4" />
                    <ChevronRight className="h-4 w-4" />
                    <span>Manajemen User</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Manajemen User</h1>
                <p className="text-gray-500">Kelola data pengguna sistem CAT</p>
            </div>

            {/* Stats Cards (Optional match to design) */}
            <div className="grid grid-cols-4 gap-4">
                {[
                    { label: "Total User", value: users.length, color: "text-blue-600" },
                    { label: "Mahasiswa", value: users.filter(u => u.role === 'mahasiswa').length, color: "text-blue-600" },
                    { label: "Dosen", value: users.filter(u => u.role === 'dosen').length, color: "text-blue-600" },
                    { label: "Aktif", value: users.length, color: "text-blue-600" },
                ].map((s, i) => (
                    <div key={i} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center">
                        <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                        <p className="text-xs text-gray-500 mt-1">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Action Bar */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-4">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                    {/* Search */}
                    <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari nama, email, atau NIM..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </form>

                    <div className="flex gap-2">
                        {/* Filters */}
                        <select
                            className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                        >
                            <option value="all">Semua Role</option>
                            <option value="mahasiswa">Mahasiswa</option>
                            <option value="dosen">Dosen</option>
                            <option value="admin_prodi">Admin Prodi</option>
                        </select>

                        <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="all">Semua Prodi</option>
                            {/* Placeholder for prodi options */}
                        </select>

                        {/* Buttons */}
                        <button className="flex items-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50">
                            <Download className="h-4 w-4" />
                            Template Import
                        </button>
                        <AddUserModal onSuccess={fetchUsers} />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold">
                            <tr>
                                <th className="px-4 py-3 rounded-tl-lg">Nama</th>
                                <th className="px-4 py-3">Username</th>
                                <th className="px-4 py-3">NIM/NIP</th>
                                <th className="px-4 py-3">Prodi/Kelas</th>
                                <th className="px-4 py-3">Role</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3 rounded-tr-lg text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="py-8 text-center text-gray-400">
                                        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                                        Memuat data...
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-8 text-center text-gray-400">
                                        Tidak ada data user ditemukan.
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 font-medium text-gray-900 flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                                                {user.avatar_url?.length === 1 ? user.avatar_url : user.full_name[0].toUpperCase()}
                                            </div>
                                            {user.full_name}
                                        </td>
                                        <td className="px-4 py-3 text-gray-500">{user.email?.split('@')[0] || '-'}</td>
                                        <td className="px-4 py-3 text-gray-500 font-mono text-xs">{user.nim_nip || '-'}</td>
                                        <td className="px-4 py-3 text-gray-500">
                                            {user.prodi?.name || 'UMUM'}
                                            {/* Class Logic TBD */}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase ${user.role === 'mahasiswa' ? 'bg-blue-50 text-blue-600' :
                                                user.role === 'dosen' ? 'bg-purple-50 text-purple-600' :
                                                    'bg-gray-100 text-gray-600'
                                                }`}>
                                                {user.role.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-semibold flex items-center gap-1 w-fit">
                                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Aktif
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Placeholder */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-sm text-gray-500">Menampilkan {users.length} data</span>
                    <div className="flex gap-1">
                        <button className="px-3 py-1 border rounded text-sm disabled:opacity-50" disabled>Previous</button>
                        <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">1</button>
                        <button className="px-3 py-1 border rounded text-sm">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
