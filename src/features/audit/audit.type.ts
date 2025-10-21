import { z } from "zod";
import { AuditApiResponseSchema } from "./schemas/api.schemas";

export type Audit = z.infer<typeof AuditApiResponseSchema>;
