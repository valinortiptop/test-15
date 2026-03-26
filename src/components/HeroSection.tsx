// src/components/HeroSection.tsx
import React, { useEffect, useState, useRef } from "react";
import { ChevronDown, Zap, Shield, Leaf } from "lucide-react";
import { generateImage } from "../hooks/useApiHandler";

const FALLBACK_GRADIENT =
  "linear-gradient(135deg, #020617 0%, #0a0f1e 40%, #071a12 70%, #0d1530 100%)";

const stats = [
  { value: "500+", label: "Autos vendidos", icon: Zap },
  { value: "15", label: "Marcas disponibles", icon: Shield },
  { value: "100%", label: "Cero emisiones", icon: Leaf },
];

export default function HeroSection() {
  const [heroImg, setHeroImg] = useState<string | null>(null);
  const [imgLoading, setImgLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const hasGenerated = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (hasGenerated.current) return;
    hasGenerated.current = true;

    generateImage(
      "Futuristic electric car showroom at night in Mexico City, sleek luxury EV sedan on a dark glossy floor, neon green and cyan accent lighting, ultra-modern architecture, cinematic photorealistic render, wide angle, 4K"
    ).then(({ imageData }) => {
      if (imageData) setHeroImg(imageData);
      setImgLoading(false);
    });
  }, []);

  const handleScroll = () => {
    const el = document.querySelector("#vehicles");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        {heroImg ? (
          <img
            src={heroImg}
            alt="VoltMX EV Showroom"
            className="w-full h-full object-cover opacity-40"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{ background: FALLBACK_GRADIENT }}
          />
        )}
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/70 via-navy-950/40 to-navy-950" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/80 via-transparent to-navy-950/60" />
      </div>

      {/* Animated grid */}
      <div
        className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(57,255,20,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(57,255,20,0.15) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-green/5 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-neon-cyan/5 rounded-full blur-3xl animate-pulse-slow pointer-events-none" style={{ animationDelay: "1.5s" }} />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32">
        <div className="max-w-4xl">
          {/* Badge */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neon-green/30 bg-neon-green/5 mb-8 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <Zap className="w-3.5 h-3.5 text-neon-green" fill="currentColor" />
            <span className="text-xs font-semibold tracking-widest text-neon-green uppercase">
              El futuro ya llegó a México
            </span>
          </div>

          {/* Heading */}
          <h1
            className={`font-display font-bold text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-none mb-6 transition-all duration-700 delay-150 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          >
            <span className="text-white">Maneja el</span>
            <br />
            <span className="text-neon-green glow-green">futuro</span>
            <br />
            <span className="text-white">hoy.</span>
          </h1>

          {/* Subheading */}
          <p
            className={`text-lg sm:text-xl text-gray-300 max-w-2xl leading-relaxed mb-10 transition-all duration-700 delay-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          >
            VoltMX es el retailer líder de autos eléctricos en México. Explora nuestra
            selección de vehículos 100% eléctricos y súmate a la revolución de la movilidad
            sustentable en la Ciudad de México.
          </p>

          {/* CTAs */}
          <div
            className={`flex flex-col sm:flex-row gap-4 mb-20 transition-all duration-700 delay-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          >
            <button
              onClick={() => { const el = document.querySelector("#vehicles"); el?.scrollIntoView({ behavior: "smooth" }); }}
              className="btn-neon-solid"
            >
              Ver vehículos
            </button>
            <button
              onClick={() => { const el = document.querySelector("#contact"); el?.scrollIntoView({ behavior: "smooth" }); }}
              className="btn-neon"
            >
              Agendar prueba
            </button>
          </div>

          {/* Stats */}
          <div
            className={`grid grid-cols-3 gap-6 max-w-lg transition-all duration-700 delay-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          >
            {stats.map(({ value, label, icon: Icon }) => (
              <div key={label} className="text-center sm:text-left">
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon className="w-4 h-4 text-neon-green hidden sm:block" />
                  <span className="font-display font-bold text-2xl sm:text-3xl text-neon-green glow-green">
                    {value}
                  </span>
                </div>
                <p className="text-xs text-gray-400 leading-tight">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={handleScroll}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-neon-green/60 hover:text-neon-green transition-colors animate-bounce"
        aria-label="Scroll down"
      >
        <ChevronDown className="w-8 h-8" />
      </button>

      {/* Bottom divider */}
      <div className="absolute bottom-0 left-0 right-0 section-divider" />
    </section>
  );
}