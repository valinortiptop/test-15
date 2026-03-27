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
  current: { time: "Now", temp: 22, feels_like: 20, humidity: 55, wind_speed: 14, visibility: 10, description: "Partly cloudy", emoji: "⛅" },
  hourly: [
    { time: "+1h", temp: 23, feels_like: 21, humidity: 53, wind_speed: 13, visibility: 10, description: "Partly cloudy", emoji: "⛅" },
    { time: "+2h", temp: 24, feels_like: 22, humidity: 50, wind_speed: 12, visibility: 10, description: "Sunny", emoji: "☀️" },
    { time: "+3h", temp: 25, feels_like: 23, humidity: 48, wind_speed: 11, visibility: 10, description: "Sunny", emoji: "☀️" },
    { time: "+4h", temp: 24, feels_like: 22, humidity: 52, wind_speed: 13, visibility: 9, description: "Partly cloudy", emoji: "⛅" },
    { time: "+5h", temp: 22, feels_like: 20, humidity: 58, wind_speed: 15, visibility: 8, description: "Cloudy", emoji: "🌥️" },
    { time: "+6h", temp: 20, feels_like: 18, humidity: 62, wind_speed: 17, visibility: 7, description: "Light rain", emoji: "🌦️" },
  ],
};

function toF(c: number) { return Math.round((c * 9) / 5 + 32); }
function fmt(c: number, u: "C" | "F") { return u === "C" ? `${c}°C` : `${toF(c)}°F`; }

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData>(FALLBACK);
  const [loading, setLoading] = useState(true);
  const [unit, setUnit] = useState<"C" | "F">("C");
  const [selected, setSelected] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchWeather = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("api-handler", {
        body: {
          action: "chat",
          model: "gpt-4o-mini",
          messages: [
            {
              role: "user",
              content: `Return ONLY a valid JSON object (no markdown, no code blocks) for current weather in Mexico City with this exact shape:
{"location":"CDMX","updated_at":"${new Date().toISOString()}","current":{"time":"Now","temp":22,"feels_like":20,"humidity":55,"wind_speed":14,"visibility":10,"description":"Partly cloudy","emoji":"⛅"},"hourly":[{"time":"+1h","temp":23,"feels_like":21,"humidity":53,"wind_speed":13,"visibility":10,"description":"Partly cloudy","emoji":"⛅"},{"time":"+2h","temp":24,"feels_like":22,"humidity":50,"wind_speed":12,"visibility":10,"description":"Sunny","emoji":"☀️"},{"time":"+3h","temp":25,"feels_like":23,"humidity":48,"wind_speed":11,"visibility":10,"description":"Sunny","emoji":"☀️"},{"time":"+4h","temp":24,"feels_like":22,"humidity":52,"wind_speed":13,"visibility":9,"description":"Partly cloudy","emoji":"⛅"},{"time":"+5h","temp":22,"feels_like":20,"humidity":58,"wind_speed":15,"visibility":8,"description":"Cloudy","emoji":"🌥️"},{"time":"+6h","temp":20,"feels_like":18,"humidity":62,"wind_speed":17,"visibility":7,"description":"Light rain","emoji":"🌦️"}]}`
            }
          ],
        },
      });

      if (!error) {
        const raw = data as any;
        const content: string = raw?.choices?.[0]?.message?.content ?? "";
        const cleaned = content.replace(/