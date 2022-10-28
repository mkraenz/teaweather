import type { NextApiRequest, NextApiResponse } from "next";

type Unpack<T> = T extends NextApiResponse<infer U> ? U : never;
export type ApiData<
  T extends (req: NextApiRequest, res: NextApiResponse<unknown>) => void
> = Unpack<Parameters<T>[1]>;