"use client";

import { useAuthStore } from "@/lib/store";
import { BookOpen, FileText, CheckCircle, Clock, AlertTriangle, PenTool, CheckSquare } from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
    { label: "Mata Kuliah", value: "3", icon: BookOpen, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Total Soal", value: "3", icon: FileText, color: "text-emerald-600", bg: "bg-emerald-100" },
    { label: "Ujian Selesai", value: "0", icon: CheckCircle, color: "text-green-600", bg: "bg-green-100" },
    { label: "Perlu Koreksi", value: "0", icon: Clock, color: "text-amber-600", bg: "bg-amber-100" },
];

const courses = [
    { name: "Dinas Jaga Mesin, Keselamatan Kerja dan Bertenaga", code: "DPKC2051", sks: "1 SKS" },
    { name: "Mesin Penggerak Utama I", code: "DPKC2062", sks: "2 SKS" },
    { name: "Mesin Penggerak Utama III", code: "DPKC4052", sks: "2 SKS" },
];

export default function DosenDashboard() {
    const { user } = useAuthStore();

    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Dosen</h1>
                <p className="text-gray-500">Selamat datang, {user?.name || "Dosen"}!</p>
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

            {/* Deadline Koreksi */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-gray-900" /> Deadline Koreksi Ujian
                    </h3>
                    <button className="px-4 py-2 bg-blue-900 text-white text-sm font-medium rounded-md hover:bg-blue-800 transition-colors">
                        Koreksi Sekarang
                    </button>
                </div>
                <div className="flex flex-col items-center justify-center text-center py-10">
                    <CalendarIcon className="h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Tidak ada deadline koreksi saat ini</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* List Mata Kuliah */}
                <div className="col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-gray-400" /> Mata Kuliah
                        </h3>
                        <button className="text-xs text-gray-500 hover:text-gray-700">Kelola Soal</button>
                    </div>
                    <div className="space-y-3">
                        {courses.map((course, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                <div>
                                    <p className="font-semibold text-gray-900 text-sm">{course.name}</p>
                                    <p className="text-xs text-blue-400 font-medium">{course.code}</p>
                                </div>
                                <span className="text-xs text-gray-400">{course.sks}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Aksi Cepat */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <h3 className="font-semibold text-gray-900 mb-6">Aksi Cepat</h3>
                    <div className="space-y-3">
                        <button className="w-full py-3 bg-blue-900 text-white rounded-lg flex items-center justify-center gap-2 text-sm font-medium hover:bg-blue-800">
                            <CheckCircle className="h-4 w-4" /> Buat Soal Baru
                        </button>
                        <button className="w-full py-3 bg-amber-600 text-white rounded-lg flex items-center justify-center gap-2 text-sm font-medium hover:bg-amber-700">
                            <CheckSquare className="h-4 w-4" /> Koreksi Jawaban
                        </button>
                        <button className="w-full py-3 bg-white border border-blue-900 text-blue-900 rounded-lg flex items-center justify-center gap-2 text-sm font-medium hover:bg-blue-50">
                            <PenTool className="h-4 w-4" /> Input Nilai
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function CalendarIcon({ className }: { className?: string }) {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <line x1="16" x2="16" y1="2" y2="6" />
            <line x1="8" x2="8" y1="2" y2="6" />
            <line x1="3" x2="21" y1="10" y2="10" />
        </svg>
    )
}
