// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import getCurrentWeather from "../../src/api/get-current-weather";
import getLocation from "../../src/api/get-location";
import { WeatherData } from "../../src/components/interfaces";
import { Env } from "./env";

type Data = {
  weather: WeatherData;
};

/**
 * Retrieves weather from https://openweathermap.org/forecast5.
 * Default location is Berlin, Berlin, DE
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { openWeatherApiKey } = Env;
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

  const weather = await getCurrentWeather(location, openWeatherApiKey);
  return res.status(200).json({ weather });
}
