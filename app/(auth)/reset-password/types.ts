import { z } from "zod";
import { ResetPasswordSchema } from "./schema";

export type ResetPasswordPayload = z.output<typeof ResetPasswordSchema>;
export type ResetPasswordFormInput = z.input<typeof ResetPasswordSchema>;
