import { z } from "zod";
import { UserApiResponseSchema } from "./schemas/api.schemas";

export type User = z.infer<typeof UserApiResponseSchema>;
