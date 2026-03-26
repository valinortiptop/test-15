// @ts-nocheck
// src/components/LocationMap.tsx
import { useEffect, useState } from "react";
import { MapPin, Clock, Phone, Navigation } from "lucide-react";
import { supabase } from "../lib/supabase";

const FALLBACK_EMBED = "https://www.google.com/maps?q=Paseo+de+la+Reforma+333,+Cuauhtemoc,+Mexico+City&output=embed";

export default function LocationMap() {
  const [iframeSrc, setIframeSrc] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMap() {
      try {
        const { data, error } = await supabase.functions.invoke("api-handler", {
          body: { action: "get-maps-key" },
        });

        if (error || !data?.key) {
          console.warn("Could not get maps key, using fallback embed");
          setIframeSrc(FALLBACK_EMBED);
        } else {
          const key = data.key;
          setIframeSrc(
            `https://www.google.com/maps/embed/v1/place?key=${key}&q=Paseo+de+la+Reforma+333,+Mexico+City,+Mexico&zoom=16`
          );
        }
      } catch (err) {
        console.warn("Map load error, using fallback:", err);
        setIframeSrc(FALLBACK_EMBED);
      } finally {
        setLoading(false);
      }
    }

    loadMap();
  }, []);

  return (
    <section id="location" className="section-padding bg-white">
      <div className="container-max mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-brand-600 uppercase tracking-wider mb-3">
            Our Location
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Find Us at Reforma 333
          </h2>
          <p className="max-w-xl mx-auto text-lg text-gray-600">
            We're located in the heart of Mexico City. Come visit us or get in touch online.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Info sidebar */}
          <div className="space-y-5 lg:col-span-1">
            {/* Address */}
            <div className="card p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-brand-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Address
                  </p>
                  <p className="font-semibold text-gray-900">Paseo de la Reforma 333</p>
                  <p className="text-sm text-gray-500">Col. Cuauhtémoc</p>
                  <p className="text-sm text-gray-500">Ciudad de México, CDMX 06500</p>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="card p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-brand-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Business Hours
                  </p>
                  <p className="font-semibold text-gray-900">Mon – Fri: 9:00 – 19:00</p>
                  <p className="text-sm text-gray-500">Saturday: 10:00 – 17:00</p>
                  <p className="text-sm text-gray-500">Sunday: Closed</p>
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="card p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-brand-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Phone
                  </p>
                  <p className="font-semibold text-gray-900">+52 (55) 5000-8765</p>
                  <p className="text-sm text-gray-500">hello@test15.app</p>
                </div>
              </div>
            </div>

            {/* Directions button */}
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=Paseo+de+la+Reforma+333,+Mexico+City"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full"
            >
              <Navigation className="w-4 h-4 mr-2" />
              Get Directions
            </a>
          </div>

          {/* Map */}
          <div className="lg:col-span-2">
            <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-sm" style={{ height: "460px" }}>
              {/* Loading state */}
              {loading && (
                <div className="absolute inset-0 bg-gray-50 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-10 h-10 border-2 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-sm text-gray-500">Loading map...</p>
                  </div>
                </div>
              )}

              {/* Map iframe */}
              {!loading && iframeSrc && (
                <iframe
                  title="Our Location — Reforma 333, Mexico City"
                  src={iframeSrc}
                  className="w-full h-full border-0"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />
              )}

              {/* Hard fallback: no src at all */}
              {!loading && !iframeSrc && (
                <div className="absolute inset-0 bg-brand-50 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mb-4">
                    <MapPin className="w-8 h-8 text-brand-600" />
                  </div>
                  <p className="font-bold text-gray-900 text-lg">Reforma 333</p>
                  <p className="text-gray-500 text-sm mb-4">Ciudad de México</p>
                  <a
                    href="https://maps.google.com/?q=Paseo+de+la+Reforma+333+Mexico+City"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary text-sm"
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Open in Google Maps
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}