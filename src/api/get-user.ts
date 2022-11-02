import { getSession } from "@auth0/nextjs-auth0";
import type { NextApiRequest, NextApiResponse } from "next";

const getUser = (req: NextApiRequest, res: NextApiResponse) => {
  const session = getSession(req, res);
  if (!session)
    throw new Error(
      "No session. Did you forget to wrap the handler function in withApiAuthRequired?"
    );
  const { user } = session;
  return user;
};

export default getUser;
