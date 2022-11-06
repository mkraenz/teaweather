import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  Body,
  createHandler,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Req,
  Res,
} from "next-api-decorators";
import UserRepository from "../../../src/api/db/user-repository";
import { Location } from "../../../src/api/domain/Location";
import { Env } from "../../../src/api/env";
import getCurrentWeather from "../../../src/api/get-current-weather";
import getLocation from "../../../src/api/get-location";
import getUser from "../../../src/api/get-user";
import { AddLocationDto } from "../../../src/api/locations/add-location.input.dto";
import { ZodValidationPipe } from "../utils/ZodValidationPipe";

const log = (message: string, obj?: any) => {
  if (obj) console.log(`LocationsHandler: ${message}`, JSON.stringify(obj));
  else console.log(`LocationsHandler: ${message}`);
};

class LocationsHandler {
  private users = new UserRepository();

  @Get()
  public async find(@Req() req: NextApiRequest, @Res() res: NextApiResponse) {
    // TODO move into middleware
    const user = getUser(req, res);
    const id = user.sub;

    const existingUser = await this.users.get(id);
    if (existingUser) {
      return { locations: existingUser.locations };
    }
    return { locations: [] };
  }

  @Get("/:id")
  public async findOne(
    @Req() req: NextApiRequest,
    @Res() res: NextApiResponse,
    @Param("id") id: string
  ) {
    const user = getUser(req, res);
    const userId = user.sub;
    const existingUser = await this.users.get(userId);
    const location = existingUser?.locations.find((l) => l.id === id);
    if (existingUser && location) return { location };
    throw new NotFoundException("User or location on user not found");
  }

  @Post()
  @HttpCode(201)
  public async add(
    @Req() req: NextApiRequest,
    @Res() res: NextApiResponse,
    @Body(ZodValidationPipe(AddLocationDto)) body: AddLocationDto
  ) {
    const loc = await this.getLocationFromInput(body);

    const user = getUser(req, res);
    const id = user.sub;

    await this.users.upsertAndPrependLocation(id, loc);

    const weather = await getCurrentWeather(
      loc.toLongLocation(),
      Env.openWeatherApiKey
    );

    return {
      location: loc.toJSON(),
      weather,
    };
  }

  @Delete("/:id")
  public async delete(
    @Req() req: NextApiRequest,
    @Res() res: NextApiResponse,
    @Param("id") id: string
  ) {
    const user = getUser(req, res);
    const userId = user.sub;
    const existingUser = await this.users.get(userId);
    if (!existingUser) return;

    await this.users.removeLocation(userId, id);
  }

  private async getLocationFromInput(body: AddLocationDto) {
    let location: { longitude: number; latitude: number };
    if ("city" in body && "countryCode" in body) {
      log("found city input. getting location from city...");
      location = await getLocation(
        Env.openWeatherApiKey,
        body.city,
        body.countryCode
      );
      log("got location from city. location:", JSON.stringify(location));
      return new Location({
        lat: location.latitude,
        lon: location.longitude,
        city: body.city,
        countryCode: body.countryCode,
        customName: body.customName,
      });
    } else {
      log("found point input.");
      return new Location({
        lat: body.lon,
        lon: body.lat,
        city: null,
        countryCode: null,
        customName: body.customName,
      });
      // TODO lookup city name and country (e.g. via weather api)
    }
  }
}
export type LocationsHandlerType = LocationsHandler;

export default withApiAuthRequired(createHandler(LocationsHandler));
