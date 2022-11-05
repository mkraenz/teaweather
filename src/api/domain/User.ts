import { ILocation, Location } from "./Location";

export interface IUser {
  id: string;
  locations: ILocation[];
}

export class User {
  public id: string;
  public locations: ILocation[];

  constructor(props: IUser) {
    this.id = props.id;
    this.locations = props.locations;
  }

  public toJSON(): IUser {
    return {
      id: this.id,
      locations: this.locations.map((l) =>
        l instanceof Location ? l.toJSON() : l
      ),
    };
  }
}
