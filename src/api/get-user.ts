import { getSession } from "@auth0/nextjs-auth0";

const getUser = (...args: Parameters<typeof getSession>) => {
  const session = getSession(...args);
  if (!session)
    throw new Error(
      "No session. Did you forget to wrap the handler function in withApiAuthRequired?"
    );
  const { user } = session;
  return user;
};

export default getUser;

export const maybeGetUser = (...args: Parameters<typeof getSession>) => {
  const session = getSession(...args);
  if (!session) return null;
  const { user } = session;
  return user;
};
