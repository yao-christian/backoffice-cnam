import { z } from "zod";
import { ClaimPatternApiResponseSchema } from "./schemas/api.schemas";

export type ClaimPattern = z.infer<typeof ClaimPatternApiResponseSchema>;
