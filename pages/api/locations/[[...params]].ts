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
  Patch,
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
import { UpdateLocationDto } from "../../../src/api/locations/update-location.dto";
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
    if (!existingUser) throw new NotFoundException("User in DB not found"); // can happen if user only exists in auth0 but not in dynamodb. Though it's weird that the user calls this endpoint if he doesn't have any locations.

    await this.users.removeLocation(userId, id);
  }

  @Patch("/:id")
  public async updateLocation(
    @Req() req: NextApiRequest,
    @Res() res: NextApiResponse,
    @Param("id") id: string,
    @Body(ZodValidationPipe(UpdateLocationDto)) body: UpdateLocationDto
  ) {
    const x = 5;
    console.log(x);
    const user = getUser(req, res);
    const userId = user.sub;
    const existingUser = await this.users.get(userId);
    if (!existingUser) throw new NotFoundException("User in DB not found"); // can happen if user only exists in auth0 but not in dynamodb. Though it's weird that the user calls this endpoint if he doesn't have any locations.

    const location = existingUser.locations.find((l) => l.id === id);
    if (!location) throw new NotFoundException("Location not found");

    const updatedLocation = new Location(location);
    if (body.customName !== undefined)
      updatedLocation.customName = body.customName || null; // null in order to delete customName if it's an empty string
    const newLocations = existingUser.locations.map((l) =>
      l.id === id ? updatedLocation.toJSON() : l
    );
    existingUser.locations = newLocations;
    await this.users.upsert(existingUser);
  }

  private async getLocationFromInput(body: AddLocationDto) {
    let location: { longitude: number; latitude: number };
    if ("city" in body && "countryCode" in body) {
      log("found city input. getting location from city...");
      // TODO refactor: move this into the Location class?
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
