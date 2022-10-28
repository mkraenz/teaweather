/**
 * Builds the URL route pointing to our API routes. Uses either the location cookie (if available) or falls back to Berlin, DE */
export const getLocationUrl = (
  cookies: string,
  baseUrl: string,
  apiRoute: string
) => {
  const locationCookieValue = cookies
    .split("teaweather-location=")[1]
    ?.split(";")[0];
  const defaultUrl = new URL(`${baseUrl}/api/${apiRoute}`);
  defaultUrl.searchParams.set("city", "Berlin");
  defaultUrl.searchParams.set("countryCode", "de");

  if (!locationCookieValue) return defaultUrl;

  try {
    const parsedLocation = JSON.parse(locationCookieValue);
    if (
      typeof parsedLocation.lat !== "number" &&
      typeof parsedLocation.lon !== "number"
    ) {
      throw new Error(
        "Invalid location cookie value. Somebody tried to hack us!"
      );
    }

    const locationBasedUrl = new URL(`${baseUrl}/api/${apiRoute}`);
    locationBasedUrl.searchParams.set("lat", parsedLocation.lat.toString());
    locationBasedUrl.searchParams.set("lon", parsedLocation.lon.toString());
    return locationBasedUrl;
  } catch (error) {
    console.error("Invalid location cookie value", locationCookieValue);
    console.error(error);
    // log the attempt and fallback to default location
    return defaultUrl;
  }
};
