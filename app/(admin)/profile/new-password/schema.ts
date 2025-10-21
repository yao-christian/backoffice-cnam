import { z } from "zod";

export const NewPasswordSchema = z
  .object({
    otp: z
      .string()
      .length(4, { message: "Le code OTP doit contenir 4 chiffres" })
      .regex(/^\d+$/, {
        message: "Le code OTP ne doit contenir que des chiffres",
      }),
    password: z
      .string({ required_error: "Mot de passe obligatoire" })
      .min(1, "Mot de passe obligatoire")
      .min(8, "Le mot de passe doit contenir plus de 8 caractères")
      .max(32, "Le mot de passe doit contenir moins de 32 caractères"),
    confirmPassword: z
      .string({ required_error: "Confirmation du mot de passe obligatoire" })
      .min(1, "Confirmation du mot de passe obligatoire"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Les mots de passe ne correspondent pas",
  });
