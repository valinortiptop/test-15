// @ts-nocheck
// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  (import.meta.env.VITE_SUPABASE_URL || "https://eofknamuxnftvcyxwmji.supabase.co"),
  (import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvZmtuYW11eG5mdHZjeXh3bWppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NDgzODksImV4cCI6MjA5MDEyNDM4OX0.cVXWa2_gvQJ8lltPQv2KVSODVAGxXCxzXcN-u1JDryg")
);