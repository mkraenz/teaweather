// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import type { NextApiRequest, NextApiResponse } from "next";
import UserRepository from "../../../src/api/db/user-repository";
import type { ILocation } from "../../../src/api/domain/Location";
import getUser from "../../../src/api/get-user";

type ErrorData = { message: string };

export type GetAllLocationsResponse200Data = { locations: ILocation[] };

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetAllLocationsResponse200Data | ErrorData>
) {
  if (req.method !== "GET")
    return res.status(405).json({ message: "Method not allowed" });

  const user = getUser(req, res);
  const id = user.sub;

  const users = new UserRepository();
  const existingUser = await users.get(id);
  if (existingUser) {
    return res.json({ locations: existingUser.locations });
  }
  return res.json({ locations: [] });
}
export default withApiAuthRequired(handler);
