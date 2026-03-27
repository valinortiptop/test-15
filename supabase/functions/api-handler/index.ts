// @ts-nocheck
// supabase/functions/api-handler/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const proxyUrl =
    Deno.env.get("VALINOR_PROXY_URL") ??
    "https://htfhprzchvgcbquohgir.supabase.co/functions/v1/api-proxy";
  const proxyToken = Deno.env.get("VALINOR_PROXY_TOKEN");
  const googleMapsKey = Deno.env.get("GOOGLE_MAPS_API_KEY");

  let body: Record<string, any>;
  try {
    body = await req.json();
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid JSON in request body" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const { action, ...params } = body;
  console.log("api-handler invoked, action:", action);

  if (!action) {
    return new Response(
      JSON.stringify({ error: "Missing 'action' parameter" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // ─── ACTION: get-maps-key ─────────────────────────────────────────
  if (action === "get-maps-key") {
    if (!googleMapsKey) {
      return new Response(
        JSON.stringify({ error: "Maps API key not configured" }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    return new Response(
      JSON.stringify({ key: googleMapsKey }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // ─── ACTION: get-weather ──────────────────────────────────────────
  if (action === "get-weather") {
    if (!proxyToken) {
      return new Response(
        JSON.stringify({ error: "Proxy token not configured" }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    try {
      const { lat, lon } = params;
      const targetLat = lat ?? 19.4284;
      const targetLon = lon ?? -99.1678;

      // Use AI to get weather data for the location
      const res = await fetch(proxyUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-proxy-token": proxyToken,
        },
        body: JSON.stringify({
          provider: "openai",
          endpoint: "/v1/chat/completions",
          payload: {
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content:
                  "You are a weather assistant. Return ONLY valid JSON with no markdown, no code fences. The JSON must have these exact keys: temp (number, Celsius), feelsLike (number, Celsius), description (string, e.g. 'Partly cloudy'), humidity (number, percent 0-100), windSpeed (number, km/h), visibility (number, km). Use realistic current seasonal weather for Mexico City (CDMX). Mexico City in June is typically warm 18-24C, partly cloudy, humid rainy season.",
              },
              {
                role: "user",
                content: `What is the current weather at coordinates ${targetLat}, ${targetLon} in Mexico City, CDMX? Return only the JSON object.`,
              },
            ],
            max_tokens: 200,
            temperature: 0.3,
          },
        }),
      });

      const aiData = await res.json();
      console.log("weather AI response status:", res.status);

      if (!res.ok) {
        throw new Error(`AI call failed: ${res.status}`);
      }

      const rawContent = aiData?.choices?.[0]?.message?.content ?? "";
      console.log("weather raw content:", rawContent);

      let weatherJson: any;
      try {
        // Strip any accidental markdown fences
        const cleaned = rawContent.replace(/