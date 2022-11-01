// api/signup.js
import { handleLogin } from "@auth0/nextjs-auth0";
import type { NextApiRequest, NextApiResponse } from "next";

/** following https://github.com/auth0/nextjs-auth0/blob/main/EXAMPLES.md#add-a-signup-handler */
export default async function signup(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await handleLogin(req, res, {
      authorizationParams: {
        // Note that this can be combined with prompt=login , which indicates if
        // you want to always show the authentication page or you want to skip
        // if there’s an existing session.
        screen_hint: "signup",
      },
    });
  } catch (error) {
    const e = error as { status?: number; message: string };
    res.status(e.status || 400).end(e.message);
  }
}
