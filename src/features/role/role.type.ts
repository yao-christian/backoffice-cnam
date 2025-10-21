import { z } from "zod";
import { RoleApiResponseSchema } from "./schemas/api.schemas";

export type Role = z.infer<typeof RoleApiResponseSchema>;
