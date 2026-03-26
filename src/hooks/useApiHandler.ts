// src/hooks/useApiHandler.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://eofknamuxnftvcyxwmji.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvZmtuYW11eG5mdHZjeXh3bWppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MjAwMDAwMDAwMH0.placeholder";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface GenerateImageResult {
  imageData: string | null;
  error: string | null;
}

export async function generateImage(prompt: string): Promise<GenerateImageResult> {
  try {
    const { data, error } = await supabase.functions.invoke("api-handler", {
      body: { action: "generate-image", prompt },
    });
    if (error) throw error;

    const candidates = data?.candidates ?? [];
    for (const candidate of candidates) {
      for (const part of candidate?.content?.parts ?? []) {
        if (part.inlineData?.mimeType?.startsWith("image/")) {
          return { imageData: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`, error: null };
        }
      }
    }
    return { imageData: null, error: "No image in response" };
  } catch (err) {
    console.error("generateImage error:", err);
    return { imageData: null, error: String(err) };
  }
}

export async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const { data, error } = await supabase.functions.invoke("api-handler", {
      body: { action: "geocode", address },
    });
    if (error) throw error;
    const loc = data?.results?.[0]?.geometry?.location;
    if (loc) return { lat: loc.lat, lng: loc.lng };
    return null;
  } catch (err) {
    console.error("geocodeAddress error:", err);
    return null;
  }
}

export async function sendEmail(params: {
  from: string;
  to: string;
  subject: string;
  html: string;
}): Promise<{ success: boolean; error: string | null }> {
  try {
    const { data, error } = await supabase.functions.invoke("api-handler", {
      body: { action: "send-email", ...params },
    });
    if (error) throw error;
    return { success: true, error: null };
  } catch (err) {
    console.error("sendEmail error:", err);
    return { success: false, error: String(err) };
  }
}