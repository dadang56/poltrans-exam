"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Loader2, LogIn, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      // Middleware will handle redirection based on role
      router.refresh();
      // Force hard navigation to trigger middleware if refresh doesn't immediately
      // But typically refresh + router.push('/') works. 
      // Let's just refresh to let middleware take over or use a helper to look up role if we want instant feedback.
      // For now, refresh is safer as it re-runs server components/middleware

    } catch (err: any) {
      setError(err.message || "Gagal masuk. Periksa email dan password.");
    } finally {
      setLoading(false);
    }
  };

  // Mock Login Helper for Demo Purposes (Optional, remove in production)
  const fillCredentials = (roleEmail: string) => {
    setEmail(roleEmail);
    setPassword("password"); // Assuming all seed users have 'password'
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <div className="text-center mb-8">
          <img src="/logo.png" alt="POLTEKTRANS Logo" className="h-16 w-16 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">Online Examination System</h1>
          <p className="text-gray-500 text-sm mt-2">Masuk untuk melanjutkan ke dashboard.</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center gap-2 text-sm mb-6">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="nama@poltrans.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-900 text-white py-2.5 rounded-lg hover:bg-blue-800 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <div className="mt-8">
          <p className="text-xs text-center text-gray-400 mb-4 uppercase tracking-wider">-- Demo Quick Access --</p>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => fillCredentials('superadmin@poltrans.com')} className="text-xs py-1 px-2 border rounded hover:bg-gray-50 text-gray-600">Superadmin</button>
            <button onClick={() => fillCredentials('adminprodi@poltrans.com')} className="text-xs py-1 px-2 border rounded hover:bg-gray-50 text-gray-600">Admin Prodi</button>
            <button onClick={() => fillCredentials('dosen@poltrans.com')} className="text-xs py-1 px-2 border rounded hover:bg-gray-50 text-gray-600">Dosen</button>
            <button onClick={() => fillCredentials('mahasiswa@poltrans.com')} className="text-xs py-1 px-2 border rounded hover:bg-gray-50 text-gray-600">Mahasiswa</button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-gray-400">
          &copy; 2026 POLTEKTRANS SDP PALEMBANG
        </div>
      </div>
    </div>
  );
}
