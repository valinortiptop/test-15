// supabase/functions/api-handler/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const proxyUrl =
    Deno.env.get("VALINOR_PROXY_URL") ??
    "https://htfhprzchvgcbquohgir.supabase.co/functions/v1/api-proxy";
  const proxyToken = Deno.env.get("VALINOR_PROXY_TOKEN");

  if (!proxyToken) {
    console.error("VALINOR_PROXY_TOKEN is not configured");
    return new Response(
      JSON.stringify({
        error: "Service unavailable: proxy token not configured",
        hint: "Set VALINOR_PROXY_TOKEN in Supabase edge function secrets",
      }),
      {
        status: 503,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  let action = "";

  try {
    const body = await req.json();
    action = body.action ?? "";

    console.log("api-handler invoked, action:", action);

    // ── generate-image ──────────────────────────────────────────────────────
    if (action === "generate-image") {
      try {
        const prompt: string = body.prompt ?? "A futuristic electric car";

        const res = await fetch(proxyUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-proxy-token": proxyToken,
          },
          body: JSON.stringify({
            provider: "gemini",
            endpoint:
              "/v1beta/models/gemini-3.1-flash-image-preview:generateContent",
            payload: {
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                responseModalities: ["TEXT", "IMAGE"],
              },
            },
          }),
        });

        if (!res.ok) {
          const errText = await res.text();
          console.error("generate-image proxy error:", res.status, errText);
          return new Response(
            JSON.stringify({
              error: "Image generation failed",
              status: res.status,
              details: errText,
            }),
            {
              status: 502,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        const data = await res.json();
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (err) {
        console.error("generate-image handler error:", err);
        return new Response(
          JSON.stringify({
            error: "Image generation failed",
            details: String(err),
          }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    // ── geocode ─────────────────────────────────────────────────────────────
    if (action === "geocode") {
      try {
        const address: string =
          body.address ?? "Paseo de la Reforma 333, Mexico City";

        const res = await fetch(proxyUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-proxy-token": proxyToken,
          },
          body: JSON.stringify({
            provider: "google",
            endpoint: "/maps/api/geocode/json",
            payload: { address },
          }),
        });

        if (!res.ok) {
          const errText = await res.text();
          console.error("geocode proxy error:", res.status, errText);
          return new Response(
            JSON.stringify({
              error: "Geocoding failed",
              status: res.status,
              details: errText,
            }),
            {
              status: 502,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        const data = await res.json();
        console.log(
          "geocode result status:",
          data.status,
          "results count:",
          data.results?.length ?? 0
        );
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (err) {
        console.error("geocode handler error:", err);
        return new Response(
          JSON.stringify({ error: "Geocoding failed", details: String(err) }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    // ── send-email ───────────────────────────────────────────────────────────
    if (action === "send-email") {
      try {
        const { from, to, subject, html } = body;

        if (!to || !subject || !html) {
          return new Response(
            JSON.stringify({
              error: "Missing required email fields: to, subject, html",
            }),
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
              from: from ?? "contacto@voltmx.mx",
              to,
              subject,
              html,
            },
          }),
        });

        if (!res.ok) {
          const errText = await res.text();
          console.error("send-email proxy error:", res.status, errText);
          return new Response(
            JSON.stringify({
              error: "Email send failed",
              status: res.status,
              details: errText,
            }),
            {
              status: 502,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        const data = await res.json();
        console.log("send-email success, id:", data.id);
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (err) {
        console.error("send-email handler error:", err);
        return new Response(
          JSON.stringify({ error: "Email send failed", details: String(err) }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    // ── chat ─────────────────────────────────────────────────────────────────
    if (action === "chat") {
      try {
        const messages = body.messages ?? [];

        if (!Array.isArray(messages) || messages.length === 0) {
          return new Response(
            JSON.stringify({ error: "messages array is required and must not be empty" }),
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
              model: "gpt-4o-mini",
              messages,
              max_tokens: 500,
              temperature: 0.7,
            },
          }),
        });

        if (!res.ok) {
          const errText = await res.text();
          console.error("chat proxy error:", res.status, errText);
          return new Response(
            JSON.stringify({
              error: "Chat completion failed",
              status: res.status,
              details: errText,
            }),
            {
              status: 502,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        const data = await res.json();
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (err) {
        console.error("chat handler error:", err);
        return new Response(
          JSON.stringify({ error: "Chat failed", details: String(err) }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    // ── unknown action ───────────────────────────────────────────────────────
    console.warn("Unknown action received:", action);
    return new Response(
      JSON.stringify({
        error: `Unknown action: "${action}"`,
        availableActions: ["generate-image", "geocode", "send-email", "chat"],
      }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("api-handler top-level error (action:", action, "):", err);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        action,
        details: String(err),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});