import type { OpenWeatherLocation } from "./openweathermap.interface";

const Berlin = { longitude: 13.3888599, latitude: 52.5170365 };

/** default location: Berlin, Berlin, DE
 * TODO consider using https://simplemaps.com/data/world-cities
 * TODO consider putting AWS ApiGateway in front of api.openweathermap to enable caching
 */
const getLocation = async (
  openWeatherApiKey: string,
  rawCity: string | string[] | undefined,
  countryCode: string | string[] | undefined = "de"
): Promise<{ longitude: number; latitude: number }> => {
  if (!rawCity || typeof rawCity !== "string") return Berlin;
  const city = rawCity.toLowerCase().trim();
  if (!city) return Berlin;

  // see https://openweathermap.org/api/geocoding-api
  const url = new URL("http://api.openweathermap.org/geo/1.0/direct");
  url.searchParams.set("q", `${city},${countryCode}`);
  url.searchParams.set("limit", "5");
  url.searchParams.set("appId", openWeatherApiKey);

  const locationRes = await fetch(url.toString());
  if (!locationRes.ok) {
    // TODO handle error
  }
  const json: OpenWeatherLocation[] = await locationRes.json();
  const bestMatch = json[0];
  if (!bestMatch) return Berlin; // TODO maybe notify client that location was not found

  const location = { longitude: bestMatch.lon, latitude: bestMatch.lat };
  return location;
};

export default getLocation;
