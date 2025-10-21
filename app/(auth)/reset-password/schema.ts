import { z } from "zod";

export const ResetPasswordSchema = z.object({
  email: z
    .string({ required_error: "Email obligatoire" })
    .min(1, "Email obligatoire")
    .email("Email incorrect"),
});
