"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import {
    Plus,
    Search,
    RefreshCw,
    Pencil,
    Trash2,
    X,
    Save,
    Loader2,
    BookOpen
} from "lucide-react";

export default function ProdiPage() {
    const [prodis, setProdis] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({ code: "", name: "" });
    const [editingId, setEditingId] = useState<string | null>(null);

    const supabase = createClient();

    // Fetch Data
    const fetchProdis = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("prodi")
            .select("*")
            .order("name", { ascending: true });

        if (error) {
            console.error("Error fetching prodi:", error);
            alert("Gagal memuat data: " + error.message);
        } else {
            setProdis(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchProdis();
    }, []);

    // Handle Edit Click
    const handleEdit = (prodi: any) => {
        setEditingId(prodi.id);
        setFormData({ code: prodi.code || "", name: prodi.name });
        setIsModalOpen(true);
    };

    // Handle Add Click
    const handleAdd = () => {
        setEditingId(null);
        setFormData({ code: "", name: "" });
        setIsModalOpen(true);
    };

    // Handle Submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.code || !formData.name) return;

        setIsSubmitting(true);
        let error;

        if (editingId) {
            // UPDATE
            const { error: updateError } = await supabase
                .from("prodi")
                .update({ code: formData.code, name: formData.name })
                .eq("id", editingId);
            error = updateError;
        } else {
            // INSERT
            const { error: insertError } = await supabase
                .from("prodi")
                .insert([{ code: formData.code, name: formData.name }]);
            error = insertError;
        }

        if (error) {
            alert("Gagal menyimpan: " + error.message);
        } else {
            setIsModalOpen(false);
            setFormData({ code: "", name: "" });
            setEditingId(null);
            fetchProdis();
        }
        setIsSubmitting(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Yakin ingin menghapus Prodi ini? Data terkait (User/Mata Kuliah) mungkin ikut terhapus.")) return;
        const { error } = await supabase.from("prodi").delete().eq("id", id);
        if (error) alert("Gagal menghapus: " + error.message);
        else fetchProdis();
    };

    // Filter
    const filtered = prodis.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.code && p.code.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Manajemen Program Studi</h1>
                    <div className="flex items-center gap-2 mt-1">
                        <p className="text-gray-500 text-sm">Kelola data program studi</p>
                        <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">DATABASE</span>
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchProdis}
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition"
                        title="Refresh Data"
                    >
                        <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                        onClick={handleAdd}
                        className="flex items-center gap-2 bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition shadow-sm text-sm font-medium"
                    >
                        <Plus className="h-4 w-4" /> Tambah Prodi
                    </button>
                </div>

                {/* Stats */}
                <div className="hidden md:flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-gray-900">{prodis.length}</span>
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Total Prodi</span>
                </div>

                <div className="w-full md:w-auto relative">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Cari kode atau nama prodi..."
                        className="w-full md:w-64 pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Content */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden min-h-[400px]">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-medium uppercase text-xs border-b">
                            <tr>
                                <th className="px-6 py-4 w-24">Kode</th>
                                <th className="px-6 py-4">Nama Program Studi</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={3} className="px-6 py-12 text-center text-gray-400">
                                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                                        Memuat Data...
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-6 py-12 text-center text-gray-400">
                                        Tidak ada data prodi.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((prodi) => (
                                    <tr key={prodi.id} className="hover:bg-gray-50 transition group">
                                        <td className="px-6 py-4">
                                            <div className="bg-blue-50 text-blue-700 font-bold px-2.5 py-1 rounded inline-block text-xs uppercase border border-blue-100">
                                                {prodi.code || "?"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                                            <div className="p-2 bg-gray-100 rounded text-gray-400">
                                                <BookOpen className="h-4 w-4" />
                                            </div>
                                            {prodi.name}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition">
                                                <button
                                                    onClick={() => handleEdit(prodi)}
                                                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(prodi.id)}
                                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition"
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

            {/* Modal Tambah/Edit */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h3 className="font-bold text-gray-900">
                                {editingId ? "Edit Program Studi" : "Tambah Program Studi"}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-700 block">Kode Prodi</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    placeholder="Contoh: TI"
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-700 block">Nama Program Studi</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    placeholder="Contoh: Teknologi Informasi"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="pt-4 flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-800 rounded-lg hover:bg-blue-900 transition flex items-center gap-2 shadow-sm disabled:opacity-70"
                                >
                                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
