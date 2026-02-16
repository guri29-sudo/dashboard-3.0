import { supabase } from './supabase';

export const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { user: data.user, error };
};

export const signUp = async (email, password, username) => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { username }
        }
    });
    return { user: data.user, error };
};

export const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
};

export const getSession = async () => {
    const { data } = await supabase.auth.getSession();
    return data.session;
};

// Helper for App.jsx to subscribe to changes
export const onAuthStateChange = (callback) => {
    return supabase.auth.onAuthStateChange((event, session) => {
        callback(event, session);
    });
};
