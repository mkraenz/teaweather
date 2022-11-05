import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  createHandler,
  Delete,
  Get,
  Param,
  Req,
  Res,
} from "next-api-decorators";
import UserRepository from "../../../src/api/db/user-repository";
import getUser from "../../../src/api/get-user";

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
    if (existingUser) {
      return {
        location: existingUser.locations.find((l) => l.id === id) || null,
      };
    }
    return { location: null };
  }

  // @Post()
  // @HttpCode(201)
  // public async add(@Req() req: NextApiRequest, @Res() res: NextApiResponse) {
  // TODO
  // }

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
}
export type LocationsHandlerType = LocationsHandler;

export default withApiAuthRequired(createHandler(LocationsHandler));
