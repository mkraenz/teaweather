import type { NextApiRequest, NextApiResponse } from "next";
import {
  createHandler,
  Get,
  InternalServerErrorException,
  Query,
  Req,
  Res,
} from "next-api-decorators";
import { URL } from "url";
import { Env } from "../../../src/api/env";

class AddressHandler {
  @Get()
  public async find(
    @Req() req: NextApiRequest,
    @Res() res: NextApiResponse,
    @Query("address") address: string
  ) {
    const url = new URL(
      "https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates"
    );
    url.searchParams.set("address", address);
    url.searchParams.set("token", Env.arcgisApiKey);
    url.searchParams.set("f", "json");
    url.searchParams.set("outFields", "*");
    console.log("fetching from ", url.toString());
    const response = await fetch(url.toString());
    if (!response.ok)
      throw new InternalServerErrorException(
        "Failed to fetch address from upstream."
      );

    const json = await response.json();
    return { candidates: json?.candidates };
  }
}
export type LocationsHandlerType = AddressHandler;

export default createHandler(AddressHandler);
