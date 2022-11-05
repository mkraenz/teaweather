import { getRandomId } from "../db/db";
import type { OptionalId } from "../types";

export interface ILocation {
  id: string;
  lat: number;
  lon: number;
  city?: string | null;
  countryCode?: string | null;
  customName?: string | null;
}

export class Location {
  public id: string;
  public lat: number;
  public lon: number;
  public city?: string | null;
  public countryCode?: string | null;
  public customName?: string | null;

  constructor(props: OptionalId<ILocation>) {
    this.id = props.id || getRandomId(12);
    this.lat = props.lat;
    this.lon = props.lon;
    this.city = props.city;
    this.countryCode = props.countryCode;
    this.customName = props.customName;
  }

  public toJSON(): ILocation {
    return {
      id: this.id,
      lat: this.lat,
      lon: this.lon,
      city: this.city || null,
      countryCode: this.countryCode || null,
      customName: this.customName || null,
    };
  }

  public toLongLocation() {
    return {
      latitude: this.lat,
      longitude: this.lon,
    };
  }
}
