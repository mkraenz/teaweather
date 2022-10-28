// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import {
  OpenWeatherForecast,
  OpenWeatherLocation,
} from "../../src/api/openweathermap.interface";
import { WeatherData } from "../../src/components/interfaces";

type Data = {
  weather: WeatherData;
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

const Berlin = { longitude: 13.3888599, latitude: 52.5170365 };
const locationsCache: Map<string, { longitude: number; latitude: number }> =
  new Map();
locationsCache.set("berlin", Berlin);

/** Retrieves weather from https://openweathermap.org/forecast5.
 * Default location is Berlin, Berlin, DE
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  console.log(locationsCache.size);
  const openWeatherApiKey = process.env.OPENWEATHERMAP_API_KEY;
  if (!openWeatherApiKey)
    throw new Error("Missing env var OPENWEATHERMAP_API_KEY");

  const lat = req.query["lat"];
  const lon = req.query["lon"];

  let location: { longitude: number; latitude: number };

  if (lat && lon && typeof lat === "string" && typeof lon === "string") {
    location = { longitude: parseFloat(lon), latitude: parseFloat(lat) };
  } else {
    const city = req.query["city"];
    const country = req.query["countryCode"];
    location = await getLocation(openWeatherApiKey, city, country);
  }

  const url = new URL("https://api.openweathermap.org/data/2.5/forecast");
  url.searchParams.append("lat", location.latitude.toString());
  url.searchParams.append("lon", location.longitude.toString());

  // url.searchParams.append("lat", "34.6937");
  // url.searchParams.append("lon", "135.5023");
  url.searchParams.append("appId", openWeatherApiKey);
  const apiRes = await fetch(url.toString());
  if (!apiRes.ok) {
    // TODO handle error
  }
  const json: OpenWeatherForecast = await apiRes.json();

  // const data: WeatherData = {
  //   location: "London, UK",
  //   time: "Wednesday, 14:00",
  //   description: "Mostly sunny",
  //   weatherTypeId: 800,
  //   temperature: 20,
  //   temperatureUnit: "°C",
  //   humidity: 50,
  //   humidityUnit: "%",
  //   pressure: 1000,
  //   pressureUnit: "hPa",
  //   wind: 10,
  //   windUnit: "km/h",
  //   windDirection: "N",
  //   precipitationProbabilityInPercent: 10,
  // };
  const entry = json.list[0];
  const weather: WeatherData = {
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
  };

  // TODO add login https://auth0.com/docs/quickstart/webapp/nextjs/01-login
  res.status(200).json({ weather });
}

/** default location: Berlin, Berlin, DE
 * TODO consider using https://simplemaps.com/data/world-cities
 */
const getLocation = async (
  openWeatherApiKey: string,
  rawCity: string | string[] | undefined,
  countryCode: string | string[] | undefined = "de"
): Promise<{ longitude: number; latitude: number }> => {
  if (!rawCity || typeof rawCity !== "string") return Berlin;
  const city = rawCity.toLowerCase().trim();
  if (!city) return Berlin;
  if (locationsCache.has(city)) return locationsCache.get(city)!;

  // see https://openweathermap.org/api/geocoding-api
  const url = new URL("http://api.openweathermap.org/geo/1.0/direct");
  url.searchParams.append("q", `${city},${countryCode}`);
  url.searchParams.append("limit", "5");
  url.searchParams.append("appId", openWeatherApiKey);

  const locationRes = await fetch(url.toString());
  if (!locationRes.ok) {
    // TODO handle error
  }
  const json: OpenWeatherLocation[] = await locationRes.json();
  const bestMatch = json[0];
  if (!bestMatch) return Berlin; // TODO maybe notify client that location was not found

  const location = { longitude: bestMatch.lon, latitude: bestMatch.lat };
  locationsCache.set(city, location);
  return location;
};
