// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // TODO include https://openweathermap.org/api
  // TODO get ip https://ipapi.co/free/
  // TODO add login https://auth0.com/docs/quickstart/webapp/nextjs/01-login 
  res.status(200).json({ name: "John Doe" });
}
