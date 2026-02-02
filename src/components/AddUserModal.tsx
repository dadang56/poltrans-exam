"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Loader2, Plus, X, Save, Eye, EyeOff } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";

type UserData = {
    id?: string;
    full_name: string;
    username: string; // New: Free text username
    personal_email?: string; // New: Optional contact email
    auth_email?: string; // Hidden: username@poltrans.com
    nim_nip: string;
    role: string;
    prodi_id: string;
    password?: string;
    status: string;
    email?: string; // Legacy/Auth email mapping
};

interface AddUserModalProps {
    onSuccess: () => void;
    userToEdit?: UserData | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AddUserModal({ onSuccess, userToEdit, open, onOpenChange }: AddUserModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [prodis, setProdis] = useState<any[]>([]);
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState<UserData>({
        full_name: "",
        username: "",
        personal_email: "",
        nim_nip: "",
        role: "admin_prodi",
        prodi_id: "",
        password: "",
        status: "active"
    });

    const supabase = createClient();

    // Fetch Prodis
    useEffect(() => {
        const fetchProdi = async () => {
            const { data } = await supabase.from('prodi').select('id, name, code').order('name');
            if (data) setProdis(data);
        };
        fetchProdi();
    }, []);

    // Load Data on Edit
    useEffect(() => {
        if (userToEdit) {
            // Try to get username from column OR parse from auth email
            let initialUsername = userToEdit.username;
            if (!initialUsername && userToEdit.email) {
                initialUsername = userToEdit.email.split('@')[0];
            }

            setFormData({
                ...userToEdit,
                username: initialUsername || "",
                personal_email: userToEdit.personal_email || "",
                password: "",
                status: userToEdit.status || "active"
            });
        } else {
            // Reset
            setFormData({
                full_name: "",
                username: "",
                personal_email: "",
                nim_nip: "",
                role: "admin_prodi",
                prodi_id: "",
                password: "",
                status: "active"
            });
        }
    }, [userToEdit, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Logic: Construct Auth Email
            // Remove spaces from username for email safety
            const cleanUsername = formData.username.trim().replace(/\s+/g, '').toLowerCase();
            const authEmail = `${cleanUsername}@poltrans.com`;

            // Logic: Role & Prodi
            if (formData.role === 'superadmin') formData.prodi_id = "";

            const payload: any = {
                full_name: formData.full_name,
                email: authEmail, // Auth Email (Required by DB Constraint)
                username: formData.username, // Save Real Username
                personal_email: formData.personal_email || null, // Optional
                role: formData.role,
                nim_nip: formData.nim_nip,
                prodi_id: formData.prodi_id || null,
                status: formData.status
            };

            let resultError;

            if (userToEdit?.id) {
                // UPDATE
                const { error } = await supabase
                    .from('users')
                    .update(payload)
                    .eq('id', userToEdit.id);
                resultError = error;
            } else {
                // INSERT
                const { error } = await supabase.from('users').insert(payload);
                resultError = error;
            }

            if (resultError) throw resultError;

            onOpenChange(false);
            onSuccess();

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-in fade-in" />
                <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-xl shadow-2xl p-6 z-50 focus:outline-none animate-in zoom-in-95">
                    <div className="flex items-center justify-between mb-4 border-b pb-4">
                        <Dialog.Title className="text-lg font-bold text-gray-900">
                            {userToEdit ? "Edit User" : "Tambah User Baru"}
                        </Dialog.Title>
                        <Dialog.Close asChild>
                            <button className="text-gray-400 hover:text-gray-600">
                                <X className="h-5 w-5" />
                            </button>
                        </Dialog.Close>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Nama */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                            <input
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                                value={formData.full_name}
                                onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                                required
                                placeholder="Contoh: Ahmad Budi"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Username */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition bg-gray-50"
                                    value={formData.username}
                                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                                    required
                                    placeholder="Input Username Login"
                                />
                                <p className="text-[10px] text-gray-500 mt-1">Digunakan untuk Login</p>
                            </div>

                            {/* NIP */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">NIP</label>
                                <input
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                                    value={formData.nim_nip}
                                    onChange={e => setFormData({ ...formData, nim_nip: e.target.value })}
                                    placeholder="NIP"
                                />
                            </div>
                        </div>

                        {/* Email (Optional) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-gray-400 font-normal">(Opsional)</span></label>
                            <input
                                type="email"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                                value={formData.personal_email}
                                onChange={e => setFormData({ ...formData, personal_email: e.target.value })}
                                placeholder="nama@email.com"
                            />
                        </div>

                        {/* Role & Status */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                <select
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition bg-white"
                                    value={formData.role}
                                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                                >
                                    <option value="admin_prodi">Admin Prodi</option>
                                    <option value="superadmin">Superadmin</option>
                                    <option value="dosen">Dosen</option>
                                    <option value="pengawas">Pengawas</option>
                                    <option value="mahasiswa">Mahasiswa</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.status}
                                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option value="active">Aktif</option>
                                    <option value="inactive">Tidak Aktif</option>
                                </select>
                            </div>
                        </div>

                        {/* Prodi Select - Only for Admin Prodi */}
                        {formData.role === 'admin_prodi' && (
                            <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                                <label className="block text-sm font-medium text-blue-700 mb-1">Program Studi</label>
                                <select
                                    className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition bg-white"
                                    value={formData.prodi_id}
                                    onChange={e => setFormData({ ...formData, prodi_id: e.target.value })}
                                >
                                    <option value="">-- Pilih Program Studi --</option>
                                    {prodis.map(p => (
                                        <option key={p.id} value={p.id}>
                                            {p.code ? `${p.code} - ` : ''}{p.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Password Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    placeholder={userToEdit ? "Isi jika ingin mengubah password" : "Minimal 6 karakter"}
                                    required={!userToEdit}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="pt-6 flex justify-end gap-3 border-t mt-6">
                            <Dialog.Close asChild>
                                <button type="button" className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
                                    Batal
                                </button>
                            </Dialog.Close>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2 bg-blue-900 text-white rounded-lg text-sm font-medium hover:bg-blue-800 transition shadow-sm disabled:opacity-70 flex items-center gap-2"
                            >
                                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                                <Save className="h-4 w-4" />
                                {userToEdit ? "Simpan Perubahan" : "Tambah User"}
                            </button>
                        </div>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
