// @ts-nocheck
// src/components/ContactForm.tsx
import { useState } from "react";
import { Send, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "../lib/supabase";

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const initialFormData: FormData = { name: "", email: "", phone: "", message: "" };

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    // ── Step 1: Save to DB ──────────────────────────────────────────
    try {
      const { error: dbError } = await supabase.from("contact_messages").insert({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || null,
        message: formData.message.trim(),
      });

      if (dbError) {
        console.error("DB insert error:", dbError);
        toast.error(`Could not save your message: ${dbError.message}`);
        setLoading(false);
        return;
      }
    } catch (err) {
      console.error("DB exception:", err);
      toast.error("Something went wrong saving your message. Please try again.");
      setLoading(false);
      return;
    }

    // ── Step 2: Send confirmation email via Resend (best-effort) ───
    try {
      const { data: emailData, error: emailError } = await supabase.functions.invoke(
        "api-handler",
        {
          body: {
            action: "send-email",
            from: "Test15 <onboarding@resend.dev>",
            to: formData.email.trim(),
            subject: `We received your message, ${formData.name.trim()}!`,
            html: `
              <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#f9fafb;border-radius:12px;">
                <div style="background:#2563eb;border-radius:8px;padding:24px;text-align:center;margin-bottom:24px;">
                  <h1 style="color:#fff;margin:0;font-size:24px;">Test15</h1>
                </div>
                <h2 style="color:#111827;font-size:20px;margin-bottom:8px;">
                  Thanks for reaching out, ${formData.name.trim()}!
                </h2>
                <p style="color:#6b7280;line-height:1.6;margin-bottom:16px;">
                  We've received your message and will get back to you as soon as possible,
                  usually within one business day.
                </p>
                <div style="background:#fff;border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin-bottom:24px;">
                  <p style="color:#374151;font-size:14px;margin:0 0 8px 0;font-weight:600;">Your message:</p>
                  <p style="color:#6b7280;font-size:14px;margin:0;line-height:1.6;">${formData.message.trim()}</p>
                </div>
                <p style="color:#9ca3af;font-size:12px;text-align:center;margin:0;">
                  — The Test15 Team &nbsp;·&nbsp; Paseo de la Reforma 333, CDMX
                </p>
              </div>
            `,
          },
        }
      );

      if (emailError) {
        console.warn("Email notification failed (non-critical):", emailError);
      } else {
        console.log("Email sent successfully:", emailData);
      }
    } catch (err) {
      console.warn("Email send exception (non-critical):", err);
    }

    // ── Also notify admin ───────────────────────────────────────────
    try {
      await supabase.functions.invoke("api-handler", {
        body: {
          action: "send-email",
          from: "Test15 Contact Form <onboarding@resend.dev>",
          to: "hello@test15.app",
          subject: `New contact message from ${formData.name.trim()}`,
          html: `
            <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
              <h2 style="color:#111827;">New Contact Message</h2>
              <table style="width:100%;border-collapse:collapse;">
                <tr><td style="padding:8px 0;color:#6b7280;font-size:14px;width:80px;">Name:</td>
                    <td style="padding:8px 0;color:#111827;font-size:14px;font-weight:600;">${formData.name.trim()}</td></tr>
                <tr><td style="padding:8px 0;color:#6b7280;font-size:14px;">Email:</td>
                    <td style="padding:8px 0;color:#111827;font-size:14px;">${formData.email.trim()}</td></tr>
                ${formData.phone ? `<tr><td style="padding:8px 0;color:#6b7280;font-size:14px;">Phone:</td>
                    <td style="padding:8px 0;color:#111827;font-size:14px;">${formData.phone.trim()}</td></tr>` : ""}
                <tr><td style="padding:8px 0;color:#6b7280;font-size:14px;vertical-align:top;">Message:</td>
                    <td style="padding:8px 0;color:#111827;font-size:14px;">${formData.message.trim()}</td></tr>
              </table>
            </div>
          `,
        },
      });
    } catch (err) {
      console.warn("Admin notification failed (non-critical):", err);
    }

    setLoading(false);
    setSubmitted(true);
    setFormData(initialFormData);
    toast.success("Message sent! Check your inbox for a confirmation email.");
  };

  if (submitted) {
    return (
      <div className="card p-8 sm:p-12 text-center">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">Message Received!</h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Thank you for reaching out. We&apos;ll review your message and get back to you shortly.
          A confirmation email has been sent to your inbox.
        </p>
        <button onClick={() => setSubmitted(false)} className="btn-secondary">
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card p-8 sm:p-12 space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-1">Send us a Message</h3>
        <p className="text-gray-500">Fill out the form below and we&apos;ll get back to you.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            required
            className="input-field"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            required
            className="input-field"
          />
        </div>
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+52 (55) 5000-8765"
          className="input-field"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={5}
          placeholder="Tell us about your project or question..."
          required
          className="input-field resize-none"
        />
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full sm:w-auto">
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="w-4 h-4 mr-2" />
            Send Message
          </>
        )}
      </button>
    </form>
  );
}