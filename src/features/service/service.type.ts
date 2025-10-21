import { z } from "zod";
import { ServiceSchema } from "./schemas/api.schemas";

export type Service = z.infer<typeof ServiceSchema>;
