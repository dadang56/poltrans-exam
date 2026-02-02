"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Loader2, Plus, X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";

export function AddUserModal({ onSuccess }: { onSuccess: () => void }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        full_name: "",
        email: "", // User will type email here (or auto-generated?) - Let's stick to email for Auth as per current schema
        nim_nip: "",
        role: "mahasiswa",
        password: "password123", // Default for now, in real app should be randomized or sent via email
        prodi_id: "" // In real app, fetch from DB. For now, manual or hardcoded.
    });

    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // 1. In a real app with Admin API, we would create Auth User properly.
            // Since we are client-side only (and don't want to expose Service Role Key),
            // we can only insert into the 'users' table (Profile).
            // The ACTUAL Login (Auth) user creation needs to happen manually or via a Secure Edge Function.

            // For this Mock/Demo phase:
            // We will insert into 'users' table so it shows up in the list.
            // But we CANNOT login with this user until an Admin manually creates the Auth User in Supabase Dashboard.

            // Wait! We can give a warning.

            const { error: insertError } = await supabase.from('users').insert({
                full_name: formData.full_name,
                email: formData.email,
                role: formData.role,
                nim_nip: formData.nim_nip,
                // prodi_id: ... needs valid UUID. Let's use NULL for now if empty
            });

            if (insertError) throw insertError;

            setOpen(false);
            setFormData({ full_name: "", email: "", nim_nip: "", role: "mahasiswa", password: "password123", prodi_id: "" });
            onSuccess();
            alert("User Profile created! IMPORTANT: To enable Login, please create a matching User in Supabase Auth Dashboard with this email.");

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-lg text-sm font-medium hover:bg-blue-800">
                    <Plus className="h-4 w-4" />
                    Tambah User
                </button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
                <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-xl shadow-2xl p-6 z-50 focus:outline-none">
                    <div className="flex items-center justify-between mb-4">
                        <Dialog.Title className="text-lg font-bold text-gray-900">Tambah User Baru</Dialog.Title>
                        <Dialog.Close asChild>
                            <button className="text-gray-400 hover:text-gray-600">
                                <X className="h-5 w-5" />
                            </button>
                        </Dialog.Close>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                            <input
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.full_name}
                                onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">NIM / NIP</label>
                                <input
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.nim_nip}
                                    onChange={e => setFormData({ ...formData, nim_nip: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                <select
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.role}
                                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                                >
                                    <option value="mahasiswa">Mahasiswa</option>
                                    <option value="dosen">Dosen</option>
                                    <option value="admin_prodi">Admin Prodi</option>
                                    <option value="pengawas">Pengawas</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email (Supabase Auth)</label>
                            <input
                                type="email"
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>

                        <div className="pt-4 flex justify-end gap-2">
                            <Dialog.Close asChild>
                                <button type="button" className="px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50">Batal</button>
                            </Dialog.Close>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                            >
                                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                                Simpan
                            </button>
                        </div>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
