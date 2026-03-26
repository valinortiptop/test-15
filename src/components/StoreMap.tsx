// src/components/StoreMap.tsx
import React, { useEffect, useRef, useState } from "react";
import { MapPin, Phone, Clock, Navigation, Zap } from "lucide-react";
import { supabase } from "../hooks/useApiHandler";

const STORE_COORDS = { lat: 19.4284, lng: -99.1678 };
const STORE_ADDRESS = "Paseo de la Reforma 333, Cuauhtémoc, CDMX";

declare global {
  interface Window {
    google: typeof google;
    initVoltMXMap: () => void;
  }
}

export default function StoreMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [coords, setCoords] = useState(STORE_COORDS);
  const loadAttempted = useRef(false);

  // Geocode address then init map
  useEffect(() => {
    if (loadAttempted.current) return;
    loadAttempted.current = true;

    async function init() {
      // Try to get real coords
      try {
        const { data } = await supabase.functions.invoke("api-handler", {
          body: { action: "geocode", address: "Paseo de la Reforma 333, Mexico City" },
        });
        const loc = data?.results?.[0]?.geometry?.location;
        if (loc?.lat && loc?.lng) {
          setCoords({ lat: loc.lat, lng: loc.lng });
        }
      } catch (_) {
        // Use fallback coords
      }

      // Inject Google Maps JS API
      loadGoogleMaps();
    }

    init();
  }, []);

  function loadGoogleMaps() {
    if (window.google?.maps) {
      initMap();
      return;
    }

    window.initVoltMXMap = () => {
      setMapLoaded(true);
      initMap();
    };

    const script = document.createElement("script");
    // Use the same Valinor proxy for the Maps JS API key lookup won't work client-side,
    // so we'll use a static embed approach with the Embed API (no JS key needed)
    // as primary, with a fallback static map.
    script.onerror = () => setMapError(true);

    // We use the Embed Static Maps approach instead since JS API key is server-side only
    setMapLoaded(true);
  }

  function initMap() {
    if (!mapRef.current || !window.google?.maps) return;
    try {
      const map = new window.google.maps.Map(mapRef.current, {
        center: coords,
        zoom: 16,
        styles: darkMapStyle,
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
      });

      const marker = new window.google.maps.Marker({
        position: coords,
        map,
        title: "VoltMX — Reforma 333",
        animation: window.google.maps.Animation.DROP,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: "#39FF14",
          fillOpacity: 1,
          strokeColor: "#020617",
          strokeWeight: 3,
        },
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding:12px; color:#fff; min-width:200px;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
              <span style="color:#39FF14;font-size:18px;">⚡</span>
              <strong style="font-size:14px;color:#fff;">VoltMX</strong>
            </div>
            <p style="margin:0 0 4px;font-size:12px;color:#ccc;">Paseo de la Reforma 333</p>
            <p style="margin:0 0 4px;font-size:12px;color:#ccc;">Cuauhtémoc, CDMX</p>
            <p style="margin:4px 0 0;font-size:12px;color:#39FF14;">🕐 Lun–Sáb 9am–7pm</p>
          </div>
        `,
      });

      marker.addListener("click", () => infoWindow.open(map, marker));
      infoWindow.open(map, marker);
      mapInstanceRef.current = map;
    } catch (err) {
      console.error("Map init error:", err);
      setMapError(true);
    }
  }

  // Re-init if coords change and google is loaded
  useEffect(() => {
    if (window.google?.maps && mapRef.current) {
      initMap();
    }
  }, [coords]);

  return (
    <section id="store" className="py-24 bg-navy-950 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 section-divider" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-neon-green/3 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neon-green/20 bg-neon-green/5 mb-4">
            <MapPin className="w-3.5 h-3.5 text-neon-green" />
            <span className="text-xs font-semibold tracking-widest text-neon-green uppercase">
              Visítanos
            </span>
          </div>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-white mb-4">
            Nuestra{" "}
            <span className="text-neon-green glow-green">Tienda</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Conoce nuestros modelos en persona. Agenda una prueba de manejo y vive la
            experiencia eléctrica.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Info cards */}
          <div className="space-y-5 lg:col-span-1">
            <InfoCard
              icon={MapPin}
              title="Dirección"
              lines={["Paseo de la Reforma 333", "Col. Cuauhtémoc", "Ciudad de México, CDMX"]}
              color="text-neon-green"
            />
            <InfoCard
              icon={Clock}
              title="Horario"
              lines={["Lunes — Viernes: 9:00 – 19:00", "Sábado: 10:00 – 17:00", "Domingo: Cerrado"]}
              color="text-neon-cyan"
            />
            <InfoCard
              icon={Phone}
              title="Contacto"
              lines={["+52 (55) 5000-8765", "contacto@voltmx.mx"]}
              color="text-yellow-400"
            />

            {/* Directions button */}
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full btn-neon-solid py-3"
            >
              <Navigation className="w-4 h-4" />
              Cómo llegar
            </a>
          </div>

          {/* Map */}
          <div className="lg:col-span-2">
            <div className="relative rounded-2xl overflow-hidden h-[460px] border border-neon-green/20 shadow-neon-green">
              {/* Embedded iframe as primary (no JS API key needed) */}
              <iframe
                title="VoltMX Store Location"
                className="w-full h-full"
                style={{ filter: "invert(90%) hue-rotate(170deg) saturate(0.7) brightness(0.85)" }}
                loading="lazy"
                allowFullScreen
                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyD-placeholder&q=Paseo+de+la+Reforma+333,+Mexico+City&zoom=16`}
                onError={() => setMapError(true)}
              />

              {/* Fallback: static visual map if iframe fails */}
              {mapError && (
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #0d1530 0%, #071a12 100%)" }}
                >
                  <div className="text-center p-8">
                    <div className="w-16 h-16 rounded-full bg-neon-green/10 border-2 border-neon-green/30 flex items-center justify-center mx-auto mb-4 animate-pulse">
                      <MapPin className="w-8 h-8 text-neon-green" />
                    </div>
                    <p className="font-display font-bold text-xl text-white mb-2">
                      Reforma 333
                    </p>
                    <p className="text-gray-400 text-sm mb-1">Ciudad de México</p>
                    <p className="text-neon-green text-sm">19.4284° N, 99.1678° O</p>
                    <a
                      href="https://maps.google.com/?q=Paseo+de+la+Reforma+333+Mexico+City"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-4 text-xs text-neon-cyan hover:text-neon-green transition-colors"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      Ver en Google Maps
                    </a>
                  </div>
                </div>
              )}

              {/* Corner badge */}
              <div className="absolute top-4 left-4 card-glass rounded-lg px-3 py-2 flex items-center gap-2 border border-neon-green/20">
                <Zap className="w-3.5 h-3.5 text-neon-green" fill="currentColor" />
                <span className="text-xs font-bold text-white">VoltMX Reforma 333</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 section-divider" />
    </section>
  );
}

function InfoCard({
  icon: Icon,
  title,
  lines,
  color,
}: {
  icon: React.ElementType;
  title: string;
  lines: string[];
  color: string;
}) {
  return (
    <div className="card-glass rounded-xl p-5 transition-all duration-300">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-8 h-8 rounded-lg bg-navy-950/60 flex items-center justify-center`}>
          <Icon className={`w-4 h-4 ${color}`} />
        </div>
        <h3 className="font-semibold text-white text-sm">{title}</h3>
      </div>
      <div className="space-y-1 pl-11">
        {lines.map((line) => (
          <p key={line} className="text-sm text-gray-400">
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}

const darkMapStyle: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#0d1530" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#020617" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#39FF14" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#0f1f4a" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#020617" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#020617" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
];