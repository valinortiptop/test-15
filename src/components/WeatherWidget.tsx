// @ts-nocheck
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

const FALLBACK_WEATHER: WeatherData = {
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
    { time: "+1h", temp: 23, feels_like: 21, humidity: 53, wind_speed: 13, visibility: 1