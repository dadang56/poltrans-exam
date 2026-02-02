import { CheckCircle, Calendar, Clock, Award, FileText, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/server";

async function getData() {
    const supabase = await createClient(); // Await createClient
    const { data: { user } } = await supabase.auth.getUser();

    // In current RLS, we rely on user being logged in
    // But for safe SSR without valid cookie in this mock phase, handling potential null user
    if (!user) return {
        examsCount: 0,
        upcomingExams: []
    };

    const [
        { count: examsCount },
        { data: upcomingExams }
    ] = await Promise.all([
        supabase.from('exams').select('*', { count: 'exact', head: true }), // Simplified "enrolled" count
        supabase.from('exams').select('*').eq('status', 'scheduled').order('start_time', { ascending: true }).limit(1)
    ]);

    return {
        examsCount: examsCount || 0,
        upcomingExams: upcomingExams || []
    };
}

export default async function MahasiswaDashboard() {
    const { examsCount, upcomingExams } = await getData();

    const stats = [
        { label: "Ujian Selesai", value: "0", icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
        { label: "Ujian Mendatang", value: upcomingExams.length.toString(), icon: Calendar, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Sedang Aktif", value: "0", icon: Clock, color: "text-emerald-600", bg: "bg-emerald-50" },
        { label: "Menunggu Hasil", value: "0", icon: Award, color: "text-amber-600", bg: "bg-amber-50" },
    ];

    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Mahasiswa</h1>
                <p className="text-gray-500">Selamat datang! Persiapkan diri untuk ujian.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4">
                            <div className={cn("p-3 rounded-full", stat.bg)}>
                                <stat.icon className={cn("h-6 w-6", stat.color)} />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Ujian Mendatang */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                    <FileText className="h-5 w-5 text-gray-600" />
                    <span className="text-gray-900 font-semibold">Ujian Mendatang</span>
                </div>

                {upcomingExams.length > 0 ? (
                    <div className="space-y-4">
                        {upcomingExams.map((exam: any) => (
                            <div key={exam.id} className="p-4 border rounded-lg bg-blue-50 border-blue-100 flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-blue-900">{exam.title}</h3>
                                    <p className="text-sm text-blue-700">{new Date(exam.start_time).toLocaleString()}</p>
                                </div>
                                <span className="px-3 py-1 bg-white text-blue-600 text-xs font-bold rounded-full border border-blue-200 uppercase">Scheduled</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center text-center py-12">
                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                            <span className="text-gray-400 font-bold">!</span>
                        </div>
                        <p className="text-sm text-gray-400">Tidak ada ujian mendatang</p>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Hasil Ujian Terbaru */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            <FileText className="h-5 w-5 text-gray-600" /> Hasil Ujian Terbaru
                        </h3>
                        <button className="text-xs text-gray-500 font-medium hover:text-gray-700">Lihat Semua</button>
                    </div>
                    <div className="flex flex-col items-center justify-center text-center py-10">
                        <FileText className="h-8 w-8 text-gray-200 mb-2" />
                        <p className="text-sm text-gray-400">Belum ada hasil ujian</p>
                    </div>
                </div>

                {/* Peraturan Ujian */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <AlertTriangle className="h-5 w-5 text-gray-600" />
                        <span className="text-gray-900 font-semibold">Peraturan Ujian</span>
                    </div>
                    <div className="space-y-3">
                        {[
                            "Mahasiswa wajib hadir 15 menit sebelum ujian dimulai",
                            "Dilarang membawa alat komunikasi ke dalam ruang ujian",
                            "Dilarang membuka tab/aplikasi lain selama ujian berlangsung",
                            "Jawaban yang sudah dikumpulkan tidak dapat diubah"
                        ].map((rule, i) => (
                            <div key={i} className="flex gap-3 bg-amber-50 p-3 rounded-md">
                                <span className="text-amber-600 font-bold text-xs mt-0.5">{i + 1}.</span>
                                <p className="text-xs text-gray-700">{rule}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
