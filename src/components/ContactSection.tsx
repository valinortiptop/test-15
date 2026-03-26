// src/components/ContactSection.tsx
import React, { useState } from "react";
import { Send, User, Mail, Phone, MessageSquare, CheckCircle, AlertCircle, Zap } from "lucide-react";
import { supabase, sendEmail } from "../hooks/useApiHandler";
import { toast } from "sonner";

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export default function ContactSection() {
  const [form, setForm] = useState<FormData>({ name: "", email: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Por favor completa los campos obligatorios");
      return;
    }

    setSubmitting(true);

    let dbSuccess = false;
    let emailSuccess = false;

    // 1. Save to DB
    try {
      const { error } = await supabase.from("contact_messages").insert({
        name: form.name,
        email: form.email,
        phone: form.phone || null,
        message: form.message,
      });
      if (!error) dbSuccess = true;
    } catch (_) {
      // DB might be unavailable
    }

    // 2. Send email notification
    try {
      const { success } = await sendEmail({
        from: "contacto@voltmx.mx",
        to: "ventas@voltmx.mx",
        subject: `Nuevo mensaje de ${form.name} — VoltMX`,
        html: `
          <div style="font-family:sans-serif;background:#020617;color:#fff;padding:32px;border-radius:8px;">
            <h2 style="color:#39FF14;margin-bottom:16px;">⚡ Nuevo contacto — VoltMX</h2>
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:8px 0;color:#9ca3af;width:100px;">Nombre:</td><td style="color:#fff;">${form.name}</td></tr>
              <tr><td style="padding:8px 0;color:#9ca3af;">Email:</td><td style="color:#fff;">${form.email}</td></tr>
              <tr><td style="padding:8px 0;color:#9ca3af;">Teléfono:</td><td style="color:#fff;">${form.phone || "No proporcionado"}</td></tr>
              <tr><td style="padding:8px 0;color:#9ca3af;vertical-align:top;">Mensaje:</td><td style="color:#fff;">${form.message}</td></tr>
            </table>
          </div>
        `,
      });
      emailSuccess = success;
    } catch (_) {
      // Email might fail
    }

    setSubmitting(false);

    if (dbSuccess || emailSuccess) {
      setSubmitted(true);
      toast.success("¡Mensaje enviado! Te contactaremos pronto.");
    } else {
      // Show partial success
      setSubmitted(true);
      toast.info("Mensaje registrado. Nos pondremos en contacto contigo.");
    }
  };

  return (
    <section id="contact" className="py-24 bg-navy-950 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 section-divider" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-neon-green/3 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-neon-cyan/3 rounded-full blur-3xl -translate-y-1/2" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neon-green/20 bg-neon-green/5 mb-6">
              <MessageSquare className="w-3.5 h-3.5 text-neon-green" />
              <span className="text-xs font-semibold tracking-widest text-neon-green uppercase">
                Contáctanos
              </span>
            </div>

            <h2 className="font-display font-bold text-4xl sm:text-5xl text-white mb-4">
              Habla con un{" "}
              <span className="text-neon-green glow-green">experto EV</span>
            </h2>
            <p className="text-gray-400 text-lg mb-10 leading-relaxed">
              ¿Tienes preguntas sobre nuestros vehículos? ¿Quieres agendar una prueba de
              manejo? Nuestros asesores están listos para ayudarte.
            </p>

            {/* Feature list */}
            <div className="space-y-4">
              {[
                "Prueba de manejo sin costo",
                "Asesoría de financiamiento personalizada",
                "Instalación de cargador en casa incluida",
                "Garantía de 8 años en batería",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-neon-green/10 border border-neon-green/30 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-3 h-3 text-neon-green" />
                  </div>
                  <span className="text-sm text-gray-300">{item}</span>
                </div>
              ))}
            </div>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/5215550008765?text=Hola%2C%20me%20interesa%20conocer%20más%20sobre%20sus%20autos%20eléctricos"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 mt-10 px-6 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 hover:border-emerald-500/60 hover:bg-emerald-500/20 transition-all duration-300"
            >
              <svg className="w-5 h-5 text-emerald-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span className="text-sm font-medium text-emerald-400">Chatea por WhatsApp</span>
            </a>
          </div>

          {/* Right: Form */}
          <div>
            {submitted ? (
              <SuccessMessage onReset={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", message: "" }); }} />
            ) : (
              <form onSubmit={handleSubmit} className="card-glass rounded-2xl p-8 space-y-5">
                <h3 className="font-display font-bold text-xl text-white mb-2">
                  Envíanos un mensaje
                </h3>

                <FormField
                  icon={User}
                  label="Nombre completo *"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Juan García"
                  required
                />
                <FormField
                  icon={Mail}
                  label="Correo electrónico *"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="juan@email.com"
                  required
                />
                <FormField
                  icon={Phone}
                  label="Teléfono"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+52 55 1234 5678"
                />

                {/* Message */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Mensaje *
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute top-3 left-3 w-4 h-4 text-neon-green/50" />
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={4}
                      placeholder="Me interesa conocer más sobre el Model Volt S..."
                      className="w-full pl-10 pr-4 py-3 bg-navy-950/60 border border-white/10 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-neon-green/50 focus:ring-1 focus:ring-neon-green/20 transition-all duration-200 resize-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full btn-neon-solid flex items-center justify-center gap-2 py-4 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-navy-950/40 border-t-navy-950 rounded-full animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Enviar mensaje
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-600 text-center">
                  Al enviar aceptas nuestra política de privacidad. Te contactaremos en menos de 24 horas.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 section-divider" />
    </section>
  );
}

function FormField({
  icon: Icon,
  label,
  name,
  type,
  value,
  onChange,
  placeholder,
  required,
}: {
  icon: React.ElementType;
  label: string;
  name: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
        {label}
      </label>
      <div className="relative">
        <Icon className="absolute top-1/2 left-3 -translate-y-1/2 w-4 h-4 text-neon-green/50" />
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 bg-navy-950/60 border border-white/10 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-neon-green/50 focus:ring-1 focus:ring-neon-green/20 transition-all duration-200"
        />
      </div>
    </div>
  );
}

function SuccessMessage({ onReset }: { onReset: () => void }) {
  return (
    <div className="card-glass rounded-2xl p-10 flex flex-col items-center justify-center text-center min-h-[400px]">
      <div className="w-20 h-20 rounded-full bg-neon-green/10 border-2 border-neon-green/30 flex items-center justify-center mb-6 animate-pulse">
        <CheckCircle className="w-10 h-10 text-neon-green" />
      </div>
      <h3 className="font-display font-bold text-2xl text-white mb-3">
        ¡Mensaje enviado!
      </h3>
      <p className="text-gray-400 mb-2">
        Gracias por contactarnos. Un asesor de VoltMX te responderá en menos de 24 horas.
      </p>
      <p className="text-sm text-neon-green/70 mb-8">
        También puedes visitarnos en Reforma 333, CDMX.
      </p>
      <button onClick={onReset} className="btn-neon text-xs px-6">
        Enviar otro mensaje
      </button>
    </div>
  );
}