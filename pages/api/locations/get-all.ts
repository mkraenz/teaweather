// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import type { NextApiRequest, NextApiResponse } from "next";
import { getDatabaseUser } from "../../../src/api/get-database-user";
import getUser from "../../../src/api/get-user";

type Point = { lat: number; lon: number };
type City = { city: string; country: string } & Point;
type Location = City | Point;
type ErrorData = { message: string };

export type GetAllLocationsResponse200Data = { locations: Location[] };

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetAllLocationsResponse200Data | ErrorData>
) {
  if (req.method !== "GET")
    return res.status(405).json({ message: "Method not allowed" });

  const user = getUser(req, res);
  const id = user.sub;

  const existingUser = await getDatabaseUser(id);
  if (existingUser) {
    return res.json({ locations: existingUser.locations });
  }
  return res.json({ locations: [] });
}
export default withApiAuthRequired(handler);
