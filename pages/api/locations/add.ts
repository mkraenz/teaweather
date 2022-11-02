// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import type { NextApiRequest, NextApiResponse } from "next";
import { getDatabaseUser } from "../../../src/api/get-database-user";
import getLocation from "../../../src/api/get-location";
import { upsertDatabaseUser } from "../../../src/api/upsert-database-user";
import { WeatherData } from "../../../src/components/interfaces";

type CityInput = { city: string; country: string };
type Point = { lat: number; lon: number };
type City = { city: string; country: string } & Point;
// TODO maybe include a custom name property
type Location = City | Point;

type Data = {
  location: Location;
  weather: WeatherData;
};
type ErrorData = { message: string };

const getUser = (req: NextApiRequest, res: NextApiResponse) => {
  const session = getSession(req, res);
  if (!session)
    throw new Error(
      "No session. Did you forget to wrap the handler function in withApiAuthRequired?"
    );
  const { user } = session;
  return user;
};

const isCityInput = (body: Partial<CityInput | Point>): body is CityInput => {
  return (
    "city" in body &&
    typeof body.city === "string" &&
    body.city !== "" &&
    "country" in body &&
    typeof body.country === "string" &&
    body.country !== ""
  );
};

const isPointInput = (body: Partial<CityInput | Point>): body is Point => {
  return (
    "lat" in body &&
    typeof body.lat === "number" &&
    body.lat <= 90 &&
    body.lat >= -90 &&
    "lon" in body &&
    typeof body.lon === "number" &&
    body.lon <= 180 &&
    body.lon >= -180
  );
};

const log = (message: string, obj?: any) => {
  if (obj) console.log(`locations/add: ${message}`, JSON.stringify(obj));
  else console.log(`locations/add: ${message}`);
};

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | ErrorData>
) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  let body: Partial<CityInput | Point>;
  try {
    body = JSON.parse(req.body);
  } catch (error) {
    return res.status(400).json({ message: "Invalid body. Not a JSON" });
  }
  if (!body || typeof body !== "object")
    return res.status(400).json({ message: "Missing body" });
  if (!isCityInput(body) && !isPointInput(body))
    return res.status(400).json({ message: "Invalid body" });

  const user = getUser(req, res);
  const id = user.sub;

  let location: { longitude: number; latitude: number };
  if (isCityInput(body)) {
    log("found city input. getting location from city...");
    const openWeatherApiKey = process.env.OPENWEATHERMAP_API_KEY;
    if (!openWeatherApiKey)
      throw new Error("Missing env var OPENWEATHERMAP_API_KEY");
    location = await getLocation(openWeatherApiKey, body.city, body.country);
    log("got location from city. location:", JSON.stringify(location));
  } else {
    log("found point input. TODO getting city from coordinates...");
    location = { longitude: body.lon, latitude: body.lat };
    // TODO lookup city name and country (e.g. via weather api)
  }
  const existingUser = await getDatabaseUser(id);

  if (existingUser)
    log(
      "found existing user. current locations count",
      existingUser.locations.length
    );
  else log("no existing user found");

  const upsert = {
    userId: id,
    locations: [
      ...(existingUser?.locations || []),
      {
        lat: location.latitude,
        lon: location.longitude,
        ...(isCityInput(body)
          ? {
              city: body.city,
              country: body.country,
            }
          : {}),
      },
    ],
  };
  await upsertDatabaseUser(upsert);
  log("upserted user");

  return res.status(201).json({
    location: {
      city: "TODO",
      country: "TODO",
      lat: location.latitude,
      lon: location.longitude,
    },
    weather: {
      temperature: 20,
      description: "sunny",
      windDirection: "N",
      wind: 10,
      windUnit: "m/s",
      humidityUnit: "%",
      humidity: 50,
      pressureUnit: "hPa",
      pressure: 1000,
      precipitationProbabilityInPercent: 0,
      location: "Berlin, DE",
      time: new Date().toISOString(),
      temperatureUnit: "°C",
      weatherTypeId: 800,
    },
  });
}
export default withApiAuthRequired(handler);
