import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder';

// Only validate if we are actually intending to use Supabase
if (import.meta.env.VITE_BACKEND_TYPE === 'supabase' && !import.meta.env.VITE_SUPABASE_URL) {
  console.warn('Supabase backend selected but VITE_SUPABASE_URL is missing');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
