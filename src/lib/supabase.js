// src/lib/supabase.js
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    "Missing Supabase env variables.\n" +
    "Pastikan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY ada di file .env"
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    // ✅ FIX: Gunakan localStorage untuk session persistence yang lebih stabil.
    // sessionStorage bersifat per-tab dan bisa hilang di edge cases tertentu.
    // localStorage bertahan lintas tab dan lebih reliable untuk token refresh.
    // Keamanan tetap terjaga karena ada inactivity timeout (30 menit) di App.jsx.
    storage: window.localStorage
  },
});