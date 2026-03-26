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
      console.warn("GOOGLE_MAPS_API_KEY not set");
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

  // All remaining actions require the proxy token
  if (!proxyToken) {
    console.error("VALINOR_PROXY_TOKEN is not set — cannot call external APIs");
    return new Response(
      JSON.stringify({
        error: "External API service unavailable. Please try again later.",
      }),
      { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // ─── ACTION: send-email ───────────────────────────────────────────
  if (action === "send-email") {
    try {
      const { from, to, subject, html } = params;

      if (!to || !subject || !html) {
        return new Response(
          JSON.stringify({ error: "Missing required email fields: to, subject, html" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log("Sending email to:", to, "subject:", subject);

      const res = await fetch(proxyUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-proxy-token": proxyToken,
        },
        body: JSON.stringify({
          provider: "resend",
          endpoint: "/emails",
          payload: {
            from: from ?? "Test15 <onboarding@resend.dev>",
            to: [to],
            subject,
            html,
          },
        }),
      });

      const responseText = await res.text();
      console.log("send-email raw response:", res.status, responseText);

      let data: any;
      try {
        data = JSON.parse(responseText);
      } catch {
        data = { raw: responseText };
      }

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

  // ─── ACTION: chat ─────────────────────────────────────────────────
  if (action === "chat") {
    try {
      const { messages, model } = params;
      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return new Response(
          JSON.stringify({ error: "Missing or invalid 'messages' array" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const res = await fetch(proxyUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-proxy-token": proxyToken },
        body: JSON.stringify({
          provider: "openai",
          endpoint: "/v1/chat/completions",
          payload: {
            model: model ?? "gpt-4o-mini",
            messages,
            max_tokens: 1024,
            temperature: 0.7,
          },
        }),
      });
      const data = await res.json();
      console.log("chat response status:", res.status);
      return new Response(JSON.stringify(data), {
        status: res.ok ? 200 : res.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error("chat error:", err);
      return new Response(
        JSON.stringify({ error: "Failed to get AI response", details: String(err) }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  }

  // ─── ACTION: geocode ──────────────────────────────────────────────
  if (action === "geocode") {
    try {
      const { address } = params;
      if (!address) {
        return new Response(
          JSON.stringify({ error: "Missing 'address' parameter" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const res = await fetch(proxyUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-proxy-token": proxyToken },
        body: JSON.stringify({
          provider: "google",
          endpoint: "/maps/api/geocode/json",
          payload: { address },
        }),
      });
      const data = await res.json();
      console.log("geocode response status:", res.status);
      return new Response(JSON.stringify(data), {
        status: res.ok ? 200 : res.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error("geocode error:", err);
      return new Response(
        JSON.stringify({ error: "Failed to geocode address", details: String(err) }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  }

  // ─── UNKNOWN ACTION ───────────────────────────────────────────────
  console.warn("Unknown action received:", action);
  return new Response(
    JSON.stringify({
      error: "Unknown action",
      received: action,
      available: ["get-maps-key", "send-email", "chat", "geocode"],
    }),
    { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
});