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

  const proxyUrl = Deno.env.get("VALINOR_PROXY_URL") ?? "https://htfhprzchvgcbquohgir.supabase.co/functions/v1/api-proxy";
  const proxyToken = Deno.env.get("VALINOR_PROXY_TOKEN");

  if (!proxyToken) {
    console.error("VALINOR_PROXY_TOKEN is not set");
    return new Response(
      JSON.stringify({ error: "Service temporarily unavailable. Proxy token not configured." }),
      {
        status: 503,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  let body: Record<string, any>;
  try {
    body = await req.json();
  } catch (e) {
    return new Response(
      JSON.stringify({ error: "Invalid JSON in request body" }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  const { action, ...params } = body;
  console.log("api-handler invoked, action:", action);

  if (!action) {
    return new Response(
      JSON.stringify({ error: "Missing 'action' parameter" }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  // ─── ACTION: send-email ───────────────────────────────────────────
  if (action === "send-email") {
    try {
      const { from, to, subject, html } = params;

      if (!to || !subject || !html) {
        return new Response(
          JSON.stringify({ error: "Missing required email fields: to, subject, html" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

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
            from: from || "Test15 <noreply@test15.app>",
            to: to,
            subject: subject,
            html: html,
          },
        }),
      });

      const data = await res.json();
      console.log("send-email response status:", res.status);

      return new Response(JSON.stringify(data), {
        status: res.ok ? 200 : res.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error("send-email error:", err);
      return new Response(
        JSON.stringify({ error: "Failed to send email", details: String(err) }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
  }

  // ─── ACTION: chat (AI completion) ────────────────────────────────
  if (action === "chat") {
    try {
      const { messages, model } = params;

      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return new Response(
          JSON.stringify({ error: "Missing or invalid 'messages' array" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

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
            model: model || "gpt-4o-mini",
            messages: messages,
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
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
  }

  // ─── ACTION: generate-image ───────────────────────────────────────
  if (action === "generate-image") {
    try {
      const { prompt } = params;

      if (!prompt) {
        return new Response(
          JSON.stringify({ error: "Missing 'prompt' parameter" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const res = await fetch(proxyUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-proxy-token": proxyToken,
        },
        body: JSON.stringify({
          provider: "gemini",
          endpoint: "/v1beta/models/gemini-3.1-flash-image-preview:generateContent",
          payload: {
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseModalities: ["TEXT", "IMAGE"] },
          },
        }),
      });

      const data = await res.json();
      console.log("generate-image response status:", res.status);

      return new Response(JSON.stringify(data), {
        status: res.ok ? 200 : res.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error("generate-image error:", err);
      return new Response(
        JSON.stringify({ error: "Failed to generate image", details: String(err) }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
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
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const res = await fetch(proxyUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-proxy-token": proxyToken,
        },
        body: JSON.stringify({
          provider: "google",
          endpoint: "/maps/api/geocode/json",
          payload: { address: address },
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
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
  }

  // ─── UNKNOWN ACTION ───────────────────────────────────────────────
  console.warn("Unknown action received:", action);
  return new Response(
    JSON.stringify({
      error: "Unknown action",
      received: action,
      available: ["send-email", "chat", "generate-image", "geocode"],
    }),
    {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );
});