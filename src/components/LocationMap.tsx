// @ts-nocheck
// src/components/LocationMap.tsx
import { useState, useEffect } from "react";
import { MapPin, Thermometer, Wind, Droplets, Eye, ChevronRight, RefreshCw } from "lucide-react";
import { supabase } from "../lib/supabase";

interface HourlyWeather {
  time: string;
  temp: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  visibility: number;
  description: string;
  emoji: string;
}

interface WeatherData {
  current: HourlyWeather;
  hourly: HourlyWeather[];
  location: string;
  updated_at: string;
}

const FALLBACK_WEATHER: WeatherData = {
  location: "Paseo de la Reforma 333, CDMX",
  updated_at: new Date().toISOString(),
  current: {
    time: "Now",
    temp: 22,
    feels_like: 20,
    humidity: 55,
    wind_speed: 14,
    visibility: 10,
    description: "Partly cloudy",
    emoji: "⛅",
  },
  hourly: [
    { time: "1h", temp: 23, feels_like: 21, humidity: 53, wind_speed: 13, visibility: 10, description: "Partly cloudy", emoji: "⛅" },
    { time: "2h", temp: 24, feels_like: 22, humidity: 50, wind_speed: 12, visibility: 10, description: "Sunny", emoji: "☀️" },
    { time: "3h", temp: 25, feels_like: 23, humidity: 48, wind_speed: 11, visibility: 10, description: "Sunny", emoji: "☀️" },
    { time: "4h", temp: 24, feels_like: 22, humidity: 52, wind_speed: 13, visibility: 9, description: "Partly cloudy", emoji: "⛅" },
    { time: "5h", temp: 22, feels_like: 20, humidity: 58, wind_speed: 15, visibility: 8, description: "Cloudy", emoji: "🌥️" },
    { time: "6h", temp: 20, feels_like: 18, humidity: 62, wind_speed: 17, visibility: 7, description: "Light rain", emoji: "🌦️" },
  ],
};

function toF(c: number) {
  return Math.round((c * 9) / 5 + 32);
}

function formatTemp(c: number, unit: "C" | "F") {
  return unit === "C" ? `${c}°C` : `${toF(c)}°F`;
}

export default function LocationMap() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [unit, setUnit] = useState<"C" | "F">("C");
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [mapKey, setMapKey] = useState<string>("");

  const fetchWeather = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    try {
      const { data, error } = await supabase.functions.invoke("api-handler", {
        body: {
          action: "get-weather",
          lat: 19.4326,
          lon: -99.1332,
          location: "Paseo de la Reforma 333, Mexico City",
        },
      });
      if (!error && data && data.current) {
        setWeather(data);
      } else {
        setWeather(FALLBACK_WEATHER);
      }
    } catch {
      setWeather(FALLBACK_WEATHER);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchMapKey = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("api-handler", {
        body: { action: "get-maps-key" },
      });
      if (!error && data?.key) {
        setMapKey(data.key);
      }
    } catch {
      // silently fail
    }
  };

  useEffect(() => {
    fetchWeather();
    fetchMapKey();
  }, []);

  const displayed =
    selectedHour !== null && weather
      ? weather.hourly[selectedHour]
      : weather?.current;

  const mapSrc = mapKey
    ? `https://www.google.com/maps/embed/v1/place?key=${mapKey}&q=Paseo+de+la+Reforma+333,Mexico+City&zoom=16&maptype=roadmap`
    : `https://maps.google.com/maps?q=Paseo+de+la+Reforma+333,+Mexico+City&output=embed&z=16`;

  return (
    <div className="space-y-6">
      {/* ── MAP ── */}
      <div className="rounded-2xl overflow-hidden border-2 border-brand-200 shadow-lg shadow-brand-100/50">
        {/* Map header bar */}
        <div className="bg-brand-600 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-semibold">Paseo de la Reforma 333, CDMX</span>
          </div>
          <a
            href="https://maps.google.com/?q=Paseo+de+la+Reforma+333,+Mexico+City"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-brand-100 hover:text-white transition-colors text-xs font-medium"
          >
            Open in Maps <ChevronRight className="w-3 h-3" />
          </a>
        </div>

        {/* Iframe map */}
        <div className="relative">
          <iframe
            src={mapSrc}
            width="100%"
            height="320"
            style={{ border: 0, display: "block" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Office Location"
          />
          {/* Brand overlay pin */}
          <div className="absolute bottom-4 right-4 bg-brand-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
            <MapPin className="w-3 h-3" />
            Test15 HQ
          </div>
        </div>

        {/* Map footer */}
        <div className="bg-brand-50 border-t border-brand-100 px-5 py-2.5 flex items-center gap-4 text-xs text-brand-700">
          <span className="flex items-center gap-1"><span className="w-2 h-2 bg-brand-600 rounded-full inline-block" /> Reforma 333</span>
          <span className="text-brand-400">|</span>
          <span>Col. Cuauhtémoc, 06500</span>
          <span className="text-brand-400">|</span>
          <span>Mexico City</span>
        </div>
      </div>

      {/* ── WEATHER WIDGET ── */}
      <div className="rounded-2xl overflow-hidden border-2 border-brand-200 shadow-lg shadow-brand-100/50">
        {/* Weather header */}
        <div className="bg-brand-600 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <Thermometer className="w-4 h-4" />
            <span className="text-sm font-semibold">Live Weather — CDMX</span>
          </div>
          <div className="flex items-center gap-2">
            {/* Unit toggle */}
            <div className="flex items-center bg-brand-700/60 rounded-full p-0.5 text-xs font-semibold">
              <button
                onClick={() => setUnit("C")}
                className={`px-3 py-1 rounded-full transition-all ${
                  unit === "C"
                    ? "bg-white text-brand-700"
                    : "text-brand-200 hover:text-white"
                }`}
              >
                °C
              </button>
              <button
                onClick={() => setUnit("F")}
                className={`px-3 py-1 rounded-full transition-all ${
                  unit === "F"
                    ? "bg-white text-brand-700"
                    : "text-brand-200 hover:text-white"
                }`}
              >
                °F
              </button>
            </div>
            {/* Refresh */}
            <button
              onClick={() => fetchWeather(true)}
              disabled={refreshing}
              className="text-brand-200 hover:text-white transition-colors disabled:opacity-50"
              aria-label="Refresh weather"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {loading ? (
          /* Skeleton */
          <div className="bg-white p-6 animate-pulse space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl" />
              <div className="space-y-2 flex-1">
                <div className="h-8 bg-gray-100 rounded w-32" />
                <div className="h-4 bg-gray-100 rounded w-48" />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[1,2,3,4].map(i => <div key={i} className="h-16 bg-gray-100 rounded-xl" />)}
            </div>
          </div>
        ) : (
          <div className="bg-white">
            {/* Current / selected hour panel */}
            <div className="px-5 py-5 bg-gradient-to-br from-brand-50 to-white border-b border-brand-100">
              <div className="flex items-start justify-between gap-4">
                {/* Main temp */}
                <div className="flex items-center gap-4">
                  <div className="text-5xl leading-none">{displayed?.emoji}</div>
                  <div>
                    <div className="text-4xl font-extrabold text-brand-700 leading-none">
                      {formatTemp(displayed?.temp ?? 22, unit)}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Feels like {formatTemp(displayed?.feels_like ?? 20, unit)}
                    </div>
                    <div className="text-sm font-medium text-gray-700 mt-0.5">
                      {displayed?.description}
                      {selectedHour !== null && (
                        <span className="ml-2 text-xs text-brand-500 font-semibold bg-brand-50 px-2 py-0.5 rounded-full">
                          +{selectedHour + 1}h
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-right">
                  <div className="flex items-center justify-end gap-1.5 text-gray-600">
                    <span>{displayed?.humidity}%</span>
                    <Droplets className="w-3.5 h-3.5 text-brand-400" />
                  </div>
                  <div className="flex items-center justify-end gap-1.5 text-gray-600">
                    <span>{displayed?.wind_speed} km/h</span>
                    <Wind className="w-3.5 h-3.5 text-brand-400" />
                  </div>
                  <div className="text-xs text-gray-400 text-right">Humidity</div>
                  <div className="text-xs text-gray-400 text-right">Wind</div>
                  <div className="flex items-center justify-end gap-1.5 text-gray-600">
                    <span>{displayed?.visibility} km</span>
                    <Eye className="w-3.5 h-3.5 text-brand-400" />
                  </div>
                  <div />
                  <div className="text-xs text-gray-400 text-right">Visibility</div>
                  <div />
                </div>
              </div>
            </div>

            {/* Hourly forecast strip */}
            <div className="px-5 py-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Next 6 Hours — tap to inspect
              </p>
              <div className="grid grid-cols-6 gap-2">
                {weather?.hourly.map((h, i) => (
                  <button
                    key={i}
                    onClick={() =>
                      setSelectedHour(selectedHour === i ? null : i)
                    }
                    className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all text-center ${
                      selectedHour === i
                        ? "bg-brand-600 border-brand-600 text-white shadow-md shadow-brand-600/30"
                        : "bg-white border-gray-100 hover:border-brand-300 hover:bg-brand-50 text-gray-700"
                    }`}
                  >
                    <span className={`text-xs font-semibold ${selectedHour === i ? "text-brand-100" : "text-gray-400"}`}>
                      +{i + 1}h
                    </span>
                    <span className="text-lg leading-none">{h.emoji}</span>
                    <span className={`text-xs font-bold ${selectedHour === i ? "text-white" : "text-gray-800"}`}>
                      {formatTemp(h.temp, unit)}
                    </span>
                    <span className={`text-xs ${selectedHour === i ? "text-brand-200" : "text-gray-400"}`}>
                      {h.humidity}%
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-gray-50 flex items-center justify-between">
              <span className="text-xs text-gray-400">
                Updated {weather ? new Date(weather.updated_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--:--"}
              </span>
              <button
                onClick={() => setSelectedHour(null)}
                className={`text-xs font-medium transition-colors ${selectedHour !== null ? "text-brand-600 hover:text-brand-700" : "text-gray-300 cursor-default"}`}
                disabled={selectedHour === null}
              >
                Back to current
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}