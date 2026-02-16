/**
 * Crystal OS Environment Configuration
 * Validates and exports environment variables.
 */

const env = {
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
    supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
};

// Validation
const validateEnv = () => {
    const missing = [];
    if (!env.supabaseUrl) missing.push('VITE_SUPABASE_URL');
    if (!env.supabaseAnonKey) missing.push('VITE_SUPABASE_ANON_KEY');

    if (missing.length > 0) {
        const errorMsg = `[CRITICAL_BOOT_ERROR]: Missing required environment variables: ${missing.join(', ')}`;
        console.error(errorMsg);
        // We throw here to be caught by the ErrorBoundary or crash the boot process early
        throw new Error(errorMsg);
    }
};

validateEnv();

export default env;
