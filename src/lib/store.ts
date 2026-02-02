import { create } from 'zustand';
import { User, Role } from '@/types';
import { createClient } from '@/utils/supabase/client';

interface AuthState {
    user: User | null;
    loading: boolean;
    initialize: () => Promise<void>;
    logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null, // Initial state
    loading: true,
    initialize: async () => {
        const supabase = createClient();
        try {


            const { data: { user: authUser } } = await supabase.auth.getUser();

            if (authUser) {
                // Fetch our public users table profile including role
                const { data: profile } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', authUser.id)
                    .single();

                if (profile) {
                    // Map snake_case from DB to camelCase keys for TS if needed
                    const mappedUser: User = {
                        id: profile.id,
                        name: profile.full_name,
                        role: profile.role,
                        avatar: profile.avatar_url || (profile.full_name?.[0].toUpperCase()),
                        nim_nip: profile.nim_nip,
                        prodi: profile.prodi_id // simplified, ideally fetch prodi name
                    };
                    set({ user: mappedUser, loading: false });
                    return;
                }
            }
            set({ user: null, loading: false });
        } catch (e) {
            console.error("Auth init error:", e);
            set({ user: null, loading: false });
        }
    },
    logout: async () => {
        const supabase = createClient();
        await supabase.auth.signOut();

        set({ user: null });
        window.location.href = '/'; // Hard redirect to login
    },
}));
