// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import type { NextApiRequest, NextApiResponse } from "next";
import UserRepository from "../../../src/api/db/user-repository";
import { ILocation, Location } from "../../../src/api/domain/Location";
import { Env } from "../../../src/api/env";
import getCurrentWeather from "../../../src/api/get-current-weather";
import getLocation from "../../../src/api/get-location";
import getUser from "../../../src/api/get-user";
import type { WeatherData } from "../../../src/components/interfaces";

type CityInput = { city: string; country: string };
type PointInput = { lat: number; lon: number };

export type AddResponseData = {
  location: ILocation;
  weather: WeatherData;
};
type ErrorData = { message: string };

const isCityInput = (
  body: Partial<CityInput | PointInput>
): body is CityInput => {
  return (
    "city" in body &&
    typeof body.city === "string" &&
    body.city !== "" &&
    "country" in body &&
    typeof body.country === "string" &&
    body.country !== ""
  );
};

const isPointInput = (
  body: Partial<CityInput | PointInput>
): body is PointInput => {
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

const getLocationFromInput = async (body: CityInput | PointInput) => {
  let location: { longitude: number; latitude: number };
  if (isCityInput(body)) {
    log("found city input. getting location from city...");
    location = await getLocation(
      Env.openWeatherApiKey,
      body.city,
      body.country
    );
    log("got location from city. location:", JSON.stringify(location));
  } else {
    log("found point input. TODO getting city from coordinates...");
    location = { longitude: body.lon, latitude: body.lat };
    // TODO lookup city name and country (e.g. via weather api)
  }
  return new Location({
    lat: location.latitude,
    lon: location.longitude,
    city: (body as any).city,
    countryCode: (body as any).country,
    customName: (body as any).customName,
  });
};

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AddResponseData | ErrorData>
) {
  // consider using Nextjs api decorators
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  let body: Partial<CityInput | PointInput>;
  // TODO redo validation using some framework like zod or nextjs api decorators
  try {
    body = typeof req.body === "object" ? req.body : JSON.parse(req.body);
  } catch (error) {
    return res.status(400).json({ message: "Invalid body. Not a JSON" });
  }
  if (!body || typeof body !== "object")
    return res.status(400).json({ message: "Missing body" });
  if (!isCityInput(body) && !isPointInput(body))
    return res.status(400).json({ message: "Invalid body" });

  const user = getUser(req, res);
  const id = user.sub;

  const loc = await getLocationFromInput(body);
  const users = new UserRepository();
  await users.upsertAndPrependLocation(id, loc);

  const weather = await getCurrentWeather(
    loc.toLongLocation(),
    Env.openWeatherApiKey
  );

  return res.status(201).json({
    location: loc.toJSON(),
    weather,
  });
}

export default withApiAuthRequired(handler);
