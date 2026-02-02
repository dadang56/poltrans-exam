"use client";

import { useAuthStore } from "@/lib/store"; // Assuming usage of store for user info
import { Bell, LogOut, ChevronDown, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

export function Topbar({ className }: { className?: string }) {
    const { user, logout } = useAuthStore();

    return (
        <header className={cn("h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 fixed top-0 right-0 left-64 z-10", className)}>
            <div className="flex items-center gap-4">
                {/* Academic Year Selector */}
                {/* Could be a dropdown, purely visual for now */}
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-semibold text-gray-900">{user?.name || "User"}</p>
                        <p className="text-xs text-gray-500 capitalize">{user?.role || "Role"}</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold">
                        {user?.avatar || "U"}
                    </div>
                </div>

                <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                    <Moon className="h-5 w-5" />
                </button>

                <button onClick={logout} className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    <LogOut className="h-4 w-4" />
                    Keluar
                </button>
            </div>
        </header>
    );
}
