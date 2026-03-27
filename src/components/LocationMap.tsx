// @ts-nocheck
// src/components/LocationMap.tsx
import { useEffect, useState } from "react";
import { MapPin, Clock, Phone, Navigation, Wind, Droplets, Thermometer, Eye } from "lucide-react";
import { supabase } from "../lib/supabase";

const FALLBACK_EMBED =
  "https://www.google.com/maps?q=Paseo+de+la+Reforma+333,+Cuauhtemoc,+Mexico+City&output=embed";

interface WeatherData {
  temp: number;
  feelsLike: number;
  description: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  icon: string;
}

export default function LocationMap() {
  const [iframeSrc, setIframeSrc] = useState("");
  const [mapLoading, setMapLoading] = useState(true);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState(false);

  // Load map
  useEffect(() => {
    async function loadMap() {
      try {
        const { data, error } = await supabase.functions.invoke("api-handler", {
          body: { action: "get-maps-key" },
        });
        if (error || !data?.key) throw new Error("No key");
        setIframeSrc(
          `https://www.google.com/maps/embed/v1/place?key=${data.key}&q=Paseo+de+la+Reforma+333,+Mexico+City,+Mexico&zoom=16`
        );
      } catch {
        setIframeSrc(FALLBACK_EMBED);
      } finally {
        setMapLoading(false);
      }
    }
    loadMap();
  }, []);

  // Load weather via AI (OpenWeatherMap-style via our proxy)
  useEffect(() => {
    async function loadWeather() {
      try {
        const { data, error } = await supabase.functions.invoke("api-handler", {
          body: { action: "get-weather", lat: 19.4284, lon: -99.1678 },
        });
        if (error || !data?.weather) throw new Error("No weather data");
        setWeather(data.weather);
      } catch {
        setWeatherError(true);
      } finally {
        setWeatherLoading(false);
      }
    }
    loadWeather();
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
            We're located in the heart of Mexico City on Paseo de la Reforma.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Sidebar */}
          <div className="space-y-4 lg:col-span-1">
            {/* Address */}
            <div className="rounded-xl border border-brand-100 bg-brand-50 p-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-brand-500 uppercase tracking-wider mb-1">
                    Address
                  </p>
                  <p className="font-semibold text-gray-900">Paseo de la Reforma 333</p>
                  <p className="text-sm text-gray-600">Col. Cuauhtémoc</p>
                  <p className="text-sm text-gray-600">Ciudad de México, CDMX 06500</p>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="rounded-xl border border-brand-100 bg-brand-50 p-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-brand-500 uppercase tracking-wider mb-1">
                    Hours
                  </p>
                  <p className="font-semibold text-gray-900">Mon – Fri: 9:00 – 19:00</p>
                  <p className="text-sm text-gray-600">Saturday: 10:00 – 17:00</p>
                  <p className="text-sm text-gray-600">Sunday: Closed</p>
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="rounded-xl border border-brand-100 bg-brand-50 p-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-brand-500 uppercase tracking-wider mb-1">
                    Contact
                  </p>
                  <p className="font-semibold text-gray-900">+52 (55) 5000-8765</p>
                  <p className="text-sm text-gray-600">hello@test15.app</p>
                </div>
              </div>
            </div>

            {/* Directions CTA */}
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=Paseo+de+la+Reforma+333,+Mexico+City"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full justify-center"
            >
              <Navigation className="w-4 h-4 mr-2" />
              Get Directions
            </a>
          </div>

          {/* Map + Weather column */}
          <div className="lg:col-span-2 space-y-4">
            {/* ── Map ── */}
            <div
              className="relative rounded-2xl overflow-hidden border-2 border-brand-200 shadow-lg"
              style={{ height: "400px" }}
            >
              {/* Blue tint overlay strip at top to brand the map */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-600 via-brand-400 to-brand-600 z-10" />

              {mapLoading && (
                <div className="absolute inset-0 bg-brand-50 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-10 h-10 border-2 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-sm text-brand-600 font-medium">Loading map...</p>
                  </div>
                </div>
              )}

              {!mapLoading && iframeSrc && (
                <iframe
                  title="Our Location — Reforma 333, Mexico City"
                  src={iframeSrc}
                  className="w-full h-full border-0"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />
              )}

              {!mapLoading && !iframeSrc && (
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

              {/* Bottom badge */}
              <div className="absolute bottom-3 left-3 bg-brand-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md z-10">
                <MapPin className="w-3 h-3" />
                Reforma 333 · CDMX
              </div>
            </div>

            {/* ── Weather Widget ── */}
            <WeatherWidget
              weather={weather}
              loading={weatherLoading}
              error={weatherError}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function WeatherWidget({
  weather,
  loading,
  error,
}: {
  weather: WeatherData | null;
  loading: boolean;
  error: boolean;
}) {
  if (loading) {
    return (
      <div className="rounded-xl border-2 border-brand-100 bg-brand-50 p-5 animate-pulse">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-brand-200 rounded-lg" />
          <div className="h-4 w-40 bg-brand-200 rounded" />
        </div>
        <div className="flex gap-6">
          <div className="h-12 w-24 bg-brand-200 rounded" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-full bg-brand-200 rounded" />
            <div className="h-3 w-3/4 bg-brand-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="rounded-xl border-2 border-brand-100 bg-brand-50 p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center">
            <Thermometer className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">Live Weather — Mexico City</p>
            <p className="text-xs text-gray-500">
              Typically warm &amp; sunny · ~22°C · Low humidity season
            </p>
          </div>
        </div>
      </div>
    );
  }

  const getWeatherEmoji = (desc: string) => {
    const d = desc.toLowerCase();
    if (d.includes("clear") || d.includes("sunny")) return "☀️";
    if (d.includes("cloud")) return "⛅";
    if (d.includes("rain") || d.includes("drizzle")) return "🌧️";
    if (d.includes("storm") || d.includes("thunder")) return "⛈️";
    if (d.includes("snow")) return "❄️";
    if (d.includes("fog") || d.includes("mist")) return "🌫️";
    return "🌤️";
  };

  return (
    <div className="rounded-xl border-2 border-brand-200 bg-gradient-to-br from-brand-600 to-brand-800 p-5 text-white shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-brand-200" />
          <span className="text-sm font-semibold text-brand-100">
            Live Weather · Reforma 333, CDMX
          </span>
        </div>
        <span className="text-xs text-brand-300 bg-brand-700 px-2 py-1 rounded-full">
          Now
        </span>
      </div>

      {/* Main weather display */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-5xl">{getWeatherEmoji(weather.description)}</div>
          <div>
            <div className="text-4xl font-bold">{Math.round(weather.temp)}°C</div>
            <div className="text-brand-200 text-sm capitalize mt-0.5">{weather.description}</div>
            <div className="text-brand-300 text-xs mt-0.5">
              Feels like {Math.round(weather.feelsLike)}°C
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-3">
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-brand-300" />
            <div>
              <div className="text-xs text-brand-300">Humidity</div>
              <div className="text-sm font-semibold">{weather.humidity}%</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Wind className="w-4 h-4 text-brand-300" />
            <div>
              <div className="text-xs text-brand-300">Wind</div>
              <div className="text-sm font-semibold">{weather.windSpeed} km/h</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-brand-300" />
            <div>
              <div className="text-xs text-brand-300">Visibility</div>
              <div className="text-sm font-semibold">{weather.visibility} km</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-brand-300" />
            <div>
              <div className="text-xs text-brand-300">Feels Like</div>
              <div className="text-sm font-semibold">{Math.round(weather.feelsLike)}°C</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}