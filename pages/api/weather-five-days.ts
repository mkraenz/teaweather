// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { OpenWeatherForecast } from "../../src/api/openweathermap.interface";
import { WeatherData } from "../../src/components/interfaces";

type Data = {
  weathers: WeatherData[];
};

const windDegreesToDirection = (degrees: number): string => {
  degrees + 11.25;
  if (degrees > 337.5 || degrees < 11.25) return "N";
  if (degrees < 33.75) return "NNE";
  if (degrees < 56.25) return "NE";
  if (degrees < 78.75) return "ENE";
  if (degrees < 101.25) return "E";
  if (degrees < 123.75) return "ESE";
  if (degrees < 146.25) return "SE";
  if (degrees < 168.75) return "SSE";
  if (degrees < 191.25) return "S";
  if (degrees < 213.75) return "SSW";
  if (degrees < 236.25) return "SW";
  if (degrees < 258.75) return "WSW";
  if (degrees < 281.25) return "W";
  if (degrees < 303.75) return "WNW";
  if (degrees < 326.25) return "NW";
  if (degrees < 348.75) return "NNW";
  return "N";
};

/**
 * Retrieves the weather for the next 5 days in 3 hour steps.
 * Retrieves weather from https://openweathermap.org/forecast5.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const openWeatherApiKey = process.env.OPENWEATHERMAP_API_KEY;
  if (!openWeatherApiKey)
    throw new Error("Missing env var OPENWEATHERMAP_API_KEY");
  const url = new URL("https://api.openweathermap.org/data/2.5/forecast");

  url.searchParams.set("lat", "34.6937");
  url.searchParams.set("lon", "135.5023");
  url.searchParams.set("appId", openWeatherApiKey);
  const apiRes = await fetch(url.toString());
  if (!apiRes.ok) {
    // TODO handle error
  }
  const json: OpenWeatherForecast = await apiRes.json();

  const weathers: WeatherData[] = json.list.map((entry) => ({
    location: `${json.city.name}, ${json.city.country}`,
    time: new Date(entry.dt * 1000).toISOString(),
    temperature: Math.round(entry.main.temp - 273.15), // Kelvin to Celsius
    description: entry.weather[0].description,
    weatherTypeId: entry.weather[0].id,
    temperatureUnit: "°C",
    humidity: Math.round(entry.main.humidity),
    humidityUnit: "%",
    pressure: entry.main.pressure,
    pressureUnit: "hPa",
    wind: entry.wind.speed,
    windUnit: "m/s",
    windDirection: windDegreesToDirection(entry.wind.deg),
    precipitationProbabilityInPercent: Math.round(entry.pop * 100),
  }));

  res.status(200).json({ weathers });
}
