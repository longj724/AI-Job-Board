import { createClient } from '@supabase/supabase-js';

export const supabaseClient = async () => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_PUBLIC_KEY
  );
  return supabase;
};
