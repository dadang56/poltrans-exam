import { Users, FileText, CheckCircle, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/server"; // Use server client

// Helper to fetch data
async function getStats() {
    const supabase = await createClient(); // Await createClient

    // Parallel fetching
    const [
        { count: userCount },
        { count: activeExamCount },
        { count: finishedExamCount },
        { data: recentExams },
        { data: recentUsers }
    ] = await Promise.all([
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('exams').select('*', { count: 'exact', head: true }).eq('status', 'ongoing'),
        supabase.from('exams').select('*', { count: 'exact', head: true }).eq('status', 'completed'), // Assumption for 'Selesai Hari Ini'
        supabase.from('exams').select('title, start_time, status').order('created_at', { ascending: false }).limit(5),
        supabase.from('users').select('full_name, role, nim_nip, avatar_url').order('created_at', { ascending: false }).limit(5)
    ]);

    return {
        userCount: userCount || 0,
        activeExamCount: activeExamCount || 0,
        finishedExamCount: finishedExamCount || 0,
        recentExams: recentExams || [],
        recentUsers: recentUsers || []
    };
}

export default async function SuperadminDashboard() {
    const { userCount, activeExamCount, finishedExamCount, recentExams, recentUsers } = await getStats();

    const stats = [
        { label: "Total User", value: userCount.toString(), icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
        { label: "Ujian Aktif", value: activeExamCount.toString(), icon: FileText, color: "text-emerald-600", bg: "bg-emerald-100" },
        { label: "Selesai Hari Ini", value: finishedExamCount.toString(), icon: CheckCircle, color: "text-green-600", bg: "bg-green-100" },
        { label: "Perlu Perhatian", value: "0", icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-100" }, // Logic TBD
    ];

    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
                <p className="text-gray-500">Selamat datang! Berikut ringkasan sistem hari ini.</p>

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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Ujian Terbaru */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            <FileText className="h-5 w-5 text-gray-400" /> Ujian Terbaru
                        </h3>
                        <button className="text-sm text-gray-400 hover:text-gray-600">Lihat Semua</button>
                    </div>

                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-gray-500 text-xs uppercase tracking-wider text-left border-b border-gray-100">
                                <th className="pb-3 font-medium">Nama Ujian</th>
                                <th className="pb-3 font-medium">Tanggal</th>
                                <th className="pb-3 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {recentExams.length > 0 ? recentExams.map((exam: any, i: number) => (
                                <tr key={i} className="group">
                                    <td className="py-4 text-gray-900 font-medium">{exam.title}</td>
                                    <td className="py-4 text-gray-500">{new Date(exam.start_time).toLocaleDateString()}</td>
                                    <td className="py-4">
                                        <span className="px-2.5 py-1 rounded-md bg-blue-100 text-blue-700 text-xs font-semibold uppercase">{exam.status}</span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={3} className="py-4 text-center text-gray-400">Belum ada ujian</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* User Terbaru */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            <Users className="h-5 w-5 text-gray-400" /> User Terbaru
                        </h3>
                        <button className="text-sm text-gray-400 hover:text-gray-600">Lihat Semua</button>
                    </div>

                    <div className="space-y-4">
                        {recentUsers.map((user: any, i: number) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                                        {user.avatar_url?.length === 1 ? user.avatar_url : user.full_name[0]}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900 text-sm">{user.full_name}</p>
                                        <p className="text-xs text-gray-500 capitalize">{user.role} • {user.nim_nip || '-'}</p>
                                    </div>
                                </div>
                                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-semibold">
                                    AKTIF
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
