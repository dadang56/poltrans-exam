"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Users,
    BookOpen,
    GraduationCap,
    Calendar,
    Printer,
    MapPin,
    ClipboardList,
    UserCheck,
    FileText,
    Download,
    Settings,
    FileEdit,
    CheckCircle,
    FileCheck,
    Monitor,
    AlertTriangle,
    Clock,
    ShieldCheck
} from "lucide-react";
import { Role } from "@/types";
import { useAuthStore } from "@/lib/store";

const MENUS: Record<string, { title: string; href: string; icon: any }[]> = {
    superadmin: [
        { title: "Dashboard", href: "/superadmin", icon: LayoutDashboard },
        { title: "Manajemen User", href: "/superadmin/users", icon: Users },
        { title: "Program Studi", href: "/superadmin/prodi", icon: GraduationCap },
        { title: "Kelas", href: "/superadmin/kelas", icon: BookOpen },
        { title: "Mata Kuliah", href: "/superadmin/matkul", icon: BookOpen },
        { title: "Jadwal Ujian", href: "/superadmin/jadwal", icon: Calendar },
        { title: "Cetak Kartu", href: "/superadmin/kartu", icon: Printer },
        { title: "Ruang Ujian", href: "/superadmin/ruang", icon: MapPin },
        { title: "Rekap Nilai", href: "/superadmin/nilai", icon: ClipboardList },
        { title: "Rekap Kehadiran", href: "/superadmin/kehadiran", icon: UserCheck },
        { title: "Rekap Nilai Mahasiswa", href: "/superadmin/nilai-mahasiswa", icon: FileText },
        { title: "Ekspor Data", href: "/superadmin/ekspor", icon: Download },
        { title: "Pengaturan", href: "/superadmin/settings", icon: Settings },
    ],
    "admin-prodi": [
        { title: "Dashboard", href: "/admin-prodi", icon: LayoutDashboard },
        { title: "Manajemen User", href: "/admin-prodi/users", icon: Users },
        { title: "Kelas", href: "/admin-prodi/kelas", icon: BookOpen },
        { title: "Mata Kuliah", href: "/admin-prodi/matkul", icon: BookOpen },
        { title: "Jadwal Ujian", href: "/admin-prodi/jadwal", icon: Calendar },
        { title: "Cetak Kartu", href: "/admin-prodi/kartu", icon: Printer },
        { title: "Ruang Ujian", href: "/admin-prodi/ruang", icon: MapPin },
        { title: "Rekap Nilai", href: "/admin-prodi/nilai", icon: ClipboardList },
        { title: "Rekap Kehadiran", href: "/admin-prodi/kehadiran", icon: UserCheck },
        { title: "Rekap Berita Acara", href: "/admin-prodi/berita-acara", icon: FileText },
        { title: "Rekap Nilai Mahasiswa", href: "/admin-prodi/nilai-mahasiswa", icon: FileText },
        { title: "Ekspor Data", href: "/admin-prodi/ekspor", icon: Download },
        { title: "Pengaturan", href: "/admin-prodi/settings", icon: Settings },
    ],
    dosen: [
        { title: "Dashboard", href: "/dosen", icon: LayoutDashboard },
        { title: "Buat Soal", href: "/dosen/soal", icon: FileEdit },
        { title: "Koreksi Ujian", href: "/dosen/koreksi", icon: CheckCircle },
        { title: "Nilai Ujian", href: "/dosen/nilai", icon: FileCheck },
        { title: "Nilai Akhir", href: "/dosen/nilai-akhir", icon: FileText },
    ],
    pengawas: [
        { title: "Dashboard", href: "/pengawas", icon: LayoutDashboard },
        { title: "Monitor Ujian", href: "/pengawas/monitor", icon: Monitor },
        { title: "Kehadiran", href: "/pengawas/kehadiran", icon: UserCheck },
        { title: "Berita Acara", href: "/pengawas/berita-acara", icon: FileText },
    ],
    mahasiswa: [
        { title: "Dashboard", href: "/mahasiswa", icon: LayoutDashboard },
        { title: "Ujian", href: "/mahasiswa/ujian", icon: FileEdit },
        { title: "Hasil Ujian", href: "/mahasiswa/hasil", icon: ClipboardList },
        { title: "Safe Exam Browser", href: "/mahasiswa/seb", icon: ShieldCheck },
    ],
};

export function Sidebar({ className }: { className?: string }) {
    const { initialize } = useAuthStore();
    useEffect(() => {
        initialize();
    }, []);

    const pathname = usePathname();
    const role = pathname.split("/")[1] as Role; // Simple role extraction
    const menuItems = MENUS[role] || [];

    return (
        <aside className={cn("hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 overflow-y-auto", className)}>
            <div className="p-6 flex items-center gap-3">
                <img src="/logo.png" alt="Logo" className="h-8 w-8" /> {/* Placeholder for logo */}
                <div className="font-bold text-lg leading-tight text-slate-900">
                    POLTEKTRANS<br />
                    <span className="text-xs text-slate-500 font-normal">EXAM</span>
                </div>
            </div>

            <div className="px-4 py-2">
                <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Menu Utama</p>
                <nav className="space-y-1">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors relative",
                                    isActive
                                        ? "bg-slate-100 text-slate-900" // Generic active
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                )}
                            >
                                {isActive && (
                                    <div className="absolute left-0 w-1 h-8 bg-blue-900 rounded-r-md" />
                                )}
                                <item.icon className={cn("h-5 w-5", isActive ? "text-blue-900" : "text-slate-400")} />
                                {item.title}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </aside>
    );
}
