import { z } from "zod";
import { ClaimApiResponseSchema } from "./schemas/api.schemas";

export type Claim = z.infer<typeof ClaimApiResponseSchema>;
