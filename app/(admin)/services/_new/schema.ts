import { z } from "zod";

const Base = z.object({
  name: z.string().min(1, "Le nom du service est requis."),
});

export const CreateServiceFormSchema = z.discriminatedUnion("prepaid", [
  Base.extend({
    prepaid: z.literal(false),
    prepaidServiceName: z.string().optional(),
    apiKey: z.string().optional(),
    apiSecret: z.string().optional(),
  }),
  Base.extend({
    prepaid: z.literal(true),
    prepaidServiceName: z
      .string()
      .min(1, "Le nom du service prépayé est requis."),
    apiKey: z.string().min(1, "L'API key est requise."),
    apiSecret: z.string().min(1, "L'API secret est requis."),
  }),
]);

export type CreateServiceFormType = z.infer<typeof CreateServiceFormSchema>;
