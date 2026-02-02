export type Role = "superadmin" | "admin-prodi" | "dosen" | "pengawas" | "mahasiswa";

export interface User {
    id: string;
    name: string;
    role: Role;
    nim_nip?: string; // NIM for student, NIP for others
    avatar?: string;
    prodi?: string; // For Admin Prodi, Dosen, Mahasiswa
}

export interface Exam {
    id: string;
    title: string;
    date: string;
    status: "active" | "upcoming" | "completed";
    course: string;
}

export interface MenuItem {
    title: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
}
