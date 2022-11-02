interface Location {
  city?: string;
  countryCode?: string;
  lat: number;
  lon: number;
}
export interface DatabaseUserInput {
  userId: string;
  locations: Location[];
}

export const upsertDatabaseUser = async (data: DatabaseUserInput) => {
  const apiBase = process.env.AWS_BACKEND_URL;
  const apiKey = process.env.AWS_BACKEND_API_KEY;
  if (!apiBase || !apiKey) throw new Error("Environment variable not set.");

  const apiRes = await fetch(`${apiBase}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify(data),
  });
  if (!apiRes.ok) {
    // todo handle errors
  }
  // the api always returns 200 even in error cases. so we only need to handle network errors
};
