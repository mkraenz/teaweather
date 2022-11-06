import { AddLocationDto } from "./add-location.input.dto";

// TODO use a test runner
export const testAddLocationDto = () => {
  const shouldSucceedOnPoint = AddLocationDto.safeParse({
    lat: 1.8434,
    lon: 0,
    type: "point",
  });
  if (!shouldSucceedOnPoint.success) throw new Error("should succeed on point");

  const shouldSucceedOnPointWithCustomName = AddLocationDto.safeParse({
    lat: 1.8434,
    lon: 0,
    customName: "custom name",
    type: "point",
  });
  if (!shouldSucceedOnPointWithCustomName.success)
    throw new Error("should succeed on point with custom name");

  const shouldErrorOnEmpty = AddLocationDto.safeParse({});
  if (shouldErrorOnEmpty.success) throw new Error("should error on empty");

  const shouldSucceedOnCity = AddLocationDto.safeParse({
    city: "Berlin",
    countryCode: "DE",
    type: "city",
  });
  if (!shouldSucceedOnCity.success) throw new Error("should succeed on city");

  const shouldSucceedOnCityWithCustomName = AddLocationDto.safeParse({
    city: "Berlin",
    countryCode: "DE",
    customName: "Home",
    type: "city",
  });

  if (!shouldSucceedOnCityWithCustomName.success)
    throw new Error("should succeed on city with custom name");

  /** zod will pick out point props from this and make only the point props available under shouldSucceedOnTooManyButValidPoint.data */
  const shouldSucceedOnTooManyButValidPoint = AddLocationDto.safeParse({
    lat: 1.8434,
    lon: 0,
    city: "Berlin",
    countryCode: "DE",
    customName: "Home",
    type: "point",
  });
  if (!shouldSucceedOnTooManyButValidPoint.success)
    throw new Error("should succeed on too many but valid point");
};
