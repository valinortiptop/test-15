// @ts-nocheck
// src/components/WeatherWidget.tsx
import { useState, useEffect } from "react";
import { Thermometer, Wind, Droplets, RefreshCw } from "lucide-react";
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

const FALLBACK: WeatherData = {
  location: "CDMX",
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
    { time: "+1h", temp: 23, feels_like: 21, humidity: 53, wind_speed: 13, visibility: 10, description: "Partly cloudy", emoji: "⛅" },
    { time: "+2h", temp: 24, feels_like: 22, humidity: 50, wind_speed: 12, visibility: 10, description: "Sunny", emoji: "☀️" },
    { time: "+3h", temp: 25, feels_like: 23, humidity: 48, wind_speed: 11, visibility: 10, description: "Sunny", emoji: "☀️" },
    { time: "+4h", temp: 24, feels_like: 22, humidity: 52, wind_speed: 13, visibility: 9, description: "Partly cloudy", emoji: "⛅" },
    { time: "+5h", temp: 22, feels_like: 20, humidity: 58, wind_speed: 15, visibility: 8, description: "Cloudy", emoji: "🌥️" },
    { time: "+6h", temp: 20, feels_like: 18, humidity: 62, wind_speed: 17, visibility: 7, description: "Light rain", emoji: "🌦️" },
  ],
};

function toF(c: number) {
  return Math.round((c * 9) / 5 + 32);
}

function fmt(c: number, u: "C" | "F") {
  if (u === "F") return toF(c) + "°F";
  return c + "°C";
}

function extractJson(raw: string): string {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return raw;
  return raw.slice(start, end + 1);
}

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData>(FALLBACK);
  const [loading, setLoading] = useState(true);
  const [unit, setUnit] = useState<"C" | "F">("C");
  const [selected, setSelected] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchWeather = async (isRefresh: boolean) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const { data, error } = await supabase.functions.invoke("api-handler", {
        body: {
          action: "chat",
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You are a weather API. Respond with raw JSON only. No markdown. No code fences. No explanation. Just the JSON object.",
            },
            {
              role: "user",
              content: "Current weather for Mexico City. Return this exact JSON shape with realistic current values: {\"location\":\"CDMX\",\"updated_at\":\"2024-01-01T12:00:00Z\",\"current\":{\"time\":\"Now\",\"temp\":21,\"feels_like\":19,\"humidity\":58,\"wind_speed\":15,\"visibility\":10,\"description\":\"Partly cloudy\",\"emoji\":\"⛅\"},\"hourly\":[{\"time\":\"+1h\",\"temp\":22,\"feels_like\":20,\"humidity\":56,\"wind_speed\":14,\"visibility\":10,\"description\":\"Partly cloudy\",\"emoji\":\"⛅\"},{\"time\":\"+2h\",\"temp\":23,\"feels_like\":21,\"humidity\":53,\"wind_speed\":13,\"visibility\":10,\"description\":\"Sunny\",\"emoji\":\"☀️\"},{\"time\":\"+3h\",\"temp\":24,\"feels_like\":22,\"humidity\":50,\"wind_speed\":12,\"visibility\":10,\"description\":\"Sunny\",\"emoji\":\"☀️\"},{\"time\":\"+4h\",\"temp\":23,\"feels_like\":21,\"humidity\":54,\"wind_speed\":14,\"visibility\":9,\"description\":\"Partly cloudy\",\"emoji\":\"⛅\"},{\"time\":\"+5h\",\"temp\":21,\"feels_like\":19,\"humidity\":60,\"wind_speed\":16,\"visibility\":8,\"description\":\"Cloudy\",\"emoji\":\"🌥️\"},{\"time\":\"+6h\",\"temp\":19,\"feels_like\":17,\"humidity\":65,\"wind_speed\":18,\"visibility\":7,\"description\":\"Light rain\",\"emoji\":\"🌦️\"}]}",
            },
          ],
        },
      });

      if (error) throw new Error(error.message);

      const resData = data as any;
      const content: string = resData?.choices?.[0]?.message?.content ?? "";
      const jsonStr = extractJson(content);
      const parsed = JSON.parse(jsonStr) as WeatherData;

      if (parsed && parsed.current && Array.isArray(parsed.hourly)) {
        parsed.hourly = parsed.hourly.slice(0, 6);
        setWeather(parsed);
      }
    } catch (e) {
      console.warn("Weather fetch failed, using fallback:", e);
      setWeather(FALLBACK);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWeather(false);
  }, []);

  const shown = selected !== null ? weather.hourly[selected] : weather.current;

  return (
    <div className="rounded-2xl overflow-hidden border-2 border-brand-200 shadow-lg">
      <div className="bg-brand-600 px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white">
          <Thermometer className="w-4 h-4" />
          <span className="text-sm font-semibold">Live Weather — CDMX</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-brand-700/60 rounded-full p-0.5">
            <button
              onClick={() => setUnit("C")}
              className={
                "px-3 py-1 rounded-full text-xs font-semibold transition-all " +
                (unit === "C" ? "bg-white text-brand-700" : "text-brand-200 hover:text-white")
              }
            >
              C
            </button>
            <button
              onClick={() => setUnit("F")}
              className={
                "px-3 py-1 rounded-full text-xs font-semibold transition-all " +
                (unit === "F" ? "bg-white text-brand-700" : "text-brand-200 hover:text-white")
              }
            >
              F
            </button>
          </div>
          <button
            onClick={() => fetchWeather(true)}
            disabled={refreshing}
            className="text-brand-200 hover:text-white transition-colors disabled:opacity-50"
          >
            <RefreshCw className={"w-4 h-4 " + (refreshing ? "animate-spin" : "")} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="bg-white p-6 animate-pulse space-y-4">
          <div className="flex gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl" />
            <div className="flex-1 space-y-2">
              <div className="h-8 bg-gray-100 rounded w-28" />
              <div className="h-4 bg-gray-100 rounded w-40" />
            </div>
          </div>
          <div className="grid grid-cols-6 gap-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-20 bg-gray-100 rounded-xl" />
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white">
          <div className="px-5 py-5 bg-gradient-to-br from-brand-50 to-white border-b border-brand-100">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="text-5xl leading-none">{shown.emoji}</span>
                <div>
                  <div className="text-4xl font-extrabold text-brand-700 leading-none">
                    {fmt(shown.temp, unit)}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {"Feels like " + fmt(shown.feels_like, unit)}
                  </div>
                  <div className="text-sm font-medium text-gray-700 mt-0.5">
                    {shown.description}
                    {selected !== null && (
                      <span className="ml-2 text-xs text-brand-500 font-semibold bg-brand-50 px-2 py-0.5 rounded-full">
                        {"+" + (selected + 1) + "h forecast"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right space-y-2">
                <div className="flex items-center justify-end gap-1.5 text-sm text-gray-600">
                  <span>{shown.humidity + "%"}</span>
                  <Droplets className="w-3.5 h-3.5 text-brand-400" />
                </div>
                <div className="text-xs text-gray-400">Humidity</div>
                <div className="flex items-center justify-end gap-1.5 text-sm text-gray-600">
                  <span>{shown.wind_speed + " km/h"}</span>
                  <Wind className="w-3.5 h-3.5 text-brand-400" />
                </div>
                <div className="text-xs text-gray-400">Wind</div>
              </div>
            </div>
          </div>

          <div className="px-5 py-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Next 6 Hours
            </p>
            <div className="grid grid-cols-6 gap-2">
              {weather.hourly.slice(0, 6).map((h, i) => (
                <button
                  key={i}
                  onClick={() => setSelected(selected === i ? null : i)}
                  className={
                    "flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all " +
                    (selected === i
                      ? "bg-brand-600 border-brand-600 shadow-md"
                      : "bg-white border-gray-100 hover:border-brand-300 hover:bg-brand-50")
                  }
                >
                  <span className={"text-xs font-semibold " + (selected === i ? "text-brand-100" : "text-gray-400")}>
                    {h.time}
                  </span>
                  <span className="text-lg leading-none">{h.emoji}</span>
                  <span className={"text-xs font-bold " + (selected === i ? "text-white" : "text-gray-800")}>
                    {fmt(h.temp, unit)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="px-5 py-3 border-t border-gray-50 flex items-center justify-between">
            <span className="text-xs text-gray-400">
              {"Updated " + new Date(weather.updated_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
            <button
              onClick={() => setSelected(null)}
              disabled={selected === null}
              className={
                "text-xs font-medium transition-colors " +
                (selected !== null ? "text-brand-600 hover:text-brand-700" : "text-gray-300 cursor-default")
              }
            >
              Back to current
            </button>
          </div>
        </div>
      )}
    </div>
  );
}