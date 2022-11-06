import { BadRequestException } from "next-api-decorators";
import type {
  ParameterPipe,
  PipeMetadata,
} from "next-api-decorators/dist/pipes/ParameterPipe";
import type { z } from "zod";

/** Validates and transforms using a given ZodSchema.. */
export function ZodValidationPipe<T extends z.ZodSchema>(
  schema: T,
  options?: {}
): ParameterPipe<z.infer<T>> {
  return (value: any, metadata?: PipeMetadata) => {
    const parsed = schema.safeParse(value);
    if (parsed.success) return parsed.data;

    throw new BadRequestException(
      `Validation failed${
        metadata?.name ? ` for ${metadata.name}` : ""
      } with error: ${parsed.error.message}`
    );
  };
}
