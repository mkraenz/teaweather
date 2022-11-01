// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
  id: string;
};

function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const session = getSession(req, res);
  if (!session)
    throw new Error(
      "No session. Did you forget to wrap the handler function in withApiAuthRequired?"
    );
  const { user } = session;
  // TODO include https://openweathermap.org/api
  // TODO get ip https://ipapi.co/free/
  res.status(200).json({ name: "John Doe", id: user.sub });
}
export default withApiAuthRequired(handler);
