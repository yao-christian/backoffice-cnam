import { z } from "zod";
import { RoleApiResponseSchema } from "./schemas/api.schemas";
import { RoleDetailsApiResponseSchema } from "./schemas/api-role-details.schema";

export type Role = z.infer<typeof RoleApiResponseSchema>;

export type RoleDetails = z.infer<typeof RoleDetailsApiResponseSchema>;
