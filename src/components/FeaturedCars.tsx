// src/components/FeaturedCars.tsx
import React, { useEffect, useState, useRef } from "react";
import { Zap, Battery, Gauge, Star, ChevronRight } from "lucide-react";
import { generateImage } from "../hooks/useApiHandler";

interface Car {
  id: string;
  name: string;
  brand: string;
  price: string;
  range: string;
  charge: string;
  speed: string;
  rating: number;
  badge: string;
  badgeColor: string;
  prompt: string;
  imageData: string | null;
  loading: boolean;
}

const initialCars: Omit<Car, "imageData" | "loading">[] = [
  {
    id: "sedan-1",
    name: "Model Volt S",
    brand: "VoltMX",
    price: "$1,250,000",
    range: "580 km",
    charge: "20 min",
    speed: "0-100 en 3.2s",
    rating: 5,
    badge: "MÁS VENDIDO",
    badgeColor: "bg-neon-green text-navy-950",
    prompt:
      "Sleek futuristic electric sedan, metallic dark blue, parked on a glossy black floor with neon green reflections, studio photography, ultra-realistic, cinematic lighting, 4K",
  },
  {
    id: "suv-1",
    name: "Urban EV X",
    brand: "VoltMX",
    price: "$980,000",
    range: "450 km",
    charge: "30 min",
    speed: "0-100 en 5.1s",
    rating: 4,
    badge: "NUEVO",
    badgeColor: "bg-neon-cyan text-navy-950",
    prompt:
      "Modern luxury electric SUV, pearl white, on a city road at dusk with city lights bokeh, photorealistic render, cinematic, 4K",
  },
  {
    id: "sport-1",
    name: "RápidoEV GT",
    brand: "VoltMX",
    price: "$2,100,000",
    range: "520 km",
    charge: "15 min",
    speed: "0-100 en 2.8s",
    rating: 5,
    badge: "PREMIUM",
    badgeColor: "bg-purple-500 text-white",
    prompt:
      "Exotic sports electric car, deep red carbon fiber, low angle shot, dramatic neon light trails, futuristic showroom, ultra-realistic 4K render",
  },
];

export default function FeaturedCars() {
  const [cars, setCars] = useState<Car[]>(
    initialCars.map((c) => ({ ...c, imageData: null, loading: true }))
  );
  const generated = useRef(false);

  useEffect(() => {
    if (generated.current) return;
    generated.current = true;

    initialCars.forEach((car, idx) => {
      generateImage(car.prompt).then(({ imageData }) => {
        setCars((prev) =>
          prev.map((c, i) =>
            i === idx ? { ...c, imageData, loading: false } : c
          )
        );
      });
    });
  }, []);

  return (
    <section id="vehicles" className="py-24 bg-navy-950 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-neon-green/30 to-transparent" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-32 right-0 w-72 h-72 bg-neon-green/3 rounded-full blur-3xl" />
        <div className="absolute bottom-32 left-0 w-72 h-72 bg-neon-cyan/3 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neon-green/20 bg-neon-green/5 mb-4">
            <Zap className="w-3.5 h-3.5 text-neon-green" fill="currentColor" />
            <span className="text-xs font-semibold tracking-widest text-neon-green uppercase">
              Nuestra flota
            </span>
          </div>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-white mb-4">
            Vehículos{" "}
            <span className="text-neon-green glow-green">Destacados</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Descubre nuestra selección de autos eléctricos premium. Tecnología de
            vanguardia, diseño excepcional, cero emisiones.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <button
            onClick={() => { const el = document.querySelector("#contact"); el?.scrollIntoView({ behavior: "smooth" }); }}
            className="inline-flex items-center gap-2 btn-neon"
          >
            Ver catálogo completo
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

function CarCard({ car }: { car: Car }) {
  return (
    <div className="card-glass rounded-2xl overflow-hidden group transition-all duration-500 hover:-translate-y-2">
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        {car.loading ? (
          <div className="w-full h-full image-placeholder flex items-center justify-center">
            <div className="text-center">
              <div className="w-10 h-10 border-2 border-neon-green/40 border-t-neon-green rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs text-neon-green/60">Generando imagen...</p>
            </div>
          </div>
        ) : car.imageData ? (
          <img
            src={car.imageData}
            alt={car.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #0d1530 0%, #071a12 50%, #0d1530 100%)",
            }}
          >
            <Zap className="w-16 h-16 text-neon-green/20" />
          </div>
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-transparent to-transparent" />

        {/* Badge */}
        <span className={`absolute top-3 left-3 text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-sm ${car.badgeColor}`}>
          {car.badge}
        </span>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mb-4">
          <p className="text-xs text-neon-green/70 font-semibold tracking-widest uppercase mb-1">
            {car.brand}
          </p>
          <h3 className="font-display font-bold text-xl text-white mb-1">{car.name}</h3>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${i < car.rating ? "text-neon-green" : "text-gray-600"}`}
                fill={i < car.rating ? "currentColor" : "none"}
              />
            ))}
          </div>
        </div>

        {/* Specs */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Spec icon={Battery} label="Autonomía" value={car.range} />
          <Spec icon={Zap} label="Carga" value={car.charge} />
          <Spec icon={Gauge} label="Velocidad" value={car.speed.replace("0-100 en ", "")} />
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Desde</p>
            <p className="font-display font-bold text-xl text-white">
              {car.price} <span className="text-xs text-gray-400 font-normal">MXN</span>
            </p>
          </div>
          <button
            onClick={() => { const el = document.querySelector("#contact"); el?.scrollIntoView({ behavior: "smooth" }); }}
            className="btn-neon text-xs px-4 py-2"
          >
            Más info
          </button>
        </div>
      </div>
    </div>
  );
}

function Spec({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-navy-950/60 rounded-lg p-2.5 text-center">
      <Icon className="w-4 h-4 text-neon-green mx-auto mb-1" />
      <p className="text-[10px] text-gray-500 mb-0.5">{label}</p>
      <p className="text-xs font-semibold text-white leading-tight">{value}</p>
    </div>
  );
}