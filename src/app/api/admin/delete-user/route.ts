import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    // Service Role Client (Admin)
    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    );

    try {
        const { userId } = await request.json();

        if (!userId) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }

        // 1. Delete Auth User (Cascades to Public User Profile if FK configured)
        const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);

        if (authError) {
            console.error("Auth Delete Error:", authError);
            return NextResponse.json({ error: authError.message }, { status: 500 });
        }

        // 2. Ensure Profile is deleted (Just in case Cascade fails or RLS blocks)
        // Using Service Role bypasses RLS.
        const { error: profileError } = await supabaseAdmin
            .from('users')
            .delete()
            .eq('id', userId);

        if (profileError) {
            console.error("Profile Delete Warning:", profileError);
            // We don't fail, assuming cascading might have handled it or it's gone.
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
