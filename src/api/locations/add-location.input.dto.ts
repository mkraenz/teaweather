import { z } from "zod";

export const AddLocationDto = z.discriminatedUnion("type", [
  z.object({
    lat: z.number(),
    lon: z.number(),
    customName: z.string().optional(),
    type: z.literal("point"),
  }),
  z.object({
    city: z.string(),
    countryCode: z.string(),
    customName: z.string().optional(),
    type: z.literal("city"),
  }),
]);

export type AddLocationDto = z.infer<typeof AddLocationDto>;
