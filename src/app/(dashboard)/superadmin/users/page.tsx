"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { AddUserModal } from "@/components/AddUserModal";
import {
    Search, Filter, Home, ChevronRight,
    Trash2, Edit, MoreHorizontal, User,
    Download, Loader2, RefreshCw, AlertTriangle, Plus
} from "lucide-react";

export default function UserManagementPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [prodis, setProdis] = useState<any[]>([]);

    // Modal States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<any>(null);

    // Delete States
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const supabase = createClient();

    const fetchUsers = async () => {
        setLoading(true);
        let query = supabase.from('users').select('*, prodi:prodi_id(name, code)').order('created_at', { ascending: false });

        if (roleFilter !== 'all') {
            query = query.eq('role', roleFilter);
        }

        if (search) {
            query = query.ilike('full_name', `%${search}%`);
        }

        const { data, error } = await query;
        if (data) setUsers(data);
        if (error) console.error(error);
        setLoading(false);
    };

    // Fetch Prodi for Filter (optional)
    useEffect(() => {
        const loadProdi = async () => {
            const { data } = await supabase.from('prodi').select('*');
            if (data) setProdis(data || []);
        };
        loadProdi();
        fetchUsers();
    }, [roleFilter]);

    // Handle Search
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchUsers();
    };

    // Actions
    const handleAdd = () => {
        setEditingUser(null);
        setIsModalOpen(true);
    };

    const handleEdit = (user: any) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!deletingId) return;
        setIsDeleting(true);
        // Beware: Deleting user here does NOT delete Auth User automatically unless Edge Function triggers it.
        // It only deletes the Profile.
        const { error } = await supabase.from('users').delete().eq('id', deletingId);

        if (error) {
            alert("Gagal menghapus user: " + error.message);
        } else {
            setDeletingId(null);
            fetchUsers();
        }
        setIsDeleting(false);
    };

    return (
        <div className="space-y-6 p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Manajemen User</h1>
                <div className="flex items-center gap-2 mt-1">
                    <p className="text-gray-500 text-sm">Kelola data pengguna sistem CAT</p>
                    <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">SUPABASE</span>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Total User", value: users.length, color: "text-blue-600" },
                    { label: "Mahasiswa", value: users.filter(u => u.role === 'mahasiswa').length, color: "text-blue-600" },
                    { label: "Dosen", value: users.filter(u => u.role === 'dosen').length, color: "text-blue-600" },
                    { label: "Admin", value: users.filter(u => u.role === 'admin_prodi').length, color: "text-blue-600" },
                ].map((s, i) => (
                    <div key={i} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center">
                        <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                        <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide">{s.label}</p>
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
                            placeholder="Cari nama..."
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
                            <option value="superadmin">Superadmin</option>
                        </select>

                        <button
                            onClick={handleAdd}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-lg text-sm font-medium hover:bg-blue-800 transition"
                        >
                            <Plus className="h-4 w-4" />
                            Tambah User
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold">
                            <tr>
                                <th className="px-4 py-3 rounded-tl-lg">Nama</th>
                                <th className="px-4 py-3">Email/Username</th>
                                <th className="px-4 py-3">NIM/NIP</th>
                                <th className="px-4 py-3">Prodi</th>
                                <th className="px-4 py-3">Role</th>
                                <th className="px-4 py-3 rounded-tr-lg text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="py-12 text-center text-gray-400">
                                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                                        Memuat data user...
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-12 text-center text-gray-400">
                                        Tidak ada data user.
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-4 py-3 font-medium text-gray-900 flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold border border-blue-200">
                                                {user.full_name ? user.full_name[0].toUpperCase() : "?"}
                                            </div>
                                            {user.full_name}
                                        </td>
                                        <td className="px-4 py-3 text-gray-500">{user.email || '-'}</td>
                                        <td className="px-4 py-3 text-gray-500 font-mono text-xs">{user.nim_nip || '-'}</td>
                                        <td className="px-4 py-3 text-gray-500">
                                            {user.prodi ? (
                                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">
                                                    {user.prodi.code && <span className="font-bold">{user.prodi.code}</span>}
                                                    {user.prodi.name}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400 italic text-xs">Semua/Umum</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${user.role === 'mahasiswa' ? 'bg-green-50 text-green-700 border border-green-100' :
                                                    user.role === 'dosen' ? 'bg-purple-50 text-purple-700 border border-purple-100' :
                                                        user.role === 'admin_prodi' ? 'bg-orange-50 text-orange-700 border border-orange-100' :
                                                            'bg-gray-100 text-gray-700 border border-gray-200'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition">
                                                <button
                                                    onClick={() => handleEdit(user)}
                                                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                                                    title="Edit User"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => setDeletingId(user.id)}
                                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                                                    title="Hapus User"
                                                >
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
            </div>

            {/* Add/Edit Modal */}
            <AddUserModal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                onSuccess={fetchUsers}
                userToEdit={editingUser}
            />

            {/* Delete Confirmation Modal */}
            {deletingId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 text-center space-y-4">
                            <div className="mx-auto w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                                <AlertTriangle className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Hapus User?</h3>
                                <p className="text-sm text-gray-500 mt-2">
                                    Data user akan dihapus permanen dari Database Profile.
                                    <br /><span className="text-xs text-red-500">(Note: Login Auth mungkin perlu dihapus manual di Dashboard Supabase).</span>
                                </p>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setDeletingId(null)}
                                    className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    disabled={isDeleting}
                                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition shadow-sm disabled:opacity-70 flex items-center justify-center gap-2"
                                >
                                    {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
                                    Hapus
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
