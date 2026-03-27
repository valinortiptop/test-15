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

  // ── get-maps-key (no proxy token needed) ──────────────────────────
  if (action === "get-maps-key") {
    const key = Deno.env.get("GOOGLE_MAPS_API_KEY") ?? "";
    return new Response(
      JSON.stringify({ key }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // ── All other actions need the Valinor proxy ───────────────────────
  const proxyUrl = Deno.env.get("VALINOR_PROXY_URL") ?? "https://htfhprzchvgcbquohgir.supabase.co/functions/v1/api-proxy";
  const proxyToken = Deno.env.get("VALINOR_PROXY_TOKEN");

  if (!proxyToken) {
    console.error("VALINOR_PROXY_TOKEN is not set");
    return new Response(
      JSON.stringify({ error: "Service temporarily unavailable. Proxy token not configured." }),
      { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // ── send-email ────────────────────────────────────────────────────
  if (action === "send-email") {
    try {
      const { from, to, subject, html } = params;
      if (!to || !subject || !html) {
        return new Response(
          JSON.stringify({ error: "Missing required email fields: to, subject, html" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const res = await fetch(proxyUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-proxy-token": proxyToken },
        body: JSON.stringify({
          provider: "resend",
          endpoint: "/emails",
          payload: {
            from: from ?? "Test15 <onboarding@resend.dev>",
            to: Array.isArray(to) ? to : [to],
            subject,
            html,
          },
        }),
      });
      const data = await res.json();
      console.log("send-email status:", res.status, JSON.stringify(data));
      return new Response(JSON.stringify(data), {
        status: res.ok ? 200 : res.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error("send-email error:", err);
      return new Response(
        JSON.stringify({ error: "Failed to send email", details: String(err) }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  }

  // ── get-weather ───────────────────────────────────────────────────
  if (action === "get-weather") {
    try {
      const location = params.location ?? "Paseo de la Reforma 333, Mexico City";
      const now = new Date();

      const prompt = `You are a weather API. Return ONLY valid JSON (no markdown, no extra text) for current weather and next 6 hours at ${location}.

Use this exact structure:
{
  "location": "${location}",
  "updated_at": "${now.toISOString()}",
  "current": {
    "time": "Now",
    "temp": <integer celsius>,
    "feels_like": <integer celsius>,
    "humidity": <integer 0-100>,
    "wind_speed": <integer km/h>,
    "visibility": <integer km>,
    "description": "<short description>",
    "emoji": "<single weather emoji>"
  },
  "hourly": [
    { "time": "+1h", "temp": <int>, "feels_like": <int>, "humidity": <int>, "wind_speed": <int>, "visibility": <int>, "description": "<text>", "emoji": "<emoji>" },
    { "time": "+2h", "temp": <int>, "feels_like": <int>, "humidity": <int>, "wind_speed": <int>, "visibility": <int>, "description": "<text>", "emoji": "<emoji>" },
    { "time": "+3h", "temp": <int>, "feels_like": <int>, "humidity": <int>, "wind_speed": <int>, "visibility": <int>, "description": "<text>", "emoji": "<emoji>" },
    { "time": "+4h", "temp": <int>, "feels_like": <int>, "humidity": <int>, "wind_speed": <int>, "visibility": <int>, "description": "<text>", "emoji": "<emoji>" },
    { "time": "+5h", "temp": <int>, "feels_like": <int>, "humidity": <int>, "wind_speed": <int>, "visibility": <int>, "description": "<text>", "emoji": "<emoji>" },
    { "time": "+6h", "temp": <int>, "feels_like": <int>, "humidity": <int>, "wind_speed": <int>, "visibility": <int>, "description": "<text>", "emoji": "<emoji>" }
  ]
}

Use realistic weather data for Mexico City in the current season (month: ${now.toLocaleString("en", { month: "long" })}). Vary temps slightly across hours. Return ONLY the JSON object.`;

      const res = await fetch(proxyUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-proxy-token": proxyToken },
        body: JSON.stringify({
          provider: "openai",
          endpoint: "/v1/chat/completions",
          payload: {
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 800,
            temperature: 0.4,
          },
        }),
      });

      const aiData = await res.json();
      console.log("get-weather AI status:", res.status);

      const raw = aiData?.choices?.[0]?.message?.content ?? "";
      const cleaned = raw.replace(/