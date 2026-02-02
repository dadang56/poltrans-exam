"use client";

import { useAuthStore } from "@/lib/store";
import { Monitor, Users, AlertTriangle, CheckCircle, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
    { label: "Ujian Berlangsung", value: "0", icon: Monitor, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Peserta Aktif", value: "0", icon: Users, color: "text-emerald-600", bg: "bg-emerald-100" },
    { label: "Peringatan", value: "0", icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-100" },
    { label: "Selesai Hari Ini", value: "0", icon: CheckCircle, color: "text-green-600", bg: "bg-green-100" },
];

export default function PengawasDashboard() {
    const { user } = useAuthStore();

    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Pengawas</h1>
                <p className="text-gray-500">Selamat datang, {user?.name || "Pengawas"}! Pantau ujian yang sedang berlangsung.</p>
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

            {/* Ujian Sedang Berlangsung */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 min-h-[250px] flex flex-col">
                <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                    <Monitor className="h-5 w-5 text-gray-600" />
                    <span className="text-gray-900 font-semibold">Ujian Sedang Berlangsung</span>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-400">
                    <Monitor className="h-12 w-12 mb-3 text-gray-200" />
                    <p className="text-sm font-medium text-gray-300">Tidak Ada Ujian Berlangsung</p>
                    <p className="text-xs text-gray-300 mt-1">Saat ini tidak ada ujian yang sedang berjalan.</p>
                </div>
            </div>

            {/* Alert Terbaru */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 min-h-[200px]">
                <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                    <Shield className="h-5 w-5 text-gray-600" />
                    <span className="text-gray-900 font-semibold">Alert Terbaru</span>
                </div>

                <div className="flex flex-col items-center justify-center text-center py-8">
                    <Shield className="h-10 w-10 text-gray-100 mb-2" />
                    <p className="text-sm text-gray-300">Belum ada alert</p>
                </div>
            </div>
        </div>
    );
}
