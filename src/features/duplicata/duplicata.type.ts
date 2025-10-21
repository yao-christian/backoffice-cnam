import { z } from "zod";
import { DuplicataSchema } from "./schemas/api.schemas";

export type Duplicata = z.infer<typeof DuplicataSchema>;
