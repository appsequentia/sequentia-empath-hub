
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://wyyefqjcdwgyeixcbhda.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5eWVmcWpjZHdneWVpeGNiaGRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0ODU0OTEsImV4cCI6MjA2MzA2MTQ5MX0._R8yqY9lYyMNlgmZpq1QRwMeVgwRpo8_kaYp2qPyzxQ";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
