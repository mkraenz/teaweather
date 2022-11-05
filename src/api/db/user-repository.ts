import type { Location } from "../domain/Location";
import { IUser, User } from "../domain/User";
import { escapeForOneTableUpdates, UsersDb } from "./db";

export class UserRepository {
  async get(id: string) {
    const user: IUser | undefined = await UsersDb.get({ id });
    return user ? new User(user) : undefined;
  }

  async upsert(user: Omit<IUser, "id"> & Partial<Pick<IUser, "id">>) {
    const { set, substitutions } = escapeForOneTableUpdates(user);
    await UsersDb.upsert({ id: user.id }, { set, substitutions });
  }

  async ensureUserExists(userId: string) {
    const user = await this.get(userId);
    if (!user) {
      await UsersDb.create({ id: userId, locations: [] });
    }
  }

  async upsertAndPrependLocation(userId: string, loc: Location) {
    const existingUser = await this.get(userId);
    if (existingUser) {
      await this.upsert({
        id: userId,
        locations: [loc.toJSON(), ...existingUser.locations],
      });
    } else {
      await this.upsert({
        id: userId,
        locations: [loc.toJSON()],
      });
    }
  }

  async removeLocation(userId: string, locId: string) {
    const existingUser = await this.get(userId);
    if (existingUser) {
      await this.upsert({
        id: userId,
        locations: existingUser.locations.filter((l) => l.id !== locId),
      });
    }
  }
}

export default UserRepository;
