// @ts-nocheck
// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://eofknamuxnftvcyxwmji.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvZmtuYW11eG5mdHZjeXh3bWppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0OTMxMzcsImV4cCI6MjA2NTA2OTEzN30.bkWe1JOmKxYG2v-oMsOqOvjGwKAhJmOT1aXyhHSFPiI";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);