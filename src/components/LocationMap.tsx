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
          action: "chat",
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `You are a weather API. Return ONLY valid JSON representing current and hourly weather for Mexico City. Do NOT wrap in markdown \`\`\`json blocks.
Format exactly like this:
{
  "location": "Paseo de la Reforma 333, CDMX",
  "updated_at": "${new Date().toISOString()}",
  "current": { "time": "Now", "temp": 22, "feels_like": 20, "humidity": 55, "wind_speed": 14, "visibility": 10, "description": "Partly cloudy", "emoji": "⛅" },
  "hourly": [
    { "time": "+1h", "temp": 23, "feels_like": 21, "humidity": 53, "wind_speed": 13, "visibility": 10, "description": "Partly cloudy", "emoji": "⛅" }
    // EXACTLY 6 hourly items total
  ]
}`
            }
          ]
        },
      });

      if (!error && data?.choices?.[0]?.message?.content) {
        const content = data.choices[0].message.content;
        const jsonStr = content.replace(/