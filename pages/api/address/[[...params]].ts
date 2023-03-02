import { uniqBy } from "lodash";
import {
  createHandler,
  Get,
  InternalServerErrorException,
  Query,
} from "next-api-decorators";
import { URL } from "url";
import { z } from "zod";
import { Env } from "../../../src/api/env";

const log = (message: string, obj?: any) => {
  if (obj) console.log(`AddressHandler: ${message}`, JSON.stringify(obj));
  else console.log(`AddressHandler: ${message}`);
};

const ArcgisCandidateDto = z.object({
  address: z.string(),
  location: z.object({
    x: z.number(),
    y: z.number(),
  }),
  score: z.number(),
  attributes: z.object({
    Type: z.string(),
    Place_addr: z.string(),
    PlaceName: z.string(),
    Country: z.string(),
    CntryName: z.string(),
  }),
});

export type IArcgisCandidateDto = z.infer<typeof ArcgisCandidateDto>;

/**
 * Since we simply pass the response from upstream to the client (with some properties stripped out),
 * this is both the arcgis API response data but also the GET DTO of our own API.
 * @see https://developers.arcgis.com/documentation/mapping-apis-and-services/search/geocoding/ for usage example
 * @see https://developers.arcgis.com/rest/geocode/api-reference/geocoding-find-address-candidates.htm for detailed API reference
 */
const ArcgisGeocodingResponseData = z.object({
  candidates: z.array(ArcgisCandidateDto),
});

class AddressHandler {
  private getFindAddressCandidatesUrl(address: string) {
    const url = new URL(
      "https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates"
    );
    url.searchParams.set("address", address);
    url.searchParams.set("token", Env.arcgisApiKey);
    url.searchParams.set("f", "json");
    url.searchParams.set(
      "outFields",
      "Type,Place_addr,PlaceName,Country,CntryName"
    ); // use "*" to include all fields
    return url;
  }

  @Get()
  public async find(@Query("address") address: string) {
    const url = this.getFindAddressCandidatesUrl(address);
    const response = await fetch(url.toString());
    if (!response.ok)
      throw new InternalServerErrorException(
        "Failed to fetch address from upstream."
      );

    const json = await response.json();
    // strip out unnecessary data for security and bandwidth. Also, ensures we have a valid response from upstream arcgis.
    const validator = ArcgisGeocodingResponseData.safeParse(json);
    if (!validator.success) {
      // this might be overkill. arcgis probably won't change their API without a major version bump or prior notification.
      log(
        "ERROR! Upstream Arcgis Geocoding API returned invalid data. We likely need to update our code!",
        { validationError: validator.error, upstreamResponseData: json }
      );
      throw new InternalServerErrorException(
        "Upstream API returned invalid data."
      );
    }

    const toKey = (address: { location: { x: number; y: number } }) =>
      `${address.location.x},${address.location.y}`;
    // the API sometimes returns candidates with identical location. filtering them out
    const uniqueCandidates = uniqBy(validator.data.candidates, toKey);
    return { candidates: uniqueCandidates };
  }
}

export type AddressHandlerType = AddressHandler;

export default createHandler(AddressHandler);
