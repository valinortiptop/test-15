// src/components/WhyEV.tsx
import React, { useEffect, useRef, useState } from "react";
import { Leaf, Zap, DollarSign, Shield, Globe, TrendingUp } from "lucide-react";
import { generateImage } from "../hooks/useApiHandler";

const reasons = [
  {
    icon: Leaf,
    title: "Cero emisiones",
    desc: "Reduce tu huella de carbono al 100%. Los EVs no producen gases contaminantes ni contribuyen al smog de CDMX.",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
  },
  {
    icon: DollarSign,
    title: "Ahorro real",
    desc: "La electricidad cuesta hasta 80% menos que la gasolina. Recupera tu inversión en menos de 3 años.",
    color: "text-neon-green",
    bg: "bg-neon-green/10",
  },
  {
    icon: Zap,
    title: "Rendimiento superior",
    desc: "Torque instantáneo desde 0 km/h. Acelera más rápido y con mayor fluidez que cualquier auto de combustión.",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
  },
  {
    icon: Shield,
    title: "Mantenimiento mínimo",
    desc: "Sin cambios de aceite, filtros ni bujías. Los EVs tienen 70% menos piezas móviles que un motor de combustión.",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    icon: Globe,
    title: "Incentivos fiscales",
    desc: "Exento de verificación vehicular en CDMX, descuentos en tenencia y acceso a carriles exclusivos.",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },
  {
    icon: TrendingUp,
    title: "Mayor valor de reventa",
    desc: "Los EVs mantienen mejor su valor. La demanda de vehículos eléctricos crece 40% anual en México.",
    color: "text-neon-cyan",
    bg: "bg-neon-cyan/10",
  },
];

export default function WhyEV() {
  const [sideImg, setSideImg] = useState<string | null>(null);
  const [imgLoading, setImgLoading] = useState(true);
  const generated = useRef(false);

  useEffect(() => {
    if (generated.current) return;
    generated.current = true;

    generateImage(
      "Aerial view of Mexico City Paseo de la Reforma boulevard at twilight, electric cars with glowing taillights, clean futuristic cityscape, neon green and cyan light trails, cinematic drone shot, 4K ultra-realistic"
    ).then(({ imageData }) => {
      if (imageData) setSideImg(imageData);
      setImgLoading(false);
    });
  }, []);

  return (
    <section id="why-ev" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950 via-navy-800/50 to-navy-950 pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon-green/3 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Image */}
          <div className="relative order-2 lg:order-1">
            <div className="relative rounded-2xl overflow-hidden h-[500px] shadow-neon-green">
              {imgLoading ? (
                <div className="w-full h-full image-placeholder flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-10 h-10 border-2 border-neon-green/40 border-t-neon-green rounded-full animate-spin mx-auto mb-2" />
                    <p className="text-xs text-neon-green/60">Generando imagen...</p>
                  </div>
                </div>
              ) : sideImg ? (
                <img
                  src={sideImg}
                  alt="México EV Future"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full"
                  style={{
                    background:
                      "linear-gradient(135deg, #0d1530 0%, #071a12 50%, #0a0f1e 100%)",
                  }}
                >
                  <div className="flex items-center justify-center h-full">
                    <Globe className="w-24 h-24 text-neon-green/20" />
                  </div>
                </div>
              )}
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 via-transparent to-transparent" />

              {/* Floating stat card */}
              <div className="absolute bottom-6 left-6 right-6 card-glass rounded-xl p-4 border border-neon-green/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Crecimiento EV en México</p>
                    <p className="font-display font-bold text-2xl text-neon-green glow-green">
                      +40%
                    </p>
                    <p className="text-xs text-gray-500">Anual 2024</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400 mb-1">Ahorro promedio</p>
                    <p className="font-display font-bold text-2xl text-neon-cyan glow-cyan">
                      $45k
                    </p>
                    <p className="text-xs text-gray-500">MXN / año</p>
                  </div>
                  <TrendingUp className="w-10 h-10 text-neon-green/30 hidden sm:block" />
                </div>
              </div>
            </div>

            {/* Decorative border glow */}
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-neon-green/20 via-transparent to-neon-cyan/20 -z-10 blur-sm" />
          </div>

          {/* Right: Reasons */}
          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neon-green/20 bg-neon-green/5 mb-6">
              <Zap className="w-3.5 h-3.5 text-neon-green" fill="currentColor" />
              <span className="text-xs font-semibold tracking-widest text-neon-green uppercase">
                ¿Por qué eléctrico?
              </span>
            </div>

            <h2 className="font-display font-bold text-4xl sm:text-5xl text-white mb-4">
              El cambio que{" "}
              <span className="text-neon-green glow-green">México necesita</span>
            </h2>
            <p className="text-gray-400 text-lg mb-10 leading-relaxed">
              Más de 500 familias ya eligieron un VoltMX. Descubre por qué los autos
              eléctricos son la mejor decisión para tu bolsillo y el planeta.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {reasons.map(({ icon: Icon, title, desc, color, bg }) => (
                <div
                  key={title}
                  className="card-glass rounded-xl p-4 transition-all duration-300 hover:-translate-y-1 cursor-default"
                >
                  <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center mb-3`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <h3 className="font-semibold text-white text-sm mb-1.5">{title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 section-divider" />
    </section>
  );
}