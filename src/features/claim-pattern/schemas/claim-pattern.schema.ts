import { z } from "zod";

export const CLAIM_PATTERN_STATUS_VALUES = [0, 1, 2, 3, 7] as const;

export const CreateClaimPatternSchema = z.object({
  label: z.string().min(1, "Le libellé est requis."),
  status: z
    .number({
      required_error: "Le statut est requis.",
      invalid_type_error: "Le statut doit être un entier.",
    })
    .int("Le statut doit être un entier.")
    .refine((v) => CLAIM_PATTERN_STATUS_VALUES.includes(v as any), {
      message: "Statut invalide (attendu: 0, 1, 2, 3 ou 7).",
    }),
});

export const UpdateClaimPatternSchema = z.object({
  id: z.number().optional().nullable(),
  label: z.string().min(1, "Le libellé est requis."),
  status: z
    .number({
      required_error: "Le statut est requis.",
      invalid_type_error: "Le statut doit être un entier.",
    })
    .int("Le statut doit être un entier.")
    .refine((v) => CLAIM_PATTERN_STATUS_VALUES.includes(v as any), {
      message: "Statut invalide (attendu: 0, 1, 2, 3 ou 7).",
    }),
});

export type CreateClaimPatternInput = z.infer<typeof CreateClaimPatternSchema>;

export type UpdateClaimPatternInput = z.infer<typeof UpdateClaimPatternSchema>;
