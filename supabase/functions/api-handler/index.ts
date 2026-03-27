// @ts-nocheck
// supabase/functions/api-handler/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const PROXY_URL = Deno.env.get("VALINOR_PROXY_URL") ?? "https://htfhprzchvgcbquohgir.supabase.co/functions/v1/api-proxy";
  const PROXY_TOKEN = Deno.env.get("VALINOR_PROXY_TOKEN");

  console.log("api-handler invoked");
  console.log("PROXY_URL:", PROXY_URL);
  console.log("PROXY_TOKEN present:", !!PROXY_TOKEN);

  if (!PROXY_TOKEN) {
    console.error("VALINOR_PROXY_TOKEN is missing");
    return jsonResponse({ error: "Proxy token not configured" }, 503);
  }

  let body: Record<string, any>;
  try {
    body = await req.json();
  } catch (e) {
    console.error("Failed to parse request body:", e);
    return jsonResponse({ error: "Invalid JSON body" }, 400);
  }

  const { action, ...params } = body;
  console.log("action:", action);
  console.log("params keys:", Object.keys(params));

  if (!action) {
    return jsonResponse({ error: "Missing action parameter" }, 400);
  }

  async function callProxy(provider: string, endpoint: string, payload: unknown) {
    const proxyBody = { provider, endpoint, payload };
    console.log("Calling proxy with provider:", provider, "endpoint:", endpoint);
    console.log("Proxy body:", JSON.stringify(proxyBody));

    const res = await fetch(PROXY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-proxy-token": PROXY_TOKEN!,
      },
      body: JSON.stringify(proxyBody),
    });

    const text = await res.text();
    console.log("Proxy response status:", res.status);
    console.log("Proxy response body (first 500 chars):", text.slice(0, 500));

    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    return { data, status: res.status, ok: res.ok };
  }

  // ── send-email ──────────────────────────────────────────────────────
  if (action === "send-email") {
    try {
      const { from, to, subject, html } = params;
      if (!to || !subject || !html) {
        return jsonResponse({ error: "Missing required fields: to, subject, html" }, 400);
      }
      const { data, status, ok } = await callProxy("resend", "/emails", {
        from: from || "Test15 <noreply@test15.app>",
        to,
        subject,
        html,
      });
      return jsonResponse(data, ok ? 200 : status);
    } catch (err) {
      console.error("send-email error:", err);
      return jsonResponse({ error: "Failed to send email", details: String(err) }, 500);
    }
  }

  // ── chat ────────────────────────────────────────────────────────────
  if (action === "chat") {
    try {
      const { messages, model } = params;
      if (!messages || !Array.isArray(messages)) {
        return jsonResponse({ error: "Missing messages array" }, 400);
      }
      const { data, status, ok } = await callProxy("openai", "/v1/chat/completions", {
        model: model || "gpt-4o-mini",
        messages,
        max_tokens: 1024,
        temperature: 0.7,
      });
      return jsonResponse(data, ok ? 200 : status);
    } catch (err) {
      console.error("chat error:", err);
      return jsonResponse({ error: "Failed to get AI response", details: String(err) }, 500);
    }
  }

  // ── generate-image ──────────────────────────────────────────────────
  if (action === "generate-image") {
    try {
      const { prompt } = params;
      if (!prompt) {
        return jsonResponse({ error: "Missing prompt parameter" }, 400);
      }
      const { data, status, ok } = await callProxy(
        "gemini",
        "/v1beta/models/gemini-3.1-flash-image-preview:generateContent",
        {
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseModalities: ["TEXT", "IMAGE"] },
        }
      );
      return jsonResponse(data, ok ? 200 : status);
    } catch (err) {
      console.error("generate-image error:", err);
      return jsonResponse({ error: "Failed to generate image", details: String(err) }, 500);
    }
  }

  // ── geocode ─────────────────────────────────────────────────────────
  if (action === "geocode") {
    try {
      const { address } = params;
      if (!address) {
        return jsonResponse({ error: "Missing address parameter" }, 400);
      }
      const { data, status, ok } = await callProxy("google", "/maps/api/geocode/json", {
        address,
      });
      return jsonResponse(data, ok ? 200 : status);
    } catch (err) {
      console.error("geocode error:", err);
      return jsonResponse({ error: "Failed to geocode", details: String(err) }, 500);
    }
  }

  console.warn("Unknown action:", action);
  return jsonResponse({
    error: "Unknown action: " + action,
    available: ["send-email", "chat", "generate-image", "geocode"],
  }, 400);
});