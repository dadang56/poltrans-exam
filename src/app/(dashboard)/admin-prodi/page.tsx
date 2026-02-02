"use client";

import { useAuthStore } from "@/lib/store";
import { Users, FileText, CheckCircle, AlertTriangle, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
    { label: "Total User", value: "81", icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Ujian Aktif", value: "0", icon: FileText, color: "text-emerald-600", bg: "bg-emerald-100" },
    { label: "Selesai Hari Ini", value: "0", icon: CheckCircle, color: "text-green-600", bg: "bg-green-100" },
    { label: "Perlu Perhatian", value: "0", icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-100" },
];

export default function AdminProdiDashboard() {
    const { user } = useAuthStore();

    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin Prodi</h1>
                <p className="text-gray-500">Selamat datang, {user?.name || "Admin"}!</p>

                <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-700 font-medium">
                        <span className="text-blue-600">📅</span> 2024/2025 Genap
                    </div>
                    <span className="text-gray-400">▼</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                        <div>
                            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                        </div>
                        <div className={cn("p-3 rounded-full", stat.bg)}>
                            <stat.icon className={cn("h-6 w-6", stat.color)} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Jadwal Ujian */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 min-h-[200px] flex flex-col">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-gray-400" /> Jadwal Ujian
                    </h3>
                    <button className="px-4 py-2 bg-blue-900 text-white text-sm font-medium rounded-md hover:bg-blue-800 transition-colors">
                        Kelola Jadwal
                    </button>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-400">
                    <Calendar className="h-12 w-12 mb-3 text-gray-200" />
                    <p className="text-sm">Tidak ada jadwal ujian mendatang</p>
                </div>
            </div>

            {/* Ujian Sedang Berlangsung */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 min-h-[200px] flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                    <span className="text-gray-900 font-semibold">▶ Ujian Sedang Berlangsung</span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-600 text-xs font-bold rounded-sm uppercase tracking-wider">0 Aktif</span>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-400">
                    <span className="text-4xl text-gray-200 mb-3">▷</span>
                    <p className="text-sm">Tidak ada ujian yang sedang berlangsung</p>
                </div>
            </div>
        </div>
    );
}
