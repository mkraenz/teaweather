// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import getFiveDayWeather from "../../src/api/get-five-day-weather";
import getLocation from "../../src/api/get-location";
import type { WeatherData } from "../../src/components/interfaces";
import { Env } from "./env";

type Data = {
  weathers: WeatherData[];
};

/**
 * Retrieves the weather for the next 5 days in 3 hour steps.
 * Retrieves weather from https://openweathermap.org/forecast5.
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

  const weathers = await getFiveDayWeather(location, Env.openWeatherApiKey);

  res.status(200).json({ weathers });
}
