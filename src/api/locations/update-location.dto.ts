import { z } from "zod";

export const UpdateLocationDto = z.object({
  customName: z.string().nullable().optional(),
});

export type UpdateLocationDto = z.infer<typeof UpdateLocationDto>;
