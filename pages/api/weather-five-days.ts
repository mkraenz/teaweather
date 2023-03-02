// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { Env } from "../../src/api/env";
import getFiveDayWeather from "../../src/api/get-five-day-weather";
import getLocation from "../../src/api/get-location";
import type { WeatherData } from "../../src/components/interfaces";

type Data = {
  weathers: WeatherData[];
};

const Location = z.object({
  longitude: z.number().min(-180).max(180),
  latitude: z.number().min(-90).max(90),
});

/**
 * Retrieves the weather for the next 5 days in 3 hour steps.
 * Retrieves weather from https://openweathermap.org/forecast5.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { openWeatherApiKey } = Env;
  // Consider unifying most of the code in this function with the code in weather-current.ts, and migrating to next-api-decorators
  const lat = req.query["lat"];
  const lon = req.query["lon"];

  let location: { longitude: number; latitude: number };

  const locationIsProvided =
    lat && lon && typeof lat === "string" && typeof lon === "string";
  if (locationIsProvided) {
    const validator = Location.safeParse({
      longitude: parseFloat(lon),
      latitude: parseFloat(lat),
    });
    if (validator.success) {
      location = validator.data;
    } else {
      // we have to return some data here for nextjs to send a response.
      // clients should ignore the return value anyway for a 400 response
      return res.status(400).json({ weathers: [] });
    }
  } else {
    const city = req.query["city"];
    const country = req.query["countryCode"];
    location = await getLocation(openWeatherApiKey, city, country);
  }

  const weathers = await getFiveDayWeather(location, Env.openWeatherApiKey);

  return res.status(200).json({ weathers });
}
