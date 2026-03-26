// src/components/Footer.tsx
import React from "react";
import { Zap, MapPin, Phone, Mail, Instagram, Twitter, Facebook, Youtube } from "lucide-react";

const socialLinks = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Twitter, href: "#", label: "Twitter/X" },
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

const footerLinks = {
  Vehículos: ["Sedanes EV", "SUVs Eléctricos", "Autos Sport EV", "Camionetas EV", "Ver catálogo"],
  Servicios: ["Prueba de manejo", "Financiamiento", "Instalación de cargador", "Servicio técnico", "Garantías"],
  "VoltMX": ["Sobre nosotros", "Sustentabilidad", "Noticias", "Empleos", "Prensa"],
};

export default function Footer() {
  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-navy-900 border-t border-neon-green/10 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-neon-green/20 to-transparent" />
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="relative">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-neon-green to-neon-cyan flex items-center justify-center">
                  <Zap className="w-5 h-5 text-navy-950" fill="currentColor" />
                </div>
              </div>
              <span className="font-display font-bold text-xl">
                <span className="text-white">Volt</span>
                <span className="text-neon-green glow-green">MX</span>
              </span>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
              El retailer líder de autos eléctricos en México. Impulsando la movilidad
              sustentable desde el corazón de la Ciudad de México.
            </p>

            {/* Contact info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-neon-green flex-shrink-0" />
                <span className="text-sm text-gray-400">Reforma 333, CDMX</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-neon-green flex-shrink-0" />
                <span className="text-sm text-gray-400">+52 (55) 5000-8765</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-neon-green flex-shrink-0" />
                <span className="text-sm text-gray-400">contacto@voltmx.mx</span>
              </div>
            </div>

            {/* Social */}
            <div className="flex items-center gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-navy-950 border border-white/10 flex items-center justify-center text-gray-400 hover:text-neon-green hover:border-neon-green/30 transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-white text-sm mb-5 tracking-wide">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-gray-400 hover:text-neon-green transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="font-semibold text-white text-sm mb-1">
                Suscríbete a nuestro newsletter
              </h4>
              <p className="text-xs text-gray-500">
                Recibe novedades, lanzamientos y ofertas exclusivas.
              </p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <input
                type="email"
                placeholder="tu@email.com"
                className="flex-1 sm:w-64 px-4 py-2.5 bg-navy-950 border border-white/10 rounded-lg text-white text-sm placeholder-gray-600 focus:outline-none focus:border-neon-green/40 transition-all duration-200"
              />
              <button className="btn-neon-solid text-xs px-5 py-2.5 whitespace-nowrap">
                Suscribirse
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-gray-600">
              © {new Date().getFullYear()} VoltMX S.A. de C.V. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
                Aviso de privacidad
              </a>
              <a href="#" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
                Términos y condiciones
              </a>
              <a href="#" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}