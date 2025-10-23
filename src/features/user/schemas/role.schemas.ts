import { z } from "zod";

export const CreateUserSchema = z
  .object({
    lastName: z.string().min(1, "Le nom est requis."),
    firstName: z.string().min(1, "Le prénom est requis."),
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères.")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
        "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial.",
      ),
    passwordConfirmation: z
      .string()
      .min(8, "La confirmation du mot de passe est requise."),
    status: z.number().optional().default(1),
    phone: z
      .string()
      .min(8, "Le numéro de téléphone est requis.")
      .regex(/^\d+$/, "Le téléphone doit contenir uniquement des chiffres."),
    email: z.string().email("L'adresse email n'est pas valide."),
    roleId: z.string().uuid("L'identifiant du rôle est invalide."),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["passwordConfirmation"],
  });

export type CreateUserInput = z.infer<typeof CreateUserSchema>;

export const UpdateUserSchema = z.object({
  uuid: z.string().nullable().optional(),
  lastName: z.string().min(1, "Le nom est requis."),
  firstName: z.string().min(1, "Le prénom est requis."),
  email: z.string().email("L'adresse email n'est pas valide."),
  phone: z
    .string()
    .min(8, "Le numéro de téléphone est requis.")
    .regex(/^\d+$/, "Le téléphone doit contenir uniquement des chiffres."),
  roleId: z.string().uuid("L'identifiant du rôle est invalide."),
  status: z.boolean().default(true),
});

export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
