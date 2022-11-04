// TODO refactor code to use this
export const Env = {
  openWeatherApiKey: process.env.OPENWEATHERMAP_API_KEY!,
  baseUrl: process.env.BASE_URL!,
};

if (!Env.openWeatherApiKey)
  throw new Error("Missing env var OPENWEATHERMAP_API_KEY");
if (!Env.baseUrl) throw new Error("Missing env var BASE_URL");
