interface Location {
  city?: string;
  countryCode?: string;
  lat: number;
  lon: number;
}
export interface DatabaseUser {
  userId: string;
  locations: Location[];
}

interface NotFoundError {
  error: "User not found";
}

export const getDatabaseUser = async (userId: string) => {
  const apiBase = process.env.AWS_BACKEND_URL;
  const apiKey = process.env.AWS_BACKEND_API_KEY;
  if (!apiBase || !apiKey) throw new Error("Environment variable not set.");

  const url = new URL(`${apiBase}/users/${userId}`);
  const res = await fetch(url.toString(), {
    headers: {
      "x-api-key": apiKey,
    },
  });
  // the api always returns 200 even if the user was not found
  if (!res.ok) {
    // TODO handle error
  }
  const user: DatabaseUser | NotFoundError = await res.json();
  if ("error" in user) return undefined;
  return user;
};
