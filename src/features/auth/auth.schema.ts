import { z } from "zod";

export const CredentialsSchema = z.object({
  email: z
    .string({ required_error: "Email obligatoire" })
    .min(1, "Email obligatoire")
    .email("Email incorrect"),
  password: z
    .string({ required_error: "Mot de passe obligatoire" })
    .min(1, "Mot de passe obligatoire")
    .min(8, "Le mot de passe doit contenir plus de 8 caractères")
    .max(32, "Le mot de passe doit contenir moins de 32 caractères"),
});

export const LoginResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresAt: z.number(),
  user: z.object({
    id: z.string(),
    lastName: z.string(),
    firstName: z.string().nullable(),
    email: z.string().email(),
    phoneNumber: z.string(),
    photo: z.string().nullable(), // Peut être null
    emailVerified: z.string().nullable(),
    role: z.object({
      name: z.string(),
      code: z.string(),
    }),
  }),
});

export const AuthSessionSchema = z.object({
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    image: z.string().nullable().optional(),
    phoneNumber: z.string().nullable().optional(),
    emailVerified: z.boolean(),
    role: z.object({
      name: z.string(),
      code: z.string(),
    }),
  }),
});
