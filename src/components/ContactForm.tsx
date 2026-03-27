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

const EMPTY: FormData = { name: "", email: "", phone: "", message: "" };

function buildEmailHtml(name: string): string {
  return (
    "<div style=\"font-family:sans-serif;max-width:600px;margin:0 auto\">" +
    "<h2 style=\"color:#2563eb\">Thank you, " + name + "!</h2>" +
    "<p>We received your message and will get back to you shortly.</p>" +
    "<hr style=\"border:none;border-top:1px solid #e5e7eb;margin:24px 0\">" +
    "<p style=\"color:#9ca3af;font-size:12px\">The Test15 Team</p>" +
    "<p style=\"color:#9ca3af;font-size:11px\">You received this because you submitted our contact form. " +
    "<a href=\"https://test15.app/unsubscribe\">Unsubscribe</a></p>" +
    "</div>"
  );
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>(EMPTY);
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

    try {
      const { error: dbError } = await supabase.from("contact_messages").insert({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || null,
        message: formData.message.trim(),
      });

      if (dbError) {
        toast.error("Failed to save your message. Please try again.");
        setLoading(false);
        return;
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again later.");
      setLoading(false);
      return;
    }

    try {
      await supabase.functions.invoke("api-handler", {
        body: {
          action: "send-email",
          from: "Test15 <noreply@test15.app>",
          to: formData.email.trim(),
          subject: "Thank you for reaching out, " + formData.name.trim() + "!",
          html: buildEmailHtml(formData.name.trim()),
        },
      });
    } catch (err) {
      console.warn("Email notification failed (non-critical):", err);
    }

    setLoading(false);
    setSubmitted(true);
    setFormData(EMPTY);
    toast.success("Message sent! We will get back to you soon.");
  };

  if (submitted) {
    return (
      <div className="card p-8 sm:p-12 text-center">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">Message Received!</h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Thank you for reaching out. We will review your message and get back to you as soon as possible.
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
        <p className="text-gray-500">Fill out the form below and we will get back to you.</p>
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
          placeholder="+1 (555) 123-4567"
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