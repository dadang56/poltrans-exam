import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
    // Safety check: specific for deployment/demo if Supabase is not configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'YOUR_SUPABASE_URL') {
        console.warn("Supabase not configured, bypassing middleware auth checks.");
        return NextResponse.next();
    }

    // 1. Update session (refresh tokens)
    const { supabaseResponse, user, supabase } = await updateSession(request);

    // 2. Auth Logic
    const { pathname } = request.nextUrl;

    // Public routes that don't need auth
    const isPublicRoute = pathname === '/' || pathname.startsWith('/auth') || pathname === '/login'; // Assuming root is login for now based on Phase 1

    if (!user && !isPublicRoute) {
        // If not logged in and trying to access protected route, redirect to login
        const url = request.nextUrl.clone();
        url.pathname = '/';
        return NextResponse.redirect(url);
    }

    if (user) {
        // 3. RBAC Logic
        // We need to fetch the user's role from the 'users' table or metadata.
        // For performance, usually stored in user_metadata, but we defined a 'users' table.
        // Let's fetch the role from the 'users' table.

        // NOTE: In a real high-traffic app, you might want to cache this or put it in strict JWT custom claims.
        const { data: userData } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single();

        const role = userData?.role || 'mahasiswa'; // Default safe fallback

        // Role-based redirects protection
        // If accessing a path that starts with a role namespace, check if it matches.

        const pathRole = pathname.split('/')[1]; // e.g. "superadmin" from "/superadmin/dashboard"

        const validRoles = ['superadmin', 'admin-prodi', 'dosen', 'pengawas', 'mahasiswa'];

        // Check if the path is one of the role dashboards
        if (validRoles.includes(pathRole)) {
            // Map database role enum (underscores) to URL path (hyphens) if needed
            // DB: admin_prodi -> URL: admin-prodi
            let normalizedUserRole = role.replace('_', '-');

            if (normalizedUserRole !== pathRole) {
                // Unauthorized access to another role's dashboard
                const url = request.nextUrl.clone();
                url.pathname = `/${normalizedUserRole}`;
                return NextResponse.redirect(url);
            }
        }

        // If user is logged in and visits login page (/), redirect to their dashboard
        if (pathname === '/') {
            let normalizedUserRole = role.replace('_', '-');
            const url = request.nextUrl.clone();
            url.pathname = `/${normalizedUserRole}`;
            return NextResponse.redirect(url);
        }
    }

    return supabaseResponse;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder files if any (logo.png etc)
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
